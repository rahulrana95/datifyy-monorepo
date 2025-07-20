import { Router, Response, NextFunction } from 'express';
import { DataSource } from 'typeorm';
import { Logger } from '../../../../infrastructure/logging/Logger';
import { AdminUserStatsController } from '../controllers/AdminUserStatsController';
import { asyncHandler } from '../../../../infrastructure/middleware/AsyncHandler';
import { validateRequest } from '../../../../infrastructure/middleware/ValidationMiddleware';
import { Request} from 'express';
import { AuthenticatedAdminRequest } from '../controllers';

/**
 * Create admin user statistics routes
 */
export function createAdminUserStatsRoutes(dataSource: DataSource): Router {
  const router = Router();
  const logger = Logger.getInstance();
  
  logger.info('Initializing admin user statistics routes');

  try {
    // Initialize controller
    const statsController = new AdminUserStatsController(dataSource, logger);

    /**
     * GET /admin/user-management/stats
     * Get comprehensive user statistics
     * Query params: startDate, endDate, city, country, gender, accountStatus
     */
    router.get('/stats',
      asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await statsController.getUserStats(req as any, res, next);
      })
    );

    /**
     * GET /admin/user-management/stats/dashboard
     * Get dashboard-specific statistics for quick overview
     */
    router.get('/stats/dashboard',
      asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await statsController.getDashboardStats(req as any, res, next);
      })
    );

    /**
     * GET /admin/user-management/stats/real-time
     * Get real-time statistics (cached for performance)
     */
    router.get('/stats/real-time',
      asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await statsController.getRealTimeStats(req as any, res, next);
      })
    );

    /**
     * GET /admin/user-management/stats/trends
     * Get trending statistics and patterns
     * Query params: period (day, week, month, quarter)
     */
    router.get('/stats/trends',
      asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await statsController.getTrendingStats(req as any, res, next);
      })
    );

    /**
     * GET /admin/user-management/stats/segments
     * Get user segments analysis
     */
    router.get('/stats/segments',
      asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await statsController.getUserSegments(req as any, res, next);
      })
    );

    /**
     * GET /admin/user-management/stats/cohorts
     * Get cohort analysis data
     * Query params: months (number of months to analyze, default 6)
     */
    router.get('/stats/cohorts',
      asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await statsController.getCohortAnalysis(req as any, res, next);
      })
    );

    /**
     * POST /admin/user-management/stats/export
     * Export user statistics in various formats
     * Body: { format: 'json' | 'csv' | 'excel', includePersonalData: boolean, startDate: string, endDate: string, filters?: object }
     */
    router.post('/stats/export',
      // validateRequest(StatsExportRequestDto), // Would create this DTO
      asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await statsController.exportUserStats(req as any, res, next);
      })
    );

    /**
     * POST /admin/user-management/stats/custom-query
     * Execute custom statistics query
     * Body: { metrics: string[], filters: object, groupBy: string[], timeRange: {start: string, end: string} }
     */
    router.post('/stats/custom-query',
      // validateRequest(CustomStatsQueryRequestDto), // Would create this DTO
      asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await statsController.executeCustomQuery(req as any, res, next);
      })
    );

    logger.info('Admin user statistics routes initialized successfully', {
      routes: [
        'GET /stats',
        'GET /stats/dashboard',
        'GET /stats/real-time',
        'GET /stats/trends',
        'GET /stats/segments',
        'GET /stats/cohorts',
        'POST /stats/export',
        'POST /stats/custom-query'
      ],
      routeCount: 8
    });

    return router;

  } catch (error) {
    logger.error('Failed to initialize admin user statistics routes', { error });
    throw error;
  }
}

/**
 * Route configuration for documentation
 */
export const adminUserStatsRouteConfig = {
  basePath: '/api/v1/admin/user-management',
  routes: {
    stats: {
      comprehensive: 'GET /stats',
      dashboard: 'GET /stats/dashboard',
      realTime: 'GET /stats/real-time',
      trends: 'GET /stats/trends',
      segments: 'GET /stats/segments',
      cohorts: 'GET /stats/cohorts',
      export: 'POST /stats/export',
      customQuery: 'POST /stats/custom-query'
    }
  },
  exportFormats: ['json', 'csv', 'excel'],
  trendPeriods: ['day', 'week', 'month', 'quarter'],
  availableMetrics: [
    'total_users',
    'active_users',
    'new_signups',
    'trust_scores',
    'verification_rates',
    'engagement_metrics',
    'retention_rates',
    'churn_rates'
  ],
  permissions: {
    required: ['admin', 'moderator', 'super_admin'],
    actions: {
      'stats:read': ['admin', 'moderator', 'super_admin', 'viewer'],
      'stats:export': ['admin', 'super_admin'],
      'stats:custom-query': ['super_admin']
    }
  }
};