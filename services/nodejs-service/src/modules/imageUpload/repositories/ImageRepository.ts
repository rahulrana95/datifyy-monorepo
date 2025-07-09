// src/modules/imageUpload/repositories/ImageRepository.ts

import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from '../../../infrastructure/logging/Logger';
import { 
  IImageRepository,
  ImageEntity,
  ImageRepositoryError,
  ImageNotFoundError,
  ImageAccessDeniedError,
  ImageDatabaseConnectionError
} from './IImageRepository';
import { ImageCategory } from '../dtos/ImageUploadDtos';
import { UserImage } from '../entities/UserImage';

/**
 * Image Repository Implementation using TypeORM
 * 
 * Following the same patterns as your UserProfileRepository:
 * ✅ Comprehensive error handling
 * ✅ Performance monitoring
 * ✅ Detailed logging
 * ✅ Optimized queries
 * ✅ Transaction support
 */
export class ImageRepository implements IImageRepository {
  private readonly repository: Repository<UserImage>;
  private readonly logger: Logger;

  constructor(
    private readonly dataSource: DataSource,
    logger?: Logger
  ) {
    this.repository = dataSource.getRepository(UserImage);
    this.logger = logger || Logger.getInstance();
  }

  /**
   * Create a new image record
   */
  async create(imageData: Omit<ImageEntity, 'id' | 'updatedAt'>): Promise<ImageEntity> {
    try {
      this.logger.debug('ImageRepository.create', {
        userId: imageData.userId,
        fileName: imageData.fileName,
        size: imageData.size,
        category: imageData.category
      });

      // Generate UUID if not provided
      const imageId = uuidv4();
      
      const imageEntity = this.repository.create({
        id: imageId,
        ...imageData,
        updatedAt: new Date()
      });

      const savedImage = await this.repository.save(imageEntity);

      this.logger.info('Image record created successfully', {
        imageId: savedImage.id,
        userId: savedImage.userId,
        fileName: savedImage.fileName,
        storageKey: savedImage.storageKey
      });

      return this.mapToEntity(savedImage);

    } catch (error) {
      this.logger.error('Failed to create image record', {
        userId: imageData.userId,
        fileName: imageData.fileName,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw new ImageDatabaseConnectionError('create', error as Error);
    }
  }

  /**
   * Find image by ID
   */
  async findById(imageId: string): Promise<ImageEntity | null> {
    try {
      this.logger.debug('ImageRepository.findById', { imageId });

      const image = await this.repository.findOne({
        where: { 
          id: imageId,
          isDeleted: false 
        }
      });

      return image ? this.mapToEntity(image) : null;

    } catch (error) {
      this.logger.error('Failed to find image by ID', { imageId, error });
      throw new ImageDatabaseConnectionError('findById', error as Error);
    }
  }

  /**
   * Find image by ID and user ID (ownership verification)
   */
  async findByIdAndUserId(imageId: string, userId: number): Promise<ImageEntity | null> {
    try {
      this.logger.debug('ImageRepository.findByIdAndUserId', { imageId, userId });

      const image = await this.repository.findOne({
        where: { 
          id: imageId,
          userId,
          isDeleted: false 
        }
      });

      return image ? this.mapToEntity(image) : null;

    } catch (error) {
      this.logger.error('Failed to find image by ID and user ID', { imageId, userId, error });
      throw new ImageDatabaseConnectionError('findByIdAndUserId', error as Error);
    }
  }

  /**
   * Find user's images with pagination and filtering
   */
  async findUserImages(
    userId: number,
    options: {
      page?: number;
      limit?: number;
      category?: string;
      search?: string;
      includeDeleted?: boolean;
      sortBy?: keyof ImageEntity;
      sortOrder?: 'ASC' | 'DESC';
    }
  ): Promise<{ images: ImageEntity[]; total: number }> {
    try {
      this.logger.debug('ImageRepository.findUserImages', { userId, options });

      const queryBuilder = this.repository.createQueryBuilder('image')
        .where('image.userId = :userId', { userId });

      // Apply filters
      if (!options.includeDeleted) {
        queryBuilder.andWhere('image.isDeleted = :isDeleted', { isDeleted: false });
      }

      if (options.category) {
        queryBuilder.andWhere('image.category = :category', { category: options.category });
      }

      if (options.search) {
        queryBuilder.andWhere(
          '(LOWER(image.originalName) LIKE LOWER(:search) OR LOWER(image.description) LIKE LOWER(:search))',
          { search: `%${options.search}%` }
        );
      }

      // Apply sorting
      const sortBy = options.sortBy || 'uploadedAt';
      const sortOrder = options.sortOrder || 'DESC';
      queryBuilder.orderBy(`image.${sortBy}`, sortOrder);

      // Apply pagination
      const page = options.page || 1;
      const limit = Math.min(options.limit || 20, 100); // Cap at 100
      const skip = (page - 1) * limit;

      queryBuilder.skip(skip).take(limit);

      // Execute queries
      const [images, total] = await queryBuilder.getManyAndCount();

      this.logger.debug('User images query completed', {
        userId,
        total,
        returned: images.length,
        page,
        limit
      });

      return {
        images: images.map(img => this.mapToEntity(img)),
        total
      };

    } catch (error) {
      this.logger.error('Failed to find user images', { userId, options, error });
      throw new ImageDatabaseConnectionError('findUserImages', error as Error);
    }
  }

  /**
   * Update image metadata
   */
  async update(
    imageId: string,
    updateData: Partial<Pick<ImageEntity, 'description' | 'tags' | 'category' | 'isPrimary' | 'url' | 'cdnUrl' | 'thumbnailUrl'>>
  ): Promise<ImageEntity> {
    try {
      this.logger.debug('ImageRepository.update', { 
        imageId, 
        updateFields: Object.keys(updateData) 
      });

      // Find existing image
      const existingImage = await this.repository.findOne({
        where: { id: imageId, isDeleted: false }
      });

      if (!existingImage) {
        throw new ImageNotFoundError(imageId);
      }

      // Merge and save updates
      const updatedImage = this.repository.merge(existingImage, {
        ...updateData,
        updatedAt: new Date()
      });

      const savedImage = await this.repository.save(updatedImage);

      this.logger.info('Image updated successfully', {
        imageId,
        updatedFields: Object.keys(updateData)
      });

      return this.mapToEntity(savedImage);

    } catch (error) {
      this.logger.error('Failed to update image', { imageId, updateData, error });
      
      if (error instanceof ImageNotFoundError) {
        throw error;
      }
      throw new ImageDatabaseConnectionError('update', error as Error);
    }
  }

  /**
   * Soft delete image
   */
  async softDelete(imageId: string): Promise<void> {
    try {
      this.logger.debug('ImageRepository.softDelete', { imageId });

      const result = await this.repository.update(
        { id: imageId },
        { 
          isDeleted: true,
          deletedAt: new Date(),
          updatedAt: new Date()
        }
      );

      if (result.affected === 0) {
        throw new ImageNotFoundError(imageId);
      }

      this.logger.info('Image soft deleted successfully', { imageId });

    } catch (error) {
      this.logger.error('Failed to soft delete image', { imageId, error });
      
      if (error instanceof ImageNotFoundError) {
        throw error;
      }
      throw new ImageDatabaseConnectionError('softDelete', error as Error);
    }
  }

  /**
   * Hard delete image (admin only)
   */
  async hardDelete(imageId: string): Promise<void> {
    try {
      this.logger.warn('ImageRepository.hardDelete - ADMIN OPERATION', { imageId });

      const result = await this.repository.delete({ id: imageId });

      if (result.affected === 0) {
        throw new ImageNotFoundError(imageId);
      }

      this.logger.warn('Image hard deleted successfully', { imageId });

    } catch (error) {
      this.logger.error('Failed to hard delete image', { imageId, error });
      
      if (error instanceof ImageNotFoundError) {
        throw error;
      }
      throw new ImageDatabaseConnectionError('hardDelete', error as Error);
    }
  }

  /**
   * Set image as primary for user
   */
  async setPrimaryImage(imageId: string, isPrimary: boolean): Promise<void> {
    try {
      const result = await this.repository.update(
        { id: imageId },
        { 
          isPrimary,
          updatedAt: new Date()
        }
      );

      if (result.affected === 0) {
        throw new ImageNotFoundError(imageId);
      }

      this.logger.info('Image primary status updated', { imageId, isPrimary });

    } catch (error) {
      this.logger.error('Failed to set primary image', { imageId, isPrimary, error });
      throw new ImageDatabaseConnectionError('setPrimaryImage', error as Error);
    }
  }

  /**
   * Unset all primary images for user
   */
  async unsetPrimaryImages(userId: number): Promise<void> {
    try {
      await this.repository.update(
        { userId, isPrimary: true },
        { 
          isPrimary: false,
          updatedAt: new Date()
        }
      );

      this.logger.debug('All primary images unset for user', { userId });

    } catch (error) {
      this.logger.error('Failed to unset primary images', { userId, error });
      throw new ImageDatabaseConnectionError('unsetPrimaryImages', error as Error);
    }
  }

  /**
   * Get user's primary image
   */
  async findUserPrimaryImage(userId: number): Promise<ImageEntity | null> {
    try {
      const image = await this.repository.findOne({
        where: { 
          userId,
          isPrimary: true,
          isDeleted: false 
        }
      });

      return image ? this.mapToEntity(image) : null;

    } catch (error) {
      this.logger.error('Failed to find user primary image', { userId, error });
      throw new ImageDatabaseConnectionError('findUserPrimaryImage', error as Error);
    }
  }

  /**
   * Get user's image statistics
   */
  async getUserImageStats(userId: number): Promise<{
    totalFiles: number;
    totalSize: number;
    byCategory: Record<string, number>;
    recentUploads: number;
    primaryImageId?: string;
    oldestImage?: Date;
    newestImage?: Date;
  }> {
    try {
      this.logger.debug('ImageRepository.getUserImageStats', { userId });

      // Get basic counts and totals
      const basicStats = await this.repository
        .createQueryBuilder('image')
        .select([
          'COUNT(*) as totalFiles',
          'COALESCE(SUM(image.size), 0) as totalSize',
          'MIN(image.uploadedAt) as oldestImage',
          'MAX(image.uploadedAt) as newestImage'
        ])
        .where('image.userId = :userId AND image.isDeleted = false', { userId })
        .getRawOne();

      // Get category breakdown
      const categoryStats = await this.repository
        .createQueryBuilder('image')
        .select(['image.category', 'COUNT(*) as count'])
        .where('image.userId = :userId AND image.isDeleted = false', { userId })
        .groupBy('image.category')
        .getRawMany();

      // Get recent uploads (last 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const recentCount = await this.repository.count({
        where: {
          userId,
          isDeleted: false,
          uploadedAt: { $gte: thirtyDaysAgo } as any
        }
      });

      // Get primary image ID
      const primaryImage = await this.findUserPrimaryImage(userId);

      // Format category breakdown
      const byCategory: Record<string, number> = {};
      categoryStats.forEach(stat => {
        byCategory[stat.category] = parseInt(stat.count);
      });

      const stats = {
        totalFiles: parseInt(basicStats.totalFiles),
        totalSize: parseInt(basicStats.totalSize),
        byCategory,
        recentUploads: recentCount,
        primaryImageId: primaryImage?.id,
        oldestImage: basicStats.oldestImage,
        newestImage: basicStats.newestImage
      };

      this.logger.debug('User image stats calculated', { userId, stats });

      return stats;

    } catch (error) {
      this.logger.error('Failed to get user image stats', { userId, error });
      throw new ImageDatabaseConnectionError('getUserImageStats', error as Error);
    }
  }

