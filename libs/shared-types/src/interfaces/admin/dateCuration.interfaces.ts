/**
 * Date Curation Interfaces
 * Complete interfaces for admin-managed date curation system
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */

import { CuratedDateStatus } from "../dateCuration.interfaces";

// =============================================================================
// CORE DATE CURATION ENUMS
// =============================================================================

/**
 * Date mode options
 */
export enum DateMode {
  ONLINE = 'online',
  OFFLINE = 'offline',
}

/**
 * Cancellation categories for analytics
 */
export enum CancellationCategory {
  EMERGENCY = 'emergency',
  ILLNESS = 'illness',
  WORK_CONFLICT = 'work_conflict',
  PERSONAL_REASON = 'personal_reason',
  NOT_INTERESTED = 'not_interested',
  SCHEDULING_ERROR = 'scheduling_error',
  OTHER = 'other',
}

/**
 * Relationship stage tracking
 */
export enum RelationshipStage {
  GETTING_TO_KNOW = 'getting_to_know',
  BUILDING_CONNECTION = 'building_connection',
  SERIOUS_INTEREST = 'serious_interest',
  EXCLUSIVE = 'exclusive',
  ENDED = 'ended',
}

/**
 * Curation workflow stages
 */
export enum CurationWorkflowStage {
  INITIAL_MATCH = 'initial_match',
  COMPATIBILITY_CHECK = 'compatibility_check',
  SCHEDULING = 'scheduling',
  CONFIRMATION = 'confirmation',
  REMINDER_SENT = 'reminder_sent',
  COMPLETED = 'completed',
  FOLLOW_UP = 'follow_up',
}

/**
 * Workflow stage status
 */
export enum WorkflowStageStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  SKIPPED = 'skipped',
}

// =============================================================================
// CORE DATE CURATION INTERFACES
// =============================================================================

/**
 * Complete curated date object
 */
export interface CuratedDate {
  readonly id: number;
  readonly user1Id: number;
  readonly user2Id: number;
  readonly dateTime: string; // ISO timestamp
  readonly durationMinutes: number;
  readonly mode: DateMode;
  readonly locationName?: string;
  readonly locationAddress?: string;
  readonly locationCoordinates?: {
    readonly lat: number;
    readonly lng: number;
  };
  readonly locationGoogleMapsUrl?: string;
  readonly meetingLink?: string;
  readonly meetingId?: string;
  readonly meetingPassword?: string;
  readonly status: CuratedDateStatus;
  readonly dateSeriesId?: string;
  readonly dateNumberInSeries: number;
  readonly adminNotes?: string;
  readonly specialInstructions?: string;
  readonly dressCode?: string;
  readonly suggestedConversationTopics?: string[];
  readonly user1ConfirmedAt?: string;
  readonly user2ConfirmedAt?: string;
  readonly cancelledAt?: string;
  readonly cancellationReason?: string;
  readonly cancellationCategory?: CancellationCategory;
  readonly completedAt?: string;
  readonly actualDurationMinutes?: number;
  readonly reminderSent24h: boolean;
  readonly reminderSent2h: boolean;
  readonly followUpSent: boolean;
  readonly compatibilityScore?: number;
  readonly matchReason?: string;
  readonly algorithmConfidence?: number;
  readonly tokensCostUser1: number;
  readonly tokensCostUser2: number;
  readonly adminPriority: 1 | 2 | 3; // 1=low, 2=normal, 3=high
  readonly internalNotes?: string;
  readonly successProbability?: number; // 0.00-1.00
  readonly revenueImpact: number;
  readonly curatedAt: string;
  readonly updatedAt: string;
  // Related data
  readonly user1: CuratedDateUser;
  readonly user2: CuratedDateUser;
  readonly curatedBy?: AdminUser;
  readonly updatedBy?: AdminUser;
  readonly cancelledByUser?: AdminUser;
  readonly feedbacks: DateFeedback[];
  readonly workflowStages: CurationWorkflow[];
}

