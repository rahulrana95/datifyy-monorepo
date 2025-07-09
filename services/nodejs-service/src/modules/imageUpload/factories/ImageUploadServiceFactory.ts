// src/modules/imageUpload/factories/ImageUploadServiceFactory.ts
/**
 * Image Upload Service Factory - Simple & Clean
 * 
 * Single responsibility: Create configured ImageUploadService
 * ✅ Simple dependency injection
 * ✅ Configuration in one place
 * ✅ Easy to test and mock
 * ✅ No over-engineering
 */

import { DataSource } from 'typeorm';
import { Logger } from '../../../infrastructure/logging/Logger';
import { ImageUploadService } from '../services/ImageUploadService';
import { ImageRepository } from '../repositories/ImageRepository';
import { ImageMapper } from '../mappers/ImageMapper';
import { ImageValidationService } from '../services/ImageValidationService';
import { CloudflareR2Provider } from '../../../infrastructure/storage/CloudflareR2Provider';
import { ImageUploadConfig } from '../services/IImageUploadService';

/**
 * Simple factory to wire up ImageUploadService with its dependencies
 */
export class ImageUploadServiceFactory {
  
  /**
   * Create fully configured ImageUploadService
   */
  static create(dataSource: DataSource, logger?: Logger): ImageUploadService {
    const serviceLogger = logger || Logger.getInstance();
    
    // Simple config - can be moved to env later if needed
    const config: ImageUploadConfig = {
      maxFileSize: 15 * 1024 * 1024, // 15MB
      maxFilesPerUpload: 10,
      maxTotalFiles: 50,
      maxTotalSize: 500 * 1024 * 1024, // 500MB
      allowedMimeTypes: [
        'image/jpeg',
        'image/png', 
        'image/webp',
        'image/gif'
      ]
    };

    // Create storage provider
    const storageProvider = new CloudflareR2Provider({
      bucket: process.env.R2_BUCKET_NAME || 'datifyy-images',
      accessKey: process.env.R2_ACCESS_KEY || '',
      secretKey: process.env.R2_SECRET_KEY || '',
      endpoint: process.env.R2_ENDPOINT || '',
      cdnUrl: process.env.R2_CDN_URL,
      maxFileSize: config.maxFileSize,
      allowedMimeTypes: config.allowedMimeTypes
    }, serviceLogger);

    // Create repositories and services
    const imageRepository = new ImageRepository(dataSource, serviceLogger);
    const imageMapper = new ImageMapper(serviceLogger);

    // Wire everything together - validation service created internally
    const imageUploadService = new ImageUploadService(
      storageProvider,
      imageRepository,
      imageMapper,
      config,
      serviceLogger
    );

    serviceLogger.info('ImageUploadService created via factory', {
      provider: storageProvider.getProviderName(),
      maxFileSize: config.maxFileSize,
      maxFilesPerUpload: config.maxFilesPerUpload
    });

    return imageUploadService;
  }

  /**
   * Create service with custom config (for testing)
   */
  static createWithConfig(
    dataSource: DataSource,
    config: ImageUploadConfig,
    logger?: Logger
  ): ImageUploadService {
    const serviceLogger = logger || Logger.getInstance();

    const storageProvider = new CloudflareR2Provider({
      bucket: process.env.R2_BUCKET_NAME || 'test-bucket',
      accessKey: process.env.R2_ACCESS_KEY || 'test-key',
      secretKey: process.env.R2_SECRET_KEY || 'test-secret',
      endpoint: process.env.R2_ENDPOINT || 'test-endpoint',
      maxFileSize: config.maxFileSize,
      allowedMimeTypes: config.allowedMimeTypes
    }, serviceLogger);

    const imageRepository = new ImageRepository(dataSource, serviceLogger);
    const imageMapper = new ImageMapper(serviceLogger);

    return new ImageUploadService(
      storageProvider,
      imageRepository,
      imageMapper,
      config,
      serviceLogger
    );
  }
}