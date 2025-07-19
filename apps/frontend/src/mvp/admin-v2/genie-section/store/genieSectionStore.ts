/**
 * Genie Section Store
 * State management for genie date management
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import genieSectionService from '../services/genieSectionService';
import {
  GenieSectionState,
  GenieDate,
  DateFilters,
  DateLocation,
  ReminderTemplate,
  RescheduleRequest,
  SendReminderRequest,
} from '../types';

interface GenieSectionStore extends GenieSectionState {
  // Actions
  setFilters: (filters: Partial<DateFilters>) => void;
  fetchDates: (page?: number) => Promise<void>;
  selectDate: (date: GenieDate | null) => void;
  updateDateStatus: (dateId: string, status: GenieDate['status']) => Promise<void>;
  rescheduleDate: (request: RescheduleRequest) => Promise<void>;
  fetchLocations: (city?: string, searchQuery?: string) => Promise<void>;
  selectLocation: (location: DateLocation | null) => void;
  fetchReminderTemplates: () => Promise<void>;
  selectTemplate: (template: ReminderTemplate | null) => void;
  sendReminder: (request: SendReminderRequest) => Promise<void>;
  updateDateNotes: (dateId: string, notes: string) => Promise<void>;
  setPageSize: (size: number) => void;
  goToPage: (page: number) => void;
  clearError: () => void;
}

const initialFilters: DateFilters = {
  status: 'all',
  search: '',
  mode: 'all',
  verificationStatus: 'all',
};

export const useGenieSectionStore = create<GenieSectionStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      dates: [],
      selectedDate: null,
      isLoading: false,
      error: null,
      filters: initialFilters,
      pagination: {
        currentPage: 1,
        pageSize: 50, // Increased to show all dates
        totalItems: 0,
      },
      locations: [],
      reminderTemplates: [],
      selectedTemplate: null,

      // Actions
      setFilters: (filters) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
          pagination: { ...state.pagination, currentPage: 1 },
        }));
      },

      fetchDates: async (page) => {
        set({ isLoading: true, error: null });

        try {
          const currentPage = page || get().pagination.currentPage;
          const { response, error } = await genieSectionService.getGenieDates(
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

      selectDate: (date) => {
        set({ selectedDate: date });
      },

      updateDateStatus: async (dateId, status) => {
        set({ isLoading: true, error: null });

        try {
          const { response, error } = await genieSectionService.updateDateStatus(
            dateId,
            status
          );

          if (error) {
            set({ error: error.message, isLoading: false });
            return;
          }

          if (response?.success) {
            // Update the date in the list
            set((state) => ({
              dates: state.dates.map((date) =>
                date.id === dateId ? { ...date, status } : date
              ),
              selectedDate:
                state.selectedDate?.id === dateId
                  ? { ...state.selectedDate, status }
                  : state.selectedDate,
              isLoading: false,
            }));
          }
        } catch (error) {
          set({
            error: 'Failed to update date status',
            isLoading: false,
          });
        }
      },

      rescheduleDate: async (request) => {
        set({ isLoading: true, error: null });

        try {
          const { response, error } = await genieSectionService.rescheduleDate(request);

          if (error) {
            set({ error: error.message, isLoading: false });
            return;
          }

          if (response?.success) {
            // Refresh dates list
            await get().fetchDates();
          }
        } catch (error) {
          set({
            error: 'Failed to reschedule date',
            isLoading: false,
          });
        }
      },

      fetchLocations: async (city, searchQuery) => {
        try {
          const { response, error } = await genieSectionService.getLocations(
            city,
            searchQuery
          );

          if (error) {
            console.error('Failed to fetch locations:', error.message);
            return;
          }

          set({ locations: response || [] });
        } catch (error) {
          console.error('Failed to fetch locations');
        }
      },

      selectLocation: (location) => {
        // This would be used in the reschedule modal
        console.log('Selected location:', location);
      },

      fetchReminderTemplates: async () => {
        try {
          const { response, error } = await genieSectionService.getReminderTemplates();

          if (error) {
            console.error('Failed to fetch templates:', error.message);
            return;
          }

          set({ reminderTemplates: response || [] });
        } catch (error) {
          console.error('Failed to fetch reminder templates');
        }
      },

      selectTemplate: (template) => {
        set({ selectedTemplate: template });
      },

      sendReminder: async (request) => {
        set({ isLoading: true, error: null });

        try {
          const { response, error } = await genieSectionService.sendReminder(request);

          if (error) {
            set({ error: error.message, isLoading: false });
            return;
          }

          if (response?.success) {
            // Update reminder status in the date
            set((state) => ({
              dates: state.dates.map((date) =>
                date.id === request.dateId
                  ? {
                      ...date,
                      remindersSent: {
                        user1: request.recipients.includes('user1') || request.recipients.includes('both'),
                        user2: request.recipients.includes('user2') || request.recipients.includes('both'),
                        lastSentAt: new Date().toISOString(),
                      },
                    }
                  : date
              ),
              isLoading: false,
            }));
          }
        } catch (error) {
          set({
            error: 'Failed to send reminder',
            isLoading: false,
          });
        }
      },

      updateDateNotes: async (dateId, notes) => {
        set({ isLoading: true, error: null });

        try {
          const { response, error } = await genieSectionService.updateDateNotes(
            dateId,
            notes
          );

          if (error) {
            set({ error: error.message, isLoading: false });
            return;
          }

          if (response?.success) {
            // Update the date in the list
            set((state) => ({
              dates: state.dates.map((date) =>
                date.id === dateId ? { ...date, notes } : date
              ),
              selectedDate:
                state.selectedDate?.id === dateId
                  ? { ...state.selectedDate, notes }
                  : state.selectedDate,
              isLoading: false,
            }));
          }
        } catch (error) {
          set({
            error: 'Failed to update notes',
            isLoading: false,
          });
        }
      },

      setPageSize: (size) => {
        set((state) => ({
          pagination: {
            ...state.pagination,
            pageSize: size,
            currentPage: 1,
          },
        }));
      },

      goToPage: (page) => {
        get().fetchDates(page);
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'genie-section-store',
    }
  )
);