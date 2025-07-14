// apps/frontend/src/mvp/admin-v2/dashboard/services/dashboardService.ts

import apiService from "../../../../service/apiService";
import { ServiceResponse } from "@datifyy/shared-types";
import type {
  AdminDashboardOverviewResponse,
  RevenueAnalyticsOverview,
  UserAnalyticsResponse,
  DateAnalyticsResponse,
  DashboardAlert,
  MetricTrends,
  DashboardTimeRange
} from "../types";
import { DashboardTimeRange as DashboardTimeRangeEnum, TrendDirection, AlertSeverity, SystemStatus } from "../types";

const ADMIN_API_PREFIX = "admin/dashboard";

// 🔧 Toggle this to switch between mock data and real API calls
const USE_MOCK_DATA = true;

/**
 * Admin Dashboard Service
 * Handles all dashboard-related API calls with proper error handling
 * Toggle USE_MOCK_DATA to switch between mock data and real API calls
 */
class AdminDashboardService {

  // ===== MOCK DATA SECTION =====

  /**
   * Generate mock dashboard overview data
   */
  private getMockDashboardOverview(): AdminDashboardOverviewResponse {
    return {
      userMetrics: {
        totalUsers: 15420,
        activeUsersToday: 1230,
        newUsersToday: 87,
        totalUsersGrowth: {
          direction: TrendDirection.UP,
          percentage: 12.5,
          previousValue: 13708,
          currentValue: 15420,
        },
        activeUsersGrowth: {
          direction: TrendDirection.UP,
          percentage: 8.3,
          previousValue: 1135,
          currentValue: 1230,
        },
        verifiedUsers: 12340,
        verificationRate: 80.1,
      },
      revenueMetrics: {
        totalRevenue: 285400,
        revenueToday: 4200,
        revenueThisWeek: 28500,
        revenueThisMonth: 95200,
        totalRevenueGrowth: {
          direction: TrendDirection.UP,
          percentage: 24.7,
          previousValue: 228900,
          currentValue: 285400,
        },
        averageRevenuePerUser: 18.5,
        topRevenueSources: [
          { source: 'Premium Subscriptions', amount: 142700, percentage: 50.0 },
          { source: 'Date Tokens', amount: 85620, percentage: 30.0 },
          { source: 'Boost Features', amount: 57080, percentage: 20.0 },
        ],
      },
      dateMetrics: {
        totalDatesSetup: 8450,
        datesThisWeek: 245,
        datesThisMonth: 1050,
        datesSetupGrowth: {
          direction: TrendDirection.UP,
          percentage: 15.8,
          previousValue: 7300,
          currentValue: 8450,
        },
        successRate: 0.742,
        successRateGrowth: {
          direction: TrendDirection.UP,
          percentage: 3.2,
          previousValue: 0.719,
          currentValue: 0.742,
        },
        averageDateDuration: 75,
        completedDates: 6270,
        cancelledDates: 890,
      },
      activityMetrics: {
        activeUsersToday: 1230,
        peakActiveUsers: 1560,
        averageSessionDuration: 24.5,
        totalSessions: 4580,
        newSignups: 87,
        userRetentionRate: 68.3,
      },
      alerts: [
        {
          id: '1',
          title: 'High Server Load',
          message: 'API response times have increased by 15% in the last hour',
          severity: AlertSeverity.MEDIUM,
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          isRead: false,
        },
        {
          id: '2',
          title: 'Revenue Milestone',
          message: 'Monthly revenue target of ₹2.5L achieved!',
          severity: AlertSeverity.LOW,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          isRead: false,
        },
      ],
      lastUpdated: new Date().toISOString(),
      systemStatus: SystemStatus.HEALTHY,
    };
  }

