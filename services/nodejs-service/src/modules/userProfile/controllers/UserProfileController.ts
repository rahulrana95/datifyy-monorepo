// src/modules/userProfile/controllers/UserProfileController.ts

import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from '../../../infrastructure/logging/Logger';
import { IUserProfileService } from '../services/IUserProfileService';
import { AuthenticatedRequest } from '../../../infrastructure/middleware/authentication';
import {
  UpdateUserProfileRequestDto,
  validateUpdateUserProfile
} from '../dtos/UserProfileDtos';

/**
 * User Profile Controller - HTTP Layer Only
 * 
 * Responsibilities:
 * - Handle HTTP requests/responses
 * - Request validation & sanitization
 * - Response formatting
 * - Error delegation to middleware
 */
export class UserProfileController {
  private readonly logger: Logger;

  constructor(
    private readonly userProfileService: IUserProfileService,
    logger?: Logger
  ) {
    this.logger = logger || Logger.getInstance();
  }

  /**
   * GET /user-profile
   * Get authenticated user's profile
   */
  async getUserProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const requestId = (req as any).id || uuidv4();

    try {
      this.logger.info('GET /user-profile initiated', {
        requestId,
        userId: req.user?.id,
        method: 'GET',
        path: req.path
      });

      // Delegate to service layer
      const profileData = await this.userProfileService.getUserProfile(
        req.user!.id, 
        requestId
      );

      // Format success response
      res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully',
        data: profileData,
        requestId,
        timestamp: new Date().toISOString()
      });

      this.logger.info('GET /user-profile completed successfully', {
        requestId,
        userId: req.user?.id,
        responseTime: Date.now()
      });

    } catch (error) {
      this.logger.error('GET /user-profile failed', {
        requestId,
        userId: req.user?.id,
        error: error instanceof Error ? error.message : 'Unknown error',
        method: 'GET',
        path: req.path
      });

      next(error);
    }
  }

  /**
   * PUT /user-profile
   * Update authenticated user's profile
   */
  async updateUserProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const requestId = (req as any).id || uuidv4();

    try {
      this.logger.info('PUT /user-profile initiated', {
        requestId,
        userId: req.user?.id,
        method: 'PUT',
        path: req.path,
        updateFields: Object.keys(req.body)
      });

      // Extract validated data from request body (validation done by middleware)
      const updateData = req.body as UpdateUserProfileRequestDto;

      // Delegate to service layer
      const updatedProfile = await this.userProfileService.updateUserProfile(
        req.user!.id,
        updateData,
        requestId
      );

      // Format success response
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedProfile,
        requestId,
        timestamp: new Date().toISOString()
      });

      this.logger.info('PUT /user-profile completed successfully', {
        requestId,
        userId: req.user?.id,
        updatedFields: Object.keys(updateData),
        responseTime: Date.now()
      });

    } catch (error) {
      this.logger.error('PUT /user-profile failed', {
        requestId,
        userId: req.user?.id,
        error: error instanceof Error ? error.message : 'Unknown error',
        method: 'PUT',
        path: req.path
      });

      next(error);
    }
  }

  /**
   * DELETE /user-profile
   * Soft delete authenticated user's profile
   */
  async deleteUserProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const requestId = (req as any).id || uuidv4();

    try {
      this.logger.info('DELETE /user-profile initiated', {
        requestId,
        userId: req.user?.id,
        method: 'DELETE',
        path: req.path
      });

      // Delegate to service layer
      await this.userProfileService.deleteUserProfile(
        req.user!.id,
        requestId
      );

      // Format success response
      res.status(200).json({
        success: true,
        message: 'Profile deleted successfully',
        requestId,
        timestamp: new Date().toISOString()
      });

      this.logger.info('DELETE /user-profile completed successfully', {
        requestId,
        userId: req.user?.id,
        responseTime: Date.now()
      });

    } catch (error) {
      this.logger.error('DELETE /user-profile failed', {
        requestId,
        userId: req.user?.id,
        error: error instanceof Error ? error.message : 'Unknown error',
        method: 'DELETE',
        path: req.path
      });

      next(error);
    }
  }

  /**
   * PATCH /user-profile/avatar
   * Update user's profile image/avatar
   */
  async updateUserAvatar(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const requestId = (req as any).id || uuidv4();

    try {
      this.logger.info('PATCH /user-profile/avatar initiated', {
        requestId,
        userId: req.user?.id,
        method: 'PATCH',
        path: req.path
      });

      const { imageUrl } = req.body;

      // Delegate to service layer
      const updatedProfile = await this.userProfileService.updateUserAvatar(
        req.user!.id,
        imageUrl,
        requestId
      );

      // Format success response
      res.status(200).json({
        success: true,
        message: 'Avatar updated successfully',
        data: {
          id: updatedProfile.id,
          images: updatedProfile.images
        },
        requestId,
        timestamp: new Date().toISOString()
      });

      this.logger.info('PATCH /user-profile/avatar completed successfully', {
        requestId,
        userId: req.user?.id,
        responseTime: Date.now()
      });

    } catch (error) {
      this.logger.error('PATCH /user-profile/avatar failed', {
        requestId,
        userId: req.user?.id,
        error: error instanceof Error ? error.message : 'Unknown error',
        method: 'PATCH',
        path: req.path
      });

      next(error);
    }
  }

  /**
   * GET /user-profile/stats
   * Get user profile completion stats
   */
  async getUserProfileStats(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const requestId = (req as any).id || uuidv4();

    try {
      this.logger.info('GET /user-profile/stats initiated', {
        requestId,
        userId: req.user?.id,
        method: 'GET',
        path: req.path
      });

      // Delegate to service layer
      const profileStats = await this.userProfileService.getUserProfileStats(
        req.user!.id,
        requestId
      );

      // Format success response
      res.status(200).json({
        success: true,
        message: 'Profile stats retrieved successfully',
        data: profileStats,
        requestId,
        timestamp: new Date().toISOString()
      });

      this.logger.info('GET /user-profile/stats completed successfully', {
        requestId,
        userId: req.user?.id,
        completionPercentage: profileStats.completionPercentage,
        responseTime: Date.now()
      });

    } catch (error) {
      this.logger.error('GET /user-profile/stats failed', {
        requestId,
        userId: req.user?.id,
        error: error instanceof Error ? error.message : 'Unknown error',
        method: 'GET',
        path: req.path
      });

      next(error);
    }
  }
}