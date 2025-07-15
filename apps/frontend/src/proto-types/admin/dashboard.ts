// Auto-generated from proto/admin/dashboard.proto
// Generated at: 2025-07-15T10:21:46.944Z

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
