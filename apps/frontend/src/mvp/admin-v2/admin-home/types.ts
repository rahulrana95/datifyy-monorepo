/**
 * Admin Dashboard Types
 */

export interface MetricData {
  value: number;
  label: string;
  icon?: string;
  color?: string;
  changePercent?: number;
  trend?: 'up' | 'down' | 'neutral';
  previousValue?: number;
}

export interface DashboardFilters {
  timeframe: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'all';
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface DashboardMetrics {
  totalSignups: MetricData;
  verifiedUsers: MetricData;
  activeUsersToday: MetricData;
  activeUsersThisWeek: MetricData;
  totalCuratedDates: MetricData;
  successfulDatesThisMonth: MetricData;
  upcomingDates: MetricData;
  cancelledDates: MetricData;
  totalRevenue: MetricData;
  totalTokensPurchased: MetricData;
  newUsersThisWeek: MetricData;
}

export interface RevenueData {
  totalRevenue: number;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
  }>;
  revenueByDateType: {
    online: number;
    offline: number;
  };
  topRevenueCities: Array<{
    city: string;
    revenue: number;
    userCount: number;
  }>;
}

export interface LocationActivity {
  city: string;
  state: string;
  activeUsers: number;
  totalDates: number;
  revenue: number;
}

export interface AdminDashboardState {
  metrics: DashboardMetrics | null;
  revenueData: RevenueData | null;
  locationActivity: LocationActivity[];
  isLoading: boolean;
  error: string | null;
  filters: DashboardFilters;
}