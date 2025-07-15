/**
 * Admin Notifications Interfaces
 * Real-time notifications for Slack, Email, and In-App alerts
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */

// =============================================================================
// NOTIFICATION ENUMS
// =============================================================================

/**
 * Notification delivery channels
 */
export enum NotificationChannel {
  EMAIL = 'email',
  SLACK = 'slack',
  IN_APP = 'in_app',
  SMS = 'sms',
  WEBHOOK = 'webhook',
  PUSH = 'push',
}

/**
 * Notification trigger events
 */
export enum NotificationTriggerEvent {
  // User Events
  NEW_USER_SIGNUP = 'new_user_signup',
  USER_PROFILE_COMPLETED = 'user_profile_completed',
  USER_EMAIL_VERIFIED = 'user_email_verified',
  USER_PHONE_VERIFIED = 'user_phone_verified',
  USER_DELETED_ACCOUNT = 'user_deleted_account',
  USER_REPORTED = 'user_reported',
  
  // Date Events
  DATE_CURATED = 'date_curated',
  DATE_CONFIRMED = 'date_confirmed',
  DATE_CANCELLED = 'date_cancelled',
  DATE_CANCELLED_LAST_MINUTE = 'date_cancelled_last_minute',
  DATE_COMPLETED = 'date_completed',
  DATE_NO_SHOW = 'date_no_show',
  DATE_FEEDBACK_SUBMITTED = 'date_feedback_submitted',
  DATE_SAFETY_CONCERN = 'date_safety_concern',
  
  // Payment Events
  PAYMENT_SUCCESSFUL = 'payment_successful',
  PAYMENT_FAILED = 'payment_failed',
  REFUND_REQUESTED = 'refund_requested',
  REFUND_PROCESSED = 'refund_processed',
  HIGH_VALUE_TRANSACTION = 'high_value_transaction',
  CHARGEBACK_RECEIVED = 'chargeback_received',
  
  // System Events
  SYSTEM_ERROR = 'system_error',
  DATABASE_SLOW = 'database_slow',
  API_RATE_LIMIT_EXCEEDED = 'api_rate_limit_exceeded',
  STORAGE_QUOTA_WARNING = 'storage_quota_warning',
  EMAIL_DELIVERY_FAILED = 'email_delivery_failed',
  
  // Revenue Events
  DAILY_REVENUE_TARGET_MET = 'daily_revenue_target_met',
  MONTHLY_REVENUE_TARGET_MET = 'monthly_revenue_target_met',
  REVENUE_DROP_DETECTED = 'revenue_drop_detected',
  NEW_PAYING_USER = 'new_paying_user',
  
  // Trust & Safety Events
  LOW_TRUST_SCORE = 'low_trust_score',
  MULTIPLE_CANCELLATIONS = 'multiple_cancellations',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  FAKE_PROFILE_DETECTED = 'fake_profile_detected',
  
  // Admin Events
  ADMIN_LOGIN = 'admin_login',
  ADMIN_LOGIN_FAILED = 'admin_login_failed',
  ADMIN_PERMISSION_CHANGED = 'admin_permission_changed',
  ADMIN_ACTION_HIGH_RISK = 'admin_action_high_risk',
}

/**
 * Notification priority levels
 */
export enum NotificationPriority {
  LOW = 1,
  NORMAL = 2,
  HIGH = 3,
  URGENT = 4,
  CRITICAL = 5,
}

/**
 * Notification status
 */
export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  BOUNCED = 'bounced',
  OPENED = 'opened',
  CLICKED = 'clicked',
  UNSUBSCRIBED = 'unsubscribed',
}

/**
 * Notification frequency settings
 */
export enum NotificationFrequency {
  IMMEDIATE = 'immediate',
  BATCHED_5MIN = 'batched_5min',
  BATCHED_15MIN = 'batched_15min',
  BATCHED_HOURLY = 'batched_hourly',
  DAILY_DIGEST = 'daily_digest',
  WEEKLY_DIGEST = 'weekly_digest',
  DISABLED = 'disabled',
}

/**
 * Slack notification types
 */
