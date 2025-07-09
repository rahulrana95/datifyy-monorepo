/**
 * Partner Preferences Controller - HTTP Layer
 * 
 * Following established codebase patterns:
 * ✅ Clean separation of concerns (HTTP layer only)
 * ✅ Comprehensive request tracking and logging
 * ✅ Proper error delegation to middleware
 * ✅ Response formatting consistency
 * ✅ Request validation delegation
 * ✅ Small, focused, testable methods
 * 
 * @author Staff Engineer - Dating Platform Team
 * @version 1.0.0
 */

import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from '../../../infrastructure/logging/Logger';
import { IPartnerPreferencesService } from '../services/IPartnerPreferencesService';
import { AuthenticatedRequest } from '../../../infrastructure/middleware/authentication';
import { UpdatePartnerPreferencesRequestDto } from '../dtos/PartnerPreferencesDtos';

/**
 * Partner Preferences Controller
 * 
 * Responsibilities:
 * - Handle HTTP requests/responses for partner preferences
 * - Request validation & sanitization (via middleware)
 * - Response formatting with consistent structure
 * - Error delegation to global error handler
 * - Request tracking and performance monitoring
 */
export class PartnerPreferencesController {
  private readonly logger: Logger;

  constructor(
    private readonly partnerPreferencesService: IPartnerPreferencesService,
    logger?: Logger
  ) {
    this.logger = logger || Logger.getInstance();
  }

