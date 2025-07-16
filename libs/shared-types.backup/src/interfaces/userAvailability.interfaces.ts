// libs/shared-types/src/interfaces/userAvailability.interfaces.ts

/**
 * User Availability API Interfaces
 * 
 * Comprehensive request/response DTOs for user availability management system.
 * Based on DatifyyUserAvailability and DatifyyAvailabilityBookings models.
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */

import { ApiResponse, PaginationRequest, PaginationResponse } from './api.interfaces';

/**
 * Type of availability date
 */
export enum DateType {
  ONLINE = 'online',
  OFFLINE = 'offline'
}

/**
 * Status of availability slot
 */
export enum AvailabilityStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  DELETED = 'deleted'
}

/**
 * Type of recurrence pattern
 */
export enum RecurrenceType {
  NONE = 'none',
  WEEKLY = 'weekly',
  CUSTOM = 'custom'
}

/**
 * Cancellation policy for bookings
 */
export enum CancellationPolicy {
  FLEXIBLE = 'flexible',
  TWENTY_FOUR_HOURS = '24_hours',
  FORTY_EIGHT_HOURS = '48_hours',
  STRICT = 'strict'
}

/**
 * Status of booking
 */
export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

/**
 * Available activities for dates
 */
export enum SelectedActivity {
  COFFEE = 'coffee',
  LUNCH = 'lunch',
  DINNER = 'dinner',
  DRINKS = 'drinks',
  MOVIE = 'movie',
  WALK = 'walk',
  ACTIVITY = 'activity',
  CASUAL = 'casual',
  FORMAL = 'formal'
}

// Export type unions for backward compatibility
export type DateTypeValue = `${DateType}`;
export type AvailabilityStatusValue = `${AvailabilityStatus}`;
export type RecurrenceTypeValue = `${RecurrenceType}`;
export type CancellationPolicyValue = `${CancellationPolicy}`;
export type BookingStatusValue = `${BookingStatus}`;
export type SelectedActivityValue = `${SelectedActivity}`;

// Helper functions to get enum values as arrays
export const getDateTypeValues = (): string[] => Object.values(DateType);
export const getAvailabilityStatusValues = (): string[] => Object.values(AvailabilityStatus);
export const getRecurrenceTypeValues = (): string[] => Object.values(RecurrenceType);
export const getCancellationPolicyValues = (): string[] => Object.values(CancellationPolicy);
export const getBookingStatusValues = (): string[] => Object.values(BookingStatus);
export const getSelectedActivityValues = (): string[] => Object.values(SelectedActivity);

/**
 * Base availability slot interface
 * Core structure for availability data
 */
export interface AvailabilitySlot {
  readonly id?: number;
  readonly userId: number;
  readonly availabilityDate: string; // YYYY-MM-DD format
  readonly startTime: string; // HH:MM format
  readonly endTime: string; // HH:MM format
  readonly timezone: string;
  readonly dateType: DateType;
  readonly status: AvailabilityStatus;
  readonly title?: string;
  readonly notes?: string;
  readonly locationPreference?: string;
  
  // Recurrence settings
  readonly isRecurring: boolean;
  readonly recurrenceType: RecurrenceType;
  readonly recurrenceEndDate?: string;
  readonly parentAvailabilityId?: number;
  
  // Booking settings
  readonly bufferTimeMinutes: number;
  readonly preparationTimeMinutes: number;
  readonly cancellationPolicy: CancellationPolicy;
  
  // Metadata
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

/**
 * Booking information for availability slots
 */
export interface AvailabilityBooking {
  readonly id: number;
  readonly availabilityId: number;
  readonly bookedByUserId: number;
  readonly bookingStatus: BookingStatus;
  readonly selectedActivity: SelectedActivity;
  readonly bookingNotes?: string;
  readonly confirmedAt?: Date;
  readonly cancelledAt?: Date;
  readonly cancellationReason?: string;
  readonly withinPolicy?: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  
  // Related user information (populated)
  readonly bookedByUser?: {
    readonly id: number;
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly profileImage?: string;
  };
}

/**
 * User availability preferences
 */
export interface UserAvailabilityPreferences {
  readonly id?: number;
  readonly userId: number;
  readonly defaultBufferTimeMinutes: number;
  readonly defaultPreparationTimeMinutes: number;
  readonly defaultCancellationPolicy: CancellationPolicy;
  readonly maxDailySlots: number;
  readonly maxWeeklyHours: number;
  readonly defaultTimezone: string;
  readonly offlineRadiusKm: number;
  readonly autoApproveBookings: boolean;
  readonly allowBackToBackDates: boolean;
  readonly weekendAvailabilityOnly: boolean;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

// ============================================================================
// REQUEST DTOs
// ============================================================================

/**
 * Create new availability slot request
 */
export interface CreateAvailabilityRequest {
  readonly availabilityDate: string;
  readonly startTime: string;
  readonly endTime: string;
  readonly timezone?: string;
  readonly dateType: DateType;
  readonly title?: string;
  readonly notes?: string;
  readonly locationPreference?: string;
  readonly bufferTimeMinutes?: number;
  readonly preparationTimeMinutes?: number;
  readonly cancellationPolicy?: CancellationPolicy;
  
