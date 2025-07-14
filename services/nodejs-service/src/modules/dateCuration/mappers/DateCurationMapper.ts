// services/nodejs-service/src/modules/dateCuration/mappers/DateCurationMapper.ts
import { Logger } from "../../../infrastructure/logging/Logger";
import { DatifyyCuratedDates } from "../../../models/entities/DatifyyCuratedDates";
import { DatifyyCuratedDateFeedback } from "../../../models/entities/DatifyyCuratedDateFeedback";
import { DatifyyUserTrustScores } from "../../../models/entities/DatifyyUserTrustScores";
import { DatifyyDateSeries } from "../../../models/entities/DatifyyDateSeries";
import {
  CuratedDateResponse,
  DateFeedbackResponse,
  UserTrustScoreResponse,
  DateSeriesResponse,
  PotentialMatchResponse,
  CuratedDateStatus,
} from "@datifyy/shared-types";
import { DateMode } from "@datifyy/shared-types";

export class DateCurationMapper {
  constructor(private readonly logger: Logger) {}

  toCuratedDateResponse(
    date: DatifyyCuratedDates,
    currentUserId?: number
  ): CuratedDateResponse {
    const now = new Date();
    const dateTime = new Date(date.dateTime);
    const hoursUntilDate =
      (dateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    return {
      id: date.id,
      user1Id: date.user1Id,
      user2Id: date.user2Id,
      dateTime: date.dateTime.toISOString(),
      durationMinutes: date.durationMinutes || 0,
      mode: date.mode as DateMode,
      locationName: date.locationName || undefined,
      locationAddress: date.locationAddress || undefined,
      locationCoordinates: date.locationCoordinates as any,
      locationGoogleMapsUrl: date.locationGoogleMapsUrl || undefined,
      meetingLink: date.meetingLink || undefined,
      meetingId: date.meetingId || undefined,
      meetingPassword: date.meetingPassword || undefined,
      // @ts-ignore
      status: date.status as CuratedDateStatus,
      dateSeriesId: date.dateSeriesId || undefined,
      dateNumberInSeries: date.dateNumberInSeries ?? 0,
      adminNotes: date.adminNotes || undefined,
      specialInstructions: date.specialInstructions || undefined,
      dressCode: date.dressCode || undefined,
      suggestedConversationTopics:
        date.suggestedConversationTopics || undefined,
      user1ConfirmedAt: date.user1ConfirmedAt?.toISOString(),
      user2ConfirmedAt: date.user2ConfirmedAt?.toISOString(),

      // Fixed: Use cancelledByUser relation instead of cancelledByUserId
      cancelledByUserId: date.cancelledByUser?.id || undefined,
      cancelledAt: date.cancelledAt?.toISOString(),
      cancellationReason: date.cancellationReason || undefined,
      cancellationCategory: date.cancellationCategory as any,
      completedAt: date.completedAt?.toISOString(),
      actualDurationMinutes: date.actualDurationMinutes || undefined,

      // Fixed: Use correct property names with underscores
      reminderSent24h: date.reminderSent_24h ?? false,
      reminderSent2h: date.reminderSent_2h ?? false,
      followUpSent: date.followUpSent ?? false,

      compatibilityScore: date.compatibilityScore || undefined,
      matchReason: date.matchReason || undefined,
      algorithmConfidence: date.algorithmConfidence
        ? parseFloat(date.algorithmConfidence)
        : undefined,
      tokensCostUser1: date.tokensCostUser1 ?? 0,
      tokensCostUser2: date.tokensCostUser2 ?? 0,
      curatedBy: date.curatedBy?.id,
      curatedAt: date.curatedAt?.toISOString() || new Date().toISOString(),
      updatedBy: date.updatedBy?.id || undefined,

      // Fixed: Handle null updatedAt
      updatedAt: date.updatedAt?.toISOString() || new Date().toISOString(),

      // User info (if available)
      user1Info: date.user1
        ? {
            id: date.user1.id,
            firstName: "User", // Would get from users_information
            lastName: "1",
            age: 25, // Would calculate from DOB
            verificationStatus: {
              email: true,
              phone: false,
              identity: false,
            },
          }
        : undefined,

      user2Info: date.user2
        ? {
            id: date.user2.id,
            firstName: "User",
            lastName: "2",
            age: 27,
            verificationStatus: {
              email: true,
              phone: false,
              identity: false,
            },
          }
        : undefined,

      // Fixed: Use curatedBy relation instead of curator
      curatorInfo: date.curatedBy
        ? {
            id: date.curatedBy.id,
            firstName: "Admin",
            lastName: "User",
          }
        : undefined,

      // Helper fields
      canCancel: currentUserId
        ? this.canCancelDate(date, currentUserId, hoursUntilDate)
        : false,
      canConfirm: currentUserId
        ? this.canConfirmDate(date, currentUserId)
        : false,
      requiresConfirmation: currentUserId
        ? this.requiresConfirmation(date, currentUserId)
        : false,
      hoursUntilDate: Math.max(0, Math.round(hoursUntilDate)),
      formattedDateTime: dateTime.toLocaleString(),
      isUpcoming: dateTime > now,
      canSubmitFeedback: currentUserId
        ? this.canSubmitFeedback(date, currentUserId)
        : false,
    };
  }

  toDateFeedbackResponse(
    feedback: DatifyyCuratedDateFeedback,
    date?: DatifyyCuratedDates
  ): DateFeedbackResponse {
    return {
      id: feedback.id,
      curatedDateId: feedback.curatedDateId,
      userId: feedback.userId,
      overallRating: feedback.overallRating || undefined,
      wouldMeetAgain: feedback.wouldMeetAgain || undefined,
      chemistryRating: feedback.chemistryRating || undefined,
      conversationQuality: feedback.conversationQuality || undefined,
      whatWentWell: feedback.whatWentWell || undefined,
      whatCouldImprove: feedback.whatCouldImprove || undefined,
      favoriteMoment: feedback.favoriteMoment || undefined,
      partnerPunctuality: feedback.partnerPunctuality || undefined,
      partnerAppearanceMatch: feedback.partnerAppearanceMatch || undefined,
      suggestedImprovements: feedback.suggestedImprovements || undefined,
      preferredNextDateActivity:
        feedback.preferredNextDateActivity || undefined,
      preferredNextDateTiming: feedback.preferredNextDateTiming || undefined,

      // Fixed: Handle null values properly for boolean fields
      safetyConcerns: feedback.safetyConcerns ?? false,
      redFlags: feedback.redFlags || undefined,
      reportUser: feedback.reportUser ?? false,
      reportReason: feedback.reportReason || undefined,

      venueRating: feedback.venueRating || undefined,
      timingSatisfaction: feedback.timingSatisfaction || undefined,
      durationSatisfaction: feedback.durationSatisfaction || undefined,
      interestedInSecondDate: feedback.interestedInSecondDate || undefined,
      preferredContactMethod: feedback.preferredContactMethod || undefined,
      additionalComments: feedback.additionalComments || undefined,
      submittedAt:
        feedback.submittedAt?.toISOString() || new Date().toISOString(),
      isAnonymous: feedback.isAnonymous ?? false,

      dateInfo: date
        ? {
            id: date.id,
            dateTime: date.dateTime.toISOString(),
            mode: date.mode as DateMode,
            locationName: date.locationName || undefined,
            partnerName: "Date Partner", // Would get actual name from user info
          }
        : undefined,

      canEdit: this.canEditFeedback(feedback),
      submissionDeadline: date ? this.getSubmissionDeadline(date) : undefined,
    };
  }

  toUserTrustScoreResponse(
    trustScore: DatifyyUserTrustScores
  ): UserTrustScoreResponse {
    return {
      id: trustScore.id,
      userId: trustScore.userId,
      overallScore: trustScore.overallScore ?? 100,
      attendanceScore: trustScore.attendanceScore ?? 100,
      punctualityScore: trustScore.punctualityScore ?? 100,
      feedbackScore: trustScore.feedbackScore ?? 100,
      profileCompletenessScore: trustScore.profileCompletenessScore ?? 0,
      totalDatesAttended: trustScore.totalDatesAttended ?? 0,
      totalDatesCancelled: trustScore.totalDatesCancelled ?? 0,
      totalDatesNoShow: trustScore.totalDatesNoShow ?? 0,
      lastMinuteCancellations: trustScore.lastMinuteCancellations ?? 0,
      averageRating: parseFloat(trustScore.averageRating || "0.00"),
      consecutiveCancellations: trustScore.consecutiveCancellations ?? 0,
      lastCancellationDate: trustScore.lastCancellationDate?.toISOString(),
      warningLevel: trustScore.warningLevel ?? 0,
      isOnProbation: trustScore.isOnProbation ?? false,
      probationUntil: trustScore.probationUntil?.toISOString(),
      secondDateRate: parseFloat(trustScore.secondDateRate || "0.00"),
      positiveFeedbackCount: trustScore.positiveFeedbackCount ?? 0,
      complimentsReceived: trustScore.complimentsReceived ?? 0,
      canBookDates: trustScore.canBookDates ?? true,
      maxDatesPerWeek: trustScore.maxDatesPerWeek ?? 3,
      requiresAdminApproval: trustScore.requiresAdminApproval ?? false,
      lastCalculatedAt:
        trustScore.lastCalculatedAt?.toISOString() || new Date().toISOString(),
      calculationReason: trustScore.calculationReason || undefined,

      scoreBreakdown: {
        attendance: {
          score: trustScore.attendanceScore ?? 100,
          description: this.getAttendanceDescription(
            trustScore.attendanceScore ?? 100
          ),
          impactFactors: this.getAttendanceImpactFactors(trustScore),
        },
        punctuality: {
          score: trustScore.punctualityScore ?? 100,
          description: this.getPunctualityDescription(
            trustScore.punctualityScore ?? 100
          ),
          impactFactors: this.getPunctualityImpactFactors(trustScore),
        },
        feedback: {
          score: trustScore.feedbackScore ?? 100,
          description: this.getFeedbackDescription(
            trustScore.feedbackScore ?? 100
          ),
          impactFactors: this.getFeedbackImpactFactors(trustScore),
        },
        profileCompleteness: {
          score: trustScore.profileCompletenessScore ?? 0,
          description: this.getProfileCompletenessDescription(
            trustScore.profileCompletenessScore ?? 0
          ),
          impactFactors: this.getProfileCompletenessImpactFactors(trustScore),
        },
      },

      recommendations: this.getTrustScoreRecommendations(trustScore),
      nextReviewDate: this.getNextReviewDate(trustScore),
      comparisonToAverage: {
        betterThan: 65, // Would calculate from all users
        categoryRanking: this.getCategoryRanking(
          trustScore.overallScore ?? 100
        ),
      },
    };
  }

  toDateSeriesResponse(
    series: DatifyyDateSeries,
    currentUserId?: number
  ): DateSeriesResponse {
    return {
      id: series.id,
      user1Id: series.user1Id,
        user2Id: series.user2Id,
       // @ts-ignore
      seriesStatus: series.seriesStatus || "active",
      totalDatesInSeries: series.totalDatesInSeries ?? 0,
      lastDateAt: series.lastDateAt?.toISOString(),
        nextSuggestedDate: series.nextSuggestedDate?.toISOString(),
       // @ts-ignore
      relationshipStage: series.relationshipStage || "getting_to_know",
      mutualInterestLevel: series.mutualInterestLevel || undefined,
      adminNotes: series.adminNotes || undefined,
      preferredDateFrequency: series.preferredDateFrequency || undefined,
      preferredDateTypes: series.preferredDateTypes || undefined,
      seriesEndedReason: series.seriesEndedReason || undefined,
      endedByUserId: series.endedByUser?.id || undefined,
      endedAt: series.endedAt?.toISOString(),
      finalOutcome: series.finalOutcome || undefined,
      createdAt: series.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: series.updatedAt?.toISOString() || new Date().toISOString(),

      user1Info: {
        id: series.user1Id,
        firstName: "User",
        lastName: "1",
      },

      user2Info: {
        id: series.user2Id,
        firstName: "User",
        lastName: "2",
      },

      datesInSeries: [], // Would be populated if relations are loaded

        progressionSummary: {
           // @ts-ignore
        currentStage: series.relationshipStage || "getting_to_know",
        stageProgress: this.calculateStageProgress(series),
        nextMilestone: this.getNextMilestone(series),
        recommendations: this.getSeriesRecommendations(series),
      },

      seriesStats: {
        averageRating: 4.2, // Would calculate from feedback
        mutualInterestTrend: "increasing" as const,
        recommendNextDate: (series.seriesStatus || "active") === "active",
        suggestedNextActivity: this.getSuggestedNextActivity(series),
      },
    };
  }

  toPotentialMatchResponse(
    user: any,
    searcherUserId: number
  ): PotentialMatchResponse {
    return {
      userId: user.id,
      userInfo: {
        id: user.id,
        firstName: user.firstName || "User",
        lastName: user.lastName || "",
        profileImage: user.images?.[0],
        age: this.calculateAge(user.dob),
        location: user.currentCity || "Unknown",
        bio: user.bio,
        interests: [], // Would get from user preferences
        verificationStatus: {
          email: true,
          phone: false,
          identity: false,
        },
      },
      compatibilityScore: Math.floor(Math.random() * 40) + 60, // Mock score
      matchReasons: [
        "Similar interests",
        "Compatible age range",
        "Shared values",
      ],
      sharedInterests: ["Technology", "Travel", "Fitness"],
      totalPreviousDates: 0,
      trustScore: 85,
      availabilityNext7Days: 3,
      estimatedResponseTime: "within 2 hours",
    };
  }

  // Helper methods
  private canCancelDate(
    date: DatifyyCuratedDates,
    userId: number,
    hoursUntilDate: number
  ): boolean {
    if (
      date.status === CuratedDateStatus.CANCELLED ||
      date.status === CuratedDateStatus.COMPLETED
    ) {
      return false;
    }

    if (date.user1Id !== userId && date.user2Id !== userId) {
      return false;
    }

    return hoursUntilDate > 0;
  }

  private canConfirmDate(date: DatifyyCuratedDates, userId: number): boolean {
    if (
      date.status === CuratedDateStatus.CANCELLED ||
      date.status === CuratedDateStatus.COMPLETED
    ) {
      return false;
    }

    const isUser1 = date.user1Id === userId;
    const isUser2 = date.user2Id === userId;

    if (!isUser1 && !isUser2) {
      return false;
    }

    // Check if already confirmed
    if (
      (isUser1 && date.user1ConfirmedAt) ||
      (isUser2 && date.user2ConfirmedAt)
    ) {
      return false;
    }

    return new Date(date.dateTime) > new Date();
  }

  private requiresConfirmation(
    date: DatifyyCuratedDates,
    userId: number
  ): boolean {
    return (
      this.canConfirmDate(date, userId) &&
      date.status === CuratedDateStatus.PENDING
    );
  }

  private canSubmitFeedback(
    date: DatifyyCuratedDates,
    userId: number
  ): boolean {
    return (
      date.status === CuratedDateStatus.COMPLETED &&
      (date.user1Id === userId || date.user2Id === userId)
    );
  }

  private canEditFeedback(feedback: DatifyyCuratedDateFeedback): boolean {
    if (!feedback.submittedAt) return false;
    const hoursAfterSubmission =
      (new Date().getTime() - new Date(feedback.submittedAt).getTime()) /
      (1000 * 60 * 60);
    return hoursAfterSubmission <= 24;
  }

  private getSubmissionDeadline(date: DatifyyCuratedDates): string | undefined {
    if (!date.completedAt) return undefined;

    const deadline = new Date(date.completedAt);
    deadline.setHours(deadline.getHours() + 48);
    return deadline.toISOString();
  }

  private calculateAge(dob: string): number {
    if (!dob) return 25; // Default age

    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      return age - 1;
    }

    return age;
  }

