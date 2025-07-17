/**
 * Dashboard Service
 * Handles all API calls for admin dashboard
 */

import { BaseService, ServiceResponse } from '../../../../services/baseService';
import { DashboardMetrics, RevenueData, LocationActivity, DashboardFilters } from '../types';
import { 
  mockDashboardMetrics, 
  mockRevenueData, 
  mockLocationActivity, 
  simulateApiDelay 
} from './mockDashboardData';

const ADMIN_API_PREFIX = 'admin/dashboard';

class DashboardService extends BaseService {
  /**
   * Get dashboard metrics
   */
  async getMetrics(filters?: DashboardFilters): Promise<ServiceResponse<DashboardMetrics>> {
    return this.getData<DashboardMetrics>(
      async () => {
        await simulateApiDelay(800);
        return { 
          response: mockDashboardMetrics,
          error: null
        };
      },
      `${ADMIN_API_PREFIX}/metrics/summary`,
      filters
    );
  }

  /**
   * Get revenue analytics
   */
  async getRevenueAnalytics(filters?: DashboardFilters): Promise<ServiceResponse<RevenueData>> {
    return this.getData<RevenueData>(
      async () => {
        await simulateApiDelay(1000);
        return { 
          response: mockRevenueData,
          error: null
        };
      },
      `${ADMIN_API_PREFIX}/revenue/summary`,
      filters
    );
  }

  /**
   * Get location activity heatmap data
   */
  async getLocationActivity(filters?: DashboardFilters): Promise<ServiceResponse<LocationActivity[]>> {
    return this.getData<LocationActivity[]>(
      async () => {
        await simulateApiDelay(600);
        return { 
          response: mockLocationActivity,
          error: null
        };
      },
      `${ADMIN_API_PREFIX}/users/geographic-distribution`,
      filters
    );
  }

  /**
   * Export dashboard data as CSV
   */
  async exportDashboardData(type: 'metrics' | 'revenue' | 'users'): Promise<ServiceResponse<Blob>> {
    return this.getData<Blob>(
      async () => {
        await simulateApiDelay(1500);
        
        // Mock CSV data
        const csvContent = "data:text/csv;charset=utf-8,Date,Metric,Value\n2024-01-01,Signups,100\n2024-01-02,Signups,120";
        const blob = new Blob([csvContent], { type: 'text/csv' });
        
        return { 
          response: blob,
          error: null
        };
      },
      `${ADMIN_API_PREFIX}/export/${type}`
    );
  }
}

export default new DashboardService();