// src/modules/imageUpload/mapper/ImageMapper.ts

import { ImageEntity } from '../repositories/IImageRepository';
import { ImageUploadResponseDto } from '../dtos/ImageUploadDtos';
import { Logger } from '../../../infrastructure/logging/Logger';

/**
 * Simple Image Mapper - Single Responsibility
 * Transforms between entities and DTOs
 */
export class ImageMapper {
  private readonly logger: Logger;

  constructor(logger?: Logger) {
    this.logger = logger || Logger.getInstance();
  }

  /**
   * Transform entity to response DTO
   */
  toResponseDto(entity: ImageEntity): ImageUploadResponseDto {
    try {
      return {
        id: entity.id,
        key: entity.storageKey,
        url: entity.url,
        cdnUrl: entity.cdnUrl,
        thumbnailUrl: entity.thumbnailUrl,
        originalName: entity.originalName,
        size: entity.size,
        contentType: entity.contentType,
        category: entity.category,
        description: entity.description,
        tags: entity.tags || [],
        isPrimary: entity.isPrimary,
        uploadedAt: entity.uploadedAt.toISOString(),
        metadata: entity.metadata
      };
    } catch (error) {
      this.logger.error('Failed to map entity to DTO', {
        entityId: entity.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      // Fallback response
      return {
        id: entity.id,
        key: entity.storageKey,
        url: entity.url,
        originalName: entity.originalName,
        size: entity.size,
        contentType: entity.contentType,
        category: entity.category,
        tags: [],
        isPrimary: entity.isPrimary,
        uploadedAt: entity.uploadedAt.toISOString()
      };
    }
  }

  /**
   * Transform multiple entities to DTOs
   */
  toResponseDtos(entities: ImageEntity[]): ImageUploadResponseDto[] {
    return entities.map(entity => this.toResponseDto(entity));
  }

  /**
   * Create safe filename for storage
   */
  createSafeFileName(originalName: string, category: string): string {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const extension = this.getFileExtension(originalName);
    const safeName = this.sanitizeFileName(originalName);
    
    return `${category}_${safeName}_${timestamp}_${randomSuffix}${extension}`;
  }

  /**
   * Get file extension from filename
   */
  private getFileExtension(fileName: string): string {
    const lastDot = fileName.lastIndexOf('.');
    return lastDot === -1 ? '' : fileName.substring(lastDot);
  }

  /**
   * Sanitize filename for storage
   */
  private sanitizeFileName(fileName: string): string {
    const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
    return nameWithoutExt
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .substring(0, 50)
      .toLowerCase();
  }
}