export enum SlackNotificationType {
  MESSAGE = 'message',
  ALERT = 'alert',
  MENTION = 'mention',
  THREAD_REPLY = 'thread_reply',
  DIRECT_MESSAGE = 'direct_message',
}

// =============================================================================
// CORE NOTIFICATION INTERFACES
// =============================================================================

/**
 * Base notification interface
 */
export interface BaseNotification {
  readonly id: string;
  readonly triggerEvent: NotificationTriggerEvent;
  readonly channel: NotificationChannel;
  readonly priority: NotificationPriority;
  readonly title: string;
  readonly message: string;
  readonly metadata: NotificationMetadata;
  readonly status: NotificationStatus;
  readonly recipientAdminId?: number;
  readonly recipientChannel?: string; // Email address or Slack channel
  readonly createdAt: string;
  readonly sentAt?: string;
  readonly deliveredAt?: string;
  readonly failureReason?: string;
  readonly retryCount: number;
  readonly maxRetries: number;
}

/**
 * Notification metadata for context and templating
 */
export interface NotificationMetadata {
  readonly resourceType?: string; // 'user', 'date', 'transaction', etc.
  readonly resourceId?: string;
  readonly userId?: number;
  readonly userEmail?: string;
  readonly userName?: string;
  readonly adminId?: number;
  readonly amount?: number;
  readonly currency?: string;
  readonly city?: string;
  readonly dateTime?: string;
  readonly additionalData?: Record<string, any>;
  readonly templateVariables?: Record<string, string>;
  readonly actionUrl?: string;
  readonly actionText?: string;
}

/**
 * Email notification specific data
 */
export interface EmailNotification extends BaseNotification {
  readonly channel: NotificationChannel.EMAIL;
  readonly emailData: {
    readonly to: string[];
    readonly cc?: string[];
    readonly bcc?: string[];
    readonly subject: string;
    readonly htmlContent: string;
    readonly textContent: string;
    readonly attachments?: EmailAttachment[];
    readonly templateId?: string;
    readonly customHeaders?: Record<string, string>;
  };
  readonly emailMetrics: {
    readonly opened: boolean;
    readonly openedAt?: string;
    readonly clicked: boolean;
    readonly clickedAt?: string;
    readonly bounced: boolean;
    readonly unsubscribed: boolean;
  };
}

/**
 * Email attachment interface
 */
export interface EmailAttachment {
  readonly filename: string;
  readonly content: string; // Base64 encoded
  readonly contentType: string;
  readonly size: number; // bytes
}

/**
 * Slack notification specific data
 */
export interface SlackNotification extends BaseNotification {
  readonly channel: NotificationChannel.SLACK;
  readonly slackData: {
    readonly channel: string; // #channel-name or @username
    readonly type: SlackNotificationType;
    readonly blocks?: SlackBlock[];
    readonly attachments?: SlackAttachment[];
    readonly threadTs?: string; // For thread replies
    readonly iconEmoji?: string;
    readonly iconUrl?: string;
    readonly username?: string;
    readonly mentionUsers?: string[];
    readonly mentionChannels?: string[];
  };
  readonly slackMetrics: {
    readonly messageTs?: string; // Slack timestamp
    readonly reactions?: SlackReaction[];
    readonly replies?: number;
    readonly lastReadAt?: string;
  };
}

/**
 * Slack block structure for rich formatting
 */
export interface SlackBlock {
  readonly type: string;
  readonly text?: {
    readonly type: string;
    readonly text: string;
  };
  readonly elements?: any[];
  readonly accessory?: any;
}

/**
 * Slack attachment for legacy formatting
 */
export interface SlackAttachment {
  readonly color: string; // 'good', 'warning', 'danger', or hex color
  readonly title: string;
  readonly title_link?: string;
  readonly text: string;
  readonly fields?: Array<{
    readonly title: string;
    readonly value: string;
    readonly short: boolean;
  }>;
  readonly footer?: string;
  readonly footer_icon?: string;
  readonly ts?: number; // Unix timestamp
}

/**
 * Slack reaction tracking
 */
export interface SlackReaction {
  readonly emoji: string;
  readonly count: number;
  readonly users: string[];
}