  private getAttendanceDescription(score: number): string {
    if (score >= 90) return "Excellent attendance record";
    if (score >= 70) return "Good attendance record";
    if (score >= 50) return "Fair attendance record";
    return "Poor attendance record";
  }

  private getPunctualityDescription(score: number): string {
    if (score >= 90) return "Always punctual";
    if (score >= 70) return "Usually punctual";
    if (score >= 50) return "Sometimes late";
    return "Frequently late";
  }

  private getFeedbackDescription(score: number): string {
    if (score >= 90) return "Receives excellent feedback";
    if (score >= 70) return "Receives positive feedback";
    if (score >= 50) return "Receives mixed feedback";
    return "Receives concerning feedback";
  }

  private getProfileCompletenessDescription(score: number): string {
    if (score >= 90) return "Complete and detailed profile";
    if (score >= 70) return "Well-developed profile";
    if (score >= 50) return "Basic profile information";
    return "Incomplete profile";
  }

  private getAttendanceImpactFactors(
    trustScore: DatifyyUserTrustScores
  ): string[] {
    const factors = [];
    if ((trustScore.totalDatesAttended ?? 0) > 5)
      factors.push("Multiple completed dates");
    if ((trustScore.totalDatesCancelled ?? 0) > 2)
      factors.push("Some cancelled dates");
    if ((trustScore.totalDatesNoShow ?? 0) > 0)
      factors.push("No-show incidents");
    return factors;
  }

