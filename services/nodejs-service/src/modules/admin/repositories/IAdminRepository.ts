/**
 * Admin Repository Interface - Data Access Contracts
 * 
 * Defines data access patterns for admin user management.
 * Abstracts database operations with clean, testable interfaces.
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */

import {
  AdminPermissionLevel,
  AdminAccountStatus,
} from '../../../proto-types/admin/enums';
import { DatifyyUsersLogin } from '../../../models/entities/DatifyyUsersLogin';
import { AdminListFilters } from '../../../proto-types';

/**
 * Pagination parameters for list operations
 */
export interface PaginationOptions {
  readonly page: number;
  readonly limit: number;
  readonly sortBy?: string;
  readonly sortOrder?: 'ASC' | 'DESC';
}

/**
 * Paginated result wrapper
 */
export interface PaginatedResult<T> {
  readonly data: T[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly totalPages: number;
  readonly hasNext: boolean;
  readonly hasPrevious: boolean;
}

/**
 * Admin search criteria for flexible querying
 */
export interface AdminSearchCriteria {
  readonly email?: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly permissionLevel?: AdminPermissionLevel;
  readonly accountStatus?: AdminAccountStatus;
  readonly department?: string;
  readonly isActive?: boolean;
  readonly createdAfter?: Date;
  readonly createdBefore?: Date;
  readonly lastLoginAfter?: Date;
  readonly lastLoginBefore?: Date;
}

/**
 * Admin activity metrics for analytics
 */
export interface AdminActivityMetrics {
  readonly totalAdmins: number;
  readonly activeAdmins: number;
  readonly lockedAdmins: number;
  readonly adminsLoggedInToday: number;
  readonly adminsLoggedInThisWeek: number;
  readonly adminsByPermissionLevel: Record<AdminPermissionLevel, number>;
  readonly averageLoginFrequency: number;
}

/**
 * Admin Repository Interface
 * 
 * Provides comprehensive data access methods for admin user management.
 * Implements repository pattern for clean separation of concerns.
 */
export interface IAdminRepository {
  /**
   * Core CRUD Operations
   */

  /**
   * Find admin by unique identifier
   * @param id Admin user ID
   * @returns Admin user or null if not found
   */
  findById(id: number): Promise<DatifyyUsersLogin | null>;

  /**
   * Find admin by email address
   * @param email Admin email address
   * @returns Admin user or null if not found
   */
  findByEmail(email: string): Promise<DatifyyUsersLogin | null>;

  /**
   * Create new admin user
   * @param adminData Admin creation data
   * @returns Created admin user
   */
  create(adminData: Partial<DatifyyUsersLogin>): Promise<DatifyyUsersLogin>;

  /**
   * Update existing admin user
   * @param id Admin user ID
   * @param updateData Partial update data
   * @returns Updated admin user
   */
  update(id: number, updateData: Partial<DatifyyUsersLogin>): Promise<DatifyyUsersLogin>;

  /**
   * Soft delete admin user
   * @param id Admin user ID
   * @returns Success status
   */
  delete(id: number): Promise<boolean>;

  /**
   * Save admin user (create or update)
   * @param admin Admin user entity
   * @returns Saved admin user
   */
  save(admin: DatifyyUsersLogin): Promise<DatifyyUsersLogin>;

  /**
   * Check if admin exists by email
   * @param email Admin email address
   * @returns True if exists, false otherwise
   */
  existsByEmail(email: string): Promise<boolean>;

  /**
   * Query & Search Operations
   */

  /**
   * Find all active admins
   * @returns Array of active admin users
   */
  findAllActive(): Promise<DatifyyUsersLogin[]>;

  /**
   * Find admins by permission level
   * @param permissionLevel Admin permission level
   * @returns Array of admin users with specified permission level
   */
  findByPermissionLevel(permissionLevel: AdminPermissionLevel): Promise<DatifyyUsersLogin[]>;

  /**
   * Find admins by account status
   * @param accountStatus Admin account status
   * @returns Array of admin users with specified status
   */
  findByAccountStatus(accountStatus: AdminAccountStatus): Promise<DatifyyUsersLogin[]>;

