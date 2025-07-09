// src/modules/imageUpload/dtos/ImageUploadDtos.ts

import { 
  IsString, 
  IsOptional, 
  IsArray, 
  IsBoolean, 
  IsEnum,
  IsNumber,
  Min,
  Max,
  MaxLength,
  ArrayMaxSize,
  IsUUID
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

// Import multer types
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination?: string;
  filename?: string;
  path?: string;
  buffer?: Buffer;
}

/**
 * Image Categories Enum
 */
export enum ImageCategory {
  PROFILE = 'profile',
  GALLERY = 'gallery',
  EVENT = 'event',
  DOCUMENT = 'document'
}

/**
 * Single Image Upload Request DTO
 */
export class SingleImageUploadRequestDto {
  // File will be added by multer middleware
  file: MulterFile;

  @IsOptional()
  @IsEnum(ImageCategory, { 
    message: 'Category must be profile, gallery, event, or document' 
  })
  category?: ImageCategory = ImageCategory.PROFILE;

  @IsOptional()
  @IsBoolean({ message: 'isPrimary must be a boolean' })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return Boolean(value);
  })
  isPrimary?: boolean = false;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(200, { message: 'Description cannot exceed 200 characters' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  description?: string;

  @IsOptional()
  @IsArray({ message: 'Tags must be an array' })
  @ArrayMaxSize(10, { message: 'Maximum 10 tags allowed' })
  @IsString({ each: true, message: 'Each tag must be a string' })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return [value];
      }
    }
    return value;
  })
  tags?: string[];
}

/**
 * Bulk Image Upload Request DTO
 */
export class BulkImageUploadRequestDto {
  // Files will be added by multer middleware
  files: MulterFile[];

  @IsOptional()
  @IsEnum(ImageCategory, { 
    message: 'Category must be profile, gallery, event, or document' 
  })
  category?: ImageCategory = ImageCategory.PROFILE;

  @IsOptional()
  @IsBoolean({ message: 'replaceExisting must be a boolean' })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return Boolean(value);
  })
  replaceExisting?: boolean = false;

  @IsOptional()
  @IsArray({ message: 'Descriptions must be an array' })
  @IsString({ each: true, message: 'Each description must be a string' })
  @ArrayMaxSize(20, { message: 'Maximum 20 descriptions allowed' })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    }
    return value || [];
  })
  descriptions?: string[];

  @IsOptional()
  @IsArray({ message: 'Tags must be an array' })
  @IsString({ each: true, message: 'Each tag must be a string' })
  @ArrayMaxSize(10, { message: 'Maximum 10 tags allowed' })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    }
    return value || [];
  })
  tags?: string[];
}

/**
 * Image List Query DTO
 */
export class ImageListQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Page must be a number' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Limit must be a number' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  limit?: number = 20;

  @IsOptional()
  @IsEnum(ImageCategory, { 
    message: 'Category must be profile, gallery, event, or document' 
  })
  category?: ImageCategory;

  @IsOptional()
  @IsString({ message: 'Search query must be a string' })
  @MaxLength(100, { message: 'Search query cannot exceed 100 characters' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  search?: string;
}

/**
 * Image Delete Request DTO
 */
export class ImageDeleteRequestDto {
  @IsUUID(4, { message: 'Image ID must be a valid UUID' })
  imageId: string;

  @IsOptional()
  @IsBoolean({ message: 'Permanent delete flag must be a boolean' })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return Boolean(value);
  })
  permanent?: boolean = false;
}

/**
 * Image Update Request DTO
 */
export class ImageUpdateRequestDto {
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(200, { message: 'Description cannot exceed 200 characters' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  description?: string;

  @IsOptional()
  @IsArray({ message: 'Tags must be an array' })
  @ArrayMaxSize(10, { message: 'Maximum 10 tags allowed' })
  @IsString({ each: true, message: 'Each tag must be a string' })
  tags?: string[];

  @IsOptional()
  @IsBoolean({ message: 'isPrimary must be a boolean' })
  isPrimary?: boolean;

  @IsOptional()
  @IsEnum(ImageCategory, { 
    message: 'Category must be profile, gallery, event, or document' 
  })
  category?: ImageCategory;
}

/**
 * Response DTOs
 */
export interface ImageUploadResponseDto {
  id: string;
  key: string;
  url: string;
  cdnUrl?: string;
  thumbnailUrl?: string;
  originalName: string;
  size: number;
  contentType: string;
  category: ImageCategory;
  description?: string;
  tags?: string[];
  isPrimary: boolean;
  uploadedAt: string;
  metadata?: Record<string, string>;
}

export interface BulkUploadResponseDto {
  successful: ImageUploadResponseDto[];
  failed: Array<{
    fileName: string;
    error: string;
    size?: number;
  }>;
  summary: {
    total: number;
    successful: number;
    failed: number;
    totalSize: number;
    processingTime: number;
  };
}

export interface ImageListResponseDto {
  images: ImageUploadResponseDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  filters?: {
    category?: ImageCategory;
    search?: string;
  };
}

/**
 * Validation middleware factory
 */
export function validateImageUploadDto<T extends object>(DtoClass: new () => T) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Transform and validate request body
      const dto = plainToClass(DtoClass, req.body);
      
      const errors = await validate(dto as any, {
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        skipMissingProperties: false
      });

      if (errors.length > 0) {
        const formattedErrors = formatValidationErrors(errors);
        
        res.status(400).json({
          success: false,
          error: {
            message: 'Request validation failed',
            code: 'VALIDATION_ERROR',
            details: formattedErrors,
            timestamp: new Date().toISOString(),
            requestId: (req as any).id
          }
        });
        return;
      }

      // Attach validated data to request
      req.body = dto;
      next();

    } catch (error) {
      next(error);
    }
  };
}


