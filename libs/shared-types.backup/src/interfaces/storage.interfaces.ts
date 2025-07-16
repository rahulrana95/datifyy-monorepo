// libs/shared-types/src/interfaces/storage.interfaces.ts

/**
 * Shared Storage Interfaces - Frontend & Backend Compatible
 * 
 * These interfaces define the contract for storage operations
 * that can be used by both frontend and backend applications
 */

export interface StorageUploadOptions {
  fileName: string;
  contentType: string;
  folder?: string;
  tags?: Record<string, string>;
  metadata?: Record<string, string>;
  isPublic?: boolean;
  expiresIn?: number; // TTL in seconds
}

export interface StorageUploadResult {
  id: string; // Unique identifier
  key: string; // Storage key/path
  url: string; // Public URL to access the file
  cdnUrl?: string; // CDN URL if available
  thumbnailUrl?: string; // Thumbnail URL for images
  size: number;
  contentType: string;
  uploadedAt: string; // ISO date string
  metadata?: Record<string, string>;
}

export interface StorageFileInfo {
  id: string;
  key: string;
  url: string;
  size: number;
  contentType: string;
  lastModified: string; // ISO date string
  metadata?: Record<string, string>;
}

export interface StorageListOptions {
  folder?: string;
  limit?: number;
  cursor?: string;
  prefix?: string;
  category?: string;
}

export interface StorageListResult {
  files: StorageFileInfo[];
  nextCursor?: string;
  hasMore: boolean;
  totalCount?: number;
}

export interface StorageHealthCheck {
  isHealthy: boolean;
  responseTime: number;
  provider: string;
  region?: string;
  lastChecked: string; // ISO date string
}

/**
 * Frontend-compatible Storage Provider Interface
 * (Subset of backend interface, no Buffer operations)
 */
export interface IClientStorageProvider {
  /**
   * Generate pre-signed URL for direct upload from frontend
   */
  generateUploadUrl(
    fileName: string,
    contentType: string,
    options?: { folder?: string; expiresIn?: number }
  ): Promise<{
    uploadUrl: string;
    fileKey: string;
    formData?: Record<string, string>;
  }>;

  /**
   * Generate secure download URL
   */
  generateDownloadUrl(
    key: string,
    expiresIn?: number
  ): Promise<string>;

  /**
   * Get file information
   */
  getFileInfo(key: string): Promise<StorageFileInfo>;

  /**
   * List user's files
   */
  listFiles(options?: StorageListOptions): Promise<StorageListResult>;

  /**
   * Delete file
   */
  deleteFile(key: string): Promise<void>;

  /**
   * Health check
   */
  healthCheck(): Promise<StorageHealthCheck>;

  /**
   * Get provider name
   */
  getProviderName(): string;
}

/**
 * Storage Configuration (Shared)
 */
export interface StorageConfig {
  provider: 'cloudflare-r2' | 'aws-s3' | 'google-cloud' | 'azure-blob';
  bucket: string;
  region?: string;
  cdnUrl?: string;
  publicPath?: string;
  defaultFolder?: string;
  maxFileSize?: number; // in bytes
  allowedMimeTypes?: string[];
  thumbnailSizes?: number[]; // for image thumbnails
}

/**
 * Image Processing Options (Shared)
 */
export interface ImageProcessingOptions {
  resize?: {
    width?: number;
    height?: number;
    fit?: 'cover' | 'contain' | 'fill';
    quality?: number; // 1-100
  };
  thumbnail?: {
    sizes: number[]; // [150, 300, 600]
    quality?: number;
  };
  watermark?: {
    text?: string;
    image?: string;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    opacity?: number; // 0-1
  };
  optimize?: boolean;
  format?: 'jpeg' | 'png' | 'webp' | 'avif';
}

/**
 * Upload Progress (Frontend)
 */
export interface UploadProgress {
  fileId: string;
  fileName: string;
  loaded: number;
  total: number;
  percentage: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
  result?: StorageUploadResult;
}

/**
 * Shared Error Types
 */
export class StorageError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly provider: string,
    public readonly operation: string
  ) {
    super(message);
    this.name = 'StorageError';
  }
}

export class StorageQuotaExceededError extends StorageError {
  constructor(provider: string) {
    super('Storage quota exceeded', 'QUOTA_EXCEEDED', provider, 'upload');
  }
}

export class StorageFileTooLargeError extends StorageError {
  constructor(maxSize: number, provider: string) {
    super(`File too large. Maximum size: ${maxSize} bytes`, 'FILE_TOO_LARGE', provider, 'upload');
  }
}

export class StorageInvalidFileTypeError extends StorageError {
  constructor(allowedTypes: string[], provider: string) {
    super(
      `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`, 
      'INVALID_FILE_TYPE', 
      provider, 
      'upload'
    );
  }
}

/**
 * File Validation Result (Shared)
 */
export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
  fileInfo?: {
    size: number;
    type: string;
    dimensions?: { width: number; height: number };
  };
}