/**
 * In-app notification
 */
export interface InAppNotification extends BaseNotification {
  readonly channel: NotificationChannel.IN_APP;
  readonly inAppData: {
    readonly icon: string;
    readonly iconColor: string;
    readonly actionUrl: string;
    readonly actionText: string;
    readonly category: string; // 'system', 'user', 'revenue', etc.
    readonly isRead: boolean;
    readonly readAt?: string;
    readonly isDismissible: boolean;
    readonly autoExpire: boolean;
    readonly expiresAt?: string;
  };
}

/**
 * SMS notification
 */
export interface SmsNotification extends BaseNotification {
  readonly channel: NotificationChannel.SMS;
  readonly smsData: {
    readonly phoneNumber: string;
    readonly message: string; // Limited to SMS character limits
    readonly countryCode: string;
    readonly messageId?: string; // From SMS provider
    readonly segments: number; // Number of SMS segments
    readonly cost?: number; // Cost in credits/currency
  };
}

/**
 * Webhook notification
 */
export interface WebhookNotification extends BaseNotification {
  readonly channel: NotificationChannel.WEBHOOK;
  readonly webhookData: {
    readonly url: string;
    readonly method: 'POST' | 'PUT' | 'PATCH';
    readonly headers: Record<string, string>;
    readonly payload: Record<string, any>;
    readonly timeout: number; // milliseconds
    readonly retryStrategy: 'exponential' | 'linear' | 'none';
    readonly responseStatus?: number;
    readonly responseBody?: string;
    readonly responseTime?: number; // milliseconds
  };
}

// =============================================================================
// NOTIFICATION TEMPLATES
// =============================================================================

/**
 * Notification template for reusable notifications
 */
export interface NotificationTemplate {
  readonly id: string;
  readonly name: string;
  readonly triggerEvent: NotificationTriggerEvent;
  readonly channels: NotificationChannel[];
  readonly isActive: boolean;
  readonly conditions: NotificationCondition[];
  readonly templates: {
    readonly email?: EmailTemplate;
    readonly slack?: SlackTemplate;
    readonly sms?: SmsTemplate;
    readonly inApp?: InAppTemplate;
  };
  readonly frequency: NotificationFrequency;
  readonly priority: NotificationPriority;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly createdBy: number;
}

/**
 * Email template structure
 */
export interface EmailTemplate {
  readonly subject: string;
  readonly htmlContent: string;
  readonly textContent: string;
  readonly fromName: string;
  readonly fromEmail: string;
  readonly replyTo?: string;
  readonly variables: string[]; // List of template variables like {{user_name}}
}

/**
 * Slack template structure
 */
export interface SlackTemplate {
  readonly channel: string;
  readonly message: string;
  readonly blocks?: SlackBlock[];
  readonly type: SlackNotificationType;
  readonly iconEmoji?: string;
  readonly username?: string;
  readonly variables: string[];
}

/**
 * SMS template structure
 */
export interface SmsTemplate {
  readonly message: string;
  readonly maxLength: number;
  readonly variables: string[];
}

/**
 * In-app template structure
 */
export interface InAppTemplate {
  readonly title: string;
  readonly message: string;
  readonly icon: string;
  readonly actionText: string;
  readonly actionUrl: string;
  readonly category: string;
  readonly variables: string[];
}

/**
 * Notification condition for triggering
 */
export interface NotificationCondition {
  readonly field: string; // e.g., 'amount', 'user.trust_score', 'city'
  readonly operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in' | 'not_in';
  readonly value: any;
  readonly logicalOperator?: 'AND' | 'OR'; // For chaining conditions
}

// =============================================================================
// NOTIFICATION SETTINGS & PREFERENCES
// =============================================================================

/**
 * Admin notification preferences
 */
export interface AdminNotificationPreferences {
  readonly adminId: number;
  readonly channels: {
    readonly email: ChannelPreference;
    readonly slack: ChannelPreference;
    readonly inApp: ChannelPreference;
    readonly sms: ChannelPreference;
  };
  readonly eventPreferences: Record<NotificationTriggerEvent, EventPreference>;
  readonly quietHours: QuietHours;
  readonly timezone: string;
  readonly language: string;
  readonly updatedAt: string;
}

