/**
 * Admin Date Curation Routes
 * Complete admin interface for managing curated dates, matches, and workflows
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */

import { Router } from 'express';
import { DataSource } from 'typeorm';
import { Logger } from '../../infrastructure/logging/Logger';
import { asyncHandler } from '../../infrastructure/utils/asyncHandler';
import { authenticateToken, checkIsAdmin } from '../../middlewares/authentication';
import { AuthenticatedRequest } from '../../infrastructure/middleware/authentication';

// Import validation middleware (we'll create these)
import { 
  validateCreateCuratedDate,
  validateUpdateCuratedDate,
  validateAdminGetDates,
  validateSearchPotentialMatches,
  validateDateCurationAnalytics,
  validateConfirmDate,
  validateCancelDate,
  validateSubmitDateFeedback,
  validateUpdateTrustScore,
  validateUpdateDateSeries,
} from '../../modules/admin/dtos/DateCurationDtos';

// Import controller (we'll create this)
import { AdminDateCurationController } from '../../modules/admin/controllers/AdminDateCurationController';

/**
 * Factory function to create admin date curation routes
 */
export function createAdminDateCurationRoutes(dataSource: DataSource): Router {
  const router = Router();
  const logger = Logger.getInstance();
  
  // Initialize controller with dependencies
  const dateCurationController = new AdminDateCurationController(dataSource, logger);

  // Apply middleware to all routes
  router.use(authenticateToken); // Ensure user is authenticated
  router.use(checkIsAdmin);      // Ensure user has admin privileges

  // =============================================================================
  // CURATED DATES MANAGEMENT
  // =============================================================================

  /**
   * POST /admin/date-curation/curated-dates
   * Create a new curated date between two users
   */
  router.post('/curated-dates',
    validateCreateCuratedDate,
    asyncHandler(async (req, res, next) => {
      await dateCurationController.createCuratedDate(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * GET /admin/date-curation/curated-dates
   * Get all curated dates with advanced filtering
   */
  router.get('/curated-dates',
    validateAdminGetDates,
    asyncHandler(async (req, res, next) => {
      await dateCurationController.getAllCuratedDates(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * GET /admin/date-curation/curated-dates/:dateId
   * Get specific curated date with full details
   */
  router.get('/curated-dates/:dateId',
    asyncHandler(async (req, res, next) => {
      await dateCurationController.getCuratedDateById(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * PUT /admin/date-curation/curated-dates/:dateId
   * Update curated date details
   */
  router.put('/curated-dates/:dateId',
    validateUpdateCuratedDate,
    asyncHandler(async (req, res, next) => {
      await dateCurationController.updateCuratedDate(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * DELETE /admin/date-curation/curated-dates/:dateId
   * Cancel/delete curated date
   */
  router.delete('/curated-dates/:dateId',
    asyncHandler(async (req, res, next) => {
      await dateCurationController.deleteCuratedDate(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * POST /admin/date-curation/curated-dates/bulk-create
   * Create multiple curated dates at once
   */
  router.post('/curated-dates/bulk-create',
    asyncHandler(async (req, res, next) => {
      await dateCurationController.bulkCreateCuratedDates(req as AuthenticatedRequest, res, next);
    })
  );

  // =============================================================================
  // MATCH SUGGESTIONS & COMPATIBILITY
  // =============================================================================

  /**
   * POST /admin/date-curation/search-potential-matches
   * Search for potential matches for a user
   */
  router.post('/search-potential-matches',
    validateSearchPotentialMatches,
    asyncHandler(async (req, res, next) => {
      await dateCurationController.searchPotentialMatches(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * GET /admin/date-curation/compatibility/:user1Id/:user2Id
   * Get compatibility analysis between two users
   */
  router.get('/compatibility/:user1Id/:user2Id',
    asyncHandler(async (req, res, next) => {
      await dateCurationController.getCompatibilityAnalysis(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * POST /admin/date-curation/check-date-conflicts
   * Check for scheduling conflicts before creating date
   */
  router.post('/check-date-conflicts',
    asyncHandler(async (req, res, next) => {
      await dateCurationController.checkDateConflicts(req as AuthenticatedRequest, res, next);
    })
  );

  // =============================================================================
  // USER TRUST SCORES & PROBATION
  // =============================================================================

  /**
   * GET /admin/date-curation/users/:userId/trust-score
   * Get user's trust score details
   */
  router.get('/users/:userId/trust-score',
    asyncHandler(async (req, res, next) => {
      await dateCurationController.getUserTrustScore(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * PUT /admin/date-curation/users/:userId/trust-score
   * Manually adjust user's trust score
   */
  router.put('/users/:userId/trust-score',
    validateUpdateTrustScore,
    asyncHandler(async (req, res, next) => {
      await dateCurationController.updateUserTrustScore(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * POST /admin/date-curation/users/:userId/probation
   * Manage user probation status
   */
  router.post('/users/:userId/probation',
    asyncHandler(async (req, res, next) => {
      await dateCurationController.manageUserProbation(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * GET /admin/date-curation/users/low-trust-scores
   * Get users with low trust scores requiring attention
   */
  router.get('/users/low-trust-scores',
    asyncHandler(async (req, res, next) => {
      await dateCurationController.getUsersWithLowTrustScores(req as AuthenticatedRequest, res, next);
    })
  );

  // =============================================================================
  // DATE SERIES MANAGEMENT
  // =============================================================================

  /**
   * GET /admin/date-curation/date-series
   * Get all date series with filters
   */
  router.get('/date-series',
    asyncHandler(async (req, res, next) => {
      await dateCurationController.getAllDateSeries(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * GET /admin/date-curation/date-series/:seriesId
   * Get specific date series details
   */
  router.get('/date-series/:seriesId',
    asyncHandler(async (req, res, next) => {
      await dateCurationController.getDateSeriesById(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * PUT /admin/date-curation/date-series/:seriesId
   * Update date series stage/notes
   */
  router.put('/date-series/:seriesId',
    validateUpdateDateSeries,
    asyncHandler(async (req, res, next) => {
      await dateCurationController.updateDateSeries(req as AuthenticatedRequest, res, next);
    })
  );

  // =============================================================================
  // FEEDBACK & REVIEWS
  // =============================================================================

  /**
   * GET /admin/date-curation/feedback/all
   * Get all date feedback with filtering
   */
  router.get('/feedback/all',
    asyncHandler(async (req, res, next) => {
      await dateCurationController.getAllDateFeedback(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * GET /admin/date-curation/feedback/:feedbackId
   * Get specific feedback details
   */
  router.get('/feedback/:feedbackId',
    asyncHandler(async (req, res, next) => {
      await dateCurationController.getFeedbackById(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * GET /admin/date-curation/reports/safety
   * Get safety reports from feedback
   */
  router.get('/reports/safety',
    asyncHandler(async (req, res, next) => {
      await dateCurationController.getSafetyReports(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * POST /admin/date-curation/feedback/:feedbackId/review
   * Admin review and action on feedback
   */
  router.post('/feedback/:feedbackId/review',
    asyncHandler(async (req, res, next) => {
      await dateCurationController.reviewFeedback(req as AuthenticatedRequest, res, next);
    })
  );

  // =============================================================================
  // WORKFLOW MANAGEMENT
  // =============================================================================

  /**
   * GET /admin/date-curation/workflow/pending
   * Get pending curation workflow tasks
   */
  router.get('/workflow/pending',
    asyncHandler(async (req, res, next) => {
      await dateCurationController.getPendingWorkflowTasks(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * PUT /admin/date-curation/workflow/:workflowId/complete
   * Mark workflow stage as complete
   */
  router.put('/workflow/:workflowId/complete',
    asyncHandler(async (req, res, next) => {
      await dateCurationController.completeWorkflowStage(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * POST /admin/date-curation/workflow/auto-reminders
   * Trigger automated date reminders
   */
  router.post('/workflow/auto-reminders',
    asyncHandler(async (req, res, next) => {
      await dateCurationController.triggerAutomatedReminders(req as AuthenticatedRequest, res, next);
    })
  );

  // =============================================================================
  // ANALYTICS & REPORTING
  // =============================================================================

  /**
   * GET /admin/date-curation/analytics/overview
   * Get comprehensive date curation analytics
   */
  router.get('/analytics/overview',
    validateDateCurationAnalytics,
    asyncHandler(async (req, res, next) => {
      await dateCurationController.getDateCurationAnalytics(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * GET /admin/date-curation/analytics/dashboard
   * Get dashboard-specific metrics
   */
  router.get('/analytics/dashboard',
    asyncHandler(async (req, res, next) => {
      await dateCurationController.getDashboardMetrics(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * GET /admin/date-curation/analytics/success-rates
   * Get success rate analytics
   */
  router.get('/analytics/success-rates',
    asyncHandler(async (req, res, next) => {
      await dateCurationController.getSuccessRateAnalytics(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * GET /admin/date-curation/export
   * Export date curation data for analysis
   */
  router.get('/export',
    asyncHandler(async (req, res, next) => {
      await dateCurationController.exportDateCurationData(req as AuthenticatedRequest, res, next);
    })
  );

  // =============================================================================
  // USER-FACING ACTIONS (Admin can perform on behalf of users)
  // =============================================================================

  /**
   * POST /admin/date-curation/dates/:dateId/confirm-for-user
   * Admin confirms date on behalf of user
   */
  router.post('/dates/:dateId/confirm-for-user',
    validateConfirmDate,
    asyncHandler(async (req, res, next) => {
      await dateCurationController.confirmDateForUser(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * POST /admin/date-curation/dates/:dateId/cancel-for-user
   * Admin cancels date on behalf of user
   */
  router.post('/dates/:dateId/cancel-for-user',
    validateCancelDate,
    asyncHandler(async (req, res, next) => {
      await dateCurationController.cancelDateForUser(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * POST /admin/date-curation/dates/:dateId/submit-feedback
   * Admin submits feedback on behalf of user (rare case)
   */
  router.post('/dates/:dateId/submit-feedback',
    validateSubmitDateFeedback,
    asyncHandler(async (req, res, next) => {
      await dateCurationController.submitFeedbackForUser(req as AuthenticatedRequest, res, next);
    })
  );

  // =============================================================================
  // UTILITY ENDPOINTS
  // =============================================================================

  /**
   * GET /admin/date-curation/health
   * Date curation service health check
   */
  router.get('/health',
    asyncHandler(async (req, res, next) => {
      await dateCurationController.getServiceHealth(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * POST /admin/date-curation/recalculate-trust-scores
   * Manually trigger trust score recalculation
   */
  router.post('/recalculate-trust-scores',
    asyncHandler(async (req, res, next) => {
      await dateCurationController.recalculateTrustScores(req as AuthenticatedRequest, res, next);
    })
  );

  // Log route registration
  logger.info('Admin Date Curation routes registered successfully', {
    routes: [
      // Curated Dates
      'POST /admin/date-curation/curated-dates',
      'GET /admin/date-curation/curated-dates',
      'GET /admin/date-curation/curated-dates/:dateId',
      'PUT /admin/date-curation/curated-dates/:dateId',
      'DELETE /admin/date-curation/curated-dates/:dateId',
      'POST /admin/date-curation/curated-dates/bulk-create',
      
      // Match Suggestions
      'POST /admin/date-curation/search-potential-matches',
      'GET /admin/date-curation/compatibility/:user1Id/:user2Id',
      'POST /admin/date-curation/check-date-conflicts',
      
      // Trust Scores
      'GET /admin/date-curation/users/:userId/trust-score',
      'PUT /admin/date-curation/users/:userId/trust-score',
      'POST /admin/date-curation/users/:userId/probation',
      'GET /admin/date-curation/users/low-trust-scores',
      
      // Date Series
      'GET /admin/date-curation/date-series',
      'GET /admin/date-curation/date-series/:seriesId',
      'PUT /admin/date-curation/date-series/:seriesId',
      
      // Feedback
      'GET /admin/date-curation/feedback/all',
      'GET /admin/date-curation/feedback/:feedbackId',
      'GET /admin/date-curation/reports/safety',
      'POST /admin/date-curation/feedback/:feedbackId/review',
      
      // Workflow
      'GET /admin/date-curation/workflow/pending',
      'PUT /admin/date-curation/workflow/:workflowId/complete',
      'POST /admin/date-curation/workflow/auto-reminders',
      
      // Analytics
      'GET /admin/date-curation/analytics/overview',
      'GET /admin/date-curation/analytics/dashboard',
      'GET /admin/date-curation/analytics/success-rates',
      'GET /admin/date-curation/export',
      
      // User Actions
      'POST /admin/date-curation/dates/:dateId/confirm-for-user',
      'POST /admin/date-curation/dates/:dateId/cancel-for-user',
      'POST /admin/date-curation/dates/:dateId/submit-feedback',
      
      // Utilities
      'GET /admin/date-curation/health',
      'POST /admin/date-curation/recalculate-trust-scores',
    ],
    routeCount: 26
  });

  return router;
}