// services/nodejs-service/src/modules/dateCuration/mappers/DateCurationMapper.ts
import { Logger } from "../../../infrastructure/logging/Logger";
import { DatifyyCuratedDates } from "../../../models/entities/DatifyyCuratedDates";
import { DatifyyCuratedDateFeedback } from "../../../models/entities/DatifyyCuratedDateFeedback";
import { DatifyyUserTrustScores } from "../../../models/entities/DatifyyUserTrustScores";
import { DatifyyDateSeries } from "../../../models/entities/DatifyyDateSeries";
import {
} from "../../../proto-types/dating/curated_dates";
import { UserTrustScoreResponse } from "../../../proto-types/admin/user_management";
import { CuratedDateResponse, SearchPotentialMatchesResponse } from "../../../proto-types/dating/curation";
import { CuratedDateStatus, DateFeedbackResponse, DateSeriesResponse } from "../../../proto-types";

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
      success: true,
      message: '',
      data: {
        id: date.id,
        user1Id: date.user1Id,
        user2Id: date.user2Id,
        dateType: 'DATE_TYPE_COFFEE' as any,
        status: date.status as CuratedDateStatus,
        venueName: date.locationName || '',
        venueAddress: date.locationAddress || '',
        venueCoordinates: date.locationCoordinates as any,
        scheduledDate: date.dateTime.toISOString().split('T')[0],
        scheduledTime: date.dateTime.toISOString().split('T')[1],
        estimatedCost: date.tokensCostUser1 || 0,
        specialInstructions: date.specialInstructions || '',
        workflowStage: 'CURATION_WORKFLOW_STAGE_COMPLETED' as any,
        curatorAdminId: date.curatedBy?.id || 0,
        createdAt: date.curatedAt?.toISOString() || new Date().toISOString(),
        updatedAt: date.updatedAt?.toISOString() || new Date().toISOString(),
        confirmedAt: date.user1ConfirmedAt?.toISOString() || date.user2ConfirmedAt?.toISOString() || '',
        cancelledAt: date.cancelledAt?.toISOString() || '',
        cancellationCategory: date.cancellationCategory as any,
        cancellationReason: date.cancellationReason || '',
        cancelledByUserId: date.cancelledByUser?.id || 0,
      }
    } as any;
  }

  toDateFeedbackResponse(
    feedback: DatifyyCuratedDateFeedback,
    date?: DatifyyCuratedDates
  ): DateFeedbackResponse {
    return {
      success: true,
      message: '',
      data: {
        id: feedback.id.toString(),
        curatedDateId: feedback.curatedDateId.toString(),
        userId: feedback.userId,
        overallRating: feedback.overallRating || 0,
        venueRating: feedback.venueRating || 0,
        partnerRating: 0,
        curationRating: 0,
        feedbackText: feedback.additionalComments || '',
        wouldRecommendVenue: false,
        wouldDatePartnerAgain: feedback.wouldMeetAgain || false,
        improvementSuggestions: [],
        isAnonymous: feedback.isAnonymous || false,
        submittedAt: feedback.submittedAt?.toISOString() || new Date().toISOString(),
      } as any
    };
  }

  toUserTrustScoreResponse(
    trustScore: DatifyyUserTrustScores
  ): UserTrustScoreResponse {
    return {
      success: true,
      message: '',
      data: {
        score: trustScore.overallScore ?? 100,
        level: 'USER_TRUST_SCORE_LEVEL_MEDIUM' as any,
        lastUpdated: trustScore.lastCalculatedAt?.toISOString() || new Date().toISOString(),
        factors: []
      }
    } as any;
  }

  toDateSeriesResponse(
    series: DatifyyDateSeries,
    currentUserId?: number
  ): DateSeriesResponse {
    return {
      success: true,
      message: '',
      data: {
        id: series.id,
        name: `Date Series ${series.id}`,
        description: `Date series between users ${series.user1Id} and ${series.user2Id}`,
        user1Id: series.user1Id,
        user2Id: series.user2Id,
        curatedDateIds: [],
        totalDates: series.totalDatesInSeries ?? 0,
        completedDates: 0,
        relationshipStage: series.relationshipStage as any,
        isActive: true,
        createdAt: series.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: series.updatedAt?.toISOString() || new Date().toISOString(),
      } as any
    };
  }

  toPotentialMatchResponse(
    user: any,
    searcherUserId: number
  ): SearchPotentialMatchesResponse {
    return {
      success: true,
      message: '',
      matches: [{
        userId: user.id,
        firstName: user.firstName || "User",
        lastName: user.lastName || "",
        age: this.calculateAge(user.dob),
        location: user.currentCity || "Unknown",
        interests: [],
        compatibilityScore: Math.floor(Math.random() * 40) + 60,
        distanceKm: 5,
        profileImageUrl: user.images?.[0] || '',
        isVerified: true,
      }],
      totalMatches: 1,
    };
  }

  private calculateAge(dob: string): number {
    if (!dob) return 25;
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  }

  private canCancelDate(
    date: DatifyyCuratedDates,
    userId: number,
    hoursUntilDate: number
  ): boolean {
    if (
      date.status === CuratedDateStatus.CURATED_DATE_STATUS_CANCELLED ||
      date.status === CuratedDateStatus.CURATED_DATE_STATUS_COMPLETED
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
      date.status === CuratedDateStatus.CURATED_DATE_STATUS_CANCELLED ||
      date.status === CuratedDateStatus.CURATED_DATE_STATUS_COMPLETED
    ) {
      return false;
    }
    const isUser1 = date.user1Id === userId;
    const isUser2 = date.user2Id === userId;
    if (!isUser1 && !isUser2) {
      return false;
    }
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
      date.status === CuratedDateStatus.CURATED_DATE_STATUS_PENDING
    );
  }

  private canSubmitFeedback(
    date: DatifyyCuratedDates,
    userId: number
  ): boolean {
    return (
      date.status === CuratedDateStatus.CURATED_DATE_STATUS_COMPLETED &&
      (date.user1Id === userId || date.user2Id === userId)
    );
  }
}