import { DataSource, Repository, SelectQueryBuilder, In, Between, MoreThan, LessThan } from 'typeorm';
import { Logger } from '../../../infrastructure/logging/Logger';
import { DatifyyCuratedDates } from '../../../models/entities/DatifyyCuratedDates';
import { DatifyyCuratedDateFeedback } from '../../../models/entities/DatifyyCuratedDateFeedback';
import { DatifyyUserTrustScores } from '../../../models/entities/DatifyyUserTrustScores';
import { DatifyyDateSeries } from '../../../models/entities/DatifyyDateSeries';
import { DatifyyCurationWorkflow } from '../../../models/entities/DatifyyCurationWorkflow';
import { 
  CreateCuratedDateRequest,
  UpdateCuratedDateRequest,
  GetUserDatesRequest,
  AdminGetDatesRequest,
  SearchPotentialMatchesRequest,
  CuratedDateStatus,
  DateMode
} from '@datifyy/shared-types';

export interface IDateCurationRepository {
  // Curated Dates CRUD
  createCuratedDate(data: CreateCuratedDateRequest, curatedBy: number): Promise<DatifyyCuratedDates>;
  updateCuratedDate(id: number, data: UpdateCuratedDateRequest, updatedBy: number): Promise<DatifyyCuratedDates>;
  getCuratedDateById(id: number, includeRelations?: boolean): Promise<DatifyyCuratedDates | null>;
  deleteCuratedDate(id: number): Promise<void>;
  
  // User Date Queries
  getUserDates(userId: number, filters: GetUserDatesRequest): Promise<{ dates: DatifyyCuratedDates[]; total: number }>;
  getUserDateById(userId: number, dateId: number): Promise<DatifyyCuratedDates | null>;
  
  // Admin Date Queries
  getAdminCuratedDates(filters: AdminGetDatesRequest): Promise<{ dates: DatifyyCuratedDates[]; total: number }>;
  searchPotentialMatches(filters: SearchPotentialMatchesRequest): Promise<{ users: any[]; total: number }>;
  
  // Date Status Management
  confirmDate(dateId: number, userId: number): Promise<DatifyyCuratedDates>;
  cancelDate(dateId: number, userId: number, reason: string, category: string): Promise<DatifyyCuratedDates>;
  markDateCompleted(dateId: number, actualDuration?: number): Promise<DatifyyCuratedDates>;
  
  // Feedback Management
  createDateFeedback(feedback: any): Promise<DatifyyCuratedDateFeedback>;
  getDateFeedback(dateId: number, userId: number): Promise<DatifyyCuratedDateFeedback | null>;
  updateDateFeedback(feedbackId: number, data: any): Promise<DatifyyCuratedDateFeedback>;
  
  // Trust Score Management
  getUserTrustScore(userId: number): Promise<DatifyyUserTrustScores | null>;
  updateUserTrustScore(userId: number, data: any): Promise<DatifyyUserTrustScores>;
  calculateTrustScore(userId: number): Promise<DatifyyUserTrustScores>;
  
  // Date Series Management
  getOrCreateDateSeries(user1Id: number, user2Id: number): Promise<DatifyyDateSeries>;
  getDateSeriesById(seriesId: string): Promise<DatifyyDateSeries | null>;
  updateDateSeries(seriesId: string, data: any): Promise<DatifyyDateSeries>;
  getUserDateSeries(userId: number): Promise<DatifyyDateSeries[]>;
  
  // Analytics
  getDateCurationAnalytics(startDate?: Date, endDate?: Date): Promise<any>;
  getDashboardStats(): Promise<any>;
  
  // Utility Methods
  checkDateConflicts(user1Id: number, user2Id: number, dateTime: Date, duration: number): Promise<DatifyyCuratedDates[]>;
  getUpcomingDatesForReminders(): Promise<DatifyyCuratedDates[]>;
}

export class DateCurationRepository implements IDateCurationRepository {
  private curatedDatesRepo: Repository<DatifyyCuratedDates>;
  private feedbackRepo: Repository<DatifyyCuratedDateFeedback>;
  private trustScoreRepo: Repository<DatifyyUserTrustScores>;
  private dateSeriesRepo: Repository<DatifyyDateSeries>;
  private workflowRepo: Repository<DatifyyCurationWorkflow>;