  /**
   * Search admins with flexible criteria
   * @param criteria Search criteria
   * @param pagination Pagination options
   * @returns Paginated search results
   */
  search(
    criteria: AdminSearchCriteria,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<DatifyyUsersLogin>>;

  /**
   * Find admins with filters and pagination
   * @param filters Admin list filters
   * @param pagination Pagination options
   * @returns Paginated admin list
   */
  findWithFilters(
    filters: AdminListFilters,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<DatifyyUsersLogin>>;

  /**
   * Security & Authentication Operations
   */

  /**
   * Find locked admin accounts
   * @returns Array of currently locked admin users
   */
  findLockedAccounts(): Promise<DatifyyUsersLogin[]>;

  /**
   * Find admins with expired passwords
   * @returns Array of admin users with expired passwords
   */
  findExpiredPasswords(): Promise<DatifyyUsersLogin[]>;

  /**
   * Find admins requiring password change
   * @returns Array of admin users who must change password
   */
  findRequirePasswordChange(): Promise<DatifyyUsersLogin[]>;

  /**
   * Find admins with 2FA enabled
   * @returns Array of admin users with 2FA enabled
   */
  findWithTwoFactorEnabled(): Promise<DatifyyUsersLogin[]>;

  /**
   * Find admins by last login timeframe
   * @param since Date to check login activity from
   * @returns Array of admin users who logged in since the date
   */
  findByLastLoginSince(since: Date): Promise<DatifyyUsersLogin[]>;

  /**
   * Find inactive admins (no recent activity)
   * @param inactiveSince Date threshold for inactive status
   * @returns Array of inactive admin users
   */
  findInactiveAdmins(inactiveSince: Date): Promise<DatifyyUsersLogin[]>;

  /**
   * Update admin login information
   * @param id Admin user ID
   * @param loginData Login tracking data
   * @returns Updated admin user
   */
  updateLoginInfo(
    id: number,
    loginData: {
      lastLoginAt: Date;
      lastLoginIp: string;
      lastLoginUserAgent: string;
      loginCount: number;
    }
  ): Promise<DatifyyUsersLogin>;

  /**
   * Update admin activity timestamp
   * @param id Admin user ID
   * @returns Success status
   */
  updateLastActivity(id: number): Promise<boolean>;

  /**
   * Increment failed login attempts
   * @param id Admin user ID
   * @returns Updated failed attempts count
   */
  incrementFailedLoginAttempts(id: number): Promise<number>;

  /**
   * Reset failed login attempts
   * @param id Admin user ID
   * @returns Success status
   */
  resetFailedLoginAttempts(id: number): Promise<boolean>;

  /**
   * Lock admin account
   * @param id Admin user ID
   * @param lockDurationMinutes Lock duration in minutes
   * @returns Success status
   */
  lockAccount(id: number, lockDurationMinutes: number): Promise<boolean>;

  /**
   * Unlock admin account
   * @param id Admin user ID
   * @returns Success status
   */
  unlockAccount(id: number): Promise<boolean>;

  /**
   * Analytics & Reporting Operations
   */

  /**
   * Get admin activity metrics
   * @returns Comprehensive activity metrics
   */
  getActivityMetrics(): Promise<AdminActivityMetrics>;

  /**
   * Count admins by criteria
   * @param criteria Count criteria
   * @returns Total count matching criteria
   */
  countByCriteria(criteria: Partial<AdminSearchCriteria>): Promise<number>;

  /**
   * Get admins created in date range
   * @param startDate Range start date
   * @param endDate Range end date
   * @returns Array of admin users created in range
   */
  findCreatedInDateRange(startDate: Date, endDate: Date): Promise<DatifyyUsersLogin[]>;

  /**
   * Get login activity report
   * @param startDate Report start date
   * @param endDate Report end date
   * @returns Login activity data
   */
  getLoginActivityReport(
    startDate: Date,
    endDate: Date
  ): Promise<Array<{
    adminId: number;
    email: string;
    loginCount: number;
    lastLoginAt: Date;
    totalHoursActive: number;
  }>>;

  /**
   * Batch Operations
   */

  /**
   * Find multiple admins by IDs
   * @param ids Array of admin user IDs
   * @returns Array of found admin users
   */
  findByIds(ids: number[]): Promise<DatifyyUsersLogin[]>;

  /**
   * Batch update admin status
   * @param ids Array of admin user IDs
   * @param status New account status
   * @returns Number of updated records
   */
  batchUpdateStatus(ids: number[], status: AdminAccountStatus): Promise<number>;

  /**
   * Batch update permission level
   * @param ids Array of admin user IDs
   * @param permissionLevel New permission level
   * @returns Number of updated records
   */
  batchUpdatePermissionLevel(
    ids: number[],
    permissionLevel: AdminPermissionLevel
  ): Promise<number>;

  /**
   * Transaction Support
   */

  /**
   * Execute operations within a database transaction
   * @param operation Transaction operation function
   * @returns Operation result
   */
  runInTransaction<T>(
    operation: (repository: IAdminRepository) => Promise<T>
  ): Promise<T>;

  /**
   * Health & Maintenance Operations
   */

  /**
   * Check repository health
   * @returns Health status and metrics
   */
  healthCheck(): Promise<{
    isHealthy: boolean;
    connectionStatus: 'connected' | 'disconnected' | 'error';
    totalRecords: number;
    lastHealthCheck: Date;
  }>;

  /**
   * Clean up expired locks and sessions
   * @returns Number of cleaned records
   */
  cleanupExpiredLocks(): Promise<number>;

  /**
   * Archive inactive admin accounts
   * @param inactiveDays Number of days to consider inactive
   * @returns Number of archived accounts
   */
  archiveInactiveAccounts(inactiveDays: number): Promise<number>;
}