/**
 * Channel-specific preferences
 */
export interface ChannelPreference {
  readonly enabled: boolean;
  readonly frequency: NotificationFrequency;
  readonly minimumPriority: NotificationPriority;
  readonly recipientAddress?: string; // Email or Slack username
  readonly customSettings?: Record<string, any>;
}

/**
 * Event-specific preferences
 */
export interface EventPreference {
  readonly enabled: boolean;
  readonly channels: NotificationChannel[];
  readonly frequency: NotificationFrequency;
  readonly conditions?: NotificationCondition[];
  readonly customMessage?: string;
}

/**
 * Quiet hours configuration
 */
export interface QuietHours {
  readonly enabled: boolean;
  readonly startTime: string; // HH:MM format
  readonly endTime: string; // HH:MM format
  readonly timezone: string;
  readonly daysOfWeek: number[]; // 0=Sunday, 1=Monday, etc.
  readonly emergencyOverride: boolean; // Allow critical notifications
}

// =============================================================================
// NOTIFICATION ANALYTICS
// =============================================================================

/**
 * Notification analytics overview
 */
export interface NotificationAnalytics {
  readonly summary: NotificationSummary;
  readonly channelPerformance: ChannelPerformance[];
  readonly eventPerformance: EventPerformance[];
  readonly deliveryMetrics: DeliveryMetrics;
  readonly engagementMetrics: EngagementMetrics;
  readonly trends: NotificationTrends;
  readonly failureAnalysis: FailureAnalysis;
  readonly period: AnalyticsPeriod;
}

/**
 * Notification summary metrics
 */
export interface NotificationSummary {
  readonly totalSent: number;
  readonly totalDelivered: number;
  readonly totalFailed: number;
  readonly deliveryRate: number; // Percentage
  readonly averageDeliveryTime: number; // Milliseconds
  readonly totalCost: number;
  readonly costPerNotification: number;
}

/**
 * Channel performance metrics
 */
export interface ChannelPerformance {
  readonly channel: NotificationChannel;
  readonly sent: number;
  readonly delivered: number;
  readonly failed: number;
  readonly deliveryRate: number;
  readonly averageDeliveryTime: number;
  readonly cost: number;
  readonly engagement: {
    readonly opened?: number;
    readonly clicked?: number;
    readonly replied?: number;
  };
}

/**
 * Event performance metrics
 */
export interface EventPerformance {
  readonly event: NotificationTriggerEvent;
  readonly sent: number;
  readonly delivered: number;
  readonly averageEngagement: number;
  readonly conversionRate: number; // If applicable
  readonly topChannel: NotificationChannel;
}

/**
 * Delivery metrics
 */
export interface DeliveryMetrics {
  readonly averageDeliveryTime: number;
  readonly deliveryTimeByChannel: Record<NotificationChannel, number>;
  readonly failureReasons: Record<string, number>;
  readonly retrySuccessRate: number;
  readonly bounceRate: number;
}

/**
 * Engagement metrics
 */
export interface EngagementMetrics {
  readonly openRate: number; // Email/In-app
  readonly clickRate: number; // Email/In-app
  readonly replyRate: number; // Slack/Email
  readonly unsubscribeRate: number; // Email
  readonly actionTakenRate: number; // In-app
  readonly averageEngagementTime: number;
}

/**
 * Notification trends
 */
export interface NotificationTrends {
  readonly volumeByDay: Array<{ date: string; count: number; }>;
  readonly deliveryRateByDay: Array<{ date: string; rate: number; }>;
  readonly engagementByDay: Array<{ date: string; engagement: number; }>;
  readonly costByDay: Array<{ date: string; cost: number; }>;
}

/**
 * Failure analysis
 */
export interface FailureAnalysis {
  readonly topFailureReasons: Array<{
    readonly reason: string;
    readonly count: number;
    readonly percentage: number;
  }>;
  readonly failuresByChannel: Record<NotificationChannel, number>;
  readonly failuresByEvent: Record<NotificationTriggerEvent, number>;
  readonly recoveryRate: number; // Percentage of failures that succeeded on retry
}

