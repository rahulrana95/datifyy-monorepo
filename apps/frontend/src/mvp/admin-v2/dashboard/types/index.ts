// apps/frontend/src/mvp/admin-v2/dashboard/types/index.ts


// Time range options for dashboard filtering
export enum DashboardTimeRange {
  TODAY = 'today',
  LAST_7_DAYS = 'last_7_days',
  LAST_30_DAYS = 'last_30_days',
  LAST_90_DAYS = 'last_90_days',
  THIS_MONTH = 'this_month',
  LAST_MONTH = 'last_month',
  THIS_YEAR = 'this_year',
  ALL_TIME = 'all_time',
}

// Trend direction for metrics
export enum TrendDirection {
  UP = 'up',
  DOWN = 'down',
  STABLE = 'stable',
}

// Alert severity levels
export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// System status levels
export enum SystemStatus {
  HEALTHY = 'healthy',
  WARNING = 'warning',
  CRITICAL = 'critical',
}

// Chart types
export enum ChartType {
  LINE = 'line',
  BAR = 'bar',
  AREA = 'area',
  PIE = 'pie',
}

// Export formats
export enum ExportFormat {
  CSV = 'csv',
  EXCEL = 'excel',
  PDF = 'pdf',
}

// Metric variant types
export enum MetricVariant {
  DEFAULT = 'default',
  REVENUE = 'revenue',
  USERS = 'users',
  DATES = 'dates',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

// Notification types
export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

// Metric value type
export type MetricValue = number | string;

// Growth/trend data
export interface GrowthMetric {
  direction: TrendDirection;
  percentage: number;
  previousValue: number;
  currentValue: number;
}

// Dashboard alert interface
export interface DashboardAlert {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  actionText?: string;
}

// User metrics interface
export interface UserMetrics {
  totalUsers: number;
  activeUsersToday: number;
  newUsersToday: number;
  totalUsersGrowth?: GrowthMetric;
  activeUsersGrowth?: GrowthMetric;
  verifiedUsers: number;
  verificationRate: number;
}

// Revenue metrics interface
export interface RevenueMetrics {
  totalRevenue: number;
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  totalRevenueGrowth?: GrowthMetric;
  averageRevenuePerUser: number;
  topRevenueSources: Array<{
    source: string;
    amount: number;
    percentage: number;
  }>;
}

// Date metrics interface
export interface DateMetrics {
  totalDatesSetup: number;
  datesThisWeek: number;
  datesThisMonth: number;
  datesSetupGrowth?: GrowthMetric;
  successRate: number;
  successRateGrowth?: GrowthMetric;
  averageDateDuration: number;
  completedDates: number;
  cancelledDates: number;
}

// Activity metrics interface
export interface ActivityMetrics {
  activeUsersToday: number;
  peakActiveUsers: number;
  averageSessionDuration: number;
  totalSessions: number;
  newSignups: number;
  userRetentionRate: number;
}

// Main dashboard overview response
export interface AdminDashboardOverviewResponse {
  userMetrics: UserMetrics;
  revenueMetrics: RevenueMetrics;
  dateMetrics: DateMetrics;
  activityMetrics: ActivityMetrics;
  alerts: DashboardAlert[];
  lastUpdated: string;
  systemStatus: SystemStatus;
}

// Trend data point for charts
export interface TrendDataPoint {
  date: string;
  value: number;
  label?: string;
}

// Metric trends for charts
export interface MetricTrends {
  userGrowth: TrendDataPoint[];
  revenue: TrendDataPoint[];
  dateSuccessRate: TrendDataPoint[];
  dailyActiveUsers: TrendDataPoint[];
  signups: TrendDataPoint[];
  lastUpdated: string;
}

// Revenue analytics detailed response
export interface RevenueAnalyticsOverview {
  summary: {
    totalRevenue: number;
    monthlyRecurringRevenue: number;
    averageRevenuePerUser: number;
    revenueGrowthRate: number;
  };
  trends: {
    daily: TrendDataPoint[];
    weekly: TrendDataPoint[];
    monthly: TrendDataPoint[];
  };
  breakdown: {
    bySource: Array<{ source: string; amount: number; percentage: number }>;
    byUserType: Array<{ type: string; amount: number; percentage: number }>;
    byRegion: Array<{ region: string; amount: number; percentage: number }>;
  };
  lastUpdated: string;
}

// User analytics response
export interface UserAnalyticsResponse {
  overview: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    retentionRate: number;
  };
  demographics: {
    byAge: Array<{ ageGroup: string; count: number; percentage: number }>;
    byGender: Array<{ gender: string; count: number; percentage: number }>;
    byLocation: Array<{ location: string; count: number; percentage: number }>;
  };
  activity: {
    dailyActiveUsers: TrendDataPoint[];
    sessionDuration: TrendDataPoint[];
    pageViews: TrendDataPoint[];
  };
  lastUpdated: string;
}

