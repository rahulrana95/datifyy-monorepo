// apps/frontend/src/mvp/admin-v2/dashboard/store/dashboardStore.ts

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  AdminDashboardOverviewResponse,
  RevenueAnalyticsOverview,
  UserAnalyticsResponse,
  DateAnalyticsResponse,
  DashboardAlert,
  MetricTrends,
  DashboardTimeRange
} from "../types";
import adminDashboardService from '../services/dashboardService';

// Store state interface
interface DashboardState {
  // Data state
  overview: AdminDashboardOverviewResponse | null;
  revenueAnalytics: RevenueAnalyticsOverview | null;
  userAnalytics: UserAnalyticsResponse | null;
  dateAnalytics: DateAnalyticsResponse | null;
  alerts: DashboardAlert[];
  trends: MetricTrends | null;
  
  // UI state
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  selectedTimeRange: DashboardTimeRange;
  lastUpdated: string | null;
  
  // Actions
  setTimeRange: (timeRange: DashboardTimeRange) => void;
  fetchDashboardOverview: () => Promise<void>;
  fetchRevenueAnalytics: () => Promise<void>;
  fetchUserAnalytics: () => Promise<void>;
  fetchDateAnalytics: () => Promise<void>;
  fetchAlerts: () => Promise<void>;
  fetchTrends: () => Promise<void>;
  refreshAllData: () => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

// Initial state
const initialState = {
  overview: null,
  revenueAnalytics: null,
  userAnalytics: null,
  dateAnalytics: null,
  alerts: [],
  trends: null,
  isLoading: false,
  isRefreshing: false,
  error: null,
  selectedTimeRange: DashboardTimeRange.LAST_7_DAYS,
  lastUpdated: null,
};

// Create the store
export const useDashboardStore = create<DashboardState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      /**
       * Set selected time range and refresh data
       */
      setTimeRange: async (timeRange: DashboardTimeRange) => {
        console.log('⏰ Setting time range:', timeRange);
        set({ selectedTimeRange: timeRange });
        
        // Auto-refresh data when time range changes
        await get().fetchDashboardOverview();
        await get().fetchTrends();
      },

      /**
       * Fetch dashboard overview data
       */
      fetchDashboardOverview: async () => {
        const { selectedTimeRange } = get();
        
        set({ isLoading: true, error: null });
        
        try {
          console.log('📊 Fetching dashboard overview...');
          
          const result = await adminDashboardService.getDashboardOverview(selectedTimeRange);
          
          if (result.error) {
            set({ 
              error: result.error.message || 'Failed to fetch dashboard overview',
              isLoading: false 
            });
            return;
          }

          set({ 
            overview: result.response || null,
            isLoading: false,
            lastUpdated: new Date().toISOString(),
            error: null
          });
          
        } catch (error: any) {
          console.error('❌ Dashboard overview fetch error:', error);
          set({ 
            error: 'Failed to fetch dashboard overview',
            isLoading: false 
          });
        }
      },

      /**
       * Fetch revenue analytics
       */
      fetchRevenueAnalytics: async () => {
        const { selectedTimeRange } = get();
        
        try {
          console.log('💰 Fetching revenue analytics...');
          
          const result = await adminDashboardService.getRevenueAnalytics(selectedTimeRange);
          
          if (result.error) {
            console.warn('⚠️ Revenue analytics fetch failed:', result.error.message);
            return;
          }

          set({ 
            revenueAnalytics: result.response || null,
            error: null
          });
          
        } catch (error: any) {
          console.error('❌ Revenue analytics fetch error:', error);
        }
      },

      /**
       * Fetch user analytics
       */
      fetchUserAnalytics: async () => {
        const { selectedTimeRange } = get();
        
        try {
          console.log('👥 Fetching user analytics...');
          
          const result = await adminDashboardService.getUserAnalytics(selectedTimeRange);
          
          if (result.error) {
            console.warn('⚠️ User analytics fetch failed:', result.error.message);
            return;
          }

          set({ 
            userAnalytics: result.response || null,
            error: null
          });
          
        } catch (error: any) {
          console.error('❌ User analytics fetch error:', error);
        }
      },

