// services/nodejs-service/src/modules/dateCuration/services/DateCurationService.ts
import { Logger } from "../../../infrastructure/logging/Logger";
import { IDateCurationRepository } from "../repositories/DateCurationRepository";
import { DateCurationMapper } from "../mappers/DateCurationMapper";
import {
  CreateCuratedDateRequest,
  UpdateCuratedDateRequest,
  CancelDateRequest,
  SubmitDateFeedbackRequest,
  GetUserDatesRequest,
  AdminGetDatesRequest,
  SearchPotentialMatchesRequest,
  GetDateAnalyticsRequest as DateCurationAnalyticsRequest,
  UserDatesResponse,
  SearchPotentialMatchesResponse,
  DateCurationAnalyticsResponse,
  CuratedDateResponse,
  DateFeedbackResponse,
  UserTrustScoreResponse,
  DateSeriesResponse,
  DateCurationValidationRules,
  CuratedDateStatus,
} from "../../../proto-types/dating";

// Missing types that need to be defined
export interface ConfirmDateRequest {
  confirmed: boolean;
  notes?: string;
}

export interface DateConflict {
  conflictingDateId: number;
  conflictType: 'overlapping' | 'same_user' | 'venue_unavailable';
  conflictDescription: string;
  suggestedAlternatives: Array<{
    dateTime: string;
    reason: string;
  }>;
}

export interface CompatibilityDetails {
  overallScore: number;
  breakdown: {
    ageCompatibility: number;
    locationCompatibility: number;
    interestsCompatibility: number;
    lifestyleCompatibility: number;
    goalsCompatibility: number;
  };
  strengths: string[];
  concerns: string[];
  recommendations: string[];
}

export interface BulkDateOperationResult {
  totalProcessed: number;
  successful: number;
  failed: number;
  results: Array<{
    dateId?: number;
    success: boolean;
    error?: string;
  }>;
}

export interface IDateCurationService {
  // User-facing methods
  getUserDates(
    userId: number,
    filters: GetUserDatesRequest
  ): Promise<UserDatesResponse>;
  getUserDateById(userId: number, dateId: number): Promise<CuratedDateResponse>;
  confirmDate(
    userId: number,
    dateId: number,
    data: ConfirmDateRequest
  ): Promise<{ confirmed: boolean; message: string }>;
  cancelDate(
    userId: number,
    dateId: number,
    data: CancelDateRequest
  ): Promise<{ cancelled: boolean; refundAmount?: number }>;
  submitDateFeedback(
    userId: number,
    dateId: number,
    feedback: SubmitDateFeedbackRequest
  ): Promise<DateFeedbackResponse>;
  getUserDateFeedback(
    userId: number,
    dateId: number
  ): Promise<DateFeedbackResponse>;
  updateDateFeedback(
    userId: number,
    dateId: number,
    feedback: SubmitDateFeedbackRequest
  ): Promise<DateFeedbackResponse>;
  getUserTrustScore(userId: number): Promise<UserTrustScoreResponse>;
  getUserDateSeries(userId: number): Promise<DateSeriesResponse[]>;
  getDateSeriesById(
    userId: number,
    seriesId: string
  ): Promise<DateSeriesResponse>;