// Date analytics response
export interface DateAnalyticsResponse {
  overview: {
    totalDates: number;
    successfulDates: number;
    cancelledDates: number;
    averageRating: number;
  };
  trends: {
    datesSetup: TrendDataPoint[];
    successRate: TrendDataPoint[];
    userSatisfaction: TrendDataPoint[];
  };
  insights: {
    popularTimeSlots: Array<{ timeSlot: string; count: number }>;
    popularLocations: Array<{ location: string; count: number }>;
    averageDateDuration: number;
  };
  lastUpdated: string;
}

// Local component props interfaces
export interface MetricCardProps {
  title: string;
  value: number | string;
  trend?: {
    direction: TrendDirection;
    percentage: number;
    label: string;
  };
  icon?: React.ReactNode;
  format?: 'number' | 'currency' | 'percentage';
  isLoading?: boolean;
  variant?: 'default' | 'revenue' | 'users' | 'dates' | 'success' | 'warning' | 'error';
}

export interface TrendChartProps {
  title: string;
  data: ChartDataPoint[];
  type?: 'line' | 'bar' | 'area';
  color?: string;
  height?: number;
  isLoading?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
  color?: string;
}

export interface AlertBannerProps {
  alerts: DashboardAlert[];
  onDismiss: (alertId: string) => void;
  maxVisible?: number;
}

export interface TimeRangeOption {
  label: string;
  value: DashboardTimeRange;
  description?: string;
}

export interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  isLoading?: boolean;
  lastUpdated?: string;
  onRefresh?: () => void;
}

export interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}

// Chart configuration types
export interface ChartConfig {
  responsive: boolean;
  maintainAspectRatio: boolean;
  plugins: {
    legend: {
      display: boolean;
      position?: 'top' | 'bottom' | 'left' | 'right';
    };
    tooltip: {
      enabled: boolean;
      mode?: 'index' | 'nearest' | 'point';
    };
  };
  scales?: {
    x?: {
      display: boolean;
      grid?: {
        display: boolean;
      };
    };
    y?: {
      display: boolean;
      beginAtZero: boolean;
      grid?: {
        display: boolean;
      };
    };
  };
}

// Dashboard layout types
export interface DashboardSection {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  props?: Record<string, any>;
  size?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  order?: number;
  isVisible?: boolean;
}

export interface DashboardLayoutConfig {
  sections: DashboardSection[];
  columns: number;
  gap: number;
  responsive: boolean;
}

// Formatter function types
export type ValueFormatter = (value: number | string) => string;
export type DateFormatter = (date: string) => string;
export type PercentageFormatter = (value: number, decimals?: number) => string;

// Export data types
export interface ExportConfig {
  format: ExportFormat;
  timeRange: DashboardTimeRange;
  sections: string[];
  includeCharts: boolean;
  includeRawData: boolean;
}

export interface ExportResult {
  downloadUrl: string;
  fileName: string;
  fileSize: number;
  expiresAt: string;
}

// Error types specific to dashboard
export interface DashboardError {
  code: string;
  message: string;
  section?: string;
  timestamp: string;
  retryable: boolean;
}

// Loading states for different sections
export interface LoadingStates {
  overview: boolean;
  revenue: boolean;
  users: boolean;
  dates: boolean;
  alerts: boolean;
  trends: boolean;
  export: boolean;
}

