// libs/shared-types/src/interfaces/dateCuration.interfaces.ts

/**
 * Date Curation API Interfaces
 * 
 * Comprehensive request/response DTOs for admin-curated dating system.
 * Based on DatifyyCuratedDates and related models.
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */

import { ApiResponse, PaginationRequest, PaginationResponse } from './api.interfaces';

/**
 * Date mode types
 */
export enum DateMode {
  ONLINE = 'online',
  OFFLINE = 'offline'
}

/**
 * Curated date status types
 */
export enum CuratedDateStatus {
  PENDING = 'pending',
  USER1_CONFIRMED = 'user1_confirmed', 
  USER2_CONFIRMED = 'user2_confirmed',
  BOTH_CONFIRMED = 'both_confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  NO_SHOW = 'no_show'
}

/**
 * Date series relationship stages
 */
export enum RelationshipStage {
  GETTING_TO_KNOW = 'getting_to_know',
  BUILDING_CONNECTION = 'building_connection', 
  STRONG_INTEREST = 'strong_interest',
  EXCLUSIVE_DATING = 'exclusive_dating',
  RELATIONSHIP = 'relationship'
}

/**
 * Cancellation categories
 */
export enum CancellationCategory {
  NO_TIME = 'no_time',
  NOT_INTERESTED = 'not_interested',
  EMERGENCY = 'emergency', 
  OTHER = 'other'
}

/**
 * Workflow stages for admin curation
 */
export enum CurationWorkflowStage {
  USER_SELECTION = 'user_selection',
  COMPATIBILITY_CHECK = 'compatibility_check',
  SCHEDULING = 'scheduling',
  CONFIRMATION = 'confirmation',
  REMINDER_SENT = 'reminder_sent', 
  COMPLETED = 'completed',
  FEEDBACK_COLLECTED = 'feedback_collected'
}

/**
 * Stage status for workflow tracking
 */
export enum WorkflowStageStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

// Export type unions for backward compatibility
export type DateModeValue = `${DateMode}`;
export type CuratedDateStatusValue = `${CuratedDateStatus}`;
export type RelationshipStageValue = `${RelationshipStage}`;
export type CancellationCategoryValue = `${CancellationCategory}`;
export type CurationWorkflowStageValue = `${CurationWorkflowStage}`;
export type WorkflowStageStatusValue = `${WorkflowStageStatus}`;

// Helper functions to get enum values as arrays
export const getDateModeValues = (): string[] => Object.values(DateMode);
export const getCuratedDateStatusValues = (): string[] => Object.values(CuratedDateStatus);
export const getRelationshipStageValues = (): string[] => Object.values(RelationshipStage);
export const getCancellationCategoryValues = (): string[] => Object.values(CancellationCategory);
export const getCurationWorkflowStageValues = (): string[] => Object.values(CurationWorkflowStage);
export const getWorkflowStageStatusValues = (): string[] => Object.values(WorkflowStageStatus);

/**
 * Core curated date interface
 */
export interface CuratedDate {
  readonly id: number;
  readonly user1Id: number;
  readonly user2Id: number;
  readonly dateTime: string; // ISO string
  readonly durationMinutes: number;
  readonly mode: DateMode;
  
  // Location details (for offline dates)
  readonly locationName?: string;
  readonly locationAddress?: string;
  readonly locationCoordinates?: {
    readonly lat: number;
    readonly lng: number;
  };
  readonly locationGoogleMapsUrl?: string;
  
  // Online meeting details
  readonly meetingLink?: string;
  readonly meetingId?: string;
  readonly meetingPassword?: string;
  
  // Status and tracking
  readonly status: CuratedDateStatus;
  readonly dateSeriesId?: string;
  readonly dateNumberInSeries: number;
  
  // Admin instructions
  readonly adminNotes?: string;
  readonly specialInstructions?: string;
  readonly dressCode?: string;
  readonly suggestedConversationTopics?: string[];
  
  // Confirmation tracking
  readonly user1ConfirmedAt?: string;
  readonly user2ConfirmedAt?: string;
  
