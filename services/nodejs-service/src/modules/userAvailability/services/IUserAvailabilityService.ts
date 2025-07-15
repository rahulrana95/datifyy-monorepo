// services/nodejs-service/src/modules/userAvailability/services/IUserAvailabilityService.ts

import {
  CreateAvailabilityRequest,
  UpdateAvailabilityRequest,
  BulkCreateAvailabilityRequest,
  GetAvailabilityRequest,
  SearchAvailableUsersRequest,
  GetAvailabilityAnalyticsRequest,
  AvailabilityResponse,
  AvailabilityListResponse,
  BulkCreateAvailabilityResponse,
  SearchAvailableUsersResponse,
  AvailabilityAnalyticsResponse,
  CalendarViewResponse,
  TimeSuggestionsResponse,
  AvailabilityConflict
} from '../../../proto-types/user/availability';

/**
 * User Availability Service Interface
 * 
 * Defines business logic operations for user availability management.
 * Handles validation, conflict detection, recurring slots, and analytics.
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */
export interface IUserAvailabilityService {
  /**
   * Create a new availability slot for a user
   * @param userId - The user ID creating the availability
   * @param availabilityData - The availability slot data
   * @returns Promise<AvailabilityResponse> - Created availability with validation
   */
  createAvailability(userId: number, availabilityData: CreateAvailabilityRequest): Promise<AvailabilityResponse>;

  /**
   * Create multiple availability slots in bulk
   * @param userId - The user ID creating the availability
   * @param bulkData - Bulk creation request with slots and options
   * @returns Promise<BulkCreateAvailabilityResponse> - Results with created/skipped slots
   */
  createBulkAvailability(userId: number, bulkData: BulkCreateAvailabilityRequest): Promise<BulkCreateAvailabilityResponse>;

  /**
   * Get availability slot by ID with ownership validation
   * @param availabilityId - The availability slot ID
   * @param userId - The user ID requesting the slot
   * @returns Promise<AvailabilityResponse> - Availability slot data
   */
  getAvailabilityById(availabilityId: number, userId: number): Promise<AvailabilityResponse>;

  /**
   * Get user's availability slots with filtering and pagination
   * @param userId - The user ID
   * @param filters - Filter and pagination options
   * @returns Promise<AvailabilityListResponse> - Paginated availability list with summary
   */
  getUserAvailability(userId: number, filters: GetAvailabilityRequest): Promise<AvailabilityListResponse>;

  /**
   * Update an existing availability slot
   * @param availabilityId - The availability slot ID
   * @param userId - The user ID (for ownership validation)
   * @param updateData - Updated availability data
   * @returns Promise<AvailabilityResponse> - Updated availability slot
   */
  updateAvailability(availabilityId: number, userId: number, updateData: UpdateAvailabilityRequest): Promise<AvailabilityResponse>;

  /**
   * Cancel an availability slot
   * @param availabilityId - The availability slot ID
   * @param userId - The user ID (for ownership validation)
   * @param reason - Optional cancellation reason
   * @returns Promise<AvailabilityResponse> - Cancelled availability slot
   */
  cancelAvailability(availabilityId: number, userId: number, reason?: string): Promise<AvailabilityResponse>;

  /**
   * Delete an availability slot (soft delete)
   * @param availabilityId - The availability slot ID
   * @param userId - The user ID (for ownership validation)
   * @param reason - Optional deletion reason
   * @returns Promise<void>
   */
  deleteAvailability(availabilityId: number, userId: number, reason?: string): Promise<void>;

  /**
   * Search for available users matching criteria
   * @param searchCriteria - Search parameters for finding available users
   * @param requestingUserId - The user ID making the search (for filtering)
   * @returns Promise<SearchAvailableUsersResponse> - Matching available users
   */
  searchAvailableUsers(searchCriteria: SearchAvailableUsersRequest, requestingUserId: number): Promise<SearchAvailableUsersResponse>;

  /**
   * Get availability analytics for a user
   * @param userId - The user ID
   * @param analyticsRequest - Analytics parameters and date range
   * @returns Promise<AvailabilityAnalyticsResponse> - Comprehensive analytics data
   */
  getAvailabilityAnalytics(userId: number, analyticsRequest: GetAvailabilityAnalyticsRequest): Promise<AvailabilityAnalyticsResponse>;

