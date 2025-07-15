#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const OUTPUT_DIR = './services/nodejs-service/src/proto-types';

// Ensure output directory exists
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

// Generate TypeScript types manually
function generateTypes() {
  console.log('🚀 Generating TypeScript types from Protocol Buffers...');
  
  // Ensure output directory exists
  ensureDirectoryExists(OUTPUT_DIR);
  ensureDirectoryExists(path.join(OUTPUT_DIR, 'common'));
  ensureDirectoryExists(path.join(OUTPUT_DIR, 'admin'));
  ensureDirectoryExists(path.join(OUTPUT_DIR, 'user'));
  ensureDirectoryExists(path.join(OUTPUT_DIR, 'dating'));
  
  // Generate common types
  generateCommonTypes();
  
  // Generate admin types
  generateAdminTypes();
  
  // Generate user types
  generateUserTypes();
  
  // Generate dating types
  generateDatingTypes();
  
  // Generate main index
  generateMainIndex();
  
  console.log('\\n🎉 Proto types generation complete!');
  console.log(`📁 Types are available in: ${OUTPUT_DIR}`);
  console.log('\\n💡 Usage example:');
  console.log("import { NotificationResponse } from '../proto-types/admin/notifications';");
}

function generateCommonTypes() {
  // Base types
  const baseTypes = `// Auto-generated from proto/common/base.proto
// Generated at: ${new Date().toISOString()}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: ErrorDetails;
  metadata?: ResponseMetadata;
}

export interface ErrorDetails {
  code: string;
  message: string;
  details?: any;
}

export interface ResponseMetadata {
  requestId: string;
  timestamp: string;
  processingTime?: number;
}

export interface PaginationRequest {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Timestamps {
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationInfo {
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  coordinates?: Coordinates;
}
`;
  
  // Enums
  const enumTypes = `// Auto-generated from proto/common/enums.proto
// Generated at: ${new Date().toISOString()}

export enum UserStatus {
  UNSPECIFIED = 'UNSPECIFIED',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED',
}

export enum Gender {
  UNSPECIFIED = 'UNSPECIFIED',
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  NON_BINARY = 'NON_BINARY',
  OTHER = 'OTHER',
}

export enum RelationshipStage {
  UNSPECIFIED = 'UNSPECIFIED',
  SINGLE = 'SINGLE',
  DATING = 'DATING',
  EXCLUSIVE = 'EXCLUSIVE',
  ENGAGED = 'ENGAGED',
  MARRIED = 'MARRIED',
}

export enum DateType {
  UNSPECIFIED = 'UNSPECIFIED',
  CASUAL = 'CASUAL',
  FORMAL = 'FORMAL',
  VIRTUAL = 'VIRTUAL',
  GROUP = 'GROUP',
  ACTIVITY = 'ACTIVITY',
}
`;
  
  fs.writeFileSync(path.join(OUTPUT_DIR, 'common', 'base.ts'), baseTypes);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'common', 'enums.ts'), enumTypes);
  
  // Common index
  const commonIndex = `export * from './base';
export * from './enums';
`;
  fs.writeFileSync(path.join(OUTPUT_DIR, 'common', 'index.ts'), commonIndex);
  
  console.log('✅ Generated common types');
}

