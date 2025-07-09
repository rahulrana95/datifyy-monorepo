// src/modules/imageUpload/repositories/IImageRepository.ts

import { ImageCategory } from '../dtos/ImageUploadDtos';

/**
 * Image Entity Interface (matches database schema)
 */
export interface ImageEntity {
  id: string; // UUID
  userId: number;
  storageKey: string; // Storage provider key/path
  originalName: string;
  fileName: string; // Safe storage filename
  size: number; // File size in bytes
  contentType: string; // MIME type
  category: ImageCategory;
  description?: string;
  tags: string[];
  isPrimary: boolean;
  url: string; // Public access URL
  cdnUrl?: string; // CDN URL if available
  thumbnailUrl?: string; // Thumbnail URL
  metadata?: Record<string, any>; // Additional metadata from storage
  uploadedAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deletedAt?: Date;
}

/**
 * Image Repository Interface
 * 
 * Defines the contract for image data access operations.
 * Following the same patterns as your UserProfileRepository interface.
 */
export interface IImageRepository {
  /**
   * Create a new image record
   * 
   * @param imageData - Image creation data
   * @returns Promise<ImageEntity> - Created image entity
   */
  create(imageData: Omit<ImageEntity, 'id' | 'updatedAt'>): Promise<ImageEntity>;

  /**
   * Find image by ID
   * 
   * @param imageId - Image UUID
   * @returns Promise<ImageEntity | null> - Image entity or null if not found
   */
  findById(imageId: string): Promise<ImageEntity | null>;

  /**
   * Find image by ID and user ID (for ownership verification)
   * 
   * @param imageId - Image UUID
   * @param userId - User ID for ownership check
   * @returns Promise<ImageEntity | null> - Image entity or null if not found/no access
   */
  findByIdAndUserId(imageId: string, userId: number): Promise<ImageEntity | null>;

  /**
   * Find user's images with pagination and filtering
   * 
   * @param userId - User ID
   * @param options - Query options
   * @returns Promise<{ images: ImageEntity[]; total: number }> - Paginated results
   */
  findUserImages(
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
  ): Promise<{
    images: ImageEntity[];
    total: number;
  }>;

  /**
   * Update image metadata
   * 
   * @param imageId - Image UUID
   * @param updateData - Fields to update
   * @returns Promise<ImageEntity> - Updated image entity
   */
  update(
    imageId: string,
    updateData: Partial<Pick<ImageEntity, 'description' | 'tags' | 'category' | 'isPrimary' | 'url' | 'cdnUrl' | 'thumbnailUrl'>>
  ): Promise<ImageEntity>;

  /**
   * Soft delete image
   * 
   * @param imageId - Image UUID
   * @returns Promise<void>
   */
  softDelete(imageId: string): Promise<void>;

  /**
   * Hard delete image (admin only)
   * 
   * @param imageId - Image UUID
   * @returns Promise<void>
   */
  hardDelete(imageId: string): Promise<void>;

  /**
   * Set image as primary for user
   * 
   * @param imageId - Image UUID
   * @param isPrimary - Primary status
   * @returns Promise<void>
   */
  setPrimaryImage(imageId: string, isPrimary: boolean): Promise<void>;

  /**
   * Unset all primary images for user (before setting new primary)
   * 
   * @param userId - User ID
   * @returns Promise<void>
   */
  unsetPrimaryImages(userId: number): Promise<void>;

  /**
   * Get user's primary image
   * 
   * @param userId - User ID
   * @returns Promise<ImageEntity | null> - Primary image or null
   */
  findUserPrimaryImage(userId: number): Promise<ImageEntity | null>;

  /**
   * Get user's image statistics
   * 
   * @param userId - User ID
   * @returns Promise<ImageStats> - User's image usage statistics
   */
  getUserImageStats(userId: number): Promise<{
    totalFiles: number;
    totalSize: number;
    byCategory: Record<string, number>;
    recentUploads: number; // Last 30 days
    primaryImageId?: string;
    oldestImage?: Date;
    newestImage?: Date;
  }>;

  /**
   * Find images by storage keys (for cleanup operations)
   * 
   * @param storageKeys - Array of storage keys
   * @returns Promise<ImageEntity[]> - Images with matching storage keys
   */
  findByStorageKeys(storageKeys: string[]): Promise<ImageEntity[]>;

  /**
   * Find orphaned images (uploaded but not confirmed)
   * 
   * @param olderThan - Find images older than this date
   * @returns Promise<ImageEntity[]> - Orphaned images
   */
  findOrphanedImages(olderThan: Date): Promise<ImageEntity[]>;

  /**
   * Bulk update multiple images
   * 
   * @param updates - Array of image updates
   * @returns Promise<ImageEntity[]> - Updated images
   */
  bulkUpdate(updates: Array<{
    imageId: string;
    updateData: Partial<ImageEntity>;
  }>): Promise<ImageEntity[]>;

  /**
   * Bulk soft delete multiple images
   * 
   * @param imageIds - Array of image UUIDs
   * @param userId - User ID for ownership verification
   * @returns Promise<string[]> - Successfully deleted image IDs
   */
  bulkSoftDelete(imageIds: string[], userId: number): Promise<string[]>;