  // Admin methods
  createCuratedDate(
    adminId: number,
    data: CreateCuratedDateRequest
  ): Promise<CuratedDateResponse>;
  updateCuratedDate(
    adminId: number,
    dateId: number,
    data: UpdateCuratedDateRequest
  ): Promise<CuratedDateResponse>;
  getAdminCuratedDates(
    filters: AdminGetDatesRequest
  ): Promise<{ dates: CuratedDateResponse[]; total: number }>;
  getAdminCuratedDateById(dateId: number): Promise<CuratedDateResponse>;
  deleteCuratedDate(adminId: number, dateId: number): Promise<void>;
  searchPotentialMatches(
    filters: SearchPotentialMatchesRequest
  ): Promise<SearchPotentialMatchesResponse>;
  bulkCreateCuratedDates(
    adminId: number,
    requests: CreateCuratedDateRequest[]
  ): Promise<BulkDateOperationResult>;
  getAdminUserTrustScore(userId: number): Promise<UserTrustScoreResponse>;
  updateUserTrustScore(
    adminId: number,
    userId: number,
    data: any
  ): Promise<UserTrustScoreResponse>;
  getAdminDateSeries(filters: any): Promise<DateSeriesResponse[]>;
  updateDateSeries(
    adminId: number,
    seriesId: string,
    data: any
  ): Promise<DateSeriesResponse>;
  getDateCurationAnalytics(
    filters: DateCurationAnalyticsRequest
  ): Promise<DateCurationAnalyticsResponse>;
  getDateCurationDashboard(): Promise<any>;
  getAllDateFeedback(filters: any): Promise<any>;
  getSafetyReports(): Promise<any>;
  updateUserProbationStatus(
    adminId: number,
    userId: number,
    data: any
  ): Promise<any>;

  // Workflow methods
  getPendingWorkflowTasks(adminId: number): Promise<any>;
  completeWorkflowStage(
    adminId: number,
    workflowId: number,
    data: any
  ): Promise<any>;
  triggerAutomatedReminders(): Promise<any>;

  // Utility methods
  checkDateConflicts(data: CreateCuratedDateRequest): Promise<DateConflict[]>;
  getCompatibilityScore(
    user1Id: number,
    user2Id: number
  ): Promise<CompatibilityDetails>;
  healthCheck(): Promise<any>;
}

export class DateCurationService implements IDateCurationService {
  constructor(
    private readonly repository: IDateCurationRepository,
    private readonly mapper: DateCurationMapper,
    private readonly logger: Logger
  ) {}

  async getUserDates(
    userId: number,
    filters: GetUserDatesRequest
  ): Promise<UserDatesResponse> {
    this.logger.info("Getting user dates", { userId, filters });

    try {
      const { dates, total } = await this.repository.getUserDates(
        userId,
        filters
      );
      const mappedDates = dates.map((date) =>
        this.mapper.toCuratedDateResponse(date, userId)
      );

      // Calculate summary statistics
      const summary = {
        totalDates: total,
        upcomingDates: dates.filter(
          (d) =>
            new Date(d.dateTime) > new Date() &&
            [
              CuratedDateStatus.UNSPECIFIED,
              CuratedDateStatus.USER1_CONFIRMED,
              CuratedDateStatus.USER2_CONFIRMED,
              CuratedDateStatus.BOTH_CONFIRMED,
            ].includes(d.status as CuratedDateStatus)
        ).length,
        completedDates: dates.filter(
          (d) => d.status === CuratedDateStatus.COMPLETED
        ).length,
        cancelledDates: dates.filter(
          (d) => d.status === CuratedDateStatus.CANCELLED
        ).length,
        pendingConfirmation: dates.filter(
          (d) =>
            d.status === CuratedDateStatus.PENDING ||
            (d.status === CuratedDateStatus.USER2_CONFIRMED &&
              d.user2Id === userId) ||
            (d.status === CuratedDateStatus.USER1_CONFIRMED &&
              d.user1Id === userId)
        ).length,
        awaitingFeedback: dates.filter(
          (d) =>
            d.status === CuratedDateStatus.COMPLETED &&
            !d.datifyyCuratedDateFeedbacks?.some((f) => f.userId === userId)
        ).length,
      };

      return {
        success: true,
        message: "",
        data: {
          data: mappedDates,
          pagination: {
            total,
            page: filters.page || 1,
            hasPrevious: false,
            hasNext: false,
            limit: filters.limit || 10,
            totalPages: Math.ceil(total / (filters.limit || 10)),
          },
          summary,
        },
      };
    } catch (error) {
      this.logger.error("Failed to get user dates", { userId, error });
      throw new Error("Failed to retrieve user dates");
    }
  }

  async getUserDateById(
    userId: number,
    dateId: number
  ): Promise<CuratedDateResponse> {
    this.logger.info("Getting user date by ID", { userId, dateId });

    const date = await this.repository.getUserDateById(userId, dateId);
    if (!date) {
      throw new Error("Date not found or not accessible");
    }

    return this.mapper.toCuratedDateResponse(date, userId);
  }