  constructor(
    private readonly dataSource: DataSource,
    private readonly logger: Logger
  ) {
    this.curatedDatesRepo = this.dataSource.getRepository(DatifyyCuratedDates);
    this.feedbackRepo = this.dataSource.getRepository(DatifyyCuratedDateFeedback);
    this.trustScoreRepo = this.dataSource.getRepository(DatifyyUserTrustScores);
    this.dateSeriesRepo = this.dataSource.getRepository(DatifyyDateSeries);
    this.workflowRepo = this.dataSource.getRepository(DatifyyCurationWorkflow);
  }

  async createCuratedDate(data: CreateCuratedDateRequest, curatedBy: number): Promise<DatifyyCuratedDates> {
    this.logger.info('Creating curated date', { user1Id: data.user1Id, user2Id: data.user2Id, curatedBy });

    const curatedDate = this.curatedDatesRepo.create({
      user1Id: data.user1Id,
      user2Id: data.user2Id,
      dateTime: new Date(data.dateTime),
      durationMinutes: data.durationMinutes || 60,
      mode: data.mode,
      locationName: data.locationName,
      locationAddress: data.locationAddress,
      locationCoordinates: data.locationCoordinates,
      meetingLink: data.meetingLink,
      meetingId: data.meetingId,
      meetingPassword: data.meetingPassword,
      adminNotes: data.adminNotes,
      specialInstructions: data.specialInstructions,
      dressCode: data.dressCode,
      suggestedConversationTopics: data.suggestedConversationTopics,
      compatibilityScore: data.compatibilityScore,
      matchReason: data.matchReason,
      algorithmConfidence: data.algorithmConfidence?.toString(),
      tokensCostUser1: data.tokensCostUser1 || 0,
      tokensCostUser2: data.tokensCostUser2 || 0,
      curatedBy,
      status: CuratedDateStatus.PENDING
    });

    const savedDate = await this.curatedDatesRepo.save(curatedDate);
    
    // Create or update date series
    await this.getOrCreateDateSeries(data.user1Id, data.user2Id);
    
    this.logger.info('Curated date created successfully', { dateId: savedDate.id });
    return savedDate;
  }

  async updateCuratedDate(id: number, data: UpdateCuratedDateRequest, updatedBy: number): Promise<DatifyyCuratedDates> {
    this.logger.info('Updating curated date', { dateId: id, updatedBy });

    const existingDate = await this.getCuratedDateById(id);
    if (!existingDate) {
      throw new Error('Curated date not found');
    }

    const updateData: Partial<DatifyyCuratedDates> = {
      ...data,
      updatedBy,
      updatedAt: new Date()
    };

    if (data.dateTime) {
      updateData.dateTime = new Date(data.dateTime);
    }

    await this.curatedDatesRepo.update(id, updateData);
    
    const updatedDate = await this.getCuratedDateById(id, true);
    this.logger.info('Curated date updated successfully', { dateId: id });
    
    return updatedDate!;
  }

  async getCuratedDateById(id: number, includeRelations = false): Promise<DatifyyCuratedDates | null> {
    const query = this.curatedDatesRepo.createQueryBuilder('date');
    
    if (includeRelations) {
      query
        .leftJoinAndSelect('date.user1', 'user1')
        .leftJoinAndSelect('date.user2', 'user2')
        .leftJoinAndSelect('date.curator', 'curator')
        .leftJoinAndSelect('date.feedback', 'feedback')
        .leftJoinAndSelect('date.dateSeries', 'series');
    }
    
    return query.where('date.id = :id', { id }).getOne();
  }

  async deleteCuratedDate(id: number): Promise<void> {
    this.logger.info('Deleting curated date', { dateId: id });
    
    await this.curatedDatesRepo.delete(id);
    
    this.logger.info('Curated date deleted successfully', { dateId: id });
  }

