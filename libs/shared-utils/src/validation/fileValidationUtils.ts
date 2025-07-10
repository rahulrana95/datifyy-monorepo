// libs/shared-utils/src/validation/fileValidationUtils.ts

import { 
  FileValidationResult,
} from '../../../shared-types/src/interfaces/storage.interfaces';
import { formatFileSize } from '../format/formatUtils';

/**
 * File Validation Utilities - Shared between Frontend & Backend
 * 
 * Provides consistent file validation logic that can be used
 * on both client and server sides
 */

export interface FileValidationConfig {
  maxSize?: number; // in bytes
  allowedMimeTypes?: string[];
  allowedExtensions?: string[];
  minImageDimensions?: { width: number; height: number };
  maxImageDimensions?: { width: number; height: number };
  requireImageDimensions?: boolean;
}

export interface FileInfo {
  name: string;
  size: number;
  type: string;
  lastModified?: number;
  // For frontend File objects
  // @ts-ignore
  file?: File;
  // For backend buffer analysis
  // @ts-ignore
  buffer?: Buffer;
}

/**
 * Default configuration for different file categories
 */
export const FILE_VALIDATION_CONFIGS = {
  PROFILE_IMAGE: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
    minImageDimensions: { width: 200, height: 200 },
    maxImageDimensions: { width: 4096, height: 4096 },
    requireImageDimensions: true
  },
  GALLERY_IMAGE: {
    maxSize: 15 * 1024 * 1024, // 15MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
    minImageDimensions: { width: 300, height: 300 },
    maxImageDimensions: { width: 8192, height: 8192 },
    requireImageDimensions: true
  },
  DOCUMENT: {
    maxSize: 25 * 1024 * 1024, // 25MB
    allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    allowedExtensions: ['.pdf', '.jpg', '.jpeg', '.png'],
    requireImageDimensions: false
  }
} as const;

/**
 * Validate a single file against configuration
 */
export function validateFile(
  fileInfo: FileInfo,
  config: FileValidationConfig
): FileValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // 1. Size validation
    if (config.maxSize && fileInfo.size > config.maxSize) {
      errors.push(`File size ${formatFileSize(fileInfo.size)} exceeds maximum allowed size ${formatFileSize(config.maxSize)}`);
    }

    // 2. MIME type validation
    if (config.allowedMimeTypes && !config.allowedMimeTypes.includes(fileInfo.type)) {
      errors.push(`File type '${fileInfo.type}' is not allowed. Allowed types: ${config.allowedMimeTypes.join(', ')}`);
    }

    // 3. File extension validation
    if (config.allowedExtensions) {
      const extension = getFileExtension(fileInfo.name);
      if (!config.allowedExtensions.includes(extension.toLowerCase())) {
        errors.push(`File extension '${extension}' is not allowed. Allowed extensions: ${config.allowedExtensions.join(', ')}`);
      }
    }

    // 4. Basic file name validation
    const nameValidation = validateFileName(fileInfo.name);
    if (!nameValidation.isValid) {
      errors.push(...nameValidation.errors);
    }

    // 5. Size warnings for large files
    if (fileInfo.size > 5 * 1024 * 1024) { // 5MB
      warnings.push('Large file size may result in slower upload times');
    }

    // 6. Image-specific validations (if dimensions are available)
    if (isImageFile(fileInfo.type) && config.requireImageDimensions) {
      // Note: Dimension validation would need actual image analysis
      // This is a placeholder for where dimension checking would go
      warnings.push('Image dimensions will be validated after upload');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      fileInfo: {
        size: fileInfo.size,
        type: fileInfo.type
      }
    };

  } catch (error) {
    return {
      isValid: false,
      errors: [`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`],
      warnings
    };
  }
}

/**
 * Validate multiple files
 */
