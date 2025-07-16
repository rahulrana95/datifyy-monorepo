/**
 * Curate Dates Store
 * State management for date curation using Zustand
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import curateDatesService from '../services/curateDatesService';
import { 
  CurateDatesState,
  User,
  SuggestedMatch,
  Genie,
  OfflineLocation,
  TableFilters,
  SuggestedMatchFilters,
  TimeSlot,
  CuratedDate
} from '../types';

interface CurateDatesStore extends CurateDatesState {
  // Actions
  setFilters: (filters: Partial<TableFilters>) => void;
  setSuggestedMatchFilters: (filters: Partial<SuggestedMatchFilters>) => void;
  fetchUsers: (page?: number) => Promise<void>;
  selectUser: (user: User) => void;
  fetchSuggestedMatches: (userId: string) => Promise<void>;
  selectMatch: (match: SuggestedMatch) => void;
  selectSlot: (slot: TimeSlot, mode: 'online' | 'offline') => void;
  fetchGenies: () => Promise<void>;
  selectGenie: (genie: Genie | null) => void;
  fetchOfflineLocations: (city?: string) => Promise<void>;
  selectLocation: (location: OfflineLocation | null) => void;
  createCuratedDate: () => Promise<void>;
  resetSelection: () => void;
  clearError: () => void;
  setPageSize: (size: number) => void;
  goToPage: (page: number) => void;
}

const initialFilters: TableFilters = {
  search: '',
  gender: 'all',
  verificationStatus: 'all',
  hasAvailability: 'all'
};

const initialSuggestedMatchFilters: SuggestedMatchFilters = {
  hasCommonSlots: 'all',
  noPreviousDates: false
};

export const useCurateDatesStore = create<CurateDatesStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      users: [],
      selectedUser: null,
      suggestedMatches: [],
      selectedMatch: null,
      selectedSlots: {
        online: null,
        offline: null
      },
      genies: [],
      selectedGenie: null,
      offlineLocations: [],
      selectedLocation: null,
      curatedDate: null,
      isLoading: false,
      error: null,
      filters: initialFilters,
      suggestedMatchFilters: initialSuggestedMatchFilters,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        totalItems: 0
      },

      // Actions
      setFilters: (filters) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
          pagination: { ...state.pagination, currentPage: 1 } // Reset to first page
        }));
      },

      setSuggestedMatchFilters: (filters) => {
        set((state) => ({
          suggestedMatchFilters: { ...state.suggestedMatchFilters, ...filters }
        }));
      },

      fetchUsers: async (page) => {
        set({ isLoading: true, error: null });
        
        try {
          const currentPage = page || get().pagination.currentPage;
          const { response, error } = await curateDatesService.getUsers(
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
              users: response.users,
              pagination: {
                ...get().pagination,
                currentPage,
                totalItems: response.totalCount
              },
              isLoading: false 
            });
          }
        } catch (error) {
          set({ 
            error: 'Failed to load users', 
            isLoading: false 
          });
        }
      },

      selectUser: (user) => {
        set({ 
          selectedUser: user,
          selectedMatch: null,
          selectedSlots: { online: null, offline: null },
          curatedDate: null
        });
        // Fetch suggested matches when user is selected
        get().fetchSuggestedMatches(user.id);
      },

      fetchSuggestedMatches: async (userId) => {
        set({ isLoading: true, error: null });
        
        try {
          const { response, error } = await curateDatesService.getSuggestedMatches(
            userId,
            get().suggestedMatchFilters
          );
          
          if (error) {
            set({ error: error.message, isLoading: false });
            return;
          }

          set({ 
            suggestedMatches: response || [],
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: 'Failed to load suggested matches', 
            isLoading: false 
          });
        }
      },

      selectMatch: (match) => {
        set({ 
          selectedMatch: match,
          selectedSlots: { online: null, offline: null }
        });
      },

      selectSlot: (slot, mode) => {
        set((state) => ({
          selectedSlots: {
            ...state.selectedSlots,
            [mode]: slot
          }
        }));
      },

      fetchGenies: async () => {
        try {
          const { response, error } = await curateDatesService.getGenies();
          
          if (error) {
            console.error('Failed to fetch genies:', error.message);
            return;
          }

          set({ genies: response || [] });
        } catch (error) {
          console.error('Failed to fetch genies');
        }
      },

      selectGenie: (genie) => {
        set({ selectedGenie: genie });
      },

      fetchOfflineLocations: async (city) => {
        try {
          const { response, error } = await curateDatesService.getOfflineLocations(city);
          
          if (error) {
            console.error('Failed to fetch locations:', error.message);
            return;
          }

          set({ offlineLocations: response || [] });
        } catch (error) {
          console.error('Failed to fetch locations');
        }
      },

      selectLocation: (location) => {
        set({ selectedLocation: location });
      },

      createCuratedDate: async () => {
        const state = get();
        
        if (!state.selectedUser || !state.selectedMatch) {
          set({ error: 'Please select both users for the date' });
          return;
        }

        const selectedSlot = state.selectedSlots.online || state.selectedSlots.offline;
        if (!selectedSlot) {
          set({ error: 'Please select a time slot' });
          return;
        }

        if (selectedSlot.mode === 'offline' && !state.selectedLocation) {
          set({ error: 'Please select a location for offline date' });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const dateData: CuratedDate = {
            user1: state.selectedUser,
            user2: state.selectedMatch.user,
            selectedSlot,
            mode: selectedSlot.mode,
            location: selectedSlot.mode === 'offline' ? state.selectedLocation! : undefined,
            genieId: state.selectedGenie?.id,
            status: 'pending',
            notes: ''
          };

          const { response, error } = await curateDatesService.createCuratedDate(dateData);
          
          if (error) {
            set({ error: error.message, isLoading: false });
            return;
          }

          if (response?.success) {
            set({ 
              curatedDate: { ...dateData, id: response.dateId },
              isLoading: false 
            });
          }
        } catch (error) {
          set({ 
            error: 'Failed to create curated date', 
            isLoading: false 
          });
        }
      },

      resetSelection: () => {
        set({
          selectedUser: null,
          selectedMatch: null,
          selectedSlots: { online: null, offline: null },
          selectedGenie: null,
          selectedLocation: null,
          curatedDate: null,
          suggestedMatches: []
        });
      },

      clearError: () => {
        set({ error: null });
      },

      setPageSize: (size) => {
        set((state) => ({
          pagination: {
            ...state.pagination,
            pageSize: size,
            currentPage: 1
          }
        }));
      },

      goToPage: (page) => {
        get().fetchUsers(page);
      }
    }),
    {
      name: 'curate-dates-store'
    }
  )
);