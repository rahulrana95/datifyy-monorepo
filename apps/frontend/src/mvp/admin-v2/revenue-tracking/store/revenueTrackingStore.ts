/**
 * Revenue Tracking Store
 * State management for revenue tracking using Zustand
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import revenueTrackingService from '../services/revenueTrackingService';
import { 
  RevenueTrackingState,
  Transaction,
  RevenueFilters,
} from '../types';

interface RevenueTrackingStore extends RevenueTrackingState {
  // Actions
  setFilters: (filters: Partial<RevenueFilters>) => void;
  fetchTransactions: (page?: number) => Promise<void>;
  fetchMetrics: () => Promise<void>;
  fetchRevenueByPeriod: (days?: number) => Promise<void>;
  fetchRevenueByCategory: () => Promise<void>;
  fetchTopUsers: () => Promise<void>;
  fetchPaymentMethodStats: () => Promise<void>;
  fetchSubscriptionMetrics: () => Promise<void>;
  fetchAllData: () => Promise<void>;
  selectTransaction: (transaction: Transaction | null) => void;
  clearError: () => void;
  setPageSize: (size: number) => void;
  goToPage: (page: number) => void;
  resetFilters: () => void;
}

const initialFilters: RevenueFilters = {
  search: '',
  status: 'all',
  type: 'all',
  paymentMethod: 'all',
};

export const useRevenueTrackingStore = create<RevenueTrackingStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      transactions: [],
      selectedTransaction: null,
      metrics: null,
      revenueByPeriod: [],
      revenueByCategory: [],
      topUsers: [],
      paymentMethodStats: [],
      subscriptionMetrics: null,
      isLoading: false,
      error: null,
      filters: initialFilters,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        totalItems: 0,
      },

      // Actions
      setFilters: (filters) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
          pagination: { ...state.pagination, currentPage: 1 }, // Reset to first page
        }));
        // Auto-fetch when filters change
        get().fetchTransactions();
      },

      fetchTransactions: async (page) => {
        set({ isLoading: true, error: null });
        
        try {
          const currentPage = page || get().pagination.currentPage;
          const { response, error } = await revenueTrackingService.getTransactions(
            get().filters,
            currentPage,
            get().pagination.pageSize
          );
          
          if (error) {
            set({ error: error.message, isLoading: false });
            return;
          }

          if (response) {
            set({ 
              transactions: response.transactions,
              pagination: {
                ...get().pagination,
                currentPage,
                totalItems: response.totalCount,
              },
              isLoading: false,
            });
          }
        } catch (error) {
          set({ 
            error: 'Failed to load transactions', 
            isLoading: false,
          });
        }
      },

      fetchMetrics: async () => {
        try {
          const { response, error } = await revenueTrackingService.getRevenueMetrics();
          
          if (error) {
            console.error('Failed to fetch metrics:', error);
            return;
          }

          if (response) {
            set({ metrics: response });
          }
        } catch (error) {
          console.error('Failed to fetch metrics:', error);
        }
      },

      fetchRevenueByPeriod: async (days = 30) => {
        try {
          const { response, error } = await revenueTrackingService.getRevenueByPeriod(days);
          
          if (error) {
            console.error('Failed to fetch revenue by period:', error);
            return;
          }

          if (response) {
            set({ revenueByPeriod: response });
          }
        } catch (error) {
          console.error('Failed to fetch revenue by period:', error);
        }
      },

      fetchRevenueByCategory: async () => {
        try {
          const { response, error } = await revenueTrackingService.getRevenueByCategory();
          
          if (error) {
            console.error('Failed to fetch revenue by category:', error);
            return;
          }

          if (response) {
            set({ revenueByCategory: response });
          }
        } catch (error) {
          console.error('Failed to fetch revenue by category:', error);
        }
      },

      fetchTopUsers: async () => {
        try {
          const { response, error } = await revenueTrackingService.getTopUsers();
          
          if (error) {
            console.error('Failed to fetch top users:', error);
            return;
          }

          if (response) {
            set({ topUsers: response });
          }
        } catch (error) {
          console.error('Failed to fetch top users:', error);
        }
      },

      fetchPaymentMethodStats: async () => {
        try {
          const { response, error } = await revenueTrackingService.getPaymentMethodStats();
          
          if (error) {
            console.error('Failed to fetch payment method stats:', error);
            return;
          }

          if (response) {
            set({ paymentMethodStats: response });
          }
        } catch (error) {
          console.error('Failed to fetch payment method stats:', error);
        }
      },

      fetchSubscriptionMetrics: async () => {
        try {
          const { response, error } = await revenueTrackingService.getSubscriptionMetrics();
          
          if (error) {
            console.error('Failed to fetch subscription metrics:', error);
            return;
          }

          if (response) {
            set({ subscriptionMetrics: response });
          }
        } catch (error) {
          console.error('Failed to fetch subscription metrics:', error);
        }
      },

      fetchAllData: async () => {
        const actions = get();
        
        // Fetch all data in parallel
        await Promise.all([
          actions.fetchTransactions(),
          actions.fetchMetrics(),
          actions.fetchRevenueByPeriod(),
          actions.fetchRevenueByCategory(),
          actions.fetchTopUsers(),
          actions.fetchPaymentMethodStats(),
          actions.fetchSubscriptionMetrics(),
        ]);
      },

      selectTransaction: (transaction) => {
        set({ selectedTransaction: transaction });
      },

      clearError: () => {
        set({ error: null });
      },

      setPageSize: (size) => {
        set((state) => ({
          pagination: { ...state.pagination, pageSize: size, currentPage: 1 },
        }));
        get().fetchTransactions(1);
      },

      goToPage: (page) => {
        get().fetchTransactions(page);
      },

      resetFilters: () => {
        set({ filters: initialFilters });
        get().fetchTransactions(1);
      },
    }),
    {
      name: 'revenue-tracking-store',
    }
  )
);