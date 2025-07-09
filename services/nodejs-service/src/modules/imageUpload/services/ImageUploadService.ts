// src/modules/imageUpload/services/ImageUploadService.ts

import { v4 as uuidv4 } from 'uuid';
import { Logger } from '../../../infrastructure/logging/Logger';
import { IImageUploadService, ImageUploadConfig } from './IImageUploadService';
import { IStorageProvider } from '../../../infrastructure/storage/IStorageProvider';
import { IImageRepository } from '../repositories/IImageRepository';
import { ImageMapper } from '../mapper/ImageMapper';
import {
  SingleImageUploadRequestDto,
  BulkImageUploadRequestDto,
  ImageUploadResponseDto,
  BulkUploadResponseDto,
  ImageListResponseDto,
  ImageCategory
} from '../dtos/ImageUploadDtos';
import {
  StorageError,
  StorageFileTooLargeError,
  StorageInvalidFileTypeError
} from '@datifyy/shared-types';
import {
  validateFile,
  FILE_VALIDATION_CONFIGS,
  formatFileSize,
  generateSafeFileName
} from '@datifyy/shared-utils';
import {
  InternalServerError,
  UserNotFoundError
} from '../../../domain/errors/AuthErrors';

/**
 * Image Upload Service Implementation
 * 
 * Following the same comprehensive patterns as your UserProfileService:
 * ✅ Detailed logging with request tracking
 * ✅ Business rule validation
 * ✅ Error handling with specific error types
 * ✅ Performance monitoring
 * ✅ Storage abstraction usage
 */
export class ImageUploadService implements IImageUploadService {
  private readonly logger: Logger;
  private readonly config: ImageUploadConfig;

  constructor(
    private readonly storageProvider: IStorageProvider,
    private readonly imageRepository: IImageRepository,
    private readonly imageMapper: ImageMapper,
    config?: Partial<ImageUploadConfig>,
    logger?: Logger
  ) {
    this.logger = logger || Logger.getInstance();
    this.config = {
      maxFileSize: 15 * 1024 * 1024, // 15MB
      maxFilesPerUpload: 10,
      maxTotalFiles: 50,
      maxTotalSize: 500 * 1024 * 1024, // 500MB per user
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      enableThumbnails: true,
      thumbnailSizes: [150, 300, 600],
      enableCompression: true,
      compressionQuality: 85,
      enableWatermark: false,
      ...config
    };
  }