/**
 * User information for curated dates
 */
export interface CuratedDateUser {
  readonly id: number;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly gender?: string;
  readonly age?: number;
  readonly city?: string;
  readonly profileImage?: string;
  readonly isVerified: boolean;
  readonly trustScore?: number;
}

/**
 * Admin user information
 */
export interface AdminUser {
  readonly id: number;
  readonly email: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly permissionLevel: string;
}

/**
 * Date feedback structure
 */
export interface DateFeedback {
  readonly id: number;
  readonly curatedDateId: number;
  readonly userId: number;
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
  readonly safetyConcerns: boolean;
  readonly redFlags?: string[];
  readonly reportUser: boolean;
  readonly reportReason?: string;
  readonly venueRating?: number; // 1-5
  readonly timingSatisfaction?: number; // 1-5
  readonly durationSatisfaction?: number; // 1-5
  readonly interestedInSecondDate?: boolean;
  readonly preferredContactMethod?: string;
  readonly additionalComments?: string;
  readonly submittedAt: string;
  readonly isAnonymous: boolean;
}

/**
 * User trust score details
 */
export interface UserTrustScore {
  readonly id: number;
  readonly userId: number;
  readonly overallScore: number; // 0-100
  readonly attendanceScore: number;
  readonly punctualityScore: number;
  readonly feedbackScore: number;
  readonly profileCompletenessScore: number;
  readonly totalDatesAttended: number;
  readonly totalDatesCancelled: number;
  readonly totalDatesNoShow: number;
  readonly lastMinuteCancellations: number;
  readonly averageRating: number;
  readonly consecutiveCancellations: number;
  readonly lastCancellationDate?: string;
  readonly warningLevel: number; // 0-3
  readonly isOnProbation: boolean;
  readonly probationUntil?: string;
  readonly secondDateRate: number;
  readonly positiveFeedbackCount: number;
  readonly complimentsReceived: number;
  readonly canBookDates: boolean;
  readonly maxDatesPerWeek: number;
  readonly requiresAdminApproval: boolean;
  readonly lastCalculatedAt: string;
  readonly calculationReason?: string;
  readonly adminOverrideReason?: string;
  readonly manualAdjustmentBy?: number;
  readonly manualAdjustmentAt?: string;
}

/**
 * Date series tracking multiple dates between same users
 */
export interface DateSeries {
  readonly id: string; // UUID
  readonly user1Id: number;
  readonly user2Id: number;
  readonly seriesStatus: 'active' | 'paused' | 'ended';
  readonly totalDatesInSeries: number;
  readonly lastDateAt?: string;
  readonly nextSuggestedDate?: string;
  readonly relationshipStage: RelationshipStage;
  readonly mutualInterestLevel?: number; // 1-5
  readonly adminNotes?: string;
  readonly preferredDateFrequency?: string;
  readonly preferredDateTypes?: string[];
  readonly seriesEndedReason?: string;
  readonly endedAt?: string;
  readonly finalOutcome?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly user1: CuratedDateUser;
  readonly user2: CuratedDateUser;
  readonly endedByUser?: CuratedDateUser;
  readonly dates: CuratedDate[];
}

/**
 * Curation workflow tracking
 */
export interface CurationWorkflow {
  readonly id: number;
  readonly curatedDateId: number;
  readonly stage: CurationWorkflowStage;
  readonly stageStatus: WorkflowStageStatus;
  readonly stageNotes?: string;
  readonly assignedAdminId?: number;
  readonly startedAt: string;
  readonly completedAt?: string;
  readonly dueAt?: string;
  readonly isAutomated: boolean;
  readonly automationTrigger?: string;
  readonly updatedAt: string;
  readonly assignedAdmin?: AdminUser;
  readonly createdBy?: AdminUser;
}

// =============================================================================
// REQUEST INTERFACES
// =============================================================================

/**
 * Create curated date request
 */
