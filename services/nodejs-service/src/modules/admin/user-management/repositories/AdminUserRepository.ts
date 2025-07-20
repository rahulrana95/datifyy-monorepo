import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { DatifyyUsersLogin } from '../../../../models/entities/DatifyyUsersLogin';
import { DatifyyUsersInformation } from '../../../../models/entities/DatifyyUsersInformation';
import { DatifyyUserTrustScores } from '../../../../models/entities/DatifyyUserTrustScores';
import { DatifyyUserPartnerPreferences } from '../../../../models/entities/DatifyyUserPartnerPreferences';
import { Logger } from '../../../../infrastructure/logging/Logger';
import { 
  UserRepositoryFilters, 
  UserQueryFilters, 
  UserUpdateResult,
  PaginationOptions 
} from '../types/RepositoryTypes';
import { 
  AdminUserListItem, 
  AdminUserProfile, 
  AdminUserDateHistory,
  AccountStatusFilter,
  VerificationStatusFilter 
} from '../dtos';

export class AdminUserRepository {
  private userLoginRepo: Repository<DatifyyUsersLogin>;
  private userInfoRepo: Repository<DatifyyUsersInformation>;
  private trustScoreRepo: Repository<DatifyyUserTrustScores>;
  private partnerPrefRepo: Repository<DatifyyUserPartnerPreferences>;

  constructor(
    private dataSource: DataSource,
    private logger: Logger
  ) {
    this.userLoginRepo = dataSource.getRepository(DatifyyUsersLogin);
    this.userInfoRepo = dataSource.getRepository(DatifyyUsersInformation);
    this.trustScoreRepo = dataSource.getRepository(DatifyyUserTrustScores);
    this.partnerPrefRepo = dataSource.getRepository(DatifyyUserPartnerPreferences);
  }

  async findUsersWithFilters(filters: UserRepositoryFilters): Promise<{
    users: AdminUserListItem[];
    total: number;
  }> {
    try {
      this.logger.info('Finding users with filters', { filters });

      const queryBuilder = this.createUserQueryBuilder();
      this.applyFilters(queryBuilder, filters);
      this.applySorting(queryBuilder, filters.sort);

      // Get total count before pagination
      const total = await queryBuilder.getCount();

      // Apply pagination
      queryBuilder
        .skip(filters.pagination.offset)
        .take(filters.pagination.limit);

      const rawResults = await queryBuilder.getRawMany();
      const users = this.mapRawResultsToUserListItems(rawResults);

      return { users, total };
    } catch (error) {
      this.logger.error('Error finding users with filters', { error, filters });
      throw error;
    }
  }

  async findUserById(userId: number): Promise<AdminUserProfile | null> {
    try {
      this.logger.info('Finding user by ID', { userId });

      const queryBuilder = this.userLoginRepo
        .createQueryBuilder('login')
        .leftJoinAndSelect('login.datifyyUsersInformations', 'info')
        .where('login.id = :userId', { userId });

      const user = await queryBuilder.getOne();
      
      if (!user || !user.datifyyUsersInformations?.length) {
        return null;
      }

      return this.mapToAdminUserProfile(user, user.datifyyUsersInformations[0]);
    } catch (error) {
      this.logger.error('Error finding user by ID', { error, userId });
      throw error;
    }
  }

  async updateUserAccountStatus(
    userId: number, 
    accountStatus: AccountStatusFilter, 
    adminId: number,
    reason?: string
  ): Promise<UserUpdateResult> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      this.logger.info('Updating user account status', { 
        userId, 
        accountStatus, 
        adminId, 
        reason 
      });

      // Update account status
      const updateResult = await queryRunner.manager.update(
        DatifyyUsersLogin,
        { id: userId },
        { 
          accountStatus: accountStatus as any,
          updatedAt: new Date()
        }
      );

      // Log admin action
      // Note: This would typically use an AdminActivityLog entity
      // For now, we'll just log it

      await queryRunner.commitTransaction();