  // Cancellation details
  readonly cancelledByUserId?: number;
  readonly cancelledAt?: string;
  readonly cancellationReason?: string;
  readonly cancellationCategory?: CancellationCategory;
  
  // Completion tracking
  readonly completedAt?: string;
  readonly actualDurationMinutes?: number;
  
  // Notifications
  readonly reminderSent24h: boolean;
  readonly reminderSent2h: boolean;
  readonly followUpSent: boolean;
  
  // Matching details
  readonly compatibilityScore?: number;
  readonly matchReason?: string;
  readonly algorithmConfidence?: number;
  
  // Token costs
  readonly tokensCostUser1: number;
  readonly tokensCostUser2: number;
  
  // Audit fields
  readonly curatedBy: number;
  readonly curatedAt: string;
  readonly updatedBy?: number;
  readonly updatedAt: string;
}

/**
 * Date feedback interface
 */
export interface DateFeedback {
  readonly id: number;
  readonly curatedDateId: number;
  readonly userId: number;
  
  // Overall experience ratings (1-5)
  readonly overallRating?: number;
  readonly wouldMeetAgain?: boolean;
  readonly chemistryRating?: number;
  readonly conversationQuality?: number;
  
  // Text feedback
  readonly whatWentWell?: string;
  readonly whatCouldImprove?: string;
  readonly favoriteMoment?: string;
  
  // Partner evaluation (1-5)
  readonly partnerPunctuality?: number;
  readonly partnerAppearanceMatch?: number;
  
  // Future preferences
  readonly suggestedImprovements?: string;
  readonly preferredNextDateActivity?: string;
  readonly preferredNextDateTiming?: string;
  
  // Safety and concerns
  readonly safetyConcerns: boolean;
  readonly redFlags?: string[];
  readonly reportUser: boolean;
  readonly reportReason?: string;
  
  // Logistics feedback (1-5)
  readonly venueRating?: number;
  readonly timingSatisfaction?: number;
  readonly durationSatisfaction?: number;
  
  // Follow-up intentions
  readonly interestedInSecondDate?: boolean;
  readonly preferredContactMethod?: string;
  readonly additionalComments?: string;
  
  // Metadata
  readonly submittedAt: string;
  readonly isAnonymous: boolean;
}

/**
 * User trust score interface
 */
export interface UserTrustScore {
  readonly id: number;
  readonly userId: number;
  
  // Score components (0-100)
  readonly overallScore: number;
  readonly attendanceScore: number;
  readonly punctualityScore: number;
  readonly feedbackScore: number;
  readonly profileCompletenessScore: number;
  
  // Statistics
  readonly totalDatesAttended: number;
  readonly totalDatesCancelled: number;
  readonly totalDatesNoShow: number;
  readonly lastMinuteCancellations: number;
  readonly averageRating: number;
  
  // Behavioral tracking
  readonly consecutiveCancellations: number;
  readonly lastCancellationDate?: string;
  readonly warningLevel: number; // 0-3
  readonly isOnProbation: boolean;
  readonly probationUntil?: string;
  
  // Positive metrics
  readonly secondDateRate: number;
  readonly positiveFeedbackCount: number;
  readonly complimentsReceived: number;
  
  // Account restrictions
  readonly canBookDates: boolean;
  readonly maxDatesPerWeek: number;
  readonly requiresAdminApproval: boolean;
  
  // Audit
  readonly lastCalculatedAt: string;
  readonly calculationReason?: string;
}

/**
 * Date series interface
 */
export interface DateSeries {
  readonly id: string;
  readonly user1Id: number;
  readonly user2Id: number;
  
  // Series metadata
  readonly seriesStatus: 'active' | 'paused' | 'ended';
  readonly totalDatesInSeries: number;
  readonly lastDateAt?: string;
  readonly nextSuggestedDate?: string;
  
  // Progression
  readonly relationshipStage: RelationshipStage;
  readonly mutualInterestLevel?: number; // 1-5
  readonly adminNotes?: string;
  
