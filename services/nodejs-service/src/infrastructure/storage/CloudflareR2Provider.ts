// services/nodejs-service/src/infrastructure/storage/CloudflareR2Provider.ts

import { 
  StorageUploadOptions,
  StorageUploadResult,
  StorageListOptions,
  StorageListResult,
  StorageFileInfo,
  StorageHealthCheck,
  StorageConfig,
  StorageError
} from '@datifyy/shared-types';
import { Logger } from '../logging/Logger';

/**
 * Backend-Specific Storage Provider Interface
 */
export interface IStorageProvider {
  upload(fileBuffer: Buffer, options: StorageUploadOptions): Promise<StorageUploadResult>;
  uploadBatch(files: Array<{ buffer: Buffer; options: StorageUploadOptions }>): Promise<StorageUploadResult[]>;
  download(key: string): Promise<Buffer>;
  getFileInfo(key: string): Promise<StorageFileInfo>;
  listFiles(options?: StorageListOptions): Promise<StorageListResult>;
  delete(key: string): Promise<void>;
  deleteBatch(keys: string[]): Promise<void>;
  exists(key: string): Promise<boolean>;
  generateUploadUrl(key: string, contentType: string, expiresIn?: number): Promise<string>;
  generateDownloadUrl(key: string, expiresIn?: number): Promise<string>;
  healthCheck(): Promise<StorageHealthCheck>;
  getProviderName(): string;
}

/**
 * Cloudflare R2 Provider - Backend Implementation
 */
export class CloudflareR2Provider implements IStorageProvider {
  private readonly logger: Logger;
  private readonly config: StorageConfig & {
    accessKey: string;
    secretKey: string;
    endpoint: string;
  };
  private s3Client: any;

  constructor(
    config: StorageConfig & { accessKey: string; secretKey: string; endpoint: string },
    logger?: Logger
  ) {
    this.config = config;
    this.logger = logger || Logger.getInstance();
    this.initializeClient();
  }

  private initializeClient(): void {
    try {
      const AWS = require('aws-sdk');
      
      this.s3Client = new AWS.S3({
        endpoint: this.config.endpoint,
        accessKeyId: this.config.accessKey,
        secretAccessKey: this.config.secretKey,
        region: this.config.region || 'auto',
        signatureVersion: 'v4',
        s3ForcePathStyle: true
      });

      this.logger.info('Cloudflare R2 client initialized', {
        bucket: this.config.bucket,
        region: this.config.region
      });

    } catch (error) {
      this.logger.error('Failed to initialize R2 client', { error });
      throw new StorageError(
        'Failed to initialize storage client',
        'INIT_ERROR',
        'cloudflare-r2',
        'initialize'
      );
    }
  }

