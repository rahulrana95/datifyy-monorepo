#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const NODEJS_OUTPUT_DIR = './services/nodejs-service/src/proto-types';
const FRONTEND_OUTPUT_DIR = './apps/frontend/src/proto-types';

// Ensure output directory exists
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

// Generate comprehensive TypeScript types for all shared-types
function generateTypes() {
  console.log('🚀 Generating comprehensive TypeScript types from Protocol Buffers...');
  
  // Generate for nodejs service
  console.log('\n📦 Generating types for nodejs service...');
  generateTypesForProject(NODEJS_OUTPUT_DIR);
  
  // Generate for frontend
  console.log('\n📦 Generating types for frontend...');
  generateTypesForProject(FRONTEND_OUTPUT_DIR);
  
  console.log('\n🎉 Comprehensive proto types generation complete!');
  console.log(`📁 Backend types: ${NODEJS_OUTPUT_DIR}`);
  console.log(`📁 Frontend types: ${FRONTEND_OUTPUT_DIR}`);
}

function generateTypesForProject(outputDir) {
  // Ensure output directory exists
  ensureDirectoryExists(outputDir);
  ensureDirectoryExists(path.join(outputDir, 'common'));
  ensureDirectoryExists(path.join(outputDir, 'admin'));
  ensureDirectoryExists(path.join(outputDir, 'user'));
  ensureDirectoryExists(path.join(outputDir, 'dating'));
  
  // Generate all types
  generateCommonTypes(outputDir);
  generateAdminTypes(outputDir);
  generateUserTypes(outputDir);
  generateDatingTypes(outputDir);
  generateMainIndex(outputDir);
}

function generateCommonTypes(outputDir) {
  // Base API types
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
  formatted_address?: string;
  is_approximate?: boolean;
  timezone?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
}

export interface DistanceInfo {
  distance: number;
  unit: 'km' | 'miles';
}

export interface AgeInfo {
  age: number;
  dateOfBirth: string;
}

export interface LastSeenInfo {
  lastSeen: string;
  isOnline: boolean;
}
`;
  
  // Common enums
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

export enum AuthView {
  UNSPECIFIED = 'UNSPECIFIED',
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  RESET_PASSWORD = 'RESET_PASSWORD',
  VERIFY_EMAIL = 'VERIFY_EMAIL',
}

export enum SwipeAction {
  UNSPECIFIED = 'UNSPECIFIED',
  LIKE = 'LIKE',
  PASS = 'PASS',
  SUPER_LIKE = 'SUPER_LIKE',
}
`;
  
  // Storage types
  const storageTypes = `// Auto-generated from proto/common/storage.proto
// Generated at: ${new Date().toISOString()}

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
`;

  fs.writeFileSync(path.join(outputDir, 'common', 'base.ts'), baseTypes);
  fs.writeFileSync(path.join(outputDir, 'common', 'enums.ts'), enumTypes);
  fs.writeFileSync(path.join(outputDir, 'common', 'storage.ts'), storageTypes);
  
  // Common index
  const commonIndex = `export * from './base';
export * from './enums';
export * from './storage';
`;
  fs.writeFileSync(path.join(outputDir, 'common', 'index.ts'), commonIndex);
  
  console.log('✅ Generated common types');
}

