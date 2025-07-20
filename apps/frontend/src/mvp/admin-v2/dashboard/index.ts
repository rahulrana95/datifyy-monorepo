// apps/frontend/src/mvp/admin-v2/dashboard/index.ts

// Main container export
export { default as DashboardContainer } from './container';

// Component exports
export { default as DashboardOverview } from './components/DashboardOverview';
export { default as MetricCard } from './components/MetricCard';
export { default as TrendChart } from './components/TrendChart';

// Store exports
export {
  useDashboardStore,
  useDashboardOverview,
  useDashboardLoading,
  useDashboardError,
  useDashboardTimeRange,
  useDashboardAlerts,
  useRevenueAnalytics,
  useUserAnalytics,
  useDateAnalytics,
  useMetricTrends,
} from './store/dashboardStore';

// Service exports
export { default as adminDashboardService } from './services/dashboardService';

// Type exports
export type {
  MetricCardProps,
  TrendChartProps,
  ChartDataPoint,
  AlertBannerProps,
  DashboardHeaderProps,
  QuickActionProps,
  ChartConfig,
  DashboardSection,
  DashboardLayoutConfig,
  ExportConfig,
  ExportResult,
  DashboardError,
  LoadingStates,
} from './types';

// Utility exports
export {
  formatMetricValue,
  formatRevenue,
  formatTrendPercentage,
  getTrendDisplay,
  formatDashboardDate,
  formatTimeRangeLabel,
  formatDuration,
  formatUserCount,
  formatDateCount,
  formatSuccessRate,
  formatFileSize,
  formatAlertMessage,
  formatGrowthRate,
  formatChartLabel,
  formatLastUpdated,
  formatErrorMessage,
  getLoadingText,
  getMetricColor,
  formatLocation,
  formatDeviceType,
} from './utils/formatters';

// Constants exports
export {
  TIME_RANGE_OPTIONS,
  METRIC_CARD_VARIANTS,
  ALERT_SEVERITY_COLORS,
  CHART_COLORS,
  DASHBOARD_REFRESH_INTERVALS,
} from './types';