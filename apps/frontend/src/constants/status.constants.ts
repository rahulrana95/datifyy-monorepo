// apps/frontend/src/constants/status.constants.ts

/**
 * Status constants and enums for the application
 */

// Date status enum
export enum DateStatus {
  SCHEDULED = 'scheduled',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

// Verification status enum
export enum VerificationStatus {
  VERIFIED = 'verified',
  PENDING = 'pending',
  REJECTED = 'rejected',
  NOT_SUBMITTED = 'not_submitted',
}

// User type enum
export enum UserType {
  COLLEGE_STUDENT = 'college_student',
  WORKING_PROFESSIONAL = 'working_professional',
}

// Device type enum
export enum DeviceType {
  DESKTOP = 'desktop',
  MOBILE = 'mobile',
  TABLET = 'tablet',
}

// Email template types
export enum EmailTemplateType {
  FORGOT_PASSWORD = 'forgot-password',
  EVENT_REMINDER = 'event-reminder',
  FEEDBACK_REQUEST = 'feedback-request',
  WELCOME = 'welcome',
  VERIFICATION = 'verification',
  DATE_CONFIRMATION = 'date-confirmation',
  MATCH_NOTIFICATION = 'match-notification',
}

// Admin permission levels
export enum AdminPermissionLevel {
  VIEWER = 'VIEWER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  OWNER = 'OWNER',
}

// Match status
export enum MatchStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  DECLINED = 'declined',
  EXPIRED = 'expired',
}

// Transaction status
export enum TransactionStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

// Notification status
export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived',
}

// Gender options
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say',
}

// Date type
export enum DateType {
  ONLINE = 'online',
  OFFLINE = 'offline',
}

// Match action types
export enum MatchAction {
  LIKE = 'like',
  NOPE = 'nope',
  SUPER_LIKE = 'super_like',
  BOOST = 'boost',
}

// Status badge colors (matching UI design)
export const STATUS_COLORS = {
  [DateStatus.SCHEDULED]: 'blue',
  [DateStatus.ONGOING]: 'yellow',
  [DateStatus.COMPLETED]: 'green',
  [DateStatus.CANCELLED]: 'red',
  [DateStatus.NO_SHOW]: 'gray',
  
  [VerificationStatus.VERIFIED]: 'green',
  [VerificationStatus.PENDING]: 'yellow',
  [VerificationStatus.REJECTED]: 'red',
  [VerificationStatus.NOT_SUBMITTED]: 'gray',
} as const;

// Action colors
export const ACTION_COLORS = {
  [MatchAction.LIKE]: '#22c55e',
  [MatchAction.NOPE]: '#ef4444',
  [MatchAction.SUPER_LIKE]: '#3b82f6',
  [MatchAction.BOOST]: '#f59e0b',
} as const;