  // Recurrence options
  readonly isRecurring?: boolean;
  readonly recurrenceType?: RecurrenceType;
  readonly recurrenceEndDate?: string;
}

/**
 * Update existing availability slot request
 */
export interface UpdateAvailabilityRequest {
  readonly availabilityDate?: string;
  readonly startTime?: string;
  readonly endTime?: string;
  readonly timezone?: string;
  readonly dateType?: DateType;
  readonly title?: string;
  readonly notes?: string;
  readonly locationPreference?: string;
  readonly bufferTimeMinutes?: number;
  readonly preparationTimeMinutes?: number;
  readonly cancellationPolicy?: CancellationPolicy;
  readonly status?: AvailabilityStatus;
}

/**
 * Bulk create availability slots request
 */
export interface BulkCreateAvailabilityRequest {
  readonly slots: CreateAvailabilityRequest[];
  readonly skipConflicts?: boolean; // Skip conflicting slots instead of erroring
}

/**
 * Get availability slots with filters
 */
export interface GetAvailabilityRequest extends PaginationRequest {
  readonly startDate?: string; // YYYY-MM-DD
  readonly endDate?: string; // YYYY-MM-DD
  readonly status?: AvailabilityStatus[];
  readonly dateType?: DateType[];
  readonly timezone?: string;
  readonly includeBookings?: boolean;
  readonly includeRecurring?: boolean;
  readonly onlyAvailable?: boolean; // Only slots without bookings
}

/**
 * Search available users request
 */
export interface SearchAvailableUsersRequest extends PaginationRequest {
  readonly availabilityDate: string;
  readonly startTime?: string;
  readonly endTime?: string;
  readonly dateType?: DateType;
  readonly locationRadius?: number; // km for offline dates
  readonly preferredActivities?: SelectedActivity[];
  readonly ageRange?: {
    readonly min: number;
    readonly max: number;
  };
  readonly genderPreference?: string;
}

/**
 * Book availability slot request
 */
export interface BookAvailabilityRequest {
  readonly availabilityId: number;
  readonly selectedActivity: SelectedActivity;
  readonly bookingNotes?: string;
}

/**
 * Update booking request
 */
export interface UpdateBookingRequest {
  readonly bookingStatus?: BookingStatus;
  readonly selectedActivity?: SelectedActivity;
  readonly bookingNotes?: string;
  readonly cancellationReason?: string;
}

/**
 * Cancel availability request
 */
export interface CancelAvailabilityRequest {
  readonly reason?: string;
  readonly notifyBookedUsers?: boolean;
  readonly refundBookings?: boolean;
}

/**
 * Update user availability preferences request
 */
export interface UpdateAvailabilityPreferencesRequest {
  readonly defaultBufferTimeMinutes?: number;
  readonly defaultPreparationTimeMinutes?: number;
  readonly defaultCancellationPolicy?: CancellationPolicy;
  readonly maxDailySlots?: number;
  readonly maxWeeklyHours?: number;
  readonly defaultTimezone?: string;
  readonly offlineRadiusKm?: number;
  readonly autoApproveBookings?: boolean;
  readonly allowBackToBackDates?: boolean;
  readonly weekendAvailabilityOnly?: boolean;
}

/**
 * Get availability analytics request
 */
export interface GetAvailabilityAnalyticsRequest {
  readonly startDate?: string;
  readonly endDate?: string;
  readonly groupBy?: 'day' | 'week' | 'month';
  readonly includeBookingStats?: boolean;
  readonly includeRevenue?: boolean;
}

// ============================================================================
// RESPONSE DTOs
// ============================================================================

/**
 * Single availability slot response
 */
export interface AvailabilityResponse {
  readonly id: number;
  readonly userId: number;
  readonly availabilityDate: string;
  readonly startTime: string;
  readonly endTime: string;
  readonly timezone: string;
  readonly dateType: DateType;
  readonly status: AvailabilityStatus;
  readonly title?: string;
  readonly notes?: string;
  readonly locationPreference?: string;
  readonly isRecurring: boolean;
  readonly recurrenceType: RecurrenceType;
  readonly recurrenceEndDate?: string;
  readonly parentAvailabilityId?: number;
  readonly bufferTimeMinutes: number;
  readonly preparationTimeMinutes: number;
  readonly cancellationPolicy: CancellationPolicy;
  readonly isDeleted: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
  
