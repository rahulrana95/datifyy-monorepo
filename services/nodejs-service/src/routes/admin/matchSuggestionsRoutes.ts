/**
 * Admin Match Suggestions Routes
 * AI-powered match suggestions and compatibility analysis for admin curation
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
  validateGenerateMatchSuggestions,
  validateBatchMatchSuggestions,
  validateUpdateMatchSuggestion,
  validateGetMatchSuggestions,
  validateAnalyzeAlgorithmPerformance,
  validateSubmitMatchLearningFeedback,
} from '../../modules/admin/dtos/MatchSuggestionsDtos';

// Import controller (we'll create this)
import { AdminMatchSuggestionsController } from '../../modules/admin/controllers/AdminMatchSuggestionsController';

/**
 * Factory function to create admin match suggestions routes
 */
export function createAdminMatchSuggestionsRoutes(dataSource: DataSource): Router {
  const router = Router();
  const logger = Logger.getInstance();
  
  // Initialize controller with dependencies
  const matchSuggestionsController = new AdminMatchSuggestionsController(dataSource, logger);

  // Apply middleware to all routes
  router.use(authenticateToken); // Ensure user is authenticated
  router.use(checkIsAdmin);      // Ensure user has admin privileges

  // =============================================================================
  // MATCH SUGGESTION GENERATION
  // =============================================================================

  /**
   * POST /admin/match-suggestions/generate
   * Generate match suggestions for a specific user
   */
  router.post('/generate',
    validateGenerateMatchSuggestions,
    asyncHandler(async (req, res, next) => {
      await matchSuggestionsController.generateMatchSuggestions(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * POST /admin/match-suggestions/batch-generate
   * Generate match suggestions for multiple users
   */
  router.post('/batch-generate',
    validateBatchMatchSuggestions,
    asyncHandler(async (req, res, next) => {
      await matchSuggestionsController.batchGenerateMatchSuggestions(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * POST /admin/match-suggestions/regenerate/:suggestionId
   * Regenerate a specific match suggestion with updated criteria
   */
  router.post('/regenerate/:suggestionId',
    asyncHandler(async (req, res, next) => {
      await matchSuggestionsController.regenerateMatchSuggestion(req as AuthenticatedRequest, res, next);
    })
  );

  // =============================================================================
  // MATCH SUGGESTION MANAGEMENT
  // =============================================================================

  /**
   * GET /admin/match-suggestions
   * Get match suggestions with filtering and pagination
   */
  router.get('/',
    validateGetMatchSuggestions,
    asyncHandler(async (req, res, next) => {
      await matchSuggestionsController.getAllMatchSuggestions(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * GET /admin/match-suggestions/:suggestionId
   * Get specific match suggestion details
   */
  router.get('/:suggestionId',
    asyncHandler(async (req, res, next) => {
      await matchSuggestionsController.getMatchSuggestionById(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * PUT /admin/match-suggestions/:suggestionId
   * Update match suggestion status or admin notes
   */
  router.put('/:suggestionId',
    validateUpdateMatchSuggestion,
    asyncHandler(async (req, res, next) => {
      await matchSuggestionsController.updateMatchSuggestion(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * DELETE /admin/match-suggestions/:suggestionId
   * Delete/reject a match suggestion
   */
  router.delete('/:suggestionId',
    asyncHandler(async (req, res, next) => {
      await matchSuggestionsController.deleteMatchSuggestion(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * POST /admin/match-suggestions/:suggestionId/accept
   * Accept a match suggestion and create a curated date
   */
  router.post('/:suggestionId/accept',
    asyncHandler(async (req, res, next) => {
      await matchSuggestionsController.acceptMatchSuggestion(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * POST /admin/match-suggestions/:suggestionId/reject
   * Reject a match suggestion with reason
   */
  router.post('/:suggestionId/reject',
    asyncHandler(async (req, res, next) => {
      await matchSuggestionsController.rejectMatchSuggestion(req as AuthenticatedRequest, res, next);
    })
  );

  // =============================================================================
  // COMPATIBILITY ANALYSIS
  // =============================================================================

  /**
   * POST /admin/match-suggestions/compatibility-analysis
   * Get detailed compatibility analysis between two users
   */
  router.post('/compatibility-analysis',
    asyncHandler(async (req, res, next) => {
      await matchSuggestionsController.getCompatibilityAnalysis(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * GET /admin/match-suggestions/compatibility-factors
   * Get all compatibility factors and their weights
   */
  router.get('/compatibility-factors',
    asyncHandler(async (req, res, next) => {
      await matchSuggestionsController.getCompatibilityFactors(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * PUT /admin/match-suggestions/compatibility-factors
   * Update compatibility factor weights
   */
  router.put('/compatibility-factors',
    asyncHandler(async (req, res, next) => {
      await matchSuggestionsController.updateCompatibilityFactors(req as AuthenticatedRequest, res, next);
    })
  );

  // =============================================================================
  // ALGORITHM MANAGEMENT
  // =============================================================================

  /**
   * GET /admin/match-suggestions/algorithms
   * Get all available matching algorithms
   */
  router.get('/algorithms',
    asyncHandler(async (req, res, next) => {
      await matchSuggestionsController.getMatchingAlgorithms(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * GET /admin/match-suggestions/algorithms/performance
   * Get algorithm performance analysis
   */
  router.get('/algorithms/performance',
    validateAnalyzeAlgorithmPerformance,
    asyncHandler(async (req, res, next) => {
      await matchSuggestionsController.getAlgorithmPerformance(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * PUT /admin/match-suggestions/algorithms/:algorithmId/enable
   * Enable/disable a matching algorithm
   */
  router.put('/algorithms/:algorithmId/enable',
    asyncHandler(async (req, res, next) => {
      await matchSuggestionsController.toggleAlgorithm(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * POST /admin/match-suggestions/algorithms/test
   * Test algorithm performance with sample data
   */
  router.post('/algorithms/test',
    asyncHandler(async (req, res, next) => {
      await matchSuggestionsController.testAlgorithm(req as AuthenticatedRequest, res, next);
    })
  );

  // =============================================================================
  // BATCH OPERATIONS
  // =============================================================================

  /**
   * GET /admin/match-suggestions/batch-operations
   * Get all batch operations status
   */
  router.get('/batch-operations',
    asyncHandler(async (req, res, next) => {
      await matchSuggestionsController.getBatchOperations(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * GET /admin/match-suggestions/batch-operations/:batchId
   * Get specific batch operation details
   */
  router.get('/batch-operations/:batchId',
    asyncHandler(async (req, res, next) => {
      await matchSuggestionsController.getBatchOperationById(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * POST /admin/match-suggestions/batch-operations/:batchId/cancel
   * Cancel a running batch operation
   */
  router.post('/batch-operations/:batchId/cancel',
    asyncHandler(async (req, res, next) => {
      await matchSuggestionsController.cancelBatchOperation(req as AuthenticatedRequest, res, next);
    })
  );

  // =============================================================================
  // LEARNING & FEEDBACK
  // =============================================================================

  /**
   * POST /admin/match-suggestions/learning-feedback
   * Submit learning feedback to improve algorithms
   */
  router.post('/learning-feedback',
    validateSubmitMatchLearningFeedback,
    asyncHandler(async (req, res, next) => {
      await matchSuggestionsController.submitLearningFeedback(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * GET /admin/match-suggestions/learning-insights
   * Get insights from learning feedback
   */
  router.get('/learning-insights',
    asyncHandler(async (req, res, next) => {
      await matchSuggestionsController.getLearningInsights(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * POST /admin/match-suggestions/retrain-models
   * Trigger model retraining with latest data
   */
  router.post('/retrain-models',
    asyncHandler(async (req, res, next) => {
      await matchSuggestionsController.retrainModels(req as AuthenticatedRequest, res, next);
    })
  );

  // =============================================================================
  // USER MATCHING PROFILES
  // =============================================================================

  /**
   * GET /admin/match-suggestions/user-profiles/:userId
   * Get user's matching profile for suggestion generation
   */
  router.get('/user-profiles/:userId',
    asyncHandler(async (req, res, next) => {
      await matchSuggestionsController.getUserMatchingProfile(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * PUT /admin/match-suggestions/user-profiles/:userId
   * Update user's matching profile attributes
   */
  router.put('/user-profiles/:userId',
    asyncHandler(async (req, res, next) => {
      await matchSuggestionsController.updateUserMatchingProfile(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * GET /admin/match-suggestions/user-profiles/:userId/potential-matches
   * Get potential matches for a user with scoring
   */
  router.get('/user-profiles/:userId/potential-matches',
    asyncHandler(async (req, res, next) => {
      await matchSuggestionsController.getUserPotentialMatches(req as AuthenticatedRequest, res, next);
    })
  );

  // =============================================================================
  // ANALYTICS & REPORTING
  // =============================================================================

  /**
   * GET /admin/match-suggestions/analytics/overview
   * Get match suggestion analytics overview
   */
  router.get('/analytics/overview',
    asyncHandler(async (req, res, next) => {
      await matchSuggestionsController.getMatchSuggestionAnalytics(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * GET /admin/match-suggestions/analytics/success-rates
   * Get match suggestion success rate analytics
   */
  router.get('/analytics/success-rates',
    asyncHandler(async (req, res, next) => {
      await matchSuggestionsController.getSuccessRateAnalytics(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * GET /admin/match-suggestions/analytics/algorithm-comparison
   * Compare performance across different algorithms
   */
  router.get('/analytics/algorithm-comparison',
    asyncHandler(async (req, res, next) => {
      await matchSuggestionsController.getAlgorithmComparison(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * GET /admin/match-suggestions/analytics/trends
   * Get match suggestion trends over time
   */
  router.get('/analytics/trends',
    asyncHandler(async (req, res, next) => {
      await matchSuggestionsController.getMatchSuggestionTrends(req as AuthenticatedRequest, res, next);
    })
  );

  // =============================================================================
  // EXPERIMENTAL FEATURES
  // =============================================================================

  /**
   * POST /admin/match-suggestions/experiments/ab-test
   * Create A/B test for matching algorithms
   */
  router.post('/experiments/ab-test',
    asyncHandler(async (req, res, next) => {
      await matchSuggestionsController.createABTest(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * GET /admin/match-suggestions/experiments/ab-test/:testId
   * Get A/B test results
   */
  router.get('/experiments/ab-test/:testId',
    asyncHandler(async (req, res, next) => {
      await matchSuggestionsController.getABTestResults(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * POST /admin/match-suggestions/experiments/feature-flags
   * Toggle experimental features
   */
  router.post('/experiments/feature-flags',
    asyncHandler(async (req, res, next) => {
      await matchSuggestionsController.toggleFeatureFlags(req as AuthenticatedRequest, res, next);
    })
  );

  // =============================================================================
  // UTILITIES
  // =============================================================================

  /**
   * GET /admin/match-suggestions/health
   * Match suggestions service health check
   */
  router.get('/health',
    asyncHandler(async (req, res, next) => {
      await matchSuggestionsController.getServiceHealth(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * POST /admin/match-suggestions/refresh-cache
   * Refresh match suggestion cache
   */
  router.post('/refresh-cache',
    asyncHandler(async (req, res, next) => {
      await matchSuggestionsController.refreshCache(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * POST /admin/match-suggestions/cleanup-expired
   * Clean up expired match suggestions
   */
  router.post('/cleanup-expired',
    asyncHandler(async (req, res, next) => {
      await matchSuggestionsController.cleanupExpiredSuggestions(req as AuthenticatedRequest, res, next);
    })
  );

  // Log route registration
  logger.info('Admin Match Suggestions routes registered successfully', {
    routes: [
      // Generation
      'POST /admin/match-suggestions/generate',
      'POST /admin/match-suggestions/batch-generate',
      'POST /admin/match-suggestions/regenerate/:suggestionId',
      
      // Management
      'GET /admin/match-suggestions',
      'GET /admin/match-suggestions/:suggestionId',
      'PUT /admin/match-suggestions/:suggestionId',
      'DELETE /admin/match-suggestions/:suggestionId',
      'POST /admin/match-suggestions/:suggestionId/accept',
      'POST /admin/match-suggestions/:suggestionId/reject',
      
      // Compatibility
      'POST /admin/match-suggestions/compatibility-analysis',
      'GET /admin/match-suggestions/compatibility-factors',
      'PUT /admin/match-suggestions/compatibility-factors',
      
      // Algorithms
      'GET /admin/match-suggestions/algorithms',
      'GET /admin/match-suggestions/algorithms/performance',
      'PUT /admin/match-suggestions/algorithms/:algorithmId/enable',
      'POST /admin/match-suggestions/algorithms/test',
      
      // Batch Operations
      'GET /admin/match-suggestions/batch-operations',
      'GET /admin/match-suggestions/batch-operations/:batchId',
      'POST /admin/match-suggestions/batch-operations/:batchId/cancel',
      
      // Learning
      'POST /admin/match-suggestions/learning-feedback',
      'GET /admin/match-suggestions/learning-insights',
      'POST /admin/match-suggestions/retrain-models',
      
      // User Profiles
      'GET /admin/match-suggestions/user-profiles/:userId',
      'PUT /admin/match-suggestions/user-profiles/:userId',
      'GET /admin/match-suggestions/user-profiles/:userId/potential-matches',
      
      // Analytics
      'GET /admin/match-suggestions/analytics/overview',
      'GET /admin/match-suggestions/analytics/success-rates',
      'GET /admin/match-suggestions/analytics/algorithm-comparison',
      'GET /admin/match-suggestions/analytics/trends',
      
      // Experiments
      'POST /admin/match-suggestions/experiments/ab-test',
      'GET /admin/match-suggestions/experiments/ab-test/:testId',
      'POST /admin/match-suggestions/experiments/feature-flags',
      
      // Utilities
      'GET /admin/match-suggestions/health',
      'POST /admin/match-suggestions/refresh-cache',
      'POST /admin/match-suggestions/cleanup-expired',
    ],
    routeCount: 33
  });

  return router;
}