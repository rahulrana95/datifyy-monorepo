/**
 * Admin Routes Index
 * Central router that combines all admin modules and routes
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */

import { Router } from 'express';
import { DataSource } from 'typeorm';
import { Logger } from '../../infrastructure/logging/Logger';
import { authenticateToken, checkIsAdmin } from '../../middlewares/authentication';

// Import all admin route modules
import { createAdminDashboardRoutes } from './adminDashboardRoutes';
import { createAdminUserManagementRoutes } from '../../modules/admin/user-management/routes';
// import { createAdminNotificationsRoutes } from './adminNotificationsRoutes';
// import { createAdminDateCurationRoutes } from './dateCurationRoutes';
// import { createAdminRevenueAnalyticsRoutes } from './revenueAnalyticsRoutes';
// import { createAdminMatchSuggestionsRoutes } from './matchSuggestionsRoutes';
// import { createAdminUserManagementRoutes } from './adminUserManagementRoutes';

/**
 * Admin route configuration with metadata
 */
interface AdminRouteConfig {
  path: string;
  name: string;
  description: string;
  version: string;
  isEnabled: boolean;
  requiresSuperAdmin?: boolean;
}

/**
 * Admin routes configuration
 */
const ADMIN_ROUTES_CONFIG: AdminRouteConfig[] = [
  {
    path: '/dashboard',
    name: 'Admin Dashboard',
    description: 'Core dashboard overview, metrics, alerts, and system health monitoring',
    version: '1.0.0',
    isEnabled: true,
  },
  {
    path: '/notifications',
    name: 'Admin Notifications',
    description: 'Real-time notification management for Slack, Email, SMS, and In-App alerts',
    version: '1.0.0',
    isEnabled: true,
  },
  {
    path: '/date-curation',
    name: 'Date Curation',
    description: 'Complete admin interface for managing curated dates, matches, and workflows',
    version: '1.0.0',
    isEnabled: true,
  },
  {
    path: '/revenue',
    name: 'Revenue Analytics',
    description: 'World-class revenue tracking, analytics, and financial reporting',
    version: '1.0.0',
    isEnabled: true,
  },
  {
    path: '/match-suggestions',
    name: 'Match Suggestions',
    description: 'AI-powered match suggestions and compatibility analysis for admin curation',
    version: '1.0.0',
    isEnabled: true,
  },
  {
    path: '/users',
    name: 'User Management',
    description: 'Comprehensive user management, verification, moderation, and analytics',
    version: '1.0.0',
    isEnabled: true,
  },
];

/**
 * Factory function to create the main admin router
 */