  async getUserDates(userId: number, filters: GetUserDatesRequest): Promise<{ dates: DatifyyCuratedDates[]; total: number }> {
    this.logger.info('Getting user dates', { userId, filters });

    const query = this.curatedDatesRepo.createQueryBuilder('date')
      .leftJoinAndSelect('date.user1', 'user1')
      .leftJoinAndSelect('date.user2', 'user2')
      .where('(date.user1Id = :userId OR date.user2Id = :userId)', { userId });

    if (filters.status && filters.status.length > 0) {
      query.andWhere('date.status IN (:...statuses)', { statuses: filters.status });
    }

    if (filters.mode && filters.mode.length > 0) {
      query.andWhere('date.mode IN (:...modes)', { modes: filters.mode });
    }

    if (filters.startDate) {
      query.andWhere('date.dateTime >= :startDate', { startDate: new Date(filters.startDate) });
    }

    if (filters.endDate) {
      query.andWhere('date.dateTime <= :endDate', { endDate: new Date(filters.endDate) });
    }

    if (filters.includeFeedback) {
      query.leftJoinAndSelect('date.feedback', 'feedback');
    }

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    query
      .orderBy('date.dateTime', 'DESC')
      .skip(skip)
      .take(limit);

    const [dates, total] = await query.getManyAndCount();

    return { dates, total };
  }

  async getUserDateById(userId: number, dateId: number): Promise<DatifyyCuratedDates | null> {
    return this.curatedDatesRepo.createQueryBuilder('date')
      .leftJoinAndSelect('date.user1', 'user1')
      .leftJoinAndSelect('date.user2', 'user2')
      .leftJoinAndSelect('date.feedback', 'feedback')
      .leftJoinAndSelect('date.dateSeries', 'series')
      .where('date.id = :dateId', { dateId })
      .andWhere('(date.user1Id = :userId OR date.user2Id = :userId)', { userId })
      .getOne();
  }

  async getAdminCuratedDates(filters: AdminGetDatesRequest): Promise<{ dates: DatifyyCuratedDates[]; total: number }> {
    this.logger.info('Getting admin curated dates', { filters });

    const query = this.curatedDatesRepo.createQueryBuilder('date')
      .leftJoinAndSelect('date.user1', 'user1')
      .leftJoinAndSelect('date.user2', 'user2')
      .leftJoinAndSelect('date.curator', 'curator');

    if (filters.status && filters.status.length > 0) {
      query.andWhere('date.status IN (:...statuses)', { statuses: filters.status });
    }

    if (filters.curatedBy) {
      query.andWhere('date.curatedBy = :curatedBy', { curatedBy: filters.curatedBy });
    }

    if (filters.user1Id) {
      query.andWhere('date.user1Id = :user1Id', { user1Id: filters.user1Id });
    }

    if (filters.user2Id) {
      query.andWhere('date.user2Id = :user2Id', { user2Id: filters.user2Id });
    }

    if (filters.startDate) {
      query.andWhere('date.dateTime >= :startDate', { startDate: new Date(filters.startDate) });
    }

    if (filters.endDate) {
      query.andWhere('date.dateTime <= :endDate', { endDate: new Date(filters.endDate) });
    }

    if (filters.includeFeedback) {
      query.leftJoinAndSelect('date.feedback', 'feedback');
    }

    if (filters.includeWorkflow) {
      query.leftJoinAndSelect('date.workflowSteps', 'workflow');
    }

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    query
      .orderBy('date.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    const [dates, total] = await query.getManyAndCount();

    return { dates, total };
  }

  async searchPotentialMatches(filters: SearchPotentialMatchesRequest): Promise<{ users: any[]; total: number }> {
    this.logger.info('Searching potential matches', { filters });

    // This is a complex query that would need to join with user profiles, 
    // partner preferences, and calculate compatibility scores
    // For now, returning a basic structure
    
    const query = this.dataSource.createQueryBuilder()
      .select([
        'u.id',
        'ui.firstName',
        'ui.lastName',
        'ui.images',
        'ui.bio',
        'ui.currentCity'
      ])
      .from('datifyy_users_login', 'u')
      .innerJoin('datifyy_users_information', 'ui', 'ui.user_login_id = u.id')
      .where('u.id != :userId', { userId: filters.userId })
      .andWhere('u.isactive = true')
      .andWhere('ui.is_deleted = false');

    // Add age range filter if specified
    if (filters.ageRange) {
      const currentYear = new Date().getFullYear();
      const maxBirthYear = currentYear - filters.ageRange.min;
      const minBirthYear = currentYear - filters.ageRange.max;
      
      query.andWhere('EXTRACT(YEAR FROM ui.dob) BETWEEN :minBirthYear AND :maxBirthYear', {
        minBirthYear,
        maxBirthYear
      });
    }

    // Exclude users with recent dates if specified
    if (filters.excludeRecentDates) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      query.andWhere(`u.id NOT IN (
        SELECT CASE 
          WHEN cd.user1_id = :userId THEN cd.user2_id 
          ELSE cd.user1_id 
        END
        FROM datifyy_curated_dates cd 
        WHERE (cd.user1_id = :userId OR cd.user2_id = :userId) 
        AND cd.date_time >= :thirtyDaysAgo
      )`, { userId: filters.userId, thirtyDaysAgo });
    }

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    query
      .orderBy('u.created_at', 'DESC')
      .offset(skip)
      .limit(limit);

    const users = await query.getRawMany();
    
    // For total count, we'd need a separate count query
    const total = users.length; // Simplified for now

    return { users, total };
  }

