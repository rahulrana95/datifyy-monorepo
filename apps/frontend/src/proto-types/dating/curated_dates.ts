// Auto-generated from proto/dating/curated_dates.proto
// Generated at: 2025-07-15T14:41:46.190Z

import { ApiResponse, PaginationRequest, PaginationResponse, LocationInfo } from '../common';
import { UserProfile } from '../user';

export enum DateMode {
  UNSPECIFIED = 'UNSPECIFIED',
  CURATED = 'CURATED',
  SELF_SELECTED = 'SELF_SELECTED',
  BLIND_DATE = 'BLIND_DATE',
  GROUP_DATE = 'GROUP_DATE',
  VIRTUAL_DATE = 'VIRTUAL_DATE',
}

export enum CuratedDateStatus {
  UNSPECIFIED = 'UNSPECIFIED',
  PENDING = 'PENDING',
  PROPOSED = 'PROPOSED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  USER1_CONFIRMED = 'USER1_CONFIRMED',
  USER2_CONFIRMED = 'USER2_CONFIRMED',
  BOTH_CONFIRMED = 'BOTH_CONFIRMED',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  NO_SHOW = 'NO_SHOW',
}

export enum CancellationCategory {
  UNSPECIFIED = 'UNSPECIFIED',
  SCHEDULE_CONFLICT = 'SCHEDULE_CONFLICT',
  PERSONAL_REASON = 'PERSONAL_REASON',
  ILLNESS = 'ILLNESS',
  WEATHER = 'WEATHER',
  TRANSPORTATION = 'TRANSPORTATION',
  FINANCIAL = 'FINANCIAL',
  SAFETY_CONCERN = 'SAFETY_CONCERN',
  INCOMPATIBILITY = 'INCOMPATIBILITY',
  CHANGE_OF_MIND = 'CHANGE_OF_MIND',
  OTHER = 'OTHER',
}

export enum CurationWorkflowStage {
  UNSPECIFIED = 'UNSPECIFIED',
  MATCHING = 'MATCHING',
  VENUE_SELECTION = 'VENUE_SELECTION',
  TIME_COORDINATION = 'TIME_COORDINATION',
  CONFIRMATION = 'CONFIRMATION',
  REMINDER = 'REMINDER',
  FEEDBACK_COLLECTION = 'FEEDBACK_COLLECTION',
  FOLLOW_UP = 'FOLLOW_UP',
}

export enum WorkflowStageStatus {
  UNSPECIFIED = 'UNSPECIFIED',
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  SKIPPED = 'SKIPPED',
  FAILED = 'FAILED',
}

export interface CuratedDate {
  id: string;
  user1Id: string;
  user2Id: string;
  dateMode: DateMode;
  status: CuratedDateStatus;
  
  // Date details
  proposedAt: string;
  scheduledAt?: string;
  confirmedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  
  // Venue and activity
  venueName?: string;
  venueAddress?: string;
  venueType?: string;
  activityType?: string;
  activityDescription?: string;
  estimatedDuration?: number; // in minutes
  estimatedCost?: number;
  currency?: string;
  
  // Participants
  user1Profile?: UserProfile;
  user2Profile?: UserProfile;
  
  // Curation details
  curatedBy?: string; // system or admin ID
  curationReason?: string;
  compatibilityScore?: number;
  
  // Feedback
  user1Feedback?: DateFeedback;
  user2Feedback?: DateFeedback;
  
  // Cancellation
  cancellationReason?: string;
  cancellationCategory?: CancellationCategory;
  cancelledBy?: string; // user ID
  
  // Location
  location?: LocationInfo;
  
