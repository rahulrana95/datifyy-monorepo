// Auto-generated from proto/admin/user_management.proto
// Generated at: 2025-07-15T10:21:46.944Z

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
