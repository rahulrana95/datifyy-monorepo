// services/nodejs-service/src/modules/imageUpload/services/ImageValidationService.ts

import { Logger } from '../../../infrastructure/logging/Logger';
import { IImageRepository } from '../repositories/IImageRepository';
import { ImageCategory } from '../dtos/ImageUploadDtos';
import {
  StorageError,
  StorageFileTooLargeError,
  StorageInvalidFileTypeError,
  FileValidationResult
} from '@datifyy/shared-types';
import {
  validateFile,
  FILE_VALIDATION_CONFIGS,
  formatFileSize,
  } from '@datifyy/shared-utils';

/**
 * Image Validation Service - Single Responsibility
 * 
 * Following Google's SRP principles:
 * - Only handles validation logic
 * - Reusable across different upload flows
 * - Comprehensive error reporting
 * - Performance optimized checks
 */
export class ImageValidationService {
  private readonly logger: Logger;

  constructor(
    private readonly imageRepository: IImageRepository,
    logger?: Logger
  ) {
    this.logger = logger || Logger.getInstance();
  }

  /**
   * Validate single file upload with business rules
   */
  async validateSingleFile(
    userId: number,
    file: Express.Multer.File,
    category: ImageCategory,
    correlationId: string
  ): Promise<FileValidationResult> {
    this.logger.debug('Validating single file upload', {
      correlationId,
      userId,
      fileName: file.originalname,
      fileSize: file.size,
      contentType: file.mimetype,
      category,
      operation: 'validateSingleFile'
    });

    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // 1. File format validation using shared utility
      const formatValidation = this.validateFileFormat(file, category);
      if (!formatValidation.isValid) {
        errors.push(...formatValidation.errors);
      }

      // 2. File size validation
      const sizeValidation = this.validateFileSize(file, category);
      if (!sizeValidation.isValid) {
        errors.push(...sizeValidation.errors);
      }

      // 3. User quota validation
      const quotaValidation = await this.validateUserQuota(userId, file.size, correlationId);
      if (!quotaValidation.isValid) {
        errors.push(...quotaValidation.errors);
      }

      // 4. File name validation
      const nameValidation = this.validateFileName(file.originalname);
      if (!nameValidation.isValid) {
        errors.push(...nameValidation.errors);
      }

      // 5. Security validation
      const securityValidation = await this.validateFileSecurity(file, correlationId);
      if (!securityValidation.isValid) {
        errors.push(...securityValidation.errors);
      }

      // Add performance warnings
      if (file.size > 5 * 1024 * 1024) { // 5MB
        warnings.push('Large file size may result in slower upload times');
      }

      const result: FileValidationResult = {
        isValid: errors.length === 0,
        errors,
        warnings,
        fileInfo: {
          size: file.size,
          type: file.mimetype,
          dimensions: await this.getImageDimensions(file)
        }
      };

      this.logger.debug('File validation completed', {
        correlationId,
        userId,
        fileName: file.originalname,
        isValid: result.isValid,
        errorCount: errors.length,
        warningCount: warnings.length,
        operation: 'validateSingleFile'
      });

      return result;

    } catch (error) {
      this.logger.error('File validation failed with exception', {
        correlationId,
        userId,
        fileName: file.originalname,
        error: error instanceof Error ? error.message : 'Unknown error',
        operation: 'validateSingleFile'
      });

      return {
        isValid: false,
        errors: ['Validation service error: ' + (error instanceof Error ? error.message : 'Unknown error')],
        warnings
      };
    }
  }

  /**
   * Validate batch upload constraints
   */
  async validateBatchUpload(
    userId: number,
    files: Express.Multer.File[],
    category: ImageCategory,
    maxFilesPerBatch: number,
    correlationId: string
  ): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
    fileResults: Array<{
      fileName: string;
      isValid: boolean;
      errors: string[];
    }>;
  }> {
    this.logger.debug('Validating batch upload', {
      correlationId,
      userId,
      fileCount: files.length,
      category,
      maxFilesPerBatch,
      operation: 'validateBatchUpload'
    });

    const errors: string[] = [];
    const warnings: string[] = [];
    const fileResults: Array<{ fileName: string; isValid: boolean; errors: string[] }> = [];

    // Global batch validation
    if (files.length > maxFilesPerBatch) {
      errors.push(`Too many files. Maximum ${maxFilesPerBatch} files allowed per batch`);
    }

    if (files.length === 0) {
      errors.push('No files provided for upload');
    }

    // Calculate total size
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const maxBatchSize = 100 * 1024 * 1024; // 100MB per batch
    
    if (totalSize > maxBatchSize) {
      errors.push(`Total batch size ${formatFileSize(totalSize)} exceeds limit ${formatFileSize(maxBatchSize)}`);
    }

    // Validate each file individually
    for (const file of files) {
      const fileValidation = await this.validateSingleFile(userId, file, category, correlationId);
      fileResults.push({
        fileName: file.originalname,
        isValid: fileValidation.isValid,
        errors: fileValidation.errors
      });

      if (fileValidation.warnings) {
        warnings.push(...fileValidation.warnings);
      }
    }

    // Check for duplicate names
    const fileNames = files.map(f => f.originalname);
    const duplicates = fileNames.filter((name, index) => fileNames.indexOf(name) !== index);
    if (duplicates.length > 0) {
      warnings.push(`Duplicate file names detected: ${duplicates.join(', ')}`);
    }

    const allFilesValid = fileResults.every(result => result.isValid);
    const isValid = errors.length === 0 && allFilesValid;

    this.logger.debug('Batch validation completed', {
      correlationId,
      userId,
      fileCount: files.length,
      isValid,
      globalErrors: errors.length,
      invalidFiles: fileResults.filter(r => !r.isValid).length,
      operation: 'validateBatchUpload'
    });

    return {
      isValid,
      errors,
      warnings,
      fileResults
    };
  }

  /**
   * Validate user's total storage quota
   */
  async validateUserQuota(
    userId: number,
    additionalSize: number,
    correlationId: string
  ): Promise<{ isValid: boolean; errors: string[] }> {
    try {
      // Get user's current storage usage
      const userStats = await this.imageRepository.getUserImageStats(userId);
      
      // Configuration - could be moved to a config service
      const maxTotalFiles = 50;
      const maxTotalSize = 500 * 1024 * 1024; // 500MB

      const errors: string[] = [];

      // Check file count limit
      if (userStats.totalFiles >= maxTotalFiles) {
        errors.push(`Maximum number of files exceeded. Limit: ${maxTotalFiles}, Current: ${userStats.totalFiles}`);
      }

      // Check storage size limit
      const newTotalSize = userStats.totalSize + additionalSize;
      if (newTotalSize > maxTotalSize) {
        errors.push(
          `Storage quota exceeded. Limit: ${formatFileSize(maxTotalSize)}, ` +
          `Current: ${formatFileSize(userStats.totalSize)}, ` +
          `Requested: ${formatFileSize(additionalSize)}`
        );
      }

      return {
        isValid: errors.length === 0,
        errors
      };

    } catch (error) {
      this.logger.error('Quota validation failed', {
        correlationId,
        userId,
        additionalSize,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      return {
        isValid: false,
        errors: ['Unable to check storage quota']
      };
    }
  }

  /**
   * Validate file format and type
   */
  private validateFileFormat(
    file: Express.Multer.File,
    category: ImageCategory
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Get validation config for category
    const validationConfig = FILE_VALIDATION_CONFIGS[
      category.toUpperCase() as keyof typeof FILE_VALIDATION_CONFIGS
    ] || FILE_VALIDATION_CONFIGS.PROFILE_IMAGE;

    // Use shared validation utility
    const validation = validateFile({
      name: file.originalname,
      size: file.size,
      type: file.mimetype
       // @ts-ignore
    }, validationConfig);

    if (!validation.isValid) {
      errors.push(...validation.errors);
    }

    // Additional MIME type validation
    // @ts-ignore
    if (!validationConfig.allowedMimeTypes?.includes(file.mimetype)) {
      errors.push(
        `File type '${file.mimetype}' not allowed. ` +
        `Allowed types: ${validationConfig.allowedMimeTypes?.join(', ')}`
      );
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validate file size against category limits
   */
  private validateFileSize(
    file: Express.Multer.File,
    category: ImageCategory
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Category-specific size limits
    const sizeLimits = {
      [ImageCategory.PROFILE]: 10 * 1024 * 1024, // 10MB
      [ImageCategory.GALLERY]: 15 * 1024 * 1024, // 15MB
      [ImageCategory.EVENT]: 20 * 1024 * 1024,   // 20MB
      [ImageCategory.DOCUMENT]: 25 * 1024 * 1024 // 25MB
    };

    const maxSize = sizeLimits[category] || sizeLimits[ImageCategory.PROFILE];

    if (file.size > maxSize) {
      errors.push(
        `File size ${formatFileSize(file.size)} exceeds maximum ` +
        `${formatFileSize(maxSize)} for ${category} images`
      );
    }

    if (file.size === 0) {
      errors.push('File appears to be empty');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validate file name for security and compatibility
   */
  private validateFileName(fileName: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!fileName || fileName.trim().length === 0) {
      errors.push('File name cannot be empty');
    }

    if (fileName.length > 255) {
      errors.push('File name too long (maximum 255 characters)');
    }

    // Check for dangerous characters
    const dangerousChars = /[<>:"/\\|?*\x00-\x1f]/;
    if (dangerousChars.test(fileName)) {
      errors.push('File name contains invalid characters');
    }

    // Check for reserved names (Windows compatibility)
    const reservedNames = ['CON', 'PRN', 'AUX', 'NUL'];
    const nameWithoutExt = fileName.split('.')[0].toUpperCase();
    if (reservedNames.includes(nameWithoutExt)) {
      errors.push('File name is reserved and cannot be used');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validate file for security threats
   */
  private async validateFileSecurity(
    file: Express.Multer.File,
    correlationId: string
  ): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    try {
      // Check file header matches MIME type (basic security check)
      if (file.mimetype.startsWith('image/')) {
        const header = file.buffer?.slice(0, 16);
        if (header && !this.isValidImageHeader(header, file.mimetype)) {
          errors.push('File content does not match declared image type');
        }
      }

      // Check for executable disguised as image
      if (this.hasExecutableSignature(file.buffer?.slice(0, 16))) {
        errors.push('File appears to contain executable content');
      }

    } catch (error) {
      this.logger.error('Security validation failed', {
        correlationId,
        fileName: file.originalname,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      errors.push('Unable to complete security validation');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Get image dimensions if available
   */
  private async getImageDimensions(
    file: Express.Multer.File
  ): Promise<{ width: number; height: number } | undefined> {
    if (!file.mimetype.startsWith('image/') || !file.buffer) {
      return undefined;
    }

    try {
      // This would use sharp library for actual implementation
      // For now, return undefined to avoid dependency
      return undefined;
    } catch {
      return undefined;
    }
  }

  /**
   * Validate image file header
   */
  private isValidImageHeader(header: Buffer, mimeType: string): boolean {
    const signatures = {
      'image/jpeg': [0xFF, 0xD8, 0xFF],
      'image/png': [0x89, 0x50, 0x4E, 0x47],
      'image/gif': [0x47, 0x49, 0x46],
      'image/webp': [0x52, 0x49, 0x46, 0x46]
    };

    const expectedSignature = signatures[mimeType as keyof typeof signatures];
    if (!expectedSignature) return true; // Unknown type, skip validation

    return expectedSignature.every((byte, index) => header[index] === byte);
  }

  /**
   * Check for executable file signatures
   */
  private hasExecutableSignature(header?: Buffer): boolean {
    if (!header || header.length < 4) return false;

    const executableSignatures = [
      [0x4D, 0x5A], // PE executable
      [0x7F, 0x45, 0x4C, 0x46], // ELF executable
      [0xCF, 0xFA, 0xED, 0xFE], // Mach-O executable
    ];

    return executableSignatures.some(signature =>
      signature.every((byte, index) => header[index] === byte)
    );
  }
}