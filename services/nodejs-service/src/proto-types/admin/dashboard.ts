// Auto-generated from proto/admin/dashboard.proto
// Generated at: 2025-07-15T14:41:46.186Z

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

// User-related metrics for dashboard
export interface UserMetrics {
  readonly totalUsers: number;
  readonly activeUsersToday: number;
  readonly newUsersThisWeek: number;
  readonly verifiedUsers: number;
  readonly usersWithAvailability: number;
  readonly usersByGender: {
    readonly male: number;
    readonly female: number;
    readonly other: number;
  };
  readonly usersByCity: Array<{
    readonly city: string;
    readonly count: number;
  }>;
  readonly growthRate: number; // Percentage
}

// Date-related metrics for dashboard
export interface DateMetrics {
  readonly totalDatesSetup: number;
  readonly datesScheduledThisWeek: number;
  readonly datesCompletedThisWeek: number;
  readonly datesCancelledThisWeek: number;
  readonly upcomingDatesNextWeek: number;
  readonly datesByMode: {
    readonly online: number;
    readonly offline: number;
  };
  readonly datesByCity: Array<{
    readonly city: string;
    readonly count: number;
  }>;
  readonly averageSuccessRate: number; // Percentage
  readonly pendingFeedback: number;
}

// Activity-related metrics for dashboard
export interface ActivityMetrics {
  readonly totalLoginsToday: number;
  readonly peakActivityHour: number; // 0-23
  readonly averageSessionDuration: number; // in minutes
  readonly profileUpdatesToday: number;
  readonly feedbackSubmittedToday: number;
  readonly supportTicketsOpen: number;
}

// Metric trends for charts and graphs
export interface MetricTrends {
  readonly userGrowth: TrendData[];
  readonly revenueGrowth: TrendData[];
  readonly dateActivity: TrendData[];
  readonly conversionRates: TrendData[];
}

// Individual trend data point
export interface TrendData {
  readonly date: string; // YYYY-MM-DD
  readonly value: number;
  readonly change: number; // Percentage change from previous period
}

// Main dashboard overview response
export interface AdminDashboardOverviewResponse {
  readonly userMetrics: UserMetrics;
  readonly dateMetrics: DateMetrics;
  readonly revenueMetrics: RevenueMetrics;
  readonly activityMetrics: ActivityMetrics;
  readonly alerts: DashboardAlert[];
  readonly trends: MetricTrends;
  readonly lastUpdated: string; // ISO timestamp
}

// System health status
export interface SystemHealthStatus {
  readonly overall: 'healthy' | 'warning' | 'critical';
  readonly services: {
    readonly database: ServiceHealth;
    readonly redis: ServiceHealth;
    readonly emailService: ServiceHealth;
    readonly storageService: ServiceHealth;
    readonly paymentGateway: ServiceHealth;
  };
  readonly performance: {
    readonly responseTime: number; // milliseconds
    readonly memoryUsage: number; // percentage
    readonly cpuUsage: number; // percentage
    readonly activeConnections: number;
  };
  readonly lastChecked: string;
}

// Individual service health
export interface ServiceHealth {
  readonly status: 'healthy' | 'warning' | 'critical' | 'down';
  readonly responseTime?: number;
  readonly errorRate?: number;
  readonly lastError?: string;
  readonly uptime: number; // percentage
}

export interface RevenueMetrics {
  readonly totalRevenue: number;
  readonly revenueToday: number;
  readonly revenueThisWeek: number;
  readonly revenueThisMonth: number;
  readonly revenueByType: {
    readonly onlineDates: number;
    readonly offlineDates: number;
    readonly premiumFeatures: number;
    readonly events: number;
  };
  readonly activePayingUsers: number;
  readonly averageTransactionValue: number;
  readonly refundsThisWeek: number;
  readonly topRevenueCity: string;
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

export interface GetMetricTrendsRequest {
  metrics: string[];
  timePeriod: RevenueTimePeriod;
  startDate?: string;
  endDate?: string;
}

export interface GetAdminActivityRequest {
  startDate?: string;
  endDate?: string;
  adminId?: number;
  actionTypes?: string[];
  pagination?: PaginationRequest;
}

// Constants
export const DASHBOARD_REFRESH_INTERVALS = {
  REAL_TIME: 30000, // 30 seconds
  FAST: 60000, // 1 minute
  NORMAL: 300000, // 5 minutes
  SLOW: 900000, // 15 minutes
} as const;

export const DASHBOARD_METRIC_TYPES = {
  USER_COUNT: 'user_count',
  REVENUE: 'revenue',
  ACTIVITY: 'activity',
  PERFORMANCE: 'performance',
} as const;

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
export interface AdminDashboardOverviewResponse extends ApiResponse<AdminDashboardOverview> {} // Alias for backward compatibility
export interface RevenueMetricsResponse extends ApiResponse<RevenueMetrics> {}
export interface UserAnalyticsResponse extends ApiResponse<UserAnalytics> {}
export interface SystemMetricsResponse extends ApiResponse<SystemMetrics> {}
export interface DashboardAlertResponse extends ApiResponse<DashboardAlert> {}
export interface DashboardAlertsResponse extends ApiResponse<{
  alerts: DashboardAlert[];
  pagination: PaginationResponse;
}> {}