  // Metadata
  metadata?: Record<string, any>;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface DateFeedback {
  userId: string;
  dateId: string;
  rating: number; // 1-5 stars
  enjoyment: number; // 1-5 scale
  compatibility: number; // 1-5 scale
  wouldDateAgain: boolean;
  venue_rating?: number;
  venue_feedback?: string;
  suggestions?: string;
  whatWentWell?: string;
  whatCouldImprove?: string;
  feedback_categories?: string[];
  is_anonymous?: boolean;
  submittedAt: string;
}

export interface UserTrustScore {
  userId: string;
  score: number; // 0-100
  factors: {
    profile_completeness: number;
    verification_status: number;
    date_attendance: number;
    feedback_quality: number;
    community_reports: number;
    account_age: number;
  };
  lastUpdated: string;
}

export interface DateSeries {
  id: string;
  name: string;
  description: string;
  user1Id: string;
  user2Id: string;
  dates: CuratedDate[];
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface CurationWorkflow {
  id: string;
  dateId: string;
  currentStage: CurationWorkflowStage;
  stages: Array<{
    stage: CurationWorkflowStage;
    status: WorkflowStageStatus;
    startedAt?: string;
    completedAt?: string;
    failedAt?: string;
    notes?: string;
    assignedTo?: string;
    metadata?: Record<string, any>;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface SelectedActivity {
  id: string;
  name: string;
  description: string;
  category: string;
  estimatedDuration: number; // in minutes
  estimatedCost: number;
  currency: string;
  location: LocationInfo;
  requirements?: string[];
  tags?: string[];
  ageAppropriate: boolean;
  weatherDependent: boolean;
  accessibilityInfo?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Request interfaces
export interface CreateCuratedDateRequest {
  user1Id: string;
  user2Id: string;
  dateMode: DateMode;
  scheduledAt?: string;
  venueName?: string;
  venueAddress?: string;
  venueType?: string;
  activityType?: string;
  activityDescription?: string;
  estimatedDuration?: number;
  estimatedCost?: number;
  currency?: string;
  curationReason?: string;
  location?: LocationInfo;
  metadata?: Record<string, any>;
}

export interface UpdateCuratedDateRequest {
  dateId: string;
  status?: CuratedDateStatus;
  scheduledAt?: string;
  venueName?: string;
  venueAddress?: string;
  venueType?: string;
  activityType?: string;
  activityDescription?: string;
  estimatedDuration?: number;
  estimatedCost?: number;
  currency?: string;
  location?: LocationInfo;
  metadata?: Record<string, any>;
}

export interface AdminGetDatesRequest {
  userId?: string;
  status?: CuratedDateStatus;
  dateMode?: DateMode;
  startDate?: string;
  endDate?: string;
  venueType?: string;
  activityType?: string;
  sortBy?: 'scheduledAt' | 'createdAt' | 'status';
  sortOrder?: 'asc' | 'desc';
  pagination?: PaginationRequest;
}

export interface SearchPotentialMatchesRequest {
  userId: string;
  ageRange?: { min: number; max: number; };
  maxDistance?: number;
  interests?: string[];
  excludeUserIds?: string[];
  compatibilityThreshold?: number;
  limit?: number;
}

export interface SubmitDateFeedbackRequest {
  dateId: string;
  rating: number;
  enjoyment: number;
  compatibility: number;
  wouldDateAgain: boolean;
  venue_rating?: number;
  venue_feedback?: string;
  suggestions?: string;
  whatWentWell?: string;
  whatCouldImprove?: string;
  feedback_categories?: string[];
  is_anonymous?: boolean;
}

export interface CancelDateRequest {
  dateId: string;
  reason: string;
  category: CancellationCategory;
  notifyOtherUser?: boolean;
}

export interface GetUserDatesRequest {
  userId: string;
  status?: CuratedDateStatus;
  dateMode?: DateMode;
  startDate?: string;
  endDate?: string;
  pagination?: PaginationRequest;
}

export interface GetDateAnalyticsRequest {
  startDate?: string;
  endDate?: string;
  dateMode?: DateMode;
  venueType?: string;
  activityType?: string;
  groupBy?: 'day' | 'week' | 'month';
}

// Response interfaces
export interface CuratedDateResponse extends ApiResponse<CuratedDate> {}
export interface CuratedDatesListResponse extends ApiResponse<{
  dates: CuratedDate[];
  pagination: PaginationResponse;
}> {}
export interface UserDatesResponse extends ApiResponse<{
  dates: CuratedDate[];
  pagination: PaginationResponse;
  summary: {
    totalDates: number;
    completedDates: number;
    cancelledDates: number;
    upcomingDates: number;
    averageRating: number;
  };
}> {}
export interface SearchPotentialMatchesResponse extends ApiResponse<{
  matches: Array<{
    user: UserProfile;
    compatibilityScore: number;
    commonInterests: string[];
    distance: number;
    reasons: string[];
  }>;
}> {}
export interface DateCurationAnalyticsResponse extends ApiResponse<{
  totalDates: number;
  completedDates: number;
  cancelledDates: number;
  averageRating: number;
  topVenueTypes: Array<{ type: string; count: number; }>;
  topActivityTypes: Array<{ type: string; count: number; }>;
  cancellationReasons: Array<{ reason: string; count: number; }>;
  datesByTime: Array<{ period: string; count: number; }>;
  userSatisfaction: {
    averageEnjoyment: number;
    averageCompatibility: number;
    repeatDatePercentage: number;
  };
}> {}
export interface DateFeedbackResponse extends ApiResponse<DateFeedback> {}
export interface UserTrustScoreResponse extends ApiResponse<UserTrustScore> {}
export interface DateSeriesResponse extends ApiResponse<DateSeries> {}
export interface CurationWorkflowResponse extends ApiResponse<CurationWorkflow> {}

// Validation rules
export const DateCurationValidationRules = {
  minScheduleAdvance: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  maxScheduleAdvance: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  minCancellationNotice: 2 * 60 * 60 * 1000, // 2 hours in milliseconds
  maxVenueNameLength: 200,
  maxActivityDescriptionLength: 1000,
  maxFeedbackLength: 2000,
  maxCancellationReasonLength: 500,
  minRating: 1,
  maxRating: 5,
  minCompatibilityScore: 0,
  maxCompatibilityScore: 100,
  dateScheduling: {
    minAdvanceHours: 24,
    maxAdvanceDays: 30,
    minCancellationHours: 2,
    maxDurationMinutes: 480, // 8 hours
    minDurationMinutes: 30,
  },
  feedback: {
    minRating: 1,
    maxRating: 5,
    maxTextLength: 2000,
    requiredFields: ['rating', 'enjoyment', 'compatibility', 'wouldDateAgain'],
  },
};

// Helper functions
export function getDateModeValues(): DateMode[] {
  return Object.values(DateMode).filter(v => v !== DateMode.UNSPECIFIED);
}

export function getCuratedDateStatusValues(): CuratedDateStatus[] {
  return Object.values(CuratedDateStatus).filter(v => v !== CuratedDateStatus.UNSPECIFIED);
}

export function getCancellationCategoryValues(): CancellationCategory[] {
  return Object.values(CancellationCategory).filter(v => v !== CancellationCategory.UNSPECIFIED);
}

export function getCurationWorkflowStageValues(): CurationWorkflowStage[] {
  return Object.values(CurationWorkflowStage).filter(v => v !== CurationWorkflowStage.UNSPECIFIED);
}

export function getWorkflowStageStatusValues(): WorkflowStageStatus[] {
  return Object.values(WorkflowStageStatus).filter(v => v !== WorkflowStageStatus.UNSPECIFIED);
}
