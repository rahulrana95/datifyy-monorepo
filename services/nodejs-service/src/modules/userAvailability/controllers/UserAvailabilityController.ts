// services/nodejs-service/src/modules/userAvailability/controllers/UserAvailabilityController.ts

import { Request, Response, NextFunction } from 'express';
import { 
  CreateAvailabilityDto,
  UpdateAvailabilityDto,
  BulkCreateAvailabilityDto,
  GetAvailabilityDto,
  SearchAvailableUsersDto,
  CancelAvailabilityDto,
  GetAvailabilityAnalyticsDto
} from '../dtos/UserAvailabilityDtos';
import { IUserAvailabilityService } from '../services/IUserAvailabilityService';
import { Logger } from '../../../infrastructure/logging/Logger';
import { UnauthorizedError, ValidationError } from '../../../infrastructure/errors/AppErrors';
import { BulkCreateAvailabilityRequest, CreateAvailabilityRequest, GetAvailabilityRequest, SearchAvailableUsersRequest, UpdateAvailabilityRequest } from '@datifyy/shared-types';

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
 * User Availability Controller
 * 
 * Handles HTTP requests for user availability management.
 * Provides comprehensive CRUD operations, search, analytics, and optimization features.
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */
export class UserAvailabilityController {
  constructor(
    private readonly availabilityService: IUserAvailabilityService,
    private readonly logger: Logger
  ) {}