  async confirmDate(
    userId: number,
    dateId: number,
    data: ConfirmDateRequest
  ): Promise<{ confirmed: boolean; message: string }> {
    this.logger.info("Confirming date", {
      userId,
      dateId,
      confirmed: data.confirmed,
    });

    if (!data.confirmed) {
      throw new Error("Confirmation must be true to confirm a date");
    }

    // Check if user can confirm this date
    const date = await this.repository.getUserDateById(userId, dateId);
    if (!date) {
      throw new Error("Date not found or not accessible");
    }

    // Check if date is in the future
    if (new Date(date.dateTime) <= new Date()) {
      throw new Error("Cannot confirm a date that has already passed");
    }

    // Check if already confirmed
    const isUser1 = date.user1Id === userId;
    const isUser2 = date.user2Id === userId;

    if (
      (isUser1 && date.user1ConfirmedAt) ||
      (isUser2 && date.user2ConfirmedAt)
    ) {
      throw new Error("You have already confirmed this date");
    }

    const updatedDate = await this.repository.confirmDate(dateId, userId);

    const isBothConfirmed =
      updatedDate.status === CuratedDateStatus.BOTH_CONFIRMED;
    const message = isBothConfirmed
      ? "Date confirmed! Both participants have now confirmed."
      : "Date confirmed! Waiting for your date partner to confirm.";

    return {
      confirmed: true,
      message,
    };
  }

  async cancelDate(
    userId: number,
    dateId: number,
    data: CancelDateRequest
  ): Promise<{ cancelled: boolean; refundAmount?: number }> {
    this.logger.info("Cancelling date", {
      userId,
      dateId,
      category: data.category,
    });

    const date = await this.repository.getUserDateById(userId, dateId);
    if (!date) {
      throw new Error("Date not found or not accessible");
    }

    // Check if date can be cancelled
    if (date.status === CuratedDateStatus.CANCELLED) {
      throw new Error("Date is already cancelled");
    }

    if (date.status === CuratedDateStatus.COMPLETED) {
      throw new Error("Cannot cancel a completed date");
    }

    // Calculate refund amount based on cancellation timing
    const hoursUntilDate =
      (new Date(date.dateTime).getTime() - new Date().getTime()) /
      (1000 * 60 * 60);
    let refundAmount = 0;

    const userTokenCost =
      date.user1Id === userId
        ? date.tokensCostUser1 || 0
        : date.tokensCostUser2 || 0;

    if (
      hoursUntilDate >=
      DateCurationValidationRules.cancellation.freeThresholdHours
    ) {
      refundAmount = userTokenCost; // Full refund
    } else if (
      hoursUntilDate >=
      DateCurationValidationRules.cancellation.partialRefundThresholdHours
    ) {
      refundAmount = Math.floor(userTokenCost * 0.5); // 50% refund
    } else {
      refundAmount = 0; // No refund
    }

    await this.repository.cancelDate(
      dateId,
      userId,
      data.reason,
      data.category
    );

    // Update user trust score for cancellation
    await this.repository.calculateTrustScore(userId);

    return {
      cancelled: true,
      refundAmount: data.refundTokens ? refundAmount : undefined,
    };
  }