function generateAdminTypes() {
  // Notifications
  const notificationTypes = `// Auto-generated from proto/admin/notifications.proto
// Generated at: ${new Date().toISOString()}

import { ApiResponse, PaginationRequest, PaginationResponse } from '../common';

export enum NotificationChannel {
  UNSPECIFIED = 'UNSPECIFIED',
  EMAIL = 'EMAIL',
  SLACK = 'SLACK',
  SMS = 'SMS',
  IN_APP = 'IN_APP',
  WEBHOOK = 'WEBHOOK',
  PUSH = 'PUSH',
}

export enum NotificationPriority {
  UNSPECIFIED = 'UNSPECIFIED',
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
  CRITICAL = 'CRITICAL',
}

export enum NotificationStatus {
  UNSPECIFIED = 'UNSPECIFIED',
  PENDING = 'PENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  BOUNCED = 'BOUNCED',
  OPENED = 'OPENED',
  CLICKED = 'CLICKED',
  UNSUBSCRIBED = 'UNSUBSCRIBED',
}

export enum NotificationTriggerEvent {
  UNSPECIFIED = 'UNSPECIFIED',
  NEW_USER_SIGNUP = 'NEW_USER_SIGNUP',
  USER_PROFILE_COMPLETED = 'USER_PROFILE_COMPLETED',
  DATE_CURATED = 'DATE_CURATED',
  DATE_CONFIRMED = 'DATE_CONFIRMED',
  DATE_CANCELLED = 'DATE_CANCELLED',
  PAYMENT_SUCCESSFUL = 'PAYMENT_SUCCESSFUL',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  SYSTEM_ERROR = 'SYSTEM_ERROR',
  ADMIN_LOGIN = 'ADMIN_LOGIN',
}

export enum NotificationFrequency {
  UNSPECIFIED = 'UNSPECIFIED',
  IMMEDIATE = 'IMMEDIATE',
  BATCHED_5MIN = 'BATCHED_5MIN',
  BATCHED_15MIN = 'BATCHED_15MIN',
  BATCHED_HOURLY = 'BATCHED_HOURLY',
  DAILY_DIGEST = 'DAILY_DIGEST',
  WEEKLY_DIGEST = 'WEEKLY_DIGEST',
  DISABLED = 'DISABLED',
}

export interface NotificationMetadata {
  resourceType?: string;
  resourceId?: string;
  userId?: number;
  userEmail?: string;
  userName?: string;
  adminId?: number;
  amount?: number;
  currency?: string;
  city?: string;
  dateTime?: string;
  additionalData?: Record<string, string>;
  templateVariables?: Record<string, string>;
  actionUrl?: string;
  actionText?: string;
}

export interface BaseNotification {
  id: string;
  triggerEvent: NotificationTriggerEvent;
  channel: NotificationChannel;
  priority: NotificationPriority;
  title: string;
  message: string;
  metadata: NotificationMetadata;
  status: NotificationStatus;
  recipientAdminId?: number;
  recipientChannel?: string;
  createdAt: string;
  sentAt?: string;
  deliveredAt?: string;
  failureReason?: string;
  retryCount: number;
  maxRetries: number;
}

export interface EmailTemplate {
  subject: string;
  htmlContent: string;
  textContent: string;
  fromName: string;
  fromEmail: string;
  replyTo?: string;
  variables: string[];
}

export interface SlackTemplate {
  channel: string;
  message: string;
  iconEmoji?: string;
  username?: string;
  variables: string[];
}

export interface SmsTemplate {
  message: string;
  maxLength: number;
  variables: string[];
}

export interface InAppTemplate {
  title: string;
  message: string;
  icon: string;
  actionText: string;
  actionUrl: string;
  category: string;
  variables: string[];
}

export interface NotificationCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in' | 'not_in';
  value: string;
  logicalOperator?: 'AND' | 'OR';
}

export interface NotificationTemplate {
  id: string;
  name: string;
  triggerEvent: NotificationTriggerEvent;
  channels: NotificationChannel[];
  isActive: boolean;
  email?: EmailTemplate;
  slack?: SlackTemplate;
  sms?: SmsTemplate;
  inApp?: InAppTemplate;
  frequency: NotificationFrequency;
  priority: NotificationPriority;
  conditions: NotificationCondition[];
  createdAt: string;
  updatedAt: string;
  createdBy: number;
}

// Request interfaces
export interface CreateNotificationRequest {
  triggerEvent: NotificationTriggerEvent;
  channels: NotificationChannel[];
  priority: NotificationPriority;
  title: string;
  message: string;
  metadata: NotificationMetadata;
  recipientAdminIds?: number[];
  recipientChannels?: string[];
  scheduledAt?: string;
  templateId?: string;
  templateVariables?: Record<string, string>;
}

export interface GetNotificationsRequest {
  channels?: NotificationChannel[];
  triggerEvents?: NotificationTriggerEvent[];
  statuses?: NotificationStatus[];
  priorities?: NotificationPriority[];
  startDate?: string;
  endDate?: string;
  recipientAdminId?: number;
  isRead?: boolean;
  pagination?: PaginationRequest;
}

export interface UpdateNotificationRequest {
  notificationId: string;
  status?: NotificationStatus;
  retryCount?: number;
  failureReason?: string;
  deliveredAt?: string;
  metadata?: NotificationMetadata;
}

export interface CreateNotificationTemplateRequest {
  name: string;
  triggerEvent: NotificationTriggerEvent;
  channels: NotificationChannel[];
  priority: NotificationPriority;
  isActive?: boolean;
  email?: EmailTemplate;
  slack?: SlackTemplate;
  sms?: SmsTemplate;
  inApp?: InAppTemplate;
  frequency?: NotificationFrequency;
  conditions?: NotificationCondition[];
}

export interface UpdateNotificationTemplateRequest {
  templateId: string;
  name?: string;
  triggerEvent?: NotificationTriggerEvent;
  channels?: NotificationChannel[];
  priority?: NotificationPriority;
  isActive?: boolean;
  email?: EmailTemplate;
  slack?: SlackTemplate;
  sms?: SmsTemplate;
  inApp?: InAppTemplate;
  frequency?: NotificationFrequency;
  conditions?: NotificationCondition[];
}

export interface TestNotificationRequest {
  channel: NotificationChannel;
  recipient: string;
  templateId?: string;
  templateVariables?: Record<string, string>;
  customMessage?: string;
}

export interface BulkNotificationRecipient {
  adminId?: number;
  channel: string;
  templateVariables?: Record<string, string>;
}

export interface BulkNotificationRequest {
  templateId: string;
  recipients: BulkNotificationRecipient[];
  scheduledAt?: string;
  priority: NotificationPriority;
  metadata: NotificationMetadata;
}

// Response interfaces
export interface NotificationResponse extends ApiResponse<BaseNotification> {}

export interface NotificationsSummary {
  unreadCount: number;
  criticalCount: number;
  recentActivity: number;
}

export interface NotificationsListResponse extends ApiResponse<{
  notifications: BaseNotification[];
  pagination: PaginationResponse;
  summary: NotificationsSummary;
}> {}

export interface NotificationTemplateResponse extends ApiResponse<NotificationTemplate> {}

export interface BulkNotificationResult {
  recipient: string;
  notificationId?: string;
  success: boolean;
  error?: string;
}

export interface BulkNotificationResponse extends ApiResponse<{
  batchId: string;
  totalRequested: number;
  successful: number;
  failed: number;
  results: BulkNotificationResult[];
  estimatedCost: number;
}> {}
`;
  
  fs.writeFileSync(path.join(OUTPUT_DIR, 'admin', 'notifications.ts'), notificationTypes);
  
  // Admin index
  const adminIndex = `export * from './notifications';
`;
  fs.writeFileSync(path.join(OUTPUT_DIR, 'admin', 'index.ts'), adminIndex);
  
  console.log('✅ Generated admin types');
}

function generateUserTypes() {
  const userIndex = `// Placeholder for user types
export interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}
`;
  fs.writeFileSync(path.join(OUTPUT_DIR, 'user', 'index.ts'), userIndex);
  
  console.log('✅ Generated user types');
}

function generateDatingTypes() {
  const datingIndex = `// Placeholder for dating types
export interface CuratedDate {
  id: string;
  user1Id: number;
  user2Id: number;
}
`;
  fs.writeFileSync(path.join(OUTPUT_DIR, 'dating', 'index.ts'), datingIndex);
  
  console.log('✅ Generated dating types');
}

function generateMainIndex() {
  const mainIndexContent = `// Auto-generated index file for proto types
// Generated at: ${new Date().toISOString()}

// Common types
export * from './common';

// Admin types
export * from './admin';

// User types
export * from './user';

// Dating types
export * from './dating';
`;
  
  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.ts'), mainIndexContent);
  console.log('✅ Created main index file');
}

// Main execution
if (require.main === module) {
  try {
    generateTypes();
  } catch (error) {
    console.error('❌ Failed to generate proto types:', error.message);
    process.exit(1);
  }
}

module.exports = { generateTypes };