/**
 * Analytics period specification
 */
export interface AnalyticsPeriod {
  readonly startDate: string;
  readonly endDate: string;
  readonly granularity: 'hourly' | 'daily' | 'weekly';
}

// =============================================================================
// REQUEST INTERFACES
// =============================================================================

/**
 * Create notification request
 */
export interface CreateNotificationRequest {
  readonly triggerEvent: NotificationTriggerEvent;
  readonly channels: NotificationChannel[];
  readonly priority: NotificationPriority;
  readonly title: string;
  readonly message: string;
  readonly metadata: NotificationMetadata;
  readonly recipientAdminIds?: number[];
  readonly recipientChannels?: string[];
  readonly scheduledAt?: string; // For delayed notifications
  readonly templateId?: string;
  readonly templateVariables?: Record<string, string>;
}

/**
 * Get notifications request
 */
export interface GetNotificationsRequest {
  readonly channels?: NotificationChannel[];
  readonly triggerEvents?: NotificationTriggerEvent[];
  readonly statuses?: NotificationStatus[];
  readonly priorities?: NotificationPriority[];
  readonly startDate?: string;
  readonly endDate?: string;
  readonly recipientAdminId?: number;
  readonly isRead?: boolean;
  readonly page?: number;
  readonly limit?: number;
  readonly sortBy?: 'createdAt' | 'sentAt' | 'priority';
  readonly sortOrder?: 'asc' | 'desc';
}

/**
 * Update notification request
 */
export interface UpdateNotificationRequest {
  readonly notificationId: string;
  readonly status?: NotificationStatus;
  readonly retryCount?: number;
  readonly failureReason?: string;
  readonly deliveredAt?: string;
  readonly metadata?: Partial<NotificationMetadata>;
}

/**
 * Notification preferences update request
 */
export interface UpdateNotificationPreferencesRequest {
  readonly adminId: number;
  readonly channels?: Partial<AdminNotificationPreferences['channels']>;
  readonly eventPreferences?: Partial<Record<NotificationTriggerEvent, EventPreference>>;
  readonly quietHours?: Partial<QuietHours>;
  readonly timezone?: string;
  readonly language?: string;
}

/**
 * Create notification template request
 */
export interface CreateNotificationTemplateRequest {
  readonly name: string;
  readonly triggerEvent: NotificationTriggerEvent;
  readonly channels: NotificationChannel[];
  readonly priority: NotificationPriority;
  readonly isActive?: boolean;
  readonly templates: {
    readonly email?: EmailTemplate;
    readonly slack?: SlackTemplate;
    readonly sms?: SmsTemplate;
    readonly inApp?: InAppTemplate;
  };
  readonly frequency?: NotificationFrequency;
  readonly conditions?: NotificationCondition[];
}

/**
 * Update notification template request
 */
export interface UpdateNotificationTemplateRequest {
  readonly name?: string;
  readonly triggerEvent?: NotificationTriggerEvent;
  readonly channels?: NotificationChannel[];
  readonly priority?: NotificationPriority;
  readonly isActive?: boolean;
  readonly templates?: {
    readonly email?: EmailTemplate;
    readonly slack?: SlackTemplate;
    readonly sms?: SmsTemplate;
    readonly inApp?: InAppTemplate;
  };
  readonly frequency?: NotificationFrequency;
  readonly conditions?: NotificationCondition[];
}

/**
 * Test notification request
 */
export interface TestNotificationRequest {
  readonly channel: NotificationChannel;
  readonly recipient: string; // Email, Slack channel, etc.
  readonly templateId?: string;
  readonly templateVariables?: Record<string, string>;
  readonly customMessage?: string;
}

/**
 * Bulk notification request
 */
export interface BulkNotificationRequest {
  readonly templateId: string;
  readonly recipients: Array<{
    readonly adminId?: number;
    readonly channel: string;
    readonly templateVariables?: Record<string, string>;
  }>;
  readonly scheduledAt?: string;
  readonly priority: NotificationPriority;
  readonly metadata: NotificationMetadata;
}