  async confirmDate(dateId: number, userId: number): Promise<DatifyyCuratedDates> {
    this.logger.info('Confirming date', { dateId, userId });

    const date = await this.getCuratedDateById(dateId);
    if (!date) {
      throw new Error('Date not found');
    }

    const updateData: Partial<DatifyyCuratedDates> = {};
    
    if (date.user1Id === userId) {
      updateData.user1ConfirmedAt = new Date();
      if (date.user2ConfirmedAt) {
        updateData.status = CuratedDateStatus.BOTH_CONFIRMED;
      } else {
        updateData.status = CuratedDateStatus.USER1_CONFIRMED;
      }
    } else if (date.user2Id === userId) {
      updateData.user2ConfirmedAt = new Date();
      if (date.user1ConfirmedAt) {
        updateData.status = CuratedDateStatus.BOTH_CONFIRMED;
      } else {
        updateData.status = CuratedDateStatus.USER2_CONFIRMED;
      }
    } else {
      throw new Error('User not authorized to confirm this date');
    }

    await this.curatedDatesRepo.update(dateId, updateData);
    
    return this.getCuratedDateById(dateId, true)!;
  }

  async cancelDate(dateId: number, userId: number, reason: string, category: string): Promise<DatifyyCuratedDates> {
    this.logger.info('Cancelling date', { dateId, userId, category });

    const date = await this.getCuratedDateById(dateId);
    if (!date) {
      throw new Error('Date not found');
    }

    if (date.user1Id !== userId && date.user2Id !== userId) {
      throw new Error('User not authorized to cancel this date');
    }

    const updateData: Partial<DatifyyCuratedDates> = {
      status: CuratedDateStatus.CANCELLED,
      cancelledByUser: userId,
      cancelledAt: new Date(),
      cancellationReason: reason,
      cancellationCategory: category
    };

    await this.curatedDatesRepo.update(dateId, updateData);
    
    return this.getCuratedDateById(dateId, true)!;
  }

  async markDateCompleted(dateId: number, actualDuration?: number): Promise<DatifyyCuratedDates> {
    this.logger.info('Marking date as completed', { dateId, actualDuration });

    const updateData: Partial<DatifyyCuratedDates> = {
      status: CuratedDateStatus.COMPLETED,
      completedAt: new Date(),
      actualDurationMinutes: actualDuration
    };

    await this.curatedDatesRepo.update(dateId, updateData);
    
    return this.getCuratedDateById(dateId, true)!;
  }

  async createDateFeedback(feedback: any): Promise<DatifyyCuratedDateFeedback> {
    this.logger.info('Creating date feedback', { dateId: feedback.curatedDateId, userId: feedback.userId });

    const newFeedback = this.feedbackRepo.create(feedback);
    return this.feedbackRepo.save(newFeedback);
  }

  async getDateFeedback(dateId: number, userId: number): Promise<DatifyyCuratedDateFeedback | null> {
    return this.feedbackRepo.findOne({
      where: {
        curatedDateId: dateId,
        userId: userId
      }
    });
  }

  async updateDateFeedback(feedbackId: number, data: any): Promise<DatifyyCuratedDateFeedback> {
    await this.feedbackRepo.update(feedbackId, data);
    return this.feedbackRepo.findOne({ where: { id: feedbackId } })!;
  }

