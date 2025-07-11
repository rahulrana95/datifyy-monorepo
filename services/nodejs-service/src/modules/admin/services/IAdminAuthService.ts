/**
 * Admin Auth Service Interface - Business Logic Contracts
 * 
 * Defines comprehensive admin authentication business logic contracts.
 * Abstracts authentication workflows for testability and flexibility.
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */

import {
  AdminLoginRequestDto,
  AdminLoginResponseDto,
  AdminTwoFactorRequestDto,
  AdminRefreshTokenRequestDto,
  AdminRefreshTokenResponseDto,
  AdminLogoutRequestDto,
  AdminLogoutResponseDto,
  AdminProfileResponseDto,
  AdminPasswordChangeRequestDto,
  AdminSessionResponseDto,
  AdminActivitySummaryDto,
  DeviceInfoDto
} from '../dtos/AdminAuthDtos';
import {
  AdminPermission,
  AdminTwoFactorMethod,
  AdminTokenPayload
} from '@datifyy/shared-types';

/**
 * Authentication result with detailed status information
 */
export interface AuthenticationResult {
  readonly success: boolean;
  readonly admin?: AdminProfileResponseDto;
  readonly accessToken?: string;
  readonly refreshToken?: string;
  readonly sessionId?: string;
  readonly expiresIn?: number;
  readonly requires2FA?: boolean;
  readonly loginSessionId?: string;
  readonly failureReason?: string;
  readonly remainingAttempts?: number;
  readonly lockoutExpiry?: Date;
}

/**
 * Token validation result with context information
 */
export interface TokenValidationResult {
  readonly isValid: boolean;
  readonly payload?: AdminTokenPayload;
  readonly admin?: AdminProfileResponseDto;
  readonly sessionId?: string;
  readonly expiresAt?: Date;
  readonly invalidReason?: string;
}

/**
 * Permission check context for authorization decisions
 */
export interface PermissionCheckContext {
  readonly adminId: number;
  readonly permission: AdminPermission;
  readonly resourceId?: string;
  readonly resourceType?: string;
  readonly requestMetadata?: Record<string, any>;
}

/**
 * Permission check result with detailed information
 */
export interface PermissionCheckResult {
  readonly hasPermission: boolean;
  readonly reason?: string;
  readonly expiresAt?: Date;
  readonly conditionalAccess?: boolean;
  readonly requiredActions?: string[];
}

/**
 * Session creation context for security tracking
 */
export interface SessionContext {
  readonly adminId: number;
  readonly deviceInfo: DeviceInfoDto;
  readonly rememberMe?: boolean;
  readonly sessionDuration?: number;
}

/**
 * Session management result
 */
export interface SessionManagementResult {
  readonly success: boolean;
  readonly sessionId?: string;
  readonly expiresAt?: Date;
  readonly sessionsTerminated?: number;
  readonly error?: string;
}

/**
 * Two-factor authentication setup result
 */
export interface TwoFactorSetupResult {
  readonly success: boolean;
  readonly method: AdminTwoFactorMethod;
  readonly secretKey?: string;
  readonly qrCodeUrl?: string;
  readonly backupCodes?: string[];
  readonly error?: string;
}

/**
 * Security event information for audit logging
 */
export interface SecurityEvent {
  readonly eventType: string;
  readonly adminId: number;
  readonly severity: 'low' | 'medium' | 'high' | 'critical';
  readonly description: string;
  readonly metadata: Record<string, any>;
  readonly deviceInfo?: DeviceInfoDto;
}

/**
 * Admin Authentication Service Interface
 * 
 * Comprehensive business logic for admin authentication, authorization,
 * and session management with enterprise security features.
 */
export interface IAdminAuthService {
  /**
   * Core Authentication Operations
   */

  /**
   * Authenticate admin with email and password
   * Handles failed attempts, account locking, and 2FA requirements
   * 
   * @param loginRequest Admin login credentials and device info
   * @returns Authentication result with tokens or 2FA requirement
   */
  login(loginRequest: AdminLoginRequestDto): Promise<AdminLoginResponseDto>;

  /**
   * Complete two-factor authentication process
   * Validates 2FA code and completes login workflow
   * 
   * @param twoFactorRequest 2FA verification data
   * @returns Complete authentication result with tokens
   */
  verifyTwoFactor(twoFactorRequest: AdminTwoFactorRequestDto): Promise<AdminLoginResponseDto>;

