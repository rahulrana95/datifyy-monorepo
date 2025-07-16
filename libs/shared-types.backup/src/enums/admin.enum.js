"use strict";
/**
 * Admin Enums - Foundation Types
 *
 * Defines all admin-related enums used across the platform.
 * Single source of truth for admin type constants.
 *
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADMIN_SECURITY_CONSTANTS = exports.ADMIN_ROLE_PERMISSIONS = exports.AdminLoginAttemptResult = exports.AdminRiskLevel = exports.AdminActionType = exports.AdminAccountStatus = exports.AdminTwoFactorMethod = exports.AdminSessionStatus = exports.AdminPermission = exports.AdminPermissionLevel = void 0;
/**
 * Admin permission levels for role-based access control
 * Hierarchical permissions where higher levels include lower ones
 */
var AdminPermissionLevel;
(function (AdminPermissionLevel) {
    /** Read-only access to basic admin dashboard */
    AdminPermissionLevel["VIEWER"] = "viewer";
    /** Can moderate content and manage basic user operations */
    AdminPermissionLevel["MODERATOR"] = "moderator";
    /** Can manage events, analytics, and user operations */
    AdminPermissionLevel["ADMIN"] = "admin";
    /** Full system access including user management and system config */
    AdminPermissionLevel["SUPER_ADMIN"] = "super_admin";
    /** System owner with all privileges including admin management */
    AdminPermissionLevel["OWNER"] = "owner";
})(AdminPermissionLevel || (exports.AdminPermissionLevel = AdminPermissionLevel = {}));
/**
 * Specific admin permissions for granular access control
 * Each permission represents a specific capability
 */
var AdminPermission;
(function (AdminPermission) {
    // User Management
    AdminPermission["VIEW_USERS"] = "view_users";
    AdminPermission["EDIT_USERS"] = "edit_users";
    AdminPermission["DELETE_USERS"] = "delete_users";
    AdminPermission["VERIFY_USERS"] = "verify_users";
    AdminPermission["BAN_USERS"] = "ban_users";
    // Content Moderation
    AdminPermission["VIEW_REPORTS"] = "view_reports";
    AdminPermission["MODERATE_CONTENT"] = "moderate_content";
    AdminPermission["DELETE_CONTENT"] = "delete_content";
    // Event Management
    AdminPermission["VIEW_EVENTS"] = "view_events";
    AdminPermission["CREATE_EVENTS"] = "create_events";
    AdminPermission["EDIT_EVENTS"] = "edit_events";
    AdminPermission["DELETE_EVENTS"] = "delete_events";
    AdminPermission["MANAGE_EVENT_REGISTRATIONS"] = "manage_event_registrations";
    // Financial Operations
    AdminPermission["VIEW_TRANSACTIONS"] = "view_transactions";
    AdminPermission["PROCESS_REFUNDS"] = "process_refunds";
    AdminPermission["VIEW_REVENUE_REPORTS"] = "view_revenue_reports";
    AdminPermission["MANAGE_PRICING"] = "manage_pricing";
    // Analytics & Reports
    AdminPermission["VIEW_ANALYTICS"] = "view_analytics";
    AdminPermission["EXPORT_DATA"] = "export_data";
    AdminPermission["VIEW_SYSTEM_METRICS"] = "view_system_metrics";
    // System Administration
    AdminPermission["MANAGE_ADMINS"] = "manage_admins";
    AdminPermission["SYSTEM_CONFIG"] = "system_config";
    AdminPermission["VIEW_LOGS"] = "view_logs";
    AdminPermission["MANAGE_INTEGRATIONS"] = "manage_integrations";
})(AdminPermission || (exports.AdminPermission = AdminPermission = {}));
/**
 * Admin authentication session status
 * Tracks the current state of admin authentication
 */
var AdminSessionStatus;
(function (AdminSessionStatus) {
    /** Session is active and valid */
    AdminSessionStatus["ACTIVE"] = "active";
    /** Session has expired */
    AdminSessionStatus["EXPIRED"] = "expired";
    /** Session was manually invalidated */
    AdminSessionStatus["INVALIDATED"] = "invalidated";
    /** Session is locked due to security concerns */
    AdminSessionStatus["LOCKED"] = "locked";
    /** Session requires 2FA verification */
    AdminSessionStatus["PENDING_2FA"] = "pending_2fa";
})(AdminSessionStatus || (exports.AdminSessionStatus = AdminSessionStatus = {}));
/**
 * Two-Factor Authentication methods supported
 * Extensible for future 2FA implementations
 */
var AdminTwoFactorMethod;
(function (AdminTwoFactorMethod) {
    /** Email-based OTP */
    AdminTwoFactorMethod["EMAIL"] = "email";
    /** SMS-based OTP */
    AdminTwoFactorMethod["SMS"] = "sms";
    /** Time-based One-Time Password (TOTP) apps like Google Authenticator */
    AdminTwoFactorMethod["TOTP"] = "totp";
    /** Hardware security keys */
    AdminTwoFactorMethod["HARDWARE_KEY"] = "hardware_key";
})(AdminTwoFactorMethod || (exports.AdminTwoFactorMethod = AdminTwoFactorMethod = {}));
/**
 * Admin account status for account lifecycle management
 */
