/**
 * Admin Auth Routes - Express Route Definitions
 * 
 * Defines Express routes for admin authentication with middleware,
 * validation, rate limiting, and proper error handling.
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */

import { Router, Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { DataSource } from 'typeorm';
import { AdminAuthController } from '../controllers/AdminAuthController';
import { AdminAuthService } from '../services/AdminAuthService';
import { AdminRepository } from '../repositories/AdminRepository';
import { Logger } from '../../../infrastructure/logging/Logger';
import { RedisService } from '../../../infrastructure/cache/RedisService';
import { asyncHandler } from '../../../infrastructure/middleware/AsyncHandler';
import { adminAuthMiddleware } from '../../../infrastructure/middleware/AdminAuthMiddleware';
import { validateRequest } from '../../../infrastructure/middleware/ValidationMiddleware';
import {
  AdminLoginRequestDto,
  AdminTwoFactorRequestDto,
  AdminRefreshTokenRequestDto,
  AdminLogoutRequestDto,
  AdminPasswordChangeRequestDto
} from '../dtos/AdminAuthDtos';
import { Config } from '../../../infrastructure/config/Config';

/**
 * Rate limiting configurations for different endpoint types
 */
const createAuthRateLimit = (windowMs: number, maxAttempts: number, message: string) =>
  rateLimit({
    windowMs,
    max: maxAttempts,
    message: {
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message,
        retryAfter: Math.ceil(windowMs / 1000)
      },
      metadata: {
        timestamp: new Date().toISOString()
      }
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Custom key generator for IP + user identification
    keyGenerator: (req: Request) => {
      const ip = req.headers['cf-connecting-ip'] || 
                 req.headers['x-forwarded-for'] || 
          req.connection.remoteAddress;
        // @ts-ignore
      const userIdentifier = req.body?.email || req.admin?.id || '';
      return `${ip}:${userIdentifier}`;
    }
  });

/**
 * Authentication rate limiters
 */
const authRateLimiters = {
  // Login attempts: 5 per 15 minutes per IP+email
  login: createAuthRateLimit(
    15 * 60 * 1000, // 15 minutes
    5,
    'Too many login attempts. Please try again in 15 minutes.'
  ),

  // 2FA attempts: 3 per 5 minutes per session
  twoFactor: createAuthRateLimit(
    5 * 60 * 1000, // 5 minutes
    3,
    'Too many 2FA attempts. Please try again in 5 minutes.'
  ),

  // Token refresh: 10 per hour per session
  refresh: createAuthRateLimit(
    60 * 60 * 1000, // 1 hour
    10,
    'Too many token refresh attempts. Please try again later.'
  ),

  // Password change: 3 per hour per admin
  passwordChange: createAuthRateLimit(
    60 * 60 * 1000, // 1 hour
    3,
    'Too many password change attempts. Please try again in 1 hour.'
  ),

  // General admin endpoints: 100 per hour per admin
  general: createAuthRateLimit(
    60 * 60 * 1000, // 1 hour
    100,
    'Too many requests. Please slow down.'
  )
};

/**
 * Security headers middleware for admin endpoints
 */
const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Prevent caching of sensitive admin data
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Admin-specific headers
  res.setHeader('X-Admin-API', 'true');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
  
  next();
};

/**
 * Admin request logger with enhanced security context
 */
const adminRequestLogger = (req: Request, res: Response, next: NextFunction) => {
  const logger = Logger.getInstance();
  
  const logData = {
    method: req.method,
    path: req.path,
    ip: req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    userAgent: req.headers['user-agent'],
    adminId: (req as any).admin?.id,
    sessionId: (req as any).admin?.sessionId,
    timestamp: new Date().toISOString()
  };

  // Log sensitive admin operations
  if (req.path.includes('/admin/')) {
    logger.info('Admin API request', logData);
  }

  next();
};

/**
 * CORS configuration for admin endpoints
 */
