import { Request, Response, NextFunction } from 'express';
import { DataSource } from 'typeorm';
import { Logger } from '../../../../infrastructure/logging/Logger';
import { AdminUserTrustScoreService } from '../services/AdminUserTrustScoreService';
import { AdminUserValidationService } from '../services/AdminUserValidationService';
import { AdminUserRepository, AdminUserTrustScoreRepository } from '../repositories';
import { UpdateUserTrustScoreRequestDto } from '../dtos';
import { AuthenticatedAdminRequest } from '../types/ControllerTypes';

export class AdminUserTrustScoreController {
  private trustScoreService: AdminUserTrustScoreService;

  constructor(
    private dataSource: DataSource,
    private logger: Logger
  ) {
    // Initialize dependencies
    const userRepository = new AdminUserRepository(dataSource, logger);
    const trustScoreRepository = new AdminUserTrustScoreRepository(dataSource, logger);
    const validationService = new AdminUserValidationService(userRepository, trustScoreRepository, logger);
    
    this.trustScoreService = new AdminUserTrustScoreService(dataSource, logger, validationService);
  }

  /**
   * GET /admin/user-management/users/:userId/trust-score
   * Get detailed trust score information for a user
   */
  async getUserTrustScore(
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

      this.logger.info('Admin getting user trust score', {
        adminId: req.admin.id,
        userId
      });

      const analysis = await this.trustScoreService.analyzeTrustScore(userId);

      res.status(200).json({
        success: true,
        message: 'Trust score retrieved successfully',
        data: analysis,
        metadata: {
          timestamp: new Date().toISOString(),
          adminId: req.admin.id
        }
      });
    } catch (error) {
      this.logger.error('Error in getUserTrustScore controller', {
        error,
        adminId: req.admin.id,
        userId: req.params.userId
      });
      next(error);
    }
  }

  /**
   * PUT /admin/user-management/users/:userId/trust-score
   * Update user trust score manually
   */
  async updateUserTrustScore(
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

      this.logger.info('Admin updating user trust score', {
        adminId: req.admin.id,
        userId,
        updates: req.body
      });

      const updates: UpdateUserTrustScoreRequestDto = req.body;
      const result = await this.trustScoreService.updateUserTrustScore(userId, updates, req.admin.id);

      const statusCode = result.success ? 200 : 400;
      res.status(statusCode).json({
        success: result.success,
        message: result.message,
        data: result.trustScore,
        warnings: result.warnings,
        metadata: {
          timestamp: new Date().toISOString(),
          adminId: req.admin.id,
          action: 'trust_score_update'
        }
      });
    } catch (error) {
      this.logger.error('Error in updateUserTrustScore controller', {
        error,
        adminId: req.admin.id,
        userId: req.params.userId,
        body: req.body
      });
      next(error);
    }
  }

  /**
   * POST /admin/user-management/users/:userId/trust-score/recalculate
   * Recalculate trust score based on current data
   */
  async recalculateUserTrustScore(
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

      this.logger.info('Admin recalculating user trust score', {
        adminId: req.admin.id,
        userId
      });

      const result = await this.trustScoreService.recalculateUserTrustScore(
        userId,
        req.admin.id,
        'admin_requested_recalculation'
      );

      res.status(200).json({
        success: result.success,
        message: result.message,
        data: {
          oldScore: result.oldScore,
          newScore: result.newScore,
          scoreChange: result.newScore && result.oldScore ? result.newScore - result.oldScore : 0,
          trustScore: result.trustScore
        },
        metadata: {
          timestamp: new Date().toISOString(),
          adminId: req.admin.id,
          action: 'trust_score_recalculation'
        }
      });
    } catch (error) {
      this.logger.error('Error in recalculateUserTrustScore controller', {
        error,
        adminId: req.admin.id,
        userId: req.params.userId
      });
      next(error);
    }
  }

  /**
   * GET /admin/user-management/trust-scores/requiring-attention
   * Get users with trust scores requiring admin attention
   */
  async getUsersRequiringAttention(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

      this.logger.info('Admin getting users requiring trust score attention', {
        adminId: req.admin.id,
        limit
      });

      const analyses = await this.trustScoreService.getUsersRequiringAttention(req.admin.id, limit);

      res.status(200).json({
        success: true,
        message: 'Users requiring attention retrieved successfully',
        data: {
          users: analyses,
          count: analyses.length,
          limit,
          priorities: {
            critical: analyses.filter(a => a.recommendations.priorityLevel === 5).length,
            high: analyses.filter(a => a.recommendations.priorityLevel === 4).length,
            medium: analyses.filter(a => a.recommendations.priorityLevel === 3).length,
            low: analyses.filter(a => a.recommendations.priorityLevel <= 2).length
          }
        },
        metadata: {
          timestamp: new Date().toISOString(),
          adminId: req.admin.id
        }
      });
    } catch (error) {
      this.logger.error('Error in getUsersRequiringAttention controller', {
        error,
        adminId: req.admin.id
      });
      next(error);
    }
  }

  /**
   * POST /admin/user-management/trust-scores/bulk-recalculate
   * Bulk recalculate trust scores for multiple users or all users
   */
  async bulkRecalculateTrustScores(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userIds, batchSize } = req.body;

      this.logger.info('Admin starting bulk trust score recalculation', {
        adminId: req.admin.id,
        userIds: userIds ? userIds.length : 'all',
        batchSize
      });

      // Validate batch size
      const validatedBatchSize = batchSize && batchSize > 0 && batchSize <= 100 ? batchSize : 50;

      const result = await this.trustScoreService.bulkRecalculateTrustScores(
        userIds,
        req.admin.id,
        validatedBatchSize
      );

      const statusCode = result.success ? 200 : 207; // 207 Multi-Status for partial success

      res.status(statusCode).json({
        success: result.success,
        message: `Bulk recalculation completed. Processed: ${result.usersProcessed}, Updated: ${result.usersUpdated}`,
        data: result,
        metadata: {
          timestamp: new Date().toISOString(),
          adminId: req.admin.id,
          action: 'bulk_trust_score_recalculation'
        }
      });
    } catch (error) {
      this.logger.error('Error in bulkRecalculateTrustScores controller', {
        error,
        adminId: req.admin.id,
        body: req.body
      });
      next(error);
    }
  }

  /**
   * POST /admin/user-management/trust-scores/bulk-update
   * Bulk update trust scores for multiple users
   */
  async bulkUpdateTrustScores(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { updates, reason } = req.body;

      if (!Array.isArray(updates) || updates.length === 0) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_UPDATES',
            message: 'Updates must be a non-empty array'
          },
          metadata: {
            timestamp: new Date().toISOString()
          }
        });
        return;
      }

      if (!reason) {
        res.status(400).json({
          success: false,
          error: {
            code: 'REASON_REQUIRED',
            message: 'Reason for bulk update is required'
          },
          metadata: {
            timestamp: new Date().toISOString()
          }
        });
        return;
      }

      this.logger.info('Admin performing bulk trust score update', {
        adminId: req.admin.id,
        updateCount: updates.length,
        reason
      });

      const result = await this.trustScoreService.bulkUpdateTrustScores(
        updates,
        req.admin.id,
        reason
      );

      const statusCode = result.success ? 200 : 207; // 207 Multi-Status for partial success

      res.status(statusCode).json({
        success: result.success,
        message: `Bulk update completed. Successful: ${result.successfulUpdates}, Failed: ${result.failedUpdates}`,
        data: result,
        metadata: {
          timestamp: new Date().toISOString(),
          adminId: req.admin.id,
          action: 'bulk_trust_score_update'
        }
      });
    } catch (error) {
      this.logger.error('Error in bulkUpdateTrustScores controller', {
        error,
        adminId: req.admin.id,
        body: req.body
      });
      next(error);
    }
  }

  /**
   * POST /admin/user-management/users/:userId/probation
   * Manage user probation status
   */
  async manageUserProbation(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      const { action, duration, reason } = req.body;

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

      const validActions = ['place', 'remove', 'extend'];
      if (!validActions.includes(action)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_PROBATION_ACTION',
            message: `Action must be one of: ${validActions.join(', ')}`
          },
          metadata: {
            timestamp: new Date().toISOString()
          }
        });
        return;
      }

      this.logger.info('Admin managing user probation', {
        adminId: req.admin.id,
        userId,
        action,
        duration,
        reason
      });

      // Prepare trust score update based on action
      let updates: Partial<UpdateUserTrustScoreRequestDto> = {
        adjustmentReason: 'MANUAL_REVIEW' as any,
        adminNotes: reason || `Probation ${action} by admin`
      };

      if (action === 'place' || action === 'extend') {
        updates.probationDuration = duration || 'P30D'; // Default 30 days
      }

      const result = await this.trustScoreService.updateUserTrustScore(
        userId,
        updates as UpdateUserTrustScoreRequestDto,
        req.admin.id
      );

      res.status(200).json({
        success: result.success,
        message: `User probation ${action} completed successfully`,
        data: {
          userId,
          action,
          duration,
          reason,
          trustScore: result.trustScore
        },
        metadata: {
          timestamp: new Date().toISOString(),
          adminId: req.admin.id,
          action: `probation_${action}`
        }
      });
    } catch (error) {
      this.logger.error('Error in manageUserProbation controller', {
        error,
        adminId: req.admin.id,
        userId: req.params.userId,
        body: req.body
      });
      next(error);
    }
  }

  /**
   * GET /admin/user-management/trust-scores/statistics
   * Get trust score statistics and distributions
   */
  async getTrustScoreStatistics(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      this.logger.info('Admin getting trust score statistics', {
        adminId: req.admin.id
      });

      // This would get comprehensive trust score statistics
      // For now, return placeholder data
      res.status(200).json({
        success: true,
        message: 'Trust score statistics retrieved successfully',
        data: {
          distribution: {
            excellent: 0, // 90-100
            good: 0,      // 75-89
            average: 0,   // 50-74
            poor: 0,      // 25-49
            critical: 0   // 0-24
          },
          averageScore: 0,
          medianScore: 0,
          trendsOverTime: [], // Would show how scores change over time
          probationStats: {
            totalOnProbation: 0,
            averageProbationDuration: 0,
            probationSuccessRate: 0
          },
          adjustmentHistory: {
            totalAdjustments: 0,
            adjustmentsByReason: {},
            averageAdjustmentMagnitude: 0
          }
        },
        metadata: {
          timestamp: new Date().toISOString(),
          adminId: req.admin.id
        }
      });
    } catch (error) {
      this.logger.error('Error in getTrustScoreStatistics controller', {
        error,
        adminId: req.admin.id
      });
      next(error);
    }
  }
}