  // Preferences
  readonly preferredDateFrequency?: string;
  readonly preferredDateTypes?: string[];
  
  // Outcome tracking
  readonly seriesEndedReason?: string;
  readonly endedByUserId?: number;
  readonly endedAt?: string;
  readonly finalOutcome?: string;
  
  // Audit
  readonly createdAt: string;
  readonly updatedAt: string;
}

// ============================================================================
// REQUEST DTOs
// ============================================================================

/**
 * Admin create curated date request
 */
export interface CreateCuratedDateRequest {
  readonly user1Id: number;
  readonly user2Id: number;
  readonly dateTime: string; // ISO string
  readonly durationMinutes?: number;
  readonly mode: DateMode;
  
  // Location (for offline dates)
  readonly locationName?: string;
  readonly locationAddress?: string;
  readonly locationCoordinates?: {
    readonly lat: number;
    readonly lng: number;
  };
  
  // Online meeting (for online dates)
  readonly meetingLink?: string;
  readonly meetingId?: string;
  readonly meetingPassword?: string;
  
  // Admin instructions
  readonly adminNotes?: string;
  readonly specialInstructions?: string;
  readonly dressCode?: string;
  readonly suggestedConversationTopics?: string[];
  
  // Matching context
  readonly compatibilityScore?: number;
  readonly matchReason?: string;
  readonly algorithmConfidence?: number;
  
  // Token costs
  readonly tokensCostUser1?: number;
  readonly tokensCostUser2?: number;
}

/**
 * Update curated date request
 */
export interface UpdateCuratedDateRequest {
  readonly dateTime?: string;
  readonly durationMinutes?: number;
  readonly mode?: DateMode;
  readonly locationName?: string;
  readonly locationAddress?: string;
  readonly locationCoordinates?: {
    readonly lat: number;
    readonly lng: number;
  };
  readonly meetingLink?: string;
  readonly meetingId?: string;
  readonly meetingPassword?: string;
  readonly adminNotes?: string;
  readonly specialInstructions?: string;
  readonly dressCode?: string;
  readonly suggestedConversationTopics?: string[];
  readonly status?: CuratedDateStatus;
}

/**
 * User confirm date request
 */
export interface ConfirmDateRequest {
  readonly confirmed: boolean;
  readonly notes?: string;
}

/**
 * Cancel date request
 */
export interface CancelDateRequest {
  readonly reason: string;
  readonly category: CancellationCategory;
  readonly notifyPartner?: boolean;
  readonly refundTokens?: boolean;
}

/**
 * Submit date feedback request
 */
export interface SubmitDateFeedbackRequest {
  readonly overallRating?: number; // 1-5
  readonly wouldMeetAgain?: boolean;
  readonly chemistryRating?: number; // 1-5
  readonly conversationQuality?: number; // 1-5
  
  readonly whatWentWell?: string;
  readonly whatCouldImprove?: string;
  readonly favoriteMoment?: string;
  
  readonly partnerPunctuality?: number; // 1-5
  readonly partnerAppearanceMatch?: number; // 1-5
  
  readonly suggestedImprovements?: string;
  readonly preferredNextDateActivity?: string;
  readonly preferredNextDateTiming?: string;
  
  readonly safetyConcerns?: boolean;
  readonly redFlags?: string[];
  readonly reportUser?: boolean;
  readonly reportReason?: string;
  
  readonly venueRating?: number; // 1-5
  readonly timingSatisfaction?: number; // 1-5
  readonly durationSatisfaction?: number; // 1-5
  
  readonly interestedInSecondDate?: boolean;
  readonly preferredContactMethod?: string;
  readonly additionalComments?: string;
  
  readonly isAnonymous?: boolean;
}

/**
 * Get user dates request with filters
 */
export interface GetUserDatesRequest extends PaginationRequest {
  readonly status?: CuratedDateStatus[];
  readonly mode?: DateMode[];
  readonly startDate?: string; // YYYY-MM-DD
  readonly endDate?: string; // YYYY-MM-DD
  readonly includeHistory?: boolean;
  readonly includeFeedback?: boolean;
  readonly includePartnerInfo?: boolean;
}

