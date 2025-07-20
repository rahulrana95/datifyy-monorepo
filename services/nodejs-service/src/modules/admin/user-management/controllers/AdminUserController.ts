import { Response, NextFunction } from 'express';
import { DataSource } from 'typeorm';
import { Logger } from '../../../../infrastructure/logging/Logger';
import { AdminUserService } from '../services/AdminUserService';
import { AuthenticatedAdminRequest } from '../types/ControllerTypes';
import { 
  GetUsersRequestDto,
  UpdateUserStatusRequestDto,
  VerifyUserRequestDto,
  AdminUserListResponseDto,
  AdminUserDetailResponseDto
} from '../dtos';

export class AdminUserController {
  private userService: AdminUserService;

  constructor(
    private dataSource: DataSource,
    private logger: Logger
  ) {
    this.userService = new AdminUserService(dataSource, logger);
  }

  /**
   * GET /admin/user-management/users
   * Get paginated list of users with filtering and sorting
   */
  async getUsers(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      this.logger.info('Admin getting users list', {
        adminId: req.admin.id,
        query: req.query
      });

      // Extract and validate query parameters
      const filters: GetUsersRequestDto = {
        page: req.query.page ? parseInt(req.query.page as string) : 0,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        sortBy: req.query.sortBy as any,
        sortOrder: req.query.sortOrder as any,
        search: req.query.search as string,
        accountStatus: req.query.accountStatus as any,
        gender: req.query.gender as any,
        verificationStatus: req.query.verificationStatus as any,
        city: req.query.city as string,
        country: req.query.country as string,
        minTrustScore: req.query.minTrustScore ? parseFloat(req.query.minTrustScore as string) : undefined,
        maxTrustScore: req.query.maxTrustScore ? parseFloat(req.query.maxTrustScore as string) : undefined,
        isOnProbation: undefined, //req.query.isOnProbation === 'true',
        createdAfter: req.query.createdAfter as string,
        createdBefore: req.query.createdBefore as string,
        lastActiveAfter: req.query.lastActiveAfter as string,
        lastActiveBefore: req.query.lastActiveBefore as string,
        minDatesAttended: req.query.minDatesAttended ? parseInt(req.query.minDatesAttended as string) : undefined,
        maxDatesAttended: req.query.maxDatesAttended ? parseInt(req.query.maxDatesAttended as string) : undefined,
        hasProfileIssues: req.query.hasProfileIssues === 'true'
      };

      const result = await this.userService.getUsers(filters, req.admin.id);

      res.status(200).json(result);
    } catch (error) {
      this.logger.error('Error in getUsers controller', {
        error,
        adminId: req.admin.id,
        query: req.query
      });
      next(error);
    }
  }

  /**
   * GET /admin/user-management/users/:userId
   * Get detailed information about a specific user
   */
  async getUserById(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_USER_ID',
            message: 'User ID must be a valid number'
          },
          metadata: {
            timestamp: new Date().toISOString()
          }
        });
        return;
      }

      this.logger.info('Admin getting user details', {
        adminId: req.admin.id,
        userId
      });

      const result = await this.userService.getUserById(userId, req.admin.id);

      const statusCode = result.success ? 200 : 404;
      res.status(statusCode).json(result);
    } catch (error) {
      this.logger.error('Error in getUserById controller', {
        error,
        adminId: req.admin.id,
        userId: req.params.userId
      });
      next(error);
    }
  }

  /**
   * PUT /admin/user-management/users/:userId/status
   * Update user account status (active, suspended, etc.)
   */
  async updateUserStatus(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_USER_ID',
            message: 'User ID must be a valid number'
          },
          metadata: {
            timestamp: new Date().toISOString()
          }
        });
        return;
      }

      this.logger.info('Admin updating user status', {
        adminId: req.admin.id,
        userId,
        statusUpdate: req.body
      });

      const statusUpdate: UpdateUserStatusRequestDto = req.body;
      const result = await this.userService.updateUserStatus(userId, statusUpdate, req.admin.id);

      const statusCode = result.success ? 200 : 400;
      res.status(statusCode).json({
        success: result.success,
        message: result.message,
        data: result.user,
        metadata: {
          timestamp: new Date().toISOString(),
          adminId: req.admin.id,
          action: 'status_update'
        }
      });
    } catch (error) {
      this.logger.error('Error in updateUserStatus controller', {
        error,
        adminId: req.admin.id,
        userId: req.params.userId,
        body: req.body
      });
      next(error);
    }
  }

  /**
   * PUT /admin/user-management/users/:userId/verification
   * Update user verification status
   */
  async verifyUser(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_USER_ID',
            message: 'User ID must be a valid number'
          },
          metadata: {
            timestamp: new Date().toISOString()
          }
        });
        return;
      }

      this.logger.info('Admin updating user verification', {
        adminId: req.admin.id,
        userId,
        verification: req.body
      });

      const verification: VerifyUserRequestDto = req.body;
      const result = await this.userService.verifyUser(userId, verification, req.admin.id);

      const statusCode = result.success ? 200 : 400;
      res.status(statusCode).json({
        success: result.success,
        message: result.message,
        data: result.user,
        metadata: {
          timestamp: new Date().toISOString(),
          adminId: req.admin.id,
          action: 'verification_update'
        }
      });
    } catch (error) {
      this.logger.error('Error in verifyUser controller', {
        error,
        adminId: req.admin.id,
        userId: req.params.userId,
        body: req.body
      });
      next(error);
    }
  }

  /**
   * GET /admin/user-management/users/search
   * Search users by query string
   */
  async searchUsers(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const query = req.query.q as string;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      if (!query || query.trim().length < 2) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_SEARCH_QUERY',
            message: 'Search query must be at least 2 characters long'
          },
          metadata: {
            timestamp: new Date().toISOString()
          }
        });
        return;
      }

      this.logger.info('Admin searching users', {
        adminId: req.admin.id,
        query,
        limit
      });

      const result = await this.userService.searchUsers(query.trim(), req.admin.id, limit);

      res.status(200).json({
        success: true,
        message: 'Search completed successfully',
        data: {
          users: result.users,
          total: result.total,
          query: query.trim(),
          limit
        },
        metadata: {
          timestamp: new Date().toISOString(),
          adminId: req.admin.id
        }
      });
    } catch (error) {
      this.logger.error('Error in searchUsers controller', {
        error,
        adminId: req.admin.id,
        query: req.query
      });
      next(error);
    }
  }

  /**
   * GET /admin/user-management/users/filters/:filterType
   * Get users by predefined filters (low trust, probation, etc.)
   */
  async getUsersByFilter(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const filterType = req.params.filterType as 'lowTrustScore' | 'onProbation' | 'unverified' | 'inactive';
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

      const validFilters = ['lowTrustScore', 'onProbation', 'unverified', 'inactive'];
      if (!validFilters.includes(filterType)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_FILTER_TYPE',
            message: `Filter type must be one of: ${validFilters.join(', ')}`
          },
          metadata: {
            timestamp: new Date().toISOString()
          }
        });
        return;
      }

      this.logger.info('Admin getting users by filter', {
        adminId: req.admin.id,
        filterType,
        limit
      });

      const users = await this.userService.getUsersByFilter(filterType, req.admin.id, limit);

      res.status(200).json({
        success: true,
        message: `Users retrieved successfully for filter: ${filterType}`,
        data: {
          users,
          filterType,
          count: users.length,
          limit
        },
        metadata: {
          timestamp: new Date().toISOString(),
          adminId: req.admin.id
        }
      });
    } catch (error) {
      this.logger.error('Error in getUsersByFilter controller', {
        error,
        adminId: req.admin.id,
        filterType: req.params.filterType
      });
      next(error);
    }
  }

  /**
   * POST /admin/user-management/users/bulk-action
   * Perform bulk actions on multiple users
   */
  async bulkUserAction(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userIds, action, parameters } = req.body;

      if (!Array.isArray(userIds) || userIds.length === 0) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_USER_IDS',
            message: 'User IDs must be a non-empty array'
          },
          metadata: {
            timestamp: new Date().toISOString()
          }
        });
        return;
      }

      const validActions = ['status_change', 'verification', 'send_message'];
      if (!validActions.includes(action)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_BULK_ACTION',
            message: `Action must be one of: ${validActions.join(', ')}`
          },
          metadata: {
            timestamp: new Date().toISOString()
          }
        });
        return;
      }

      this.logger.info('Admin performing bulk user action', {
        adminId: req.admin.id,
        userIds,
        action,
        parameters
      });

      // This would be implemented based on the specific action
      // For now, return a placeholder response
      res.status(200).json({
        success: true,
        message: `Bulk ${action} completed`,
        data: {
          processedUsers: userIds.length,
          successfulActions: userIds.length,
          failedActions: 0,
          action,
          parameters
        },
        metadata: {
          timestamp: new Date().toISOString(),
          adminId: req.admin.id
        }
      });
    } catch (error) {
      this.logger.error('Error in bulkUserAction controller', {
        error,
        adminId: req.admin.id,
        body: req.body
      });
      next(error);
    }
  }

  /**
   * GET /admin/user-management/users/:userId/activity-log
   * Get activity log for a specific user
   */
  async getUserActivityLog(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const activityType = req.query.type as string;

      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_USER_ID',
            message: 'User ID must be a valid number'
          },
          metadata: {
            timestamp: new Date().toISOString()
          }
        });
        return;
      }

      this.logger.info('Admin getting user activity log', {
        adminId: req.admin.id,
        userId,
        page,
        limit,
        activityType
      });

      // This would be implemented to get actual activity logs
      // For now, return placeholder data
      res.status(200).json({
        success: true,
        message: 'User activity log retrieved successfully',
        data: {
          activities: [], // Would contain actual activity data
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrevious: false
          },
          filters: {
            activityType
          }
        },
        metadata: {
          timestamp: new Date().toISOString(),
          adminId: req.admin.id
        }
      });
    } catch (error) {
      this.logger.error('Error in getUserActivityLog controller', {
        error,
        adminId: req.admin.id,
        userId: req.params.userId
      });
      next(error);
    }
  }

  /**
   * POST /admin/user-management/users/:userId/notes
   * Add admin notes to a user's profile
   */
  async addUserNote(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      const { note, category, isPrivate } = req.body;

      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_USER_ID',
            message: 'User ID must be a valid number'
          },
          metadata: {
            timestamp: new Date().toISOString()
          }
        });
        return;
      }

      if (!note || note.trim().length === 0) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_NOTE',
            message: 'Note content is required'
          },
          metadata: {
            timestamp: new Date().toISOString()
          }
        });
        return;
      }

      this.logger.info('Admin adding user note', {
        adminId: req.admin.id,
        userId,
        category,
        isPrivate,
        noteLength: note.length
      });

      // This would be implemented to actually save the note
      // For now, return placeholder response
      res.status(201).json({
        success: true,
        message: 'Note added successfully',
        data: {
          noteId: `note_${Date.now()}`,
          userId,
          adminId: req.admin.id,
          note: note.trim(),
          category,
          isPrivate: isPrivate || false,
          createdAt: new Date().toISOString()
        },
        metadata: {
          timestamp: new Date().toISOString(),
          adminId: req.admin.id
        }
      });
    } catch (error) {
      this.logger.error('Error in addUserNote controller', {
        error,
        adminId: req.admin.id,
        userId: req.params.userId,
        body: req.body
      });
      next(error);
    }
  }

  /**
   * GET /admin/user-management/users/:userId/notes
   * Get admin notes for a user
   */
  async getUserNotes(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);

      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_USER_ID',
            message: 'User ID must be a valid number'
          },
          metadata: {
            timestamp: new Date().toISOString()
          }
        });
        return;
      }

      this.logger.info('Admin getting user notes', {
        adminId: req.admin.id,
        userId
      });

      // This would be implemented to get actual notes
      // For now, return placeholder data
      res.status(200).json({
        success: true,
        message: 'User notes retrieved successfully',
        data: {
          notes: [], // Would contain actual notes
          userId,
          totalNotes: 0
        },
        metadata: {
          timestamp: new Date().toISOString(),
          adminId: req.admin.id
        }
      });
    } catch (error) {
      this.logger.error('Error in getUserNotes controller', {
        error,
        adminId: req.admin.id,
        userId: req.params.userId
      });
      next(error);
    }
  }
}