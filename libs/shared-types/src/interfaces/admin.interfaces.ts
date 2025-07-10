/**
 * Admin Interfaces - Data Contracts
 * 
 * Defines all admin-related interfaces for type-safe data handling.
 * Shared across frontend and backend for consistent data structures.
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */

import {
  AdminPermissionLevel,
  AdminPermission,
  AdminSessionStatus,
  AdminTwoFactorMethod,
  AdminAccountStatus,
  AdminActionType,
  AdminRiskLevel,
  AdminLoginAttemptResult
} from '../enums/admin.enum';

/**
 * Base admin user information
 * Core identity data for admin accounts
 */
export interface AdminUser {
  readonly id: number;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly permissionLevel: AdminPermissionLevel;
  readonly permissions: AdminPermission[];
  readonly accountStatus: AdminAccountStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly lastLoginAt?: string;
  readonly isActive: boolean;
}

/**
 * Admin profile with extended information
 * Includes security and preference settings
 */
export interface AdminProfile extends AdminUser {
  readonly profileImageUrl?: string;
  readonly phoneNumber?: string;
  readonly department?: string;
  readonly position?: string;
  readonly timezone: string;
  readonly preferredLanguage: string;
  readonly twoFactorEnabled: boolean;
  readonly twoFactorMethods: AdminTwoFactorMethod[];
  readonly lastPasswordChange: string;
  readonly passwordExpiryDate: string;
  readonly loginCount: number;
  readonly lastActiveAt: string;
}

/**
 * Admin login request payload
 * Credentials for authentication
 */
export interface AdminLoginRequest {
  readonly email: string;
  readonly password: string;
  readonly rememberMe?: boolean;
  readonly deviceInfo?: DeviceInfo;
}

/**
 * Two-factor authentication request
 * Second step of admin login process
 */
export interface AdminTwoFactorRequest {
  readonly email: string;
  readonly code: string;
  readonly method: AdminTwoFactorMethod;
  readonly loginSessionId: string;
}

/**
 * Admin login response
 * Authentication result with tokens and profile
 */
export interface AdminLoginResponse {
  readonly success: boolean;
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresIn: number;
  readonly admin: AdminProfile;
  readonly sessionId: string;
  readonly requires2FA: boolean;
  readonly loginSessionId?: string;
}

/**
 * Admin token refresh request
 * Request to renew access tokens
 */
export interface AdminRefreshTokenRequest {
  readonly refreshToken: string;
  readonly deviceInfo?: DeviceInfo;
}

/**
 * Admin token refresh response
 * New tokens and updated session info
 */
export interface AdminRefreshTokenResponse {
  readonly success: boolean;
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresIn: number;
  readonly sessionId: string;
}

/**
 * Admin logout request
 * Session termination request
 */
export interface AdminLogoutRequest {
  readonly sessionId?: string;
  readonly logoutAllSessions?: boolean;
}

/**
 * Admin logout response
 * Confirmation of session termination
 */
export interface AdminLogoutResponse {
  readonly success: boolean;
  readonly message: string;
  readonly sessionsTerminated: number;
}

/**
 * Device information for security tracking
 * Captures client device details for audit
 */
export interface DeviceInfo {
  readonly userAgent: string;
  readonly ipAddress: string;
  readonly deviceType: 'desktop' | 'mobile' | 'tablet';
  readonly browser?: string;
  readonly os?: string;
  readonly location?: GeoLocation;
}

/**
 * Geographic location information
 * For security monitoring and access control
 */
export interface GeoLocation {
  readonly country: string;
  readonly region: string;
  readonly city: string;
  readonly latitude?: number;
  readonly longitude?: number;
  readonly timezone: string;
}

/**
 * Admin session information
 * Active session tracking data
 */
export interface AdminSession {
  readonly sessionId: string;
  readonly adminId: number;
  readonly status: AdminSessionStatus;
  readonly createdAt: string;
  readonly lastActivityAt: string;
  readonly expiresAt: string;
  readonly deviceInfo: DeviceInfo;
  readonly isCurrentSession: boolean;
}

/**
 * Admin authentication context
 * Current admin state for request context
 */
export interface AdminAuthContext {
  readonly admin: AdminProfile;
  readonly session: AdminSession;
  readonly permissions: AdminPermission[];
  readonly hasPermission: (permission: AdminPermission) => boolean;
  readonly hasAnyPermission: (permissions: AdminPermission[]) => boolean;
  readonly hasRoleLevel: (level: AdminPermissionLevel) => boolean;
}

/**
 * Admin audit log entry
 * Tracks admin actions for security and compliance
 */
export interface AdminAuditLog {
  readonly id: string;
  readonly adminId: number;
  readonly adminEmail: string;
  readonly actionType: AdminActionType;
  readonly resourceType: string;
  readonly resourceId?: string;
  readonly description: string;
  readonly riskLevel: AdminRiskLevel;
  readonly ipAddress: string;
  readonly userAgent: string;
  readonly metadata?: Record<string, any>;
  readonly timestamp: string;
  readonly sessionId: string;
}