function generateAdminTypes(outputDir) {
  // Admin enums
  const adminEnums = `// Auto-generated from proto/admin/enums.proto
// Generated at: ${new Date().toISOString()}

export enum AdminPermissionLevel {
  UNSPECIFIED = 'UNSPECIFIED',
  VIEWER = 'VIEWER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  OWNER = 'OWNER',
}

export enum AdminPermission {
  UNSPECIFIED = 'UNSPECIFIED',
  VIEW_USERS = 'VIEW_USERS',
  EDIT_USERS = 'EDIT_USERS',
  DELETE_USERS = 'DELETE_USERS',
  VERIFY_USERS = 'VERIFY_USERS',
  BAN_USERS = 'BAN_USERS',
  VIEW_REPORTS = 'VIEW_REPORTS',
  MODERATE_CONTENT = 'MODERATE_CONTENT',
  DELETE_CONTENT = 'DELETE_CONTENT',
  VIEW_EVENTS = 'VIEW_EVENTS',
  CREATE_EVENTS = 'CREATE_EVENTS',
  EDIT_EVENTS = 'EDIT_EVENTS',
  DELETE_EVENTS = 'DELETE_EVENTS',
  MANAGE_EVENT_REGISTRATIONS = 'MANAGE_EVENT_REGISTRATIONS',
  VIEW_TRANSACTIONS = 'VIEW_TRANSACTIONS',
  PROCESS_REFUNDS = 'PROCESS_REFUNDS',
  VIEW_REVENUE_REPORTS = 'VIEW_REVENUE_REPORTS',
  MANAGE_PRICING = 'MANAGE_PRICING',
  VIEW_ANALYTICS = 'VIEW_ANALYTICS',
  EXPORT_DATA = 'EXPORT_DATA',
  VIEW_SYSTEM_METRICS = 'VIEW_SYSTEM_METRICS',
  MANAGE_ADMINS = 'MANAGE_ADMINS',
  SYSTEM_CONFIG = 'SYSTEM_CONFIG',
  VIEW_LOGS = 'VIEW_LOGS',
  MANAGE_INTEGRATIONS = 'MANAGE_INTEGRATIONS',
}

export enum AdminSessionStatus {
  UNSPECIFIED = 'UNSPECIFIED',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  INVALIDATED = 'INVALIDATED',
  LOCKED = 'LOCKED',
  PENDING_2FA = 'PENDING_2FA',
}

export enum AdminTwoFactorMethod {
  UNSPECIFIED = 'UNSPECIFIED',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  TOTP = 'TOTP',
  HARDWARE_KEY = 'HARDWARE_KEY',
}

export enum AdminAccountStatus {
  UNSPECIFIED = 'UNSPECIFIED',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DEACTIVATED = 'DEACTIVATED',
  PENDING = 'PENDING',
  LOCKED = 'LOCKED',
}

export enum AdminActionType {
  UNSPECIFIED = 'UNSPECIFIED',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  LOGIN_FAILED = 'LOGIN_FAILED',
  PASSWORD_RESET = 'PASSWORD_RESET',
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',
  USER_BANNED = 'USER_BANNED',
  USER_VERIFIED = 'USER_VERIFIED',
  CONTENT_APPROVED = 'CONTENT_APPROVED',
  CONTENT_REJECTED = 'CONTENT_REJECTED',
  CONTENT_DELETED = 'CONTENT_DELETED',
  REPORT_RESOLVED = 'REPORT_RESOLVED',
  EVENT_CREATED = 'EVENT_CREATED',
  EVENT_UPDATED = 'EVENT_UPDATED',
  EVENT_DELETED = 'EVENT_DELETED',
  EVENT_CANCELLED = 'EVENT_CANCELLED',
  REFUND_PROCESSED = 'REFUND_PROCESSED',
  TRANSACTION_REVIEWED = 'TRANSACTION_REVIEWED',
  SYSTEM_CONFIG_CHANGED = 'SYSTEM_CONFIG_CHANGED',
  ADMIN_CREATED = 'ADMIN_CREATED',
  ADMIN_PERMISSIONS_CHANGED = 'ADMIN_PERMISSIONS_CHANGED',
}

export enum AdminRiskLevel {
  UNSPECIFIED = 'UNSPECIFIED',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum AdminLoginAttemptResult {
  UNSPECIFIED = 'UNSPECIFIED',
  SUCCESS = 'SUCCESS',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  ACCOUNT_SUSPENDED = 'ACCOUNT_SUSPENDED',
  REQUIRES_2FA = 'REQUIRES_2FA',
  INVALID_2FA = 'INVALID_2FA',
  RATE_LIMITED = 'RATE_LIMITED',
  IP_BLOCKED = 'IP_BLOCKED',
}

export enum RevenueTimePeriod {
  UNSPECIFIED = 'UNSPECIFIED',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
}

export enum RevenueCategory {
  UNSPECIFIED = 'UNSPECIFIED',
  SUBSCRIPTIONS = 'SUBSCRIPTIONS',
  EVENT_FEES = 'EVENT_FEES',
  PREMIUM_FEATURES = 'PREMIUM_FEATURES',
  ADVERTISING = 'ADVERTISING',
  PARTNERSHIPS = 'PARTNERSHIPS',
  OTHER = 'OTHER',
}

export enum TransactionStatus {
  UNSPECIFIED = 'UNSPECIFIED',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED',
  PROCESSING = 'PROCESSING',
}

export enum PaymentMethod {
  UNSPECIFIED = 'UNSPECIFIED',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  PAYPAL = 'PAYPAL',
  BANK_TRANSFER = 'BANK_TRANSFER',
  DIGITAL_WALLET = 'DIGITAL_WALLET',
  CRYPTOCURRENCY = 'CRYPTOCURRENCY',
}

export enum TrendDirection {
  UNSPECIFIED = 'UNSPECIFIED',
  UP = 'UP',
  DOWN = 'DOWN',
  STABLE = 'STABLE',
}

export enum MatchAlgorithm {
  UNSPECIFIED = 'UNSPECIFIED',
  COLLABORATIVE_FILTERING = 'COLLABORATIVE_FILTERING',
  CONTENT_BASED = 'CONTENT_BASED',
  HYBRID = 'HYBRID',
  MACHINE_LEARNING = 'MACHINE_LEARNING',
  RULE_BASED = 'RULE_BASED',
}

export enum CompatibilityFactor {
  UNSPECIFIED = 'UNSPECIFIED',
  INTERESTS = 'INTERESTS',
  LOCATION = 'LOCATION',
  AGE = 'AGE',
  EDUCATION = 'EDUCATION',
  LIFESTYLE = 'LIFESTYLE',
  VALUES = 'VALUES',
  PERSONALITY = 'PERSONALITY',
  COMMUNICATION_STYLE = 'COMMUNICATION_STYLE',
}

export enum MatchConfidenceLevel {
  UNSPECIFIED = 'UNSPECIFIED',
  VERY_LOW = 'VERY_LOW',
  LOW = 'LOW',
  MODERATE = 'MODERATE',
  HIGH = 'HIGH',
  VERY_HIGH = 'VERY_HIGH',
}

export enum DateSuccessPrediction {
  UNSPECIFIED = 'UNSPECIFIED',
  VERY_UNLIKELY = 'VERY_UNLIKELY',
  UNLIKELY = 'UNLIKELY',
  NEUTRAL = 'NEUTRAL',
  LIKELY = 'LIKELY',
  VERY_LIKELY = 'VERY_LIKELY',
}

export enum MatchSuggestionStatus {
  UNSPECIFIED = 'UNSPECIFIED',
  GENERATED = 'GENERATED',
  SENT = 'SENT',
  VIEWED = 'VIEWED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}
`;
  
  fs.writeFileSync(path.join(outputDir, 'admin', 'enums.ts'), adminEnums);
  
  // Notifications (keep the existing comprehensive notification types)
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
`;
  
  fs.writeFileSync(path.join(outputDir, 'admin', 'notifications.ts'), notificationTypes);
  
  // Dashboard types
  const dashboardTypes = `// Auto-generated from proto/admin/dashboard.proto
// Generated at: ${new Date().toISOString()}

import { ApiResponse, PaginationRequest, PaginationResponse } from '../common';
import { AdminPermissionLevel, AdminAccountStatus, RevenueTimePeriod, TrendDirection } from './enums';

export interface DashboardMetric {
  id: string;
  name: string;
  value: number;
  previousValue?: number;
  changePercentage?: number;
  trend: TrendDirection;
  unit?: string;
  description?: string;
  lastUpdated: string;
}

export interface DashboardWidget {
  id: string;
  title: string;
  type: 'metric' | 'chart' | 'table' | 'list';
  position: { x: number; y: number; width: number; height: number; };
  config: Record<string, any>;
  data: any;
  refreshInterval?: number;
  lastRefreshed: string;
}

export interface DashboardAlert {
  id: string;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'system' | 'user' | 'revenue' | 'performance';
  isRead: boolean;
  createdAt: string;
  expiresAt?: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface AdminDashboardOverview {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  totalRevenue: number;
  revenueToday: number;
  activeEvents: number;
  totalMatches: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
  alerts: DashboardAlert[];
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
    adminId?: number;
    adminName?: string;
  }>;
}

export interface RevenueMetrics {
  totalRevenue: number;
  revenueGrowth: number;
  averageOrderValue: number;
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  refundedTransactions: number;
  topRevenueStreams: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  revenueByTimePeriod: Array<{
    period: string;
    amount: number;
    transactionCount: number;
  }>;
}

export interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  verifiedUsers: number;
  suspendedUsers: number;
  userGrowthRate: number;
  averageSessionDuration: number;
  topUserLocations: Array<{
    location: string;
    count: number;
    percentage: number;
  }>;
  userDemographics: {
    ageGroups: Array<{ range: string; count: number; }>;
    genderDistribution: Array<{ gender: string; count: number; }>;
    educationLevels: Array<{ level: string; count: number; }>;
  };
}

