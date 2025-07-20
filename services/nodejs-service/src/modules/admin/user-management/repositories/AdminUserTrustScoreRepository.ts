import { DataSource, Repository } from "typeorm";
import { DatifyyUserTrustScores } from "../../../../models/entities/DatifyyUserTrustScores";
import { DatifyyCuratedDates } from "../../../../models/entities/DatifyyCuratedDates";
import { DatifyyCuratedDateFeedback } from "../../../../models/entities/DatifyyCuratedDateFeedback";
import { Logger } from "../../../../infrastructure/logging/Logger";
import { AdminUserTrustScore } from "../dtos/response/AdminUserDetailResponseDto";
import { TrustScoreAdjustmentReason } from "../dtos/request/UpdateUserTrustScoreRequestDto";

export interface TrustScoreCalculationData {
  totalDates: number;
  attendedDates: number;
  cancelledDates: number;
  noShowDates: number;
  lastMinuteCancellations: number;
  averageRating: number;
  positiveFeedbackCount: number;
  profileCompleteness: number;
}

export interface TrustScoreUpdate {
  overallScore?: number;
  attendanceScore?: number;
  punctualityScore?: number;
  feedbackScore?: number;
  warningLevel?: number;
  maxDatesPerWeek?: number;
  isOnProbation?: boolean;
  probationUntil?: Date;
  adminOverrideReason?: string;
  manualAdjustmentAt?: Date;
  manualAdjustmentBy?: number;
}

export class AdminUserTrustScoreRepository {
  private trustScoreRepo: Repository<DatifyyUserTrustScores>;
  private curatedDatesRepo: Repository<DatifyyCuratedDates>;
  private feedbackRepo: Repository<DatifyyCuratedDateFeedback>;

  constructor(private dataSource: DataSource, private logger: Logger) {
    this.trustScoreRepo = dataSource.getRepository(DatifyyUserTrustScores);
    this.curatedDatesRepo = dataSource.getRepository(DatifyyCuratedDates);
    this.feedbackRepo = dataSource.getRepository(DatifyyCuratedDateFeedback);
  }

  async findTrustScoreByUserId(
    userId: number
  ): Promise<AdminUserTrustScore | null> {
    try {
      this.logger.info("Finding trust score for user", { userId });

      const trustScore = await this.trustScoreRepo
        .createQueryBuilder("trust")
        .leftJoinAndSelect("trust.manualAdjustmentBy", "admin")
        .where("trust.userId = :userId", { userId })
        .getOne();

      if (!trustScore) {
        return null;
      }

      return this.mapToAdminUserTrustScore(trustScore);
    } catch (error) {
      this.logger.error("Error finding trust score", { error, userId });
      throw error;
    }
  }

  async updateTrustScore(
    userId: number,
    updates: TrustScoreUpdate,
    adminId: number,
    reason: TrustScoreAdjustmentReason
  ): Promise<AdminUserTrustScore> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      this.logger.info("Updating user trust score", {
        userId,
        updates,
        adminId,
        reason,
      });

      // Check if trust score exists, create if not
      let trustScore = await queryRunner.manager.findOne(
        DatifyyUserTrustScores,
        {
          where: { userId },
        }
      );

      if (!trustScore) {
        trustScore = queryRunner.manager.create(DatifyyUserTrustScores, {
          userId,
          overallScore: 100,
          attendanceScore: 100,
          punctualityScore: 100,
          feedbackScore: 100,
          profileCompletenessScore: 0,
          totalDatesAttended: 0,
          totalDatesCancelled: 0,
          totalDatesNoShow: 0,
          lastMinuteCancellations: 0,
          averageRating: "0.00",
          consecutiveCancellations: 0,
          warningLevel: 0,
          isOnProbation: false,
          secondDateRate: "0.00",
          positiveFeedbackCount: 0,
          complimentsReceived: 0,
          canBookDates: true,
          maxDatesPerWeek: 3,
          requiresAdminApproval: false,
          lastCalculatedAt: new Date(),
          calculationReason: "initial_creation",
        }) || {
          userId: 0,
        };
      }

      // Apply updates
      Object.assign(trustScore, updates);
      // @ts-ignore
      trustScore.lastCalculatedAt = new Date();
      // @ts-ignore
      trustScore.calculationReason = `admin_adjustment_${reason}`;
      // @ts-ignore
      trustScore.manualAdjustmentAt = new Date();
      // @ts-ignore
      trustScore.manualAdjustmentBy = adminId;