  async getUserTrustScore(userId: number): Promise<DatifyyUserTrustScores | null> {
    return this.trustScoreRepo.findOne({
      where: { userId }
    });
  }

  async updateUserTrustScore(userId: number, data: any): Promise<DatifyyUserTrustScores> {
    await this.trustScoreRepo.upsert({ userId, ...data }, ['userId']);
    return this.getUserTrustScore(userId)!;
  }

  async calculateTrustScore(userId: number): Promise<DatifyyUserTrustScores> {
    this.logger.info('Calculating trust score', { userId });

    // Get user's date statistics
    const dateStats = await this.curatedDatesRepo.createQueryBuilder('date')
      .select([
        'COUNT(CASE WHEN date.status = :completed THEN 1 END) as completed',
        'COUNT(CASE WHEN date.status = :cancelled THEN 1 END) as cancelled',
        'COUNT(CASE WHEN date.status = :noShow THEN 1 END) as noShow'
      ])
      .where('(date.user1Id = :userId OR date.user2Id = :userId)', { userId })
      .setParameters({
        completed: CuratedDateStatus.COMPLETED,
        cancelled: CuratedDateStatus.CANCELLED,
        noShow: CuratedDateStatus.NO_SHOW
      })
      .getRawOne();

    // Get average feedback rating
    const avgRating = await this.feedbackRepo.createQueryBuilder('feedback')
      .select('AVG(feedback.overallRating)', 'avgRating')
      .innerJoin('feedback.curatedDate', 'date')
      .where('(date.user1Id = :userId OR date.user2Id = :userId)', { userId })
      .andWhere('feedback.userId != :userId', { userId }) // Ratings about this user
      .getRawOne();

    // Calculate scores
    const totalDates = parseInt(dateStats.completed) + parseInt(dateStats.cancelled) + parseInt(dateStats.noShow);
    const attendanceScore = totalDates > 0 ? Math.round((parseInt(dateStats.completed) / totalDates) * 100) : 100;
    const feedbackScore = avgRating.avgRating ? Math.round(avgRating.avgRating * 20) : 100; // Convert 1-5 to 0-100
    
    const overallScore = Math.round((attendanceScore + feedbackScore) / 2);

    const trustScoreData = {
      userId,
      overallScore,
      attendanceScore,
      feedbackScore,
      totalDatesAttended: parseInt(dateStats.completed),
      totalDatesCancelled: parseInt(dateStats.cancelled),
      totalDatesNoShow: parseInt(dateStats.noShow),
      averageRating: avgRating.avgRating || '0.00',
      lastCalculatedAt: new Date(),
      calculationReason: 'Automated calculation'
    };

    return this.updateUserTrustScore(userId, trustScoreData);
  }

  async getOrCreateDateSeries(user1Id: number, user2Id: number): Promise<DatifyyDateSeries> {
    // Ensure consistent ordering (smaller ID first)
    const [smallerId, largerId] = user1Id < user2Id ? [user1Id, user2Id] : [user2Id, user1Id];

    let series = await this.dateSeriesRepo.findOne({
      where: {
        user1Id: smallerId,
        user2Id: largerId
      }
    });

    if (!series) {
      series = this.dateSeriesRepo.create({
        user1Id: smallerId,
        user2Id: largerId,
        seriesStatus: 'active',
        totalDatesInSeries: 0,
        relationshipStage: 'getting_to_know'
      });
      series = await this.dateSeriesRepo.save(series);
    }

    return series;
  }

  async getDateSeriesById(seriesId: string): Promise<DatifyyDateSeries | null> {
    return this.dateSeriesRepo.findOne({
      where: { id: seriesId },
      relations: ['user1', 'user2', 'curatedDates']
    });
  }

  async updateDateSeries(seriesId: string, data: any): Promise<DatifyyDateSeries> {
    await this.dateSeriesRepo.update(seriesId, data);
    return this.getDateSeriesById(seriesId);
  }

  async getUserDateSeries(userId: number): Promise<DatifyyDateSeries[]> {
    return this.dateSeriesRepo.find({
      where: [
        { user1Id: userId },
        { user2Id: userId }
      ],
      relations: ['user1', 'user2', 'curatedDates'],
      order: { lastDateAt: 'DESC' }
    });
  }