      return {
        success: updateResult.affected! > 0,
        affectedRows: updateResult.affected || 0
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Error updating user account status', { 
        error, 
        userId, 
        accountStatus 
      });
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getUserDateHistory(userId: number): Promise<AdminUserDateHistory> {
    try {
      this.logger.info('Getting user date history', { userId });

      // Get date statistics from curated dates
      const dateStatsQuery = `
        SELECT 
          COUNT(*) as total_dates,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_dates,
          COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_dates,
          COUNT(CASE WHEN status = 'no_show' THEN 1 END) as no_show_dates,
          COUNT(CASE WHEN date_time > NOW() THEN 1 END) as upcoming_dates,
          MAX(CASE WHEN status = 'completed' THEN date_time END) as last_date_at,
          MIN(CASE WHEN date_time > NOW() THEN date_time END) as next_date_at
        FROM datifyy_curated_dates 
        WHERE user1_id = $1 OR user2_id = $1
      `;

      const dateStats = await this.dataSource.query(dateStatsQuery, [userId]);
      const stats = dateStats[0];

      // Get recent dates with details
      const recentDatesQuery = `
        SELECT 
          cd.id,
          cd.date_time,
          cd.mode,
          cd.status,
          CASE 
            WHEN cd.user1_id = $1 THEN CONCAT(u2_info.first_name, ' ', u2_info.last_name)
            ELSE CONCAT(u1_info.first_name, ' ', u1_info.last_name)
          END as partner_name,
          feedback.overall_rating,
          feedback.additional_comments as feedback
        FROM datifyy_curated_dates cd
        LEFT JOIN datifyy_users_login u1 ON cd.user1_id = u1.id
        LEFT JOIN datifyy_users_login u2 ON cd.user2_id = u2.id
        LEFT JOIN datifyy_users_information u1_info ON u1.id = u1_info.user_login_id
        LEFT JOIN datifyy_users_information u2_info ON u2.id = u2_info.user_login_id
        LEFT JOIN datifyy_curated_date_feedback feedback ON cd.id = feedback.curated_date_id AND feedback.user_id = $1
        WHERE cd.user1_id = $1 OR cd.user2_id = $1
        ORDER BY cd.date_time DESC
        LIMIT 10
      `;

      const recentDates = await this.dataSource.query(recentDatesQuery, [userId]);

      // Calculate average rating and success rate
      const avgRating = recentDates
        .filter((date: any) => date.overall_rating)
        .reduce((sum: number, date: any) => sum + date.overall_rating, 0) / 
        recentDates.filter((date: any) => date.overall_rating).length || 0;

      const secondDateRate = this.calculateSecondDateRate(recentDates);

      return {
        totalDates: parseInt(stats.total_dates) || 0,
        completedDates: parseInt(stats.completed_dates) || 0,
        cancelledDates: parseInt(stats.cancelled_dates) || 0,
        noShowDates: parseInt(stats.no_show_dates) || 0,
        upcomingDates: parseInt(stats.upcoming_dates) || 0,
        lastDateAt: stats.last_date_at ? new Date(stats.last_date_at) : null,
        nextDateAt: stats.next_date_at ? new Date(stats.next_date_at) : null,
        averageDateRating: avgRating,
        secondDateSuccessRate: secondDateRate,
        recentDates: recentDates.map((date: any) => ({
          id: date.id,
          dateTime: new Date(date.date_time),
          mode: date.mode,
          status: date.status,
          partnerName: date.partner_name,
          rating: date.overall_rating,
          feedback: date.feedback
        }))
      };
    } catch (error) {
      this.logger.error('Error getting user date history', { error, userId });
      throw error;
    }
  }

  private createUserQueryBuilder(): SelectQueryBuilder<DatifyyUsersLogin> {
    return this.userLoginRepo
      .createQueryBuilder('login')
      .leftJoin('login.datifyyUsersInformations', 'info')
      .leftJoin('login.datifyyUserTrustScores2', 'trust')
      .select([
        'login.id',
        'login.email',
        'login.accountStatus',
        'login.permissionLevel', 
        'login.isactive',
        'login.createdAt',
        'login.updatedAt',
        'login.lastActiveAt',
        'login.lastLoginAt',
        'login.loginCount',
        'info.firstName',
        'info.lastName',
        'info.gender',
        'info.currentCity',
        'info.isOfficialEmailVerified',
        'info.isPhoneVerified',
        'info.isAadharVerified',
        'trust.overallScore',
        'trust.attendanceScore',
        'trust.punctualityScore',
        'trust.feedbackScore',
        'trust.warningLevel',
        'trust.isOnProbation',
        'trust.probationUntil',
        'trust.totalDatesAttended',
        'trust.totalDatesCancelled',
        'trust.totalDatesNoShow'
      ]);
  }

  private applyFilters(
    queryBuilder: SelectQueryBuilder<DatifyyUsersLogin>, 
    filters: UserQueryFilters
  ): void {
    if (filters.search) {
      queryBuilder.andWhere(
        '(LOWER(info.firstName) LIKE LOWER(:search) OR LOWER(info.lastName) LIKE LOWER(:search) OR LOWER(login.email) LIKE LOWER(:search))',
        { search: `%${filters.search}%` }
      );
    }

    if (filters.accountStatus) {
      queryBuilder.andWhere('login.accountStatus = :accountStatus', { 
        accountStatus: filters.accountStatus 
      });
    }

    if (filters.gender) {
      queryBuilder.andWhere('info.gender = :gender', { gender: filters.gender });
    }

    if (filters.verificationStatus) {
      this.applyVerificationFilter(queryBuilder, filters.verificationStatus);
    }

    if (filters.city) {
      queryBuilder.andWhere('LOWER(info.currentCity) = LOWER(:city)', { 
        city: filters.city 
      });
    }

    if (filters.minTrustScore !== undefined) {
      queryBuilder.andWhere('trust.overallScore >= :minTrustScore', { 
        minTrustScore: filters.minTrustScore 
      });
    }

    if (filters.maxTrustScore !== undefined) {
      queryBuilder.andWhere('trust.overallScore <= :maxTrustScore', { 
        maxTrustScore: filters.maxTrustScore 
      });
    }

    if (filters.isOnProbation !== undefined) {
      queryBuilder.andWhere('trust.isOnProbation = :isOnProbation', { 
        isOnProbation: filters.isOnProbation 
      });
    }

    if (filters.createdAfter) {
      queryBuilder.andWhere('login.createdAt >= :createdAfter', { 
        createdAfter: filters.createdAfter 
      });
    }

    if (filters.createdBefore) {
      queryBuilder.andWhere('login.createdAt <= :createdBefore', { 
        createdBefore: filters.createdBefore 
      });
    }

    if (filters.lastActiveAfter) {
      queryBuilder.andWhere('login.lastActiveAt >= :lastActiveAfter', { 
        lastActiveAfter: filters.lastActiveAfter 
      });
    }

    if (filters.lastActiveBefore) {
      queryBuilder.andWhere('login.lastActiveAt <= :lastActiveBefore', { 
        lastActiveBefore: filters.lastActiveBefore 
      });
    }

    if (filters.minDatesAttended !== undefined) {
      queryBuilder.andWhere('trust.totalDatesAttended >= :minDatesAttended', { 
        minDatesAttended: filters.minDatesAttended 
      });
    }

    if (filters.maxDatesAttended !== undefined) {
      queryBuilder.andWhere('trust.totalDatesAttended <= :maxDatesAttended', { 
        maxDatesAttended: filters.maxDatesAttended 
      });
    }
  }

  private applyVerificationFilter(
    queryBuilder: SelectQueryBuilder<DatifyyUsersLogin>, 
    verificationStatus: string
  ): void {
    switch (verificationStatus) {
      case VerificationStatusFilter.EMAIL_VERIFIED:
        queryBuilder.andWhere('info.isOfficialEmailVerified = true');
        break;
      case VerificationStatusFilter.PHONE_VERIFIED:
        queryBuilder.andWhere('info.isPhoneVerified = true');
        break;
      case VerificationStatusFilter.ID_VERIFIED:
        queryBuilder.andWhere('info.isAadharVerified = true');
        break;
      case VerificationStatusFilter.ALL_VERIFIED:
        queryBuilder.andWhere(
          'info.isOfficialEmailVerified = true AND info.isPhoneVerified = true AND info.isAadharVerified = true'
        );
        break;
      case VerificationStatusFilter.UNVERIFIED:
        queryBuilder.andWhere(
          'info.isOfficialEmailVerified = false AND info.isPhoneVerified = false AND info.isAadharVerified = false'
        );
        break;
    }
  }

  private applySorting(
    queryBuilder: SelectQueryBuilder<DatifyyUsersLogin>, 
    sort: { field: string; order: 'ASC' | 'DESC' }
  ): void {
    const sortField = this.mapSortField(sort.field);
    queryBuilder.orderBy(sortField, sort.order);
  }

  private mapSortField(field: string): string {
    const fieldMap: Record<string, string> = {
      'createdAt': 'login.createdAt',
      'lastActiveAt': 'login.lastActiveAt',
      'email': 'login.email',
      'overallScore': 'trust.overallScore',
      'totalDatesAttended': 'trust.totalDatesAttended'
    };
    return fieldMap[field] || 'login.createdAt';
  }

  private mapRawResultsToUserListItems(rawResults: any[]): AdminUserListItem[] {
    return rawResults.map(row => ({
      id: row.login_id,
      email: row.login_email,
      firstName: row.info_firstName || '',
      lastName: row.info_lastName || '',
      gender: row.info_gender,
      accountStatus: row.login_accountStatus,
      permissionLevel: row.login_permissionLevel,
      isEmailVerified: row.info_isOfficialEmailVerified || false,
      isPhoneVerified: row.info_isPhoneVerified || false,
      isIdVerified: row.info_isAadharVerified || false,
      currentCity: row.info_currentCity,
      createdAt: row.login_createdAt,
      lastActiveAt: row.login_lastActiveAt,
      lastLoginAt: row.login_lastLoginAt,
      loginCount: row.login_loginCount || 0,
      trustScore: {
        overallScore: row.trust_overallScore || 100,
        attendanceScore: row.trust_attendanceScore || 100,
        punctualityScore: row.trust_punctualityScore || 100,
        feedbackScore: row.trust_feedbackScore || 100,
        warningLevel: row.trust_warningLevel || 0,
        isOnProbation: row.trust_isOnProbation || false,
        probationUntil: row.trust_probationUntil
      },
      dateStats: {
        totalDatesAttended: row.trust_totalDatesAttended || 0,
        totalDatesCancelled: row.trust_totalDatesCancelled || 0,
        totalDatesNoShow: row.trust_totalDatesNoShow || 0,
        lastDateAt: null // Would need separate query
      },
      profileCompleteness: this.calculateProfileCompleteness(row),
      hasProfileIssues: this.checkProfileIssues(row)
    }));
  }

  private mapToAdminUserProfile(
    loginData: DatifyyUsersLogin, 
    infoData: DatifyyUsersInformation
  ): AdminUserProfile {
    const age = infoData.dob ? this.calculateAge(infoData.dob) : null;

    return {
      id: loginData.id,
      email: loginData.email,
      firstName: infoData.firstName,
      lastName: infoData.lastName,
      bio: infoData.bio,
      images: infoData.images,
      dateOfBirth: infoData.dob,
      age,
      gender: infoData.gender,
      height: infoData.height,
      currentCity: infoData.currentCity,
      hometown: infoData.hometown,
      exercise: infoData.exercise,
      educationLevel: infoData.educationLevel,
      drinking: infoData.drinking,
      smoking: infoData.smoking,
      lookingFor: infoData.lookingFor,
      settleDownInMonths: infoData.settleDownInMonths,
      haveKids: infoData.haveKids,
      wantsKids: infoData.wantsKids,
      starSign: infoData.starSign,
      religion: infoData.religion,
      pronoun: infoData.pronoun,
      favInterest: infoData.favInterest,
      causesYouSupport: infoData.causesYouSupport,
      qualityYouValue: infoData.qualityYouValue,
      prompts: infoData.prompts,
      education: infoData.education,
      accountStatus: loginData.accountStatus!,
      permissionLevel: loginData.permissionLevel!,
      isActive: loginData.isactive || false,
      isDeleted: infoData.isDeleted || false,
      isOfficialEmailVerified: infoData.isOfficialEmailVerified || false,
      isAadharVerified: infoData.isAadharVerified || false,
      isPhoneVerified: infoData.isPhoneVerified || false,
      createdAt: loginData.createdAt,
      updatedAt: loginData.updatedAt,
      lastActiveAt: loginData.lastActiveAt,
      lastLoginAt: loginData.lastLoginAt,
      lastLoginIp: loginData.lastLoginIp,
      lastLoginUserAgent: loginData.lastLoginUserAgent,
      loginCount: loginData.loginCount,
      failedLoginAttempts: loginData.failedLoginAttempts,
      lockedAt: loginData.lockedAt,
      lockExpiresAt: loginData.lockExpiresAt
    };
  }

  private calculateAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  private calculateProfileCompleteness(row: any): number {
    const fields = [
      'info_firstName', 'info_lastName', 'info_bio', 'info_images',
      'info_dob', 'info_gender', 'info_currentCity', 'info_exercise',
      'info_educationLevel', 'info_drinking', 'info_smoking'
    ];
    
    const completedFields = fields.filter(field => row[field] !== null && row[field] !== '').length;
    return Math.round((completedFields / fields.length) * 100);
  }

  private checkProfileIssues(row: any): boolean {
    return !row.info_firstName || 
           !row.info_lastName || 
           !row.info_dob || 
           !row.info_gender ||
           !row.info_isOfficialEmailVerified;
  }

  private calculateSecondDateRate(dates: any[]): number {
    // This would require more complex logic to track second dates
    // For now, return a placeholder
    return 0;
  }
}