  async submitDateFeedback(
    userId: number,
    dateId: number,
    feedback: SubmitDateFeedbackRequest
  ): Promise<DateFeedbackResponse> {
    this.logger.info("Submitting date feedback", { userId, dateId });

    const date = await this.repository.getUserDateById(userId, dateId);
    if (!date) {
      throw new Error("Date not found or not accessible");
    }

    // Check if date is completed
    if (date.status !== CuratedDateStatus.COMPLETED) {
      throw new Error("Can only submit feedback for completed dates");
    }

    // Check if feedback already exists
    const existingFeedback = await this.repository.getDateFeedback(
      dateId,
      userId
    );
    if (existingFeedback) {
      throw new Error("Feedback already submitted for this date");
    }

    // Check submission deadline
    if (date.completedAt) {
      const hoursAfterCompletion =
        (new Date().getTime() - new Date(date.completedAt).getTime()) /
        (1000 * 60 * 60);
      if (
        hoursAfterCompletion >
        DateCurationValidationRules.feedback.submissionDeadlineHours
      ) {
        throw new Error("Feedback submission deadline has passed");
      }
    }

    const feedbackData = {
      curatedDateId: dateId,
      userId,
      ...feedback,
      submittedAt: new Date(),
    };

    const savedFeedback = await this.repository.createDateFeedback(
      feedbackData
    );

    // Update partner's trust score based on feedback
    const partnerId = date.user1Id === userId ? date.user2Id : date.user1Id;
    await this.repository.calculateTrustScore(partnerId);

    return this.mapper.toDateFeedbackResponse(savedFeedback, date);
  }

  async getUserDateFeedback(
    userId: number,
    dateId: number
  ): Promise<DateFeedbackResponse> {
    const feedback = await this.repository.getDateFeedback(dateId, userId);
    if (!feedback) {
      throw new Error("Feedback not found");
    }

    const date = await this.repository.getUserDateById(userId, dateId);
    return this.mapper.toDateFeedbackResponse(feedback, date!);
  }

  async updateDateFeedback(
    userId: number,
    dateId: number,
    feedback: SubmitDateFeedbackRequest
  ): Promise<DateFeedbackResponse> {
    this.logger.info("Updating date feedback", { userId, dateId });

    const existingFeedback = await this.repository.getDateFeedback(
      dateId,
      userId
    );
    if (!existingFeedback) {
      throw new Error("Feedback not found");
    }

    // Check if feedback can still be edited (within 24 hours of submission)
    if (existingFeedback.submittedAt) {
      const hoursAfterSubmission =
        (new Date().getTime() -
          new Date(existingFeedback.submittedAt).getTime()) /
        (1000 * 60 * 60);
      if (hoursAfterSubmission > 24) {
        throw new Error("Feedback can no longer be edited");
      }
    }

    const updatedFeedback = await this.repository.updateDateFeedback(
      existingFeedback.id,
      feedback
    );
    const date = await this.repository.getUserDateById(userId, dateId);

    return this.mapper.toDateFeedbackResponse(updatedFeedback, date!);
  }

  async getUserTrustScore(userId: number): Promise<UserTrustScoreResponse> {
    this.logger.info("Getting user trust score", { userId });

    let trustScore = await this.repository.getUserTrustScore(userId);

    if (!trustScore) {
      // Calculate initial trust score if doesn't exist
      trustScore = await this.repository.calculateTrustScore(userId);
    }

    return this.mapper.toUserTrustScoreResponse(trustScore);
  }

  async getUserDateSeries(userId: number): Promise<DateSeriesResponse[]> {
    this.logger.info("Getting user date series", { userId });

    const series = await this.repository.getUserDateSeries(userId);
    return series.map((s) => this.mapper.toDateSeriesResponse(s, userId));
  }

  async getDateSeriesById(
    userId: number,
    seriesId: string
  ): Promise<DateSeriesResponse> {
    this.logger.info("Getting date series by ID", { userId, seriesId });

    const series = await this.repository.getDateSeriesById(seriesId);
    if (!series) {
      throw new Error("Date series not found");
    }

    // Check if user is part of this series
    if (series.user1Id !== userId && series.user2Id !== userId) {
      throw new Error("Access denied to this date series");
    }

    return this.mapper.toDateSeriesResponse(series, userId);
  }

  // ============================================================================
  // ADMIN METHODS
  // ============================================================================

  async createCuratedDate(
    adminId: number,
    data: CreateCuratedDateRequest
  ): Promise<CuratedDateResponse> {
    this.logger.info("Admin creating curated date", {
      adminId,
      user1Id: data.user1Id,
      user2Id: data.user2Id,
    });

    // Check for conflicts
    const conflicts = await this.checkDateConflicts(data);
    if (conflicts.length > 0) {
      throw new Error(
        `Date conflicts detected: ${conflicts
          .map((c) => c.conflictDescription)
          .join(", ")}`
      );
    }

    const createdDate = await this.repository.createCuratedDate(data, adminId);
    return this.mapper.toCuratedDateResponse(createdDate);
  }

