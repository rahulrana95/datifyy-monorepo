// src/modules/imageUpload/errors/ImageUploadErrors.ts
/**
 * Image Upload Error Classes - Production Ready
 * 
 * Following Google's error handling best practices:
 * ✅ Structured error hierarchy
 * ✅ Machine-readable error codes
 * ✅ Rich context for debugging
 * ✅ User-friendly error messages
 * ✅ Observability support
 * ✅ Type safety with enums
 */

/**
 * Standardized error codes for image upload operations
 * These codes are used for client-side error handling and metrics
 */
export enum ImageUploadErrorCodes {
  // Validation Errors (4xx)
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  INVALID_FILE_NAME = 'INVALID_FILE_NAME',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  BATCH_VALIDATION_FAILED = 'BATCH_VALIDATION_FAILED',
  TOO_MANY_FILES = 'TOO_MANY_FILES',
  
  // Authentication/Authorization Errors (4xx)
  UNAUTHORIZED = 'UNAUTHORIZED',
  ACCESS_DENIED = 'ACCESS_DENIED',
  IMAGE_NOT_FOUND = 'IMAGE_NOT_FOUND',
  OWNERSHIP_REQUIRED = 'OWNERSHIP_REQUIRED',
  
  // Business Logic Errors (4xx)
  DUPLICATE_PRIMARY_IMAGE = 'DUPLICATE_PRIMARY_IMAGE',
  CATEGORY_LIMIT_EXCEEDED = 'CATEGORY_LIMIT_EXCEEDED',
  UNSUPPORTED_OPERATION = 'UNSUPPORTED_OPERATION',
  
  // Storage/Infrastructure Errors (5xx)
  STORAGE_PROVIDER_ERROR = 'STORAGE_PROVIDER_ERROR',
  UPLOAD_FAILED = 'UPLOAD_FAILED',
  DELETION_FAILED = 'DELETION_FAILED',
  BULK_UPLOAD_FAILED = 'BULK_UPLOAD_FAILED',
  
  // Database Errors (5xx)
  DATABASE_ERROR = 'DATABASE_ERROR',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  RETRIEVAL_FAILED = 'RETRIEVAL_FAILED',
  UPDATE_FAILED = 'UPDATE_FAILED',
  
  // System Errors (5xx)
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR'
}

/**
 * HTTP status code mapping for error codes
 */
export const ErrorCodeToHttpStatus: Record<ImageUploadErrorCodes, number> = {
  // 400 Bad Request
  [ImageUploadErrorCodes.VALIDATION_FAILED]: 400,
  [ImageUploadErrorCodes.FILE_TOO_LARGE]: 400,
  [ImageUploadErrorCodes.INVALID_FILE_TYPE]: 400,
  [ImageUploadErrorCodes.INVALID_FILE_NAME]: 400,
  [ImageUploadErrorCodes.BATCH_VALIDATION_FAILED]: 400,
  [ImageUploadErrorCodes.UNSUPPORTED_OPERATION]: 400,
  
  // 401 Unauthorized
  [ImageUploadErrorCodes.UNAUTHORIZED]: 401,
  
  // 403 Forbidden
  [ImageUploadErrorCodes.ACCESS_DENIED]: 403,
  [ImageUploadErrorCodes.OWNERSHIP_REQUIRED]: 403,
  
  // 404 Not Found
  [ImageUploadErrorCodes.IMAGE_NOT_FOUND]: 404,
  
  // 409 Conflict
  [ImageUploadErrorCodes.DUPLICATE_PRIMARY_IMAGE]: 409,
  
  // 413 Payload Too Large
  [ImageUploadErrorCodes.QUOTA_EXCEEDED]: 413,
  [ImageUploadErrorCodes.TOO_MANY_FILES]: 413,
  [ImageUploadErrorCodes.CATEGORY_LIMIT_EXCEEDED]: 413,
  
  // 500 Internal Server Error
  [ImageUploadErrorCodes.INTERNAL_ERROR]: 500,
  [ImageUploadErrorCodes.DATABASE_ERROR]: 500,
  [ImageUploadErrorCodes.TRANSACTION_FAILED]: 500,
  [ImageUploadErrorCodes.CONFIGURATION_ERROR]: 500,
  
  // 502 Bad Gateway
  [ImageUploadErrorCodes.STORAGE_PROVIDER_ERROR]: 502,
  
  // 503 Service Unavailable
  [ImageUploadErrorCodes.SERVICE_UNAVAILABLE]: 503,
  [ImageUploadErrorCodes.UPLOAD_FAILED]: 503,
  [ImageUploadErrorCodes.DELETION_FAILED]: 503,
  [ImageUploadErrorCodes.BULK_UPLOAD_FAILED]: 503,
  [ImageUploadErrorCodes.RETRIEVAL_FAILED]: 503,
  [ImageUploadErrorCodes.UPDATE_FAILED]: 503,
  
  // 504 Gateway Timeout
  [ImageUploadErrorCodes.TIMEOUT_ERROR]: 504
};

