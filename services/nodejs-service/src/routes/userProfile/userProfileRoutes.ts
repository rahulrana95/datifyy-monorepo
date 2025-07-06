// src/routes/userProfile/userProfileRoutes.ts - Following Existing Code Patterns

import { Router, Request, Response, NextFunction } from 'express';
import { DataSource } from 'typeorm';
import { Logger } from '../../infrastructure/logging/Logger';

// Reuse existing controller pattern (following your authController pattern)
import { UserProfileController } from '../../modules/userProfile/controllers/UserProfileController';
import { UserProfileService } from '../../modules/userProfile/services/UserProfileService';
import { UserProfileRepository } from '../../modules/userProfile/repositories/UserProfileRepository';
import { UserProfileMapper } from '../../modules/userProfile/mapper/UserProfileMapper';

// Reuse existing validation middleware pattern (following your AuthDtos pattern)
import { 
  validateUpdateUserProfile,
  validateUpdateUserAvatar 
} from '../../modules/userProfile/dtos/UserProfileDtos';

// Reuse existing middleware and types (already established in your codebase)
import { authenticateToken } from '../../middlewares/authentication';
import { asyncHandler } from '../../infrastructure/utils/asyncHandler';
import { AuthenticatedRequest } from '../../infrastructure/middleware/authentication';

/**
 * User Profile Routes Factory
 * Follows existing codebase patterns and reuses established components
 */
export function createUserProfileRoutes(dataSource: DataSource): Router {
  const router = Router();
  const logger = Logger.getInstance();

  logger.info('Initializing User Profile Routes', {
    module: 'UserProfileRoutes',
    timestamp: new Date().toISOString()
  });

  // Initialize dependencies (following your existing DI pattern)
  const userProfileRepository = new UserProfileRepository(dataSource, logger);
  const userProfileMapper = new UserProfileMapper(logger);
  const userProfileService = new UserProfileService(userProfileRepository, userProfileMapper, logger);
  const userProfileController = new UserProfileController(userProfileService, logger);

  // Apply authentication to all routes (reusing your existing pattern)
  router.use(authenticateToken);

  /**
   * GET /user-profile
   * Get authenticated user's profile
   */
  router.get('/',
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      await userProfileController.getUserProfile(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * PUT /user-profile  
   * Update authenticated user's profile
   */
  router.put('/',
    validateUpdateUserProfile, // Reuse validation pattern from AuthDtos
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      await userProfileController.updateUserProfile(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * DELETE /user-profile
   * Soft delete authenticated user's profile
   */
  router.delete('/',
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      await userProfileController.deleteUserProfile(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * PATCH /user-profile/avatar
   * Update user's profile image
   */
  router.patch('/avatar',
    validateUpdateUserAvatar,
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      await userProfileController.updateUserAvatar(req as AuthenticatedRequest, res, next);
    })
  );

  /**
   * GET /user-profile/stats
   * Get profile completion statistics
   */
  router.get('/stats',
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      await userProfileController.getUserProfileStats(req as AuthenticatedRequest, res, next);
    })
  );

  logger.info('User Profile Routes initialized successfully', {
    routes: [
      'GET /user-profile',
      'PUT /user-profile',
      'DELETE /user-profile', 
      'PATCH /user-profile/avatar',
      'GET /user-profile/stats'
    ],
    routeCount: 5
  });

  return router;
}