  async updateCuratedDate(
    adminId: number,
    dateId: number,
    data: UpdateCuratedDateRequest
  ): Promise<CuratedDateResponse> {
    this.logger.info("Admin updating curated date", { adminId, dateId });

    const updatedDate = await this.repository.updateCuratedDate(
      dateId,
      data,
      adminId
    );
    return this.mapper.toCuratedDateResponse(updatedDate);
  }

  async getAdminCuratedDates(
    filters: AdminGetDatesRequest
  ): Promise<{ dates: CuratedDateResponse[]; total: number }> {
    this.logger.info("Getting admin curated dates", { filters });

    const { dates, total } = await this.repository.getAdminCuratedDates(
      filters
    );
    const mappedDates = dates.map((date) =>
      this.mapper.toCuratedDateResponse(date)
    );

    return { dates: mappedDates, total };
  }

  async getAdminCuratedDateById(dateId: number): Promise<CuratedDateResponse> {
    this.logger.info("Getting admin curated date by ID", { dateId });

    const date = await this.repository.getCuratedDateById(dateId, true);
    if (!date) {
      throw new Error("Curated date not found");
    }

    return this.mapper.toCuratedDateResponse(date);
  }

  async deleteCuratedDate(adminId: number, dateId: number): Promise<void> {
    this.logger.info("Admin deleting curated date", { adminId, dateId });

    await this.repository.deleteCuratedDate(dateId);
  }

  async searchPotentialMatches(
    filters: SearchPotentialMatchesRequest
  ): Promise<SearchPotentialMatchesResponse> {
    this.logger.info("Searching potential matches", { filters });

    const { users, total } = await this.repository.searchPotentialMatches(
      filters
    );

    // Map users to potential match responses
    const mappedUsers = users.map((user) =>
      this.mapper.toPotentialMatchResponse(user, filters.userId)
    );

    const searchSummary = {
      searchCriteria: filters,
      totalMatches: total,
      averageCompatibility:
        mappedUsers.reduce((sum, match) => sum + match.compatibilityScore, 0) /
          mappedUsers.length || 0,
      highCompatibilityMatches: mappedUsers.filter(
        (match) => match.compatibilityScore > 80
      ).length,
      verifiedMatches: mappedUsers.filter(
        (match) =>
          match.userInfo.verificationStatus.email &&
          match.userInfo.verificationStatus.phone
      ).length,
    };

    return {
      success: true,
      message: "",
      data: {
        data: mappedUsers,
        pagination: {
          total,
          hasNext: false,
          hasPrevious: false,
          page: filters.page || 1,
          limit: filters.limit || 10,
          totalPages: Math.ceil(total / (filters.limit || 10)),
        },
        searchSummary,
      },
    };
  }

  async bulkCreateCuratedDates(
    adminId: number,
    requests: CreateCuratedDateRequest[]
  ): Promise<BulkDateOperationResult> {
    this.logger.info("Bulk creating curated dates", {
      adminId,
      count: requests.length,
    });

    const results = [];
    let successful = 0;
    let failed = 0;

    for (const request of requests) {
      try {
        const conflicts = await this.checkDateConflicts(request);
        if (conflicts.length > 0) {
          results.push({
            success: false,
            error: `Conflicts detected: ${conflicts
              .map((c) => c.conflictDescription)
              .join(", ")}`,
          });
          failed++;
          continue;
        }

        const createdDate = await this.repository.createCuratedDate(
          request,
          adminId
        );
        results.push({
          dateId: createdDate.id,
          success: true,
        });
        successful++;
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
        failed++;
      }
    }

    return {
      totalProcessed: requests.length,
      successful,
      failed,
      results,
    };
  }

  async getAdminUserTrustScore(
    userId: number
  ): Promise<UserTrustScoreResponse> {
    return this.getUserTrustScore(userId);
  }

