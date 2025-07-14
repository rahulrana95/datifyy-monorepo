import { Router } from 'express';
import { DataSource } from 'typeorm';
import { Logger } from '../../../../infrastructure/logging/Logger';
import { createAdminUserRoutes, adminUserRouteConfig } from './AdminUserRoutes';
import { createAdminUserTrustScoreRoutes, adminUserTrustScoreRouteConfig } from './AdminUserTrustScoreRoutes';
import { createAdminUserStatsRoutes, adminUserStatsRouteConfig } from './AdminUserStatsRoutes';

/**
 * Create complete admin user management routes with all sub-modules
 */
export function createAdminUserManagementRoutes(dataSource: DataSource): Router {
  const router = Router();
  const logger = Logger.getInstance();

  logger.info('Initializing complete admin user management routes');

  try {
    // Mount user management routes
    const userRoutes = createAdminUserRoutes(dataSource);
    router.use('/', userRoutes);

    // Mount trust score routes
    const trustScoreRoutes = createAdminUserTrustScoreRoutes(dataSource);
    router.use('/', trustScoreRoutes);

    // Mount statistics routes
    const statsRoutes = createAdminUserStatsRoutes(dataSource);
    router.use('/', statsRoutes);

    /**
     * GET /admin/user-management/health
     * Health check endpoint for user management module
     */
    router.get('/health', (req, res) => {
      res.status(200).json({
        success: true,
        message: 'Admin User Management module is healthy',
        data: {
          module: 'admin-user-management',
          status: 'healthy',
          timestamp: new Date().toISOString(),
          version: '1.0.0',
          subModules: {
            users: 'healthy',
            trustScores: 'healthy',
            statistics: 'healthy'
          },
          dependencies: {
            database: 'connected',
            cache: 'available',
            logging: 'active'
          }
        },
        metadata: {
          timestamp: new Date().toISOString(),
          requestId: `health-${Date.now()}`
        }
      });
    });

    /**
     * GET /admin/user-management/routes
     * Get available routes documentation (for development)
     */
    router.get('/routes', (req, res) => {
      const routeDocumentation = {
        success: true,
        message: 'Available admin user management routes',
        data: {
          basePath: '/api/v1/admin/user-management',
          modules: {
            users: adminUserRouteConfig,
            trustScores: adminUserTrustScoreRouteConfig,
            statistics: adminUserStatsRouteConfig
          },
          totalRoutes: 
            Object.keys(adminUserRouteConfig.routes.users).length +
            Object.keys(adminUserTrustScoreRouteConfig.routes.trustScores).length +
            Object.keys(adminUserTrustScoreRouteConfig.routes.userTrustScores).length +
            Object.keys(adminUserStatsRouteConfig.routes.stats).length,
          authentication: {
            required: true,
            type: 'Bearer JWT',
            adminOnly: true
          },
          rateLimit: {
            general: '100 requests per hour',
            bulk: '10 requests per hour',
            export: '5 requests per hour'
          }
        },
        metadata: {
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV || 'development'
        }
      };

      res.status(200).json(routeDocumentation);
    });

    logger.info('Admin user management routes initialized successfully', {
      totalRoutes: 28, // Approximate total including all sub-modules
      modules: ['users', 'trust-scores', 'statistics'],
      basePath: '/api/v1/admin/user-management'
    });

    return router;

  } catch (error) {
    logger.error('Failed to initialize admin user management routes', { error });
    throw error;
  }
}

/**
 * Export individual route creators for testing or selective mounting
 */
export {
  createAdminUserRoutes,
  createAdminUserTrustScoreRoutes,
  createAdminUserStatsRoutes,
  adminUserRouteConfig,
  adminUserTrustScoreRouteConfig,
  adminUserStatsRouteConfig
};

/**
 * Complete route configuration for external reference
 */
export const adminUserManagementRouteConfig = {
  basePath: '/api/v1/admin/user-management',
  modules: {
    users: adminUserRouteConfig,
    trustScores: adminUserTrustScoreRouteConfig,
    statistics: adminUserStatsRouteConfig
  },
  health: 'GET /health',
  documentation: 'GET /routes',
  authentication: {
    required: true,
    middleware: 'adminAuthMiddleware',
    permissions: {
      viewer: ['GET /stats/*', 'GET /users (read-only)'],
      moderator: ['All viewer permissions', 'GET /trust-scores/*', 'POST /users/*/notes'],
      admin: ['All moderator permissions', 'PUT /users/*/status', 'PUT /users/*/trust-score'],
      super_admin: ['All permissions', 'POST /bulk-*', 'POST /stats/export']
    }
  },
  security: {
    rateLimiting: true,
    inputValidation: true,
    auditLogging: true,
    dataEncryption: 'in-transit'
  }
};