  /**
   * Generate mock revenue analytics data
   */
  private getMockRevenueAnalytics(): RevenueAnalyticsOverview {
    return {
      summary: {
        totalRevenue: 285400,
        monthlyRecurringRevenue: 95200,
        averageRevenuePerUser: 18.5,
        revenueGrowthRate: 24.7,
      },
      trends: {
        daily: this.generateTrendData(30, 3000, 8000),
        weekly: this.generateTrendData(12, 18000, 35000),
        monthly: this.generateTrendData(6, 65000, 95000),
      },
      breakdown: {
        bySource: [
          { source: 'Premium Subscriptions', amount: 142700, percentage: 50.0 },
          { source: 'Date Tokens', amount: 85620, percentage: 30.0 },
          { source: 'Boost Features', amount: 57080, percentage: 20.0 },
        ],
        byUserType: [
          { type: 'Premium Users', amount: 199780, percentage: 70.0 },
          { type: 'Free Users', amount: 85620, percentage: 30.0 },
        ],
        byRegion: [
          { region: 'Mumbai', amount: 85620, percentage: 30.0 },
          { region: 'Delhi', amount: 71350, percentage: 25.0 },
          { region: 'Bangalore', amount: 57080, percentage: 20.0 },
          { region: 'Other Cities', amount: 71350, percentage: 25.0 },
        ],
      },
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Generate mock user analytics data
   */
  private getMockUserAnalytics(): UserAnalyticsResponse {
    return {
      overview: {
        totalUsers: 15420,
        activeUsers: 8950,
        newUsers: 87,
        retentionRate: 68.3,
      },
      demographics: {
        byAge: [
          { ageGroup: '18-24', count: 4626, percentage: 30.0 },
          { ageGroup: '25-34', count: 7710, percentage: 50.0 },
          { ageGroup: '35-44', count: 2313, percentage: 15.0 },
          { ageGroup: '45+', count: 771, percentage: 5.0 },
        ],
        byGender: [
          { gender: 'Male', count: 8000, percentage: 51.9 },
          { gender: 'Female', count: 7420, percentage: 48.1 },
        ],
        byLocation: [
          { location: 'Mumbai', count: 3084, percentage: 20.0 },
          { location: 'Delhi', count: 2621, percentage: 17.0 },
          { location: 'Bangalore', count: 2313, percentage: 15.0 },
          { location: 'Other', count: 7402, percentage: 48.0 },
        ],
      },
      activity: {
        dailyActiveUsers: this.generateTrendData(30, 800, 1400),
        sessionDuration: this.generateTrendData(30, 20, 35),
        pageViews: this.generateTrendData(30, 2500, 5000),
      },
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Generate mock date analytics data
   */
  private getMockDateAnalytics(): DateAnalyticsResponse {
    return {
      overview: {
        totalDates: 8450,
        successfulDates: 6270,
        cancelledDates: 890,
        averageRating: 4.2,
      },
      trends: {
        datesSetup: this.generateTrendData(30, 15, 35),
        successRate: this.generateTrendData(30, 65, 80, true),
        userSatisfaction: this.generateTrendData(30, 3.8, 4.5, true),
      },
      insights: {
        popularTimeSlots: [
          { timeSlot: '7:00 PM - 9:00 PM', count: 2845 },
          { timeSlot: '12:00 PM - 2:00 PM', count: 1950 },
          { timeSlot: '6:00 PM - 8:00 PM', count: 1680 },
          { timeSlot: '8:00 PM - 10:00 PM', count: 1420 },
        ],
        popularLocations: [
          { location: 'Coffee Shops', count: 3380 },
          { location: 'Restaurants', count: 2535 },
          { location: 'Parks', count: 1690 },
          { location: 'Virtual Dates', count: 845 },
        ],
        averageDateDuration: 75,
      },
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Generate mock dashboard alerts
   */
  private getMockDashboardAlerts(): DashboardAlert[] {
    return [
      {
        id: '1',
        title: 'High User Activity',
        message: 'Current active users (1,230) are 25% above normal levels',
        severity: AlertSeverity.LOW,
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        isRead: false,
        actionUrl: '/admin/users',
        actionText: 'View Users',
      },
      {
        id: '2',
        title: 'Payment Gateway Issue',
        message: 'Payment success rate dropped to 92% in the last hour',
        severity: AlertSeverity.HIGH,
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        isRead: false,
        actionUrl: '/admin/revenue',
        actionText: 'Check Payments',
      },
      {
        id: '3',
        title: 'Server Performance',
        message: 'API response time increased by 15% - monitoring closely',
        severity: AlertSeverity.MEDIUM,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isRead: true,
      },
    ];
  }

  /**
   * Generate mock metric trends data
   */
  private getMockMetricTrends(): MetricTrends {
    return {
      userGrowth: this.generateTrendData(30, 13000, 15500),
      revenue: this.generateTrendData(30, 250000, 290000),
      dateSuccessRate: this.generateTrendData(30, 68, 76, true),
      dailyActiveUsers: this.generateTrendData(30, 900, 1300),
      signups: this.generateTrendData(30, 50, 120),
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Helper function to generate realistic trend data
   */
  private generateTrendData(days: number, min: number, max: number, isPercentage = false): Array<{date: string; value: number; label?: string}> {
    const data = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Generate realistic trending data with some randomness
      const progress = (days - 1 - i) / (days - 1);
      const trend = min + (max - min) * progress;
      const randomVariation = (Math.random() - 0.5) * (max - min) * 0.1;
      let value = trend + randomVariation;
      
      // Ensure percentage values stay within bounds
      if (isPercentage) {
        value = Math.max(0, Math.min(100, value));
      }
      
      data.push({
        date: date.toISOString(),
        value: Math.round(value * 100) / 100,
        label: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      });
    }
    
    return data;
  }

  /**
   * Simulate API delay for realistic mock behavior
   */
  private async simulateDelay(ms: number = 500 + Math.random() * 1000): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  // ===== API METHODS =====

  /**
   * Get dashboard overview with all key metrics
   */
  async getDashboardOverview(
    timeRange: DashboardTimeRange = DashboardTimeRangeEnum.LAST_7_DAYS
  ): Promise<ServiceResponse<AdminDashboardOverviewResponse>> {
    try {
      console.log('🔍 Fetching dashboard overview...', { timeRange, useMock: USE_MOCK_DATA });
      
      // Return mock data if enabled
      if (USE_MOCK_DATA) {
        await this.simulateDelay();
        const mockData = this.getMockDashboardOverview();
        console.log('✅ Mock dashboard overview returned');
        return { response: mockData, error: undefined };
      }
      
      const response = await apiService.get<AdminDashboardOverviewResponse>(
        `${ADMIN_API_PREFIX}/overview?timeRange=${timeRange}`
      );

      if (response.error) {
        console.error('❌ Failed to fetch dashboard overview:', response.error);
        return { response: undefined, error: response.error };
      }

      console.log('✅ Dashboard overview fetched successfully');
      return { response: response.response, error: undefined };
      
    } catch (error: any) {
      console.error('❌ Dashboard overview fetch error:', error);
      return { 
        response: undefined, 
        error: { code: 500, message: "Failed to fetch dashboard overview" } 
      };
    }
  }

  /**
   * Get detailed revenue analytics
   */
  async getRevenueAnalytics(
    timeRange: DashboardTimeRange = DashboardTimeRangeEnum.LAST_30_DAYS
  ): Promise<ServiceResponse<RevenueAnalyticsOverview>> {
    try {
      console.log('💰 Fetching revenue analytics...', { timeRange, useMock: USE_MOCK_DATA });
      
      // Return mock data if enabled
      if (USE_MOCK_DATA) {
        await this.simulateDelay();
        const mockData = this.getMockRevenueAnalytics();
        console.log('✅ Mock revenue analytics returned');
        return { response: mockData, error: undefined };
      }
      
      const response = await apiService.get<RevenueAnalyticsOverview>(
        `${ADMIN_API_PREFIX}/revenue?timeRange=${timeRange}`
      );

      if (response.error) {
        console.error('❌ Failed to fetch revenue analytics:', response.error);
        return { response: undefined, error: response.error };
      }

      console.log('✅ Revenue analytics fetched successfully');
      return { response: response.response, error: undefined };
      
    } catch (error: any) {
      console.error('❌ Revenue analytics fetch error:', error);
      return { 
        response: undefined, 
        error: { code: 500, message: "Failed to fetch revenue analytics" } 
      };
    }
  }

  /**
   * Get user analytics and metrics
   */
  async getUserAnalytics(
    timeRange: DashboardTimeRange = DashboardTimeRangeEnum.LAST_30_DAYS
  ): Promise<ServiceResponse<UserAnalyticsResponse>> {
    try {
      console.log('👥 Fetching user analytics...', { timeRange, useMock: USE_MOCK_DATA });
      
      // Return mock data if enabled
      if (USE_MOCK_DATA) {
        await this.simulateDelay();
        const mockData = this.getMockUserAnalytics();
        console.log('✅ Mock user analytics returned');
        return { response: mockData, error: undefined };
      }
      
      const response = await apiService.get<UserAnalyticsResponse>(
        `${ADMIN_API_PREFIX}/users?timeRange=${timeRange}`
      );

      if (response.error) {
        console.error('❌ Failed to fetch user analytics:', response.error);
        return { response: undefined, error: response.error };
      }

      console.log('✅ User analytics fetched successfully');
      return { response: response.response, error: undefined };
      
    } catch (error: any) {
      console.error('❌ User analytics fetch error:', error);
      return { 
        response: undefined, 
        error: { code: 500, message: "Failed to fetch user analytics" } 
      };
    }
  }

  /**
   * Get date analytics and curation metrics
   */
  async getDateAnalytics(
    timeRange: DashboardTimeRange = DashboardTimeRangeEnum.LAST_30_DAYS
  ): Promise<ServiceResponse<DateAnalyticsResponse>> {
    try {
      console.log('💑 Fetching date analytics...', { timeRange, useMock: USE_MOCK_DATA });
      
      // Return mock data if enabled
      if (USE_MOCK_DATA) {
        await this.simulateDelay();
        const mockData = this.getMockDateAnalytics();
        console.log('✅ Mock date analytics returned');
        return { response: mockData, error: undefined };
      }
      
      const response = await apiService.get<DateAnalyticsResponse>(
        `${ADMIN_API_PREFIX}/dates?timeRange=${timeRange}`
      );

      if (response.error) {
        console.error('❌ Failed to fetch date analytics:', response.error);
        return { response: undefined, error: response.error };
      }

      console.log('✅ Date analytics fetched successfully');
      return { response: response.response, error: undefined };
      
    } catch (error: any) {
      console.error('❌ Date analytics fetch error:', error);
      return { 
        response: undefined, 
        error: { code: 500, message: "Failed to fetch date analytics" } 
      };
    }
  }

  /**
   * Get dashboard alerts and notifications
   */
  async getDashboardAlerts(): Promise<ServiceResponse<DashboardAlert[]>> {
    try {
      console.log('🚨 Fetching dashboard alerts...', { useMock: USE_MOCK_DATA });
      
      // Return mock data if enabled
      if (USE_MOCK_DATA) {
        await this.simulateDelay(300);
        const mockData = this.getMockDashboardAlerts();
        console.log('✅ Mock dashboard alerts returned');
        return { response: mockData, error: undefined };
      }
      
      const response = await apiService.get<DashboardAlert[]>(
        `${ADMIN_API_PREFIX}/alerts`
      );

      if (response.error) {
        console.error('❌ Failed to fetch dashboard alerts:', response.error);
        return { response: undefined, error: response.error };
      }

      console.log('✅ Dashboard alerts fetched successfully');
      return { response: response.response, error: undefined };
      
    } catch (error: any) {
      console.error('❌ Dashboard alerts fetch error:', error);
      return { 
        response: undefined, 
        error: { code: 500, message: "Failed to fetch dashboard alerts" } 
      };
    }
  }

  /**
   * Get metric trends for charts
   */
  async getMetricTrends(
    timeRange: DashboardTimeRange = DashboardTimeRangeEnum.LAST_30_DAYS
  ): Promise<ServiceResponse<MetricTrends>> {
    try {
      console.log('📈 Fetching metric trends...', { timeRange, useMock: USE_MOCK_DATA });
      
      // Return mock data if enabled
      if (USE_MOCK_DATA) {
        await this.simulateDelay(800);
        const mockData = this.getMockMetricTrends();
        console.log('✅ Mock metric trends returned');
        return { response: mockData, error: undefined };
      }
      
      const response = await apiService.get<MetricTrends>(
        `${ADMIN_API_PREFIX}/trends?timeRange=${timeRange}`
      );

      if (response.error) {
        console.error('❌ Failed to fetch metric trends:', response.error);
        return { response: undefined, error: response.error };
      }

      console.log('✅ Metric trends fetched successfully');
      return { response: response.response, error: undefined };
      
    } catch (error: any) {
      console.error('❌ Metric trends fetch error:', error);
      return { 
        response: undefined, 
        error: { code: 500, message: "Failed to fetch metric trends" } 
      };
    }
  }

  /**
   * Refresh all dashboard data
   */
  async refreshDashboard(): Promise<ServiceResponse<{ message: string }>> {
    try {
      console.log('🔄 Refreshing dashboard data...', { useMock: USE_MOCK_DATA });
      
      // Return mock response if enabled
      if (USE_MOCK_DATA) {
        await this.simulateDelay(1000);
        const mockResponse = { message: 'Dashboard data refreshed successfully' };
        console.log('✅ Mock dashboard refresh completed');
        return { response: mockResponse, error: undefined };
      }
      
      const response = await apiService.post<{ message: string }>(
        `${ADMIN_API_PREFIX}/refresh`
      );

      if (response.error) {
        console.error('❌ Failed to refresh dashboard:', response.error);
        return { response: undefined, error: response.error };
      }

      console.log('✅ Dashboard refreshed successfully');
      return { response: response.response, error: undefined };
      
    } catch (error: any) {
      console.error('❌ Dashboard refresh error:', error);
      return { 
        response: undefined, 
        error: { code: 500, message: "Failed to refresh dashboard" } 
      };
    }
  }

  /**
   * Export dashboard data
   */
  async exportDashboardData(
    format: 'csv' | 'excel' | 'pdf' = 'csv',
    timeRange: DashboardTimeRange = DashboardTimeRangeEnum.LAST_30_DAYS
  ): Promise<ServiceResponse<{ downloadUrl: string; expiresAt: string }>> {
    try {
      console.log('📊 Exporting dashboard data...', { format, timeRange, useMock: USE_MOCK_DATA });
      
      // Return mock response if enabled
      if (USE_MOCK_DATA) {
        await this.simulateDelay(2000);
        const mockResponse = {
          downloadUrl: `https://datifyy-exports.s3.amazonaws.com/dashboard-${Date.now()}.${format}`,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
        };
        console.log('✅ Mock dashboard export completed');
        return { response: mockResponse, error: undefined };
      }
      
      const response = await apiService.post<{ downloadUrl: string; expiresAt: string }>(
        `${ADMIN_API_PREFIX}/export`,
        { format, timeRange }
      );

      if (response.error) {
        console.error('❌ Failed to export dashboard data:', response.error);
        return { response: undefined, error: response.error };
      }

      console.log('✅ Dashboard data exported successfully');
      return { response: response.response, error: undefined };
      
    } catch (error: any) {
      console.error('❌ Dashboard export error:', error);
      return { 
        response: undefined, 
        error: { code: 500, message: "Failed to export dashboard data" } 
      };
    }
  }
}

// Export singleton instance
const adminDashboardService = new AdminDashboardService();
export default adminDashboardService;