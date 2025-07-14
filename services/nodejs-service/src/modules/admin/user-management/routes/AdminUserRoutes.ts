import { Router, Response, NextFunction, Request } from 'express';
import { DataSource } from 'typeorm';
import { Logger } from '../../../../infrastructure/logging/Logger';
import { AdminUserController } from '../controllers/AdminUserController';
import { asyncHandler } from '../../../../infrastructure/middleware/AsyncHandler';
import { validateRequest } from '../../../../infrastructure/middleware/ValidationMiddleware';
import {
  GetUsersRequestDto,
  UpdateUserStatusRequestDto,
  VerifyUserRequestDto
} from '../dtos';
import { AuthenticatedAdminRequest } from '../types/ControllerTypes';

/**
 * Create admin user management routes
 */
export function createAdminUserRoutes(dataSource: DataSource): Router {
  const router = Router();
  const logger = Logger.getInstance();
  
  logger.info('Initializing admin user management routes');

  try {
    // Initialize controller
    const adminUserController = new AdminUserController(dataSource, logger);

    /**
     * GET /admin/user-management/users
     * Get paginated list of users with filtering and sorting
     * Query params: page, limit, sortBy, sortOrder, search, accountStatus, gender, etc.
     */
    router.get('/users',
      asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await adminUserController.getUsers(req as any, res, next);
      })
    );

    /**
     * GET /admin/user-management/users/search
     * Search users by query string
     * Query params: q (required), limit
     */
    router.get('/users/search',
      asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await adminUserController.searchUsers(req as any, res, next);
      })
    );

    /**
     * GET /admin/user-management/users/filters/:filterType
     * Get users by predefined filters
     * Params: filterType (lowTrustScore, onProbation, unverified, inactive)
     * Query params: limit
     */
    router.get('/users/filters/:filterType',
      asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await adminUserController.getUsersByFilter(req as any, res, next);
      })
    );

    /**
     * POST /admin/user-management/users/bulk-action
     * Perform bulk actions on multiple users
     * Body: { userIds: number[], action: string, parameters: any }
     */
    router.post('/users/bulk-action',
      // validateRequest(BulkUserActionRequestDto), // Would create this DTO
      asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await adminUserController.bulkUserAction(req as any, res, next);
      })
    );

    /**
     * GET /admin/user-management/users/:userId
     * Get detailed information about a specific user
     * Params: userId (required)
     */
    router.get('/users/:userId',
      asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await adminUserController.getUserById(req as any, res, next);
      })
    );

    /**
     * PUT /admin/user-management/users/:userId/status
     * Update user account status
     * Params: userId (required)
     * Body: UpdateUserStatusRequestDto
     */
    router.put('/users/:userId/status',
      validateRequest(UpdateUserStatusRequestDto),
      asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await adminUserController.updateUserStatus(req as any, res, next);
      })
    );

    /**
     * PUT /admin/user-management/users/:userId/verification
     * Update user verification status
     * Params: userId (required)
     * Body: VerifyUserRequestDto
     */
    router.put('/users/:userId/verification',
      validateRequest(VerifyUserRequestDto),
      asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await adminUserController.verifyUser(req as any, res, next);
      })
    );

    /**
     * GET /admin/user-management/users/:userId/activity-log
     * Get activity log for a specific user
     * Params: userId (required)
     * Query params: page, limit, type
     */
    router.get('/users/:userId/activity-log',
      asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await adminUserController.getUserActivityLog(req as any, res, next);
      })
    );

    /**
     * GET /admin/user-management/users/:userId/notes
     * Get admin notes for a user
     * Params: userId (required)
     */
    router.get('/users/:userId/notes',
      asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await adminUserController.getUserNotes(req as any, res, next);
      })
    );

    /**
     * POST /admin/user-management/users/:userId/notes
     * Add admin note to a user's profile
     * Params: userId (required)
     * Body: { note: string, category?: string, isPrivate?: boolean }
     */
    router.post('/users/:userId/notes',
      // validateRequest(AddUserNoteRequestDto), // Would create this DTO
      asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await adminUserController.addUserNote(req as any, res, next);
      })
    );

    logger.info('Admin user management routes initialized successfully', {
      routes: [
        'GET /users',
        'GET /users/search',
        'GET /users/filters/:filterType',
        'POST /users/bulk-action',
        'GET /users/:userId',
        'PUT /users/:userId/status',
        'PUT /users/:userId/verification',
        'GET /users/:userId/activity-log',
        'GET /users/:userId/notes',
        'POST /users/:userId/notes'
      ],
      routeCount: 10
    });

    return router;

  } catch (error) {
    logger.error('Failed to initialize admin user management routes', { error });
    throw error;
  }
}

/**
 * Route configuration for documentation
 */
export const adminUserRouteConfig = {
  basePath: '/api/v1/admin/user-management',
  routes: {
    users: {
      list: 'GET /users',
      search: 'GET /users/search',
      filterBy: 'GET /users/filters/:filterType',
      bulkAction: 'POST /users/bulk-action',
      getById: 'GET /users/:userId',
      updateStatus: 'PUT /users/:userId/status',
      updateVerification: 'PUT /users/:userId/verification',
      getActivityLog: 'GET /users/:userId/activity-log',
      getNotes: 'GET /users/:userId/notes',
      addNote: 'POST /users/:userId/notes'
    }
  },
  filterTypes: ['lowTrustScore', 'onProbation', 'unverified', 'inactive'],
  bulkActions: ['status_change', 'verification', 'send_message'],
  sortFields: ['createdAt', 'lastActiveAt', 'email', 'overallScore', 'totalDatesAttended'],
  permissions: {
    required: ['admin', 'moderator', 'super_admin'],
    actions: {
      'users:read': ['admin', 'moderator', 'super_admin', 'viewer'],
      'users:update': ['admin', 'super_admin'],
      'users:bulk': ['super_admin'],
      'users:notes': ['admin', 'moderator', 'super_admin']
    }
  }
};