  /**
   * Get calendar view for a user's availability
   * @param userId - The user ID
   * @param month - Month in YYYY-MM format
   * @returns Promise<CalendarViewResponse> - Calendar data with availability info
   */
  getCalendarView(userId: number, month: string): Promise<CalendarViewResponse>;

  /**
   * Get AI-powered time slot suggestions for optimal availability
   * @param userId - The user ID
   * @param daysAhead - Number of days to look ahead for suggestions
   * @returns Promise<TimeSuggestionsResponse> - Optimized time slot recommendations
   */
  getTimeSuggestions(userId: number, daysAhead?: number): Promise<TimeSuggestionsResponse>;

  /**
   * Validate availability slot for conflicts and business rules
   * @param userId - The user ID
   * @param availabilityData - The availability data to validate
   * @param excludeId - Optional availability ID to exclude from conflict check
   * @returns Promise<ValidationResult> - Validation result with conflicts and suggestions
   */
  validateAvailabilitySlot(
    userId: number, 
    availabilityData: CreateAvailabilityRequest | UpdateAvailabilityRequest,
    excludeId?: number
  ): Promise<ValidationResult>;

  /**
   * Generate recurring availability slots
   * @param userId - The user ID
   * @param baseSlot - Base availability slot for recurrence
   * @param endDate - End date for recurring generation
   * @param options - Additional options for generation
   * @returns Promise<SlotCreationResult[]> - Results for each generated slot
   */
  generateRecurringSlots(
    userId: number,
    baseSlot: CreateAvailabilityRequest,
    endDate: string,
    options?: RecurringGenerationOptions
  ): Promise<SlotCreationResult[]>;

  /**
   * Cancel all recurring slots generated from a parent slot
   * @param parentAvailabilityId - The parent availability ID
   * @param userId - The user ID (for ownership validation)
   * @param reason - Cancellation reason
   * @returns Promise<number> - Number of cancelled slots
   */
  cancelRecurringSlots(parentAvailabilityId: number, userId: number, reason: string): Promise<number>;

  /**
   * Check availability conflicts for a specific time slot
   * @param userId - The user ID
   * @param date - The date to check (YYYY-MM-DD)
   * @param startTime - Start time (HH:MM)
   * @param endTime - End time (HH:MM)
   * @param excludeId - Optional availability ID to exclude
   * @returns Promise<AvailabilityConflict[]> - List of conflicts found
   */
  checkAvailabilityConflicts(
    userId: number,
    date: string,
    startTime: string,
    endTime: string,
    excludeId?: number
  ): Promise<AvailabilityConflict[]>;

  /**
   * Get user's availability statistics summary
   * @param userId - The user ID
   * @param startDate - Start date for statistics (YYYY-MM-DD)
   * @param endDate - End date for statistics (YYYY-MM-DD)
   * @returns Promise<AvailabilityStatsSummary> - Statistical summary
   */
  getAvailabilityStatsSummary(userId: number, startDate: string, endDate: string): Promise<AvailabilityStatsSummary>;

  /**
   * Optimize user's availability schedule based on historical data
   * @param userId - The user ID
   * @param preferences - User's optimization preferences
   * @returns Promise<ScheduleOptimizationResult> - Optimization recommendations
   */
  optimizeAvailabilitySchedule(userId: number, preferences?: ScheduleOptimizationPreferences): Promise<ScheduleOptimizationResult>;

  /**
   * Get nearby available users for offline dates
   * @param userId - The requesting user ID
   * @param date - The date for availability
   * @param radiusKm - Search radius in kilometers
   * @param timeRange - Optional time range for availability
   * @returns Promise<NearbyAvailableUsersResponse> - Nearby users with availability
   */
  getNearbyAvailableUsers(
    userId: number,
    date: string,
    radiusKm: number,
    timeRange?: { startTime: string; endTime: string }
  ): Promise<NearbyAvailableUsersResponse>;
}

/**
 * Supporting interfaces for service operations
 */

