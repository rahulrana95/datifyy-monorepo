// src/modules/imageUpload/constants/imageUploadConstants.ts
/**
 * Image Upload Constants - Simple & Clean
 * 
 * Single source of truth for all image upload configuration
 * ✅ No magic numbers scattered in code
 * ✅ Easy to update limits
 * ✅ Type-safe constants
 * ✅ Clear organization
 */

/**
 * File size limits in bytes
 */
export const FILE_SIZE_LIMITS = {
  PROFILE_IMAGE: 10 * 1024 * 1024,    // 10MB
  GALLERY_IMAGE: 15 * 1024 * 1024,   // 15MB
  DOCUMENT_IMAGE: 25 * 1024 * 1024,  // 25MB
  MAX_BATCH_SIZE: 100 * 1024 * 1024  // 100MB total
} as const;

/**
 * File count limits
 */
export const FILE_COUNT_LIMITS = {
  MAX_PROFILE_IMAGES: 6,
  MAX_GALLERY_IMAGES: 20,
  MAX_DOCUMENT_IMAGES: 5,
  MAX_FILES_PER_BATCH: 10,
  MAX_TOTAL_USER_FILES: 50
} as const;

/**
 * Allowed MIME types for different categories
 */
export const ALLOWED_MIME_TYPES = {
  IMAGES: [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/gif'
  ],
  PROFILE_ONLY: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
  ],
  DOCUMENTS: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/pdf'
  ]
} as const;

/**
 * File extensions mapping
 */
export const ALLOWED_EXTENSIONS = {
  IMAGES: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
  PROFILE_ONLY: ['.jpg', '.jpeg', '.png', '.webp'],
  DOCUMENTS: ['.jpg', '.jpeg', '.png', '.pdf']
} as const;

/**
 * Storage folder structure
 */
export const STORAGE_FOLDERS = {
  PROFILE: 'users/profile',
  GALLERY: 'users/gallery', 
  EVENTS: 'users/events',
  DOCUMENTS: 'users/documents',
  TEMP: 'temp'
} as const;

/**
 * Image processing settings
 */
export const IMAGE_PROCESSING = {
  THUMBNAIL_SIZES: [150, 300, 600],
  QUALITY: {
    HIGH: 90,
    MEDIUM: 75,
    LOW: 60
  },
  MAX_DIMENSIONS: {
    WIDTH: 4096,
    HEIGHT: 4096
  },
  MIN_DIMENSIONS: {
    PROFILE_WIDTH: 200,
    PROFILE_HEIGHT: 200,
    GALLERY_WIDTH: 300,
    GALLERY_HEIGHT: 300
  }
} as const;

/**
 * Rate limiting configuration
 */
export const RATE_LIMITS = {
  UPLOAD_PER_MINUTE: 10,
  UPLOAD_PER_HOUR: 50,
  DELETE_PER_MINUTE: 20,
  WINDOW_MS: 60 * 1000 // 1 minute
} as const;

/**
 * Error message templates
 */
export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: 'File size exceeds the maximum limit',
  INVALID_FILE_TYPE: 'File type is not supported',
  TOO_MANY_FILES: 'Too many files in request',
  QUOTA_EXCEEDED: 'Storage quota exceeded',
  UNAUTHORIZED: 'Authentication required',
  ACCESS_DENIED: 'Access denied to this resource'
} as const;

/**
 * Success message templates
 */
export const SUCCESS_MESSAGES = {
  UPLOAD_SUCCESS: 'Image uploaded successfully',
  BULK_UPLOAD_SUCCESS: 'Images uploaded successfully',
  DELETE_SUCCESS: 'Image deleted successfully',
  UPDATE_SUCCESS: 'Image updated successfully',
  PRIMARY_SET: 'Primary image updated successfully'
} as const;

/**
 * Default configuration for different upload types
 */
export const UPLOAD_CONFIGS = {
  PROFILE: {
    maxFileSize: FILE_SIZE_LIMITS.PROFILE_IMAGE,
    maxFiles: FILE_COUNT_LIMITS.MAX_PROFILE_IMAGES,
    allowedMimeTypes: ALLOWED_MIME_TYPES.PROFILE_ONLY,
    folder: STORAGE_FOLDERS.PROFILE,
    requireDimensions: true,
    generateThumbnails: true
  },
  GALLERY: {
    maxFileSize: FILE_SIZE_LIMITS.GALLERY_IMAGE,
    maxFiles: FILE_COUNT_LIMITS.MAX_GALLERY_IMAGES,
    allowedMimeTypes: ALLOWED_MIME_TYPES.IMAGES,
    folder: STORAGE_FOLDERS.GALLERY,
    requireDimensions: false,
    generateThumbnails: true
  },
  DOCUMENT: {
    maxFileSize: FILE_SIZE_LIMITS.DOCUMENT_IMAGE,
    maxFiles: FILE_COUNT_LIMITS.MAX_DOCUMENT_IMAGES,
    allowedMimeTypes: ALLOWED_MIME_TYPES.DOCUMENTS,
    folder: STORAGE_FOLDERS.DOCUMENTS,
    requireDimensions: false,
    generateThumbnails: false
  }
} as const;

/**
 * Type definitions for constants (for better IDE support)
 */
export type UploadConfigType = keyof typeof UPLOAD_CONFIGS;
export type StorageFolderType = typeof STORAGE_FOLDERS[keyof typeof STORAGE_FOLDERS];
export type AllowedMimeType = typeof ALLOWED_MIME_TYPES.IMAGES[number];

/**
 * Helper functions for working with constants
 */
export const ImageUploadHelpers = {
  /**
   * Get upload config by type
   */
  getUploadConfig: (type: UploadConfigType) => UPLOAD_CONFIGS[type],
  
  /**
   * Check if file type is allowed for category
   */
  isFileTypeAllowed: (mimeType: string, category: UploadConfigType): boolean => {
    return UPLOAD_CONFIGS[category].allowedMimeTypes.includes(mimeType as any);
  },
  
  /**
   * Check if file size is within limits
   */
  isFileSizeValid: (size: number, category: UploadConfigType): boolean => {
    return size <= UPLOAD_CONFIGS[category].maxFileSize;
  },
  
  /**
   * Format file size for display
   */
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },
  
  /**
   * Get file extension from filename
   */
  getFileExtension: (filename: string): string => {
    return filename.slice(filename.lastIndexOf('.')).toLowerCase();
  },
  
  /**
   * Generate safe storage key
   */
  generateStorageKey: (folder: string, filename: string, userId?: number): string => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const ext = ImageUploadHelpers.getFileExtension(filename);
    const prefix = userId ? `user_${userId}` : 'anonymous';
    return `${folder}/${prefix}_${timestamp}_${random}${ext}`;
  }
} as const;