  /**
   * Bulk soft delete multiple images
   */
  async bulkSoftDelete(imageIds: string[], userId: number): Promise<string[]> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      this.logger.info('ImageRepository.bulkSoftDelete initiated', {
        userId,
        imageCount: imageIds.length
      });

      const deletedIds: string[] = [];

      for (const imageId of imageIds) {
        const result = await queryRunner.manager.update(UserImage, 
          { id: imageId, userId }, // Ensure ownership
          { 
            isDeleted: true,
            deletedAt: new Date(),
            updatedAt: new Date()
          }
        );

        if (result.affected && result.affected > 0) {
          deletedIds.push(imageId);
        }
      }

      await queryRunner.commitTransaction();

      this.logger.info('Bulk soft delete completed', {
        userId,
        requested: imageIds.length,
        deleted: deletedIds.length
      });

      return deletedIds;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Bulk soft delete failed', { userId, imageIds, error });
      throw new ImageDatabaseConnectionError('bulkSoftDelete', error as Error);
    } finally {
      await queryRunner.release();
    }
  }

  // Stub implementations for remaining interface methods
  async findByStorageKeys(storageKeys: string[]): Promise<ImageEntity[]> {
    // Implementation for finding by storage keys
    throw new Error('Method not implemented');
  }

  async findOrphanedImages(olderThan: Date): Promise<ImageEntity[]> {
    // Implementation for finding orphaned images
    throw new Error('Method not implemented');
  }

  async bulkUpdate(updates: Array<{ imageId: string; updateData: Partial<ImageEntity> }>): Promise<ImageEntity[]> {
    // Implementation for bulk updates
    throw new Error('Method not implemented');
  }

  async findUserImagesByCategory(userId: number, category: ImageCategory, limit?: number): Promise<ImageEntity[]> {
    // Implementation for finding by category
    throw new Error('Method not implemented');
  }

  async countUserImages(userId: number): Promise<any> {
    // Implementation for counting images
    throw new Error('Method not implemented');
  }

  async findRecentUploads(limit: number, hours: number): Promise<ImageEntity[]> {
    // Implementation for recent uploads
    throw new Error('Method not implemented');
  }

  async getGlobalImageStats(): Promise<any> {
    // Implementation for global stats
    throw new Error('Method not implemented');
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.repository.query('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }

  async cleanupDeletedImages(olderThan: Date): Promise<number> {
    // Implementation for cleanup
    throw new Error('Method not implemented');
  }

  // Private helper methods
  private mapToEntity(userImage: UserImage): ImageEntity {
    return {
      id: userImage.id,
      userId: userImage.userId,
      storageKey: userImage.storageKey,
      originalName: userImage.originalName,
      fileName: userImage.fileName,
      size: userImage.size,
      contentType: userImage.contentType,
      category: userImage.category as ImageCategory,
      description: userImage.description || undefined,
      tags: userImage.tags || [],
      isPrimary: userImage.isPrimary,
      url: userImage.url,
      cdnUrl: userImage.cdnUrl || undefined,
      thumbnailUrl: userImage.thumbnailUrl || undefined,
      metadata: userImage.metadata || undefined,
      uploadedAt: userImage.uploadedAt,
      updatedAt: userImage.updatedAt,
      isDeleted: userImage.isDeleted,
      deletedAt: userImage.deletedAt || undefined
    };
  }
}