// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.5
//   protoc               v5.28.3
// source: common/storage.proto

/* eslint-disable */

/** Storage provider types */
export enum StorageProvider {
  STORAGE_PROVIDER_UNSPECIFIED = "STORAGE_PROVIDER_UNSPECIFIED",
  STORAGE_PROVIDER_CLOUDFLARE_R2 = "STORAGE_PROVIDER_CLOUDFLARE_R2",
  STORAGE_PROVIDER_AWS_S3 = "STORAGE_PROVIDER_AWS_S3",
  STORAGE_PROVIDER_GOOGLE_CLOUD_STORAGE = "STORAGE_PROVIDER_GOOGLE_CLOUD_STORAGE",
  STORAGE_PROVIDER_AZURE_BLOB = "STORAGE_PROVIDER_AZURE_BLOB",
  STORAGE_PROVIDER_LOCAL = "STORAGE_PROVIDER_LOCAL",
}

/** Storage error codes */
export enum StorageErrorCode {
  STORAGE_ERROR_CODE_UNSPECIFIED = "STORAGE_ERROR_CODE_UNSPECIFIED",
  STORAGE_ERROR_CODE_UPLOAD_FAILED = "STORAGE_ERROR_CODE_UPLOAD_FAILED",
  STORAGE_ERROR_CODE_FILE_NOT_FOUND = "STORAGE_ERROR_CODE_FILE_NOT_FOUND",
  STORAGE_ERROR_CODE_ACCESS_DENIED = "STORAGE_ERROR_CODE_ACCESS_DENIED",
  STORAGE_ERROR_CODE_INVALID_FILE_TYPE = "STORAGE_ERROR_CODE_INVALID_FILE_TYPE",
  STORAGE_ERROR_CODE_FILE_TOO_LARGE = "STORAGE_ERROR_CODE_FILE_TOO_LARGE",
  STORAGE_ERROR_CODE_QUOTA_EXCEEDED = "STORAGE_ERROR_CODE_QUOTA_EXCEEDED",
  STORAGE_ERROR_CODE_PROVIDER_ERROR = "STORAGE_ERROR_CODE_PROVIDER_ERROR",
}

/** File processing status */
export enum FileProcessingStatus {
  FILE_PROCESSING_STATUS_UNSPECIFIED = "FILE_PROCESSING_STATUS_UNSPECIFIED",
  FILE_PROCESSING_STATUS_PENDING = "FILE_PROCESSING_STATUS_PENDING",
  FILE_PROCESSING_STATUS_PROCESSING = "FILE_PROCESSING_STATUS_PROCESSING",
  FILE_PROCESSING_STATUS_COMPLETED = "FILE_PROCESSING_STATUS_COMPLETED",
  FILE_PROCESSING_STATUS_FAILED = "FILE_PROCESSING_STATUS_FAILED",
}

export interface StorageUploadOptions {
  fileName: string;
  contentType: string;
  folder: string;
  isPublic: boolean;
  expiresIn: number;
  metadata: { [key: string]: string };
}

export interface StorageUploadOptions_MetadataEntry {
  key: string;
  value: string;
}

export interface StorageUploadResult {
  id: string;
  key: string;
  url: string;
  cdnUrl: string;
  size: number;
  contentType: string;
  uploadedAt: string;
  metadata: { [key: string]: string };
}

export interface StorageUploadResult_MetadataEntry {
  key: string;
  value: string;
}

export interface StorageListOptions {
  prefix: string;
  folder: string;
  limit: number;
  cursor: string;
}

export interface StorageFileInfo {
  id: string;
  key: string;
  url: string;
  size: number;
  contentType: string;
  lastModified: string;
  metadata: { [key: string]: string };
}

export interface StorageFileInfo_MetadataEntry {
  key: string;
  value: string;
}

export interface StorageListResult {
  files: StorageFileInfo[];
  nextCursor: string;
  hasMore: boolean;
  totalCount: number;
}

export interface StorageHealthCheck {
  isHealthy: boolean;
  responseTime: number;
  provider: string;
  region: string;
  lastChecked: string;
  errorMessage: string;
}

export interface StorageError {
  message: string;
  code: string;
  provider: string;
  operation: string;
  correlationId: string;
}

/** Image processing options */
export interface ImageProcessingOptions {
  width: number;
  height: number;
  /** cover, contain, fill, inside, outside */
  fit: string;
  /** jpg, png, webp, avif */
  format: string;
  quality: number;
  progressive: boolean;
  optimize: boolean;
  transformParams: { [key: string]: string };
}

export interface ImageProcessingOptions_TransformParamsEntry {
  key: string;
  value: string;
}

/** Upload progress */
export interface UploadProgress {
  uploadId: string;
  totalBytes: number;
  uploadedBytes: number;
  progressPercentage: number;
  estimatedSecondsRemaining: number;
  status: FileProcessingStatus;
  startedAt: string;
  updatedAt: string;
}

/** File validation result */
export interface FileValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  metadata?: FileMetadata | undefined;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  code: string;
}

export interface FileMetadata {
  filename: string;
  contentType: string;
  sizeBytes: number;
  extension: string;
  properties: { [key: string]: string };
}

export interface FileMetadata_PropertiesEntry {
  key: string;
  value: string;
}