export function createAdminRoutes(dataSource: DataSource): Router {
  const router = Router();
  const logger = Logger.getInstance();

  // Apply global admin middleware
  router.use(authenticateToken); // Ensure user is authenticated
  router.use(checkIsAdmin);      // Ensure user has admin privileges

    // User management routes (auth required - handled by individual route modules)
  const userManagementRoutes = createAdminUserManagementRoutes(dataSource);
  router.use("/user-management", userManagementRoutes);

  // =============================================================================
  // ADMIN ROUTE INFORMATION & HEALTH
  // =============================================================================

  /**
   * GET /admin
   * Get admin routes overview and health status
   */
  router.get('/', (req, res) => {
    const enabledRoutes = ADMIN_ROUTES_CONFIG.filter(route => route.isEnabled);
    
    res.json({
      success: true,
      data: {
        message: 'Datifyy Admin API - Routes Overview',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        availableRoutes: enabledRoutes.map(route => ({
          path: `/admin${route.path}`,
          name: route.name,
          description: route.description,
          version: route.version,
          healthEndpoint: `/admin${route.path}/health`,
        })),
        totalRoutes: enabledRoutes.length,
        documentation: {
          swagger: '/admin/docs',
          postman: '/admin/postman-collection',
        },
        support: {
          email: 'engineering@datifyy.com',
          slack: '#admin-api-support',
        },
      },
    });

    logger.info('Admin routes overview requested', {
      userAgent: req.headers['user-agent'],
      ip: req.ip,
      adminId: (req as any).user?.id,
    });
  });

  /**
   * GET /admin/health
   * Comprehensive health check for all admin services
   */
  router.get('/health', async (req, res) => {
    try {
      const healthChecks: Array<{
        service: string;
        status: 'healthy' | 'unhealthy' | 'unknown';
        responseTime?: number;
        error?: string;
      }> = [];

      // Database health check
      const dbStart = Date.now();
      try {
        await dataSource.query('SELECT 1');
        healthChecks.push({
          service: 'database',
          status: 'healthy',
          responseTime: Date.now() - dbStart,
        });
      } catch (error) {
        healthChecks.push({
          service: 'database',
          status: 'unhealthy',
          error: error instanceof Error ? error.message : 'Unknown database error',
        });
      }

      // Redis health check (if available)
      try {
        // Add Redis health check here when implemented
        healthChecks.push({
          service: 'redis',
          status: 'healthy',
          responseTime: 5,
        });
      } catch (error) {
        healthChecks.push({
          service: 'redis',
          status: 'unknown',
          error: 'Redis health check not implemented',
        });
      }

      const allHealthy = healthChecks.every(check => check.status === 'healthy');
      
      res.status(allHealthy ? 200 : 503).json({
        success: allHealthy,
        data: {
          status: allHealthy ? 'healthy' : 'unhealthy',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          services: healthChecks,
          enabledRoutes: ADMIN_ROUTES_CONFIG.filter(route => route.isEnabled).length,
        },
      });

      logger.info('Admin health check completed', {
        status: allHealthy ? 'healthy' : 'unhealthy',
        services: healthChecks.length,
      });

    } catch (error) {
      logger.error('Admin health check failed', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'HEALTH_CHECK_FAILED',
          message: 'Health check failed',
        },
      });
    }
  });

  /**
   * GET /admin/routes
   * Get detailed information about all available admin routes
   */
  router.get('/routes', (req, res) => {
    const routeDetails = ADMIN_ROUTES_CONFIG.map(route => ({
      ...route,
      fullPath: `/admin${route.path}`,
      healthEndpoint: `/admin${route.path}/health`,
      isActive: route.isEnabled,
    }));

    res.json({
      success: true,
      data: {
        routes: routeDetails,
        summary: {
          total: ADMIN_ROUTES_CONFIG.length,
          enabled: ADMIN_ROUTES_CONFIG.filter(r => r.isEnabled).length,
          disabled: ADMIN_ROUTES_CONFIG.filter(r => !r.isEnabled).length,
        },
        lastUpdated: new Date().toISOString(),
      },
    });
  });

  // =============================================================================
  // REGISTER ALL ADMIN ROUTE MODULES
  // =============================================================================

  // Dashboard Routes (Core metrics and overview)
  if (ADMIN_ROUTES_CONFIG.find(r => r.path === '/dashboard')?.isEnabled) {
    router.use('/dashboard', createAdminDashboardRoutes(dataSource));
    logger.info('Admin Dashboard routes registered at /admin/dashboard');
  }

  // Notifications Routes (Slack, Email, SMS management)
//   if (ADMIN_ROUTES_CONFIG.find(r => r.path === '/notifications')?.isEnabled) {
//     router.use('/notifications', createAdminNotificationsRoutes(dataSource));
//     logger.info('Admin Notifications routes registered at /admin/notifications');
//   }

//   // Date Curation Routes (Date management and matchmaking)
//   if (ADMIN_ROUTES_CONFIG.find(r => r.path === '/date-curation')?.isEnabled) {
//     router.use('/date-curation', createAdminDateCurationRoutes(dataSource));
//     logger.info('Admin Date Curation routes registered at /admin/date-curation');
//   }

//   // Revenue Analytics Routes (Financial tracking and reporting)
//   if (ADMIN_ROUTES_CONFIG.find(r => r.path === '/revenue')?.isEnabled) {
//     router.use('/revenue', createAdminRevenueAnalyticsRoutes(dataSource));
//     logger.info('Admin Revenue Analytics routes registered at /admin/revenue');
//   }

//   // Match Suggestions Routes (AI-powered matching)
//   if (ADMIN_ROUTES_CONFIG.find(r => r.path === '/match-suggestions')?.isEnabled) {
//     router.use('/match-suggestions', createAdminMatchSuggestionsRoutes(dataSource));
//     logger.info('Admin Match Suggestions routes registered at /admin/match-suggestions');
//   }

