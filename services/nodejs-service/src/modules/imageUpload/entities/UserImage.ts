    // src/modules/imageUpload/entities/UserImage.ts

import {
  Entity,
  Column,
  PrimaryColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { DatifyyUsersLogin } from '../../../models/entities/DatifyyUsersLogin';

/**
 * UserImage Entity - Database Schema
 * 
 * Represents uploaded images for users in the dating platform.
 * Following the same patterns as your existing entities.
 */
@Entity('user_images')
@Index(['userId', 'isDeleted'])
@Index(['userId', 'category', 'isDeleted'])
@Index(['userId', 'isPrimary', 'isDeleted'])
@Index(['storageKey'], { unique: true })
@Index(['uploadedAt'])
@Index(['size'])
export class UserImage {
  @PrimaryColumn('uuid')
  id: string;

  @Column('integer', { name: 'user_id' })
  @Index()
  userId: number;

  @Column('varchar', { name: 'storage_key', length: 500, unique: true })
  storageKey: string;

  @Column('varchar', { name: 'original_name', length: 255 })
  originalName: string;

  @Column('varchar', { name: 'file_name', length: 255 })
  fileName: string;

  @Column('bigint', { name: 'size' })
  size: number;

  @Column('varchar', { name: 'content_type', length: 100 })
  contentType: string;

  @Column('enum', {
    name: 'category',
    enum: ['profile', 'gallery', 'event', 'document'],
    default: 'profile'
  })
  category: string;

  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @Column('simple-array', { name: 'tags', nullable: true })
  tags: string[] | null;

  @Column('boolean', { name: 'is_primary', default: false })
  @Index()
  isPrimary: boolean;

  @Column('varchar', { name: 'url', length: 1000 })
  url: string;

  @Column('varchar', { name: 'cdn_url', length: 1000, nullable: true })
  cdnUrl: string | null;

  @Column('varchar', { name: 'thumbnail_url', length: 1000, nullable: true })
  thumbnailUrl: string | null;

  @Column('jsonb', { name: 'metadata', nullable: true })
  metadata: Record<string, any> | null;

  @CreateDateColumn({ 
    name: 'uploaded_at',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP'
  })
  @Index()
  uploadedAt: Date;

  @UpdateDateColumn({ 
    name: 'updated_at',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP'
  })
  updatedAt: Date;

  @Column('boolean', { name: 'is_deleted', default: false })
  @Index()
  isDeleted: boolean;

  @Column('timestamp with time zone', { name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  // Additional metadata fields for enhanced functionality
  @Column('varchar', { name: 'upload_source', length: 50, default: 'web' })
  uploadSource: string; // 'web', 'mobile', 'api'

  @Column('inet', { name: 'upload_ip', nullable: true })
  uploadIp: string | null;

  @Column('varchar', { name: 'user_agent', length: 500, nullable: true })
  userAgent: string | null;

  @Column('integer', { name: 'view_count', default: 0 })
  viewCount: number;

  @Column('timestamp with time zone', { name: 'last_viewed_at', nullable: true })
  lastViewedAt: Date | null;

  @Column('boolean', { name: 'is_processed', default: false })
  isProcessed: boolean; // For image processing status

  @Column('varchar', { name: 'processing_status', length: 50, default: 'pending' })
  processingStatus: string; // 'pending', 'processing', 'completed', 'failed'

  @Column('text', { name: 'processing_error', nullable: true })
  processingError: string | null;

  // Moderation fields
  @Column('boolean', { name: 'is_approved', default: true })
  isApproved: boolean;

  @Column('varchar', { name: 'moderation_status', length: 50, default: 'approved' })
  moderationStatus: string; // 'pending', 'approved', 'rejected', 'flagged'

  @Column('text', { name: 'moderation_notes', nullable: true })
  moderationNotes: string | null;

  @Column('integer', { name: 'moderated_by', nullable: true })
  moderatedBy: number | null;

  @Column('timestamp with time zone', { name: 'moderated_at', nullable: true })
  moderatedAt: Date | null;

  // Analytics fields
  @Column('integer', { name: 'download_count', default: 0 })
  downloadCount: number;

  @Column('integer', { name: 'share_count', default: 0 })
  shareCount: number;

  @Column('integer', { name: 'like_count', default: 0 })
  likeCount: number;

  // Image-specific metadata
  @Column('integer', { name: 'image_width', nullable: true })
  imageWidth: number | null;

  @Column('integer', { name: 'image_height', nullable: true })
  imageHeight: number | null;

  @Column('varchar', { name: 'image_format', length: 20, nullable: true })
  imageFormat: string | null; // 'jpeg', 'png', 'webp', etc.

  @Column('boolean', { name: 'has_transparency', default: false })
  hasTransparency: boolean;

  @Column('varchar', { name: 'color_space', length: 20, nullable: true })
  colorSpace: string | null; // 'sRGB', 'Adobe RGB', etc.

  @Column('integer', { name: 'quality_score', nullable: true })
  qualityScore: number | null; // 1-100, image quality assessment

  // Relationships
  @ManyToOne(() => DatifyyUsersLogin, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: DatifyyUsersLogin;

  // Computed properties for convenience
  get sizeInMB(): number {
    return this.size / (1024 * 1024);
  }

  get aspectRatio(): number | null {
    if (this.imageWidth && this.imageHeight) {
      return this.imageWidth / this.imageHeight;
    }
    return null;
  }

  get isImage(): boolean {
    return this.contentType.startsWith('image/');
  }

  get isVideo(): boolean {
    return this.contentType.startsWith('video/');
  }

  get fileExtension(): string {
    return this.originalName.split('.').pop()?.toLowerCase() || '';
  }

  get isRecentUpload(): boolean {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return this.uploadedAt > sevenDaysAgo;
  }

  // Helper methods
  addView(): void {
    this.viewCount += 1;
    this.lastViewedAt = new Date();
  }

  addDownload(): void {
    this.downloadCount += 1;
  }

  addShare(): void {
    this.shareCount += 1;
  }

  addLike(): void {
    this.likeCount += 1;
  }

  setProcessingStatus(status: string, error?: string): void {
    this.processingStatus = status;
    this.isProcessed = status === 'completed';
    this.processingError = error || null;
  }

  setModerationStatus(
    status: string, 
    moderatedBy: number, 
    notes?: string
  ): void {
    this.moderationStatus = status;
    this.isApproved = status === 'approved';
    this.moderatedBy = moderatedBy;
    this.moderatedAt = new Date();
    this.moderationNotes = notes || null;
  }

  setImageDimensions(width: number, height: number): void {
    this.imageWidth = width;
    this.imageHeight = height;
  }

  updateMetadata(newMetadata: Record<string, any>): void {
    this.metadata = {
      ...this.metadata,
      ...newMetadata
    };
  }

  softDelete(): void {
    this.isDeleted = true;
    this.deletedAt = new Date();
    this.isPrimary = false; // Remove primary status when deleted
  }

  restore(): void {
    this.isDeleted = false;
    this.deletedAt = null;
  }

  setPrimary(isPrimary: boolean): void {
    this.isPrimary = isPrimary;
  }

  // Validation methods
  isOwnedBy(userId: number): boolean {
    return this.userId === userId;
  }

  canBeDeleted(): boolean {
    return !this.isDeleted;
  }

  canBeModified(): boolean {
    return !this.isDeleted && this.moderationStatus !== 'rejected';
  }

  canBeViewed(): boolean {
    return !this.isDeleted && this.isApproved;
  }

  // Search helper
  matchesSearch(query: string): boolean {
    const searchTerms = query.toLowerCase().split(' ');
    const searchableText = [
      this.originalName,
      this.description || '',
      ...(this.tags || [])
    ].join(' ').toLowerCase();

    return searchTerms.every(term => searchableText.includes(term));
  }

  // JSON serialization for API responses
  toJSON(): any {
    return {
      id: this.id,
      userId: this.userId,
      originalName: this.originalName,
      fileName: this.fileName,
      size: this.size,
      sizeInMB: this.sizeInMB,
      contentType: this.contentType,
      category: this.category,
      description: this.description,
      tags: this.tags,
      isPrimary: this.isPrimary,
      url: this.url,
      cdnUrl: this.cdnUrl,
      thumbnailUrl: this.thumbnailUrl,
      imageWidth: this.imageWidth,
      imageHeight: this.imageHeight,
      aspectRatio: this.aspectRatio,
      uploadedAt: this.uploadedAt,
      updatedAt: this.updatedAt,
      isProcessed: this.isProcessed,
      processingStatus: this.processingStatus,
      moderationStatus: this.moderationStatus,
      isApproved: this.isApproved,
      viewCount: this.viewCount,
      qualityScore: this.qualityScore,
      isRecentUpload: this.isRecentUpload
    };
  }
}