export interface SystemMetrics {
  serverStatus: 'online' | 'offline' | 'maintenance';
  responseTime: number;
  uptime: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  databaseConnections: number;
  activeConnections: number;
  errorRate: number;
  apiCallsPerMinute: number;
}

// Request interfaces
export interface GetDashboardOverviewRequest {
  timePeriod?: RevenueTimePeriod;
  includeAlerts?: boolean;
  includeRecentActivity?: boolean;
}

export interface GetRevenueMetricsRequest {
  timePeriod: RevenueTimePeriod;
  startDate?: string;
  endDate?: string;
  categories?: string[];
}

export interface GetUserAnalyticsRequest {
  timePeriod: RevenueTimePeriod;
  startDate?: string;
  endDate?: string;
  includeDemographics?: boolean;
}

export interface GetSystemMetricsRequest {
  includeHistory?: boolean;
  timePeriod?: RevenueTimePeriod;
}

export interface CreateDashboardAlertRequest {
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'system' | 'user' | 'revenue' | 'performance';
  expiresAt?: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface UpdateDashboardAlertRequest {
  alertId: string;
  isRead?: boolean;
  title?: string;
  message?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  expiresAt?: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface GetDashboardAlertsRequest {
  severity?: 'low' | 'medium' | 'high' | 'critical';
  type?: 'system' | 'user' | 'revenue' | 'performance';
  isRead?: boolean;
  pagination?: PaginationRequest;
}

// Response interfaces
export interface DashboardOverviewResponse extends ApiResponse<AdminDashboardOverview> {}
export interface RevenueMetricsResponse extends ApiResponse<RevenueMetrics> {}
export interface UserAnalyticsResponse extends ApiResponse<UserAnalytics> {}
export interface SystemMetricsResponse extends ApiResponse<SystemMetrics> {}
export interface DashboardAlertResponse extends ApiResponse<DashboardAlert> {}
export interface DashboardAlertsResponse extends ApiResponse<{
  alerts: DashboardAlert[];
  pagination: PaginationResponse;
}> {}
`;
  
  fs.writeFileSync(path.join(outputDir, 'admin', 'dashboard.ts'), dashboardTypes);
  
  // User management types
  const userManagementTypes = `// Auto-generated from proto/admin/user_management.proto
// Generated at: ${new Date().toISOString()}

import { ApiResponse, PaginationRequest, PaginationResponse, LocationInfo } from '../common';
import { AdminPermissionLevel, AdminAccountStatus, AdminActionType } from './enums';

export interface AdminUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  permissionLevel: AdminPermissionLevel;
  accountStatus: AdminAccountStatus;
  lastLogin?: string;
  isEmailVerified: boolean;
  isTwoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: number;
  profileImage?: string;
  phoneNumber?: string;
  department?: string;
  jobTitle?: string;
  location?: LocationInfo;
  notes?: string;
}

export interface AdminSession {
  id: string;
  adminId: number;
  ipAddress: string;
  userAgent: string;
  location?: LocationInfo;
  isActive: boolean;
  createdAt: string;
  expiresAt: string;
  lastActivity: string;
}

export interface AdminAuditLog {
  id: string;
  adminId: number;
  adminEmail: string;
  adminName: string;
  action: AdminActionType;
  resourceType?: string;
  resourceId?: string;
  description: string;
  ipAddress: string;
  userAgent: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface AdminLoginAttempt {
  id: string;
  email: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  failureReason?: string;
  location?: LocationInfo;
  createdAt: string;
}

export interface AdminPermissions {
  adminId: number;
  permissionLevel: AdminPermissionLevel;
  customPermissions?: string[];
  restrictedActions?: string[];
  allowedIpRanges?: string[];
  accessHours?: {
    start: string;
    end: string;
    timezone: string;
    daysOfWeek: number[];
  };
  temporaryAccess?: {
    expiresAt: string;
    reason: string;
    grantedBy: number;
  };
  updatedAt: string;
  updatedBy: number;
}

export interface UserBanRecord {
  id: string;
  userId: number;
  bannedBy: number;
  reason: string;
  banType: 'temporary' | 'permanent';
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  unbannedBy?: number;
  unbannedAt?: string;
  unbannedReason?: string;
}

export interface UserVerificationRecord {
  id: string;
  userId: number;
  verificationType: 'email' | 'phone' | 'identity' | 'photo';
  verificationStatus: 'pending' | 'approved' | 'rejected';
  verifiedBy?: number;
  verifiedAt?: string;
  rejectionReason?: string;
  documents?: string[];
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

// Request interfaces
export interface CreateAdminUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  permissionLevel: AdminPermissionLevel;
  phoneNumber?: string;
  department?: string;
  jobTitle?: string;
  location?: LocationInfo;
  notes?: string;
  sendWelcomeEmail?: boolean;
}

export interface UpdateAdminUserRequest {
  adminId: number;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  permissionLevel?: AdminPermissionLevel;
  accountStatus?: AdminAccountStatus;
  phoneNumber?: string;
  department?: string;
  jobTitle?: string;
  location?: LocationInfo;
  notes?: string;
}

export interface GetAdminUsersRequest {
  search?: string;
  permissionLevel?: AdminPermissionLevel;
  accountStatus?: AdminAccountStatus;
  department?: string;
  createdAfter?: string;
  createdBefore?: string;
  sortBy?: 'firstName' | 'lastName' | 'email' | 'createdAt' | 'lastLogin';
  sortOrder?: 'asc' | 'desc';
  pagination?: PaginationRequest;
}

export interface GetAdminSessionsRequest {
  adminId?: number;
  isActive?: boolean;
  createdAfter?: string;
  pagination?: PaginationRequest;
}

export interface GetAdminAuditLogsRequest {
  adminId?: number;
  actions?: AdminActionType[];
  resourceType?: string;
  resourceId?: string;
  startDate?: string;
  endDate?: string;
  ipAddress?: string;
  pagination?: PaginationRequest;
}

export interface GetAdminLoginAttemptsRequest {
  email?: string;
  success?: boolean;
  ipAddress?: string;
  startDate?: string;
  endDate?: string;
  pagination?: PaginationRequest;
}

export interface UpdateAdminPermissionsRequest {
  adminId: number;
  permissionLevel?: AdminPermissionLevel;
  customPermissions?: string[];
  restrictedActions?: string[];
  allowedIpRanges?: string[];
  accessHours?: {
    start: string;
    end: string;
    timezone: string;
    daysOfWeek: number[];
  };
  temporaryAccess?: {
    expiresAt: string;
    reason: string;
  };
}

export interface BanUserRequest {
  userId: number;
  reason: string;
  banType: 'temporary' | 'permanent';
  expiresAt?: string;
  notifyUser?: boolean;
}

export interface UnbanUserRequest {
  banId: string;
  reason?: string;
  notifyUser?: boolean;
}

export interface VerifyUserRequest {
  userId: number;
  verificationType: 'email' | 'phone' | 'identity' | 'photo';
  verificationStatus: 'approved' | 'rejected';
  rejectionReason?: string;
  notes?: string;
}

// Response interfaces
export interface AdminUserResponse extends ApiResponse<AdminUser> {}
export interface AdminUsersResponse extends ApiResponse<{
  users: AdminUser[];
  pagination: PaginationResponse;
}> {}
export interface AdminSessionResponse extends ApiResponse<AdminSession> {}
export interface AdminSessionsResponse extends ApiResponse<{
  sessions: AdminSession[];
  pagination: PaginationResponse;
}> {}
export interface AdminAuditLogsResponse extends ApiResponse<{
  logs: AdminAuditLog[];
  pagination: PaginationResponse;
}> {}
export interface AdminLoginAttemptsResponse extends ApiResponse<{
  attempts: AdminLoginAttempt[];
  pagination: PaginationResponse;
}> {}
export interface AdminPermissionsResponse extends ApiResponse<AdminPermissions> {}
export interface UserBanResponse extends ApiResponse<UserBanRecord> {}
export interface UserVerificationResponse extends ApiResponse<UserVerificationRecord> {}
`;
  
  fs.writeFileSync(path.join(outputDir, 'admin', 'user_management.ts'), userManagementTypes);
  
  // Admin index
  const adminIndex = `export * from './enums';
export * from './notifications';
export * from './dashboard';
export * from './user_management';
`;
  fs.writeFileSync(path.join(outputDir, 'admin', 'index.ts'), adminIndex);
  
  console.log('✅ Generated admin types');
}

function generateUserTypes(outputDir) {
  // User enums
  const userEnums = `// Auto-generated from proto/user/enums.proto
// Generated at: ${new Date().toISOString()}

export enum Gender {
  UNSPECIFIED = 'UNSPECIFIED',
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum ExerciseLevel {
  UNSPECIFIED = 'UNSPECIFIED',
  NONE = 'NONE',
  LIGHT = 'LIGHT',
  MODERATE = 'MODERATE',
  HEAVY = 'HEAVY',
}

export enum EducationLevel {
  UNSPECIFIED = 'UNSPECIFIED',
  HIGH_SCHOOL = 'HIGH_SCHOOL',
  UNDERGRADUATE = 'UNDERGRADUATE',
  GRADUATE = 'GRADUATE',
  POSTGRADUATE = 'POSTGRADUATE',
}

export enum DrinkingHabit {
  UNSPECIFIED = 'UNSPECIFIED',
  NEVER = 'NEVER',
  OCCASIONALLY = 'OCCASIONALLY',
  REGULARLY = 'REGULARLY',
}

export enum SmokingHabit {
  UNSPECIFIED = 'UNSPECIFIED',
  NEVER = 'NEVER',
  OCCASIONALLY = 'OCCASIONALLY',
  REGULARLY = 'REGULARLY',
}

export enum LookingFor {
  UNSPECIFIED = 'UNSPECIFIED',
  FRIENDSHIP = 'FRIENDSHIP',
  CASUAL = 'CASUAL',
  RELATIONSHIP = 'RELATIONSHIP',
}

export enum StarSign {
  UNSPECIFIED = 'UNSPECIFIED',
  ARIES = 'ARIES',
  TAURUS = 'TAURUS',
  GEMINI = 'GEMINI',
  CANCER = 'CANCER',
  LEO = 'LEO',
  VIRGO = 'VIRGO',
  LIBRA = 'LIBRA',
  SCORPIO = 'SCORPIO',
  SAGITTARIUS = 'SAGITTARIUS',
  CAPRICORN = 'CAPRICORN',
  AQUARIUS = 'AQUARIUS',
  PISCES = 'PISCES',
}

export enum Pronoun {
  UNSPECIFIED = 'UNSPECIFIED',
  HE_HIM = 'HE_HIM',
  SHE_HER = 'SHE_HER',
  THEY_THEM = 'THEY_THEM',
  OTHER = 'OTHER',
}

export enum DateType {
  UNSPECIFIED = 'UNSPECIFIED',
  COFFEE = 'COFFEE',
  LUNCH = 'LUNCH',
  DINNER = 'DINNER',
  DRINKS = 'DRINKS',
  ACTIVITY = 'ACTIVITY',
  VIRTUAL = 'VIRTUAL',
}

export enum AvailabilityStatus {
  UNSPECIFIED = 'UNSPECIFIED',
  AVAILABLE = 'AVAILABLE',
  BUSY = 'BUSY',
  TENTATIVE = 'TENTATIVE',
  OUT_OF_OFFICE = 'OUT_OF_OFFICE',
}

export enum RecurrenceType {
  UNSPECIFIED = 'UNSPECIFIED',
  NONE = 'NONE',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export enum CancellationPolicy {
  UNSPECIFIED = 'UNSPECIFIED',
  FLEXIBLE = 'FLEXIBLE',
  MODERATE = 'MODERATE',
  STRICT = 'STRICT',
}

export enum BookingStatus {
  UNSPECIFIED = 'UNSPECIFIED',
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}
`;
  
  fs.writeFileSync(path.join(outputDir, 'user', 'enums.ts'), userEnums);
  
  // User profile types
  const userProfileTypes = `// Auto-generated from proto/user/profile.proto
// Generated at: ${new Date().toISOString()}

import { ApiResponse, PaginationRequest, PaginationResponse, LocationInfo } from '../common';
import {
  Gender, ExerciseLevel, EducationLevel, DrinkingHabit, SmokingHabit,
  LookingFor, StarSign, Pronoun, DateType, AvailabilityStatus,
  RecurrenceType, CancellationPolicy, BookingStatus
} from './enums';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  bio: string;
  age: number;
  gender: Gender;
  interests: string[];
  location: string;
  photos: string[];
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Additional profile fields
  exerciseLevel: ExerciseLevel;
  educationLevel: EducationLevel;
  drinkingHabit: DrinkingHabit;
  smokingHabit: SmokingHabit;
  lookingFor: LookingFor;
  starSign: StarSign;
  pronoun: Pronoun;
  jobTitle: string;
  company: string;
  school: string;
  height: number; // in cm
  languages: string[];
  instagramHandle: string;
  spotifyId: string;
  