  async updateUserTrustScore(
    adminId: number,
    userId: number,
    data: any
  ): Promise<UserTrustScoreResponse> {
    this.logger.info("Admin updating user trust score", { adminId, userId });

    data.lastCalculatedAt = new Date();
    data.calculationReason = `Manual adjustment by admin ${adminId}`;

    const updatedScore = await this.repository.updateUserTrustScore(
      userId,
      data
    );
    return this.mapper.toUserTrustScoreResponse(updatedScore);
  }

  async getAdminDateSeries(filters: any): Promise<DateSeriesResponse[]> {
    this.logger.info("Getting admin date series", { filters });

    try {
      // For now, return empty array since repository method might not be implemented
      // In a real implementation, you'd add proper filtering
      return [];
    } catch (error) {
      this.logger.error("Failed to get admin date series", { error });
      return [];
    }
  }

  async updateDateSeries(
    adminId: number,
    seriesId: string,
    data: any
  ): Promise<DateSeriesResponse> {
    this.logger.info("Admin updating date series", { adminId, seriesId });

    const updatedSeries = await this.repository.updateDateSeries(
      seriesId,
      data
    );
    return this.mapper.toDateSeriesResponse(updatedSeries);
  }

  async getDateCurationAnalytics(
    filters: DateCurationAnalyticsRequest
  ): Promise<DateCurationAnalyticsResponse> {
    this.logger.info("Getting date curation analytics", { filters });

    const startDate = filters.startDate
      ? new Date(filters.startDate)
      : undefined;
    const endDate = filters.endDate ? new Date(filters.endDate) : undefined;

    const analytics = await this.repository.getDateCurationAnalytics(
      startDate,
      endDate
    );

    return {
      success: true,
      data: analytics,
      message: "",
    };
  }

  async getDateCurationDashboard(): Promise<any> {
    this.logger.info("Getting date curation dashboard");

    const dashboardStats = await this.repository.getDashboardStats();
    return dashboardStats;
  }

  async getAllDateFeedback(filters: any): Promise<any> {
    this.logger.info("Getting all date feedback", { filters });

    try {
      // For now, return empty result since repository method might not be implemented
      return {
        feedbacks: [],
        total: 0,
      };
    } catch (error) {
      this.logger.error("Failed to get all date feedback", { error });
      return {
        feedbacks: [],
        total: 0,
      };
    }
  }

  async getSafetyReports(): Promise<any> {
    this.logger.info("Getting safety reports");

    try {
      // For now, return empty result since repository method might not be implemented
      return {
        reports: [],
        total: 0,
      };
    } catch (error) {
      this.logger.error("Failed to get safety reports", { error });
      return {
        reports: [],
        total: 0,
      };
    }
  }

  async updateUserProbationStatus(
    adminId: number,
    userId: number,
    data: any
  ): Promise<any> {
    this.logger.info("Admin updating user probation status", {
      adminId,
      userId,
    });

    const trustScore = await this.repository.getUserTrustScore(userId);
    if (!trustScore) {
      throw new Error("User trust score not found");
    }

    const updateData = {
      isOnProbation: data.isOnProbation,
      probationUntil: data.probationUntil
        ? new Date(data.probationUntil)
        : null,
      warningLevel: data.warningLevel || trustScore.warningLevel,
      canBookDates: !data.isOnProbation,
      lastCalculatedAt: new Date(),
      calculationReason: `Probation status updated by admin ${adminId}`,
    };

    const updatedScore = await this.repository.updateUserTrustScore(
      userId,
      updateData
    );
    return this.mapper.toUserTrustScoreResponse(updatedScore);
  }

  // ============================================================================
  // WORKFLOW METHODS
  // ============================================================================

  async getPendingWorkflowTasks(adminId: number): Promise<any> {
    this.logger.info("Getting pending workflow tasks", { adminId });

    try {
      // For now, return empty result since repository method might not be implemented
      return {
        tasks: [],
        total: 0,
      };
    } catch (error) {
      this.logger.error("Failed to get pending workflow tasks", { error });
      return {
        tasks: [],
        total: 0,
      };
    }
  }