var AdminAccountStatus;
(function (AdminAccountStatus) {
    /** Account is active and can log in */
    AdminAccountStatus["ACTIVE"] = "active";
    /** Account is temporarily suspended */
    AdminAccountStatus["SUSPENDED"] = "suspended";
    /** Account is permanently deactivated */
    AdminAccountStatus["DEACTIVATED"] = "deactivated";
    /** Account is pending activation */
    AdminAccountStatus["PENDING"] = "pending";
    /** Account is locked due to security violations */
    AdminAccountStatus["LOCKED"] = "locked";
})(AdminAccountStatus || (exports.AdminAccountStatus = AdminAccountStatus = {}));
/**
 * Admin action types for audit logging
 * Comprehensive tracking of admin activities
 */
var AdminActionType;
(function (AdminActionType) {
    // Authentication
    AdminActionType["LOGIN"] = "login";
    AdminActionType["LOGOUT"] = "logout";
    AdminActionType["LOGIN_FAILED"] = "login_failed";
    AdminActionType["PASSWORD_RESET"] = "password_reset";
    // User Operations
    AdminActionType["USER_CREATED"] = "user_created";
    AdminActionType["USER_UPDATED"] = "user_updated";
    AdminActionType["USER_DELETED"] = "user_deleted";
    AdminActionType["USER_BANNED"] = "user_banned";
    AdminActionType["USER_VERIFIED"] = "user_verified";
    // Content Moderation
    AdminActionType["CONTENT_APPROVED"] = "content_approved";
    AdminActionType["CONTENT_REJECTED"] = "content_rejected";
    AdminActionType["CONTENT_DELETED"] = "content_deleted";
    AdminActionType["REPORT_RESOLVED"] = "report_resolved";
    // Event Management
    AdminActionType["EVENT_CREATED"] = "event_created";
    AdminActionType["EVENT_UPDATED"] = "event_updated";
    AdminActionType["EVENT_DELETED"] = "event_deleted";
    AdminActionType["EVENT_CANCELLED"] = "event_cancelled";
    // Financial
    AdminActionType["REFUND_PROCESSED"] = "refund_processed";
    AdminActionType["TRANSACTION_REVIEWED"] = "transaction_reviewed";
    // System
    AdminActionType["SYSTEM_CONFIG_CHANGED"] = "system_config_changed";
    AdminActionType["ADMIN_CREATED"] = "admin_created";
    AdminActionType["ADMIN_PERMISSIONS_CHANGED"] = "admin_permissions_changed";
})(AdminActionType || (exports.AdminActionType = AdminActionType = {}));
/**
 * Risk levels for admin operations
 * Used for additional security checks and monitoring
 */
var AdminRiskLevel;
(function (AdminRiskLevel) {
    /** Low risk operations - normal logging */
    AdminRiskLevel["LOW"] = "low";
    /** Medium risk operations - enhanced logging */
    AdminRiskLevel["MEDIUM"] = "medium";
    /** High risk operations - require additional verification */
    AdminRiskLevel["HIGH"] = "high";
    /** Critical operations - require supervisor approval */
    AdminRiskLevel["CRITICAL"] = "critical";
})(AdminRiskLevel || (exports.AdminRiskLevel = AdminRiskLevel = {}));
/**
 * Admin login attempt result types
 * Used for security monitoring and rate limiting
 */
var AdminLoginAttemptResult;
(function (AdminLoginAttemptResult) {
    /** Successful login */
    AdminLoginAttemptResult["SUCCESS"] = "success";
    /** Invalid credentials */
    AdminLoginAttemptResult["INVALID_CREDENTIALS"] = "invalid_credentials";
    /** Account locked */
    AdminLoginAttemptResult["ACCOUNT_LOCKED"] = "account_locked";
    /** Account suspended */
    AdminLoginAttemptResult["ACCOUNT_SUSPENDED"] = "account_suspended";
    /** 2FA required */
    AdminLoginAttemptResult["REQUIRES_2FA"] = "requires_2fa";
    /** 2FA failed */
    AdminLoginAttemptResult["INVALID_2FA"] = "invalid_2fa";
    /** Rate limited */
    AdminLoginAttemptResult["RATE_LIMITED"] = "rate_limited";
    /** IP blocked */
    AdminLoginAttemptResult["IP_BLOCKED"] = "ip_blocked";
})(AdminLoginAttemptResult || (exports.AdminLoginAttemptResult = AdminLoginAttemptResult = {}));
/**
 * Default permission mappings for role-based access
 * Defines which permissions are included with each role level
 */
exports.ADMIN_ROLE_PERMISSIONS = {
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
        ...Object.values(AdminPermission).filter(p => p !== AdminPermission.MANAGE_ADMINS &&
            p !== AdminPermission.SYSTEM_CONFIG)
    ],
    [AdminPermissionLevel.OWNER]: Object.values(AdminPermission)
};
/**
 * Security constants for admin authentication
 */
exports.ADMIN_SECURITY_CONSTANTS = {
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
};