  /**
   * GET /user/partner-preferences
   * Get authenticated user's partner preferences
   * 
   * @route GET /api/v1/user/partner-preferences
   * @access Private (authenticated users only)
   */
  async getPartnerPreferences(
    req: AuthenticatedRequest, 
    res: Response, 
    next: NextFunction
  ): Promise<void> {
    const requestId = (req as any).id || uuidv4();
    const startTime = Date.now();

    try {
      this.logger.info('GET /user/partner-preferences initiated', {
        requestId,
        userId: req.user?.id,
        method: 'GET',
        path: req.path,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
        timestamp: new Date().toISOString()
      });

      // Delegate business logic to service layer
      const preferences = await this.partnerPreferencesService.getPartnerPreferences(
        req.user!.id,
        requestId
      );

      const responseTime = Date.now() - startTime;

      // Format consistent success response (following established pattern)
      res.status(200).json({
        success: true,
        message: preferences 
          ? 'Partner preferences retrieved successfully'
          : 'No partner preferences found - ready to set preferences',
        data: preferences,
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
          responseTime: `${responseTime}ms`,
          hasPreferences: !!preferences
        }
      });

      this.logger.info('GET /user/partner-preferences completed successfully', {
        requestId,
        userId: req.user?.id,
        hasPreferences: !!preferences,
        responseTime: `${responseTime}ms`,
        operation: 'getPartnerPreferences'
      });

    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      this.logger.error('GET /user/partner-preferences failed', {
        requestId,
        userId: req.user?.id,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        responseTime: `${responseTime}ms`,
        method: 'GET',
        path: req.path,
        operation: 'getPartnerPreferences'
      });

      // Delegate error handling to global middleware
      next(error);
    }
  }

  /**
   * PUT /user/partner-preferences
   * Update authenticated user's partner preferences
   * 
   * @route PUT /api/v1/user/partner-preferences
   * @access Private (authenticated users only)
   * @body UpdatePartnerPreferencesRequestDto
   */
  async updatePartnerPreferences(
    req: AuthenticatedRequest, 
    res: Response, 
    next: NextFunction
  ): Promise<void> {
    const requestId = (req as any).id || uuidv4();
    const startTime = Date.now();

    try {
      this.logger.info('PUT /user/partner-preferences initiated', {
        requestId,
        userId: req.user?.id,
        method: 'PUT',
        path: req.path,
        updateFields: Object.keys(req.body),
        updateFieldCount: Object.keys(req.body).length,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
        timestamp: new Date().toISOString()
      });

      // Extract validated data from request body (validation done by middleware)
      const updateData = req.body as UpdatePartnerPreferencesRequestDto;

      // Delegate business logic to service layer
      const updatedPreferences = await this.partnerPreferencesService.updatePartnerPreferences(
        req.user!.id,
        updateData,
        requestId
      );

      const responseTime = Date.now() - startTime;

      // Format success response with detailed metadata
      res.status(200).json({
        success: true,
        message: 'Partner preferences updated successfully',
        data: updatedPreferences,
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
          responseTime: `${responseTime}ms`,
          updatedFields: Object.keys(updateData),
          isNewPreferences: !updatedPreferences.id, // Indicates if this was first-time creation
          recommendations: updatedPreferences.matchingScore 
            ? 'Your preferences will help us find better matches!'
            : 'Consider adding more preferences for better matching'
        }
      });

      this.logger.info('PUT /user/partner-preferences completed successfully', {
        requestId,
        userId: req.user?.id,
        preferencesId: updatedPreferences.id,
        updatedFields: Object.keys(updateData),
        matchingScore: updatedPreferences.matchingScore,
        responseTime: `${responseTime}ms`,
        operation: 'updatePartnerPreferences'
      });

    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      this.logger.error('PUT /user/partner-preferences failed', {
        requestId,
        userId: req.user?.id,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        updateFields: Object.keys(req.body),
        responseTime: `${responseTime}ms`,
        method: 'PUT',
        path: req.path,
        operation: 'updatePartnerPreferences'
      });

      next(error);
    }
  }

  /**
   * DELETE /user/partner-preferences
   * Delete authenticated user's partner preferences
   * 
   * @route DELETE /api/v1/user/partner-preferences
   * @access Private (authenticated users only)
   */
  async deletePartnerPreferences(
    req: AuthenticatedRequest, 
    res: Response, 
    next: NextFunction
  ): Promise<void> {
    const requestId = (req as any).id || uuidv4();
    const startTime = Date.now();

    try {
      this.logger.warn('DELETE /user/partner-preferences initiated', {
        requestId,
        userId: req.user?.id,
        method: 'DELETE',
        path: req.path,
        operation: 'deletePartnerPreferences',
        userAgent: req.get('User-Agent'),
        ip: req.ip,
        timestamp: new Date().toISOString()
      });

      // Delegate business logic to service layer
      await this.partnerPreferencesService.deletePartnerPreferences(
        req.user!.id,
        requestId
      );

      const responseTime = Date.now() - startTime;

      // Format success response
      res.status(200).json({
        success: true,
        message: 'Partner preferences deleted successfully',
        data: null,
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
          responseTime: `${responseTime}ms`,
          action: 'PREFERENCES_DELETED',
          note: 'You can set new preferences anytime to improve matching'
        }
      });

      this.logger.warn('DELETE /user/partner-preferences completed successfully', {
        requestId,
        userId: req.user?.id,
        responseTime: `${responseTime}ms`,
        operation: 'deletePartnerPreferences',
        action: 'PREFERENCES_DELETED'
      });

    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      this.logger.error('DELETE /user/partner-preferences failed', {
        requestId,
        userId: req.user?.id,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        responseTime: `${responseTime}ms`,
        method: 'DELETE',
        path: req.path,
        operation: 'deletePartnerPreferences'
      });

      next(error);
    }
  }

  /**
   * GET /user/partner-preferences/compatibility/:targetUserId
   * Calculate compatibility score with another user
   * 
   * @route GET /api/v1/user/partner-preferences/compatibility/:targetUserId
   * @access Private (authenticated users only)
   */
  async calculateCompatibility(
    req: AuthenticatedRequest, 
    res: Response, 
    next: NextFunction
  ): Promise<void> {
    const requestId = (req as any).id || uuidv4();
    const startTime = Date.now();
    const targetUserId = parseInt(req.params.targetUserId, 10);

    try {
      this.logger.info('GET /user/partner-preferences/compatibility initiated', {
        requestId,
        userId: req.user?.id,
        targetUserId,
        method: 'GET',
        path: req.path,
        operation: 'calculateCompatibility',
        timestamp: new Date().toISOString()
      });

      // Validate target user ID
      if (!targetUserId || isNaN(targetUserId)) {
        const error = new Error('Invalid target user ID');
        (error as any).statusCode = 400;
        throw error;
      }

      // Delegate to service layer
      const compatibilityResult = await this.partnerPreferencesService.calculateCompatibility(
        req.user!.id,
        targetUserId,
        requestId
      );

      const responseTime = Date.now() - startTime;

      res.status(200).json({
        success: true,
        message: 'Compatibility calculated successfully',
        data: compatibilityResult,
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
          responseTime: `${responseTime}ms`,
          targetUserId,
          calculationType: 'MUTUAL_COMPATIBILITY'
        }
      });

      this.logger.info('Compatibility calculation completed successfully', {
        requestId,
        userId: req.user?.id,
        targetUserId,
        compatibilityScore: compatibilityResult.overallScore,
        responseTime: `${responseTime}ms`,
        operation: 'calculateCompatibility'
      });

    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      this.logger.error('Compatibility calculation failed', {
        requestId,
        userId: req.user?.id,
        targetUserId,
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime: `${responseTime}ms`,
        operation: 'calculateCompatibility'
      });

      next(error);
    }
  }
}