export interface CreateCuratedDateRequest {
  readonly user1Id: number;
  readonly user2Id: number;
  readonly dateTime: string; // ISO timestamp
  readonly durationMinutes?: number; // Default 60
  readonly mode: DateMode;
  readonly locationName?: string;
  readonly locationAddress?: string;
  readonly locationCoordinates?: {
    readonly lat: number;
    readonly lng: number;
  };
  readonly meetingLink?: string; // For online dates
  readonly adminNotes?: string;
  readonly specialInstructions?: string;
  readonly dressCode?: string;
  readonly suggestedConversationTopics?: string[];
  readonly adminPriority?: 1 | 2 | 3;
  readonly internalNotes?: string;
  readonly autoSendReminders?: boolean;
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
  readonly status?: CuratedDateStatus;
  readonly adminNotes?: string;
  readonly specialInstructions?: string;
  readonly dressCode?: string;
  readonly suggestedConversationTopics?: string[];
  readonly adminPriority?: 1 | 2 | 3;
  readonly internalNotes?: string;
  readonly successProbability?: number;
  readonly revenueImpact?: number;
}

/**
 * User confirms date attendance
 */
export interface ConfirmDateRequest {
  readonly dateId: number;
  readonly userId: number;
  readonly confirmationNotes?: string;
}

/**
 * User cancels date
 */
export interface CancelDateRequest {
  readonly dateId: number;
  readonly userId: number;
  readonly cancellationReason: string;
  readonly cancellationCategory: CancellationCategory;
  readonly refundRequested?: boolean;
}

/**
 * Submit date feedback
 */
export interface SubmitDateFeedbackRequest {
  readonly dateId: number;
  readonly userId: number;
  readonly overallRating: number; // 1-5
  readonly wouldMeetAgain: boolean;
  readonly chemistryRating?: number;
  readonly conversationQuality?: number;
  readonly whatWentWell?: string;
  readonly whatCouldImprove?: string;
  readonly favoriteMoment?: string;
  readonly partnerPunctuality?: number;
  readonly partnerAppearanceMatch?: number;
  readonly suggestedImprovements?: string;
  readonly preferredNextDateActivity?: string;
  readonly preferredNextDateTiming?: string;
  readonly safetyConcerns?: boolean;
  readonly redFlags?: string[];
  readonly reportUser?: boolean;
  readonly reportReason?: string;
  readonly venueRating?: number;
  readonly timingSatisfaction?: number;
  readonly durationSatisfaction?: number;
  readonly interestedInSecondDate?: boolean;
  readonly preferredContactMethod?: string;
  readonly additionalComments?: string;
  readonly isAnonymous?: boolean;
}

/**
 * Get user dates request (with filters)
 */
export interface GetUserDatesRequest {
  readonly userId?: number; // If not provided, use authenticated user
  readonly status?: CuratedDateStatus[];
  readonly dateFrom?: string; // YYYY-MM-DD
  readonly dateTo?: string; // YYYY-MM-DD
  readonly mode?: DateMode;
  readonly includeSeriesInfo?: boolean;
  readonly includeFeedback?: boolean;
  readonly page?: number;
  readonly limit?: number;
  readonly sortBy?: 'dateTime' | 'status' | 'createdAt';
  readonly sortOrder?: 'asc' | 'desc';
}

/**
 * Admin get dates request (with extensive filters)
 */
export interface AdminGetDatesRequest {
  readonly status?: CuratedDateStatus[];
  readonly dateFrom?: string;
  readonly dateTo?: string;
  readonly mode?: DateMode;
  readonly city?: string;
  readonly adminPriority?: 1 | 2 | 3;
  readonly curatedBy?: number;
  readonly hasUnreadFeedback?: boolean;
  readonly requiresFollowUp?: boolean;
  readonly seriesId?: string;
  readonly user1Id?: number;
  readonly user2Id?: number;
  readonly minCompatibilityScore?: number;
  readonly maxCompatibilityScore?: number;
  readonly revenueImpactMin?: number;
  readonly revenueImpactMax?: number;
  readonly includeCancelledByAdmin?: boolean;
  readonly includeWorkflowDetails?: boolean;
  readonly includeTrustScores?: boolean;
  readonly page?: number;
  readonly limit?: number;
  readonly sortBy?: string;
  readonly sortOrder?: 'asc' | 'desc';
}