// Constants for the dashboard
export const TIME_RANGE_OPTIONS: TimeRangeOption[] = [
  { label: 'Today', value: DashboardTimeRange.TODAY, description: 'Data from today' },
  { label: 'Last 7 Days', value: DashboardTimeRange.LAST_7_DAYS, description: 'Past week' },
  { label: 'Last 30 Days', value: DashboardTimeRange.LAST_30_DAYS, description: 'Past month' },
  { label: 'Last 90 Days', value: DashboardTimeRange.LAST_90_DAYS, description: 'Past quarter' },
  { label: 'This Month', value: DashboardTimeRange.THIS_MONTH, description: 'Current month' },
  { label: 'Last Month', value: DashboardTimeRange.LAST_MONTH, description: 'Previous month' },
  { label: 'This Year', value: DashboardTimeRange.THIS_YEAR, description: 'Current year' },
  { label: 'All Time', value: DashboardTimeRange.ALL_TIME, description: 'Since launch' },
];

export const METRIC_CARD_VARIANTS = {
  [MetricVariant.DEFAULT]: {
    bg: 'white',
    borderColor: 'gray.200',
    iconColor: 'gray.500',
  },
  [MetricVariant.REVENUE]: {
    bg: 'green.50',
    borderColor: 'green.200',
    iconColor: 'green.500',
  },
  [MetricVariant.USERS]: {
    bg: 'blue.50',
    borderColor: 'blue.200',
    iconColor: 'blue.500',
  },
  [MetricVariant.DATES]: {
    bg: 'brand.50',
    borderColor: 'brand.200',
    iconColor: 'brand.500',
  },
  [MetricVariant.SUCCESS]: {
    bg: 'green.50',
    borderColor: 'green.200',
    iconColor: 'green.500',
  },
  [MetricVariant.WARNING]: {
    bg: 'orange.50',
    borderColor: 'orange.200',
    iconColor: 'orange.500',
  },
  [MetricVariant.ERROR]: {
    bg: 'red.50',
    borderColor: 'red.200',
    iconColor: 'red.500',
  },
} as const;

export const ALERT_SEVERITY_COLORS = {
  [AlertSeverity.LOW]: {
    bg: 'blue.50',
    border: 'blue.200',
    text: 'blue.800',
    icon: 'blue.500',
  },
  [AlertSeverity.MEDIUM]: {
    bg: 'orange.50',
    border: 'orange.200',
    text: 'orange.800',
    icon: 'orange.500',
  },
  [AlertSeverity.HIGH]: {
    bg: 'red.50',
    border: 'red.200',
    text: 'red.800',
    icon: 'red.500',
  },
  [AlertSeverity.CRITICAL]: {
    bg: 'red.100',
    border: 'red.300',
    text: 'red.900',
    icon: 'red.600',
  },
} as const;

export const CHART_COLORS = {
  primary: '#e85d75',
  secondary: '#3b82f6',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  neutral: '#6b7280',
  light: '#f3f4f6',
} as const;

export const DASHBOARD_REFRESH_INTERVALS = {
  never: 0,
  every_minute: 60 * 1000,
  every_5_minutes: 5 * 60 * 1000,
  every_15_minutes: 15 * 60 * 1000,
  every_30_minutes: 30 * 60 * 1000,
  every_hour: 60 * 60 * 1000,
} as const;

// Type guards
export const isValidTimeRange = (value: string): value is DashboardTimeRange => {
  return Object.values(DashboardTimeRange).includes(value as DashboardTimeRange);
};

export const isValidAlertSeverity = (value: string): value is AlertSeverity => {
  return Object.values(AlertSeverity).includes(value as AlertSeverity);
};

// Utility types
export type DashboardComponent = React.ComponentType<{
  timeRange: DashboardTimeRange;
  isLoading?: boolean;
  error?: string | null;
}>;

export type MetricVariantType = keyof typeof METRIC_CARD_VARIANTS;
export type AlertSeverityColor = keyof typeof ALERT_SEVERITY_COLORS;
export type ChartColor = keyof typeof CHART_COLORS;