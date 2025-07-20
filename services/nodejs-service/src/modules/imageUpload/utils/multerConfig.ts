// src/modules/imageUpload/utils/multerConfig.ts
/**
 * Multer Configuration - Simple & Clean
 * 
 * Single responsibility: Configure file upload middleware
 * ✅ Simple, reusable multer configs
 * ✅ Type-safe configuration
 * ✅ Clear error messages
 * ✅ No over-engineering
 */

import multer from 'multer';
import { Request } from 'express';
import { 
  UPLOAD_CONFIGS, 
  FILE_SIZE_LIMITS,
  ALLOWED_MIME_TYPES,
  ERROR_MESSAGES,
  ImageUploadHelpers
} from '../constants/imageUploadConstants';

/**
 * Configuration options for multer
 */
interface MulterConfigOptions {
  maxFileSize?: number;
  maxFiles?: number;
  allowedMimeTypes?: string[];
  fieldName?: string;
}

/**
 * Create multer configuration for different upload types
 */
export function createMulterConfig(options: MulterConfigOptions = {}) {
  return multer({
    storage: multer.memoryStorage(), // Store in memory for processing
    
    limits: {
      fileSize: options.maxFileSize || FILE_SIZE_LIMITS.PROFILE_IMAGE,
      files: options.maxFiles || 1,
      fieldSize: 1024 * 1024, // 1MB for other form fields
      fieldNameSize: 100,      // Field name length
      fields: 10               // Max number of non-file fields
    },
    
    fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
      const allowedTypes = options.allowedMimeTypes || ALLOWED_MIME_TYPES.IMAGES;
      
        // Check MIME type
        // @ts-ignore
      if (!allowedTypes.includes(file.mimetype)) {
        const error = new Error(ERROR_MESSAGES.INVALID_FILE_TYPE) as any;
        error.code = 'INVALID_FILE_TYPE';
        error.field = file.fieldname;
        error.mimeType = file.mimetype;
        error.allowedTypes = allowedTypes;
        return cb(error);
      }
      
      // Check file extension
      const fileExtension = ImageUploadHelpers.getFileExtension(file.originalname);
      const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.pdf'];
      
      if (!validExtensions.includes(fileExtension)) {
        const error = new Error('Invalid file extension') as any;
        error.code = 'INVALID_EXTENSION';
        error.field = file.fieldname;
        error.extension = fileExtension;
        return cb(error);
      }
      
      cb(null, true);
    }
  });
}

/**
 * Pre-configured multer instances for common use cases
 */
export const MulterConfigs = {
  
  /**
   * Single profile image upload
   */
  profileImage: () => createMulterConfig({
    maxFileSize: UPLOAD_CONFIGS.PROFILE.maxFileSize,
      maxFiles: 1,
     // @ts-ignore
    allowedMimeTypes: UPLOAD_CONFIGS.PROFILE.allowedMimeTypes,
    fieldName: 'image'
  }).single('image'),
  
  /**
   * Multiple gallery images upload
   */
  galleryImages: () => createMulterConfig({
    maxFileSize: UPLOAD_CONFIGS.GALLERY.maxFileSize,
      maxFiles: UPLOAD_CONFIGS.GALLERY.maxFiles,
     // @ts-ignore
    allowedMimeTypes: UPLOAD_CONFIGS.GALLERY.allowedMimeTypes,
    fieldName: 'images'
  }).array('images', UPLOAD_CONFIGS.GALLERY.maxFiles),
  
  /**
   * Single document upload
   */
  document: () => createMulterConfig({
    maxFileSize: UPLOAD_CONFIGS.DOCUMENT.maxFileSize,
      maxFiles: 1,
     // @ts-ignore
    allowedMimeTypes: UPLOAD_CONFIGS.DOCUMENT.allowedMimeTypes,
    fieldName: 'document'
  }).single('document'),
  
  /**
   * Flexible upload for any file type
   */
  anyFile: (maxSize?: number) => createMulterConfig({
    maxFileSize: maxSize || FILE_SIZE_LIMITS.GALLERY_IMAGE,
      maxFiles: 1,
     // @ts-ignore
    allowedMimeTypes: ALLOWED_MIME_TYPES.IMAGES,
    fieldName: 'file'
  }).single('file')
};

/**
 * Multer error handler middleware
 */
export function handleMulterError(error: any, req: Request, res: any, next: any) {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          error: {
            code: 'FILE_TOO_LARGE',
            message: ERROR_MESSAGES.FILE_TOO_LARGE,
            maxSize: ImageUploadHelpers.formatFileSize(FILE_SIZE_LIMITS.PROFILE_IMAGE)
          }
        });
        
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          success: false,
          error: {
            code: 'TOO_MANY_FILES',
            message: ERROR_MESSAGES.TOO_MANY_FILES,
            maxFiles: UPLOAD_CONFIGS.GALLERY.maxFiles
          }
        });
        
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          success: false,
          error: {
            code: 'UNEXPECTED_FILE',
            message: 'Unexpected file field',
            field: error.field
          }
        });
        
      default:
        return res.status(400).json({
          success: false,
          error: {
            code: 'UPLOAD_ERROR',
            message: 'File upload error',
            details: error.message
          }
        });
    }
  }
  
  // Handle custom file filter errors
  if (error.code === 'INVALID_FILE_TYPE') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_FILE_TYPE',
        message: ERROR_MESSAGES.INVALID_FILE_TYPE,
        mimeType: error.mimeType,
        allowedTypes: error.allowedTypes
      }
    });
  }
  
  if (error.code === 'INVALID_EXTENSION') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_EXTENSION',
        message: 'Invalid file extension',
        extension: error.extension
      }
    });
  }
  
  // Pass other errors to global error handler
  next(error);
}

/**
 * Type definitions for better IDE support
 */
export type MulterConfigType = ReturnType<typeof createMulterConfig>;
export type ProfileImageUpload = ReturnType<typeof MulterConfigs.profileImage>;
export type GalleryImagesUpload = ReturnType<typeof MulterConfigs.galleryImages>;