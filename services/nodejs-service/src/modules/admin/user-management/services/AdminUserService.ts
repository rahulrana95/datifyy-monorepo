import { DataSource } from 'typeorm';
import { Logger } from '../../../../infrastructure/logging/Logger';
import { 
  AdminUserRepository,
  AdminUserTrustScoreRepository,
  AdminUserStatsRepository 
} from '../repositories';
import { AdminUserValidationService } from './AdminUserValidationService';
import { 
  GetUsersRequestDto,
  UpdateUserStatusRequestDto,
  VerifyUserRequestDto,
  AdminUserListResponseDto,
  AdminUserDetailResponseDto,
  AccountStatusFilter,
  VerificationStatusFilter,
  UserSortField,
  VerificationType
} from '../dtos';
import { 
  UserRepositoryFilters,
  UserQueryFilters,
  PaginationOptions,
  UserSortOptions 
} from '../types/RepositoryTypes';

export class AdminUserService {
  private userRepository: AdminUserRepository;
  private trustScoreRepository: AdminUserTrustScoreRepository;
  private statsRepository: AdminUserStatsRepository;
  private validationService: AdminUserValidationService;

  constructor(
    private dataSource: DataSource,
    private logger: Logger
  ) {
    this.userRepository = new AdminUserRepository(dataSource, logger);
    this.trustScoreRepository = new AdminUserTrustScoreRepository(dataSource, logger);
    this.statsRepository = new AdminUserStatsRepository(dataSource, logger);
    this.validationService = new AdminUserValidationService(
      this.userRepository,
      this.trustScoreRepository,
      logger
    );
  }

  async getUsers(filters: GetUsersRequestDto, adminId: number): Promise<AdminUserListResponseDto> {
    try {
      this.logger.info('Getting users list', { filters, adminId });

      // Transform DTO to repository filters
      const repositoryFilters = this.transformToRepositoryFilters(filters);

      // Get users and total count
      const { users, total } = await this.userRepository.findUsersWithFilters(repositoryFilters);

      // Calculate metadata
      const metadata = await this.calculateListMetadata(repositoryFilters, total);

      // Build pagination response
      const pagination = {
        page: filters.page || 1,
        limit: filters.limit || 20,
        total,
        totalPages: Math.ceil(total / (filters.limit || 20)),
        hasNext: (filters.page || 1) * (filters.limit || 20) < total,
        hasPrevious: (filters.page || 1) > 1
      };

      return {
        success: true,
        message: 'Users retrieved successfully',
        data: {
          data: users,
          pagination,
          metadata
        },
        metadata: {
          requestId: this.generateRequestId(),
          timestamp: new Date().toISOString(),
          processingTime: 0 // Would be calculated in middleware
        }
      };
    } catch (error) {
      this.logger.error('Error getting users list', { error, filters, adminId });
      throw error;
    }
  }