/**
 * Validation result for availability slots
 */
export interface ValidationResult {
  readonly isValid: boolean;
  readonly conflicts: AvailabilityConflict[];
  readonly warnings: string[];
  readonly suggestions: Array<{
    readonly type: 'time_adjustment' | 'date_change' | 'split_slot';
    readonly description: string;
    readonly suggestedSlot?: CreateAvailabilityRequest;
  }>;
  readonly businessRuleViolations: Array<{
    readonly rule: string;
    readonly description: string;
    readonly severity: 'error' | 'warning';
  }>;
}

/**
 * Recurring generation options
 */
export interface RecurringGenerationOptions {
  readonly skipWeekends?: boolean;
  readonly skipHolidays?: boolean;
  readonly skipConflicts?: boolean;
  readonly customSkipDates?: string[];
  readonly maxSlotsPerWeek?: number;
  readonly allowPartialWeeks?: boolean;
}

/**
 * Availability statistics summary
 */
export interface AvailabilityStatsSummary {
  readonly overview: {
    readonly totalSlots: number;
    readonly bookedSlots: number;
    readonly availableSlots: number;
    readonly bookingRate: number;
    readonly totalHours: number;
    readonly earnedRevenue?: number;
  };
  readonly trends: {
    readonly weeklyTrend: 'increasing' | 'decreasing' | 'stable';
    readonly popularDays: string[];
    readonly popularTimes: string[];
    readonly seasonality: 'high' | 'medium' | 'low';
  };
  readonly performance: {
    readonly averageBookingTime: number; // hours in advance
    readonly cancellationRate: number;
    readonly noShowRate: number;
    readonly repeatBookingRate: number;
  };
  readonly recommendations: Array<{
    readonly type: 'scheduling' | 'pricing' | 'location' | 'activity';
    readonly description: string;
    readonly impact: 'high' | 'medium' | 'low';
  }>;
}

/**
 * Schedule optimization preferences
 */
export interface ScheduleOptimizationPreferences {
  readonly prioritizeBookingRate?: boolean;
  readonly prioritizeRevenue?: boolean;
  readonly preferredDays?: string[]; // ['monday', 'tuesday', ...]
  readonly preferredTimeRanges?: Array<{
    readonly startTime: string;
    readonly endTime: string;
  }>;
  readonly maxSlotsPerDay?: number;
  readonly maxSlotsPerWeek?: number;
  readonly minBreakBetweenSlots?: number; // minutes
  readonly allowBackToBack?: boolean;
}

/**
 * Schedule optimization result
 */
export interface ScheduleOptimizationResult {
  readonly currentEfficiency: number; // 0-100 score
  readonly optimizedEfficiency: number; // predicted score
  readonly recommendations: Array<{
    readonly action: 'add_slot' | 'remove_slot' | 'move_slot' | 'adjust_timing';
    readonly description: string;
    readonly currentSlot?: AvailabilityResponse;
    readonly suggestedSlot?: CreateAvailabilityRequest;
    readonly expectedImpact: {
      readonly bookingIncrease?: number; // percentage
      readonly revenueIncrease?: number; // percentage
      readonly efficiencyGain?: number; // percentage
    };
    readonly confidence: number; // 0-100
  }>;
  readonly weeklyTemplate: Array<{
    readonly dayOfWeek: string;
    readonly recommendedSlots: Array<{
      readonly startTime: string;
      readonly endTime: string;
      readonly expectedBookings: number;
      readonly reason: string;
    }>;
  }>;
}

/**
 * Nearby available users response
 */
export interface NearbyAvailableUsersResponse {
  readonly users: Array<{
    readonly userId: number;
    readonly availability: AvailabilityResponse;
    readonly distance: number; // km
    readonly userProfile: {
      readonly firstName: string;
      readonly lastName: string;
      readonly age: number;
      readonly profileImage?: string;
      readonly bio?: string;
      readonly location: string;
    };
    readonly compatibilityScore?: number;
    readonly commonInterests?: string[];
    readonly lastActiveAt: string;
  }>;
  readonly searchRadius: number;
  readonly totalFound: number;
  readonly averageDistance: number;
}