  /**
   * Refresh access token using refresh token
   * Validates refresh token and issues new access token
   * 
   * @param refreshRequest Refresh token and device info
   * @returns New access token and session information
   */
  refreshToken(refreshRequest: AdminRefreshTokenRequestDto): Promise<AdminRefreshTokenResponseDto>;

  /**
   * Logout admin and invalidate session(s)
   * Supports single session or all sessions logout
   * 
   * @param logoutRequest Logout parameters and session info
   * @param adminId Currently authenticated admin ID
   * @returns Logout confirmation and session termination count
   */
  logout(logoutRequest: AdminLogoutRequestDto, adminId: number): Promise<AdminLogoutResponseDto>;

  /**
   * Token & Session Management
   */

  /**
   * Validate access token and return admin context
   * Checks token signature, expiration, and admin status
   * 
   * @param token JWT access token to validate
   * @returns Token validation result with admin context
   */
  validateToken(token: string): Promise<TokenValidationResult>;

  /**
   * Generate new JWT tokens for admin session
   * Creates access and refresh tokens with proper claims
   * 
   * @param adminId Admin user ID
   * @param sessionId Session identifier
   * @param rememberMe Extended session duration flag
   * @returns Token pair with expiration information
   */
  generateTokens(
    adminId: number, 
    sessionId: string, 
    rememberMe?: boolean
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }>;

  /**
   * Create new admin session with security tracking
   * Establishes session with device fingerprinting
   * 
   * @param context Session creation context with admin and device info
   * @returns Session management result with session ID
   */
  createSession(context: SessionContext): Promise<SessionManagementResult>;

  /**
   * Invalidate specific admin session
   * Terminates session and cleans up related data
   * 
   * @param sessionId Session identifier to invalidate
   * @param adminId Admin ID for authorization check
   * @returns Session termination result
   */
  invalidateSession(sessionId: string, adminId: number): Promise<SessionManagementResult>;

  /**
   * Get all active sessions for admin
   * Returns list of current sessions with device info
   * 
   * @param adminId Admin user ID
   * @returns Array of active admin sessions
   */
  getActiveSessions(adminId: number): Promise<AdminSessionResponseDto[]>;

  /**
   * Authorization & Permissions
   */

  /**
   * Check if admin has specific permission
   * Evaluates role-based and granular permissions
   * 
   * @param context Permission check context with admin and resource info
   * @returns Permission check result with reasoning
   */
  checkPermission(context: PermissionCheckContext): Promise<PermissionCheckResult>;

  /**
   * Check if admin has any of the specified permissions
   * OR operation on multiple permissions
   * 
   * @param adminId Admin user ID
   * @param permissions Array of permissions to check
   * @returns True if admin has at least one permission
   */
  hasAnyPermission(adminId: number, permissions: AdminPermission[]): Promise<boolean>;

  /**
   * Check if admin has all specified permissions
   * AND operation on multiple permissions
   * 
   * @param adminId Admin user ID
   * @param permissions Array of permissions to check
   * @returns True if admin has all permissions
   */
  hasAllPermissions(adminId: number, permissions: AdminPermission[]): Promise<boolean>;

  /**
   * Get all permissions for admin (role + additional)
   * Resolves complete permission set for admin
   * 
   * @param adminId Admin user ID
   * @returns Array of all admin permissions
   */
  // getAdminPermissions(adminId: number): Promise<AdminPermission[]>;

  /**
   * Profile & Account Management
   */

  /**
   * Get current admin profile information
   * Returns sanitized profile data for authenticated admin
   * 
   * @param adminId Admin user ID
   * @returns Admin profile response DTO
   */
  getAdminProfile(adminId: number): Promise<AdminProfileResponseDto>;

  /**
   * Update admin activity timestamp
   * Tracks admin activity for session management
   * 
   * @param adminId Admin user ID
   * @returns Success status
   */
  updateAdminActivity(adminId: number): Promise<boolean>;

  /**
   * Get admin activity summary and metrics
   * Returns dashboard metrics for admin activity
   * 
   * @param adminId Admin user ID
   * @returns Activity summary with metrics
   */
  getAdminActivitySummary(adminId: number): Promise<AdminActivitySummaryDto>;

  /**
   * Security & Two-Factor Authentication
   */