  /**
   * Upload a single image for authenticated user
   */
  async uploadSingleImage(
    userId: number,
    uploadData: SingleImageUploadRequestDto,
    requestId: string
  ): Promise<ImageUploadResponseDto> {
    const startTime = Date.now();

    this.logger.info('ImageUploadService.uploadSingleImage initiated', {
      requestId,
      userId,
      fileName: uploadData.file.originalname,
      fileSize: uploadData.file.size,
      contentType: uploadData.file.mimetype,
      category: uploadData.category,
      operation: 'uploadSingleImage'
    });

    try {
      // 1. Validate file against business rules
      await this.validateSingleFileUpload(userId, uploadData.file, uploadData.category, requestId);

      // 2. Generate unique identifiers
      const imageId = uuidv4();
      const safeFileName = generateSafeFileName(uploadData.file.originalname, uploadData.category);
      
      // 3. Prepare storage options
      const storageOptions = {
        fileName: safeFileName,
        contentType: uploadData.file.mimetype,
        folder: `users/${userId}/${uploadData.category}`,
        metadata: {
          userId: userId.toString(),
          imageId,
          originalName: uploadData.file.originalname,
          category: uploadData.category || ImageCategory.PROFILE,
          uploadedBy: 'user',
          uploadSource: 'web'
        },
        isPublic: true,
        tags: {
          userId: userId.toString(),
          category: uploadData.category || ImageCategory.PROFILE,
          ...uploadData.tags?.reduce((acc, tag) => ({ ...acc, [tag]: 'true' }), {})
        }
      };

      this.logger.debug('Storage upload initiated', {
        requestId,
        userId,
        imageId,
        storageKey: safeFileName,
        operation: 'uploadSingleImage'
      });

      // 4. Upload to storage
      const storageResult = await this.storageProvider.upload(
        uploadData.file.buffer!,
        storageOptions
      );

      // 5. Save metadata to database
      const imageEntity = await this.imageRepository.create({
        id: imageId,
        userId,
        storageKey: storageResult.key,
        originalName: uploadData.file.originalname,
        fileName: safeFileName,
        size: uploadData.file.size,
        contentType: uploadData.file.mimetype,
        category: uploadData.category || ImageCategory.PROFILE,
        description: uploadData.description,
        tags: uploadData.tags || [],
        isPrimary: uploadData.isPrimary || false,
        url: storageResult.url,
        cdnUrl: storageResult.cdnUrl,
        thumbnailUrl: undefined, // TODO: Implement thumbnail generation
        metadata: storageResult.metadata,
        uploadedAt: new Date(),
        isDeleted: false
      });

      // 6. Handle primary image logic
      if (uploadData.isPrimary) {
        await this.handlePrimaryImageUpdate(userId, imageId, requestId);
      }

      // 7. Transform to response DTO
      const responseDto = this.imageMapper.toResponseDto(imageEntity);
      
      const uploadTime = Date.now() - startTime;

      this.logger.info('ImageUploadService.uploadSingleImage completed successfully', {
        requestId,
        userId,
        imageId,
        fileName: uploadData.file.originalname,
        fileSize: uploadData.file.size,
        storageUrl: storageResult.url,
        uploadTime: `${uploadTime}ms`,
        operation: 'uploadSingleImage'
      });

      return responseDto;

    } catch (error) {
      const uploadTime = Date.now() - startTime;

      this.logger.error('ImageUploadService.uploadSingleImage failed', {
        requestId,
        userId,
        fileName: uploadData.file?.originalname,
        fileSize: uploadData.file?.size,
        error: error instanceof Error ? error.message : 'Unknown error',
        uploadTime: `${uploadTime}ms`,
        operation: 'uploadSingleImage'
      });

      // Re-throw known errors, wrap unknown errors
      if (error instanceof StorageError || 
          error instanceof UserNotFoundError ||
          error instanceof StorageFileTooLargeError ||
          error instanceof StorageInvalidFileTypeError) {
        throw error;
      }

      throw new InternalServerError('Failed to upload image');
    }
  }

  /**
   * Upload multiple images in batch
   */
  async uploadBulkImages(
    userId: number,
    uploadData: BulkImageUploadRequestDto,
    requestId: string
  ): Promise<BulkUploadResponseDto> {
    const startTime = Date.now();

    this.logger.info('ImageUploadService.uploadBulkImages initiated', {
      requestId,
      userId,
      fileCount: uploadData.files.length,
      totalSize: uploadData.files.reduce((sum, f) => sum + f.size, 0),
      category: uploadData.category,
      replaceExisting: uploadData.replaceExisting,
      operation: 'uploadBulkImages'
    });

    try {
      // 1. Validate bulk upload constraints
      await this.validateBulkUpload(userId, uploadData.files, uploadData.category, requestId);

      // 2. Process files in parallel with concurrency control
      const BATCH_SIZE = 3; // Process 3 files at a time
      const successful: ImageUploadResponseDto[] = [];
      const failed: Array<{ fileName: string; error: string; size?: number }> = [];

      for (let i = 0; i < uploadData.files.length; i += BATCH_SIZE) {
        const batch = uploadData.files.slice(i, i + BATCH_SIZE);
        
        const batchPromises = batch.map(async (file, index) => {
          try {
            const singleUploadData: SingleImageUploadRequestDto = {
              file,
              category: uploadData.category,
              isPrimary: false, // Only first successful image can be primary
              description: uploadData.descriptions?.[i + index],
              tags: uploadData.tags
            };

            const result = await this.uploadSingleImage(userId, singleUploadData, requestId);
            return { success: true, result, fileName: file.originalname };

          } catch (error) {
            this.logger.error('Bulk upload item failed', {
              requestId,
              userId,
              fileName: file.originalname,
              error: error instanceof Error ? error.message : 'Unknown error',
              operation: 'uploadBulkImages'
            });

            return {
              success: false,
              fileName: file.originalname,
              error: error instanceof Error ? error.message : 'Upload failed',
              size: file.size
            };
          }
        });

        const batchResults = await Promise.all(batchPromises);

        // Separate successful and failed uploads
        batchResults.forEach(result => {
          if (result.success && 'result' in result) {
            successful.push(result.result);
          } else if (!result.success) {
            failed.push({
              fileName: result.fileName,
              error: result.error,
              size: result.size
            });
          }
        });
      }

      const uploadTime = Date.now() - startTime;

      const response: BulkUploadResponseDto = {
        successful,
        failed,
        summary: {
          total: uploadData.files.length,
          successful: successful.length,
          failed: failed.length,
          totalSize: uploadData.files.reduce((sum, f) => sum + f.size, 0),
          processingTime: uploadTime
        }
      };

      this.logger.info('ImageUploadService.uploadBulkImages completed', {
        requestId,
        userId,
        totalFiles: uploadData.files.length,
        successfulUploads: successful.length,
        failedUploads: failed.length,
        uploadTime: `${uploadTime}ms`,
        operation: 'uploadBulkImages'
      });

      return response;

    } catch (error) {
      const uploadTime = Date.now() - startTime;

      this.logger.error('ImageUploadService.uploadBulkImages failed', {
        requestId,
        userId,
        fileCount: uploadData.files.length,
        error: error instanceof Error ? error.message : 'Unknown error',
        uploadTime: `${uploadTime}ms`,
        operation: 'uploadBulkImages'
      });

      throw new InternalServerError('Failed to process bulk image upload');
    }
  }