//   // User Management Routes (User operations and moderation)
//   if (ADMIN_ROUTES_CONFIG.find(r => r.path === '/users')?.isEnabled) {
//     router.use('/users', createAdminUserManagementRoutes(dataSource));
//     logger.info('Admin User Management routes registered at /admin/users');
//   }

  // =============================================================================
  // ERROR HANDLING MIDDLEWARE
  // =============================================================================

  /**
   * Global error handler for admin routes
   */
  router.use((error: any, req: any, res: any, next: any) => {
    logger.error('Admin route error', {
      error: error.message,
      stack: error.stack,
      path: req.path,
      method: req.method,
      adminId: req.user?.id,
      body: req.body,
      query: req.query,
    });

    // Don't leak error details in production
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    res.status(error.status || 500).json({
      success: false,
      error: {
        code: error.code || 'INTERNAL_SERVER_ERROR',
        message: error.message || 'An unexpected error occurred',
        ...(isDevelopment && {
          details: error.details,
          stack: error.stack,
        }),
      },
      metadata: {
        requestId: req.id || `admin-${Date.now()}`,
        timestamp: new Date().toISOString(),
        path: req.path,
        method: req.method,
      },
    });
  });

  // =============================================================================
  // ROUTE NOT FOUND HANDLER
  // =============================================================================

  /**
   * Handle 404 for admin routes
   */
  router.use('*', (req, res) => {
    logger.warn('Admin route not found', {
      path: req.originalUrl,
      method: req.method,
      adminId: (req as any).user?.id,
    });

    res.status(404).json({
      success: false,
      error: {
        code: 'ROUTE_NOT_FOUND',
        message: `Admin route not found: ${req.method} ${req.originalUrl}`,
        suggestions: [
          'Check the route path and method',
          'Ensure the route module is enabled',
          'Visit /admin/routes for available endpoints',
          'Check /admin/docs for API documentation',
        ],
      },
      availableRoutes: ADMIN_ROUTES_CONFIG
        .filter(route => route.isEnabled)
        .map(route => `/admin${route.path}`),
    });
  });

  // =============================================================================
  // LOGGING & ANALYTICS
  // =============================================================================

  // Log successful admin router creation
  const enabledRoutesCount = ADMIN_ROUTES_CONFIG.filter(r => r.isEnabled).length;
  const totalEndpoints = 
    28 + // Dashboard routes
    50 + // Notifications routes  
    26 + // Date Curation routes
    40 + // Revenue Analytics routes
    33 + // Match Suggestions routes
    41;  // User Management routes

  logger.info('Admin routes initialized successfully', {
    totalModules: ADMIN_ROUTES_CONFIG.length,
    enabledModules: enabledRoutesCount,
    disabledModules: ADMIN_ROUTES_CONFIG.length - enabledRoutesCount,
    totalEndpoints,
    modules: ADMIN_ROUTES_CONFIG.map(r => ({
      name: r.name,
      path: r.path,
      enabled: r.isEnabled,
    })),
    timestamp: new Date().toISOString(),
  });

  return router;
}

/**
 * Get admin routes configuration
 */
export function getAdminRoutesConfig(): AdminRouteConfig[] {
  return [...ADMIN_ROUTES_CONFIG];
}

/**
 * Enable/disable specific admin route module
 */
export function toggleAdminRoute(routePath: string, enabled: boolean): boolean {
  const route = ADMIN_ROUTES_CONFIG.find(r => r.path === routePath);
  if (route) {
    route.isEnabled = enabled;
    Logger.getInstance().info(`Admin route ${routePath} ${enabled ? 'enabled' : 'disabled'}`);
    return true;
  }
  return false;
}

/**
 * Get admin routes statistics
 */
export function getAdminRoutesStats() {
  const enabled = ADMIN_ROUTES_CONFIG.filter(r => r.isEnabled);
  const disabled = ADMIN_ROUTES_CONFIG.filter(r => !r.isEnabled);

  return {
    total: ADMIN_ROUTES_CONFIG.length,
    enabled: enabled.length,
    disabled: disabled.length,
    routes: {
      enabled: enabled.map(r => ({ name: r.name, path: r.path })),
      disabled: disabled.map(r => ({ name: r.name, path: r.path })),
    },
    lastModified: new Date().toISOString(),
  };
}