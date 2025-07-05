// src/routes/index.ts - Updated Main Routes Integration

import { Router } from 'express';
import { DataSource } from 'typeorm';
import { Logger } from '../infrastructure/logging/Logger';

// Import route modules
import { createAuthRoutes } from './auth/authRoutes';
import { createUserProfileRoutes } from './userProfile/userProfileRoutes';

// Import existing routes (keeping backward compatibility)
import allRoutes from './allRoutes';

/**
 * Main Application Routes Factory
 * Integrates all route modules following established patterns
 */
export function createAppRoutes(dataSource: DataSource): Router {
  const router = Router();
  const logger = Logger.getInstance();

  logger.info('🚀 Initializing Application Routes', {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });

  // Health check route (no auth required)
  router.get('/health', (req, res) => {
    const healthData = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      database: 'connected', // Could add actual DB health check here
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
      }
    };

    logger.info('Health check requested', {
      requestId: (req as any).id,
      uptime: healthData.uptime,
      memoryUsed: healthData.memory.used
    });

    res.status(200).json(healthData);
  });

  // Authentication routes (following your existing auth patterns)
  router.use('/auth', createAuthRoutes(dataSource));
  logger.info('✅ Auth routes registered at /auth');

  // User Profile routes (new module following established patterns)
  router.use('/user-profile', createUserProfileRoutes(dataSource));
  logger.info('✅ User Profile routes registered at /user-profile');

  // Existing legacy routes (maintaining backward compatibility)
  // This includes all your existing functionality from allRoutes.ts
  router.use('/', allRoutes);
  logger.info('✅ Legacy routes registered (backward compatibility maintained)');

  // API documentation endpoint (helpful for development)
  router.get('/routes', (req, res) => {
    const availableRoutes = {
      authentication: {
        'POST /auth/send-verification-code': 'Send email verification code for signup',
        'POST /auth/signup': 'Register new user account',
        'POST /auth/login': 'Authenticate user and get token',
        'POST /auth/logout': 'Clear authentication session',
        'POST /auth/verify-email': 'Verify email with code',
        'POST /auth/forgot-password': 'Send password reset code',
        'POST /auth/reset-password': 'Reset password with code',
        'POST /auth/validate-token': 'Validate JWT token'
      },
      userProfile: {
        'GET /user-profile': 'Get authenticated user profile',
        'PUT /user-profile': 'Update user profile',
        'DELETE /user-profile': 'Soft delete user profile',
        'PATCH /user-profile/avatar': 'Update profile image',
        'GET /user-profile/stats': 'Get profile completion stats'
      },
      legacy: {
        'GET /enums': 'Get database enums',
        'POST /events': 'Create new event',
        'GET /events': 'List all events',
        'GET /events/:eventId': 'Get specific event',
        'POST /waitlist': 'Add to waitlist',
        'GET /user-profile': 'Legacy profile endpoint (use /user-profile instead)',
        // ... other legacy endpoints
      },
      health: {
        'GET /health': 'API health check',
        'GET /routes': 'This endpoint - API documentation'
      }
    };

    logger.info('API routes documentation requested', {
      requestId: (req as any).id,
      userAgent: req.get('User-Agent')
    });

    res.status(200).json({
      success: true,
      message: 'Available API routes',
      data: availableRoutes,
      totalEndpoints: Object.values(availableRoutes)
        .reduce((total, section) => total + Object.keys(section).length, 0),
      timestamp: new Date().toISOString()
    });
  });

  // 404 handler for unmatched routes (should be last)
  router.use('*', (req, res) => {
    logger.warn('Route not found', {
      path: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      requestId: (req as any).id
    });

    res.status(404).json({
      success: false,
      error: {
        message: `Route ${req.method} ${req.originalUrl} not found`,
        code: 'ROUTE_NOT_FOUND',
        timestamp: new Date().toISOString(),
        requestId: (req as any).id,
        suggestion: 'Use GET /routes to see available endpoints'
      }
    });
  });

  logger.info('🎉 Application Routes initialized successfully', {
    modules: ['health', 'auth', 'userProfile', 'legacy'],
    features: [
      'Health monitoring',
      'Authentication system', 
      'User profile management',
      'Backward compatibility',
      'API documentation',
      '404 handling'
    ],
    timestamp: new Date().toISOString()
  });

  return router;
}

// Export for backward compatibility
export { createAppRoutes as createRoutes };
export default createAppRoutes;