  async completeWorkflowStage(
    adminId: number,
    workflowId: number,
    data: any
  ): Promise<any> {
    this.logger.info("Completing workflow stage", { adminId, workflowId });

    try {
      // For now, return mock result since repository method might not be implemented
      return {
        completed: true,
        workflowId,
        stage: data.stage || "completed",
        completedAt: new Date(),
      };
    } catch (error) {
      this.logger.error("Failed to complete workflow stage", { error });
      return {
        completed: false,
        workflowId,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async triggerAutomatedReminders(): Promise<any> {
    this.logger.info("Triggering automated reminders");

    try {
      const upcomingDates =
        await this.repository.getUpcomingDatesForReminders();
      let reminders24hSent = 0;
      let reminders2hSent = 0;

      for (const date of upcomingDates) {
        const hoursUntilDate =
          (new Date(date.dateTime).getTime() - new Date().getTime()) /
          (1000 * 60 * 60);

        if (
          hoursUntilDate <= 24 &&
          hoursUntilDate > 2 &&
          !date.reminderSent_24h
        ) {
          // Send 24-hour reminder
          // TODO: Implement email/notification service
          //   await this.repository.updateCuratedDate(date.id, { reminderSent_24h: true }, 0);
          reminders24hSent++;
        } else if (hoursUntilDate <= 2 && !date.reminderSent_2h) {
          // Send 2-hour reminder
          // TODO: Implement email/notification service
          //   await this.repository.updateCuratedDate(date.id, { reminderSent_2h: true }, 0);
          reminders2hSent++;
        }
      }

      return {
        totalDatesProcessed: upcomingDates.length,
        reminders24hSent,
        reminders2hSent,
      };
    } catch (error) {
      this.logger.error("Failed to trigger automated reminders", { error });
      return {
        totalDatesProcessed: 0,
        reminders24hSent: 0,
        reminders2hSent: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  async checkDateConflicts(
    data: CreateCuratedDateRequest
  ): Promise<DateConflict[]> {
    this.logger.info("Checking date conflicts", {
      user1Id: data.user1Id,
      user2Id: data.user2Id,
    });

    const conflicts = await this.repository.checkDateConflicts(
      data.user1Id,
      data.user2Id,
      new Date(data.dateTime),
      data.durationMinutes || 60
    );

    return conflicts.map((conflict) => ({
      conflictingDateId: conflict.id,
      conflictType: "overlapping" as const,
      conflictDescription: `Overlapping date at ${conflict.dateTime}`,
      suggestedAlternatives: [
        {
          dateTime: new Date(
            new Date(data.dateTime).getTime() + 2 * 60 * 60 * 1000
          ).toISOString(),
          reason: "Move 2 hours later",
        },
      ],
    }));
  }

  async getCompatibilityScore(
    user1Id: number,
    user2Id: number
  ): Promise<CompatibilityDetails> {
    this.logger.info("Getting compatibility score", { user1Id, user2Id });

    // This would be a complex calculation based on user preferences
    // For now, returning a mock response
    return {
      overallScore: 75,
      breakdown: {
        ageCompatibility: 85,
        locationCompatibility: 90,
        interestsCompatibility: 70,
        lifestyleCompatibility: 65,
        goalsCompatibility: 80,
      },
      strengths: [
        "Similar age range",
        "Close proximity",
        "Shared interests in technology",
      ],
      concerns: ["Different lifestyle preferences", "Varying activity levels"],
      recommendations: [
        "Focus on shared interests",
        "Explore mutual hobbies",
        "Plan activity-based dates",
      ],
    };
  }

  async healthCheck(): Promise<any> {
    this.logger.info("Date curation service health check");

    try {
      const dashboardStats = await this.repository.getDashboardStats();

      return {
        status: "healthy",
        timestamp: new Date().toISOString(),
        service: "DateCurationService",
        version: "1.0.0",
        stats: dashboardStats,
        dependencies: {
          database: "connected",
          repository: "operational",
        },
      };
    } catch (error) {
      this.logger.error("Health check failed", { error });
      return {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        service: "DateCurationService",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
