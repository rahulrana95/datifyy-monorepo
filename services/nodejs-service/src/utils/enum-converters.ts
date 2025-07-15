/**
 * Enum conversion utilities for mapping between proto-generated enums and database values
 * 
 * Proto enums use UPPERCASE values while database expects lowercase values.
 * These utilities provide safe conversion between the two formats.
 */

import { 
  AdminPermissionLevel, 
  AdminAccountStatus 
} from '../proto-types/admin/enums';

/**
 * Convert AdminPermissionLevel enum to database lowercase string
 */
export function adminPermissionLevelToDb(level: AdminPermissionLevel): string {
  const mapping: Record<AdminPermissionLevel, string> = {
    [AdminPermissionLevel.ADMIN_PERMISSION_LEVEL_UNSPECIFIED]: 'viewer', // default
    [AdminPermissionLevel.VIEWER]: 'viewer',
    [AdminPermissionLevel.MODERATOR]: 'moderator',
    [AdminPermissionLevel.ADMIN]: 'admin',
    [AdminPermissionLevel.SUPER_ADMIN]: 'super_admin',
    [AdminPermissionLevel.OWNER]: 'owner',
  };
  
  return mapping[level] || 'viewer';
}

/**
 * Convert database lowercase string to AdminPermissionLevel enum
 */
export function dbToAdminPermissionLevel(dbValue: string | null): AdminPermissionLevel {
  if (!dbValue) return AdminPermissionLevel.VIEWER;
  
  const mapping: Record<string, AdminPermissionLevel> = {
    'viewer': AdminPermissionLevel.VIEWER,
    'moderator': AdminPermissionLevel.MODERATOR,
    'admin': AdminPermissionLevel.ADMIN,
    'super_admin': AdminPermissionLevel.SUPER_ADMIN,
    'owner': AdminPermissionLevel.OWNER,
  };
  
  return mapping[dbValue.toLowerCase()] || AdminPermissionLevel.VIEWER;
}

/**
 * Convert AdminAccountStatus enum to database lowercase string
 */
export function adminAccountStatusToDb(status: AdminAccountStatus): string {
  const mapping: Record<AdminAccountStatus, string> = {
    [AdminAccountStatus.ADMIN_ACCOUNT_STATUS_UNSPECIFIED]: 'active', // default
    [AdminAccountStatus.ADMIN_ACTIVE]: 'active',
    [AdminAccountStatus.SUSPENDED]: 'suspended',
    [AdminAccountStatus.DEACTIVATED]: 'deactivated',
    [AdminAccountStatus.PENDING]: 'pending',
    [AdminAccountStatus.ADMIN_LOCKED]: 'locked',
  };
  
  return mapping[status] || 'active';
}

/**
 * Convert database lowercase string to AdminAccountStatus enum
 */
export function dbToAdminAccountStatus(dbValue: string | null): AdminAccountStatus {
  if (!dbValue) return AdminAccountStatus.ADMIN_ACTIVE;
  
  const mapping: Record<string, AdminAccountStatus> = {
    'active': AdminAccountStatus.ADMIN_ACTIVE,
    'suspended': AdminAccountStatus.SUSPENDED,
    'deactivated': AdminAccountStatus.DEACTIVATED,
    'pending': AdminAccountStatus.PENDING,
    'locked': AdminAccountStatus.ADMIN_LOCKED,
  };
  
  return mapping[dbValue.toLowerCase()] || AdminAccountStatus.ADMIN_ACTIVE;
}

/**
 * Type guard to check if a value is a valid AdminPermissionLevel
 */
export function isValidAdminPermissionLevel(value: any): value is AdminPermissionLevel {
  return Object.values(AdminPermissionLevel).includes(value);
}

/**
 * Type guard to check if a value is a valid AdminAccountStatus
 */
export function isValidAdminAccountStatus(value: any): value is AdminAccountStatus {
  return Object.values(AdminAccountStatus).includes(value);
}