  /**
   * Create a new availability slot
   * POST /api/v1/availability
   * 
   * @param req - Express request with CreateAvailabilityDto in body
   * @param res - Express response
   * @param next - Express next function
   */
  async createAvailability(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.extractUserId(req);
      const availabilityData = req.body as CreateAvailabilityRequest;

      this.logger.info('Creating availability slot', { 
        userId, 
        date: availabilityData.availabilityDate,
        requestId: req.headers['x-request-id']
      });

      const result = await this.availabilityService.createAvailability(userId, availabilityData);

      res.status(201).json({
        success: true,
        message: 'Availability slot created successfully',
        data: result
      });
    } catch (error) {
      this.logger.error('Failed to create availability slot', { 
        userId: req.user?.id,
        error: error instanceof Error ? error.message : 'Unknown error',
        requestId: req.headers['x-request-id']
      });
      next(error);
    }
  }

  /**
   * Create multiple availability slots in bulk
   * POST /api/v1/availability/bulk
   * 
   * @param req - Express request with BulkCreateAvailabilityDto in body
   * @param res - Express response
   * @param next - Express next function
   */
  async createBulkAvailability(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.extractUserId(req);
      const bulkData = req.body as BulkCreateAvailabilityRequest;

      this.logger.info('Creating bulk availability slots', { 
        userId, 
        count: bulkData.slots.length,
        requestId: req.headers['x-request-id']
      });

      const result = await this.availabilityService.createBulkAvailability(userId, bulkData);

      res.status(201).json({
        success: true,
        message: `Bulk availability creation completed. ${result.data?.summary.successfullyCreated} slots created, ${result.data?.summary.skipped} skipped.`,
        data: result.data
      });
    } catch (error) {
      this.logger.error('Failed to create bulk availability', { 
        userId: req.user?.id,
        error: error instanceof Error ? error.message : 'Unknown error',
        requestId: req.headers['x-request-id']
      });
      next(error);
    }
  }

  /**
   * Get user's availability slots with filtering and pagination
   * GET /api/v1/availability
   * 
   * @param req - Express request with query parameters
   * @param res - Express response
   * @param next - Express next function
   */
  async getUserAvailability(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.extractUserId(req);
      const filters = req.query as unknown as GetAvailabilityRequest;

      this.logger.debug('Getting user availability', { 
        userId, 
        filters,
        requestId: req.headers['x-request-id']
      });

      const result = await this.availabilityService.getUserAvailability(userId, filters);

      res.status(200).json({
        success: true,
        message: 'User availability retrieved successfully',
        data: result.data
      });
    } catch (error) {
      this.logger.error('Failed to get user availability', { 
        userId: req.user?.id,
        error: error instanceof Error ? error.message : 'Unknown error',
        requestId: req.headers['x-request-id']
      });
      next(error);
    }
  }

  /**
   * Get specific availability slot by ID
   * GET /api/v1/availability/:id
   * 
   * @param req - Express request with availability ID in params
   * @param res - Express response
   * @param next - Express next function
   */
  async getAvailabilityById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.extractUserId(req);
      const availabilityId = this.extractAvailabilityId(req);

      this.logger.debug('Getting availability by ID', { 
        userId, 
        availabilityId,
        requestId: req.headers['x-request-id']
      });

      const result = await this.availabilityService.getAvailabilityById(availabilityId, userId);

      res.status(200).json({
        success: true,
        message: 'Availability slot retrieved successfully',
        data: result
      });
    } catch (error) {
      this.logger.error('Failed to get availability by ID', { 
        userId: req.user?.id,
        availabilityId: req.params.id,
        error: error instanceof Error ? error.message : 'Unknown error',
        requestId: req.headers['x-request-id']
      });
      next(error);
    }
  }

  /**
   * Update an existing availability slot
   * PUT /api/v1/availability/:id
   * 
   * @param req - Express request with availability ID and UpdateAvailabilityDto
   * @param res - Express response
   * @param next - Express next function
   */
  async updateAvailability(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.extractUserId(req);
      const availabilityId = this.extractAvailabilityId(req);
      const updateData = req.body as UpdateAvailabilityRequest;

      this.logger.info('Updating availability slot', { 
        userId, 
        availabilityId,
        updateData,
        requestId: req.headers['x-request-id']
      });

      const result = await this.availabilityService.updateAvailability(availabilityId, userId, updateData);

      res.status(200).json({
        success: true,
        message: 'Availability slot updated successfully',
        data: result
      });
    } catch (error) {
      this.logger.error('Failed to update availability slot', { 
        userId: req.user?.id,
        availabilityId: req.params.id,
        error: error instanceof Error ? error.message : 'Unknown error',
        requestId: req.headers['x-request-id']
      });
      next(error);
    }
  }

  /**
   * Cancel an availability slot
   * POST /api/v1/availability/:id/cancel
   * 
   * @param req - Express request with availability ID and CancelAvailabilityDto
   * @param res - Express response
   * @param next - Express next function
   */
  async cancelAvailability(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.extractUserId(req);
      const availabilityId = this.extractAvailabilityId(req);
      const cancelData = req.body as CancelAvailabilityDto;

      this.logger.info('Cancelling availability slot', { 
        userId, 
        availabilityId,
        reason: cancelData.reason,
        requestId: req.headers['x-request-id']
      });

      const result = await this.availabilityService.cancelAvailability(
        availabilityId, 
        userId, 
        cancelData.reason
      );

      res.status(200).json({
        success: true,
        message: 'Availability slot cancelled successfully',
        data: result
      });
    } catch (error) {
      this.logger.error('Failed to cancel availability slot', { 
        userId: req.user?.id,
        availabilityId: req.params.id,
        error: error instanceof Error ? error.message : 'Unknown error',
        requestId: req.headers['x-request-id']
      });
      next(error);
    }
  }

  /**
   * Delete an availability slot
   * DELETE /api/v1/availability/:id
   * 
   * @param req - Express request with availability ID
   * @param res - Express response
   * @param next - Express next function
   */
  async deleteAvailability(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.extractUserId(req);
      const availabilityId = this.extractAvailabilityId(req);
      const reason = req.body?.reason as string;

      this.logger.info('Deleting availability slot', { 
        userId, 
        availabilityId,
        reason,
        requestId: req.headers['x-request-id']
      });

      await this.availabilityService.deleteAvailability(availabilityId, userId, reason);

      res.status(200).json({
        success: true,
        message: 'Availability slot deleted successfully'
      });
    } catch (error) {
      this.logger.error('Failed to delete availability slot', { 
        userId: req.user?.id,
        availabilityId: req.params.id,
        error: error instanceof Error ? error.message : 'Unknown error',
        requestId: req.headers['x-request-id']
      });
      next(error);
    }
  }

  /**
   * Search for available users
   * GET /api/v1/availability/search
   * 
   * @param req - Express request with search parameters
   * @param res - Express response
   * @param next - Express next function
   */
  async searchAvailableUsers(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.extractUserId(req);
      const searchCriteria = req.query as unknown as SearchAvailableUsersRequest;

      this.logger.debug('Searching available users', { 
        userId, 
        searchCriteria,
        requestId: req.headers['x-request-id']
      });

      const result = await this.availabilityService.searchAvailableUsers(searchCriteria, userId);

      res.status(200).json({
        success: true,
        message: 'Available users search completed',
        data: result.data
      });
    } catch (error) {
      this.logger.error('Failed to search available users', { 
        userId: req.user?.id,
        error: error instanceof Error ? error.message : 'Unknown error',
        requestId: req.headers['x-request-id']
      });
      next(error);
    }
  }

  /**
   * Get availability analytics
   * GET /api/v1/availability/analytics
   * 
   * @param req - Express request with analytics parameters
   * @param res - Express response
   * @param next - Express next function
   */
  async getAvailabilityAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.extractUserId(req);
      const analyticsRequest = req.query as unknown as GetAvailabilityAnalyticsDto;

      this.logger.debug('Getting availability analytics', { 
        userId, 
        analyticsRequest,
        requestId: req.headers['x-request-id']
      });

      const result = await this.availabilityService.getAvailabilityAnalytics(userId, analyticsRequest);

      res.status(200).json({
        success: true,
        message: 'Availability analytics retrieved successfully',
        data: result.data
      });
    } catch (error) {
      this.logger.error('Failed to get availability analytics', { 
        userId: req.user?.id,
        error: error instanceof Error ? error.message : 'Unknown error',
        requestId: req.headers['x-request-id']
      });
      next(error);
    }
  }

  /**
   * Get calendar view
   * GET /api/v1/availability/calendar/:month
   * 
   * @param req - Express request with month parameter (YYYY-MM)
   * @param res - Express response
   * @param next - Express next function
   */
  async getCalendarView(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.extractUserId(req);
      const month = req.params.month;

      // Validate month format
      if (!/^\d{4}-\d{2}$/.test(month)) {
          throw new ValidationError('Month must be in YYYY-MM format');
      }

      this.logger.debug('Getting calendar view', { 
        userId, 
        month,
        requestId: req.headers['x-request-id']
      });

      const result = await this.availabilityService.getCalendarView(userId, month);

      res.status(200).json({
        success: true,
        message: 'Calendar view retrieved successfully',
        data: result.data
      });
    } catch (error) {
      this.logger.error('Failed to get calendar view', { 
        userId: req.user?.id,
        month: req.params.month,
        error: error instanceof Error ? error.message : 'Unknown error',
        requestId: req.headers['x-request-id']
      });
      next(error);
    }
  }

  /**
   * Get AI-powered time suggestions
   * GET /api/v1/availability/suggestions
   * 
   * @param req - Express request with optional daysAhead query parameter
   * @param res - Express response
   * @param next - Express next function
   */
  async getTimeSuggestions(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.extractUserId(req);
      const daysAhead = req.query.daysAhead ? parseInt(req.query.daysAhead as string, 10) : undefined;

      this.logger.debug('Getting time suggestions', { 
        userId, 
        daysAhead,
        requestId: req.headers['x-request-id']
      });

      const result = await this.availabilityService.getTimeSuggestions(userId, daysAhead);

      res.status(200).json({
        success: true,
        message: 'Time suggestions retrieved successfully',
        data: result.data
      });
    } catch (error) {
      this.logger.error('Failed to get time suggestions', { 
        userId: req.user?.id,
        error: error instanceof Error ? error.message : 'Unknown error',
        requestId: req.headers['x-request-id']
      });
      next(error);
    }
  }

  /**
   * Check availability conflicts
   * POST /api/v1/availability/check-conflicts
   * 
   * @param req - Express request with conflict check data
   * @param res - Express response
   * @param next - Express next function
   */
  async checkAvailabilityConflicts(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.extractUserId(req);
      const { date, startTime, endTime, excludeId } = req.body;

      this.logger.debug('Checking availability conflicts', { 
        userId, 
        date,
        startTime,
        endTime,
        excludeId,
        requestId: req.headers['x-request-id']
      });

      const conflicts = await this.availabilityService.checkAvailabilityConflicts(
        userId, 
        date, 
        startTime, 
        endTime, 
        excludeId
      );

      res.status(200).json({
        success: true,
        message: 'Conflict check completed',
        data: {
          hasConflicts: conflicts.length > 0,
          conflicts,
          conflictCount: conflicts.length
        }
      });
    } catch (error) {
      this.logger.error('Failed to check availability conflicts', { 
        userId: req.user?.id,
        error: error instanceof Error ? error.message : 'Unknown error',
        requestId: req.headers['x-request-id']
      });
      next(error);
    }
  }

  /**
   * Cancel recurring slots
   * POST /api/v1/availability/:id/cancel-recurring
   * 
   * @param req - Express request with parent availability ID
   * @param res - Express response
   * @param next - Express next function
   */
  async cancelRecurringSlots(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.extractUserId(req);
      const parentAvailabilityId = this.extractAvailabilityId(req);
      const reason = req.body.reason as string;

      this.logger.info('Cancelling recurring slots', { 
        userId, 
        parentAvailabilityId,
        reason,
        requestId: req.headers['x-request-id']
      });

      const cancelledCount = await this.availabilityService.cancelRecurringSlots(
        parentAvailabilityId, 
        userId, 
        reason
      );

      res.status(200).json({
        success: true,
        message: `${cancelledCount} recurring slots cancelled successfully`,
        data: {
          cancelledCount,
          parentAvailabilityId
        }
      });
    } catch (error) {
      this.logger.error('Failed to cancel recurring slots', { 
        userId: req.user?.id,
        parentAvailabilityId: req.params.id,
        error: error instanceof Error ? error.message : 'Unknown error',
        requestId: req.headers['x-request-id']
      });
      next(error);
    }
  }

  /**
   * Get availability statistics summary
   * GET /api/v1/availability/stats
   * 
   * @param req - Express request with date range parameters
   * @param res - Express response
   * @param next - Express next function
   */
  async getAvailabilityStats(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.extractUserId(req);
      const { startDate, endDate } = req.query as { startDate?: string; endDate?: string };

      // Default to last 30 days if not provided
      const defaultEndDate = new Date().toISOString().split('T')[0];
      const defaultStartDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      this.logger.debug('Getting availability stats', { 
        userId, 
        startDate: startDate || defaultStartDate,
        endDate: endDate || defaultEndDate,
        requestId: req.headers['x-request-id']
      });

      const result = await this.availabilityService.getAvailabilityStatsSummary(
        userId, 
        startDate || defaultStartDate, 
        endDate || defaultEndDate
      );

      res.status(200).json({
        success: true,
        message: 'Availability statistics retrieved successfully',
        data: result
      });
    } catch (error) {
      this.logger.error('Failed to get availability stats', { 
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
   * Extract and validate availability ID from request parameters
   * @private
   */
  private extractAvailabilityId(req: Request): number {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      throw new ValidationError('Invalid availability ID');
    }
    return id;
  }
}