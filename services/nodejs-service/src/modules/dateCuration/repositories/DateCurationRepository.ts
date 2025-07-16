// services/nodejs-service/src/modules/dateCuration/repositories/DateCurationRepository.ts
import {
  DataSource,
  Repository,
  SelectQueryBuilder,
  In,
  Between,
  MoreThan,
  LessThan,
} from "typeorm";
import { Logger } from "../../../infrastructure/logging/Logger";
import { DatifyyCuratedDates } from "../../../models/entities/DatifyyCuratedDates";
import { DatifyyCuratedDateFeedback } from "../../../models/entities/DatifyyCuratedDateFeedback";
import { DatifyyUserTrustScores } from "../../../models/entities/DatifyyUserTrustScores";
import { DatifyyDateSeries } from "../../../models/entities/DatifyyDateSeries";
import { DatifyyCurationWorkflow } from "../../../models/entities/DatifyyCurationWorkflow";
import { DatifyyUsersLogin } from "../../../models/entities/DatifyyUsersLogin";
import { DatifyyUsersInformation } from "../../../models/entities/DatifyyUsersInformation";
import {
  CuratedDateStatus,
  DateMode,
} from "../../../proto-types/dating";

// Custom interfaces to match the existing repository implementation
export interface CreateCuratedDateRequest {
  user1Id: number;
  user2Id: number;
  dateTime: string;
  durationMinutes?: number;
  mode: DateMode;
  locationName?: string;
  locationAddress?: string;
  locationCoordinates?: any;
  meetingLink?: string;
  meetingId?: string;
  meetingPassword?: string;
  adminNotes?: string;
  specialInstructions?: string;
  dressCode?: string;
  suggestedConversationTopics?: string[];
  compatibilityScore?: number;
  matchReason?: string;
  algorithmConfidence?: number;
  tokensCostUser1?: number;
  tokensCostUser2?: number;
}

export interface UpdateCuratedDateRequest {
  dateTime?: string;
  durationMinutes?: number;
  mode?: DateMode;
  locationName?: string;
  locationAddress?: string;
  locationCoordinates?: any;
  meetingLink?: string;
  meetingId?: string;
  meetingPassword?: string;
  adminNotes?: string;
  specialInstructions?: string;
  dressCode?: string;
  suggestedConversationTopics?: string[];
  compatibilityScore?: number;
  matchReason?: string;
  algorithmConfidence?: number;
  tokensCostUser1?: number;
  tokensCostUser2?: number;
}

export interface GetUserDatesRequest {
  page?: number;
  limit?: number;
  status?: CuratedDateStatus[];
  mode?: DateMode[];
  startDate?: string;
  endDate?: string;
  includeHistory?: boolean;
  includeFeedback?: boolean;
  includePartnerInfo?: boolean;
}

export interface AdminGetDatesRequest {
  page?: number;
  limit?: number;
  status?: CuratedDateStatus[];
  curatedBy?: number;
  user1Id?: number;
  user2Id?: number;
  startDate?: string;
  endDate?: string;
  includeFeedback?: boolean;
  includeWorkflow?: boolean;
}

export interface SearchPotentialMatchesRequest {
  userId: number;
  page?: number;
  limit?: number;
  ageRange?: { min: number; max: number };
  excludeRecentDates?: boolean;
}

export interface IDateCurationRepository {
  // Curated Dates CRUD
  createCuratedDate(
    data: CreateCuratedDateRequest,
    curatedBy: number
  ): Promise<DatifyyCuratedDates>;
  updateCuratedDate(
    id: number,
    data: UpdateCuratedDateRequest,
    updatedBy: number
  ): Promise<DatifyyCuratedDates>;
  getCuratedDateById(
    id: number,
    includeRelations?: boolean
  ): Promise<DatifyyCuratedDates | null>;
  deleteCuratedDate(id: number): Promise<void>;

  // User Date Queries
  getUserDates(
    userId: number,
    filters: GetUserDatesRequest
  ): Promise<{ dates: DatifyyCuratedDates[]; total: number }>;
  getUserDateById(
    userId: number,
    dateId: number
  ): Promise<DatifyyCuratedDates | null>;

  // Admin Date Queries
  getAdminCuratedDates(
    filters: AdminGetDatesRequest
  ): Promise<{ dates: DatifyyCuratedDates[]; total: number }>;
  searchPotentialMatches(
    filters: SearchPotentialMatchesRequest
  ): Promise<{ users: any[]; total: number }>;