/**
 * Search potential matches for a user
 */
export interface SearchPotentialMatchesRequest {
  readonly userId: number;
  readonly excludeUserIds?: number[];
  readonly minCompatibilityScore?: number;
  readonly maxDistance?: number; // km
  readonly ageRangeMin?: number;
  readonly ageRangeMax?: number;
  readonly preferredGender?: string;
  readonly mustBeVerified?: boolean;
  readonly minTrustScore?: number;
  readonly excludeRecentMatches?: boolean; // Exclude users matched in last 30 days
  readonly includeProfileData?: boolean;
  readonly includeCompatibilityDetails?: boolean;
  readonly limit?: number;
}

/**
 * Date curation analytics request
 */
export interface DateCurationAnalyticsRequest {
  readonly startDate: string; // YYYY-MM-DD
  readonly endDate: string; // YYYY-MM-DD
  readonly granularity?: 'daily' | 'weekly' | 'monthly';
  readonly groupBy?: ('city' | 'mode' | 'status' | 'admin')[];
  readonly includeRevenue?: boolean;
  readonly includeTrustScoreImpact?: boolean;
  readonly includeUserSegmentation?: boolean;
  readonly compareWithPrevious?: boolean;
}

// =============================================================================
// RESPONSE INTERFACES
// =============================================================================

/**
 * Standard curated date response
 */
export interface CuratedDateResponse {
  readonly success: boolean;
  readonly data: CuratedDate;
  readonly message: string;
}

/**
 * User dates response with pagination
 */
export interface UserDatesResponse {
  readonly success: boolean;
  readonly data: {
    readonly dates: CuratedDate[];
    readonly pagination: {
      readonly page: number;
      readonly limit: number;
      readonly total: number;
      readonly totalPages: number;
    };
    readonly summary: {
      readonly upcoming: number;
      readonly completed: number;
      readonly cancelled: number;
      readonly totalSeries: number;
    };
  };
  readonly message: string;
}

/**
 * Potential matches response
 */
export interface PotentialMatchResponse {
  readonly userId: number;
  readonly compatibilityScore: number;
  readonly matchReason: string;
  readonly compatibilityDetails: CompatibilityDetails;
  readonly user: CuratedDateUser;
  readonly lastInteractionDate?: string;
  readonly suggestedDateActivities: string[];
  readonly estimatedSuccessProbability: number;
}

/**
 * Search potential matches response
 */
export interface SearchPotentialMatchesResponse {
  readonly success: boolean;
  readonly data: {
    readonly matches: PotentialMatchResponse[];
    readonly searchCriteria: SearchPotentialMatchesRequest;
    readonly totalPotentialMatches: number;
    readonly averageCompatibility: number;
    readonly recommendations: string[];
  };
  readonly message: string;
}

/**
 * Date feedback response
 */
export interface DateFeedbackResponse {
  readonly success: boolean;
  readonly data: DateFeedback;
  readonly message: string;
}

/**
 * User trust score response
 */
export interface UserTrustScoreResponse {
  readonly success: boolean;
  readonly data: UserTrustScore;
  readonly message: string;
}

/**
 * Date series response
 */
export interface DateSeriesResponse {
  readonly success: boolean;
  readonly data: DateSeries;
  readonly message: string;
}

/**
 * Date curation analytics response
 */
