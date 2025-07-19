/**
 * Curated Dates Management Store
 * State management for curated dates management using Zustand
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import curatedDatesManagementService from '../services/curatedDatesManagementService';
import { 
  CuratedDatesManagementState,
  CuratedDateDetails,
  DateFilters,
} from '../types';

interface CuratedDatesManagementStore extends CuratedDatesManagementState {
  // Actions
  setFilters: (filters: Partial<DateFilters>) => void;
  fetchDates: (page?: number) => Promise<void>;
  fetchStats: () => Promise<void>;
  selectDate: (date: CuratedDateDetails | null) => void;
  updateDateStatus: (dateId: string, status: CuratedDateDetails['status'], reason?: string) => Promise<void>;
  addNote: (dateId: string, note: string) => Promise<void>;
  clearError: () => void;
  setPageSize: (size: number) => void;
  goToPage: (page: number) => void;
  resetFilters: () => void;
}

const initialFilters: DateFilters = {
  search: '',
  status: 'all',
  dateType: 'all',
  hasIssues: false,
};

export const useCuratedDatesManagementStore = create<CuratedDatesManagementStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      dates: [],
      selectedDate: null,
      stats: null,
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
        get().fetchDates();
      },

      fetchDates: async (page) => {
        set({ isLoading: true, error: null });
        
        try {
          const currentPage = page || get().pagination.currentPage;
          const { response, error } = await curatedDatesManagementService.getDates(
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
              dates: response.dates,
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
            error: 'Failed to load dates', 
            isLoading: false,
          });
        }
      },

      fetchStats: async () => {
        try {
          const { response, error } = await curatedDatesManagementService.getDateStats();
          
          if (error) {
            console.error('Failed to fetch stats:', error);
            return;
          }

          if (response) {
            set({ stats: response });
          }
        } catch (error) {
          console.error('Failed to fetch stats:', error);
        }
      },

      selectDate: (date) => {
        set({ selectedDate: date });
      },

      updateDateStatus: async (dateId, status, reason) => {
        set({ isLoading: true, error: null });
        
        try {
          const { response, error } = await curatedDatesManagementService.updateDateStatus(
            dateId,
            status,
            reason
          );
          
          if (error) {
            set({ error: error.message, isLoading: false });
            return;
          }

          if (response && response.success) {
            // Update local state
            set((state) => ({
              dates: state.dates.map(date =>
                date.id === dateId
                  ? { 
                      ...date, 
                      status, 
                      cancellationReason: status === 'cancelled' ? reason : undefined,
                      lastUpdatedAt: new Date().toISOString(),
                    }
                  : date
              ),
              selectedDate: state.selectedDate?.id === dateId
                ? { 
                    ...state.selectedDate, 
                    status,
                    cancellationReason: status === 'cancelled' ? reason : undefined,
                    lastUpdatedAt: new Date().toISOString(),
                  }
                : state.selectedDate,
              isLoading: false,
            }));
            
            // Refresh stats
            get().fetchStats();
          }
        } catch (error) {
          set({ 
            error: 'Failed to update date status', 
            isLoading: false,
          });
        }
      },

      addNote: async (dateId, note) => {
        set({ isLoading: true, error: null });
        
        try {
          const { response, error } = await curatedDatesManagementService.addNote(dateId, note);
          
          if (error) {
            set({ error: error.message, isLoading: false });
            return;
          }

          if (response && response.success) {
            // Update local state
            set((state) => ({
              dates: state.dates.map(date =>
                date.id === dateId
                  ? { ...date, notes: note, lastUpdatedAt: new Date().toISOString() }
                  : date
              ),
              selectedDate: state.selectedDate?.id === dateId
                ? { ...state.selectedDate, notes: note, lastUpdatedAt: new Date().toISOString() }
                : state.selectedDate,
              isLoading: false,
            }));
          }
        } catch (error) {
          set({ 
            error: 'Failed to add note', 
            isLoading: false,
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setPageSize: (size) => {
        set((state) => ({
          pagination: { ...state.pagination, pageSize: size, currentPage: 1 },
        }));
        get().fetchDates(1);
      },

      goToPage: (page) => {
        get().fetchDates(page);
      },

      resetFilters: () => {
        set({ filters: initialFilters });
        get().fetchDates(1);
      },
    }),
    {
      name: 'curated-dates-management-store',
    }
  )
);