  // Date Status Management
  confirmDate(dateId: number, userId: number): Promise<DatifyyCuratedDates>;
  cancelDate(
    dateId: number,
    userId: number,
    reason: string,
    category: string
  ): Promise<DatifyyCuratedDates>;
  markDateCompleted(
    dateId: number,
    actualDuration?: number
  ): Promise<DatifyyCuratedDates>;

  // Feedback Management
  createDateFeedback(feedback: any): Promise<DatifyyCuratedDateFeedback>;
  getDateFeedback(
    dateId: number,
    userId: number
  ): Promise<DatifyyCuratedDateFeedback | null>;
  updateDateFeedback(
    feedbackId: number,
    data: any
  ): Promise<DatifyyCuratedDateFeedback>;

  // Trust Score Management
  getUserTrustScore(userId: number): Promise<DatifyyUserTrustScores | null>;
  updateUserTrustScore(
    userId: number,
    data: any
  ): Promise<DatifyyUserTrustScores>;
  calculateTrustScore(userId: number): Promise<DatifyyUserTrustScores>;

  // Date Series Management
  getOrCreateDateSeries(
    user1Id: number,
    user2Id: number
  ): Promise<DatifyyDateSeries>;
  getDateSeriesById(seriesId: string): Promise<DatifyyDateSeries | null>;
  updateDateSeries(seriesId: string, data: any): Promise<DatifyyDateSeries>;
  getUserDateSeries(userId: number): Promise<DatifyyDateSeries[]>;

  // Analytics
  getDateCurationAnalytics(startDate?: Date, endDate?: Date): Promise<any>;
  getDashboardStats(): Promise<any>;

  // Utility Methods
  checkDateConflicts(
    user1Id: number,
    user2Id: number,
    dateTime: Date,
    duration: number
  ): Promise<DatifyyCuratedDates[]>;
  getUpcomingDatesForReminders(): Promise<DatifyyCuratedDates[]>;
}

export class DateCurationRepository implements IDateCurationRepository {
  private curatedDatesRepo: Repository<DatifyyCuratedDates>;
  private feedbackRepo: Repository<DatifyyCuratedDateFeedback>;
  private trustScoreRepo: Repository<DatifyyUserTrustScores>;
  private dateSeriesRepo: Repository<DatifyyDateSeries>;
  private workflowRepo: Repository<DatifyyCurationWorkflow>;
  private usersRepo: Repository<DatifyyUsersLogin>;
  private usersInfoRepo: Repository<DatifyyUsersInformation>;

  constructor(
    private readonly dataSource: DataSource,
    private readonly logger: Logger
  ) {
    this.curatedDatesRepo = this.dataSource.getRepository(DatifyyCuratedDates);
    this.feedbackRepo = this.dataSource.getRepository(
      DatifyyCuratedDateFeedback
    );
    this.trustScoreRepo = this.dataSource.getRepository(DatifyyUserTrustScores);
    this.dateSeriesRepo = this.dataSource.getRepository(DatifyyDateSeries);
    this.workflowRepo = this.dataSource.getRepository(DatifyyCurationWorkflow);
    this.usersRepo = this.dataSource.getRepository(DatifyyUsersLogin);
    this.usersInfoRepo = this.dataSource.getRepository(DatifyyUsersInformation);
  }

