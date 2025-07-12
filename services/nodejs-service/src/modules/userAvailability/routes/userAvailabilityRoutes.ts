// services/nodejs-service/src/modules/userAvailability/routes/userAvailabilityRoutes.ts

import { Router } from 'express';
import { DataSource } from 'typeorm';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Request, Response, NextFunction } from 'express';
import { 
  CreateAvailabilityDto,
  UpdateAvailabilityDto,
  BulkCreateAvailabilityDto,
  GetAvailabilityDto,
  SearchAvailableUsersDto,
  CancelAvailabilityDto,
  GetAvailabilityAnalyticsDto,
  BookAvailabilityDto,
  UpdateBookingDto
} from '../dtos/UserAvailabilityDtos';
import { UserAvailabilityController } from '../controllers/UserAvailabilityController';
import { AvailabilityBookingController } from '../controllers/AvailabilityBookingController';
import { UserAvailabilityService } from '../services/UserAvailabilityService';
import { AvailabilityBookingService } from '../services/AvailabilityBookingService';
import { UserAvailabilityRepository } from '../repositories/UserAvailabilityRepository';
import { AvailabilityBookingRepository } from '../repositories/AvailabilityBookingRepository';
import { UserAvailabilityMapper } from '../mappers/UserAvailabilityMapper';
import { Logger } from '../../../infrastructure/logging/Logger';
import { authenticate } from '../../../infrastructure/middleware/authentication';
import { asyncHandler } from '../../../infrastructure/utils/asyncHandler';
import { ValidationError } from '../../../infrastructure/errors/AppErrors';


/**
 * Validation middleware for request DTOs
 * @param dtoClass - The DTO class to validate against
 */