/**
 * User-friendly error messages for different error codes
 */
export const ErrorCodeToUserMessage: Record<ImageUploadErrorCodes, string> = {
  // Validation Errors
  [ImageUploadErrorCodes.VALIDATION_FAILED]: 'The uploaded file is invalid. Please check the file and try again.',
  [ImageUploadErrorCodes.FILE_TOO_LARGE]: 'The file is too large. Please choose a smaller file.',
  [ImageUploadErrorCodes.INVALID_FILE_TYPE]: 'This file type is not supported. Please use JPG, PNG, or WebP.',
  [ImageUploadErrorCodes.INVALID_FILE_NAME]: 'The file name contains invalid characters. Please rename and try again.',
  [ImageUploadErrorCodes.QUOTA_EXCEEDED]: 'You have reached your storage limit. Please delete some images first.',
  [ImageUploadErrorCodes.BATCH_VALIDATION_FAILED]: 'Some files in your selection are invalid. Please review and try again.',
  [ImageUploadErrorCodes.TOO_MANY_FILES]: 'Too many files selected. Please select fewer files.',
  
  // Authentication/Authorization
  [ImageUploadErrorCodes.UNAUTHORIZED]: 'Please log in to upload images.',
  [ImageUploadErrorCodes.ACCESS_DENIED]: 'You do not have permission to perform this action.',
  [ImageUploadErrorCodes.IMAGE_NOT_FOUND]: 'The requested image was not found.',
  [ImageUploadErrorCodes.OWNERSHIP_REQUIRED]: 'You can only modify your own images.',
  
  // Business Logic
  [ImageUploadErrorCodes.DUPLICATE_PRIMARY_IMAGE]: 'You already have a primary image. Please remove it first.',
  [ImageUploadErrorCodes.CATEGORY_LIMIT_EXCEEDED]: 'You have reached the maximum number of images for this category.',
  [ImageUploadErrorCodes.UNSUPPORTED_OPERATION]: 'This operation is not supported.',
  
  // Storage/Infrastructure
  [ImageUploadErrorCodes.STORAGE_PROVIDER_ERROR]: 'There was a problem with our storage service. Please try again.',
  [ImageUploadErrorCodes.UPLOAD_FAILED]: 'Upload failed. Please check your connection and try again.',
  [ImageUploadErrorCodes.DELETION_FAILED]: 'Could not delete the image. Please try again.',
  [ImageUploadErrorCodes.BULK_UPLOAD_FAILED]: 'Bulk upload failed. Some images may have been uploaded successfully.',
  
  // Database
  [ImageUploadErrorCodes.DATABASE_ERROR]: 'A database error occurred. Please try again.',
  [ImageUploadErrorCodes.TRANSACTION_FAILED]: 'The operation could not be completed. Please try again.',
  [ImageUploadErrorCodes.RETRIEVAL_FAILED]: 'Could not retrieve images. Please refresh and try again.',
  [ImageUploadErrorCodes.UPDATE_FAILED]: 'Could not update the image. Please try again.',
  
  // System
  [ImageUploadErrorCodes.INTERNAL_ERROR]: 'An unexpected error occurred. Please try again.',
  [ImageUploadErrorCodes.SERVICE_UNAVAILABLE]: 'The image service is temporarily unavailable. Please try again later.',
  [ImageUploadErrorCodes.TIMEOUT_ERROR]: 'The request timed out. Please try again.',
  [ImageUploadErrorCodes.CONFIGURATION_ERROR]: 'Service configuration error. Please contact support.'
};