  async getDateCurationAnalytics(startDate?: Date, endDate?: Date): Promise<any> {
    this.logger.info('Getting date curation analytics', { startDate, endDate });

    const query = this.curatedDatesRepo.createQueryBuilder('date');

    if (startDate) {
      query.andWhere('date.createdAt >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('date.createdAt <= :endDate', { endDate });
    }

    const analytics = await query
      .select([
        'COUNT(*) as totalDates',
        'COUNT(CASE WHEN date.status = :completed THEN 1 END) as completedDates',
        'COUNT(CASE WHEN date.status = :cancelled THEN 1 END) as cancelledDates',
        'AVG(CASE WHEN date.status = :completed THEN date.actualDurationMinutes END) as avgDuration'
      ])
      .setParameters({
        completed: CuratedDateStatus.COMPLETED,
        cancelled: CuratedDateStatus.CANCELLED
      })
      .getRawOne();

    // Get average rating from feedback
    const feedbackQuery = this.feedbackRepo.createQueryBuilder('feedback')
      .innerJoin('feedback.curatedDate', 'date');

    if (startDate) {
      feedbackQuery.andWhere('date.createdAt >= :startDate', { startDate });
    }

    if (endDate) {
      feedbackQuery.andWhere('date.createdAt <= :endDate', { endDate });
    }

    const feedbackStats = await feedbackQuery
      .select('AVG(feedback.overallRating)', 'avgRating')
      .getRawOne();

    return {
      summary: {
        totalDatesCreated: parseInt(analytics.totalDates),
        totalDatesCompleted: parseInt(analytics.completedDates),
        totalDatesCancelled: parseInt(analytics.cancelledDates),
        completionRate: analytics.totalDates > 0 ? (analytics.completedDates / analytics.totalDates) * 100 : 0,
        averageRating: feedbackStats.avgRating || 0,
        averageDuration: analytics.avgDuration || 0
      }
    };
  }

  async getDashboardStats(): Promise<any> {
    this.logger.info('Getting dashboard stats');

    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get recent stats
    const recentStats = await this.curatedDatesRepo.createQueryBuilder('date')
      .select([
        'COUNT(*) as totalRecent',
        'COUNT(CASE WHEN date.status = :pending THEN 1 END) as pendingDates',
        'COUNT(CASE WHEN date.dateTime > NOW() THEN 1 END) as upcomingDates'
      ])
      .where('date.createdAt >= :thirtyDaysAgo', { thirtyDaysAgo })
      .setParameters({
        pending: CuratedDateStatus.PENDING
      })
      .getRawOne();

    return {
      recentDatesCreated: parseInt(recentStats.totalRecent),
      pendingConfirmations: parseInt(recentStats.pendingDates),
      upcomingDates: parseInt(recentStats.upcomingDates),
      lastUpdated: new Date().toISOString()
    };
  }

  async checkDateConflicts(user1Id: number, user2Id: number, dateTime: Date, duration: number): Promise<DatifyyCuratedDates[]> {
    const endTime = new Date(dateTime.getTime() + duration * 60 * 1000);

    return this.curatedDatesRepo.createQueryBuilder('date')
      .where('(date.user1Id = :user1Id OR date.user2Id = :user1Id OR date.user1Id = :user2Id OR date.user2Id = :user2Id)', 
        { user1Id, user2Id })
      .andWhere('date.status != :cancelled', { cancelled: CuratedDateStatus.CANCELLED })
      .andWhere('(date.dateTime BETWEEN :startTime AND :endTime OR :dateTime BETWEEN date.dateTime AND (date.dateTime + INTERVAL \'1 minute\' * date.durationMinutes))', 
        { startTime: dateTime, endTime, dateTime })
      .getMany();
  }

  async getUpcomingDatesForReminders(): Promise<DatifyyCuratedDates[]> {
    const now = new Date();
    const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    return this.curatedDatesRepo.find({
      where: [
        {
          dateTime: Between(now, twentyFourHoursFromNow),
          status: CuratedDateStatus.BOTH_CONFIRMED,
          reminderSent_24h: false
        },
        {
          dateTime: Between(now, twoHoursFromNow),
          status: CuratedDateStatus.BOTH_CONFIRMED,
          reminderSent_24h: false
        }
      ],
      relations: ['user1', 'user2']
    });
  }
}