  private getPunctualityImpactFactors(
    trustScore: DatifyyUserTrustScores
  ): string[] {
    return ["Based on date partner feedback"];
  }

  private getFeedbackImpactFactors(
    trustScore: DatifyyUserTrustScores
  ): string[] {
    const factors = [];
    if ((trustScore.positiveFeedbackCount ?? 0) > 3)
      factors.push("Multiple positive reviews");
    if (parseFloat(trustScore.averageRating || "0") > 4)
      factors.push("High average rating");
    return factors;
  }

  private getProfileCompletenessImpactFactors(
    trustScore: DatifyyUserTrustScores
  ): string[] {
    return ["Profile information completeness", "Verification status"];
  }

  private getTrustScoreRecommendations(
    trustScore: DatifyyUserTrustScores
  ): string[] {
    const recommendations = [];

    if ((trustScore.profileCompletenessScore ?? 0) < 80) {
      recommendations.push("Complete your profile information");
    }

    if ((trustScore.consecutiveCancellations ?? 0) > 1) {
      recommendations.push("Avoid cancelling dates to improve reliability");
    }

    if (parseFloat(trustScore.averageRating || "0") < 4) {
      recommendations.push("Focus on being punctual and engaged during dates");
    }

    return recommendations;
  }

  private getNextReviewDate(trustScore: DatifyyUserTrustScores): string {
    const lastCalculated = trustScore.lastCalculatedAt || new Date();
    const nextReview = new Date(lastCalculated);
    nextReview.setDate(nextReview.getDate() + 30);
    return nextReview.toISOString();
  }

