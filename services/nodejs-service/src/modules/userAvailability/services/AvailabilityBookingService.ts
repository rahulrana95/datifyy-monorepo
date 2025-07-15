// services/nodejs-service/src/modules/userAvailability/services/AvailabilityBookingService.ts

import {
  BookAvailabilityRequest,
  UpdateBookingRequest,
  BookingResponse,
  BookingListResponse
} from '../../../proto-types/user/availability';
import { IAvailabilityBookingService } from './IAvailabilityBookingService';
import { IAvailabilityBookingRepository } from '../repositories/IAvailabilityBookingRepository';
import { UserAvailabilityMapper } from '../mappers/UserAvailabilityMapper';
import { Logger } from '../../../infrastructure/logging/Logger';
import { NotFoundError } from '../../../infrastructure/errors/AppErrors';

/**
 * Availability Booking Service Implementation
 * 
 * Comprehensive business logic for booking availability slots.
 * Handles validation, notifications, and booking lifecycle management.
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */
export class AvailabilityBookingService implements IAvailabilityBookingService {
  constructor(
    private readonly bookingRepository: IAvailabilityBookingRepository,
    private readonly mapper: UserAvailabilityMapper,
    private readonly logger: Logger
  ) {}

  /**
   * Book an availability slot
   */
  async bookAvailability(userId: number, bookingData: BookAvailabilityRequest): Promise<BookingResponse> {
    this.logger.info('Booking availability slot', { userId, availabilitySlotId: bookingData.availabilitySlotId });

    try {
      // 1. Validate the booking request
      await this.validateBookingRequest(userId, bookingData);

      // 2. Create the booking
      const createdBooking = await this.bookingRepository.create(userId, bookingData);

      // 3. Send notifications (TODO: implement notification service)
      await this.sendBookingNotifications(createdBooking);

      // 4. Convert to response DTO
      const response = await this.mapper.toBookingResponse(createdBooking);
      
      this.logger.info('Availability slot booked successfully', { 
        userId, 
        bookingId: createdBooking.id 
      });

      return response;
    } catch (error) {
      this.logger.error('Failed to book availability slot', { userId, error });
      throw error;
    }
  }

  /**
   * Get user's bookings (outgoing bookings made by the user)
   */
  async getUserBookings(userId: number, filters: any): Promise<BookingsListResponse> {
    this.logger.debug('Getting user bookings', { userId, filters });

    try {
      const paginatedResult = await this.bookingRepository.findByUserId(userId, filters);
      
      const bookingResponses = await Promise.all(
        paginatedResult.data.map(booking => this.mapper.toBookingResponse(booking))
      );

      const bookingSummary = {
        totalBookings: paginatedResult.pagination.total,
        upcomingBookings: bookingResponses.filter(b => 
          new Date(b.availability.availabilityDate) > new Date()
        ).length,
        completedBookings: bookingResponses.filter(b => b.bookingStatus === 'completed').length,
        cancelledBookings: bookingResponses.filter(b => b.bookingStatus === 'cancelled').length
      };

      const response: BookingsListResponse = {
        success: true,
        data: {
          ...paginatedResult,
          data: bookingResponses,
          bookingSummary
        },
        message: ''
      };

      this.logger.debug('User bookings retrieved', { userId, total: paginatedResult.pagination.total });
      return response;
    } catch (error) {
      this.logger.error('Failed to get user bookings', { userId, error });
      throw error;
    }
  }

  /**
   * Get incoming bookings (bookings on user's availability slots)
   */
  async getIncomingBookings(userId: number, filters: any): Promise<BookingsListResponse> {
    this.logger.debug('Getting incoming bookings', { userId, filters });

    try {
      const paginatedResult = await this.bookingRepository.findIncomingBookings(userId, filters);
      
      const bookingResponses = await Promise.all(
        paginatedResult.data.map(booking => this.mapper.toBookingResponse(booking))
      );

      const bookingSummary = {
        totalBookings: paginatedResult.pagination.total,
        upcomingBookings: bookingResponses.filter(b => 
          new Date(b.availability.availabilityDate) > new Date()
        ).length,
        completedBookings: bookingResponses.filter(b => b.bookingStatus === 'completed').length,
        cancelledBookings: bookingResponses.filter(b => b.bookingStatus === 'cancelled').length
      };

      const response: BookingsListResponse = {
        success: true,
        data: {
          ...paginatedResult,
          data: bookingResponses,
          bookingSummary
        },
        message: ''
      };

      this.logger.debug('Incoming bookings retrieved', { userId, total: paginatedResult.pagination.total });
      return response;
    } catch (error) {
      this.logger.error('Failed to get incoming bookings', { userId, error });
      throw error;
    }
  }