/**
 * Base Image Upload Error class
 * Provides structured error information for observability and debugging
 */
export class ImageUploadError extends Error {
  public readonly code: ImageUploadErrorCodes;
  public readonly statusCode: number;
  public readonly userMessage: string;
  public readonly context: Record<string, any>;
  public readonly timestamp: Date;
  public readonly isOperational: boolean = true;

  constructor(
    message: string,
    code: ImageUploadErrorCodes,
    context: Record<string, any> = {},
    cause?: Error
  ) {
    super(message);
    
    this.name = 'ImageUploadError';
    this.code = code;
    this.statusCode = ErrorCodeToHttpStatus[code];
    this.userMessage = ErrorCodeToUserMessage[code];
    this.context = {
      ...context,
      errorId: this.generateErrorId(),
      cause: cause?.message
    };
    this.timestamp = new Date();

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ImageUploadError);
    }

    // Chain the cause if provided
    if (cause) {
      this.stack = this.stack + '\nCaused by: ' + cause.stack;
    }
  }

  /**
   * Convert error to JSON for API responses
   */
  toJSON(): Record<string, any> {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.userMessage,
        statusCode: this.statusCode,
        timestamp: this.timestamp.toISOString(),
        errorId: this.context.errorId,
        ...(process.env.NODE_ENV === 'development' && {
          developerMessage: this.message,
          context: this.context,
          stack: this.stack
        })
      }
    };
  }

  /**
   * Convert error to structured log format
   */
  toLogFormat(): Record<string, any> {
    return {
      errorCode: this.code,
      errorMessage: this.message,
      userMessage: this.userMessage,
      statusCode: this.statusCode,
      context: this.context,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack
    };
  }

  /**
   * Check if error is retryable
   */
  isRetryable(): boolean {
    const retryableCodes = [
      ImageUploadErrorCodes.TIMEOUT_ERROR,
      ImageUploadErrorCodes.SERVICE_UNAVAILABLE,
      ImageUploadErrorCodes.STORAGE_PROVIDER_ERROR,
      ImageUploadErrorCodes.DATABASE_ERROR,
      ImageUploadErrorCodes.INTERNAL_ERROR
    ];
    
    return retryableCodes.includes(this.code);
  }

  /**
   * Check if error requires user action
   */
  requiresUserAction(): boolean {
    const userActionCodes = [
      ImageUploadErrorCodes.VALIDATION_FAILED,
      ImageUploadErrorCodes.FILE_TOO_LARGE,
      ImageUploadErrorCodes.INVALID_FILE_TYPE,
      ImageUploadErrorCodes.QUOTA_EXCEEDED,
      ImageUploadErrorCodes.UNAUTHORIZED
    ];
    
    return userActionCodes.includes(this.code);
  }

  private generateErrorId(): string {
    return `img_err_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  }
}

/**
 * Specific error classes for common scenarios
 * These provide more context and can be handled differently
 */

export class FileValidationError extends ImageUploadError {
  constructor(message: string, context: Record<string, any> = {}) {
    super(message, ImageUploadErrorCodes.VALIDATION_FAILED, context);
    this.name = 'FileValidationError';
  }
}

export class FileTooLargeError extends ImageUploadError {
  constructor(fileSize: number, maxSize: number, fileName?: string) {
    const context = {
      fileSize,
      maxSize,
      fileName,
      fileSizeFormatted: formatBytes(fileSize),
      maxSizeFormatted: formatBytes(maxSize)
    };
    
    super(
      `File size ${formatBytes(fileSize)} exceeds maximum ${formatBytes(maxSize)}`,
      ImageUploadErrorCodes.FILE_TOO_LARGE,
      context
    );
    this.name = 'FileTooLargeError';
  }
}

export class InvalidFileTypeError extends ImageUploadError {
  constructor(mimeType: string, allowedTypes: string[], fileName?: string) {
    const context = {
      mimeType,
      allowedTypes,
      fileName
    };
    
    super(
      `File type '${mimeType}' not allowed. Allowed types: ${allowedTypes.join(', ')}`,
      ImageUploadErrorCodes.INVALID_FILE_TYPE,
      context
    );
    this.name = 'InvalidFileTypeError';
  }
}

export class QuotaExceededError extends ImageUploadError {
  constructor(currentUsage: number, maxQuota: number, additionalSize: number) {
    const context = {
      currentUsage,
      maxQuota,
      additionalSize,
      currentUsageFormatted: formatBytes(currentUsage),
      maxQuotaFormatted: formatBytes(maxQuota),
      additionalSizeFormatted: formatBytes(additionalSize)
    };
    
    super(
      `Storage quota exceeded. Current: ${formatBytes(currentUsage)}, Max: ${formatBytes(maxQuota)}`,
      ImageUploadErrorCodes.QUOTA_EXCEEDED,
      context
    );
    this.name = 'QuotaExceededError';
  }
}

export class ImageNotFoundError extends ImageUploadError {
  constructor(imageId: string, userId?: number) {
    super(
      'Image not found or access denied',
      ImageUploadErrorCodes.IMAGE_NOT_FOUND,
      { imageId, userId }
    );
    this.name = 'ImageNotFoundError';
  }
}

export class StorageProviderError extends ImageUploadError {
  constructor(providerName: string, operation: string, cause?: Error) {
    super(
      `Storage provider '${providerName}' error during ${operation}`,
      ImageUploadErrorCodes.STORAGE_PROVIDER_ERROR,
      { providerName, operation },
      cause
    );
    this.name = 'StorageProviderError';
  }
}

/**
 * Error factory for creating errors from different sources
 */
export class ImageUploadErrorFactory {
  static fromStorageError(error: any, operation: string): ImageUploadError {
    if (error.code === 'FILE_TOO_LARGE') {
      return new FileTooLargeError(error.fileSize, error.maxSize, error.fileName);
    }
    
    if (error.code === 'INVALID_FILE_TYPE') {
      return new InvalidFileTypeError(error.mimeType, error.allowedTypes, error.fileName);
    }
    
    return new StorageProviderError(error.provider || 'unknown', operation, error);
  }

  static fromValidationError(validationErrors: string[], fileName?: string): FileValidationError {
    return new FileValidationError(
      `File validation failed: ${validationErrors.join(', ')}`,
      { validationErrors, fileName }
    );
  }

  static fromDatabaseError(error: any, operation: string): ImageUploadError {
    return new ImageUploadError(
      `Database error during ${operation}`,
      ImageUploadErrorCodes.DATABASE_ERROR,
      { operation, databaseError: error.message },
      error
    );
  }

  static createQuotaError(stats: {
    currentFiles: number;
    maxFiles: number;
    currentSize: number;
    maxSize: number;
  }): QuotaExceededError {
    return new QuotaExceededError(stats.currentSize, stats.maxSize, 0);
  }
}

/**
 * Type guards for error handling
 */
export function isImageUploadError(error: any): error is ImageUploadError {
  return error instanceof ImageUploadError;
}

export function isRetryableError(error: any): boolean {
  return isImageUploadError(error) && error.isRetryable();
}

export function requiresUserAction(error: any): boolean {
  return isImageUploadError(error) && error.requiresUserAction();
}

/**
 * Utility function to format bytes
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}