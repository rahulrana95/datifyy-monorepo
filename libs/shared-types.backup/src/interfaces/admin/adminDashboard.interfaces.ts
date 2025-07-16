/**
 * Admin Dashboard Interfaces
 * Core interfaces for the admin dashboard overview and metrics
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */

// =============================================================================
// DASHBOARD OVERVIEW INTERFACES
// =============================================================================

/**
 * Main dashboard overview response
 * Contains all key metrics for admin home screen
 */
export interface AdminDashboardOverviewResponse {
  readonly userMetrics: UserMetrics;
  readonly dateMetrics: DateMetrics;
  readonly revenueMetrics: RevenueMetrics;
  readonly activityMetrics: ActivityMetrics;
  readonly alerts: DashboardAlert[];
  readonly trends: MetricTrends;
  readonly lastUpdated: string; // ISO timestamp
}

/**
 * User-related metrics for dashboard
 */
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

/**
 * Date-related metrics for dashboard
 */
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

/**
 * Revenue-related metrics for dashboard
 */
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

/**
 * Activity-related metrics for dashboard
 */
export interface ActivityMetrics {
  readonly totalLoginsToday: number;
  readonly peakActivityHour: number; // 0-23
  readonly averageSessionDuration: number; // in minutes
  readonly profileUpdatesToday: number;
  readonly feedbackSubmittedToday: number;
  readonly supportTicketsOpen: number;
}

/**
 * Dashboard alerts and notifications
 */
export interface DashboardAlert {
  readonly id: string;
  readonly type: 'warning' | 'error' | 'info' | 'success';
  readonly title: string;
  readonly message: string;
  readonly severity: 'low' | 'medium' | 'high' | 'critical';
  readonly actionRequired: boolean;
  readonly actionUrl?: string;
  readonly createdAt: string;
  readonly isRead: boolean;
}

/**
 * Metric trends for charts and graphs
 */
export interface MetricTrends {
  readonly userGrowth: TrendData[];
  readonly revenueGrowth: TrendData[];
  readonly dateActivity: TrendData[];
  readonly conversionRates: TrendData[];
}

/**
 * Individual trend data point
 */
export interface TrendData {
  readonly date: string; // YYYY-MM-DD
  readonly value: number;
  readonly change: number; // Percentage change from previous period
}

// =============================================================================
// DASHBOARD REQUEST INTERFACES
// =============================================================================

/**
 * Request to get dashboard overview
 */
export interface GetDashboardOverviewRequest {
  readonly timeframe?: 'today' | 'week' | 'month' | 'quarter' | 'year';
  readonly includeAlerts?: boolean;
  readonly includeTrends?: boolean;
  readonly refreshCache?: boolean;
}

/**
 * Request to get specific metric trends
 */
export interface GetMetricTrendsRequest {
  readonly metricType: 'users' | 'dates' | 'revenue' | 'activity';
  readonly startDate: string; // YYYY-MM-DD
  readonly endDate: string; // YYYY-MM-DD
  readonly granularity: 'hourly' | 'daily' | 'weekly' | 'monthly';
  readonly compareWithPrevious?: boolean;
}

/**
 * Response for metric trends
 */
export interface GetMetricTrendsResponse {
  readonly success: boolean;
  readonly data: {
    readonly trends: TrendData[];
    readonly comparison?: TrendData[]; // Previous period for comparison
    readonly summary: {
      readonly total: number;
      readonly average: number;
      readonly growth: number; // Percentage
      readonly peak: TrendData;
    };
  };
  readonly message: string;
}

// =============================================================================
// ADMIN ACTIVITY INTERFACES
// =============================================================================

/**
 * Admin activity log entry
 */
export interface AdminActivityLog {
  readonly id: number;
  readonly adminUserId: number;
  readonly adminEmail: string;
  readonly actionType: string;
  readonly resourceType?: string;
  readonly resourceId?: string;
  readonly actionDetails: Record<string, any>;
  readonly ipAddress?: string;
  readonly userAgent?: string;
  readonly riskLevel: 1 | 2 | 3 | 4; // 1=low, 4=critical
  readonly createdAt: string;
}

/**
 * Request to get admin activity logs
 */
export interface GetAdminActivityRequest {
  readonly page?: number;
  readonly limit?: number;
  readonly adminUserId?: number;
  readonly actionType?: string;
  readonly startDate?: string;
  readonly endDate?: string;
  readonly riskLevel?: 1 | 2 | 3 | 4;
}

/**
 * Response for admin activity logs
 */
export interface GetAdminActivityResponse {
  readonly success: boolean;
  readonly data: {
    readonly logs: AdminActivityLog[];
    readonly pagination: {
      readonly page: number;
      readonly limit: number;
      readonly total: number;
      readonly totalPages: number;
    };
    readonly summary: {
      readonly totalActions: number;
      readonly uniqueAdmins: number;
      readonly riskDistribution: Record<string, number>;
    };
  };
  readonly message: string;
}

// =============================================================================
// SYSTEM HEALTH INTERFACES
// =============================================================================

/**
 * System health status for admin dashboard
 */
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

/**
 * Individual service health
 */
export interface ServiceHealth {
  readonly status: 'healthy' | 'warning' | 'critical' | 'down';
  readonly responseTime?: number;
  readonly errorRate?: number;
  readonly lastError?: string;
  readonly uptime: number; // percentage
}

// =============================================================================
// ERROR INTERFACES
// =============================================================================

/**
 * Dashboard-specific error response
 */
export interface DashboardErrorResponse {
  readonly success: false;
  readonly error: {
    readonly code: string;
    readonly message: string;
    readonly details?: Record<string, any>;
  };
  readonly fallbackData?: Partial<AdminDashboardOverviewResponse>;
  readonly timestamp: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Dashboard refresh intervals in seconds
 */
export const DASHBOARD_REFRESH_INTERVALS = {
  METRICS: 300, // 5 minutes
  ALERTS: 60, // 1 minute
  TRENDS: 3600, // 1 hour
  SYSTEM_HEALTH: 30, // 30 seconds
} as const;

/**
 * Alert severity levels
 */
export const ALERT_SEVERITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

/**
 * Metric types for dashboard
 */
export const DASHBOARD_METRIC_TYPES = {
  USERS: 'users',
  DATES: 'dates',
  REVENUE: 'revenue',
  ACTIVITY: 'activity',
} as const;