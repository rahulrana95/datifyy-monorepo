// services/nodejs-service/src/modules/userAvailability/controllers/AvailabilityBookingController.ts

import { Request, Response, NextFunction } from 'express';
import { 
  BookAvailabilityDto,
  UpdateBookingDto
} from '../dtos/UserAvailabilityDtos';
import { IAvailabilityBookingService } from '../services/IAvailabilityBookingService';
import { Logger } from '../../../infrastructure/logging/Logger';
import { UnauthorizedError, ValidationError } from '../../../infrastructure/errors/AppErrors';

/**
 * Interface for authenticated request with user information
 */
interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    isAdmin: boolean;
  };
}

/**
 * Availability Booking Controller
 * 
 * Handles HTTP requests for booking availability slots.
 * Manages the complete booking lifecycle from creation to completion.
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */
export class AvailabilityBookingController {
  constructor(
    private readonly bookingService: IAvailabilityBookingService,
    private readonly logger: Logger
  ) {}

  /**
   * Book an availability slot
   * POST /api/v1/availability/book
   * 
   * @param req - Express request with BookAvailabilityDto in body
   * @param res - Express response
   * @param next - Express next function
   */
  async bookAvailability(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.extractUserId(req);
      const bookingData = req.body as BookAvailabilityDto;

      this.logger.info('Booking availability slot', { 
        userId, 
        availabilityId: bookingData.availabilityId,
        activity: bookingData.selectedActivity,
        requestId: req.headers['x-request-id']
      });

      const result = await this.bookingService.bookAvailability(userId, bookingData);

      res.status(201).json({
        success: true,
        message: 'Availability slot booked successfully',
        data: result
      });
    } catch (error) {
      this.logger.error('Failed to book availability slot', { 
        userId: req.user?.id,
        error: error instanceof Error ? error.message : 'Unknown error',
        requestId: req.headers['x-request-id']
      });
      next(error);
    }
  }

  /**
   * Get user's bookings with filtering and pagination
   * GET /api/v1/availability/bookings
   * 
   * @param req - Express request with query parameters
   * @param res - Express response
   * @param next - Express next function
   */
  async getUserBookings(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.extractUserId(req);
      const filters = req.query;

      this.logger.debug('Getting user bookings', { 
        userId, 
        filters,
        requestId: req.headers['x-request-id']
      });

      const result = await this.bookingService.getUserBookings(userId, filters);

      res.status(200).json({
        success: true,
        message: 'User bookings retrieved successfully',
        data: result.data
      });
    } catch (error) {
      this.logger.error('Failed to get user bookings', { 
        userId: req.user?.id,
        error: error instanceof Error ? error.message : 'Unknown error',
        requestId: req.headers['x-request-id']
      });
      next(error);
    }
  }

  /**
   * Get specific booking by ID
   * GET /api/v1/availability/bookings/:id
   * 
   * @param req - Express request with booking ID in params
   * @param res - Express response
   * @param next - Express next function
   */
  async getBookingById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.extractUserId(req);
      const bookingId = this.extractBookingId(req);

      this.logger.debug('Getting booking by ID', { 
        userId, 
        bookingId,
        requestId: req.headers['x-request-id']
      });

      const result = await this.bookingService.getBookingById(bookingId, userId);

      res.status(200).json({
        success: true,
        message: 'Booking retrieved successfully',
        data: result
      });
    } catch (error) {
      this.logger.error('Failed to get booking by ID', { 
        userId: req.user?.id,
        bookingId: req.params.id,
        error: error instanceof Error ? error.message : 'Unknown error',
        requestId: req.headers['x-request-id']
      });
      next(error);
    }
  }

  /**
   * Update an existing booking
   * PUT /api/v1/availability/bookings/:id
   * 
   * @param req - Express request with booking ID and UpdateBookingDto
   * @param res - Express response
   * @param next - Express next function
   */
  async updateBooking(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.extractUserId(req);
      const bookingId = this.extractBookingId(req);
      const updateData = req.body as UpdateBookingDto;

      this.logger.info('Updating booking', { 
        userId, 
        bookingId,
        updateData,
        requestId: req.headers['x-request-id']
      });

      const result = await this.bookingService.updateBooking(bookingId, userId, updateData);

      res.status(200).json({
        success: true,
        message: 'Booking updated successfully',
        data: result
      });
    } catch (error) {
      this.logger.error('Failed to update booking', { 
        userId: req.user?.id,
        bookingId: req.params.id,
        error: error instanceof Error ? error.message : 'Unknown error',
        requestId: req.headers['x-request-id']
      });
      next(error);
    }
  }

  /**
   * Cancel a booking
   * POST /api/v1/availability/bookings/:id/cancel
   * 
   * @param req - Express request with booking ID and cancellation reason
   * @param res - Express response
   * @param next - Express next function
   */
  async cancelBooking(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.extractUserId(req);
      const bookingId = this.extractBookingId(req);
      const reason = req.body.reason as string;

      this.logger.info('Cancelling booking', { 
        userId, 
        bookingId,
        reason,
        requestId: req.headers['x-request-id']
      });

      const result = await this.bookingService.cancelBooking(bookingId, userId, reason);

      res.status(200).json({
        success: true,
        message: 'Booking cancelled successfully',
        data: result
      });
    } catch (error) {
      this.logger.error('Failed to cancel booking', { 
        userId: req.user?.id,
        bookingId: req.params.id,
        error: error instanceof Error ? error.message : 'Unknown error',
        requestId: req.headers['x-request-id']
      });
      next(error);
    }
  }

  /**
   * Confirm a booking (for availability owner)
   * POST /api/v1/availability/bookings/:id/confirm
   * 
   * @param req - Express request with booking ID
   * @param res - Express response
   * @param next - Express next function
   */
  async confirmBooking(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.extractUserId(req);
      const bookingId = this.extractBookingId(req);

      this.logger.info('Confirming booking', { 
        userId, 
        bookingId,
        requestId: req.headers['x-request-id']
      });

      const result = await this.bookingService.confirmBooking(bookingId, userId);

      res.status(200).json({
        success: true,
        message: 'Booking confirmed successfully',
        data: result
      });
    } catch (error) {
      this.logger.error('Failed to confirm booking', { 
        userId: req.user?.id,
        bookingId: req.params.id,
        error: error instanceof Error ? error.message : 'Unknown error',
        requestId: req.headers['x-request-id']
      });
      next(error);
    }
  }

  /**
   * Complete a booking (mark as completed)
   * POST /api/v1/availability/bookings/:id/complete
   * 
   * @param req - Express request with booking ID
   * @param res - Express response
   * @param next - Express next function
   */
  async completeBooking(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.extractUserId(req);
      const bookingId = this.extractBookingId(req);

      this.logger.info('Completing booking', { 
        userId, 
        bookingId,
        requestId: req.headers['x-request-id']
      });

      const result = await this.bookingService.completeBooking(bookingId, userId);

      res.status(200).json({
        success: true,
        message: 'Booking completed successfully',
        data: result
      });
    } catch (error) {
      this.logger.error('Failed to complete booking', { 
        userId: req.user?.id,
        bookingId: req.params.id,
        error: error instanceof Error ? error.message : 'Unknown error',
        requestId: req.headers['x-request-id']
      });
      next(error);
    }
  }

  /**
   * Get bookings for user's availability slots (incoming bookings)
   * GET /api/v1/availability/incoming-bookings
   * 
   * @param req - Express request with query parameters
   * @param res - Express response
   * @param next - Express next function
   */
  async getIncomingBookings(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.extractUserId(req);
      const filters = req.query;

      this.logger.debug('Getting incoming bookings', { 
        userId, 
        filters,
        requestId: req.headers['x-request-id']
      });

      const result = await this.bookingService.getIncomingBookings(userId, filters);

      res.status(200).json({
        success: true,
        message: 'Incoming bookings retrieved successfully',
        data: result.data
      });
    } catch (error) {
      this.logger.error('Failed to get incoming bookings', { 
        userId: req.user?.id,
        error: error instanceof Error ? error.message : 'Unknown error',
        requestId: req.headers['x-request-id']
      });
      next(error);
    }
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  /**
   * Extract user ID from authenticated request
   * @private
   */
  private extractUserId(req: AuthenticatedRequest): number {
    if (!req.user?.id) {
      throw new UnauthorizedError('User authentication required');
    }
    return req.user.id;
  }

  /**
   * Extract and validate booking ID from request parameters
   * @private
   */
  private extractBookingId(req: Request): number {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      throw new ValidationError('Invalid booking ID');
    }
    return id;
  }
}