// apps/frontend/src/mvp/admin-v2/dashboard/utils/formatters.ts

import { formatCurrency, formatNumber, formatPercentage } from "@datifyy/shared-utils";
import type { TrendDirection } from "@datifyy/shared-types";
import type { ValueFormatter, DateFormatter, PercentageFormatter } from "../types";

/**
 * Format metric values for display in dashboard cards
 */
export const formatMetricValue: ValueFormatter = (value) => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return '0';
  
  // Format large numbers with K, M, B suffixes
  if (numValue >= 1000000000) {
    return `${(numValue / 1000000000).toFixed(1)}B`;
  }
  if (numValue >= 1000000) {
    return `${(numValue / 1000000).toFixed(1)}M`;
  }
  if (numValue >= 1000) {
    return `${(numValue / 1000).toFixed(1)}K`;
  }
  
  return formatNumber(numValue);
};

/**
 * Format currency values for revenue metrics
 */
export const formatRevenue = (amount: number, currency: string = 'INR'): string => {
  return formatCurrency(amount, currency, 'en-IN');
};

/**
 * Format percentage values with trend direction
 */
export const formatTrendPercentage: PercentageFormatter = (value, decimals = 1) => {
  const formatted = formatPercentage(Math.abs(value), decimals);
  return formatted;
};

/**
 * Get trend direction icon and color
 */
export const getTrendDisplay = (direction: TrendDirection, percentage: number) => {
  const absPercentage = Math.abs(percentage);
  
  const displays = {
    up: {
      icon: '↗️',
      color: 'green.500',
      bgColor: 'green.50',
      label: `+${formatTrendPercentage(absPercentage)}`,
    },
    down: {
      icon: '↘️',
      color: 'red.500',
      bgColor: 'red.50',
      label: `-${formatTrendPercentage(absPercentage)}`,
    },
    stable: {
      icon: '→',
      color: 'gray.500',
      bgColor: 'gray.50',
      label: formatTrendPercentage(absPercentage),
    },
  };
  
    // @ts-ignore
  return displays[direction] || displays.stable;
};

/**
 * Format dates for dashboard display
 */
export const formatDashboardDate: DateFormatter = (dateString) => {
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) return 'Invalid Date';
  
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  // Show relative time for recent dates
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  // For older dates, show formatted date
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
};

/**
 * Format time ranges for display
 */
export const formatTimeRangeLabel = (timeRange: string): string => {
  const labels: Record<string, string> = {
    today: 'Today',
    last_7_days: 'Last 7 Days',
    last_30_days: 'Last 30 Days',
    last_90_days: 'Last 90 Days',
    this_month: 'This Month',
    last_month: 'Last Month',
    this_year: 'This Year',
    all_time: 'All Time',
  };
  
  return labels[timeRange] || timeRange;
};

/**
 * Format duration in minutes to human readable
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}m`;
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h ${remainingMinutes}m`;
};

/**
 * Format user count with proper pluralization
 */
export const formatUserCount = (count: number): string => {
  const formatted = formatMetricValue(count);
  return count === 1 ? `${formatted} user` : `${formatted} users`;
};

/**
 * Format date count for display
 */
export const formatDateCount = (count: number): string => {
  const formatted = formatMetricValue(count);
  return count === 1 ? `${formatted} date` : `${formatted} dates`;
};

/**
 * Format success rate as percentage
 */
export const formatSuccessRate = (rate: number): string => {
  return formatPercentage(rate * 100, 1);
};

/**
 * Format file size for exports
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

/**
 * Format alert message with proper capitalization
 */
export const formatAlertMessage = (message: string): string => {
  if (!message) return '';
  
  // Capitalize first letter
  return message.charAt(0).toUpperCase() + message.slice(1);
};

/**
 * Format metric growth rate
 */
export const formatGrowthRate = (current: number, previous: number): {
  percentage: number;
  direction: TrendDirection;
  isSignificant: boolean;
} => {
  if (previous === 0) {
    return {
      percentage: current > 0 ? 100 : 0,
      direction: current > 0 ? 'up' as TrendDirection : 'stable' as TrendDirection,
      isSignificant: current > 0,
    };
  }
  
  const percentage = ((current - previous) / previous) * 100;
  const absPercentage = Math.abs(percentage);
  
  return {
    percentage: Math.round(percentage * 10) / 10, // Round to 1 decimal
    direction: percentage > 5 ? 'up' as TrendDirection : percentage < -5 ? 'down' as TrendDirection : 'stable' as TrendDirection,
    isSignificant: absPercentage >= 5, // Consider 5%+ change significant
  };
};

/**
 * Format chart data labels
 */
export const formatChartLabel = (value: number, type: 'currency' | 'number' | 'percentage' = 'number'): string => {
  switch (type) {
    case 'currency':
      return formatRevenue(value);
    case 'percentage':
      return formatPercentage(value);
    default:
      return formatMetricValue(value);
  }
};

/**
 * Format API response timestamps
 */
export const formatLastUpdated = (timestamp: string): string => {
  const lastUpdated = formatDashboardDate(timestamp);
  return `Last updated ${lastUpdated}`;
};

/**
 * Format error messages for user display
 */
export const formatErrorMessage = (error: string | null): string => {
  if (!error) return '';
  
  // Common error message mappings
  const errorMappings: Record<string, string> = {
    'Network Error': 'Unable to connect to server. Please check your internet connection.',
    'Unauthorized': 'Your session has expired. Please log in again.',
    'Forbidden': 'You do not have permission to view this data.',
    'Not Found': 'The requested data could not be found.',
    'Internal Server Error': 'A server error occurred. Please try again later.',
  };
  
  return errorMappings[error] || error;
};

/**
 * Format loading text for different states
 */
export const getLoadingText = (section: string): string => {
  const loadingTexts: Record<string, string> = {
    overview: 'Loading dashboard overview...',
    revenue: 'Loading revenue analytics...',
    users: 'Loading user metrics...',
    dates: 'Loading date analytics...',
    alerts: 'Loading alerts...',
    trends: 'Loading trends...',
    export: 'Preparing export...',
  };
  
  return loadingTexts[section] || 'Loading...';
};

/**
 * Color helpers for metrics
 */
export const getMetricColor = (value: number, thresholds: { good: number; warning: number }): string => {
  if (value >= thresholds.good) return 'green.500';
  if (value >= thresholds.warning) return 'orange.500';
  return 'red.500';
};

/**
 * Format geographic location data
 */
export const formatLocation = (city?: string, state?: string, country?: string): string => {
  const parts = [city, state, country].filter(Boolean);
  return parts.join(', ') || 'Unknown Location';
};

/**
 * Format device type for analytics
 */
export const formatDeviceType = (deviceType: string): string => {
  const deviceMap: Record<string, string> = {
    mobile: 'Mobile',
    tablet: 'Tablet',
    desktop: 'Desktop',
    unknown: 'Unknown',
  };
  
  return deviceMap[deviceType.toLowerCase()] || deviceType;
};