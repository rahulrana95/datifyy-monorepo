// services/nodejs-service/src/routes/dateCuration/dateCurationRoutes.ts

import { Router } from 'express';
import { DataSource } from 'typeorm';
import { DateCurationController } from '../../modules/dateCuration/controllers/DateCurationController';
import { 
  validateCreateCuratedDate,
  validateUpdateCuratedDate,
  validateConfirmDate,
  validateCancelDate,
  validateSubmitDateFeedback,
  validateGetUserDates,
  validateAdminGetDates,
  validateSearchPotentialMatches,
  validateDateCurationAnalytics
} from '../../modules/dateCuration/dtos/DateCurationDtos';
import { asyncHandler } from '../../infrastructure/utils/asyncHandler';
import { authenticateToken, checkIsAdmin } from '../../middlewares/authentication';
import { Logger } from '../../infrastructure/logging/Logger';
import { AuthenticatedRequest } from '../../infrastructure/middleware/authentication';

/**
 * Factory function to create date curation routes with dependency injection
 */
export function createDateCurationRoutes(dataSource: DataSource): Router {
  const router = Router();
  const logger = Logger.getInstance();
  
  // Initialize DateCurationController with dependencies
  const dateCurationController = new DateCurationController(dataSource, logger);

  logger.info('Initializing Date Curation Routes', {
    module: 'DateCurationRoutes',
    timestamp: new Date().toISOString()
  });

  // ============================================================================
  // USER ROUTES (Authenticated Users)
  // ============================================================================

  /**
   * GET /my-dates
   * Get current user's curated dates (upcoming, past, pending)
   */
  router.get('/my-dates',
    authenticateToken,
    validateGetUserDates, // Query parameter validation
    asyncHandler(async (req, res, next) => {
      await dateCurationController.getUserDates(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * GET /my-dates/:dateId
   * Get specific curated date details for current user
   */
  router.get('/my-dates/:dateId',
    authenticateToken,
    asyncHandler(async (req, res, next) => {
      await dateCurationController.getUserDateById(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * POST /my-dates/:dateId/confirm
   * User confirms their attendance for a curated date
   */
  router.post('/my-dates/:dateId/confirm',
    authenticateToken,
    validateConfirmDate,
    asyncHandler(async (req, res, next) => {
      await dateCurationController.confirmDate(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * POST /my-dates/:dateId/cancel
   * User cancels their curated date
   */
  router.post('/my-dates/:dateId/cancel',
    authenticateToken,
    validateCancelDate,
    asyncHandler(async (req, res, next) => {
      await dateCurationController.cancelDate(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * POST /my-dates/:dateId/feedback
   * User submits feedback after completing a date
   */
  router.post('/my-dates/:dateId/feedback',
    authenticateToken,
    validateSubmitDateFeedback,
    asyncHandler(async (req, res, next) => {
      await dateCurationController.submitDateFeedback(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * GET /my-dates/:dateId/feedback
   * Get user's feedback for a specific date
   */
  router.get('/my-dates/:dateId/feedback',
    authenticateToken,
    asyncHandler(async (req, res, next) => {
      await dateCurationController.getUserDateFeedback(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * PUT /my-dates/:dateId/feedback
   * Update user's feedback for a specific date (within edit window)
   */
  router.put('/my-dates/:dateId/feedback',
    authenticateToken,
    validateSubmitDateFeedback,
    asyncHandler(async (req, res, next) => {
      await dateCurationController.updateDateFeedback(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * GET /my-trust-score
   * Get current user's trust/love score details
   */
  router.get('/my-trust-score',
    authenticateToken,
    asyncHandler(async (req, res, next) => {
      await dateCurationController.getUserTrustScore(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * GET /my-date-series
   * Get all date series for current user (multiple dates with same people)
   */
  router.get('/my-date-series',
    authenticateToken,
    asyncHandler(async (req, res, next) => {
      await dateCurationController.getUserDateSeries(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * GET /my-date-series/:seriesId
   * Get specific date series details
   */
  router.get('/my-date-series/:seriesId',
    authenticateToken,
    asyncHandler(async (req, res, next) => {
      await dateCurationController.getDateSeriesById(req as AuthenticatedRequest, res, next);
    })
  );

  // ============================================================================
  // ADMIN ROUTES (Admin Only)
  // ============================================================================

  /**
   * POST /admin/curated-dates
   * Admin creates a new curated date between two users
   */
  router.post('/admin/curated-dates',
    authenticateToken,
    checkIsAdmin,
    validateCreateCuratedDate,
    asyncHandler(async (req, res, next) => {
      await dateCurationController.createCuratedDate(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * GET /admin/curated-dates
   * Admin gets all curated dates with filters and pagination
   */
  router.get('/admin/curated-dates',
    authenticateToken,
    checkIsAdmin,
    validateAdminGetDates,
    asyncHandler(async (req, res, next) => {
      await dateCurationController.getAdminCuratedDates(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * GET /admin/curated-dates/:dateId
   * Admin gets specific curated date with full details
   */
  router.get('/admin/curated-dates/:dateId',
    authenticateToken,
    checkIsAdmin,
    asyncHandler(async (req, res, next) => {
      await dateCurationController.getAdminCuratedDateById(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * PUT /admin/curated-dates/:dateId
   * Admin updates curated date details
   */
  router.put('/admin/curated-dates/:dateId',
    authenticateToken,
    checkIsAdmin,
    validateUpdateCuratedDate,
    asyncHandler(async (req, res, next) => {
      await dateCurationController.updateCuratedDate(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * DELETE /admin/curated-dates/:dateId
   * Admin deletes/cancels a curated date
   */
  router.delete('/admin/curated-dates/:dateId',
    authenticateToken,
    checkIsAdmin,
    asyncHandler(async (req, res, next) => {
      await dateCurationController.deleteCuratedDate(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * POST /admin/search-potential-matches
   * Admin searches for potential matches for a user
   */
  router.post('/admin/search-potential-matches',
    authenticateToken,
    checkIsAdmin,
    validateSearchPotentialMatches,
    asyncHandler(async (req, res, next) => {
      await dateCurationController.searchPotentialMatches(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * POST /admin/curated-dates/bulk-create
   * Admin creates multiple curated dates at once
   */
  router.post('/admin/curated-dates/bulk-create',
    authenticateToken,
    checkIsAdmin,
    asyncHandler(async (req, res, next) => {
      await dateCurationController.bulkCreateCuratedDates(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * GET /admin/users/:userId/trust-score
   * Admin gets user's trust score details
   */
  router.get('/admin/users/:userId/trust-score',
    authenticateToken,
    checkIsAdmin,
    asyncHandler(async (req, res, next) => {
      await dateCurationController.getAdminUserTrustScore(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * PUT /admin/users/:userId/trust-score
   * Admin manually adjusts user's trust score
   */
  router.put('/admin/users/:userId/trust-score',
    authenticateToken,
    checkIsAdmin,
    asyncHandler(async (req, res, next) => {
      await dateCurationController.updateUserTrustScore(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * GET /admin/date-series
   * Admin gets all date series with filters
   */
  router.get('/admin/date-series',
    authenticateToken,
    checkIsAdmin,
    asyncHandler(async (req, res, next) => {
      await dateCurationController.getAdminDateSeries(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * PUT /admin/date-series/:seriesId
   * Admin updates date series (stage, notes, etc.)
   */
  router.put('/admin/date-series/:seriesId',
    authenticateToken,
    checkIsAdmin,
    asyncHandler(async (req, res, next) => {
      await dateCurationController.updateDateSeries(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * GET /admin/analytics/date-curation
   * Admin gets comprehensive analytics for date curation
   */
  router.get('/admin/analytics/date-curation',
    authenticateToken,
    checkIsAdmin,
    validateDateCurationAnalytics,
    asyncHandler(async (req, res, next) => {
      await dateCurationController.getDateCurationAnalytics(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * GET /admin/dashboard/date-curation
   * Admin gets dashboard overview for date curation
   */
  router.get('/admin/dashboard/date-curation',
    authenticateToken,
    checkIsAdmin,
    asyncHandler(async (req, res, next) => {
      await dateCurationController.getDateCurationDashboard(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * GET /admin/feedback/all
   * Admin gets all date feedback with filters
   */
  router.get('/admin/feedback/all',
    authenticateToken,
    checkIsAdmin,
    asyncHandler(async (req, res, next) => {
      await dateCurationController.getAllDateFeedback(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * GET /admin/reports/safety
   * Admin gets safety reports from date feedback
   */
  router.get('/admin/reports/safety',
    authenticateToken,
    checkIsAdmin,
    asyncHandler(async (req, res, next) => {
      await dateCurationController.getSafetyReports(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * POST /admin/users/:userId/probation
   * Admin puts user on probation or adjusts probation status
   */
  router.post('/admin/users/:userId/probation',
    authenticateToken,
    checkIsAdmin,
    asyncHandler(async (req, res, next) => {
      await dateCurationController.updateUserProbationStatus(req as AuthenticatedRequest, res, next);
    })
  );

  // ============================================================================
  // WORKFLOW ROUTES (Admin Curation Process)
  // ============================================================================

  /**
   * GET /admin/workflow/pending
   * Get pending curation workflow tasks
   */
  router.get('/admin/workflow/pending',
    authenticateToken,
    checkIsAdmin,
    asyncHandler(async (req, res, next) => {
      await dateCurationController.getPendingWorkflowTasks(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * PUT /admin/workflow/:workflowId/complete
   * Mark a workflow stage as complete
   */
  router.put('/admin/workflow/:workflowId/complete',
    authenticateToken,
    checkIsAdmin,
    asyncHandler(async (req, res, next) => {
      await dateCurationController.completeWorkflowStage(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * POST /admin/workflow/auto-reminders
   * Trigger automated reminders for upcoming dates
   */
  router.post('/admin/workflow/auto-reminders',
    authenticateToken,
    checkIsAdmin,
    asyncHandler(async (req, res, next) => {
      await dateCurationController.triggerAutomatedReminders(req as AuthenticatedRequest, res, next);
    })
  );

  // ============================================================================
  // UTILITY ROUTES
  // ============================================================================

  /**
   * POST /check-date-conflicts
   * Check for scheduling conflicts before creating a date
   */
  router.post('/check-date-conflicts',
    authenticateToken,
    checkIsAdmin,
    asyncHandler(async (req, res, next) => {
      await dateCurationController.checkDateConflicts(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * GET /compatibility/:user1Id/:user2Id
   * Get compatibility score and details between two users
   */
  router.get('/compatibility/:user1Id/:user2Id',
    authenticateToken,
    checkIsAdmin,
    asyncHandler(async (req, res, next) => {
      await dateCurationController.getCompatibilityScore(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * GET /health
   * Date curation service health check
   */
  router.get('/health',
    asyncHandler(async (req, res, next) => {
      await dateCurationController.healthCheck(req, res, next);
    })
  );

  logger.info('Date Curation Routes initialized successfully', {
    userRoutes: [
      'GET /my-dates',
      'GET /my-dates/:dateId', 
      'POST /my-dates/:dateId/confirm',
      'POST /my-dates/:dateId/cancel',
      'POST /my-dates/:dateId/feedback',
      'GET /my-dates/:dateId/feedback',
      'PUT /my-dates/:dateId/feedback',
      'GET /my-trust-score',
      'GET /my-date-series',
      'GET /my-date-series/:seriesId'
    ],
    adminRoutes: [
      'POST /admin/curated-dates',
      'GET /admin/curated-dates',
      'GET /admin/curated-dates/:dateId',
      'PUT /admin/curated-dates/:dateId',
      'DELETE /admin/curated-dates/:dateId',
      'POST /admin/search-potential-matches',
      'POST /admin/curated-dates/bulk-create',
      'GET /admin/users/:userId/trust-score',
      'PUT /admin/users/:userId/trust-score',
      'GET /admin/date-series',
      'PUT /admin/date-series/:seriesId',
      'GET /admin/analytics/date-curation',
      'GET /admin/dashboard/date-curation',
      'GET /admin/feedback/all',
      'GET /admin/reports/safety',
      'POST /admin/users/:userId/probation'
    ],
    workflowRoutes: [
      'GET /admin/workflow/pending',
      'PUT /admin/workflow/:workflowId/complete',
      'POST /admin/workflow/auto-reminders'
    ],
    utilityRoutes: [
      'POST /check-date-conflicts',
      'GET /compatibility/:user1Id/:user2Id',
      'GET /health'
    ],
    totalRoutes: 32
  });

  return router;
}