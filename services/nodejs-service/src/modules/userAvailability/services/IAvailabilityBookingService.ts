// services/nodejs-service/src/modules/userAvailability/services/IAvailabilityBookingService.ts

import {
  BookAvailabilityRequest,
  UpdateBookingRequest,
  BookingResponse,
  BookingListResponse
} from '../../../proto-types';

/**
 * Availability Booking Service Interface
 * 
 * Defines business logic operations for booking availability slots.
 * Handles the complete booking lifecycle and related notifications.
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */
export interface IAvailabilityBookingService {
  /**
   * Book an availability slot
   * @param userId - The user ID making the booking
   * @param bookingData - The booking request data
   * @returns Promise<BookingResponse> - Created booking with details
   */
  bookAvailability(userId: number, bookingData: BookAvailabilityRequest): Promise<BookingResponse>;

  /**
   * Get user's bookings (outgoing bookings made by the user)
   * @param userId - The user ID
   * @param filters - Filter and pagination options
   * @returns Promise<BookingsListResponse> - Paginated booking list
   */
  getUserBookings(userId: number, filters: any): Promise<BookingListResponse>;

  /**
   * Get incoming bookings (bookings on user's availability slots)
   * @param userId - The user ID (availability slot owner)
   * @param filters - Filter and pagination options
   * @returns Promise<BookingsListResponse> - Paginated incoming bookings
   */
  getIncomingBookings(userId: number, filters: any): Promise<BookingListResponse>;

  /**
   * Get specific booking by ID
   * @param bookingId - The booking ID
   * @param userId - The user ID (for access validation)
   * @returns Promise<BookingResponse> - Booking details
   */
  getBookingById(bookingId: number, userId: number): Promise<BookingResponse>;

  /**
   * Update an existing booking
   * @param bookingId - The booking ID
   * @param userId - The user ID (for access validation)
   * @param updateData - Updated booking data
   * @returns Promise<BookingResponse> - Updated booking
   */
  updateBooking(bookingId: number, userId: number, updateData: UpdateBookingRequest): Promise<BookingResponse>;

  /**
   * Cancel a booking
   * @param bookingId - The booking ID
   * @param userId - The user ID (for access validation)
   * @param reason - Optional cancellation reason
   * @returns Promise<BookingResponse> - Cancelled booking
   */
  cancelBooking(bookingId: number, userId: number, reason?: string): Promise<BookingResponse>;

  /**
   * Confirm a booking (for availability slot owner)
   * @param bookingId - The booking ID
   * @param userId - The user ID (availability slot owner)
   * @returns Promise<BookingResponse> - Confirmed booking
   */
  confirmBooking(bookingId: number, userId: number): Promise<BookingResponse>;

  /**
   * Complete a booking (mark as completed after the date)
   * @param bookingId - The booking ID
   * @param userId - The user ID (for access validation)
   * @returns Promise<BookingResponse> - Completed booking
   */
  completeBooking(bookingId: number, userId: number): Promise<BookingResponse>;
}