/**
 * File validation middleware (works with multer)
 */
export function validateImageFiles(options?: {
  maxFiles?: number;
  maxSize?: number;
  allowedTypes?: string[];
}) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { maxFiles = 10, maxSize = 10 * 1024 * 1024, allowedTypes = [
        'image/jpeg', 'image/png', 'image/webp', 'image/gif'
      ] } = options || {};

        // Check single file
        // @ts-ignore
        if (req.file) {
          // @ts-ignore
        const fileValidation = validateSingleFile(req.file, { maxSize, allowedTypes });
        if (!fileValidation.isValid) {
          res.status(400).json({
            success: false,
            error: {
              message: 'File validation failed',
              code: 'FILE_VALIDATION_ERROR',
              details: fileValidation.errors,
              timestamp: new Date().toISOString(),
              requestId: (req as any).id
            }
          });
          return;
        }
      }

        // Check multiple files
         // @ts-ignore
        if (req.files && Array.isArray(req.files)) {
           // @ts-ignore
        if (req.files.length > maxFiles) {
          res.status(400).json({
            success: false,
            error: {
              message: `Too many files. Maximum ${maxFiles} files allowed`,
              code: 'TOO_MANY_FILES',
              timestamp: new Date().toISOString(),
              requestId: (req as any).id
            }
          });
          return;
        }
 // @ts-ignore
        for (const file of req.files) {
          const fileValidation = validateSingleFile(file, { maxSize, allowedTypes });
          if (!fileValidation.isValid) {
            res.status(400).json({
              success: false,
              error: {
                message: `File validation failed for ${file.originalname}`,
                code: 'FILE_VALIDATION_ERROR',
                details: fileValidation.errors,
                timestamp: new Date().toISOString(),
                requestId: (req as any).id
              }
            });
            return;
          }
        }
      }

      next();

    } catch (error) {
      next(error);
    }
  };
}

/**
 * Helper function to validate a single file
 */
function validateSingleFile(
  file: MulterFile,
  options: { maxSize: number; allowedTypes: string[] }
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Size validation
  if (file.size > options.maxSize) {
    errors.push(`File size ${formatBytes(file.size)} exceeds maximum ${formatBytes(options.maxSize)}`);
  }

  // Type validation
  if (!options.allowedTypes.includes(file.mimetype)) {
    errors.push(`File type '${file.mimetype}' not allowed. Allowed types: ${options.allowedTypes.join(', ')}`);
  }

  // File name validation
  if (!file.originalname || file.originalname.trim().length === 0) {
    errors.push('File name cannot be empty');
  }

  if (file.originalname.length > 255) {
    errors.push('File name too long (maximum 255 characters)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Format validation errors for consistent error response
 */
function formatValidationErrors(errors: ValidationError[]): any[] {
  return errors.map(error => ({
    field: error.property,
    value: error.value,
    constraints: Object.values(error.constraints || {}),
    children: error.children && error.children.length > 0 
      ? formatValidationErrors(error.children) 
      : undefined
  }));
}

/**
 * Format bytes to human readable string
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Export validation middleware functions
export const validateSingleImageUpload = validateImageUploadDto(SingleImageUploadRequestDto);
export const validateBulkImageUpload = validateImageUploadDto(BulkImageUploadRequestDto);
export const validateImageListQuery = validateImageUploadDto(ImageListQueryDto);
export const validateImageUpdate = validateImageUploadDto(ImageUpdateRequestDto);

// Export file validation middleware with different configurations
export const validateProfileImages = validateImageFiles({
  maxFiles: 6,
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
});

export const validateGalleryImages = validateImageFiles({
  maxFiles: 20,
  maxSize: 15 * 1024 * 1024, // 15MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
});

export const validateDocumentImages = validateImageFiles({
  maxFiles: 5,
  maxSize: 25 * 1024 * 1024, // 25MB
  allowedTypes: ['image/jpeg', 'image/png', 'application/pdf']
});