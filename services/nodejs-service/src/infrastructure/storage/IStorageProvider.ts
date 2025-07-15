// services/nodejs-service/src/infrastructure/storage/IStorageProvider.ts

import { 
  StorageUploadOptions,
  StorageUploadResult,
  StorageListOptions,
  StorageListResult,
  StorageFileInfo,
  StorageHealthCheck
} from '../../proto-types/common/storage';

/**
 * Storage Provider Interface - Production Ready
 * 
 * Following Google's interface design principles:
 * - Single responsibility
 * - Dependency inversion
 * - Testable contracts
 * - Graceful error handling
 */
export interface IStorageProvider {
  /**
   * Upload single file with comprehensive error handling
   * @param fileBuffer - File content as buffer
   * @param options - Upload configuration
   * @returns Promise<StorageUploadResult> - Upload result with metadata
   * @throws StorageError - On upload failure with specific error codes
   */
  upload(
    fileBuffer: Buffer, 
    options: StorageUploadOptions
  ): Promise<StorageUploadResult>;

  /**
   * Batch upload with concurrency control and partial failure handling
   * @param files - Array of file buffers with options
   * @param concurrency - Maximum concurrent uploads (default: 3)
   * @returns Promise<BatchUploadResult> - Results with success/failure breakdown
   */
  uploadBatch(
    files: Array<{ buffer: Buffer; options: StorageUploadOptions }>,
    concurrency?: number
  ): Promise<BatchUploadResult>;

  /**
   * Download file with streaming support
   * @param key - Storage key/path
   * @returns Promise<Buffer> - File content
   * @throws StorageNotFoundError - If file doesn't exist
   */
  download(key: string): Promise<Buffer>;

  /**
   * Get file metadata without downloading content
   * @param key - Storage key/path
   * @returns Promise<StorageFileInfo> - File metadata
   */
  getFileInfo(key: string): Promise<StorageFileInfo>;

  /**
   * List files with pagination and filtering
   * @param options - Listing options with cursor-based pagination
   * @returns Promise<StorageListResult> - Paginated file list
   */
  listFiles(options?: StorageListOptions): Promise<StorageListResult>;

  /**
   * Delete single file
   * @param key - Storage key/path
   * @returns Promise<void>
   * @throws StorageNotFoundError - If file doesn't exist
   */
  delete(key: string): Promise<void>;

  /**
   * Delete multiple files with partial failure handling
   * @param keys - Array of storage keys
   * @returns Promise<BatchDeleteResult> - Results with success/failure breakdown
   */
  deleteBatch(keys: string[]): Promise<BatchDeleteResult>;

  /**
   * Check if file exists without downloading
   * @param key - Storage key/path
   * @returns Promise<boolean> - True if file exists
   */
  exists(key: string): Promise<boolean>;

  /**
   * Generate pre-signed upload URL for direct client uploads
   * @param key - Storage key/path
   * @param contentType - MIME type
   * @param expiresIn - URL expiry in seconds (default: 3600)
   * @returns Promise<PresignedUploadResult> - Upload URL and metadata
   */
  generateUploadUrl(
    key: string, 
    contentType: string, 
    expiresIn?: number
  ): Promise<PresignedUploadResult>;

  /**
   * Generate secure download URL with expiry
   * @param key - Storage key/path
   * @param expiresIn - URL expiry in seconds (default: 3600)
   * @returns Promise<string> - Signed download URL
   */
  generateDownloadUrl(key: string, expiresIn?: number): Promise<string>;

  /**
   * Health check with detailed metrics
   * @returns Promise<StorageHealthCheck> - Health status and metrics
   */
  healthCheck(): Promise<StorageHealthCheck>;

  /**
   * Get provider name for logging and monitoring
   * @returns string - Provider identifier
   */
  getProviderName(): string;
}

/**
 * Batch Upload Result with detailed error tracking
 */
export interface BatchUploadResult {
  successful: StorageUploadResult[];
  failed: Array<{
    fileName: string;
    error: string;
    errorCode: string;
    retryable: boolean;
  }>;
  summary: {
    total: number;
    successful: number;
    failed: number;
    totalSize: number;
    processingTimeMs: number;
  };
}

/**
 * Batch Delete Result with detailed tracking
 */
export interface BatchDeleteResult {
  successful: string[];
  failed: Array<{
    key: string;
    error: string;
    errorCode: string;
  }>;
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}

/**
 * Pre-signed Upload Result
 */
export interface PresignedUploadResult {
  uploadUrl: string;
  fileKey: string;
  formData?: Record<string, string>;
  expiresAt: string;
  maxFileSize?: number;
}

/**
 * Storage Provider Factory Interface
 */
export interface IStorageProviderFactory {
  /**
   * Create storage provider instance
   * @param providerType - Type of storage provider
   * @param config - Provider-specific configuration
   * @returns IStorageProvider - Configured provider instance
   */
  createProvider(
    providerType: StorageProviderType,
    config: StorageProviderConfig
  ): IStorageProvider;

  /**
   * Get supported provider types
   * @returns StorageProviderType[] - Available provider types
   */
  getSupportedProviders(): StorageProviderType[];
}

/**
 * Storage Provider Types
 */
export enum StorageProviderType {
  CLOUDFLARE_R2 = 'cloudflare-r2',
  AWS_S3 = 'aws-s3',
  GOOGLE_CLOUD = 'google-cloud',
  AZURE_BLOB = 'azure-blob',
  LOCAL_FILE = 'local-file' // For development/testing
}

/**
 * Storage Provider Configuration
 */
export interface StorageProviderConfig {
  bucket: string;
  region?: string;
  accessKey?: string;
  secretKey?: string;
  endpoint?: string;
  cdnUrl?: string;
  maxFileSize?: number;
  allowedMimeTypes?: string[];
  retryConfig?: {
    maxRetries: number;
    retryDelayMs: number;
    backoffMultiplier: number;
  };
}

/**
 * Storage Provider Metrics for monitoring
 */
export interface StorageProviderMetrics {
  providerName: string;
  uploadCount: number;
  downloadCount: number;
  deleteCount: number;
  errorCount: number;
  avgResponseTimeMs: number;
  totalBytesUploaded: number;
  totalBytesDownloaded: number;
  lastErrorTime?: Date;
  lastErrorMessage?: string;
}