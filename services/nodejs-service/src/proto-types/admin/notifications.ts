// Auto-generated from proto/admin/notifications.proto
// Generated at: 2025-07-15T14:41:46.186Z

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

export interface NotificationAnalyticsResponse extends ApiResponse<{
  totalNotifications: number;
  totalSent: number;
  totalDelivered: number;
  totalFailed: number;
  deliveryRate: number;
  averageDeliveryTime: number;
  channelPerformance: Record<string, number>;
  eventPerformance: Record<string, number>;
  trends: Array<{ date: string; count: number; }>;
}> {}