  /**
   * Change admin password with current password verification
   * Validates current password and updates to new password
   * 
   * @param adminId Admin user ID
   * @param passwordChangeRequest Password change data
   * @returns Success status and any validation errors
   */
  changePassword(
    adminId: number, 
    passwordChangeRequest: AdminPasswordChangeRequestDto
  ): Promise<{
    success: boolean;
    message: string;
    errors?: string[];
  }>;

  /**
   * Setup two-factor authentication for admin
   * Enables 2FA with specified method and returns setup data
   * 
   * @param adminId Admin user ID
   * @param method 2FA method to setup
   * @returns 2FA setup result with secrets and backup codes
   */
  setupTwoFactor(adminId: number, method: AdminTwoFactorMethod): Promise<TwoFactorSetupResult>;

  /**
   * Disable two-factor authentication for admin
   * Removes 2FA requirement after verification
   * 
   * @param adminId Admin user ID
   * @param currentPassword Admin password for verification
   * @returns Success status
   */
  disableTwoFactor(adminId: number, currentPassword: string): Promise<boolean>;

  /**
   * Generate new backup codes for 2FA recovery
   * Creates fresh backup codes and invalidates old ones
   * 
   * @param adminId Admin user ID
   * @returns Array of new backup codes
   */
  generateBackupCodes(adminId: number): Promise<string[]>;

  /**
   * Verify 2FA code for admin operation
   * Validates 2FA code for sensitive operations
   * 
   * @param adminId Admin user ID
   * @param code 2FA code to verify
   * @param method 2FA method used
   * @returns Verification success status
   */
  verifyTwoFactorCode(
    adminId: number, 
    code: string, 
    method: AdminTwoFactorMethod
  ): Promise<boolean>;

  /**
   * Account Security Operations
   */

  /**
   * Lock admin account for security reasons
   * Temporarily disables account access
   * 
   * @param adminId Admin user ID to lock
   * @param reason Reason for account lock
   * @param durationMinutes Lock duration in minutes
   * @returns Lock operation result
   */
  lockAdminAccount(
    adminId: number, 
    reason: string, 
    durationMinutes?: number
  ): Promise<boolean>;

  /**
   * Unlock admin account
   * Restores account access and resets failed attempts
   * 
   * @param adminId Admin user ID to unlock
   * @param unlockedBy Admin ID performing unlock operation
   * @returns Unlock operation result
   */
  unlockAdminAccount(adminId: number, unlockedBy: number): Promise<boolean>;

  /**
   * Reset admin failed login attempts
   * Clears failed login counter without unlocking
   * 
   * @param adminId Admin user ID
   * @returns Reset operation result
   */
  resetFailedLoginAttempts(adminId: number): Promise<boolean>;

  /**
   * Check if admin account is currently locked
   * Evaluates lock status and expiry
   * 
   * @param adminId Admin user ID
   * @returns Lock status information
   */
  isAdminAccountLocked(adminId: number): Promise<{
    isLocked: boolean;
    lockedUntil?: Date;
    reason?: string;
  }>;

  /**
   * Audit & Security Monitoring
   */

  /**
   * Log security event for audit trail
   * Records security-related events with context
   * 
   * @param event Security event information
   * @returns Logging operation result
   */
  logSecurityEvent(event: SecurityEvent): Promise<boolean>;

  /**
   * Get admin login history
   * Returns recent login attempts and sessions
   * 
   * @param adminId Admin user ID
   * @param limit Number of records to return
   * @returns Array of login history records
   */
  getLoginHistory(adminId: number, limit?: number): Promise<Array<{
    timestamp: Date;
    ipAddress: string;
    userAgent: string;
    success: boolean;
    failureReason?: string;
  }>>;

  /**
   * Detect suspicious admin activity
   * Analyzes activity patterns for anomalies
   * 
   * @param adminId Admin user ID
   * @returns Suspicious activity indicators
   */
  detectSuspiciousActivity(adminId: number): Promise<{
    riskScore: number;
    indicators: string[];
    recommendations: string[];
  }>;

  /**
   * Health & Maintenance
   */

  /**
   * Cleanup expired sessions and tokens
   * Removes expired authentication data
   * 
   * @returns Number of cleaned up records
   */
  cleanupExpiredSessions(): Promise<number>;

  /**
   * Validate service health and dependencies
   * Checks authentication service health
   * 
   * @returns Health status information
   */
  healthCheck(): Promise<{
    isHealthy: boolean;
    dependencies: Record<string, boolean>;
    lastCheck: Date;
  }>;
}