  // Preferences
  partnerPreferences: PartnerPreferences;
  
  // Location details
  locationInfo: LocationInfo;
  
  // Privacy settings
  privacySettings: PrivacySettings;
}

export interface PartnerPreferences {
  minAge: number;
  maxAge: number;
  preferredGenders: Gender[];
  maxDistance: number; // in km
  lookingForOptions: LookingFor[];
  exercisePreferences: ExerciseLevel[];
  educationPreferences: EducationLevel[];
  drinkingPreferences: DrinkingHabit[];
  smokingPreferences: SmokingHabit[];
  showMeOnDatifyy: boolean;
  discoveryEnabled: boolean;
}

export interface PrivacySettings {
  showDistance: boolean;
  showLastActive: boolean;
  showAge: boolean;
  showOnlineStatus: boolean;
  allowMessagesFromMatchesOnly: boolean;
  showProfileInSearch: boolean;
}

export interface AvailabilitySlot {
  id: string;
  userId: string;
  dateType: DateType;
  startTime: string;
  endTime: string;
  status: AvailabilityStatus;
  recurrence: RecurrenceType;
  location: string;
  notes: string;
  cancellationPolicy: CancellationPolicy;
  price: number;
  currency: string;
  isPremium: boolean;
  tags: string[];
  maxParticipants: number;
  createdAt: string;
  updatedAt: string;
}

export interface AvailabilityBooking {
  id: string;
  slotId: string;
  bookerId: string;
  ownerId: string;
  status: BookingStatus;
  bookedAt: string;
  confirmedAt: string;
  cancelledAt: string;
  cancellationReason: string;
  notes: string;
  amountPaid: number;
  currency: string;
  paymentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserAvailabilityPreferences {
  userId: string;
  preferredDateTypes: DateType[];
  defaultDurationMinutes: number;
  defaultCancellationPolicy: CancellationPolicy;
  defaultTimezone: string;
  autoAcceptBookings: boolean;
  advanceNoticeHours: number;
  sendReminders: boolean;
  reminderMinutesBefore: number;
  blockedTimes: string[];
  defaultPrice: number;
  defaultCurrency: string;
  allowPremiumBookings: boolean;
  createdAt: string;
  updatedAt: string;
}

// Authentication types
export interface AuthModalState {
  isOpen: boolean;
  currentView: 'login' | 'signup' | 'forgot-password' | 'reset-password';
  email?: string;
  isLoading: boolean;
  error?: string;
}

export interface FormFieldErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  age?: string;
  gender?: string;
  interests?: string;
  location?: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: Gender;
  interests: string[];
  location: string;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface AuthStep {
  step: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
}

export interface ForgotPasswordStep {
  step: number;
  title: string;
  isCompleted: boolean;
  isActive: boolean;
}

export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  profileImage?: string;
  isVerified: boolean;
  subscriptionStatus: 'free' | 'premium' | 'expired';
  profileCompletionPercentage: number;
  lastSeen: string;
  preferences: PartnerPreferences;
  privacy: PrivacySettings;
}

// Dating specific types
export interface DatifyyUserProfile extends UserProfile {
  profileCompletionPercentage: number;
  lastSeen: string;
  isOnline: boolean;
  subscriptionStatus: 'free' | 'premium' | 'expired';
  verificationStatus: 'pending' | 'verified' | 'rejected';
  reportCount: number;
  isBanned: boolean;
  banReason?: string;
  banExpiresAt?: string;
}

export interface DatifyyUserPartnerPreferences extends PartnerPreferences {
  dealBreakers: string[];
  importanceScore: number;
  lastUpdated: string;
}

export interface SwipeData {
  targetUserId: string;
  action: 'like' | 'pass' | 'super_like';
  timestamp: string;
  location?: LocationInfo;
}

export interface MatchData {
  id: string;
  userId1: string;
  userId2: string;
  matchedAt: string;
  isActive: boolean;
  lastMessageAt?: string;
  messageCount: number;
  user1Profile: UserProfile;
  user2Profile: UserProfile;
}

export interface ProfileCardData {
  user: UserProfile;
  distance: number;
  commonInterests: string[];
  mutualFriends: number;
  compatibilityScore: number;
  lastActive: string;
  isOnline: boolean;
  verificationBadges: string[];
}

export interface ProfileCardProps {
  profile: ProfileCardData;
  onSwipe: (action: 'like' | 'pass' | 'super_like') => void;
  showDistance: boolean;
  showLastActive: boolean;
  showMutualFriends: boolean;
  showCompatibilityScore: boolean;
}

// Request interfaces
export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  age: number;
  location: string;
  interests: string[];
}

export interface UpdateUserRequest {
  userId: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  bio?: string;
  age?: number;
  gender?: Gender;
  interests?: string[];
  location?: string;
  photos?: string[];
  exerciseLevel?: ExerciseLevel;
  educationLevel?: EducationLevel;
  drinkingHabit?: DrinkingHabit;
  smokingHabit?: SmokingHabit;
  lookingFor?: LookingFor;
  starSign?: StarSign;
  pronoun?: Pronoun;
  jobTitle?: string;
  company?: string;
  school?: string;
  height?: number;
  languages?: string[];
  instagramHandle?: string;
  spotifyId?: string;
  partnerPreferences?: PartnerPreferences;
  locationInfo?: LocationInfo;
  privacySettings?: PrivacySettings;
}

export interface GetUserRequest {
  userId: string;
}

export interface GetUsersRequest {
  pagination?: PaginationRequest;
  search?: string;
  gender?: Gender;
  minAge?: number;
  maxAge?: number;
  location?: string;
  interests?: string[];
  isVerified?: boolean;
  sortBy?: string;
  sortOrder?: string;
}

export interface CreateAvailabilityRequest {
  userId: string;
  dateType: DateType;
  startTime: string;
  endTime: string;
  recurrence: RecurrenceType;
  location?: string;
  notes?: string;
  cancellationPolicy?: CancellationPolicy;
  price?: number;
  currency?: string;
  isPremium?: boolean;
  tags?: string[];
  maxParticipants?: number;
}

export interface UpdateAvailabilityRequest {
  slotId: string;
  dateType?: DateType;
  startTime?: string;
  endTime?: string;
  status?: AvailabilityStatus;
  recurrence?: RecurrenceType;
  location?: string;
  notes?: string;
  cancellationPolicy?: CancellationPolicy;
  price?: number;
  currency?: string;
  isPremium?: boolean;
  tags?: string[];
  maxParticipants?: number;
}

export interface GetAvailabilityRequest {
  userId: string;
  startDate?: string;
  endDate?: string;
  dateTypes?: DateType[];
  statuses?: AvailabilityStatus[];
  pagination?: PaginationRequest;
}

export interface SearchAvailableUsersRequest {
  dateType: DateType;
  startTime: string;
  endTime: string;
  location?: string;
  maxDistance?: number;
  maxPrice?: number;
  tags?: string[];
  pagination?: PaginationRequest;
}

// Response interfaces
export interface UserResponse extends ApiResponse<UserProfile> {}
export interface UsersListResponse extends ApiResponse<{
  users: UserProfile[];
  pagination: PaginationResponse;
}> {}
export interface AvailabilityResponse extends ApiResponse<AvailabilitySlot> {}
export interface AvailabilityListResponse extends ApiResponse<{
  slots: AvailabilitySlot[];
  pagination: PaginationResponse;
}> {}
export interface AuthResponse extends ApiResponse<{
  user: UserData;
  token: string;
  refreshToken: string;
}> {}
export interface MatchResponse extends ApiResponse<MatchData> {}
export interface MatchesListResponse extends ApiResponse<{
  matches: MatchData[];
  pagination: PaginationResponse;
}> {}
`;
  
  fs.writeFileSync(path.join(outputDir, 'user', 'profile.ts'), userProfileTypes);
  
  // User index
  const userIndex = `export * from './enums';
export * from './profile';
`;
  fs.writeFileSync(path.join(outputDir, 'user', 'index.ts'), userIndex);
  
  console.log('✅ Generated user types');
}

function generateDatingTypes(outputDir) {
  // Dating types
  const datingTypes = `// Auto-generated from proto/dating/curated_dates.proto
// Generated at: ${new Date().toISOString()}

import { ApiResponse, PaginationRequest, PaginationResponse, LocationInfo } from '../common';
import { UserProfile } from '../user';

export enum DateMode {
  UNSPECIFIED = 'UNSPECIFIED',
  CURATED = 'CURATED',
  SELF_SELECTED = 'SELF_SELECTED',
  BLIND_DATE = 'BLIND_DATE',
  GROUP_DATE = 'GROUP_DATE',
  VIRTUAL_DATE = 'VIRTUAL_DATE',
}

export enum CuratedDateStatus {
  UNSPECIFIED = 'UNSPECIFIED',
  PROPOSED = 'PROPOSED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  NO_SHOW = 'NO_SHOW',
}

export enum CancellationCategory {
  UNSPECIFIED = 'UNSPECIFIED',
  SCHEDULE_CONFLICT = 'SCHEDULE_CONFLICT',
  PERSONAL_REASON = 'PERSONAL_REASON',
  ILLNESS = 'ILLNESS',
  WEATHER = 'WEATHER',
  TRANSPORTATION = 'TRANSPORTATION',
  FINANCIAL = 'FINANCIAL',
  SAFETY_CONCERN = 'SAFETY_CONCERN',
  INCOMPATIBILITY = 'INCOMPATIBILITY',
  CHANGE_OF_MIND = 'CHANGE_OF_MIND',
  OTHER = 'OTHER',
}

export enum CurationWorkflowStage {
  UNSPECIFIED = 'UNSPECIFIED',
  MATCHING = 'MATCHING',
  VENUE_SELECTION = 'VENUE_SELECTION',
  TIME_COORDINATION = 'TIME_COORDINATION',
  CONFIRMATION = 'CONFIRMATION',
  REMINDER = 'REMINDER',
  FEEDBACK_COLLECTION = 'FEEDBACK_COLLECTION',
  FOLLOW_UP = 'FOLLOW_UP',
}

export enum WorkflowStageStatus {
  UNSPECIFIED = 'UNSPECIFIED',
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  SKIPPED = 'SKIPPED',
  FAILED = 'FAILED',
}

export interface CuratedDate {
  id: string;
  user1Id: string;
  user2Id: string;
  dateMode: DateMode;
  status: CuratedDateStatus;
  
