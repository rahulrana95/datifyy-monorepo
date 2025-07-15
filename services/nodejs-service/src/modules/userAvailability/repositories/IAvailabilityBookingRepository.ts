// services/nodejs-service/src/modules/userAvailability/repositories/IAvailabilityBookingRepository.ts

import { 
  BookAvailabilityRequest,
  UpdateBookingRequest,
  PaginationResponse
} from '../../../proto-types/user/availability';
import { DatifyyAvailabilityBookings } from '../../../models/entities/DatifyyAvailabilityBookings';

// Define paginated response type
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationResponse;
}

/**
 * Availability Booking Repository Interface
 * 
 * Defines data access operations for availability booking management.
 * Handles complex queries for bookings with user and availability relationships.
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */
export interface IAvailabilityBookingRepository {
  /**
   * Create a new booking for an availability slot
   * @param userId - The user ID making the booking
   * @param bookingData - The booking request data
   * @returns Promise<DatifyyAvailabilityBookings> - Created booking entity
   */
  create(userId: number, bookingData: BookAvailabilityRequest): Promise<DatifyyAvailabilityBookings>;

  /**
   * Find booking by ID
   * @param bookingId - The booking ID
   * @returns Promise<DatifyyAvailabilityBookings | null> - Booking entity or null
   */
  findById(bookingId: number): Promise<DatifyyAvailabilityBookings | null>;

  /**
   * Find booking by ID with access validation (user is booker or availability owner)
   * @param bookingId - The booking ID
   * @param userId - The user ID for access validation
   * @returns Promise<DatifyyAvailabilityBookings | null> - Booking entity or null
   */
  findByIdWithAccess(bookingId: number, userId: number): Promise<DatifyyAvailabilityBookings | null>;

  /**
   * Find booking by ID for availability owner
   * @param bookingId - The booking ID
   * @param ownerId - The availability slot owner user ID
   * @returns Promise<DatifyyAvailabilityBookings | null> - Booking entity or null
   */
  findByIdForOwner(bookingId: number, ownerId: number): Promise<DatifyyAvailabilityBookings | null>;

  /**
   * Find bookings made by a user (outgoing bookings)
   * @param userId - The user ID who made the bookings
   * @param filters - Filter and pagination options
   * @returns Promise<PaginationResponse<DatifyyAvailabilityBookings>> - Paginated bookings
   */
  findByUserId(userId: number, filters: any): Promise<PaginatedResponse<DatifyyAvailabilityBookings>>;

  /**
   * Find incoming bookings for user's availability slots
   * @param ownerId - The availability slot owner user ID
   * @param filters - Filter and pagination options
   * @returns Promise<PaginationResponse<DatifyyAvailabilityBookings>> - Paginated incoming bookings
   */
  findIncomingBookings(ownerId: number, filters: any): Promise<PaginatedResponse<DatifyyAvailabilityBookings>>;

  /**
   * Find bookings for a specific availability slot
   * @param availabilityId - The availability slot ID
   * @returns Promise<DatifyyAvailabilityBookings[]> - Bookings for the slot
   */
  findByAvailabilityId(availabilityId: number): Promise<DatifyyAvailabilityBookings[]>;

  /**
   * Update an existing booking
   * @param bookingId - The booking ID
   * @param updateData - Updated booking data
   * @returns Promise<DatifyyAvailabilityBookings> - Updated booking entity
   */
  update(bookingId: number, updateData: UpdateBookingRequest): Promise<DatifyyAvailabilityBookings>;

  /**
   * Cancel a booking
   * @param bookingId - The booking ID
   * @param reason - Optional cancellation reason
   * @returns Promise<DatifyyAvailabilityBookings> - Cancelled booking entity
   */
  cancel(bookingId: number, reason?: string): Promise<DatifyyAvailabilityBookings>;

  /**
   * Confirm a booking
   * @param bookingId - The booking ID
   * @returns Promise<DatifyyAvailabilityBookings> - Confirmed booking entity
   */
  confirm(bookingId: number): Promise<DatifyyAvailabilityBookings>;

  /**
   * Complete a booking
   * @param bookingId - The booking ID
   * @returns Promise<DatifyyAvailabilityBookings> - Completed booking entity
   */
  complete(bookingId: number): Promise<DatifyyAvailabilityBookings>;

  /**
   * Check if an availability slot has active bookings
   * @param availabilityId - The availability slot ID
   * @returns Promise<boolean> - True if has active bookings
   */
  hasActiveBookings(availabilityId: number): Promise<boolean>;

  /**
   * Get booking statistics for a user
   * @param userId - The user ID
   * @param startDate - Start date for statistics (YYYY-MM-DD)
   * @param endDate - End date for statistics (YYYY-MM-DD)
   * @returns Promise<BookingStats> - Booking statistics
   */
  getBookingStats(userId: number, startDate: string, endDate: string): Promise<BookingStats>;

  /**
   * Find conflicting bookings for a time slot
   * @param userId - The user ID
   * @param date - The date (YYYY-MM-DD)
   * @param startTime - Start time (HH:MM)
   * @param endTime - End time (HH:MM)
   * @returns Promise<DatifyyAvailabilityBookings[]> - Conflicting bookings
   */
  findConflictingBookings(
    userId: number,
    date: string,
    startTime: string,
    endTime: string
  ): Promise<DatifyyAvailabilityBookings[]>;
}

/**
 * Booking statistics interface
 */
export interface BookingStats {
  readonly totalBookings: number;
  readonly pendingBookings: number;
  readonly confirmedBookings: number;
  readonly completedBookings: number;
  readonly cancelledBookings: number;
  readonly bookingRate: number; // percentage
  readonly averageResponseTime: number; // hours
  readonly popularActivities: Array<{
    readonly activity: string;
    readonly count: number;
  }>;
}