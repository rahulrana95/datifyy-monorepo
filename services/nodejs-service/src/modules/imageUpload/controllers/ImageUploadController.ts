// src/modules/imageUpload/controllers/ImageUploadController.ts

import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from '../../../infrastructure/logging/Logger';
import { IImageUploadService } from '../services/IImageUploadService';
import { AuthenticatedRequest } from '../../../infrastructure/middleware/authentication';
import {
  SingleImageUploadRequestDto,
  BulkImageUploadRequestDto,
  ImageListQueryDto
} from '../dtos/ImageUploadDtos';

/**
 * Simple Image Upload Controller
 * Single Responsibility: Handle HTTP requests for image operations
 */
export class ImageUploadController {
  private readonly logger: Logger;

  constructor(
    private readonly imageUploadService: IImageUploadService,
    logger?: Logger
  ) {
    this.logger = logger || Logger.getInstance();
  }

  /**
   * POST /images/upload
   * Upload single image
   */
  async uploadSingleImage(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const requestId = (req as any).id || uuidv4();

    try {
      this.logger.info('Single image upload initiated', {
        requestId,
        userId: req.user?.id,
        fileName: req.file?.originalname,
        fileSize: req.file?.size
      });

      if (!req.file) {
        res.status(400).json({
          success: false,
          error: {
            message: 'No file provided',
            code: 'NO_FILE_PROVIDED',
            requestId,
            timestamp: new Date().toISOString()
          }
        });
        return;
      }

      const uploadData: SingleImageUploadRequestDto = {
        file: req.file as any,
        category: req.body.category,
        isPrimary: req.body.isPrimary === 'true',
        description: req.body.description,
        tags: req.body.tags ? JSON.parse(req.body.tags) : undefined
      };

      const result = await this.imageUploadService.uploadSingleImage(
        req.user!.id,
        uploadData,
        requestId
      );

      res.status(201).json({
        success: true,
        message: 'Image uploaded successfully',
        data: result,
        requestId,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      this.logger.error('Single image upload failed', {
        requestId,
        userId: req.user?.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }

  /**
   * POST /images/upload/bulk
   * Upload multiple images
   */
  async uploadBulkImages(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const requestId = (req as any).id || uuidv4();

    try {
      this.logger.info('Bulk image upload initiated', {
        requestId,
        userId: req.user?.id,
        fileCount: req.files?.length || 0
      });

      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        res.status(400).json({
          success: false,
          error: {
            message: 'No files provided',
            code: 'NO_FILES_PROVIDED',
            requestId,
            timestamp: new Date().toISOString()
          }
        });
        return;
      }

      const uploadData: BulkImageUploadRequestDto = {
        files: req.files as any[],
        category: req.body.category,
        replaceExisting: req.body.replaceExisting === 'true',
        descriptions: req.body.descriptions ? JSON.parse(req.body.descriptions) : undefined,
        tags: req.body.tags ? JSON.parse(req.body.tags) : undefined
      };

      const result = await this.imageUploadService.uploadBulkImages(
        req.user!.id,
        uploadData,
        requestId
      );

      res.status(201).json({
        success: true,
        message: 'Bulk upload completed',
        data: result,
        requestId,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      this.logger.error('Bulk image upload failed', {
        requestId,
        userId: req.user?.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }

  /**
   * GET /images
   * Get user's images with pagination
   */
  async getUserImages(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const requestId = (req as any).id || uuidv4();

    try {
      const options = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
        category: req.query.category as string,
        search: req.query.search as string
      };

      const result = await this.imageUploadService.getUserImages(
        req.user!.id,
        options,
        requestId
      );

      res.status(200).json({
        success: true,
        message: 'Images retrieved successfully',
        data: result,
        requestId,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      this.logger.error('Get user images failed', {
        requestId,
        userId: req.user?.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }

  /**
   * DELETE /images/:imageId
   * Delete user's image
   */
  async deleteImage(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const requestId = (req as any).id || uuidv4();
    const { imageId } = req.params;

    try {
      await this.imageUploadService.deleteUserImage(
        req.user!.id,
        imageId,
        requestId
      );

      res.status(200).json({
        success: true,
        message: 'Image deleted successfully',
        requestId,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      this.logger.error('Delete image failed', {
        requestId,
        userId: req.user?.id,
        imageId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }

  /**
   * PATCH /images/:imageId/primary
   * Set image as primary
   */
  async setPrimaryImage(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const requestId = (req as any).id || uuidv4();
    const { imageId } = req.params;

    try {
      const result = await this.imageUploadService.setPrimaryImage(
        req.user!.id,
        imageId,
        requestId
      );

      res.status(200).json({
        success: true,
        message: 'Primary image updated successfully',
        data: result,
        requestId,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      this.logger.error('Set primary image failed', {
        requestId,
        userId: req.user?.id,
        imageId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }
}