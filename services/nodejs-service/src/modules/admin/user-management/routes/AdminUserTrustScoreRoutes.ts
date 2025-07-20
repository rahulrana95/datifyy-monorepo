import { Router, Response, NextFunction, Request } from 'express';
import { DataSource } from 'typeorm';
import { Logger } from '../../../../infrastructure/logging/Logger';
import { AdminUserTrustScoreController } from '../controllers/AdminUserTrustScoreController';
import { asyncHandler } from '../../../../infrastructure/middleware/AsyncHandler';
import { validateRequest } from '../../../../infrastructure/middleware/ValidationMiddleware';
import { UpdateUserTrustScoreRequestDto } from '../dtos';

/**
 * Create admin user trust score management routes
 */
export function createAdminUserTrustScoreRoutes(dataSource: DataSource): Router {
  const router = Router();
  const logger = Logger.getInstance();
  
  logger.info('Initializing admin user trust score routes');

  try {
    // Initialize controller
    const trustScoreController = new AdminUserTrustScoreController(dataSource, logger);

    /**
     * GET /admin/user-management/trust-scores/requiring-attention
     * Get users with trust scores requiring admin attention
     * Query params: limit
     */
    router.get('/trust-scores/requiring-attention',
      asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await trustScoreController.getUsersRequiringAttention(req as any, res, next);
      })
    );

    /**
     * GET /admin/user-management/trust-scores/statistics
     * Get trust score statistics and distributions
     */
    router.get('/trust-scores/statistics',
      asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await trustScoreController.getTrustScoreStatistics(req as any, res, next);
      })
    );

    /**
     * POST /admin/user-management/trust-scores/bulk-recalculate
     * Bulk recalculate trust scores for multiple users or all users
     * Body: { userIds?: number[], batchSize?: number }
     */
    router.post('/trust-scores/bulk-recalculate',
      // validateRequest(BulkRecalculateTrustScoreRequestDto), // Would create this DTO
      asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await trustScoreController.bulkRecalculateTrustScores(req as any, res, next);
      })
    );

    /**
     * POST /admin/user-management/trust-scores/bulk-update
     * Bulk update trust scores for multiple users
     * Body: { updates: Array<{userId: number, updates: Partial<UpdateUserTrustScoreRequestDto>}>, reason: string }
     */
    router.post('/trust-scores/bulk-update',
      // validateRequest(BulkUpdateTrustScoreRequestDto), // Would create this DTO
      asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await trustScoreController.bulkUpdateTrustScores(req as any, res, next);
      })
    );

    /**
     * GET /admin/user-management/users/:userId/trust-score
     * Get detailed trust score information for a user
     * Params: userId (required)
     */
    router.get('/users/:userId/trust-score',
      asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await trustScoreController.getUserTrustScore(req as any, res, next);
      })
    );

    /**
     * PUT /admin/user-management/users/:userId/trust-score
     * Update user trust score manually
     * Params: userId (required)
     * Body: UpdateUserTrustScoreRequestDto
     */
    router.put('/users/:userId/trust-score',
      validateRequest(UpdateUserTrustScoreRequestDto),
      asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await trustScoreController.updateUserTrustScore(req as any, res, next);
      })
    );

    /**
     * POST /admin/user-management/users/:userId/trust-score/recalculate
     * Recalculate trust score based on current data
     * Params: userId (required)
     */
    router.post('/users/:userId/trust-score/recalculate',
      asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await trustScoreController.recalculateUserTrustScore(req as any, res, next);
      })
    );

    /**
     * POST /admin/user-management/users/:userId/probation
     * Manage user probation status
     * Params: userId (required)
     * Body: { action: 'place' | 'remove' | 'extend', duration?: string, reason: string }
     */
    router.post('/users/:userId/probation',
      // validateRequest(ManageUserProbationRequestDto), // Would create this DTO
      asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await trustScoreController.manageUserProbation(req as any, res, next);
      })
    );

    logger.info('Admin user trust score routes initialized successfully', {
      routes: [
        'GET /trust-scores/requiring-attention',
        'GET /trust-scores/statistics',
        'POST /trust-scores/bulk-recalculate',
        'POST /trust-scores/bulk-update',
        'GET /users/:userId/trust-score',
        'PUT /users/:userId/trust-score',
        'POST /users/:userId/trust-score/recalculate',
        'POST /users/:userId/probation'
      ],
      routeCount: 8
    });

    return router;

  } catch (error) {
    logger.error('Failed to initialize admin user trust score routes', { error });
    throw error;
  }
}

/**
 * Route configuration for documentation
 */
export const adminUserTrustScoreRouteConfig = {
  basePath: '/api/v1/admin/user-management',
  routes: {
    trustScores: {
      requiresAttention: 'GET /trust-scores/requiring-attention',
      statistics: 'GET /trust-scores/statistics',
      bulkRecalculate: 'POST /trust-scores/bulk-recalculate',
      bulkUpdate: 'POST /trust-scores/bulk-update'
    },
    userTrustScores: {
      get: 'GET /users/:userId/trust-score',
      update: 'PUT /users/:userId/trust-score',
      recalculate: 'POST /users/:userId/trust-score/recalculate',
      manageProbation: 'POST /users/:userId/probation'
    }
  },
  adjustmentReasons: [
    'manual_review',
    'positive_feedback',
    'negative_feedback',
    'safety_concern',
    'policy_violation',
    'exceptional_behavior',
    'system_error_correction'
  ],
  probationActions: ['place', 'remove', 'extend'],
  permissions: {
    required: ['admin', 'super_admin'],
    actions: {
      'trust-scores:read': ['admin', 'moderator', 'super_admin'],
      'trust-scores:update': ['admin', 'super_admin'],
      'trust-scores:bulk': ['super_admin'],
      'probation:manage': ['admin', 'super_admin']
    }
  }
};