  async createCuratedDate(
    data: CreateCuratedDateRequest,
    curatedBy: number
  ): Promise<DatifyyCuratedDates> {
    this.logger.info("Creating curated date", {
      user1Id: data.user1Id,
      user2Id: data.user2Id,
      curatedBy,
    });

    // First, get the admin user to set as relation
    const adminUser = await this.usersRepo.findOne({
      where: { id: curatedBy },
    });
    if (!adminUser) {
      throw new Error(`Admin user with ID ${curatedBy} not found`);
    }

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
      status: CuratedDateStatus.CURATED_DATE_STATUS_PENDING,
      // Set the relation object instead of ID
      curatedBy: adminUser,
    });

    const savedDate = await this.curatedDatesRepo.save(curatedDate);

    // Create or update date series
    await this.getOrCreateDateSeries(data.user1Id, data.user2Id);

    this.logger.info("Curated date created successfully", {
      dateId: savedDate.id,
    });
    return savedDate;
  }

  async updateCuratedDate(
    id: number,
    data: UpdateCuratedDateRequest,
    updatedBy: number
  ): Promise<DatifyyCuratedDates> {
    this.logger.info("Updating curated date", { dateId: id, updatedBy });

    const existingDate = await this.getCuratedDateById(id);
    if (!existingDate) {
      throw new Error("Curated date not found");
    }

    // Get the admin user for the relation
    const adminUser = await this.usersRepo.findOne({
      where: { id: updatedBy },
    });
    if (!adminUser) {
      throw new Error(`Admin user with ID ${updatedBy} not found`);
    }

    const updateData: Partial<DatifyyCuratedDates> = {
      updatedBy: adminUser,
      updatedAt: new Date(),
    };

    // Map UpdateCuratedDateRequest fields to entity fields
    if (data.dateTime) updateData.dateTime = new Date(data.dateTime);
    if (data.locationName) updateData.locationName = data.locationName;
    if (data.locationAddress) updateData.locationAddress = data.locationAddress;
    if (data.durationMinutes) updateData.durationMinutes = data.durationMinutes;
    if (data.specialInstructions) updateData.specialInstructions = data.specialInstructions;


    await this.curatedDatesRepo.save({ ...existingDate, ...updateData });

    const updatedDate = await this.getCuratedDateById(id, true);
    this.logger.info("Curated date updated successfully", { dateId: id });

    return updatedDate!;
  }

  async getCuratedDateById(
    id: number,
    includeRelations = false
  ): Promise<DatifyyCuratedDates | null> {
    const query = this.curatedDatesRepo.createQueryBuilder("date");

    if (includeRelations) {
      query
        .leftJoinAndSelect("date.user1", "user1")
        .leftJoinAndSelect("date.user2", "user2")
        .leftJoinAndSelect("date.curatedBy", "curatedByUser")
        .leftJoinAndSelect("date.cancelledByUser", "cancelledByUser")
        .leftJoinAndSelect("date.updatedBy", "updatedByUser")
        .leftJoinAndSelect("date.datifyyCuratedDateFeedbacks", "feedbacks")
        .leftJoinAndSelect("date.datifyyCurationWorkflows", "workflows");
    }

    return query.where("date.id = :id", { id }).getOne();
  }

  async deleteCuratedDate(id: number): Promise<void> {
    this.logger.info("Deleting curated date", { dateId: id });

    await this.curatedDatesRepo.delete(id);

    this.logger.info("Curated date deleted successfully", { dateId: id });
  }

  async getUserDates(
    userId: number,
    filters: GetUserDatesRequest
  ): Promise<{ dates: DatifyyCuratedDates[]; total: number }> {
    this.logger.info("Getting user dates", { userId, filters });

    const query = this.curatedDatesRepo
      .createQueryBuilder("date")
      .leftJoinAndSelect("date.user1", "user1")
      .leftJoinAndSelect("date.user2", "user2")
      .where("(date.user1Id = :userId OR date.user2Id = :userId)", { userId });

    if (filters.status && filters.status.length > 0) {
      query.andWhere("date.status IN (:...statuses)", {
        statuses: filters.status,
      });
    }

    if (filters.mode && filters.mode.length > 0) {
      query.andWhere("date.mode IN (:...modes)", { modes: filters.mode });
    }

    if (filters.startDate) {
      query.andWhere("date.dateTime >= :startDate", {
        startDate: new Date(filters.startDate),
      });
    }

    if (filters.endDate) {
      query.andWhere("date.dateTime <= :endDate", {
        endDate: new Date(filters.endDate),
      });
    }

    if (filters.includeFeedback) {
      query.leftJoinAndSelect("date.datifyyCuratedDateFeedbacks", "feedback");
    }

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    query.orderBy("date.dateTime", "DESC").skip(skip).take(limit);

    const [dates, total] = await query.getManyAndCount();

    return { dates, total };
  }

  async getUserDateById(
    userId: number,
    dateId: number
  ): Promise<DatifyyCuratedDates | null> {
    return this.curatedDatesRepo
      .createQueryBuilder("date")
      .leftJoinAndSelect("date.user1", "user1")
      .leftJoinAndSelect("date.user2", "user2")
      .leftJoinAndSelect("date.datifyyCuratedDateFeedbacks", "feedback")
      .where("date.id = :dateId", { dateId })
      .andWhere("(date.user1Id = :userId OR date.user2Id = :userId)", {
        userId,
      })
      .getOne();
  }

  async getAdminCuratedDates(
    filters: AdminGetDatesRequest
  ): Promise<{ dates: DatifyyCuratedDates[]; total: number }> {
    this.logger.info("Getting admin curated dates", { filters });

    const query = this.curatedDatesRepo
      .createQueryBuilder("date")
      .leftJoinAndSelect("date.user1", "user1")
      .leftJoinAndSelect("date.user2", "user2")
      .leftJoinAndSelect("date.curatedBy", "curatedByUser");

    if (filters.status && filters.status.length > 0) {
      query.andWhere("date.status IN (:...statuses)", {
        statuses: filters.status,
      });
    }

    if (filters.curatedBy) {
      query.andWhere("curatedByUser.id = :curatedBy", {
        curatedBy: filters.curatedBy,
      });
    }

    if (filters.user1Id) {
      query.andWhere("date.user1Id = :user1Id", { user1Id: filters.user1Id });
    }

    if (filters.user2Id) {
      query.andWhere("date.user2Id = :user2Id", { user2Id: filters.user2Id });
    }

    if (filters.startDate) {
      query.andWhere("date.dateTime >= :startDate", {
        startDate: new Date(filters.startDate),
      });
    }

    if (filters.endDate) {
      query.andWhere("date.dateTime <= :endDate", {
        endDate: new Date(filters.endDate),
      });
    }

    if (filters.includeFeedback) {
      query.leftJoinAndSelect("date.datifyyCuratedDateFeedbacks", "feedbacks");
    }

    if (filters.includeWorkflow) {
      query.leftJoinAndSelect("date.datifyyCurationWorkflows", "workflows");
    }

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    query.orderBy("date.curatedAt", "DESC").skip(skip).take(limit);

    const [dates, total] = await query.getManyAndCount();

    return { dates, total };
  }

  async searchPotentialMatches(
    filters: SearchPotentialMatchesRequest
  ): Promise<{ users: any[]; total: number }> {
    this.logger.info("Searching potential matches", { filters });

    const query = this.usersInfoRepo
      .createQueryBuilder("ui")
      .select([
        "ui.id",
        "ui.firstName",
        "ui.lastName",
        "ui.images",
        "ui.bio",
        "ui.currentCity",
        "ui.dob",
        "ul.id",
        "ul.email",
      ])
      .innerJoin("ui.userLogin", "ul")
      .where("ul.id != :userId", { userId: filters.userId })
      .andWhere("ul.isactive = true")
      .andWhere("ui.isDeleted = false");

    // Add age range filter if specified
    if (filters.ageRange) {
      const currentDate = new Date();
      const maxDate = new Date(
        currentDate.getFullYear() - filters.ageRange.min,
        currentDate.getMonth(),
        currentDate.getDate()
      );
      const minDate = new Date(
        currentDate.getFullYear() - filters.ageRange.max,
        currentDate.getMonth(),
        currentDate.getDate()
      );

      query.andWhere("ui.dob BETWEEN :minDate AND :maxDate", {
        minDate: minDate.toISOString().split("T")[0],
        maxDate: maxDate.toISOString().split("T")[0],
      });
    }

    // Exclude users with recent dates if specified
    if (filters.excludeRecentDates) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      query.andWhere(
        `ul.id NOT IN (
        SELECT CASE 
          WHEN cd.user1Id = :userId THEN cd.user2Id 
          ELSE cd.user1Id 
        END
        FROM datifyy_curated_dates cd 
        WHERE (cd.user1Id = :userId OR cd.user2Id = :userId) 
        AND cd.dateTime >= :thirtyDaysAgo
      )`,
        { userId: filters.userId, thirtyDaysAgo }
      );
    }

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    query.orderBy("ul.createdAt", "DESC").skip(skip).take(limit);

    const [users, total] = await query.getManyAndCount();

    return { users, total };
  }

  async confirmDate(
    dateId: number,
    userId: number
  ): Promise<DatifyyCuratedDates> {
    this.logger.info("Confirming date", { dateId, userId });

    const date = await this.getCuratedDateById(dateId);
    if (!date) {
      throw new Error("Date not found");
    }

    const updateData: Partial<DatifyyCuratedDates> = {};

    if (date.user1Id === userId) {
      updateData.user1ConfirmedAt = new Date();
      if (date.user2ConfirmedAt) {
        updateData.status = CuratedDateStatus.CURATED_DATE_STATUS_CONFIRMED;
      } else {
        updateData.status = CuratedDateStatus.CURATED_DATE_STATUS_CONFIRMED;
      }
    } else if (date.user2Id === userId) {
      updateData.user2ConfirmedAt = new Date();
      if (date.user1ConfirmedAt) {
        updateData.status = CuratedDateStatus.CURATED_DATE_STATUS_CONFIRMED;
      } else {
        updateData.status = CuratedDateStatus.CURATED_DATE_STATUS_CONFIRMED;
      }
    } else {
      throw new Error("User not authorized to confirm this date");
    }

    await this.curatedDatesRepo.update(dateId, updateData);

    const updatedDate = await this.getCuratedDateById(dateId, true);
    return updatedDate!;
  }

  async cancelDate(
    dateId: number,
    userId: number,
    reason: string,
    category: string
  ): Promise<DatifyyCuratedDates> {
    this.logger.info("Cancelling date", { dateId, userId, category });

    const date = await this.getCuratedDateById(dateId);
    if (!date) {
      throw new Error("Date not found");
    }

    if (date.user1Id !== userId && date.user2Id !== userId) {
      throw new Error("User not authorized to cancel this date");
    }

    const updateData: Partial<DatifyyCuratedDates> = {
      status: CuratedDateStatus.CURATED_DATE_STATUS_CANCELLED,
      cancelledAt: new Date(),
      cancellationReason: reason,
      cancellationCategory: category,
    };

    await this.curatedDatesRepo.update(dateId, updateData);

    const updatedDate = await this.getCuratedDateById(dateId, true);
    return updatedDate!;
  }

  async markDateCompleted(
    dateId: number,
    actualDuration?: number
  ): Promise<DatifyyCuratedDates> {
    this.logger.info("Marking date as completed", { dateId, actualDuration });

    const updateData: Partial<DatifyyCuratedDates> = {
      status: CuratedDateStatus.CURATED_DATE_STATUS_COMPLETED,
      completedAt: new Date(),
      actualDurationMinutes: actualDuration,
    };

    await this.curatedDatesRepo.update(dateId, updateData);

    const updatedDate = await this.getCuratedDateById(dateId, true);
    return updatedDate!;
  }

  async createDateFeedback(
    feedback: Partial<DatifyyCuratedDateFeedback>
  ): Promise<DatifyyCuratedDateFeedback> {
    this.logger.info("Creating date feedback", {
      dateId: feedback.curatedDateId,
      userId: feedback.userId,
    });

    // Insert and get the inserted ID
    const result = await this.feedbackRepo.insert(feedback);
    const insertedId = result.identifiers[0].id;

    // Fetch and return the complete entity
    const savedFeedback = await this.feedbackRepo.findOne({
      where: { id: insertedId },
    });

    if (!savedFeedback) {
      throw new Error("Failed to create feedback");
    }

    return savedFeedback;
  }

  async getDateFeedback(
    dateId: number,
    userId: number
  ): Promise<DatifyyCuratedDateFeedback | null> {
    return this.feedbackRepo.findOne({
      where: {
        curatedDateId: dateId,
        userId: userId,
      },
    });
  }

  async updateDateFeedback(
    feedbackId: number,
    data: any
  ): Promise<DatifyyCuratedDateFeedback> {
    await this.feedbackRepo.update(feedbackId, data);
    const updatedFeedback = await this.feedbackRepo.findOne({
      where: { id: feedbackId },
    });
    if (!updatedFeedback) {
      throw new Error("Feedback not found after update");
    }
    return updatedFeedback;
  }

  async getUserTrustScore(
    userId: number
  ): Promise<DatifyyUserTrustScores | null> {
    return this.trustScoreRepo.findOne({
      where: { userId },
    });
  }

  async updateUserTrustScore(
    userId: number,
    data: any
  ): Promise<DatifyyUserTrustScores> {
    // Use upsert to handle both insert and update
    await this.trustScoreRepo.upsert({ userId, ...data }, ["userId"]);
    const trustScore = await this.getUserTrustScore(userId);
    if (!trustScore) {
      throw new Error("Trust score not found after upsert");
    }
    return trustScore;
  }

  async calculateTrustScore(userId: number): Promise<DatifyyUserTrustScores> {
    this.logger.info("Calculating trust score", { userId });

    // Get user's date statistics
    const dateStats = await this.curatedDatesRepo
      .createQueryBuilder("date")
      .select([
        "COUNT(CASE WHEN date.status = :completed THEN 1 END) as completed",
        "COUNT(CASE WHEN date.status = :cancelled THEN 1 END) as cancelled",
        "COUNT(CASE WHEN date.status = :noShow THEN 1 END) as noShow",
      ])
      .where("(date.user1Id = :userId OR date.user2Id = :userId)", { userId })
      .setParameters({
        completed: CuratedDateStatus.CURATED_DATE_STATUS_COMPLETED,
        cancelled: CuratedDateStatus.CURATED_DATE_STATUS_CANCELLED,
        noShow: CuratedDateStatus.CURATED_DATE_STATUS_NO_SHOW,
      })
      .getRawOne();

    // Get average feedback rating
    const avgRating = await this.feedbackRepo
      .createQueryBuilder("feedback")
      .select("AVG(feedback.overallRating)", "avgRating")
      .innerJoin("feedback.curatedDate", "date")
      .where("(date.user1Id = :userId OR date.user2Id = :userId)", { userId })
      .andWhere("feedback.userId != :userId", { userId }) // Ratings about this user
      .getRawOne();

    // Calculate scores
    const totalDates =
      parseInt(dateStats.completed || "0") +
      parseInt(dateStats.cancelled || "0") +
      parseInt(dateStats.noShow || "0");
    const attendanceScore =
      totalDates > 0
        ? Math.round((parseInt(dateStats.completed || "0") / totalDates) * 100)
        : 100;
    const feedbackScore = avgRating.avgRating
      ? Math.round(avgRating.avgRating * 20)
      : 100; // Convert 1-5 to 0-100

    const overallScore = Math.round((attendanceScore + feedbackScore) / 2);

    const trustScoreData = {
      userId,
      overallScore,
      attendanceScore,
      feedbackScore,
      totalDatesAttended: parseInt(dateStats.completed || "0"),
      totalDatesCancelled: parseInt(dateStats.cancelled || "0"),
      totalDatesNoShow: parseInt(dateStats.noShow || "0"),
      averageRating: avgRating.avgRating || "0.00",
      lastCalculatedAt: new Date(),
      calculationReason: "Automated calculation",
    };

    return this.updateUserTrustScore(userId, trustScoreData);
  }

  async getOrCreateDateSeries(
    user1Id: number,
    user2Id: number
  ): Promise<DatifyyDateSeries> {
    // Ensure consistent ordering (smaller ID first)
    const [smallerId, largerId] =
      user1Id < user2Id ? [user1Id, user2Id] : [user2Id, user1Id];

    let series = await this.dateSeriesRepo.findOne({
      where: {
        user1Id: smallerId,
        user2Id: largerId,
      },
    });

    if (!series) {
      series = this.dateSeriesRepo.create({
        user1Id: smallerId,
        user2Id: largerId,
        seriesStatus: "active",
        totalDatesInSeries: 0,
        relationshipStage: "getting_to_know",
      });
      series = await this.dateSeriesRepo.save(series);
    }

    return series;
  }

  async getDateSeriesById(seriesId: string): Promise<DatifyyDateSeries | null> {
    return this.dateSeriesRepo.findOne({
      where: { id: seriesId },
      relations: ["user1", "user2", "endedByUser"],
    });
  }

  async updateDateSeries(
    seriesId: string,
    data: any
  ): Promise<DatifyyDateSeries> {
    await this.dateSeriesRepo.update(seriesId, data);
    const updatedSeries = await this.getDateSeriesById(seriesId);
    if (!updatedSeries) {
      throw new Error("Date series not found after update");
    }
    return updatedSeries;
  }

  async getUserDateSeries(userId: number): Promise<DatifyyDateSeries[]> {
    return this.dateSeriesRepo.find({
      where: [{ user1Id: userId }, { user2Id: userId }],
      relations: ["user1", "user2", "endedByUser"],
      order: { lastDateAt: "DESC" },
    });
  }

  async getDateCurationAnalytics(
    startDate?: Date,
    endDate?: Date
  ): Promise<any> {
    this.logger.info("Getting date curation analytics", { startDate, endDate });

    const query = this.curatedDatesRepo.createQueryBuilder("date");

    if (startDate) {
      query.andWhere("date.curatedAt >= :startDate", { startDate });
    }

    if (endDate) {
      query.andWhere("date.curatedAt <= :endDate", { endDate });
    }

    const analytics = await query
      .select([
        "COUNT(*) as totalDates",
        "COUNT(CASE WHEN date.status = :completed THEN 1 END) as completedDates",
        "COUNT(CASE WHEN date.status = :cancelled THEN 1 END) as cancelledDates",
        "AVG(CASE WHEN date.status = :completed THEN date.actualDurationMinutes END) as avgDuration",
      ])
      .setParameters({
        completed: CuratedDateStatus.CURATED_DATE_STATUS_COMPLETED,
        cancelled: CuratedDateStatus.CURATED_DATE_STATUS_CANCELLED,
      })
      .getRawOne();

    // Get average rating from feedback
    const feedbackQuery = this.feedbackRepo
      .createQueryBuilder("feedback")
      .innerJoin("feedback.curatedDate", "date");

    if (startDate) {
      feedbackQuery.andWhere("date.curatedAt >= :startDate", { startDate });
    }

    if (endDate) {
      feedbackQuery.andWhere("date.curatedAt <= :endDate", { endDate });
    }

    const feedbackStats = await feedbackQuery
      .select("AVG(feedback.overallRating)", "avgRating")
      .getRawOne();

    return {
      summary: {
        totalDatesCreated: parseInt(analytics.totalDates || "0"),
        totalDatesCompleted: parseInt(analytics.completedDates || "0"),
        totalDatesCancelled: parseInt(analytics.cancelledDates || "0"),
        completionRate:
          analytics.totalDates > 0
            ? (analytics.completedDates / analytics.totalDates) * 100
            : 0,
        averageRating: feedbackStats.avgRating || 0,
        averageDuration: analytics.avgDuration || 0,
      },
    };
  }

  async getDashboardStats(): Promise<any> {
    this.logger.info("Getting dashboard stats");

    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get recent stats
    const recentStats = await this.curatedDatesRepo
      .createQueryBuilder("date")
      .select([
        "COUNT(*) as totalRecent",
        "COUNT(CASE WHEN date.status = :pending THEN 1 END) as pendingDates",
        "COUNT(CASE WHEN date.dateTime > NOW() THEN 1 END) as upcomingDates",
      ])
      .where("date.curatedAt >= :thirtyDaysAgo", { thirtyDaysAgo })
      .setParameters({
        pending: CuratedDateStatus.CURATED_DATE_STATUS_PENDING,
      })
      .getRawOne();

    return {
      recentDatesCreated: parseInt(recentStats.totalRecent || "0"),
      pendingConfirmations: parseInt(recentStats.pendingDates || "0"),
      upcomingDates: parseInt(recentStats.upcomingDates || "0"),
      lastUpdated: new Date().toISOString(),
    };
  }

  async checkDateConflicts(
    user1Id: number,
    user2Id: number,
    dateTime: Date,
    duration: number
  ): Promise<DatifyyCuratedDates[]> {
    const endTime = new Date(dateTime.getTime() + duration * 60 * 1000);

    return this.curatedDatesRepo
      .createQueryBuilder("date")
      .where(
        "(date.user1Id = :user1Id OR date.user2Id = :user1Id OR date.user1Id = :user2Id OR date.user2Id = :user2Id)",
        { user1Id, user2Id }
      )
      .andWhere("date.status != :cancelled", {
        cancelled: CuratedDateStatus.CURATED_DATE_STATUS_CANCELLED,
      })
      .andWhere(
        `(
        date.dateTime BETWEEN :startTime AND :endTime 
        OR :dateTime BETWEEN date.dateTime AND 
        (date.dateTime + INTERVAL '1 minute' * COALESCE(date.durationMinutes, 60))
      )`,
        { startTime: dateTime, endTime, dateTime }
      )
      .getMany();
  }

  async getUpcomingDatesForReminders(): Promise<DatifyyCuratedDates[]> {
    const now = new Date();
    const twentyFourHoursFromNow = new Date(
      now.getTime() + 24 * 60 * 60 * 1000
    );
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    return this.curatedDatesRepo.find({
      where: [
        {
          dateTime: Between(now, twentyFourHoursFromNow),
          status: CuratedDateStatus.CURATED_DATE_STATUS_CONFIRMED,
          reminderSent_24h: false,
        },
        {
          dateTime: Between(now, twoHoursFromNow),
          status: CuratedDateStatus.CURATED_DATE_STATUS_CONFIRMED,
          reminderSent_2h: false,
        },
      ],
      relations: ["user1", "user2"],
    });
  }
}