      // Recalculate overall score if individual scores were updated
      if (
        updates.attendanceScore ||
        updates.punctualityScore ||
        updates.feedbackScore
      ) {
        // @ts-ignore
        trustScore.overallScore = this.calculateOverallScore(
          // @ts-ignore
          trustScore.attendanceScore!,
          // @ts-ignore
          trustScore.punctualityScore!,
          // @ts-ignore
          trustScore.feedbackScore!,
          // @ts-ignore
          trustScore.profileCompletenessScore!
        );
      }

      // Apply business rules
      this.applyTrustScoreBusinessRules(trustScore);

      const savedTrustScore = await queryRunner.manager.save(
        DatifyyUserTrustScores,
        trustScore
      );

      // Log the adjustment
      await this.logTrustScoreAdjustment(
        queryRunner,
        userId,
        adminId,
        reason,
        updates
      );

      await queryRunner.commitTransaction();

      return this.mapToAdminUserTrustScore(savedTrustScore);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error("Error updating trust score", {
        error,
        userId,
        updates,
      });
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async recalculateTrustScore(
    userId: number,
    reason = "system_recalculation"
  ): Promise<AdminUserTrustScore> {
    try {
      this.logger.info("Recalculating trust score for user", {
        userId,
        reason,
      });

      const calculationData = await this.getTrustScoreCalculationData(userId);
      const newScores = this.calculateTrustScores(calculationData);

      const updates: TrustScoreUpdate = {
        overallScore: newScores.overall,
        attendanceScore: newScores.attendance,
        punctualityScore: newScores.punctuality,
        feedbackScore: newScores.feedback,
        adminOverrideReason: reason,
      };

      // Use system admin ID (0) for automated recalculations
      return await this.updateTrustScore(
        userId,
        updates,
        0,
        TrustScoreAdjustmentReason.SYSTEM_ERROR_CORRECTION
      );
    } catch (error) {
      this.logger.error("Error recalculating trust score", { error, userId });
      throw error;
    }
  }

  async getUsersWithLowTrustScores(threshold = 50): Promise<
    {
      userId: number;
      email: string;
      firstName: string;
      lastName: string;
      overallScore: number;
      warningLevel: number;
      isOnProbation: boolean;
      lastCalculatedAt: Date;
    }[]
  > {
    try {
      this.logger.info("Getting users with low trust scores", { threshold });

      const query = `
        SELECT 
          trust.user_id,
          login.email,
          info.first_name,
          info.last_name,
          trust.overall_score,
          trust.warning_level,
          trust.is_on_probation,
          trust.last_calculated_at
        FROM datifyy_user_trust_scores trust
        JOIN datifyy_users_login login ON trust.user_id = login.id
        LEFT JOIN datifyy_users_information info ON login.id = info.user_login_id
        WHERE trust.overall_score < $1
        ORDER BY trust.overall_score ASC, trust.warning_level DESC
      `;

      const results = await this.dataSource.query(query, [threshold]);

      return results.map((row: any) => ({
        userId: row.user_id,
        email: row.email,
        firstName: row.first_name || "",
        lastName: row.last_name || "",
        overallScore: row.overall_score,
        warningLevel: row.warning_level,
        isOnProbation: row.is_on_probation,
        lastCalculatedAt: new Date(row.last_calculated_at),
      }));
    } catch (error) {
      this.logger.error("Error getting users with low trust scores", {
        error,
        threshold,
      });
      throw error;
    }
  }

  async getUsersOnProbation(): Promise<
    {
      userId: number;
      email: string;
      firstName: string;
      lastName: string;
      probationUntil: Date;
      warningLevel: number;
      overallScore: number;
    }[]
  > {
    try {
      this.logger.info("Getting users on probation");

      const query = `
        SELECT 
          trust.user_id,
          login.email,
          info.first_name,
          info.last_name,
          trust.probation_until,
          trust.warning_level,
          trust.overall_score
        FROM datifyy_user_trust_scores trust
        JOIN datifyy_users_login login ON trust.user_id = login.id
        LEFT JOIN datifyy_users_information info ON login.id = info.user_login_id
        WHERE trust.is_on_probation = true
        ORDER BY trust.probation_until ASC
      `;

      const results = await this.dataSource.query(query);

      return results.map((row: any) => ({
        userId: row.user_id,
        email: row.email,
        firstName: row.first_name || "",
        lastName: row.last_name || "",
        probationUntil: new Date(row.probation_until),
        warningLevel: row.warning_level,
        overallScore: row.overall_score,
      }));
    } catch (error) {
      this.logger.error("Error getting users on probation", { error });
      throw error;
    }
  }