  // Booking information (if included)
  readonly booking?: AvailabilityBooking;
  readonly isBooked: boolean;
  readonly bookingCount: number;
  
  // Helper fields
  readonly formattedDateTime: string;
  readonly durationMinutes: number;
  readonly canCancel: boolean;
  readonly canModify: boolean;
}

/**
 * Paginated availability list response
 */
export interface AvailabilityListResponse extends ApiResponse<PaginationResponse<AvailabilityResponse> & {
  readonly summary: {
    readonly totalSlots: number;
    readonly bookedSlots: number;
    readonly availableSlots: number;
    readonly upcomingSlots: number;
    readonly dateRange: {
      readonly start: string;
      readonly end: string;
    };
  };
}> {}

/**
 * Bulk create availability response
 */
export interface BulkCreateAvailabilityResponse extends ApiResponse<{
  readonly created: AvailabilityResponse[];
  readonly skipped: Array<{
    readonly slot: CreateAvailabilityRequest;
    readonly reason: string;
  }>;
  readonly summary: {
    readonly totalRequested: number;
    readonly successfullyCreated: number;
    readonly skipped: number;
    readonly errors: number;
  };
}> {}

/**
 * Available user for booking
 */
export interface AvailableUserResponse {
  readonly availability: AvailabilityResponse;
  readonly user: {
    readonly id: number;
    readonly firstName: string;
    readonly lastName: string;
    readonly profileImage?: string;
    readonly age: number;
    readonly location: string;
    readonly bio?: string;
    readonly verificationStatus: {
      readonly email: boolean;
      readonly phone: boolean;
      readonly identity: boolean;
    };
  };
  readonly compatibilityScore?: number;
  readonly distance?: number; // km for offline dates
  readonly commonInterests?: string[];
  readonly matchReasons?: string[];
}

/**
 * Search available users response
 */
export interface SearchAvailableUsersResponse extends ApiResponse<PaginationResponse<AvailableUserResponse> & {
  readonly searchSummary: {
    readonly searchCriteria: SearchAvailableUsersRequest;
    readonly totalMatches: number;
    readonly averageCompatibility: number;
    readonly locationBasedResults: number;
  };
}> {}

/**
 * Booking response
 */
export interface BookingResponse {
  readonly id: number;
  readonly availabilityId: number;
  readonly availability: AvailabilityResponse;
  readonly bookedByUserId: number;
  readonly bookingStatus: BookingStatus;
  readonly selectedActivity: SelectedActivity;
  readonly bookingNotes?: string;
  readonly confirmedAt?: string;
  readonly cancelledAt?: string;
  readonly cancellationReason?: string;
  readonly withinPolicy?: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
  
  // Related user information
  readonly bookedByUser: {
    readonly id: number;
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly profileImage?: string;
  };
  