      /**
       * Fetch date analytics
       */
      fetchDateAnalytics: async () => {
        const { selectedTimeRange } = get();
        
        try {
          console.log('💑 Fetching date analytics...');
          
          const result = await adminDashboardService.getDateAnalytics(selectedTimeRange);
          
          if (result.error) {
            console.warn('⚠️ Date analytics fetch failed:', result.error.message);
            return;
          }

          set({ 
            dateAnalytics: result.response || null,
            error: null
          });
          
        } catch (error: any) {
          console.error('❌ Date analytics fetch error:', error);
        }
      },

      /**
       * Fetch dashboard alerts
       */
      fetchAlerts: async () => {
        try {
          console.log('🚨 Fetching dashboard alerts...');
          
          const result = await adminDashboardService.getDashboardAlerts();
          
          if (result.error) {
            console.warn('⚠️ Alerts fetch failed:', result.error.message);
            return;
          }

          set({ 
            alerts: result.response || [],
            error: null
          });
          
        } catch (error: any) {
          console.error('❌ Alerts fetch error:', error);
        }
      },

      /**
       * Fetch metric trends for charts
       */
      fetchTrends: async () => {
        const { selectedTimeRange } = get();
        
        try {
          console.log('📈 Fetching metric trends...');
          
          const result = await adminDashboardService.getMetricTrends(selectedTimeRange);
          
          if (result.error) {
            console.warn('⚠️ Trends fetch failed:', result.error.message);
            return;
          }

          set({ 
            trends: result.response || null,
            error: null
          });
          
        } catch (error: any) {
          console.error('❌ Trends fetch error:', error);
        }
      },

      /**
       * Refresh all dashboard data
       */
      refreshAllData: async () => {
        set({ isRefreshing: true, error: null });
        
        try {
          console.log('🔄 Refreshing all dashboard data...');
          
          // Refresh backend cache first
          await adminDashboardService.refreshDashboard();
          
          // Fetch all data in parallel
          await Promise.all([
            get().fetchDashboardOverview(),
            get().fetchRevenueAnalytics(),
            get().fetchUserAnalytics(),
            get().fetchDateAnalytics(),
            get().fetchAlerts(),
            get().fetchTrends(),
          ]);
          
          set({ 
            isRefreshing: false,
            lastUpdated: new Date().toISOString(),
            error: null
          });
          
          console.log('✅ All dashboard data refreshed successfully');
          
        } catch (error: any) {
          console.error('❌ Dashboard refresh error:', error);
          set({ 
            error: 'Failed to refresh dashboard data',
            isRefreshing: false 
          });
        }
      },

      /**
       * Clear current error
       */
      clearError: () => {
        set({ error: null });
      },

      /**
       * Reset store to initial state
       */
      reset: () => {
        console.log('🔄 Resetting dashboard store...');
        set(initialState);
      },
    }),
    {
      name: 'admin-dashboard-store',
      partialize: (state: { selectedTimeRange: any; }) => ({
        selectedTimeRange: state.selectedTimeRange,
        // Don't persist data, only user preferences
      }),
    }
  )
);

// Selector hooks for specific data
export const useDashboardOverview = () => useDashboardStore((state) => state.overview);
export const useDashboardLoading = () => useDashboardStore((state) => state.isLoading);
export const useDashboardError = () => useDashboardStore((state) => state.error);
export const useDashboardTimeRange = () => useDashboardStore((state) => state.selectedTimeRange);
export const useDashboardAlerts = () => useDashboardStore((state) => state.alerts);
export const useRevenueAnalytics = () => useDashboardStore((state) => state.revenueAnalytics);
export const useUserAnalytics = () => useDashboardStore((state) => state.userAnalytics);
export const useDateAnalytics = () => useDashboardStore((state) => state.dateAnalytics);
export const useMetricTrends = () => useDashboardStore((state) => state.trends);

export default useDashboardStore;