  private async getTrustScoreCalculationData(
    userId: number
  ): Promise<TrustScoreCalculationData> {
    // Get date statistics
    const dateStatsQuery = `
      SELECT 
        COUNT(*) as total_dates,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as attended_dates,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_dates,
        COUNT(CASE WHEN status = 'no_show' THEN 1 END) as no_show_dates,
        COUNT(CASE WHEN status = 'cancelled' AND cancelled_at > date_time - INTERVAL '24 hours' THEN 1 END) as last_minute_cancellations
      FROM datifyy_curated_dates 
      WHERE user1_id = $1 OR user2_id = $1
    `;

    const dateStats = await this.dataSource.query(dateStatsQuery, [userId]);
    const stats = dateStats[0];

    // Get feedback statistics
    const feedbackQuery = `
      SELECT 
        AVG(overall_rating) as average_rating,
        COUNT(CASE WHEN overall_rating >= 4 THEN 1 END) as positive_feedback_count
      FROM datifyy_curated_date_feedback 
      WHERE user_id = $1 AND overall_rating IS NOT NULL
    `;

    const feedbackStats = await this.dataSource.query(feedbackQuery, [userId]);
    const feedback = feedbackStats[0];

    // Calculate profile completeness (simplified)
    const profileCompleteness = await this.calculateProfileCompleteness(userId);

    return {
      totalDates: parseInt(stats.total_dates) || 0,
      attendedDates: parseInt(stats.attended_dates) || 0,
      cancelledDates: parseInt(stats.cancelled_dates) || 0,
      noShowDates: parseInt(stats.no_show_dates) || 0,
      lastMinuteCancellations: parseInt(stats.last_minute_cancellations) || 0,
      averageRating: parseFloat(feedback.average_rating) || 0,
      positiveFeedbackCount: parseInt(feedback.positive_feedback_count) || 0,
      profileCompleteness,
    };
  }

  private calculateTrustScores(data: TrustScoreCalculationData): {
    overall: number;
    attendance: number;
    punctuality: number;
    feedback: number;
  } {
    // Attendance Score (0-100)
    let attendanceScore = 100;
    if (data.totalDates > 0) {
      const attendanceRate = data.attendedDates / data.totalDates;
      attendanceScore = Math.max(0, Math.min(100, attendanceRate * 100));

      // Penalize no-shows heavily
      const noShowPenalty = (data.noShowDates / data.totalDates) * 30;
      attendanceScore = Math.max(0, attendanceScore - noShowPenalty);
    }

    // Punctuality Score (0-100)
    let punctualityScore = 100;
    if (data.totalDates > 0) {
      const lastMinuteRate = data.lastMinuteCancellations / data.totalDates;
      punctualityScore = Math.max(0, 100 - lastMinuteRate * 50);
    }

    // Feedback Score (0-100)
    let feedbackScore = 100;
    if (data.averageRating > 0) {
      feedbackScore = (data.averageRating / 5) * 100;
    }

    // Overall Score (weighted average)
    const overall = Math.round(
      attendanceScore * 0.4 +
        punctualityScore * 0.3 +
        feedbackScore * 0.2 +
        data.profileCompleteness * 0.1
    );

    return {
      overall: Math.max(0, Math.min(100, overall)),
      attendance: Math.round(attendanceScore),
      punctuality: Math.round(punctualityScore),
      feedback: Math.round(feedbackScore),
    };
  }

  private calculateOverallScore(
    attendance: number,
    punctuality: number,
    feedback: number,
    profileCompleteness: number
  ): number {
    return Math.round(
      attendance * 0.4 +
        punctuality * 0.3 +
        feedback * 0.2 +
        profileCompleteness * 0.1
    );
  }

  private applyTrustScoreBusinessRules(
    trustScore: DatifyyUserTrustScores
  ): void {
    // Apply probation if score is too low
    if (trustScore.overallScore! < 25 && !trustScore.isOnProbation) {
      trustScore.isOnProbation = true;
      trustScore.probationUntil = new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ); // 30 days
    }