  /**
   * Find images by category for user
   * 
   * @param userId - User ID
   * @param category - Image category
   * @param limit - Maximum number of images to return
   * @returns Promise<ImageEntity[]> - Images in category
   */
  findUserImagesByCategory(
    userId: number,
    category: ImageCategory,
    limit?: number
  ): Promise<ImageEntity[]>;

  /**
   * Count user's images by status
   * 
   * @param userId - User ID
   * @returns Promise<ImageCounts> - Count breakdown
   */
  countUserImages(userId: number): Promise<{
    total: number;
    active: number;
    deleted: number;
    byCategory: Record<string, number>;
    primary: number;
  }>;

  /**
   * Find recently uploaded images across all users (admin)
   * 
   * @param limit - Maximum number of images
   * @param hours - Hours to look back
   * @returns Promise<ImageEntity[]> - Recent images
   */
  findRecentUploads(limit: number, hours: number): Promise<ImageEntity[]>;

  /**
   * Get global image statistics (admin)
   * 
   * @returns Promise<GlobalImageStats> - Platform-wide statistics
   */
  getGlobalImageStats(): Promise<{
    totalImages: number;
    totalSize: number;
    totalUsers: number;
    byCategory: Record<string, number>;
    uploadTrends: Array<{
      date: string;
      count: number;
      size: number;
    }>;
    topUsers: Array<{
      userId: number;
      imageCount: number;
      totalSize: number;
    }>;
  }>;

  /**
   * Health check for repository
   * 
   * @returns Promise<boolean> - Repository health status
   */
  healthCheck(): Promise<boolean>;

  /**
   * Clean up deleted images older than specified date
   * 
   * @param olderThan - Delete images deleted before this date
   * @returns Promise<number> - Number of images cleaned up
   */
  cleanupDeletedImages(olderThan: Date): Promise<number>;
}

/**
 * Repository Error Types
 */
export class ImageRepositoryError extends Error {
  constructor(
    message: string,
    public readonly operation: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'ImageRepositoryError';
  }
}

export class ImageNotFoundError extends ImageRepositoryError {
  constructor(imageId: string) {
    super(
      `Image not found: ${imageId}`,
      'find'
    );
    this.name = 'ImageNotFoundError';
  }
}

export class ImageAccessDeniedError extends ImageRepositoryError {
  constructor(imageId: string, userId: number) {
    super(
      `Access denied to image ${imageId} for user ${userId}`,
      'access'
    );
    this.name = 'ImageAccessDeniedError';
  }
}

export class ImageDuplicateError extends ImageRepositoryError {
  constructor(storageKey: string) {
    super(
      `Image with storage key ${storageKey} already exists`,
      'create'
    );
    this.name = 'ImageDuplicateError';
  }
}

export class ImageDatabaseConnectionError extends ImageRepositoryError {
  constructor(operation: string, cause?: Error) {
    super(
      `Database connection failed during ${operation}`,
      operation,
      cause
    );
    this.name = 'ImageDatabaseConnectionError';
  }
}

/**
 * Query Builder Interface for complex image queries
 */
export interface IImageQueryBuilder {
  /**
   * Add WHERE conditions
   */
  where(field: keyof ImageEntity, operator: string, value: any): IImageQueryBuilder;

  /**
   * Add OR conditions
   */
  orWhere(field: keyof ImageEntity, operator: string, value: any): IImageQueryBuilder;

  /**
   * Add search condition across multiple fields
   */
  search(query: string, fields: (keyof ImageEntity)[]): IImageQueryBuilder;

  /**
   * Add ORDER BY clause
   */
  orderBy(field: keyof ImageEntity, direction: 'ASC' | 'DESC'): IImageQueryBuilder;

  /**
   * Add LIMIT and OFFSET
   */
  paginate(page: number, limit: number): IImageQueryBuilder;

  /**
   * Include/exclude deleted images
   */
  includeDeleted(include: boolean): IImageQueryBuilder;

  /**
   * Filter by date range
   */
  dateRange(field: 'uploadedAt' | 'updatedAt' | 'deletedAt', from: Date, to: Date): IImageQueryBuilder;

  /**
   * Execute query and return results
   */
  execute(): Promise<ImageEntity[]>;

  /**
   * Execute query and return count
   */
  count(): Promise<number>;

  /**
   * Execute query and return first result
   */
  first(): Promise<ImageEntity | null>;
}

/**
 * Advanced Repository Interface for complex operations
 */
export interface IAdvancedImageRepository extends IImageRepository {
  /**
   * Get query builder for complex queries
   */
  createQueryBuilder(): IImageQueryBuilder;

  /**
   * Execute raw SQL query (admin only)
   */
  executeRaw(query: string, parameters?: any[]): Promise<any>;

  /**
   * Backup image metadata
   */
  backupImageData(imageId: string): Promise<string>; // Returns backup ID

  /**
   * Restore image from backup
   */
  restoreImageData(backupId: string): Promise<ImageEntity>;

  /**
   * Get database performance metrics
   */
  getPerformanceMetrics(): Promise<{
    avgQueryTime: number;
    slowQueries: Array<{ query: string; time: number }>;
    connectionPoolStatus: any;
  }>;
}