/**
 * Admin get dates request with filters
 */
export interface AdminGetDatesRequest extends PaginationRequest {
  readonly status?: CuratedDateStatus[];
  readonly mode?: DateMode[];
  readonly curatedBy?: number;
  readonly startDate?: string;
  readonly endDate?: string;
  readonly user1Id?: number;
  readonly user2Id?: number;
  readonly includeWorkflow?: boolean;
  readonly includeFeedback?: boolean;
}

/**
 * Search potential matches request
 */
export interface SearchPotentialMatchesRequest extends PaginationRequest {
  readonly userId: number;
  readonly ageRange?: {
    readonly min: number;
    readonly max: number;
  };
  readonly genderPreference?: string;
  readonly locationRadius?: number; // km
  readonly minCompatibilityScore?: number;
  readonly excludeRecentDates?: boolean; // exclude users dated in last 30 days
  readonly includeCompatibilityDetails?: boolean;
}

/**
 * Admin analytics request
 */
export interface DateCurationAnalyticsRequest {
  readonly startDate?: string;
  readonly endDate?: string;
  readonly groupBy?: 'day' | 'week' | 'month';
  readonly includeUserStats?: boolean;
  readonly includeFeedbackStats?: boolean;
  readonly includeSuccessMetrics?: boolean;
}

// ============================================================================
// RESPONSE DTOs
// ============================================================================

/**
 * Enhanced curated date response with user info
 */
export interface CuratedDateResponse extends CuratedDate {
  readonly user1Info?: {
    readonly id: number;
    readonly firstName: string;
    readonly lastName: string;
    readonly profileImage?: string;
    readonly age: number;
    readonly verificationStatus: {
      readonly email: boolean;
      readonly phone: boolean;
      readonly identity: boolean;
    };
  };
  readonly user2Info?: {
    readonly id: number;
    readonly firstName: string;
    readonly lastName: string;
    readonly profileImage?: string;
    readonly age: number;
    readonly verificationStatus: {
      readonly email: boolean;
      readonly phone: boolean;
      readonly identity: boolean;
    };
  };
  readonly curatorInfo?: {
    readonly id: number;
    readonly firstName: string;
    readonly lastName: string;
  };
  readonly feedback?: DateFeedback[];
  readonly dateSeriesInfo?: {
    readonly totalDatesInSeries: number;
    readonly relationshipStage: RelationshipStage;
    readonly seriesStatus: 'active' | 'paused' | 'ended';
  };
  
  // Helper fields
  readonly canCancel: boolean;
  readonly canConfirm: boolean;
  readonly requiresConfirmation: boolean;
  readonly hoursUntilDate: number;
  readonly formattedDateTime: string;
  readonly isUpcoming: boolean;
  readonly canSubmitFeedback: boolean;
}

/**
 * User dates list response
 */
export interface UserDatesResponse extends ApiResponse<PaginationResponse<CuratedDateResponse> & {
  readonly summary: {
    readonly totalDates: number;
    readonly upcomingDates: number;
    readonly completedDates: number;
    readonly cancelledDates: number;
    readonly pendingConfirmation: number;
    readonly awaitingFeedback: number;
  };
}> {}

/**
 * Potential match response
 */
export interface PotentialMatchResponse {
  readonly userId: number;
  readonly userInfo: {
    readonly id: number;
    readonly firstName: string;
    readonly lastName: string;
    readonly profileImage?: string;
    readonly age: number;
    readonly location: string;
    readonly bio?: string;
    readonly interests?: string[];
    readonly verificationStatus: {
      readonly email: boolean;
      readonly phone: boolean;
      readonly identity: boolean;
    };
  };
  readonly compatibilityScore: number;
  readonly matchReasons: string[];
  readonly sharedInterests: string[];
  readonly lastDateWith?: string; // ISO date of last date
  readonly totalPreviousDates: number;
  readonly averageRatingFromUser?: number;
  readonly trustScore: number;
  readonly availabilityNext7Days: number; // count of available slots
  readonly estimatedResponseTime: string; // "within 2 hours", "same day", etc.
}