  // Helper fields
  readonly canCancel: boolean;
  readonly canModify: boolean;
  readonly refundEligible: boolean;
  readonly hoursUntilMeeting: number;
}

/**
 * User bookings list response
 */
export interface BookingsListResponse extends ApiResponse<PaginationResponse<BookingResponse> & {
  readonly bookingSummary: {
    readonly totalBookings: number;
    readonly upcomingBookings: number;
    readonly completedBookings: number;
    readonly cancelledBookings: number;
  };
}> {}

/**
 * Availability preferences response
 */
export interface AvailabilityPreferencesResponse extends ApiResponse<UserAvailabilityPreferences> {}

/**
 * Availability analytics response
 */
export interface AvailabilityAnalyticsResponse extends ApiResponse<{
  readonly summary: {
    readonly totalSlots: number;
    readonly bookedSlots: number;
    readonly availableSlots: number;
    readonly completedMeetings: number;
    readonly cancelledMeetings: number;
    readonly averageBookingRate: number;
    readonly totalHoursAvailable: number;
    readonly totalHoursBooked: number;
  };
  readonly trends: Array<{
    readonly date: string;
    readonly slotsCreated: number;
    readonly slotsBooked: number;
    readonly meetingsCompleted: number;
    readonly revenue?: number;
  }>;
  readonly popularTimeSlots: Array<{
    readonly timeSlot: string;
    readonly bookingCount: number;
    readonly successRate: number;
  }>;
  readonly popularActivities: Array<{
    readonly activity: SelectedActivity;
    readonly count: number;
    readonly percentage: number;
  }>;
  readonly locationStats?: {
    readonly onlineBookings: number;
    readonly offlineBookings: number;
    readonly averageDistance: number;
  };
}> {}

/**
 * Calendar view response
 */
export interface CalendarViewResponse extends ApiResponse<{
  readonly month: string; // YYYY-MM
  readonly days: Array<{
    readonly date: string; // YYYY-MM-DD
    readonly dayOfWeek: string;
    readonly availableSlots: number;
    readonly bookedSlots: number;
    readonly totalHours: number;
    readonly slots: AvailabilityResponse[];
  }>;
  readonly summary: {
    readonly totalDaysWithSlots: number;
    readonly totalSlots: number;
    readonly bookingRate: number;
  };
}> {}

/**
 * Time slot suggestions response
 */
export interface TimeSuggestionsResponse extends ApiResponse<{
  readonly suggestedSlots: Array<{
    readonly date: string;
    readonly startTime: string;
    readonly endTime: string;
    readonly confidence: number; // 0-1
    readonly reason: string;
    readonly potentialMatches: number;
  }>;
  readonly optimizedSchedule: Array<{
    readonly dayOfWeek: string;
    readonly recommendedTimes: Array<{
      readonly startTime: string;
      readonly endTime: string;
      readonly expectedBookings: number;
    }>;
  }>;
}> {}

// ============================================================================
// API ENDPOINT RESPONSES
// ============================================================================

export interface CreateAvailabilityResponse extends ApiResponse<AvailabilityResponse> {}
export interface UpdateAvailabilityResponse extends ApiResponse<AvailabilityResponse> {}
export interface GetAvailabilityResponse extends ApiResponse<AvailabilityResponse> {}
export interface DeleteAvailabilityResponse extends ApiResponse<{ readonly deletedId: number }> {}
export interface BookAvailabilityResponse extends ApiResponse<BookingResponse> {}
export interface UpdateBookingResponse extends ApiResponse<BookingResponse> {}
export interface CancelBookingResponse extends ApiResponse<{ readonly cancelled: boolean; readonly refund?: number }> {}

// ============================================================================
// VALIDATION SCHEMAS (for middleware)
// ============================================================================

/**
 * Validation constraints for availability data
 */
export const AvailabilityValidationRules = {
  timeSlot: {
    minDurationMinutes: 30,
    maxDurationMinutes: 480, // 8 hours
    maxFutureDays: 90,
    minAdvanceHours: 2
  },
  booking: {
    minCancellationHours: {
      flexible: 1,
      '24_hours': 24,
      '48_hours': 48,
      strict: 72
    },
    maxBookingsPerDay: 5,
    maxBookingsPerWeek: 20
  },
  recurrence: {
    maxRecurrenceWeeks: 26, // 6 months
    maxSlotsPerRecurrence: 50
  }
} as const;

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Helper type for availability slot conflicts
 */
export interface AvailabilityConflict {
  readonly conflictingSlotId: number;
  readonly conflictType: 'overlap' | 'too_close' | 'duplicate';
  readonly conflictDescription: string;
  readonly suggestedAlternatives?: Array<{
    readonly startTime: string;
    readonly endTime: string;
  }>;
}

/**
 * Availability slot creation result
 */
export interface SlotCreationResult {
  readonly success: boolean;
  readonly slot?: AvailabilityResponse;
  readonly conflicts?: AvailabilityConflict[];
  readonly error?: string;
}

/**
 * Recurring availability generation options
 */
export interface RecurringGenerationOptions {
  readonly baseSlot: CreateAvailabilityRequest;
  readonly endDate: string;
  readonly skipHolidays?: boolean;
  readonly skipWeekends?: boolean;
  readonly skipConflicts?: boolean;
  readonly customSkipDates?: string[];
}