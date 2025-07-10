// src/modules/imageUpload/routes/imageUploadRoutes.ts

import { Router } from 'express';
import multer from 'multer';
import { DataSource } from 'typeorm';
import { Logger } from '../../../infrastructure/logging/Logger';
import { ImageUploadController } from '../controllers/ImageUploadController';
import { ImageUploadService } from '../services/ImageUploadService';
import { ImageRepository } from '../repositories/ImageRepository';
import { ImageMapper } from '../mappers/ImageMapper';
import { CloudflareR2Provider } from '../../../infrastructure/storage/CloudflareR2Provider';
import { authenticate } from '../../../infrastructure/middleware/authentication';
import { asyncHandler } from '../../../infrastructure/utils/asyncHandler';
import {
  validateProfileImages,
  validateGalleryImages
} from '../dtos/ImageUploadDtos';

/**
 * Simple Image Upload Routes Factory
 * Following established patterns from your codebase
 */
export function createImageUploadRoutes(dataSource: DataSource): Router {
  const router = Router();
  const logger = Logger.getInstance();

  // Initialize dependencies
  const imageRepository = new ImageRepository(dataSource, logger);
  const imageMapper = new ImageMapper(logger);
  
  // Initialize storage provider
  const storageProvider = new CloudflareR2Provider({
    bucket: process.env.R2_BUCKET_NAME || 'datifyy-images',
    accessKey: process.env.R2_ACCESS_KEY || '',
    secretKey: process.env.R2_SECRET_KEY || '',
    endpoint: process.env.R2_ENDPOINT || '',
    cdnUrl: process.env.R2_CDN_URL
  }, logger);
  // https://bbe179caaaed9b90740d122359cba700.r2.cloudflarestorage.com

  access
  token:  uzsjEeMC3M-VKp2xtuzrGE545v1bsmDk8VI6r51i
  access key: e5eaf954f677da3950c9b38f8984159b

  secret: 54f968cdf55e3505517578a7ef34df9b7bea65f54831a86ba514aff01fbe1b92

  https://bbe179caaaed9b90740d122359cba700.r2.cloudflarestorage.com



  const imageUploadService = new ImageUploadService(
    storageProvider,
    imageRepository,
    imageMapper,
    {
      maxFileSize: 15 * 1024 * 1024, // 15MB
      maxFilesPerUpload: 10,
      maxTotalFiles: 50,
      maxTotalSize: 500 * 1024 * 1024, // 500MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    },
    logger
  );

  const imageController = new ImageUploadController(imageUploadService, logger);

  // Configure multer for file uploads
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 15 * 1024 * 1024, // 15MB
      files: 10
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.'));
      }
    }
  });

  // Apply authentication to all routes
  router.use(authenticate());

  /**
   * POST /upload
   * Upload single image
   */
  router.post('/upload',
    upload.single('image'),
    validateProfileImages,
    asyncHandler(async (req, res, next) => {
      await imageController.uploadSingleImage(req as any, res, next);
    })
  );

  /**
   * POST /upload/bulk
   * Upload multiple images
   */
  router.post('/upload/bulk',
    upload.array('images', 10),
    validateGalleryImages,
    asyncHandler(async (req, res, next) => {
      await imageController.uploadBulkImages(req as any, res, next);
    })
  );

  /**
   * GET /
   * Get user's images with pagination
   */
  router.get('/',
    asyncHandler(async (req, res, next) => {
      await imageController.getUserImages(req as any, res, next);
    })
  );

  /**
   * DELETE /:imageId
   * Delete specific image
   */
  router.delete('/:imageId',
    asyncHandler(async (req, res, next) => {
      await imageController.deleteImage(req as any, res, next);
    })
  );

  /**
   * PATCH /:imageId/primary
   * Set image as primary
   */
  router.patch('/:imageId/primary',
    asyncHandler(async (req, res, next) => {
      await imageController.setPrimaryImage(req as any, res, next);
    })
  );

  logger.info('Image Upload Routes initialized successfully', {
    routes: [
      'POST /images/upload',
      'POST /images/upload/bulk',
      'GET /images',
      'DELETE /images/:imageId',
      'PATCH /images/:imageId/primary'
    ]
  });

  return router;
}