/**
 * Search potential matches response
 */
export interface SearchPotentialMatchesResponse extends ApiResponse<PaginationResponse<PotentialMatchResponse> & {
  readonly searchSummary: {
    readonly searchCriteria: SearchPotentialMatchesRequest;
    readonly totalMatches: number;
    readonly averageCompatibility: number;
    readonly highCompatibilityMatches: number; // score > 80
    readonly verifiedMatches: number;
  };
}> {}

/**
 * Date feedback response
 */
export interface DateFeedbackResponse extends DateFeedback {
  readonly dateInfo?: {
    readonly id: number;
    readonly dateTime: string;
    readonly mode: DateMode;
    readonly locationName?: string;
    readonly partnerName: string;
  };
  readonly canEdit: boolean;
  readonly submissionDeadline?: string; // ISO date when feedback expires
}

/**
 * User trust score response
 */
export interface UserTrustScoreResponse extends UserTrustScore {
  readonly scoreBreakdown: {
    readonly attendance: {
      readonly score: number;
      readonly description: string;
      readonly impactFactors: string[];
    };
    readonly punctuality: {
      readonly score: number;
      readonly description: string;
      readonly impactFactors: string[];
    };
    readonly feedback: {
      readonly score: number;
      readonly description: string;
      readonly impactFactors: string[];
    };
    readonly profileCompleteness: {
      readonly score: number;
      readonly description: string;
      readonly impactFactors: string[];
    };
  };
  readonly recommendations: string[];
  readonly nextReviewDate?: string;
  readonly comparisonToAverage: {
    readonly betterThan: number; // percentage of users with lower score
    readonly categoryRanking: string; // "Excellent", "Good", "Fair", "Poor"
  };
}

/**
 * Date series response
 */
export interface DateSeriesResponse extends DateSeries {
  readonly user1Info: {
    readonly id: number;
    readonly firstName: string;
    readonly lastName: string;
    readonly profileImage?: string;
  };
  readonly user2Info: {
    readonly id: number;
    readonly firstName: string;
    readonly lastName: string;
    readonly profileImage?: string;
  };
  readonly datesInSeries: CuratedDateResponse[];
  readonly progressionSummary: {
    readonly currentStage: RelationshipStage;
    readonly stageProgress: number; // 0-100 percentage
    readonly nextMilestone?: string;
    readonly recommendations: string[];
  };
  readonly seriesStats: {
    readonly averageRating: number;
    readonly mutualInterestTrend: 'increasing' | 'stable' | 'decreasing';
    readonly recommendNextDate: boolean;
    readonly suggestedNextActivity?: string;
  };
}

/**
 * Date curation analytics response
 */
export interface DateCurationAnalyticsResponse extends ApiResponse<{
  readonly summary: {
    readonly totalDatesCreated: number;
    readonly totalDatesCompleted: number;
    readonly totalDatesCancelled: number;
    readonly completionRate: number;
    readonly averageRating: number;
    readonly secondDateRate: number;
    readonly totalActiveSeries: number;
  };
  readonly trends: Array<{
    readonly period: string; // date or week/month
    readonly datesCreated: number;
    readonly datesCompleted: number;
    readonly completionRate: number;
    readonly averageRating: number;
  }>;
  readonly userStats: {
    readonly topPerformingUsers: Array<{
      readonly userId: number;
      readonly userName: string;
      readonly completionRate: number;
      readonly averageRating: number;
      readonly totalDates: number;
    }>;
    readonly usersByTrustScore: {
      readonly excellent: number; // 90-100
      readonly good: number; // 70-89
      readonly fair: number; // 50-69
      readonly poor: number; // 0-49
    };
  };
  readonly feedbackStats: {
    readonly averageRatings: {
      readonly overall: number;
      readonly chemistry: number;
      readonly conversation: number;
      readonly punctuality: number;
    };
    readonly commonFeedbackThemes: Array<{
      readonly theme: string;
      readonly frequency: number;
      readonly sentiment: 'positive' | 'neutral' | 'negative';
    }>;
    readonly safetyReports: number;
    readonly redFlagsReported: number;
  };
  readonly successMetrics: {
    readonly relationshipOutcomes: {
      readonly ongoing: number;
      readonly relationship: number;
      readonly friendship: number;
      readonly noConnection: number;
    };
    readonly retentionRates: {
      readonly oneWeek: number;
      readonly oneMonth: number;
      readonly threeMonths: number;
    };
  };
}> {}

