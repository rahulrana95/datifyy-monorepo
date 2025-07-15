/**
 * Admin Enums - Foundation Types
 * 
 * Defines all admin-related enums used across the platform.
 * Single source of truth for admin type constants.
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */

/**
 * Admin permission levels for role-based access control
 * Hierarchical permissions where higher levels include lower ones
 */
export enum AdminPermissionLevel {
  /** Read-only access to basic admin dashboard */
  VIEWER = 'viewer',
  
  /** Can moderate content and manage basic user operations */
  MODERATOR = 'moderator',
  
  /** Can manage events, analytics, and user operations */
  ADMIN = 'admin',
  
  /** Full system access including user management and system config */
  SUPER_ADMIN = 'super_admin',
  
  /** System owner with all privileges including admin management */
  OWNER = 'owner'
}

/**
 * Specific admin permissions for granular access control
 * Each permission represents a specific capability
 */
export enum AdminPermission {
  // User Management
  VIEW_USERS = 'view_users',
  EDIT_USERS = 'edit_users',
  DELETE_USERS = 'delete_users',
  VERIFY_USERS = 'verify_users',
  BAN_USERS = 'ban_users',
  
  // Content Moderation
  VIEW_REPORTS = 'view_reports',
  MODERATE_CONTENT = 'moderate_content',
  DELETE_CONTENT = 'delete_content',
  
  // Event Management
  VIEW_EVENTS = 'view_events',
  CREATE_EVENTS = 'create_events',
  EDIT_EVENTS = 'edit_events',
  DELETE_EVENTS = 'delete_events',
  MANAGE_EVENT_REGISTRATIONS = 'manage_event_registrations',
  
  // Financial Operations
  VIEW_TRANSACTIONS = 'view_transactions',
  PROCESS_REFUNDS = 'process_refunds',
  VIEW_REVENUE_REPORTS = 'view_revenue_reports',
  MANAGE_PRICING = 'manage_pricing',
  
  // Analytics & Reports
  VIEW_ANALYTICS = 'view_analytics',
  EXPORT_DATA = 'export_data',
  VIEW_SYSTEM_METRICS = 'view_system_metrics',
  
  // System Administration
  MANAGE_ADMINS = 'manage_admins',
  SYSTEM_CONFIG = 'system_config',
  VIEW_LOGS = 'view_logs',
  MANAGE_INTEGRATIONS = 'manage_integrations'
}

/**
 * Admin authentication session status
 * Tracks the current state of admin authentication
 */
export enum AdminSessionStatus {
  /** Session is active and valid */
  ACTIVE = 'active',
  
  /** Session has expired */
  EXPIRED = 'expired',
  
  /** Session was manually invalidated */
  INVALIDATED = 'invalidated',
  
  /** Session is locked due to security concerns */
  LOCKED = 'locked',
  
  /** Session requires 2FA verification */
  PENDING_2FA = 'pending_2fa'
}

/**
 * Two-Factor Authentication methods supported
 * Extensible for future 2FA implementations
 */
export enum AdminTwoFactorMethod {
  /** Email-based OTP */
  EMAIL = 'email',
  
  /** SMS-based OTP */
  SMS = 'sms',
  
  /** Time-based One-Time Password (TOTP) apps like Google Authenticator */
  TOTP = 'totp',
  
  /** Hardware security keys */
  HARDWARE_KEY = 'hardware_key'
}

/**
 * Admin account status for account lifecycle management
 */
export enum AdminAccountStatus {
  /** Account is active and can log in */
  ACTIVE = 'active',
  
  /** Account is temporarily suspended */
  SUSPENDED = 'suspended',
  
  /** Account is permanently deactivated */
  DEACTIVATED = 'deactivated',
  
  /** Account is pending activation */
  PENDING = 'pending',
  
  /** Account is locked due to security violations */
  LOCKED = 'locked'
}

/**
 * Admin action types for audit logging
 * Comprehensive tracking of admin activities
 */
export enum AdminActionType {
  // Authentication
  LOGIN = 'login',
  LOGOUT = 'logout',
  LOGIN_FAILED = 'login_failed',
  PASSWORD_RESET = 'password_reset',
  
  // User Operations
  USER_CREATED = 'user_created',
  USER_UPDATED = 'user_updated',
  USER_DELETED = 'user_deleted',
  USER_BANNED = 'user_banned',
  USER_VERIFIED = 'user_verified',
  
  // Content Moderation
  CONTENT_APPROVED = 'content_approved',
  CONTENT_REJECTED = 'content_rejected',
  CONTENT_DELETED = 'content_deleted',
  REPORT_RESOLVED = 'report_resolved',
  