  private getCategoryRanking(score: number): string {
    if (score >= 90) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Fair";
    return "Poor";
  }

  private calculateStageProgress(series: DatifyyDateSeries): number {
    const stageOrder = [
      "getting_to_know",
      "building_connection",
      "strong_interest",
      "exclusive_dating",
      "relationship",
    ];
    const currentIndex = stageOrder.indexOf(
      series.relationshipStage || "getting_to_know"
    );
    return Math.round(((currentIndex + 1) / stageOrder.length) * 100);
  }

  private getNextMilestone(series: DatifyyDateSeries): string | undefined {
    const milestones = {
      getting_to_know: "Building deeper connection",
      building_connection: "Showing strong mutual interest",
      strong_interest: "Considering exclusivity",
      exclusive_dating: "Relationship potential",
      relationship: "Long-term commitment",
    };
      
    // @ts-ignore
    return milestones[series.relationshipStage || "getting_to_know"];
  }

  private getSeriesRecommendations(series: DatifyyDateSeries): string[] {
    const recommendations = [];

    if ((series.totalDatesInSeries ?? 0) === 1) {
      recommendations.push("Schedule a second date to build connection");
    } else if ((series.totalDatesInSeries ?? 0) >= 3) {
      recommendations.push("Consider planning more intimate activities");
    }

    return recommendations;
  }

  private getSuggestedNextActivity(
    series: DatifyyDateSeries
  ): string | undefined {
    const activities = new Map([
      ["getting_to_know", "Coffee or casual lunch"],
      ["building_connection", "Activity-based date"],
      ["strong_interest", "Dinner or cooking together"],
      ["exclusive_dating", "Weekend getaway"],
      ["relationship", "Meeting friends or family"],
    ]);
    return activities.get(series.relationshipStage || "getting_to_know");
  }
}