// ============================================================================
// API ENDPOINT RESPONSES
// ============================================================================

export interface CreateCuratedDateResponse extends ApiResponse<CuratedDateResponse> {}
export interface UpdateCuratedDateResponse extends ApiResponse<CuratedDateResponse> {}
export interface GetCuratedDateResponse extends ApiResponse<CuratedDateResponse> {}
export interface ConfirmDateResponse extends ApiResponse<{ readonly confirmed: boolean; readonly message: string }> {}
export interface CancelDateResponse extends ApiResponse<{ readonly cancelled: boolean; readonly refundAmount?: number }> {}
export interface SubmitDateFeedbackResponse extends ApiResponse<DateFeedbackResponse> {}
export interface GetUserTrustScoreResponse extends ApiResponse<UserTrustScoreResponse> {}
export interface GetDateSeriesResponse extends ApiResponse<DateSeriesResponse> {}

// ============================================================================
// VALIDATION SCHEMAS (for middleware)
// ============================================================================

/**
 * Validation constraints for date curation
 */
export const DateCurationValidationRules = {
  dateScheduling: {
    minAdvanceHours: 24, // minimum 24 hours in advance
    maxAdvanceDays: 90, // maximum 90 days in advance
    minDurationMinutes: 30,
    maxDurationMinutes: 240, // 4 hours max
    allowedTimeSlots: {
      start: '09:00',
      end: '22:00'
    }
  },
  feedback: {
    submissionDeadlineHours: 48, // 48 hours after date completion
    minRating: 1,
    maxRating: 5,
    maxRedFlags: 5,
    maxCommentLength: 1000
  },
  trustScore: {
    warningThresholds: {
      level1: 70, // below 70 gets warning level 1
      level2: 50, // below 50 gets warning level 2  
      level3: 30  // below 30 gets warning level 3
    },
    probationThreshold: 40,
    probationDurationDays: 30,
    maxConsecutiveCancellations: 3
  },
  cancellation: {
    freeThresholdHours: 24, // can cancel free if >24h before date
    partialRefundThresholdHours: 4, // partial refund if 4-24h before
    noRefundThresholdHours: 4 // no refund if <4h before
  }
} as const;

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Date conflict detection
 */
export interface DateConflict {
  readonly conflictingDateId: number;
  readonly conflictType: 'same_time' | 'overlapping' | 'too_close';
  readonly conflictDescription: string;
  readonly suggestedAlternatives?: Array<{
    readonly dateTime: string;
    readonly reason: string;
  }>;
}

/**
 * Match compatibility details
 */
export interface CompatibilityDetails {
  readonly overallScore: number;
  readonly breakdown: {
    readonly ageCompatibility: number;
    readonly locationCompatibility: number;
    readonly interestsCompatibility: number;
    readonly lifestyleCompatibility: number;
    readonly goalsCompatibility: number;
  };
  readonly strengths: string[];
  readonly concerns: string[];
  readonly recommendations: string[];
}

/**
 * Date creation result with validation
 */
export interface DateCreationResult {
  readonly success: boolean;
  readonly curatedDate?: CuratedDateResponse;
  readonly conflicts?: DateConflict[];
  readonly warnings?: string[];
  readonly error?: string;
}

/**
 * Bulk date operations result
 */
export interface BulkDateOperationResult {
  readonly totalProcessed: number;
  readonly successful: number;
  readonly failed: number;
  readonly results: Array<{
    readonly dateId?: number;
    readonly success: boolean;
    readonly error?: string;
  }>;
}