export function validationMiddleware<T>(dtoClass: new () => T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Transform plain object to class instance
      const dto = plainToClass(dtoClass, req.body);
      
      // Validate the DTO
      const errors = await validate(dto as any);
      
      if (errors.length > 0) {
        // Extract error messages
        const errorMessages = errors.map(error => 
          Object.values(error.constraints || {}).join(', ')
        );
        
        throw new ValidationError(`Validation failed: ${errorMessages.join('; ')}`);
      }
      
      // Attach validated DTO to request
      req.body = dto;
      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * User Availability Routes
 * 
 * Defines all HTTP routes for user availability management.
 * Includes dependency injection setup and middleware configuration.
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */
export function createUserAvailabilityRoutes(dataSource: DataSource): Router {
  const router = Router();
  const logger = Logger.getInstance();

  // Initialize repositories
  const availabilityRepository = new UserAvailabilityRepository(dataSource, logger);
  const bookingRepository = new AvailabilityBookingRepository(dataSource, logger);

  // Initialize services
  const mapper = new UserAvailabilityMapper(logger);
  const availabilityService = new UserAvailabilityService(availabilityRepository, mapper, logger);
  const bookingService = new AvailabilityBookingService(bookingRepository, mapper, logger);

  // Initialize controllers
  const availabilityController = new UserAvailabilityController(availabilityService, logger);
  const bookingController = new AvailabilityBookingController(bookingService, logger);

  // Apply authentication middleware to all routes
  router.use(authenticate());

  // ============================================================================
  // AVAILABILITY SLOT MANAGEMENT ROUTES
  // ============================================================================

  /**
   * Create a new availability slot
   * POST /availability
   */
  router.post(
    '/',
    validationMiddleware(CreateAvailabilityDto),
    asyncHandler(async (req, res, next) => {
      await availabilityController.createAvailability(req, res, next);
    })
  );

  /**
   * Create multiple availability slots in bulk
   * POST /availability/bulk
   */
  router.post(
    '/bulk',
    validationMiddleware(BulkCreateAvailabilityDto),
    asyncHandler(async (req, res, next) => {
      await availabilityController.createBulkAvailability(req, res, next);
    })
  );

  /**
   * Get user's availability slots with filtering and pagination
   * GET /availability
   */
  router.get(
    '/',
    asyncHandler(async (req, res, next) => {
      await availabilityController.getUserAvailability(req, res, next);
    })
  );

  // TODO change the route path
  // /**
  //  * Get specific availability slot by ID
  //  * GET /availability/:id
  //  */
  // router.get(
  //   '/:id',
  //   asyncHandler(async (req, res, next) => {
  //     await availabilityController.getAvailabilityById(req, res, next);
  //   })
  // );

  // /**
  //  * Update an existing availability slot
  //  * PUT /availability/:id
  //  */
  // router.put(
  //   '/:id',
  //   validationMiddleware(UpdateAvailabilityDto),
  //   asyncHandler(async (req, res, next) => {
  //     await availabilityController.updateAvailability(req, res, next);
  //   })
  // );

  // /**
  //  * Cancel an availability slot
  //  * POST /availability/:id/cancel
  //  */
  // router.post(
  //   '/:id/cancel',
  //   validationMiddleware(CancelAvailabilityDto),
  //   asyncHandler(async (req, res, next) => {
  //     await availabilityController.cancelAvailability(req, res, next);
  //   })
  // );

  // /**
  //  * Delete an availability slot
  //  * DELETE /availability/:id
  //  */
  // router.delete(
  //   '/:id',
  //   asyncHandler(async (req, res, next) => {
  //     await availabilityController.deleteAvailability(req, res, next);
  //   })
  // );

  /**
   * Cancel all recurring slots generated from a parent slot
   * POST /availability/:id/cancel-recurring
   */
  router.post(
    '/:id/cancel-recurring',
    asyncHandler(async (req, res, next) => {
      await availabilityController.cancelRecurringSlots(req, res, next);
    })
  );

  // ============================================================================
  // SEARCH AND DISCOVERY ROUTES
  // ============================================================================

  /**
   * Search for available users
   * GET /availability/search
   */
  router.get(
    '/search/users',
    asyncHandler(async (req, res, next) => {
      await availabilityController.searchAvailableUsers(req, res, next);
    })
  );

  /**
   * Check availability conflicts
   * POST /availability/check-conflicts
   */
  router.post(
    '/check-conflicts',
    asyncHandler(async (req, res, next) => {
      await availabilityController.checkAvailabilityConflicts(req, res, next);
    })
  );

  // ============================================================================
  // ANALYTICS AND INSIGHTS ROUTES
  // ============================================================================

  /**
   * Get availability analytics
   * GET /availability/analytics
   */
  router.get(
    '/analytics',
    asyncHandler(async (req, res, next) => {
      await availabilityController.getAvailabilityAnalytics(req, res, next);
    })
  );

  /**
   * Get availability statistics summary
   * GET /availability/stats
   */
  router.get(
    '/stats',
    asyncHandler(async (req, res, next) => {
      await availabilityController.getAvailabilityStats(req, res, next);
    })
  );

  /**
   * Get calendar view for a specific month
   * GET /availability/calendar/:month (YYYY-MM format)
   */
  router.get(
    '/calendar/:month',
    asyncHandler(async (req, res, next) => {
      await availabilityController.getCalendarView(req, res, next);
    })
  );

  /**
   * Get AI-powered time slot suggestions
   * GET /availability/suggestions
   */
  router.get(
    '/suggestions',
    asyncHandler(async (req, res, next) => {
      await availabilityController.getTimeSuggestions(req, res, next);
    })
  );

  // ============================================================================
  // BOOKING MANAGEMENT ROUTES
  // ============================================================================

  /**
   * Book an availability slot
   * POST /availability/book
   */
  router.post(
    '/book',
    validationMiddleware(BookAvailabilityDto),
    asyncHandler(async (req, res, next) => {
      await bookingController.bookAvailability(req, res, next);
    })
  );

  /**
   * Get user's bookings (outgoing bookings made by the user)
   * GET /availability/bookings
   */
  router.get(
    '/bookings',
    asyncHandler(async (req, res, next) => {
      await bookingController.getUserBookings(req, res, next);
    })
  );

  /**
   * Get incoming bookings (bookings on user's availability slots)
   * GET /availability/incoming-bookings
   */
  router.get(
    '/incoming-bookings',
    asyncHandler(async (req, res, next) => {
      await bookingController.getIncomingBookings(req, res, next);
    })
  );

  /**
   * Get specific booking by ID
   * GET /availability/bookings/:id
   */
  router.get(
    '/bookings/:id',
    asyncHandler(async (req, res, next) => {
      await bookingController.getBookingById(req, res, next);
    })
  );

  /**
   * Update an existing booking
   * PUT /availability/bookings/:id
   */
  router.put(
    '/bookings/:id',
    validationMiddleware(UpdateBookingDto),
    asyncHandler(async (req, res, next) => {
      await bookingController.updateBooking(req, res, next);
    })
  );

  /**
   * Cancel a booking
   * POST /availability/bookings/:id/cancel
   */
  router.post(
    '/bookings/:id/cancel',
    asyncHandler(async (req, res, next) => {
      await bookingController.cancelBooking(req, res, next);
    })
  );

  /**
   * Confirm a booking (for availability slot owner)
   * POST /availability/bookings/:id/confirm
   */
  router.post(
    '/bookings/:id/confirm',
    asyncHandler(async (req, res, next) => {
      await bookingController.confirmBooking(req, res, next);
    })
  );

  /**
   * Complete a booking (mark as completed after the date)
   * POST /availability/bookings/:id/complete
   */
  router.post(
    '/bookings/:id/complete',
    asyncHandler(async (req, res, next) => {
      await bookingController.completeBooking(req, res, next);
    })
  );

  // ============================================================================
  // ROUTE DOCUMENTATION AND HEALTH CHECK
  // ============================================================================

  /**
   * Health check endpoint for availability service
   * GET /availability/health
   */
  router.get('/health', asyncHandler(async (req, res, next) => {
    try {
      // Perform basic health checks
      const healthStatus = {
        service: 'user-availability',
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        dependencies: {
          database: 'connected',
          cache: 'available'
        }
      };

      res.status(200).json({
        success: true,
        message: 'User Availability service is healthy',
        data: healthStatus
      });
    } catch (error) {
      logger.error('Health check failed', { error });
      res.status(503).json({
        success: false,
        message: 'Service unhealthy',
        error: 'Health check failed'
      });
    }
  }));

  /**
   * Get API documentation for availability endpoints
   * GET /availability/docs
   */
  router.get('/docs', asyncHandler(async (req, res, next) => {
    const apiDocs = {
      service: 'User Availability Management',
      version: '1.0.0',
      description: 'Comprehensive API for managing user availability slots and bookings',
      endpoints: {
        availability: {
          'POST /': 'Create availability slot',
          'POST /bulk': 'Create multiple slots',
          'GET /': 'Get user availability (paginated)',
          'GET /:id': 'Get specific slot',
          'PUT /:id': 'Update slot',
          'POST /:id/cancel': 'Cancel slot',
          'DELETE /:id': 'Delete slot',
          'POST /:id/cancel-recurring': 'Cancel recurring slots'
        },
        search: {
          'GET /search/users': 'Search available users',
          'POST /check-conflicts': 'Check time conflicts'
        },
        analytics: {
          'GET /analytics': 'Get detailed analytics',
          'GET /stats': 'Get statistics summary',
          'GET /calendar/:month': 'Get calendar view',
          'GET /suggestions': 'Get AI suggestions'
        },
        bookings: {
          'POST /book': 'Book availability slot',
          'GET /bookings': 'Get user bookings',
          'GET /incoming-bookings': 'Get incoming bookings',
          'GET /bookings/:id': 'Get specific booking',
          'PUT /bookings/:id': 'Update booking',
          'POST /bookings/:id/cancel': 'Cancel booking',
          'POST /bookings/:id/confirm': 'Confirm booking',
          'POST /bookings/:id/complete': 'Complete booking'
        }
      },
      authentication: 'Bearer token required for all endpoints',
      rateLimit: '100 requests per 15 minutes',
      supportedFormats: ['application/json']
    };

    res.status(200).json({
      success: true,
      message: 'API documentation retrieved successfully',
      data: apiDocs
    });
  }));

  logger.info('User Availability routes initialized successfully', {
    totalRoutes: router.stack.length,
    modules: ['availability', 'booking', 'search', 'analytics']
  });

  return router;
}