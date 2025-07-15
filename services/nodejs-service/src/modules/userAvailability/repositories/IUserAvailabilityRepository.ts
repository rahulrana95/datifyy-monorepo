// services/nodejs-service/src/modules/userAvailability/repositories/IUserAvailabilityRepository.ts

import { 
  AvailabilitySlot,
  CreateAvailabilityRequest,
  UpdateAvailabilityRequest,
  GetAvailabilityRequest,
  PaginationResponse
} from '../../../proto-types/user/availability';
import { DatifyyUserAvailability } from '../../../models/entities/DatifyyUserAvailability';

// Define paginated response type
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationResponse;
}

/**
 * User Availability Repository Interface
 * 
 * Defines data access operations for user availability management.
 * Follows established repository patterns in the Datifyy codebase.
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */
export interface IUserAvailabilityRepository {
  /**
   * Create a new availability slot for a user
   * @param userId - The user ID creating the availability
   * @param availabilityData - The availability slot data
   * @returns Promise<DatifyyUserAvailability> - Created availability entity
   */
  create(userId: number, availabilityData: CreateAvailabilityRequest): Promise<DatifyyUserAvailability>;

  /**
   * Create multiple availability slots in bulk
   * @param userId - The user ID creating the availability
   * @param availabilitySlots - Array of availability slot data
   * @returns Promise<DatifyyUserAvailability[]> - Created availability entities
   */
  createBulk(userId: number, availabilitySlots: CreateAvailabilityRequest[]): Promise<DatifyyUserAvailability[]>;

  /**
   * Find availability slot by ID
   * @param availabilityId - The availability slot ID
   * @param includeBookings - Whether to include booking information
   * @returns Promise<DatifyyUserAvailability | null> - Availability entity or null
   */
  findById(availabilityId: number, includeBookings?: boolean): Promise<DatifyyUserAvailability | null>;

  /**
   * Find availability slot by ID and user ID (for ownership validation)
   * @param availabilityId - The availability slot ID
   * @param userId - The user ID who owns the slot
   * @param includeBookings - Whether to include booking information
   * @returns Promise<DatifyyUserAvailability | null> - Availability entity or null
   */
  findByIdAndUserId(availabilityId: number, userId: number, includeBookings?: boolean): Promise<DatifyyUserAvailability | null>;

  /**
   * Find all availability slots for a user with filtering and pagination
   * @param userId - The user ID
   * @param filters - Filter and pagination options
   * @returns Promise<PaginationResponse<DatifyyUserAvailability>> - Paginated availability slots
   */
  findByUserId(userId: number, filters: GetAvailabilityRequest): Promise<PaginatedResponse<DatifyyUserAvailability>>;

  /**
   * Find available slots in a date range (not booked)
   * @param startDate - Start date (YYYY-MM-DD)
   * @param endDate - End date (YYYY-MM-DD)
   * @param excludeUserId - Optional user ID to exclude from results
   * @returns Promise<DatifyyUserAvailability[]> - Available slots
   */
  findAvailableInDateRange(startDate: string, endDate: string, excludeUserId?: number): Promise<DatifyyUserAvailability[]>;

  /**
   * Find conflicting availability slots for a user
   * @param userId - The user ID
   * @param date - The date to check (YYYY-MM-DD)
   * @param startTime - Start time (HH:MM)
   * @param endTime - End time (HH:MM)
   * @param excludeId - Optional availability ID to exclude from conflict check
   * @returns Promise<DatifyyUserAvailability[]> - Conflicting slots
   */
  findConflictingSlots(
    userId: number, 
    date: string, 
    startTime: string, 
    endTime: string, 
    excludeId?: number
  ): Promise<DatifyyUserAvailability[]>;

  /**
   * Update an availability slot
   * @param availabilityId - The availability slot ID
   * @param updateData - Updated availability data
   * @returns Promise<DatifyyUserAvailability> - Updated availability entity
   */
  update(availabilityId: number, updateData: UpdateAvailabilityRequest): Promise<DatifyyUserAvailability>;

  /**
   * Soft delete an availability slot (set status to 'deleted')
   * @param availabilityId - The availability slot ID
   * @param reason - Optional deletion reason
   * @returns Promise<void>
   */
  softDelete(availabilityId: number, reason?: string): Promise<void>;