  // Date details
  proposedAt: string;
  scheduledAt?: string;
  confirmedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  
  // Venue and activity
  venueName?: string;
  venueAddress?: string;
  venueType?: string;
  activityType?: string;
  activityDescription?: string;
  estimatedDuration?: number; // in minutes
  estimatedCost?: number;
  currency?: string;
  
  // Participants
  user1Profile?: UserProfile;
  user2Profile?: UserProfile;
  
  // Curation details
  curatedBy?: string; // system or admin ID
  curationReason?: string;
  compatibilityScore?: number;
  
  // Feedback
  user1Feedback?: DateFeedback;
  user2Feedback?: DateFeedback;
  
  // Cancellation
  cancellationReason?: string;
  cancellationCategory?: CancellationCategory;
  cancelledBy?: string; // user ID
  
  // Location
  location?: LocationInfo;
  
  // Metadata
  metadata?: Record<string, any>;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface DateFeedback {
  userId: string;
  dateId: string;
  rating: number; // 1-5 stars
  enjoyment: number; // 1-5 scale
  compatibility: number; // 1-5 scale
  wouldDateAgain: boolean;
  venue_rating?: number;
  venue_feedback?: string;
  suggestions?: string;
  whatWentWell?: string;
  whatCouldImprove?: string;
  feedback_categories?: string[];
  is_anonymous?: boolean;
  submittedAt: string;
}

export interface UserTrustScore {
  userId: string;
  score: number; // 0-100
  factors: {
    profile_completeness: number;
    verification_status: number;
    date_attendance: number;
    feedback_quality: number;
    community_reports: number;
    account_age: number;
  };
  lastUpdated: string;
}

export interface DateSeries {
  id: string;
  name: string;
  description: string;
  user1Id: string;
  user2Id: string;
  dates: CuratedDate[];
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface CurationWorkflow {
  id: string;
  dateId: string;
  currentStage: CurationWorkflowStage;
  stages: Array<{
    stage: CurationWorkflowStage;
    status: WorkflowStageStatus;
    startedAt?: string;
    completedAt?: string;
    failedAt?: string;
    notes?: string;
    assignedTo?: string;
    metadata?: Record<string, any>;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface SelectedActivity {
  id: string;
  name: string;
  description: string;
  category: string;
  estimatedDuration: number; // in minutes
  estimatedCost: number;
  currency: string;
  location: LocationInfo;
  requirements?: string[];
  tags?: string[];
  ageAppropriate: boolean;
  weatherDependent: boolean;
  accessibilityInfo?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Request interfaces
export interface CreateCuratedDateRequest {
  user1Id: string;
  user2Id: string;
  dateMode: DateMode;
  scheduledAt?: string;
  venueName?: string;
  venueAddress?: string;
  venueType?: string;
  activityType?: string;
  activityDescription?: string;
  estimatedDuration?: number;
  estimatedCost?: number;
  currency?: string;
  curationReason?: string;
  location?: LocationInfo;
  metadata?: Record<string, any>;
}

export interface UpdateCuratedDateRequest {
  dateId: string;
  status?: CuratedDateStatus;
  scheduledAt?: string;
  venueName?: string;
  venueAddress?: string;
  venueType?: string;
  activityType?: string;
  activityDescription?: string;
  estimatedDuration?: number;
  estimatedCost?: number;
  currency?: string;
  location?: LocationInfo;
  metadata?: Record<string, any>;
}

export interface AdminGetDatesRequest {
  userId?: string;
  status?: CuratedDateStatus;
  dateMode?: DateMode;
  startDate?: string;
  endDate?: string;
  venueType?: string;
  activityType?: string;
  sortBy?: 'scheduledAt' | 'createdAt' | 'status';
  sortOrder?: 'asc' | 'desc';
  pagination?: PaginationRequest;
}

export interface SearchPotentialMatchesRequest {
  userId: string;
  ageRange?: { min: number; max: number; };
  maxDistance?: number;
  interests?: string[];
  excludeUserIds?: string[];
  compatibilityThreshold?: number;
  limit?: number;
}

export interface SubmitDateFeedbackRequest {
  dateId: string;
  rating: number;
  enjoyment: number;
  compatibility: number;
  wouldDateAgain: boolean;
  venue_rating?: number;
  venue_feedback?: string;
  suggestions?: string;
  whatWentWell?: string;
  whatCouldImprove?: string;
  feedback_categories?: string[];
  is_anonymous?: boolean;
}

export interface CancelDateRequest {
  dateId: string;
  reason: string;
  category: CancellationCategory;
  notifyOtherUser?: boolean;
}

export interface GetUserDatesRequest {
  userId: string;
  status?: CuratedDateStatus;
  dateMode?: DateMode;
  startDate?: string;
  endDate?: string;
  pagination?: PaginationRequest;
}

export interface GetDateAnalyticsRequest {
  startDate?: string;
  endDate?: string;
  dateMode?: DateMode;
  venueType?: string;
  activityType?: string;
  groupBy?: 'day' | 'week' | 'month';
}

// Response interfaces
export interface CuratedDateResponse extends ApiResponse<CuratedDate> {}
export interface CuratedDatesListResponse extends ApiResponse<{
  dates: CuratedDate[];
  pagination: PaginationResponse;
}> {}
export interface UserDatesResponse extends ApiResponse<{
  dates: CuratedDate[];
  pagination: PaginationResponse;
  summary: {
    totalDates: number;
    completedDates: number;
    cancelledDates: number;
    upcomingDates: number;
    averageRating: number;
  };
}> {}
export interface SearchPotentialMatchesResponse extends ApiResponse<{
  matches: Array<{
    user: UserProfile;
    compatibilityScore: number;
    commonInterests: string[];
    distance: number;
    reasons: string[];
  }>;
}> {}
export interface DateCurationAnalyticsResponse extends ApiResponse<{
  totalDates: number;
  completedDates: number;
  cancelledDates: number;
  averageRating: number;
  topVenueTypes: Array<{ type: string; count: number; }>;
  topActivityTypes: Array<{ type: string; count: number; }>;
  cancellationReasons: Array<{ reason: string; count: number; }>;
  datesByTime: Array<{ period: string; count: number; }>;
  userSatisfaction: {
    averageEnjoyment: number;
    averageCompatibility: number;
    repeatDatePercentage: number;
  };
}> {}
export interface DateFeedbackResponse extends ApiResponse<DateFeedback> {}
export interface UserTrustScoreResponse extends ApiResponse<UserTrustScore> {}
export interface DateSeriesResponse extends ApiResponse<DateSeries> {}
export interface CurationWorkflowResponse extends ApiResponse<CurationWorkflow> {}

// Validation rules
export const DateCurationValidationRules = {
  minScheduleAdvance: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  maxScheduleAdvance: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  minCancellationNotice: 2 * 60 * 60 * 1000, // 2 hours in milliseconds
  maxVenueNameLength: 200,
  maxActivityDescriptionLength: 1000,
  maxFeedbackLength: 2000,
  maxCancellationReasonLength: 500,
  minRating: 1,
  maxRating: 5,
  minCompatibilityScore: 0,
  maxCompatibilityScore: 100,
};

// Helper functions
export function getDateModeValues(): DateMode[] {
  return Object.values(DateMode).filter(v => v !== DateMode.UNSPECIFIED);
}

export function getCuratedDateStatusValues(): CuratedDateStatus[] {
  return Object.values(CuratedDateStatus).filter(v => v !== CuratedDateStatus.UNSPECIFIED);
}

export function getCancellationCategoryValues(): CancellationCategory[] {
  return Object.values(CancellationCategory).filter(v => v !== CancellationCategory.UNSPECIFIED);
}

export function getCurationWorkflowStageValues(): CurationWorkflowStage[] {
  return Object.values(CurationWorkflowStage).filter(v => v !== CurationWorkflowStage.UNSPECIFIED);
}

export function getWorkflowStageStatusValues(): WorkflowStageStatus[] {
  return Object.values(WorkflowStageStatus).filter(v => v !== WorkflowStageStatus.UNSPECIFIED);
}
`;
  
  fs.writeFileSync(path.join(outputDir, 'dating', 'curated_dates.ts'), datingTypes);
  
  // Dating index
  const datingIndex = `export * from './curated_dates';
`;
  fs.writeFileSync(path.join(outputDir, 'dating', 'index.ts'), datingIndex);
  
  console.log('✅ Generated dating types');
}

function generateMainIndex(outputDir) {
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
  
  fs.writeFileSync(path.join(outputDir, 'index.ts'), mainIndexContent);
  console.log('✅ Created main index file');
}

// Main execution
if (require.main === module) {
  try {
    generateTypes();
  } catch (error) {
    console.error('❌ Failed to generate comprehensive proto types:', error.message);
    process.exit(1);
  }
}

module.exports = { generateTypes };