    // Increase warning level based on score
    if (trustScore.overallScore! < 30) {
      trustScore.warningLevel = Math.max(trustScore.warningLevel!, 3);
    } else if (trustScore.overallScore! < 50) {
      trustScore.warningLevel = Math.max(trustScore.warningLevel!, 2);
    } else if (trustScore.overallScore! < 70) {
      trustScore.warningLevel = Math.max(trustScore.warningLevel!, 1);
    }

    // Restrict booking permissions
    if (trustScore.overallScore! < 40) {
      trustScore.canBookDates = false;
      trustScore.requiresAdminApproval = true;
    }

    // Limit dates per week based on score
    if (trustScore.overallScore! < 50) {
      trustScore.maxDatesPerWeek = 1;
    } else if (trustScore.overallScore! < 70) {
      trustScore.maxDatesPerWeek = 2;
    } else {
      trustScore.maxDatesPerWeek = 3;
    }
  }

  private async calculateProfileCompleteness(userId: number): Promise<number> {
    const query = `
      SELECT 
        CASE WHEN first_name IS NOT NULL AND first_name != '' THEN 1 ELSE 0 END +
        CASE WHEN last_name IS NOT NULL AND last_name != '' THEN 1 ELSE 0 END +
        CASE WHEN bio IS NOT NULL AND bio != '' THEN 1 ELSE 0 END +
        CASE WHEN images IS NOT NULL AND array_length(images, 1) > 0 THEN 1 ELSE 0 END +
        CASE WHEN dob IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN gender IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN current_city IS NOT NULL AND current_city != '' THEN 1 ELSE 0 END +
        CASE WHEN exercise IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN education_level IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN drinking IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN smoking IS NOT NULL THEN 1 ELSE 0 END as completed_fields
      FROM datifyy_users_information 
      WHERE user_login_id = $1
    `;

    const result = await this.dataSource.query(query, [userId]);
    const completedFields = result[0]?.completed_fields || 0;
    return Math.round((completedFields / 11) * 100); // 11 total fields
  }

  private async logTrustScoreAdjustment(
    queryRunner: any,
    userId: number,
    adminId: number,
    reason: TrustScoreAdjustmentReason,
    updates: TrustScoreUpdate
  ): Promise<void> {
    // This would typically insert into an admin activity log table
    this.logger.info("Trust score adjustment logged", {
      userId,
      adminId,
      reason,
      updates,
      timestamp: new Date(),
    });
  }

  private mapToAdminUserTrustScore(
    trustScore: DatifyyUserTrustScores
  ): AdminUserTrustScore {
    return {
      id: trustScore.id,
      overallScore: trustScore.overallScore || 100,
      attendanceScore: trustScore.attendanceScore || 100,
      punctualityScore: trustScore.punctualityScore || 100,
      feedbackScore: trustScore.feedbackScore || 100,
      profileCompletenessScore: trustScore.profileCompletenessScore || 0,
      totalDatesAttended: trustScore.totalDatesAttended || 0,
      totalDatesCancelled: trustScore.totalDatesCancelled || 0,
      totalDatesNoShow: trustScore.totalDatesNoShow || 0,
      lastMinuteCancellations: trustScore.lastMinuteCancellations || 0,
      averageRating: parseFloat(trustScore.averageRating || "0"),
      consecutiveCancellations: trustScore.consecutiveCancellations || 0,
      lastCancellationDate: trustScore.lastCancellationDate,
      warningLevel: trustScore.warningLevel || 0,
      isOnProbation: trustScore.isOnProbation || false,
      probationUntil: trustScore.probationUntil,
      secondDateRate: parseFloat(trustScore.secondDateRate || "0"),
      positiveFeedbackCount: trustScore.positiveFeedbackCount || 0,
      complimentsReceived: trustScore.complimentsReceived || 0,
      canBookDates: trustScore.canBookDates !== false,
      maxDatesPerWeek: trustScore.maxDatesPerWeek || 3,
      requiresAdminApproval: trustScore.requiresAdminApproval || false,
      lastCalculatedAt: trustScore.lastCalculatedAt || new Date(),
      calculationReason: trustScore.calculationReason,
      adminOverrideReason: trustScore.adminOverrideReason,
      manualAdjustmentAt: trustScore.manualAdjustmentAt,
    };
  }
}