  /**
   * Hard delete an availability slot (permanent removal)
   * @param availabilityId - The availability slot ID
   * @returns Promise<void>
   */
  hardDelete(availabilityId: number): Promise<void>;

  /**
   * Get user's availability statistics
   * @param userId - The user ID
   * @param startDate - Start date for stats (YYYY-MM-DD)
   * @param endDate - End date for stats (YYYY-MM-DD)
   * @returns Promise<AvailabilityStats> - User's availability statistics
   */
  getUserAvailabilityStats(userId: number, startDate: string, endDate: string): Promise<AvailabilityStats>;

  /**
   * Get recurring availability slots generated from a parent slot
   * @param parentAvailabilityId - The parent availability ID
   * @returns Promise<DatifyyUserAvailability[]> - Generated recurring slots
   */
  getRecurringSlots(parentAvailabilityId: number): Promise<DatifyyUserAvailability[]>;

  /**
   * Cancel all recurring slots generated from a parent slot
   * @param parentAvailabilityId - The parent availability ID
   * @param reason - Cancellation reason
   * @returns Promise<number> - Number of cancelled slots
   */
  cancelRecurringSlots(parentAvailabilityId: number, reason: string): Promise<number>;

  /**
   * Search for users with availability matching criteria
   * @param searchCriteria - Search parameters
   * @returns Promise<UserAvailabilityMatch[]> - Matching users with availability
   */
  searchAvailableUsers(searchCriteria: AvailabilitySearchCriteria): Promise<UserAvailabilityMatch[]>;

  /**
   * Get calendar view data for a user
   * @param userId - The user ID
   * @param month - Month in YYYY-MM format
   * @returns Promise<CalendarDayData[]> - Calendar data with availability info
   */
  getCalendarView(userId: number, month: string): Promise<CalendarDayData[]>;

  /**
   * Check if user has availability conflicts on a specific date
   * @param userId - The user ID
   * @param date - The date to check (YYYY-MM-DD)
   * @param excludeStatuses - Statuses to exclude from conflict check
   * @returns Promise<boolean> - True if conflicts exist
   */
  hasConflictsOnDate(userId: number, date: string, excludeStatuses?: string[]): Promise<boolean>;
}

/**
 * Supporting interfaces for repository operations
 */

/**
 * User availability statistics
 */
export interface AvailabilityStats {
  readonly totalSlots: number;
  readonly activeSlots: number;
  readonly bookedSlots: number;
  readonly completedSlots: number;
  readonly cancelledSlots: number;
  readonly totalHours: number;
  readonly bookedHours: number;
  readonly bookingRate: number; // percentage
  readonly averageSlotDuration: number; // minutes
  readonly mostPopularTimeSlot: string;
  readonly mostPopularDay: string;
}

/**
 * Search criteria for finding available users
 */
export interface AvailabilitySearchCriteria {
  readonly date: string;
  readonly startTime?: string;
  readonly endTime?: string;
  readonly dateType?: 'online' | 'offline';
  readonly maxDistance?: number; // km for offline dates
  readonly excludeUserId?: number;
  readonly minAge?: number;
  readonly maxAge?: number;
  readonly genderPreference?: string;
  readonly activities?: string[];
  readonly page?: number;
  readonly limit?: number;
}

/**
 * User availability match result
 */
export interface UserAvailabilityMatch {
  readonly availability: DatifyyUserAvailability;
  readonly user: {
    readonly id: number;
    readonly firstName: string;
    readonly lastName: string;
    readonly age: number;
    readonly gender: string;
    readonly currentCity: string;
    readonly profileImage?: string;
    readonly bio?: string;
    readonly verificationStatus: {
      readonly email: boolean;
      readonly phone: boolean;
      readonly identity: boolean;
    };
  };
  readonly distance?: number; // km for offline dates
  readonly compatibilityScore?: number;
  readonly commonInterests?: string[];
}

/**
 * Calendar day data
 */
export interface CalendarDayData {
  readonly date: string; // YYYY-MM-DD
  readonly dayOfWeek: string;
  readonly availableSlots: number;
  readonly bookedSlots: number;
  readonly totalHours: number;
  readonly hasAvailability: boolean;
  readonly slots: Array<{
    readonly id: number;
    readonly startTime: string;
    readonly endTime: string;
    readonly status: string;
    readonly isBooked: boolean;
    readonly title?: string;
  }>;
}