  /**
   * Get user's uploaded images with pagination
   */
  async getUserImages(
    userId: number,
    options: { page?: number; limit?: number; category?: string; search?: string },
    requestId: string
  ): Promise<ImageListResponseDto> {
    try {
      this.logger.debug('ImageUploadService.getUserImages initiated', {
        requestId,
        userId,
        options,
        operation: 'getUserImages'
      });

      const { images, total } = await this.imageRepository.findUserImages(userId, {
        page: options.page || 1,
        limit: Math.min(options.limit || 20, 100), // Cap at 100
        category: options.category,
        search: options.search,
        includeDeleted: false
      });

      const imageDtos = images.map(image => this.imageMapper.toResponseDto(image));
      
      const page = options.page || 1;
      const limit = options.limit || 20;
      const totalPages = Math.ceil(total / limit);

      const response: ImageListResponseDto = {
        images: imageDtos,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrevious: page > 1
        },
        filters: {
          category: options.category as ImageCategory,
          search: options.search
        }
      };

      this.logger.debug('ImageUploadService.getUserImages completed', {
        requestId,
        userId,
        totalImages: total,
        returnedImages: imageDtos.length,
        page,
        operation: 'getUserImages'
      });

      return response;

    } catch (error) {
      this.logger.error('ImageUploadService.getUserImages failed', {
        requestId,
        userId,
        options,
        error: error instanceof Error ? error.message : 'Unknown error',
        operation: 'getUserImages'
      });

      throw new InternalServerError('Failed to retrieve user images');
    }
  }

  /**
   * Delete user's image by ID
   */
  async deleteUserImage(userId: number, imageId: string, requestId: string): Promise<void> {
    try {
      this.logger.info('ImageUploadService.deleteUserImage initiated', {
        requestId,
        userId,
        imageId,
        operation: 'deleteUserImage'
      });

      // 1. Find and verify ownership
      const image = await this.imageRepository.findByIdAndUserId(imageId, userId);
      if (!image) {
        throw new UserNotFoundError('Image not found or access denied');
      }

      // 2. Delete from storage
      await this.storageProvider.delete(image.storageKey);

      // 3. Soft delete from database
      await this.imageRepository.softDelete(imageId);

      this.logger.info('ImageUploadService.deleteUserImage completed', {
        requestId,
        userId,
        imageId,
        storageKey: image.storageKey,
        operation: 'deleteUserImage'
      });

    } catch (error) {
      this.logger.error('ImageUploadService.deleteUserImage failed', {
        requestId,
        userId,
        imageId,
        error: error instanceof Error ? error.message : 'Unknown error',
        operation: 'deleteUserImage'
      });

      if (error instanceof UserNotFoundError) {
        throw error;
      }
      throw new InternalServerError('Failed to delete image');
    }
  }

  // Stub implementations for remaining interface methods
  async updateImageMetadata(): Promise<ImageUploadResponseDto> {
    throw new Error('Method not implemented');
  }

  async setPrimaryImage(): Promise<ImageUploadResponseDto> {
    throw new Error('Method not implemented');
  }

  async getImageById(): Promise<ImageUploadResponseDto> {
    throw new Error('Method not implemented');
  }

  async generateUploadUrl(): Promise<any> {
    throw new Error('Method not implemented');
  }

  async confirmDirectUpload(): Promise<ImageUploadResponseDto> {
    throw new Error('Method not implemented');
  }

  async getUserImageStats(): Promise<any> {
    throw new Error('Method not implemented');
  }

  async bulkDeleteImages(): Promise<any> {
    throw new Error('Method not implemented');
  }

  // ============================================================================
  // PRIVATE HELPER METHODS (Following your established patterns)
  // ============================================================================

  /**
   * Validate single file upload against business rules
   */
  private async validateSingleFileUpload(
    userId: number,
    file: Express.Multer.File,
    category: ImageCategory = ImageCategory.PROFILE,
    requestId: string
  ): Promise<void> {
    this.logger.debug('Validating single file upload', {
      requestId,
      userId,
      fileName: file.originalname,
      size: file.size,
      type: file.mimetype,
      category
    });

    // 1. Use shared validation utility
    const validationConfig = FILE_VALIDATION_CONFIGS[
      category.toUpperCase() as keyof typeof FILE_VALIDATION_CONFIGS
    ] || FILE_VALIDATION_CONFIGS.PROFILE_IMAGE;

    const fileValidation = validateFile({
      name: file.originalname,
      size: file.size,
      type: file.mimetype,
      file: file as any
    }, validationConfig);

    if (!fileValidation.isValid) {
      throw new StorageInvalidFileTypeError(
        this.config.allowedMimeTypes,
        'image-upload-service'
      );
    }

    // 2. Check user quotas
    const userStats = await this.imageRepository.getUserImageStats(userId);
    
    if (userStats.totalFiles >= this.config.maxTotalFiles) {
      throw new StorageError(
        `Maximum number of files exceeded. Limit: ${this.config.maxTotalFiles}`,
        'QUOTA_EXCEEDED',
        'image-upload-service',
        'validate'
      );
    }

    if (userStats.totalSize + file.size > this.config.maxTotalSize) {
      throw new StorageError(
        `Total storage quota exceeded. Limit: ${formatFileSize(this.config.maxTotalSize)}`,
        'QUOTA_EXCEEDED',
        'image-upload-service',
        'validate'
      );
    }

    this.logger.debug('Single file validation passed', {
      requestId,
      userId,
      fileName: file.originalname,
      userQuotaUsed: `${userStats.totalFiles}/${this.config.maxTotalFiles} files`,
      sizeQuotaUsed: `${formatFileSize(userStats.totalSize)}/${formatFileSize(this.config.maxTotalSize)}`
    });
  }

  /**
   * Validate bulk upload constraints
   */
  private async validateBulkUpload(
    userId: number,
    files: Express.Multer.File[],
    category: ImageCategory = ImageCategory.PROFILE,
    requestId: string
  ): Promise<void> {
    // Check file count limits
    if (files.length > this.config.maxFilesPerUpload) {
      throw new StorageError(
        `Too many files in bulk upload. Maximum: ${this.config.maxFilesPerUpload}`,
        'TOO_MANY_FILES',
        'image-upload-service',
        'validate'
      );
    }

    // Validate each file individually
    for (const file of files) {
      await this.validateSingleFileUpload(userId, file, category, requestId);
    }
  }

  /**
   * Handle primary image update logic
   */
  private async handlePrimaryImageUpdate(
    userId: number,
    newPrimaryImageId: string,
    requestId: string
  ): Promise<void> {
    try {
      // Unset any existing primary images for this user
      await this.imageRepository.unsetPrimaryImages(userId);
      
      // Set the new primary image
      await this.imageRepository.setPrimaryImage(newPrimaryImageId, true);

      this.logger.debug('Primary image updated', {
        requestId,
        userId,
        newPrimaryImageId
      });

    } catch (error) {
      this.logger.error('Failed to update primary image', {
        requestId,
        userId,
        newPrimaryImageId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      // Don't throw - this is not critical for upload success
    }
  }
}