// Auto-generated from proto/common/storage.proto
// Generated at: 2025-07-15T10:21:46.943Z

export interface StorageUploadOptions {
  fileName: string;
  contentType: string;
  folder?: string;
  isPublic?: boolean;
  expiresIn?: number;
  metadata?: Record<string, string>;
}

export interface StorageUploadResult {
  id: string;
  key: string;
  url: string;
  cdnUrl?: string;
  size: number;
  contentType: string;
  uploadedAt: string;
  metadata?: Record<string, string>;
}

export interface StorageListOptions {
  prefix?: string;
  folder?: string;
  limit?: number;
  cursor?: string;
}

export interface StorageFileInfo {
  id: string;
  key: string;
  url: string;
  size: number;
  contentType: string;
  lastModified: string;
  metadata?: Record<string, string>;
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
  lastChecked: string;
  errorMessage?: string;
}

export class StorageError extends Error {
  constructor(
    message: string,
    public code: string,
    public provider: string,
    public operation: string,
    public correlationId?: string
  ) {
    super(message);
    this.name = 'StorageError';
  }
}