export interface DateCurationAnalyticsResponse {
  readonly success: boolean;
  readonly data: {
    readonly summary: {
      readonly totalDates: number;
      readonly completionRate: number;
      readonly cancellationRate: number;
      readonly averageRating: number;
      readonly totalRevenue: number;
      readonly averageTrustScoreChange: number;
    };
    readonly trends: {
      readonly datesByDay: Array<{ date: string; count: number; }>;
      readonly completionByDay: Array<{ date: string; rate: number; }>;
      readonly revenueByDay: Array<{ date: string; amount: number; }>;
    };
    readonly breakdowns: {
      readonly byCity?: Record<string, number>;
      readonly byMode?: Record<string, number>;
      readonly byStatus?: Record<string, number>;
      readonly byAdmin?: Record<string, number>;
    };
    readonly comparison?: {
      readonly previousPeriod: any;
      readonly growthRates: Record<string, number>;
    };
  };
  readonly message: string;
}

// =============================================================================
// UTILITY INTERFACES
// =============================================================================

/**
 * Compatibility details breakdown
 */
export interface CompatibilityDetails {
  readonly overallScore: number;
  readonly factors: {
    readonly age: number;
    readonly location: number;
    readonly interests: number;
    readonly lifestyle: number;
    readonly values: number;
    readonly goals: number;
  };
  readonly strengths: string[];
  readonly concerns: string[];
}

/**
 * Date conflict detection
 */
export interface DateConflict {
  readonly type: 'user_unavailable' | 'user_has_date' | 'admin_unavailable' | 'venue_unavailable';
  readonly message: string;
  readonly conflictingResource: string;
  readonly suggestedAlternatives?: string[];
}

/**
 * Date creation result
 */
export interface DateCreationResult {
  readonly success: boolean;
  readonly dateId?: number;
  readonly conflicts?: DateConflict[];
  readonly warnings?: string[];
  readonly estimatedTokenCost: number;
  readonly suggestedImprovements?: string[];
}

/**
 * Bulk date operation result
 */
export interface BulkDateOperationResult {
  readonly totalRequested: number;
  readonly successful: number;
  readonly failed: number;
  readonly results: Array<{
    readonly dateId?: number;
    readonly success: boolean;
    readonly error?: string;
    readonly conflicts?: DateConflict[];
  }>;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get date mode values as array
 */
export const getDateModeValues = (): DateMode[] => Object.values(DateMode);

/**
 * Get curated date status values as array
 */
export const getCuratedDateStatusValues = (): CuratedDateStatus[] => Object.values(CuratedDateStatus);

/**
 * Get relationship stage values as array
 */
export const getRelationshipStageValues = (): RelationshipStage[] => Object.values(RelationshipStage);

/**
 * Get cancellation category values as array
 */
export const getCancellationCategoryValues = (): CancellationCategory[] => Object.values(CancellationCategory);

/**
 * Get curation workflow stage values as array
 */
export const getCurationWorkflowStageValues = (): CurationWorkflowStage[] => Object.values(CurationWorkflowStage);

/**
 * Get workflow stage status values as array
 */
export const getWorkflowStageStatusValues = (): WorkflowStageStatus[] => Object.values(WorkflowStageStatus);

// =============================================================================
// VALIDATION RULES
// =============================================================================

/**
 * Validation rules for date curation
 */
export const DateCurationValidationRules = {
  MAX_FUTURE_DAYS: 30, // Can't schedule more than 30 days in advance
  MIN_FUTURE_HOURS: 2, // Must be at least 2 hours in the future
  MAX_DURATION_MINUTES: 180, // Max 3 hours
  MIN_DURATION_MINUTES: 30, // Min 30 minutes
  MAX_ADMIN_NOTES_LENGTH: 1000,
  MAX_FEEDBACK_LENGTH: 2000,
  MAX_CONVERSATION_TOPICS: 5,
  MIN_COMPATIBILITY_SCORE: 30, // Minimum to suggest a match
  MAX_DATES_PER_USER_PER_WEEK: 3,
  CANCELLATION_GRACE_PERIOD_HOURS: 24, // Free cancellation window
} as const;