export function validateFiles(
  files: FileInfo[],
  config: FileValidationConfig,
  options?: {
    maxFiles?: number;
    totalSizeLimit?: number;
  }
): {
  isValid: boolean;
  results: Array<FileValidationResult & { fileName: string }>;
  globalErrors: string[];
  summary: {
    totalFiles: number;
    validFiles: number;
    totalSize: number;
    largestFile: { name: string; size: number };
  };
} {
  const results: Array<FileValidationResult & { fileName: string }> = [];
  const globalErrors: string[] = [];

  // Global validations
  if (options?.maxFiles && files.length > options.maxFiles) {
    globalErrors.push(`Too many files. Maximum ${options.maxFiles} files allowed, but ${files.length} provided`);
  }

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  if (options?.totalSizeLimit && totalSize > options.totalSizeLimit) {
    globalErrors.push(`Total file size ${formatFileSize(totalSize)} exceeds limit ${formatFileSize(options.totalSizeLimit)}`);
  }

  // Individual file validations
  files.forEach(file => {
    const result = validateFile(file, config);
    results.push({
      ...result,
      fileName: file.name
    });
  });

  const validFiles = results.filter(r => r.isValid).length;
  const largestFile = files.reduce((largest, file) => 
    file.size > largest.size ? file : largest, 
    files[0] || { name: '', size: 0 }
  );

  return {
    isValid: globalErrors.length === 0 && validFiles === files.length,
    results,
    globalErrors,
    summary: {
      totalFiles: files.length,
      validFiles,
      totalSize,
      largestFile: { name: largestFile.name, size: largestFile.size }
    }
  };
}

/**
 * Validate file name
 */
export function validateFileName(fileName: string): { isValid: boolean; errors: string[] } {
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

  // Check for reserved names (Windows)
  const reservedNames = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'];
  const nameWithoutExt = fileName.split('.')[0].toUpperCase();
  if (reservedNames.includes(nameWithoutExt)) {
    errors.push('File name is reserved and cannot be used');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Check if file is an image based on MIME type
 */
export function isImageFile(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

/**
 * Check if file is a video based on MIME type
 */
export function isVideoFile(mimeType: string): boolean {
  return mimeType.startsWith('video/');
}

/**
 * Check if file is a document based on MIME type
 */
export function isDocumentFile(mimeType: string): boolean {
  const documentMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  return documentMimes.includes(mimeType);
}

/**
 * Get file extension from filename
 */
export function getFileExtension(fileName: string): string {
  const lastDot = fileName.lastIndexOf('.');
  return lastDot === -1 ? '' : fileName.substring(lastDot);
}


/**
 * Generate safe file name for storage
 */
export function generateSafeFileName(originalName: string, prefix?: string): string {
  const extension = getFileExtension(originalName);
  const nameWithoutExt = originalName.replace(extension, '');
  
  // Remove dangerous characters and limit length
  const safeName = nameWithoutExt
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .substring(0, 100)
    .toLowerCase();
  
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  
  const finalName = prefix 
    ? `${prefix}_${safeName}_${timestamp}_${randomSuffix}${extension}`
    : `${safeName}_${timestamp}_${randomSuffix}${extension}`;
  
  return finalName;
}

/**
 * Estimate upload time based on file size and connection speed
 */
export function estimateUploadTime(
  fileSize: number, 
  connectionSpeedMbps: number = 10
): {
  estimatedSeconds: number;
  estimatedText: string;
} {
  // Convert Mbps to bytes per second
  const bytesPerSecond = (connectionSpeedMbps * 1024 * 1024) / 8;
  
  // Add 30% overhead for HTTP and processing
  const estimatedSeconds = Math.ceil((fileSize / bytesPerSecond) * 1.3);
  
  let estimatedText: string;
  if (estimatedSeconds < 60) {
    estimatedText = `${estimatedSeconds} seconds`;
  } else if (estimatedSeconds < 3600) {
    const minutes = Math.ceil(estimatedSeconds / 60);
    estimatedText = `${minutes} minute${minutes > 1 ? 's' : ''}`;
  } else {
    const hours = Math.ceil(estimatedSeconds / 3600);
    estimatedText = `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  
  return {
    estimatedSeconds,
    estimatedText
  };
}

/**
 * Create validation config for specific use case
 */
export function createValidationConfig(
  category: keyof typeof FILE_VALIDATION_CONFIGS,
  overrides?: Partial<FileValidationConfig>
): FileValidationConfig {
  const baseConfig = FILE_VALIDATION_CONFIGS[category];
  // @ts-ignore
  return {
    ...baseConfig,
    ...overrides
  };
}