  // Event Management
  EVENT_CREATED = 'event_created',
  EVENT_UPDATED = 'event_updated',
  EVENT_DELETED = 'event_deleted',
  EVENT_CANCELLED = 'event_cancelled',
  
  // Financial
  REFUND_PROCESSED = 'refund_processed',
  TRANSACTION_REVIEWED = 'transaction_reviewed',
  
  // System
  SYSTEM_CONFIG_CHANGED = 'system_config_changed',
  ADMIN_CREATED = 'admin_created',
  ADMIN_PERMISSIONS_CHANGED = 'admin_permissions_changed'
}

/**
 * Risk levels for admin operations
 * Used for additional security checks and monitoring
 */
export enum AdminRiskLevel {
  /** Low risk operations - normal logging */
  LOW = 'low',
  
  /** Medium risk operations - enhanced logging */
  MEDIUM = 'medium',
  
  /** High risk operations - require additional verification */
  HIGH = 'high',
  
  /** Critical operations - require supervisor approval */
  CRITICAL = 'critical'
}

/**
 * Admin login attempt result types
 * Used for security monitoring and rate limiting
 */
export enum AdminLoginAttemptResult {
  /** Successful login */
  SUCCESS = 'success',
  
  /** Invalid credentials */
  INVALID_CREDENTIALS = 'invalid_credentials',
  
  /** Account locked */
  ACCOUNT_LOCKED = 'account_locked',
  
  /** Account suspended */
  ACCOUNT_SUSPENDED = 'account_suspended',
  
  /** 2FA required */
  REQUIRES_2FA = 'requires_2fa',
  
  /** 2FA failed */
  INVALID_2FA = 'invalid_2fa',
  
  /** Rate limited */
  RATE_LIMITED = 'rate_limited',
  
  /** IP blocked */
  IP_BLOCKED = 'ip_blocked'
}

/**
 * Default permission mappings for role-based access
 * Defines which permissions are included with each role level
 */
export const ADMIN_ROLE_PERMISSIONS: Record<AdminPermissionLevel, AdminPermission[]> = {
  [AdminPermissionLevel.VIEWER]: [
    AdminPermission.VIEW_USERS,
    AdminPermission.VIEW_EVENTS,
    AdminPermission.VIEW_ANALYTICS
  ],
  
  [AdminPermissionLevel.MODERATOR]: [
    AdminPermission.VIEW_USERS,
    AdminPermission.VIEW_EVENTS,
    AdminPermission.VIEW_ANALYTICS,
    AdminPermission.VIEW_REPORTS,
    AdminPermission.MODERATE_CONTENT,
    AdminPermission.DELETE_CONTENT,
    AdminPermission.VERIFY_USERS
  ],
  
  [AdminPermissionLevel.ADMIN]: [
    AdminPermission.VIEW_USERS,
    AdminPermission.EDIT_USERS,
    AdminPermission.VERIFY_USERS,
    AdminPermission.BAN_USERS,
    AdminPermission.VIEW_REPORTS,
    AdminPermission.MODERATE_CONTENT,
    AdminPermission.DELETE_CONTENT,
    AdminPermission.VIEW_EVENTS,
    AdminPermission.CREATE_EVENTS,
    AdminPermission.EDIT_EVENTS,
    AdminPermission.MANAGE_EVENT_REGISTRATIONS,
    AdminPermission.VIEW_TRANSACTIONS,
    AdminPermission.PROCESS_REFUNDS,
    AdminPermission.VIEW_ANALYTICS,
    AdminPermission.EXPORT_DATA
  ],
  
  [AdminPermissionLevel.SUPER_ADMIN]: [
    ...Object.values(AdminPermission).filter(p => 
      p !== AdminPermission.MANAGE_ADMINS && 
      p !== AdminPermission.SYSTEM_CONFIG
    )
  ],
  
  [AdminPermissionLevel.OWNER]: Object.values(AdminPermission)
} as const;

/**
 * Security constants for admin authentication
 */
export const ADMIN_SECURITY_CONSTANTS = {
  /** Maximum failed login attempts before account lock */
  MAX_LOGIN_ATTEMPTS: 5,
  
  /** Account lock duration in minutes */
  ACCOUNT_LOCK_DURATION: 30,
  
  /** Session timeout in hours */
  SESSION_TIMEOUT_HOURS: 8,
  
  /** 2FA code validity in minutes */
  TWO_FACTOR_VALIDITY_MINUTES: 5,
  
  /** Maximum concurrent sessions per admin */
  MAX_CONCURRENT_SESSIONS: 3,
  
  /** Password minimum length */
  PASSWORD_MIN_LENGTH: 12,
  
  /** Days before password expiry warning */
  PASSWORD_EXPIRY_WARNING_DAYS: 7,
  
  /** Days before forced password change */
  PASSWORD_EXPIRY_DAYS: 90
} as const;