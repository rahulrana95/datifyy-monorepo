import { ApiResponse, PaginationResponse } from '../../../../../proto-types/common/base';

export interface AdminUserListItem {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  gender: string | null;
  accountStatus: string;
  permissionLevel: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isIdVerified: boolean;
  currentCity: string | null;
  createdAt: Date;
  lastActiveAt: Date | null;
  lastLoginAt: Date | null;
  loginCount: number;
  trustScore: {
    overallScore: number;
    attendanceScore: number;
    punctualityScore: number;
    feedbackScore: number;
    warningLevel: number;
    isOnProbation: boolean;
    probationUntil: Date | null;
  };
  dateStats: {
    totalDatesAttended: number;
    totalDatesCancelled: number;
    totalDatesNoShow: number;
    lastDateAt: Date | null;
  };
  profileCompleteness: number;
  hasProfileIssues: boolean;
}

export interface AdminUserListFilters {
  accountStatus?: string;
  gender?: string;
  verificationStatus?: string;
  city?: string;
  country?: string;
  trustScoreRange?: { min: number; max: number };
  isOnProbation?: boolean;
  dateRange?: { start: string; end: string };
  datesAttendedRange?: { min: number; max: number };
  hasProfileIssues?: boolean;
}

export interface AdminUserListMetadata {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  unverifiedUsers: number;
  usersOnProbation: number;
  averageTrustScore: number;
  appliedFilters: AdminUserListFilters;
}

export type AdminUserListResponseDto = ApiResponse<{ data: AdminUserListItem, pagination: PaginationResponse, metadata: AdminUserListMetadata }>;