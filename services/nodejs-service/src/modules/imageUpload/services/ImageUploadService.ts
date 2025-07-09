// src/modules/imageUpload/services/IImageUploadService.ts

import {
  SingleImageUploadRequestDto,
  BulkImageUploadRequestDto,
  ImageUploadResponseDto,
  BulkUploadResponseDto,
  ImageListResponseDto,
  ImageCategory
} from '../dtos/ImageUploadDtos';

/**
 * Simple Image Upload Service Interface
 * Keep it minimal and focused
 */
export interface IImageUploadService {
  /**
   * Upload single image
   */
  uploadSingleImage(
    userId: number,
    uploadData: SingleImageUploadRequestDto,
    requestId: string
  ): Promise<ImageUploadResponseDto>;

  /**
   * Upload multiple images
   */
  uploadBulkImages(
    userId: number,
    uploadData: BulkImageUploadRequestDto,
    requestId: string
  ): Promise<BulkUploadResponseDto>;

  /**
   * Get user's images with pagination
   */
  getUserImages(
    userId: number,
    options: {
      page?: number;
      limit?: number;
      category?: string;
      search?: string;
    },
    requestId: string
  ): Promise<ImageListResponseDto>;

  /**
   * Delete user's image
   */
  deleteUserImage(
    userId: number,
    imageId: string,
    requestId: string
  ): Promise<void>;

  /**
   * Get image by ID
   */
  getImageById(
    userId: number,
    imageId: string,
    requestId: string
  ): Promise<ImageUploadResponseDto>;

  /**
   * Set image as primary
   */
  setPrimaryImage(
    userId: number,
    imageId: string,
    requestId: string
  ): Promise<ImageUploadResponseDto>;
}

/**
 * Simple configuration interface
 */
export interface ImageUploadConfig {
  maxFileSize: number;
  maxFilesPerUpload: number;
  maxTotalFiles: number;
  maxTotalSize: number;
  allowedMimeTypes: string[];
}