/**
 * Admin login attempt record
 * Security monitoring for authentication attempts
 */
export interface AdminLoginAttempt {
  readonly id: string;
  readonly email: string;
  readonly ipAddress: string;
  readonly userAgent: string;
  readonly result: AdminLoginAttemptResult;
  readonly failureReason?: string;
  readonly timestamp: string;
  readonly geoLocation?: GeoLocation;
  readonly riskScore?: number;
}

/**
 * Admin security alert
 * Notifications for suspicious activities
 */
export interface AdminSecurityAlert {
  readonly id: string;
  readonly adminId: number;
  readonly alertType: 'suspicious_login' | 'multiple_failures' | 'unusual_activity' | 'permission_escalation';
  readonly severity: 'low' | 'medium' | 'high' | 'critical';
  readonly description: string;
  readonly triggeredBy: string;
  readonly metadata: Record<string, any>;
  readonly timestamp: string;
  readonly resolved: boolean;
  readonly resolvedBy?: number;
  readonly resolvedAt?: string;
}

/**
 * Admin password reset request
 * Secure password recovery process
 */
export interface AdminPasswordResetRequest {
  readonly email: string;
  readonly newPassword: string;
  readonly resetToken: string;
  readonly currentPassword?: string;
}

/**
 * Admin password change request
 * User-initiated password update
 */
export interface AdminPasswordChangeRequest {
  readonly currentPassword: string;
  readonly newPassword: string;
  readonly confirmPassword: string;
}

/**
 * Admin permission check request
 * Runtime permission validation
 */
export interface AdminPermissionCheckRequest {
  readonly adminId: number;
  readonly permission: AdminPermission;
  readonly resourceId?: string;
  readonly context?: Record<string, any>;
}

/**
 * Admin permission check response
 * Result of permission validation
 */
export interface AdminPermissionCheckResponse {
  readonly hasPermission: boolean;
  readonly reason?: string;
  readonly expiresAt?: string;
}

/**
 * Admin activity summary
 * Dashboard metrics for admin activity
 */
export interface AdminActivitySummary {
  readonly totalLogins: number;
  readonly lastLoginAt: string;
  readonly activeSessionCount: number;
  readonly actionsToday: number;
  readonly actionsThisWeek: number;
  readonly riskScore: number;
  readonly securityAlerts: number;
  readonly topActions: Array<{
    actionType: AdminActionType;
    count: number;
  }>;
}

/**
 * Admin list request filters
 * Query parameters for admin management
 */
export interface AdminListFilters {
  readonly permissionLevel?: AdminPermissionLevel;
  readonly accountStatus?: AdminAccountStatus;
  readonly department?: string;
  readonly search?: string;
  readonly createdAfter?: string;
  readonly createdBefore?: string;
  readonly lastLoginAfter?: string;
  readonly lastLoginBefore?: string;
}

/**
 * Paginated admin list response
 * Admin management interface data
 */
export interface AdminListResponse {
  readonly admins: AdminProfile[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly hasNext: boolean;
  readonly hasPrevious: boolean;
}

/**
 * Admin creation request
 * New admin account setup
 */
export interface AdminCreateRequest {
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly permissionLevel: AdminPermissionLevel;
  readonly department?: string;
  readonly position?: string;
  readonly phoneNumber?: string;
  readonly temporaryPassword: string;
  readonly mustChangePassword: boolean;
}

/**
 * Admin update request
 * Modify existing admin account
 */
export interface AdminUpdateRequest {
  readonly firstName?: string;
  readonly lastName?: string;
  readonly permissionLevel?: AdminPermissionLevel;
  readonly accountStatus?: AdminAccountStatus;
  readonly department?: string;
  readonly position?: string;
  readonly phoneNumber?: string;
  readonly timezone?: string;
  readonly preferredLanguage?: string;
}

/**
 * JWT token payload for admin authentication
 * Claims included in admin access tokens
 */
export interface AdminTokenPayload {
  readonly sub: string; // Admin ID
  readonly email: string;
  readonly permissionLevel: AdminPermissionLevel;
  readonly permissions: AdminPermission[];
  readonly sessionId: string;
  readonly iat: number;
  readonly exp: number;
  readonly iss: string;
  readonly aud: string;
}

/**
 * Admin API response wrapper
 * Standardized response format for admin endpoints
 */
export interface AdminApiResponse<T = any> {
  readonly success: boolean;
  readonly data?: T;
  readonly message?: string;
  readonly error?: {
    readonly code: string;
    readonly message: string;
    readonly details?: any;
  };
  readonly metadata?: {
    readonly requestId: string;
    readonly timestamp: string;
    readonly processingTime?: number;
  };
}