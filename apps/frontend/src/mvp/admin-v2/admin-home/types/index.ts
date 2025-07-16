/**
 * Admin Dashboard Types
 * Based on PRD requirements for metrics and analytics
 */

export interface DashboardMetrics {
  totalSignups: MetricData;
  verifiedUsers: MetricData;
  activeUsersToday: MetricData;
  activeUsersThisWeek: MetricData;
  totalCuratedDates: MetricData;
  successfulDatesThisMonth: MetricData;
  totalTokensPurchased: MetricData;
  totalRevenue: MetricData;
  newUsersThisWeek: MetricData;
  cancelledDates: MetricData;
  upcomingDates: MetricData;
}

export interface MetricData {
  value: number;
  previousValue?: number;
  changePercent?: number;
  trend?: 'up' | 'down' | 'stable';
  label: string;
  icon?: string;
  color?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}

export interface RevenueData {
  totalRevenue: number;
  revenueByWeek: ChartData;
  revenueByMonth: ChartData;
  revenueByDateType: {
    online: number;
    offline: number;
  };
  topRevenueCities: CityRevenue[];
  tokenPacksSold: {
    volume: number;
    amount: number;
  };
}

export interface CityRevenue {
  city: string;
  state: string;
  country: string;
  revenue: number;
  userCount: number;
}

export interface LocationActivity {
  city: string;
  activeUsers: number;
  dates: number;
  revenue: number;
}

export interface DashboardFilters {
  timeframe: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'all';
  startDate?: Date;
  endDate?: Date;
}

export interface AdminDashboardState {
  metrics: DashboardMetrics | null;
  revenueData: RevenueData | null;
  locationActivity: LocationActivity[];
  isLoading: boolean;
  error: string | null;
  filters: DashboardFilters;
}