// =============================================================================
// RESPONSE INTERFACES
// =============================================================================

/**
 * Notification response
 */
export interface NotificationResponse {
  readonly success: boolean;
  readonly data: BaseNotification;
  readonly message: string;
}

/**
 * Notifications list response
 */
export interface NotificationsListResponse {
  readonly success: boolean;
  readonly data: {
    readonly notifications: BaseNotification[];
    readonly pagination: {
      readonly page: number;
      readonly limit: number;
      readonly total: number;
      readonly totalPages: number;
    };
    readonly summary: {
      readonly unreadCount: number;
      readonly criticalCount: number;
      readonly recentActivity: number;
    };
  };
  readonly message: string;
}

/**
 * Notification analytics response
 */
export interface NotificationAnalyticsResponse {
  readonly success: boolean;
  readonly data: NotificationAnalytics;
  readonly message: string;
}

/**
 * Test notification response
 */
export interface TestNotificationResponse {
  readonly success: boolean;
  readonly data: {
    readonly notificationId: string;
    readonly sent: boolean;
    readonly deliveredAt?: string;
    readonly failureReason?: string;
    readonly cost?: number;
  };
  readonly message: string;
}

/**
 * Notification template response
 */
export interface NotificationTemplateResponse {
  readonly success: boolean;
  readonly data: NotificationTemplate;
  readonly message: string;
}

/**
 * Bulk notification response
 */
export interface BulkNotificationResponse {
  readonly success: boolean;
  readonly data: {
    readonly batchId: string;
    readonly totalRequested: number;
    readonly successful: number;
    readonly failed: number;
    readonly results: Array<{
      readonly recipient: string;
      readonly notificationId?: string;
      readonly success: boolean;
      readonly error?: string;
    }>;
    readonly estimatedCost: number;
  };
  readonly message: string;
}

// =============================================================================
// CONSTANTS AND HELPERS
// =============================================================================

/**
 * Notification constants
 */
export const NOTIFICATION_CONSTANTS = {
  MAX_EMAIL_RECIPIENTS: 100,
  MAX_SMS_LENGTH: 160,
  MAX_SLACK_BLOCKS: 50,
  DEFAULT_RETRY_ATTEMPTS: 3,
  BATCH_SIZE: 50,
  RATE_LIMIT_PER_MINUTE: 1000,
  MAX_TEMPLATE_VARIABLES: 20,
  ANALYTICS_RETENTION_DAYS: 90,
} as const;

/**
 * Get notification trigger event values
 */
export const getNotificationTriggerEventValues = (): NotificationTriggerEvent[] => 
  Object.values(NotificationTriggerEvent);

/**
 * Get notification channel values
 */
export const getNotificationChannelValues = (): NotificationChannel[] => 
  Object.values(NotificationChannel);

/**
 * Get notification priority values
 */
export const getNotificationPriorityValues = (): NotificationPriority[] => 
  [
    NotificationPriority.LOW,
    NotificationPriority.NORMAL,
    NotificationPriority.HIGH,
    NotificationPriority.URGENT,
    NotificationPriority.CRITICAL,
  ];

/**
 * Get notification status values
 */
export const getNotificationStatusValues = (): NotificationStatus[] => 
  Object.values(NotificationStatus);

/**
 * Helper to format notification message with variables
 */
export const formatNotificationMessage = (
  template: string, 
  variables: Record<string, string>
): string => {
  let formatted = template;
  Object.entries(variables).forEach(([key, value]) => {
    formatted = formatted.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });
  return formatted;
};

/**
 * Notification validation rules
 */
export const NotificationValidationRules = {
  MIN_TITLE_LENGTH: 5,
  MAX_TITLE_LENGTH: 200,
  MIN_MESSAGE_LENGTH: 10,
  MAX_MESSAGE_LENGTH: 2000,
  MAX_METADATA_SIZE: 5000, // bytes
  MAX_TEMPLATE_VARIABLES: 50,
  MIN_RETRY_DELAY: 60, // seconds
  MAX_RETRY_DELAY: 3600, // seconds
} as const;