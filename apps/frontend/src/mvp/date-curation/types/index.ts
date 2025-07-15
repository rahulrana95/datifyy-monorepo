// apps/frontend/src/mvp/date-curation/types/index.ts

import {
  CuratedDateStatus,
  DateMode,
  RelationshipStage,
  CancellationCategory,
  type CuratedDateResponse,
  type DateFeedbackResponse,
  type UserTrustScoreResponse,
  type DateSeriesResponse,
} from "../../../proto-types";

/**
 * Date Curation Types - Frontend
 *
 * Core interfaces for the user-facing date curation experience
 * Extends shared types with frontend-specific properties
 */

// Re-export shared types for convenience
export {
  DateMode,
  RelationshipStage,
  CancellationCategory,
  type CuratedDateResponse,
  type DateFeedbackResponse,
  type UserTrustScoreResponse,
  type DateSeriesResponse,
} from "../../../proto-types";

/**
 * Frontend-specific curated date card interface
 * Optimized for UI display with computed properties
 */
export interface CuratedDateCard {
  // Core date info
  readonly id: string;
  readonly matchName: string;
  readonly matchAge: number;
  readonly matchImage?: string;
  readonly dateTime: string; // ISO string
  readonly mode: "online" | "offline";
  readonly status: "pending" | "confirmed" | "cancelled" | "completed";

  // Location details
  readonly location?: string;
  readonly meetingLink?: string;

  // Match info
  readonly compatibilityScore: number;
  readonly isVerified: boolean;

  // Admin guidance
  readonly adminNote?: string;
  readonly dressCode?: string;

  // User actions
  readonly canCancel: boolean;
  readonly canConfirm: boolean;
  readonly canSubmitFeedback: boolean;

  // UI helpers
  readonly hoursUntilDate: number;
  readonly formattedDateTime: string;
  readonly isUpcoming: boolean;
}

/**
 * Date action types for user interactions
 */
export interface DateAction {
  readonly type: "accept" | "cancel" | "reschedule" | "feedback";
  readonly dateId: string;
  readonly category?: CancellationCategory;
  readonly reason?: string;
  readonly notes?: string;
}

/**
 * Date curation summary for dashboard
 */
export interface DateCurationSummary {
  readonly totalDates: number;
  readonly upcomingDates: number;
  readonly completedDates: number;
  readonly pendingConfirmation: number;
  readonly awaitingFeedback: number;
  readonly averageRating: number;
  readonly successfulConnections: number;
}

/**
 * Filter options for date list
 */
export interface DateFilter {
  readonly status?: CuratedDateStatus[];
  readonly mode?: DateMode[];
  readonly timeRange?: "upcoming" | "past_week" | "past_month" | "all";
  readonly includeHistory?: boolean;
}

/**
 * Date curation state for hook
 */
export interface DateCurationState {
  readonly upcomingDates: CuratedDateCard[];
  readonly dateHistory: CuratedDateCard[];
  readonly summary: DateCurationSummary;
  readonly filters: DateFilter;
  readonly isLoading: boolean;
  readonly error: string | null;
}

/**
 * Match celebration data
 */
export interface MatchCelebration {
  readonly matchId: string;
  readonly matchName: string;
  readonly matchImage?: string;
  readonly celebrationMessage: string;
  readonly showCelebration: boolean;
}

/**
 * Date feedback form data
 */
export interface DateFeedbackForm {
  readonly overallRating: number; // 1-5
  readonly wouldMeetAgain: boolean;
  readonly chemistryRating: number; // 1-5
  readonly conversationQuality: number; // 1-5
  readonly whatWentWell: string;
  readonly whatCouldImprove: string;
  readonly interestedInSecondDate: boolean;
  readonly additionalComments: string;
}

/**
 * Date reschedule request
 */
export interface DateRescheduleRequest {
  readonly currentDateId: string;
  readonly preferredDate: string;
  readonly preferredTime: string;
  readonly reason: string;
}
