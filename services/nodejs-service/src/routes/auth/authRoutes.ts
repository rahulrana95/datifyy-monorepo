import { Router } from 'express';
import { DataSource } from 'typeorm';
import { AuthController } from '../../controllers/auth/AuthController';
import { 
  validateSignup, 
  validateLogin,
  validateVerifyEmail,
  validateForgotPassword,
  validateResetPassword 
} from '../../application/dtos/AuthDtos';
import { asyncHandler } from '../../infrastructure/utils/asyncHandler';
import { authRateLimiter } from '../../infrastructure/middleware/rateLimiter';
import { requestId } from '../../infrastructure/middleware/requestId';
import { Logger } from '../../infrastructure/logging/Logger';

/**
 * Factory function to create auth routes with dependency injection
 */
export function createAuthRoutes(dataSource: DataSource): Router {
  const router = Router();
  const logger = Logger.getInstance();
  
  // Initialize AuthController with dependencies
  const authController = new AuthController(dataSource, logger);

  // Apply middleware to all auth routes
  router.use(requestId()); // Ensure request ID for tracking
  router.use(authRateLimiter); // Rate limiting for auth endpoints

  /**
   * POST /signup
   * Register a new user account
   */
  router.post('/signup', 
    validateSignup, // DTO validation middleware
    asyncHandler(async (req, res, next) => {
      await authController.signup(req, res, next);
    })
  );

  /**
   * POST /login
   * Authenticate user and return JWT token
   */
  router.post('/login',
    validateLogin, // DTO validation middleware
    asyncHandler(async (req, res, next) => {
      await authController.login(req, res, next);
    })
  );

  /**
   * POST /logout
   * Clear authentication cookie and invalidate session
   */
  router.post('/logout',
    asyncHandler(async (req, res, next) => {
      await authController.logout(req, res, next);
    })
  );

  /**
   * POST /verify-email
   * Verify user email with verification code
   */
  router.post('/verify-email',
    validateVerifyEmail,
    asyncHandler(async (req, res, next) => {
      await authController.verifyEmail(req, res, next);
    })
  );

  /**
   * POST /forgot-password
   * Send password reset code to user email
   */
  router.post('/forgot-password',
    validateForgotPassword,
    asyncHandler(async (req, res, next) => {
      await authController.forgotPassword(req, res, next);
    })
  );

  /**
   * POST /reset-password
   * Reset user password with verification code
   */
  router.post('/reset-password',
    validateResetPassword,
    asyncHandler(async (req, res, next) => {
      await authController.resetPassword(req, res, next);
    })
  );

  /**
   * POST /validate-token
   * Validate JWT token and return user info
   */
  router.post('/validate-token',
    asyncHandler(async (req, res, next) => {
      await authController.validateToken(req, res, next);
    })
  );

  // Log route registration
  logger.info('Auth routes registered successfully', {
    routes: [
      'POST /auth/signup',
      'POST /auth/login',
      'POST /auth/logout',
      'POST /auth/verify-email',
      'POST /auth/forgot-password',
      'POST /auth/reset-password',
      'POST /auth/validate-token'
    ]
  });

  return router;
}