  async upload(fileBuffer: Buffer, options: StorageUploadOptions): Promise<StorageUploadResult> {
    const startTime = Date.now();
    
    try {
      this.logger.debug('R2 upload initiated', {
        fileName: options.fileName,
        size: fileBuffer.length,
        contentType: options.contentType
      });

      const key = this.buildStorageKey(options.fileName, options.folder);
      
      const uploadParams = {
        Bucket: this.config.bucket,
        Key: key,
        Body: fileBuffer,
        ContentType: options.contentType,
        Metadata: {
          originalName: options.fileName,
          uploadedAt: new Date().toISOString(),
          ...options.metadata
        }
      };

      if (options.isPublic) {
        (uploadParams as any).ACL = 'public-read';
      }

      const result = await this.s3Client.upload(uploadParams).promise();
      const uploadTime = Date.now() - startTime;

      const uploadResult: StorageUploadResult = {
        id: this.generateFileId(),
        key,
        url: result.Location,
        cdnUrl: this.buildCdnUrl(key),
        size: fileBuffer.length,
        contentType: options.contentType,
        uploadedAt: new Date().toISOString(),
        metadata: options.metadata
      };

      this.logger.info('R2 upload completed', {
        key,
        size: fileBuffer.length,
        uploadTime: `${uploadTime}ms`
      });

      return uploadResult;

    } catch (error) {
      this.logger.error('R2 upload failed', {
        fileName: options.fileName,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      throw new StorageError(
        `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'UPLOAD_FAILED',
        'cloudflare-r2',
        'upload'
      );
    }
  }

  async uploadBatch(
    files: Array<{ buffer: Buffer; options: StorageUploadOptions }>
  ): Promise<StorageUploadResult[]> {
    try {
      this.logger.info('R2 batch upload initiated', { fileCount: files.length });

      const CONCURRENCY_LIMIT = 3;
      const results: StorageUploadResult[] = [];
      
      for (let i = 0; i < files.length; i += CONCURRENCY_LIMIT) {
        const batch = files.slice(i, i + CONCURRENCY_LIMIT);
        const promises = batch.map(file => 
          this.upload(file.buffer, file.options).catch(error => ({ error, file }))
        );
        
        const batchResults = await Promise.all(promises);
        
        batchResults.forEach((result:any, index: number) => {
          if ('error' in result) {
            this.logger.error('Batch item failed', {
              fileName: batch[index].options.fileName,
              error: result.error
            });
          } else {
            results.push(result);
          }
        });
      }

      this.logger.info('R2 batch upload completed', {
        requested: files.length,
        successful: results.length
      });

      return results;

    } catch (error) {
      this.logger.error('R2 batch upload failed', { error });
      throw new StorageError(
        'Batch upload failed',
        'BATCH_UPLOAD_FAILED',
        'cloudflare-r2',
        'uploadBatch'
      );
    }
  }

  async download(key: string): Promise<Buffer> {
    try {
      const result = await this.s3Client.getObject({
        Bucket: this.config.bucket,
        Key: key
      }).promise();

      return result.Body as Buffer;

    } catch (error: any) {
      if (error.code === 'NoSuchKey') {
        throw new StorageError('File not found', 'NOT_FOUND', 'cloudflare-r2', 'download');
      }
      throw new StorageError('Download failed', 'DOWNLOAD_FAILED', 'cloudflare-r2', 'download');
    }
  }

  async getFileInfo(key: string): Promise<StorageFileInfo> {
    try {
      const result = await this.s3Client.headObject({
        Bucket: this.config.bucket,
        Key: key
      }).promise();

      return {
        id: result.Metadata?.fileId || this.generateFileId(),
        key,
        url: this.buildPublicUrl(key),
        size: result.ContentLength,
        contentType: result.ContentType,
        lastModified: result.LastModified.toISOString(),
        metadata: result.Metadata
      };

    } catch (error: any) {
      if (error.code === 'NotFound') {
        throw new StorageError('File not found', 'NOT_FOUND', 'cloudflare-r2', 'getFileInfo');
      }
      throw new StorageError('Get file info failed', 'GET_INFO_FAILED', 'cloudflare-r2', 'getFileInfo');
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.s3Client.deleteObject({
        Bucket: this.config.bucket,
        Key: key
      }).promise();

      this.logger.info('File deleted from R2', { key });

    } catch (error) {
      this.logger.error('R2 delete failed', { key, error });
      throw new StorageError('Delete failed', 'DELETE_FAILED', 'cloudflare-r2', 'delete');
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      await this.getFileInfo(key);
      return true;
    } catch (error: any) {
      if (error instanceof StorageError && error.code === 'NOT_FOUND') {
        return false;
      }
      throw error;
    }
  }

  async generateUploadUrl(key: string, contentType: string, expiresIn = 3600): Promise<string> {
    try {
      const params = {
        Bucket: this.config.bucket,
        Key: key,
        ContentType: contentType,
        Expires: expiresIn
      };

      return this.s3Client.getSignedUrl('putObject', params);

    } catch (error) {
      throw new StorageError(
        'Failed to generate upload URL',
        'URL_GENERATION_FAILED',
        'cloudflare-r2',
        'generateUploadUrl'
      );
    }
  }

  async generateDownloadUrl(key: string, expiresIn = 3600): Promise<string> {
    try {
      const params = {
        Bucket: this.config.bucket,
        Key: key,
        Expires: expiresIn
      };

      return this.s3Client.getSignedUrl('getObject', params);

    } catch (error) {
      throw new StorageError(
        'Failed to generate download URL',
        'URL_GENERATION_FAILED',
        'cloudflare-r2',
        'generateDownloadUrl'
      );
    }
  }

  async healthCheck(): Promise<StorageHealthCheck> {
    const startTime = Date.now();
    
    try {
      await this.s3Client.headBucket({ Bucket: this.config.bucket }).promise();
      
      return {
        isHealthy: true,
        responseTime: Date.now() - startTime,
        provider: 'cloudflare-r2',
        region: this.config.region,
        lastChecked: new Date().toISOString()
      };

    } catch (error) {
      return {
        isHealthy: false,
        responseTime: Date.now() - startTime,
        provider: 'cloudflare-r2',
        region: this.config.region,
        lastChecked: new Date().toISOString()
      };
    }
  }

  getProviderName(): string {
    return 'cloudflare-r2';
  }

  // Stub implementations for remaining methods
  async listFiles(options?: StorageListOptions): Promise<StorageListResult> {
    // Implementation needed
    throw new Error('Method not implemented');
  }

  async deleteBatch(keys: string[]): Promise<void> {
    // Implementation needed
    throw new Error('Method not implemented');
  }

  // Private helper methods
  private buildStorageKey(fileName: string, folder?: string): string {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const ext = fileName.split('.').pop();
    const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
    const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9-_]/g, '_');
    
    const key = `${sanitizedName}_${timestamp}_${randomSuffix}.${ext}`;
    
    const basePath = folder || this.config.defaultFolder || 'uploads';
    return `${basePath}/${key}`;
  }

  private buildPublicUrl(key: string): string {
    if (this.config.cdnUrl) {
      return `${this.config.cdnUrl}/${key}`;
    }
    return `${this.config.endpoint}/${this.config.bucket}/${key}`;
  }

  private buildCdnUrl(key: string): string | undefined {
    return this.config.cdnUrl ? `${this.config.cdnUrl}/${key}` : undefined;
  }

  private generateFileId(): string {
    return `file_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  }
}