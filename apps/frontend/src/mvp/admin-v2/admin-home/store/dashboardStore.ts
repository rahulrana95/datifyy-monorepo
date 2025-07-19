/**
 * Dashboard Store
 * State management for admin dashboard using Zustand
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import dashboardService from '../services/dashboardService';
import { 
  AdminDashboardState, 
  DashboardFilters,
  DashboardMetrics,
  RevenueData,
  LocationActivity
} from '../types';

interface DashboardStore extends AdminDashboardState {
  // Actions
  setFilters: (filters: Partial<DashboardFilters>) => void;
  fetchMetrics: () => Promise<void>;
  fetchRevenueData: () => Promise<void>;
  fetchLocationActivity: () => Promise<void>;
  fetchAllData: () => Promise<void>;
  resetFilters: () => void;
  clearError: () => void;
}

const initialFilters: DashboardFilters = {
  timeframe: 'week'
};

export const useDashboardStore = create<DashboardStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      metrics: null,
      revenueData: null,
      locationActivity: [],
      isLoading: false,
      error: null,
      filters: initialFilters,

      // Actions
      setFilters: (filters) => {
        set((state) => ({
          filters: { ...state.filters, ...filters }
        }));
      },

      fetchMetrics: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const { response, error } = await dashboardService.getMetrics(get().filters);
          
          if (error) {
            set({ error: error.message, isLoading: false });
            return;
          }

          set({ 
            metrics: response || null, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: 'Failed to load metrics', 
            isLoading: false 
          });
        }
      },

      fetchRevenueData: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const { response, error } = await dashboardService.getRevenueAnalytics(get().filters);
          
          if (error) {
            set({ error: error.message, isLoading: false });
            return;
          }

          set({ 
            revenueData: response || null, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: 'Failed to load revenue data', 
            isLoading: false 
          });
        }
      },

      fetchLocationActivity: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const { response, error } = await dashboardService.getLocationActivity(get().filters);
          
          if (error) {
            set({ error: error.message, isLoading: false });
            return;
          }

          set({ 
            locationActivity: response || [], 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: 'Failed to load location activity', 
            isLoading: false 
          });
        }
      },

      fetchAllData: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Fetch all data in parallel
          const [metricsResult, revenueResult, locationResult] = await Promise.all([
            dashboardService.getMetrics(get().filters),
            dashboardService.getRevenueAnalytics(get().filters),
            dashboardService.getLocationActivity(get().filters)
          ]);

          // Check for errors
          const errors = [
            metricsResult.error,
            revenueResult.error,
            locationResult.error
          ].filter(Boolean);

          if (errors.length > 0) {
            set({ 
              error: errors[0]?.message || 'Failed to load dashboard data', 
              isLoading: false 
            });
            return;
          }

          set({
            metrics: metricsResult.response || null,
            revenueData: revenueResult.response || null,
            locationActivity: locationResult.response || [],
            isLoading: false
          });
        } catch (error) {
          set({ 
            error: 'Failed to load dashboard data', 
            isLoading: false 
          });
        }
      },

      resetFilters: () => {
        set({ filters: initialFilters });
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'admin-dashboard-store'
    }
  )
);