const adminCors = (req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins = [
    process.env.ADMIN_FRONTEND_URL,
    'https://admin.datifyy.com',
    'https://datifyy.com',
    'http://localhost' // Admin dashboard dev
  ].filter(Boolean);

  const origin = req.headers.origin ?? '';
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  
  next();
};

/**
 * Health check endpoint for admin auth service
 */
const healthCheck = asyncHandler(async (req: Request, res: Response) => {
  const healthStatus = {
    service: 'admin-auth',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    dependencies: {
      database: true, // TODO: Implement actual health checks
      redis: true,
      external_apis: true
    }
  };

  res.status(200).json({
    success: true,
    data: healthStatus
  });
});

/**
 * Create admin authentication routes with full middleware stack
 */
export function createAdminAuthRoutes(dataSource: DataSource): Router {
  const router = Router();
  const logger = Logger.getInstance();

  logger.info('Initializing admin authentication routes');

  try {
    // Initialize dependencies
    const configService = Config.getInstance();
    const redisService = RedisService.getInstance();
    const adminRepository = new AdminRepository(dataSource, logger);
    const adminAuthService = new AdminAuthService(
      adminRepository,
      configService,
      redisService,
      logger
    );
    const adminAuthController = new AdminAuthController(adminAuthService, logger);

    // Apply global middleware for all admin routes
    router.use(adminCors);
    router.use(securityHeaders);
    router.use(adminRequestLogger);

    // Health check endpoint (no authentication required)
    router.get('/health', healthCheck);

    /**
     * Public Authentication Endpoints (No auth required)
     */

    // POST /api/v1/admin/auth/login - Admin login
    router.post('/login',
      authRateLimiters.login,
      // validateRequest(AdminLoginRequestDto),
      asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await adminAuthController.login(req, res, next);
      })
    );

    // POST /api/v1/admin/auth/2fa - Complete 2FA verification
    router.post('/2fa',
      authRateLimiters.twoFactor,
      validateRequest(AdminTwoFactorRequestDto),
      asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await adminAuthController.verifyTwoFactor(req, res, next);
      })
    );

    // POST /api/v1/admin/auth/refresh - Refresh access token
    router.post('/refresh',
      authRateLimiters.refresh,
      validateRequest(AdminRefreshTokenRequestDto),
      asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await adminAuthController.refreshToken(req, res, next);
      })
    );

    /**
     * Protected Endpoints (Authentication required)
     */

    // Apply authentication middleware for protected routes
    router.use(adminAuthMiddleware(adminAuthService));
    router.use(authRateLimiters.general);

    // POST /api/v1/admin/auth/logout - Admin logout
    router.post('/logout',
      validateRequest(AdminLogoutRequestDto),
      asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await adminAuthController.logout(req as any, res, next);
      })
    );

    // GET /api/v1/admin/auth/profile - Get admin profile and permissions
    router.get('/profile',
      asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await adminAuthController.getProfile(req as any, res, next);
      })
    );

    // POST /api/v1/admin/auth/change-password - Change admin password
    router.post('/change-password',
      authRateLimiters.passwordChange,
      validateRequest(AdminPasswordChangeRequestDto),
      asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await adminAuthController.changePassword(req as any, res, next);
      })
    );

    // GET /api/v1/admin/auth/sessions - Get active sessions
    router.get('/sessions',
      asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await adminAuthController.getSessions(req as any, res, next);
      })
    );

    /**
     * Advanced Security Endpoints
     */

    // POST /api/v1/admin/auth/sessions/:sessionId/terminate - Terminate specific session
    router.post('/sessions/:sessionId/terminate',
      asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const sessionId = req.params.sessionId;
        const adminId = (req as any).admin?.id;

        if (!adminId) {
          res.status(401).json({
            success: false,
            error: {
              code: 'AUTHENTICATION_REQUIRED',
              message: 'Admin authentication required'
            }
          });
          return;
        }

        try {
          const result = await adminAuthService.invalidateSession(sessionId, adminId);
          
          res.status(200).json({
            success: result.success,
            message: result.success ? 'Session terminated successfully' : 'Failed to terminate session',
            data: { sessionId, terminated: result.success }
          });
        } catch (error) {
          next(error);
        }
      })
    );

    // GET /api/v1/admin/auth/permissions - Get current admin permissions
    router.get('/permissions',
      asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const adminId = (req as any).admin?.id;

        if (!adminId) {
          res.status(401).json({
            success: false,
            error: {
              code: 'AUTHENTICATION_REQUIRED',
              message: 'Admin authentication required'
            }
          });
          return;
        }

        try {
          const permissions = await adminAuthService.getAdminPermissions(adminId);
          
          res.status(200).json({
            success: true,
            message: 'Permissions retrieved successfully',
            data: {
              permissions,
              permissionCount: permissions.length,
              adminId
            }
          });
        } catch (error) {
          next(error);
        }
      })
    );

    // POST /api/v1/admin/auth/validate-token - Validate access token (for other services)
    router.post('/validate-token',
      asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { token } = req.body;

        if (!token) {
          res.status(400).json({
            success: false,
            error: {
              code: 'TOKEN_REQUIRED',
              message: 'Access token is required'
            }
          });
          return;
        }

        try {
          const validationResult = await adminAuthService.validateToken(token);
          
          res.status(200).json({
            success: true,
            message: 'Token validation completed',
            data: {
              isValid: validationResult.isValid,
              admin: validationResult.admin,
              expiresAt: validationResult.expiresAt,
              sessionId: validationResult.sessionId,
              reason: validationResult.invalidReason
            }
          });
        } catch (error) {
          next(error);
        }
      })
    );

    /**
     * Error handling middleware for admin routes
     */
    router.use((error: any, req: Request, res: Response, next: NextFunction) => {
      logger.error('Admin auth route error', {
        error: error.message,
        stack: error.stack,
        path: req.path,
        method: req.method,
        adminId: (req as any).admin?.id
      });

      // Don't expose internal errors in production
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      let statusCode = 500;
      let errorCode = 'INTERNAL_SERVER_ERROR';
      let errorMessage = 'Internal server error';

      if (error.name === 'ValidationError') {
        statusCode = 400;
        errorCode = 'VALIDATION_ERROR';
        errorMessage = error.message;
      } else if (error.name === 'AuthenticationError') {
        statusCode = 401;
        errorCode = 'AUTHENTICATION_ERROR';
        errorMessage = error.message;
      } else if (error.name === 'AuthorizationError') {
        statusCode = 403;
        errorCode = 'AUTHORIZATION_ERROR';
        errorMessage = error.message;
      }

      res.status(statusCode).json({
        success: false,
        error: {
          code: errorCode,
          message: errorMessage,
          ...(isDevelopment && { details: error.stack })
        },
        metadata: {
          timestamp: new Date().toISOString(),
          path: req.path,
          method: req.method
        }
      });
    });

    logger.info('Admin authentication routes initialized successfully');
    return router;

  } catch (error) {
    logger.error('Failed to initialize admin authentication routes', { error });
    throw error;
  }
}

/**
 * Export route configuration for documentation and testing
 */
export const adminAuthRouteConfig = {
  basePath: '/api/v1/admin/auth',
  routes: {
    public: [
      'POST /login',
      'POST /2fa', 
      'POST /refresh',
      'GET /health'
    ],
    protected: [
      'POST /logout',
      'GET /profile',
      'POST /change-password',
      'GET /sessions',
      'POST /sessions/:sessionId/terminate',
      'GET /permissions',
      'POST /validate-token'
    ]
  },
  rateLimits: {
    login: '5 attempts per 15 minutes',
    twoFactor: '3 attempts per 5 minutes', 
    refresh: '10 attempts per hour',
    passwordChange: '3 attempts per hour',
    general: '100 requests per hour'
  }
};