  /**
   * Get specific booking by ID
   */
  async getBookingById(bookingId: number, userId: number): Promise<BookingResponse> {
    this.logger.debug('Getting booking by ID', { bookingId, userId });

    try {
      const booking = await this.bookingRepository.findByIdWithAccess(bookingId, userId);
      if (!booking) {
        throw new NotFoundError('Booking not found or access denied');
      }

      const response = await this.mapper.toBookingResponse(booking);
      
      this.logger.debug('Booking retrieved successfully', { bookingId, userId });
      return response;
    } catch (error) {
      this.logger.error('Failed to get booking by ID', { bookingId, userId, error });
      throw error;
    }
  }

  /**
   * Update an existing booking
   */
  async updateBooking(bookingId: number, userId: number, updateData: UpdateBookingRequest): Promise<BookingResponse> {
    this.logger.info('Updating booking', { bookingId, userId, updateData });

    try {
      // 1. Check access and validate update
      const existingBooking = await this.bookingRepository.findByIdWithAccess(bookingId, userId);
      if (!existingBooking) {
        throw new NotFoundError('Booking not found or access denied');
      }

      // 2. Validate the update
      await this.validateBookingUpdate(existingBooking, updateData);

      // 3. Update the booking
      const updatedBooking = await this.bookingRepository.update(bookingId, updateData);
      const response = await this.mapper.toBookingResponse(updatedBooking);

      this.logger.info('Booking updated successfully', { bookingId, userId });
      return response;
    } catch (error) {
      this.logger.error('Failed to update booking', { bookingId, userId, error });
      throw error;
    }
  }

  /**
   * Cancel a booking
   */
  async cancelBooking(bookingId: number, userId: number, reason?: string): Promise<BookingResponse> {
    this.logger.info('Cancelling booking', { bookingId, userId, reason });

    try {
      const booking = await this.bookingRepository.findByIdWithAccess(bookingId, userId);
      if (!booking) {
        throw new NotFoundError('Booking not found or access denied');
      }

      // Check if cancellation is allowed
      await this.validateCancellation(booking);

      const cancelledBooking = await this.bookingRepository.cancel(bookingId, reason);
      const response = await this.mapper.toBookingResponse(cancelledBooking);

      this.logger.info('Booking cancelled successfully', { bookingId, userId });
      return response;
    } catch (error) {
      this.logger.error('Failed to cancel booking', { bookingId, userId, error });
      throw error;
    }
  }

  /**
   * Confirm a booking (for availability slot owner)
   */
  async confirmBooking(bookingId: number, userId: number): Promise<BookingResponse> {
    this.logger.info('Confirming booking', { bookingId, userId });

    try {
      const booking = await this.bookingRepository.findByIdForOwner(bookingId, userId);
      if (!booking) {
        throw new NotFoundError('Booking not found or you are not the availability owner');
      }

      const confirmedBooking = await this.bookingRepository.confirm(bookingId);
      const response = await this.mapper.toBookingResponse(confirmedBooking);

      this.logger.info('Booking confirmed successfully', { bookingId, userId });
      return response;
    } catch (error) {
      this.logger.error('Failed to confirm booking', { bookingId, userId, error });
      throw error;
    }
  }

  /**
   * Complete a booking (mark as completed after the date)
   */
  async completeBooking(bookingId: number, userId: number): Promise<BookingResponse> {
    this.logger.info('Completing booking', { bookingId, userId });

    try {
      const booking = await this.bookingRepository.findByIdWithAccess(bookingId, userId);
      if (!booking) {
        throw new NotFoundError('Booking not found or access denied');
      }

      const completedBooking = await this.bookingRepository.complete(bookingId);
      const response = await this.mapper.toBookingResponse(completedBooking);

      this.logger.info('Booking completed successfully', { bookingId, userId });
      return response;
    } catch (error) {
      this.logger.error('Failed to complete booking', { bookingId, userId, error });
      throw error;
    }
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  /**
   * Validate booking request
   * @private
   */
  private async validateBookingRequest(userId: number, bookingData: BookAvailabilityRequest): Promise<void> {
    // TODO: Implement comprehensive validation
    // - Check if slot is available
    // - Check if user can book (not own slot)
    // - Check booking limits
    // - Validate activity selection
  }

  /**
   * Validate booking update
   * @private
   */
  private async validateBookingUpdate(booking: any, updateData: UpdateBookingRequest): Promise<void> {
    // TODO: Implement update validation
    // - Check if update is allowed based on current status
    // - Validate status transitions
  }

  /**
   * Validate cancellation
   * @private
   */
  private async validateCancellation(booking: any): Promise<void> {
    // TODO: Implement cancellation validation
    // - Check cancellation policy
    // - Check timing constraints
  }

  /**
   * Send booking notifications
   * @private
   */
  private async sendBookingNotifications(booking: any): Promise<void> {
    // TODO: Implement notification sending
    // - Notify availability slot owner
    // - Send confirmation to booker
  }
}