  async getUserById(userId: number, adminId: number): Promise<AdminUserDetailResponseDto> {
    try {
      this.logger.info('Getting user details', { userId, adminId });

      // Get user profile
      const profile = await this.userRepository.findUserById(userId);
      if (!profile) {
        return {
          success: false,
          message: 'User not found',
          error: {
            code: 'USER_NOT_FOUND',
            message: 'The requested user could not be found'
          },
          metadata: {
            requestId: this.generateRequestId(),
            timestamp: new Date().toISOString()
          }
        };
      }

      // Get trust score
      const trustScore = await this.trustScoreRepository.findTrustScoreByUserId(userId);
      // if (!trustScore) {
      //   throw new Error('Trust score not found for user');
      // }

      // Get date history
      const dateHistory = await this.userRepository.getUserDateHistory(userId);

      // Get partner preferences (would need separate repository method)
      const partnerPreferences = await this.getUserPartnerPreferences(userId);

      // Get activity logs (would need separate repository method)
      const activityLogs = await this.getUserActivityLogs(userId);

      // Calculate risk assessment
      const riskAssessment = this.calculateRiskAssessment(profile, trustScore, dateHistory);

      // Calculate profile completeness
      const profileCompleteness = this.calculateProfileCompleteness(profile);

      const userData = {
        profile,
        trustScore: null,
        dateHistory,
        partnerPreferences,
        activityLogs,
        riskAssessment,
        profileCompleteness
      };

      return {
        success: true,
        message: 'User details retrieved successfully',
        // @ts-ignore
        data: userData,
        metadata: {
          requestId: this.generateRequestId(),
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      this.logger.error('Error getting user details', { error, userId, adminId });
      throw error;
    }
  }

  async updateUserStatus(
    userId: number,
    statusUpdate: UpdateUserStatusRequestDto,
    adminId: number
  ): Promise<{ success: boolean; message: string; user?: any }> {
    try {
      this.logger.info('Updating user status', { userId, statusUpdate, adminId });

      // Validate the status change
      const validation = await this.validationService.validateUserStatusChange(
        userId,
        statusUpdate.accountStatus,
        adminId
      );

      if (!validation.isValid) {
        return {
          success: false,
          message: `Validation failed: ${validation.errors.join(', ')}`
        };
      }

      // Update user status
      const updateResult = await this.userRepository.updateUserAccountStatus(
        userId,
        statusUpdate.accountStatus,
        adminId,
        statusUpdate.reason
      );

      if (!updateResult.success) {
        return {
          success: false,
          message: 'Failed to update user status'
        };
      }

      // Handle specific status changes
      await this.handleStatusChangeEffects(userId, statusUpdate.accountStatus, adminId);

      // Get updated user for response
      const updatedUser = await this.userRepository.findUserById(userId);

      return {
        success: true,
        message: 'User status updated successfully',
        user: updatedUser
      };
    } catch (error) {
      this.logger.error('Error updating user status', { error, userId, statusUpdate, adminId });
      throw error;
    }
  }

  async verifyUser(
    userId: number,
    verification: VerifyUserRequestDto,
    adminId: number
  ): Promise<{ success: boolean; message: string; user?: any }> {
    try {
      this.logger.info('Verifying user', { userId, verification, adminId });

      // Validate the verification
      const validation = await this.validationService.validateUserVerification(
        userId,
        verification.verificationType,
        verification.isVerified
      );

      if (!validation.isValid) {
        return {
          success: false,
          message: `Validation failed: ${validation.errors.join(', ')}`
        };
      }

      // Update verification status (would need repository method)
      await this.updateUserVerificationStatus(userId, verification, adminId);

      // Handle verification effects
      await this.handleVerificationEffects(userId, verification, adminId);

      // Get updated user
      const updatedUser = await this.userRepository.findUserById(userId);

      return {
        success: true,
        message: 'User verification updated successfully',
        user: updatedUser
      };
    } catch (error) {
      this.logger.error('Error verifying user', { error, userId, verification, adminId });
      throw error;
    }
  }

  async searchUsers(
    query: string,
    adminId: number,
    limit = 10
  ): Promise<{ users: any[]; total: number }> {
    try {
      this.logger.info('Searching users', { query, adminId, limit });

      const filters: UserRepositoryFilters = {
        search: query,
        pagination: { page: 1, limit, offset: 0 },
        sort: { field: 'createdAt', order: 'DESC' }
      };

      return await this.userRepository.findUsersWithFilters(filters);
    } catch (error) {
      this.logger.error('Error searching users', { error, query, adminId });
      throw error;
    }
  }

  async getUsersByFilter(
    filterType: 'lowTrustScore' | 'onProbation' | 'unverified' | 'inactive',
    adminId: number,
    limit = 50
  ): Promise<any[]> {
    try {
      this.logger.info('Getting users by filter', { filterType, adminId, limit });

      switch (filterType) {
        case 'lowTrustScore':
          return await this.trustScoreRepository.getUsersWithLowTrustScores(50);
        case 'onProbation':
          return await this.trustScoreRepository.getUsersOnProbation();
        case 'unverified':
          return await this.getUsersUnverified(limit);
        case 'inactive':
          return await this.getUsersInactive(limit);
        default:
          throw new Error(`Unknown filter type: ${filterType}`);
      }
    } catch (error) {
      this.logger.error('Error getting users by filter', { error, filterType, adminId });
      throw error;
    }
  }

  private transformToRepositoryFilters(dto: GetUsersRequestDto): UserRepositoryFilters {
    const filters: UserQueryFilters = {
      search: dto.search,
      accountStatus: dto.accountStatus,
      gender: dto.gender,
      verificationStatus: dto.verificationStatus,
      city: dto.city,
      country: dto.country,
      minTrustScore: dto.minTrustScore,
      maxTrustScore: dto.maxTrustScore,
      isOnProbation: dto.isOnProbation,
      minDatesAttended: dto.minDatesAttended,
      maxDatesAttended: dto.maxDatesAttended,
      hasProfileIssues: dto.hasProfileIssues
    };

    // Convert date strings to Date objects
    if (dto.createdAfter) {
      filters.createdAfter = new Date(dto.createdAfter);
    }
    if (dto.createdBefore) {
      filters.createdBefore = new Date(dto.createdBefore);
    }
    if (dto.lastActiveAfter) {
      filters.lastActiveAfter = new Date(dto.lastActiveAfter);
    }
    if (dto.lastActiveBefore) {
      filters.lastActiveBefore = new Date(dto.lastActiveBefore);
    }

    const pagination: PaginationOptions = {
      page: dto.page || 1,
      limit: dto.limit || 20,
      offset: ((dto.page || 1) - 1) * (dto.limit || 20)
    };

    const sort: UserSortOptions = {
      field: dto.sortBy || UserSortField.CREATED_AT,
      order: dto.sortOrder || 'DESC'
    };

    return { ...filters, pagination, sort };
  }

  private async calculateListMetadata(filters: UserRepositoryFilters, total: number) {
    // Calculate various statistics for the filtered dataset
    // This would involve additional queries based on the applied filters
    
    return {
      totalUsers: total,
      activeUsers: 0, // Would calculate based on filters
      suspendedUsers: 0,
      unverifiedUsers: 0,
      usersOnProbation: 0,
      averageTrustScore: 0,
      appliedFilters: {
        accountStatus: filters.accountStatus,
        gender: filters.gender,
        verificationStatus: filters.verificationStatus,
        city: filters.city,
        country: filters.country,
        trustScoreRange: filters.minTrustScore || filters.maxTrustScore ? {
          min: filters.minTrustScore || 0,
          max: filters.maxTrustScore || 100
        } : undefined,
        isOnProbation: filters.isOnProbation,
        hasProfileIssues: filters.hasProfileIssues
      }
    };
  }

  private async getUserPartnerPreferences(userId: number) {
    // Would implement repository method to get partner preferences
    return {
      genderPreference: null,
      ageRange: { min: null, max: null },
      heightRange: { min: null, max: null },
      locationPreference: null,
      educationLevel: null,
      profession: null,
      incomeRange: { min: null, max: null, currency: null },
      smokingPreference: null,
      drinkingPreference: null,
      religionPreference: null,
      relationshipGoals: null,
      lifestyle: null
    };
  }

  private async getUserActivityLogs(userId: number) {
    // Would implement repository method to get activity logs
    return {
      recentLogins: [],
      profileUpdates: [],
      adminActions: []
    };
  }

  private calculateRiskAssessment(profile: any, trustScore: any, dateHistory: any) {
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    const riskFactors: string[] = [];
    const recommendations: string[] = [];

    if (!trustScore) {
      return {
        riskLevel,
      riskFactors,
      recommendations
      }
    }

    // Assess trust score
    if (trustScore.overallScore < 30) {
      riskLevel = 'HIGH';
      riskFactors.push('Very low trust score');
      recommendations.push('Consider probation or account review');
    } else if (trustScore.overallScore < 60) {
      riskLevel = 'MEDIUM';
      riskFactors.push('Below average trust score');
      recommendations.push('Monitor user behavior closely');
    }

    // Assess cancellation pattern
    if (dateHistory.cancelledDates > dateHistory.completedDates && dateHistory.totalDates > 3) {
      riskLevel = 'HIGH';
      riskFactors.push('High cancellation rate');
      recommendations.push('Review cancellation patterns and reasons');
    }

    // Assess verification status
    if (!profile.isOfficialEmailVerified || !profile.isPhoneVerified) {
      riskFactors.push('Incomplete verification');
      recommendations.push('Complete user verification process');
    }

    return {
      riskLevel,
      riskFactors,
      recommendations
    };
  }

  private calculateProfileCompleteness(profile: any) {
    const requiredFields = [
      'firstName', 'lastName', 'bio', 'images', 'dateOfBirth', 
      'gender', 'currentCity', 'exercise', 'educationLevel'
    ];
    
    const completedFields = requiredFields.filter(field => 
      profile[field] !== null && profile[field] !== undefined && profile[field] !== ''
    ).length;

    const score = Math.round((completedFields / requiredFields.length) * 100);
    
    const missingFields = requiredFields.filter(field => 
      profile[field] === null || profile[field] === undefined || profile[field] === ''
    );

    return {
      score,
      missingFields,
      recommendations: missingFields.length > 0 ? 
        ['Complete missing profile fields to improve user experience'] : 
        ['Profile is complete']
    };
  }

  private async handleStatusChangeEffects(
    userId: number,
    newStatus: AccountStatusFilter,
    adminId: number
  ): Promise<void> {
    // Handle side effects of status changes
    switch (newStatus) {
      case AccountStatusFilter.SUSPENDED:
        // Cancel upcoming dates, send notifications, etc.
        break;
      case AccountStatusFilter.DEACTIVATED:
        // Similar to suspended but different messaging
        break;
      case AccountStatusFilter.ACTIVE:
        // Restore access, send welcome back notification
        break;
    }
  }

  private async updateUserVerificationStatus(
    userId: number,
    verification: VerifyUserRequestDto,
    adminId: number
  ): Promise<void> {
    // Would implement actual database update for verification status
    this.logger.info('Updating verification status', { userId, verification, adminId });
  }

  private async handleVerificationEffects(
    userId: number,
    verification: VerifyUserRequestDto,
    adminId: number
  ): Promise<void> {
    // Handle side effects of verification changes
    if (verification.isVerified) {
      // Send verification confirmation, update trust score, etc.
    } else {
      // Send notification about verification removal, restrict features
    }
  }

  private async getUsersUnverified(limit: number): Promise<any[]> {
    const filters: UserRepositoryFilters = {
      verificationStatus: VerificationStatusFilter.UNVERIFIED,
      pagination: { page: 1, limit, offset: 0 },
      sort: { field: 'createdAt', order: 'DESC' }
    };

    const { users } = await this.userRepository.findUsersWithFilters(filters);
    return users;
  }

  private async getUsersInactive(limit: number): Promise<any[]> {
    const filters: UserRepositoryFilters = {
      lastActiveBefore: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      pagination: { page: 1, limit, offset: 0 },
      sort: { field: 'lastActiveAt', order: 'ASC' }
    };

    const { users } = await this.userRepository.findUsersWithFilters(filters);
    return users;
  }

  private generateRequestId(): string {
    return `admin-user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}