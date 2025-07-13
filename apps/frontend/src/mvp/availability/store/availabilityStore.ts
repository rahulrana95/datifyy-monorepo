// apps/frontend/src/mvp/availability/store/availabilityStore.ts
/**
 * Fixed Availability Zustand Store
 * 
 * Key fixes:
 * - Properly load booking data with slots
 * - Enhanced data fetching with relationships
 * - Better booking status handling
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import {
  AvailabilityState,
  AvailabilitySlot,
  DayAvailability,
  TimeSlot,
  DateType,
  AvailabilityStatus,
  CreateAvailabilityRequest,
  UpdateAvailabilityRequest,
  AvailabilityTab,
  AVAILABILITY_CONSTANTS,
  AvailabilityBooking
} from '../types';
import availabilityService from '../service/availabilityService';
import { WritableDraft } from 'immer/dist/internal';
import { enableMapSet } from 'immer';

enableMapSet();

interface AvailabilityStore extends AvailabilityState {
  // Actions
  setCurrentView: (view: AvailabilityTab) => void;
  setSelectedDate: (date: string | null) => void;
  setCalendarMonth: (month: string) => void;
  
  // Data actions
  loadAvailability: (params?: { startDate?: string; endDate?: string; forceRefresh?: boolean }) => Promise<void>;
  createAvailability: (requests: CreateAvailabilityRequest[]) => Promise<boolean>;
  updateAvailability: (id: number, data: UpdateAvailabilityRequest) => Promise<boolean>;
  deleteAvailability: (id: number) => Promise<boolean>;
  
  // Booking-specific actions
  refreshBookingData: () => Promise<void>;
  markSlotAsBooked: (slotId: number, booking: AvailabilityBooking) => void;
  markSlotAsAvailable: (slotId: number) => void;
  
  // UI actions
  toggleTimeSlot: (date: string, timeSlot: TimeSlot) => void;
  clearSelectedSlots: () => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Calendar actions
  generateAvailableDays: () => void;
  
  // Form actions
  startCreating: () => void;
  startEditing: (slotId: number) => void;
  cancelEditing: () => void;
  
  // Helper getters
  getUpcomingSlots: () => AvailabilitySlot[];
  getPastSlots: () => AvailabilitySlot[];
  getSelectedSlotsCount: () => number;
  canAddMoreSlots: (date: string) => boolean;
  getBookedSlots: () => AvailabilitySlot[];
  getAvailableSlots: () => AvailabilitySlot[];
}

// Helper functions
const generateNext7Days = (): DayAvailability[] => {
  const days: DayAvailability[] = [];
  const today = new Date();
  
  for (let i = 0; i < AVAILABILITY_CONSTANTS.DAYS_IN_ADVANCE; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + i);
    
    const dateString = currentDate.toISOString().split('T')[0];
    const dayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
    
    days.push({
      date: dateString,
      dayOfWeek,
      isToday: i === 0,
      isPast: false,
      timeSlots: AVAILABILITY_CONSTANTS.TIME_SLOTS.map(slot => ({
        id: `${dateString}-${slot.value}`,
        startTime: slot.value,
        endTime: slot.endTime,
        isSelected: false,
        isBooked: false
      })),
      maxSlotsReached: false,
      hasExistingSlots: false
    });
  }
  
  return days;
};

const isSlotInPast = (slot: AvailabilitySlot): boolean => {
  const now = new Date();
  const slotDateTime = new Date(`${slot.availabilityDate}T${slot.startTime}`);
  return slotDateTime < now;
};

// Enhanced slot processing to ensure booking data is properly handled
const processSlotData = (rawSlot: any): AvailabilitySlot => {
  console.log('Processing slot data:', rawSlot); // Debug log
  
  return {
    ...rawSlot,
    // Ensure booking data is properly mapped
    isBooked: !!(rawSlot.isBooked || rawSlot.booking),
    booking: rawSlot.booking ? {
      ...rawSlot.booking,
      // Ensure user data is properly structured
      bookedByUser: {
        id: rawSlot.booking.bookedByUser?.id || rawSlot.booking.bookedByUserId,
        firstName: rawSlot.booking.bookedByUser?.firstName || 'Unknown',
        lastName: rawSlot.booking.bookedByUser?.lastName || 'User',
        email: rawSlot.booking.bookedByUser?.email || '',
        profileImage: rawSlot.booking.bookedByUser?.profileImage
      }
    } : undefined
  };
};

export const useAvailabilityStore = create<AvailabilityStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        currentView: 'upcoming',
        selectedDate: null,
        calendarMonth: new Date().toISOString().substring(0, 7),
        availableDays: generateNext7Days(),
        isCreating: false,
        isEditing: false,
        editingSlotId: null,
        selectedTimeSlots: new Map(),
        upcomingSlots: [],
        pastSlots: [],
        isLoading: false,
        isSaving: false,
        isDeleting: false,
        error: null,
        validationErrors: {},

        // View actions
        setCurrentView: (view) => set((state) => {
          state.currentView = view;
          if (view === 'create') {
            state.isCreating = true;
          } else {
            state.isCreating = false;
            state.isEditing = false;
            state.editingSlotId = null;
          }
        }),

        setSelectedDate: (date) => set((state) => {
          state.selectedDate = date;
        }),

        setCalendarMonth: (month) => set((state) => {
          state.calendarMonth = month;
        }),

        // Enhanced data loading with proper booking relationships
        loadAvailability: async (params = {}) => {
          const { forceRefresh = false } = params;
          
          // Don't reload if we already have data unless forced
          if (!forceRefresh && get().upcomingSlots.length > 0) {
            console.log('Using cached availability data');
            return;
          }

          set((state) => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            console.log('Loading availability with bookings...');
            
            // Enhanced API call with explicit booking inclusion
            const result = await availabilityService.getUserAvailability({
              includeBookings: true,
              ...params
            });

            if (result.error) {
              console.error('Error loading availability:', result.error);
              set((state) => {
                state.error = result.error!.message;
                state.isLoading = false;
              });
              return;
            }

            const rawSlots = result.response?.data || [];
            console.log('Raw slots from API:', rawSlots);
            
            // Process slots to ensure booking data is properly handled
            const processedSlots = rawSlots.map(processSlotData);
            console.log('Processed slots:', processedSlots);
            
            set((state) => {
              const now = new Date();
              
              // Separate upcoming and past slots
              state.upcomingSlots = processedSlots.filter((slot: AvailabilitySlot) => !isSlotInPast(slot));
              state.pastSlots = processedSlots.filter((slot: AvailabilitySlot) => isSlotInPast(slot));
              
              console.log('Upcoming slots with bookings:', state.upcomingSlots);
              console.log('Booked upcoming slots:', state.upcomingSlots.filter(s => s.isBooked));
              
              state.isLoading = false;
              
              // Update available days with existing slots
              state.availableDays.forEach(day => {
                const daySlots = processedSlots.filter((slot: AvailabilitySlot) => slot.availabilityDate === day.date);
                day.hasExistingSlots = daySlots.length > 0;
                
                // Mark booked time slots
                daySlots.forEach((slot: AvailabilitySlot) => {
                  const timeSlot = day.timeSlots.find(ts => ts.startTime === slot.startTime);
                  if (timeSlot) {
                    timeSlot.isBooked = slot.isBooked;
                    timeSlot.bookingDetails = slot.booking;
                  }
                });
              });
            });
          } catch (error) {
            console.error('Exception loading availability:', error);
            set((state) => {
              state.error = 'Failed to load availability';
              state.isLoading = false;
            });
          }
        },

        // Enhanced refresh specifically for booking data
        refreshBookingData: async () => {
          console.log('Refreshing booking data...');
          await get().loadAvailability({ forceRefresh: true });
        },

        // Manual booking state updates (for real-time updates)
        markSlotAsBooked: (slotId, booking) => set((state) => {
          const updateSlot = (slot: AvailabilitySlot) => {
            if (slot.id === slotId) {
              slot.isBooked = true;
              slot.booking = booking;
            }
          };
          
          state.upcomingSlots.forEach(updateSlot);
          state.pastSlots.forEach(updateSlot);
        }),

        markSlotAsAvailable: (slotId) => set((state) => {
          const updateSlot = (slot: AvailabilitySlot) => {
            if (slot.id === slotId) {
              slot.isBooked = false;
              slot.booking = undefined;
            }
          };
          
          state.upcomingSlots.forEach(updateSlot);
          state.pastSlots.forEach(updateSlot);
        }),

        createAvailability: async (requests) => {
          set((state) => {
            state.isSaving = true;
            state.error = null;
          });

          try {
            const result = await availabilityService.createBulkAvailability({
              slots: requests,
              skipConflicts: true
            });

            if (result.error) {
              set((state) => {
                state.error = result.error!.message;
                state.isSaving = false;
              });
              return false;
            }

            // Force refresh to get latest data with any bookings
            await get().loadAvailability({ forceRefresh: true });
            
            set((state) => {
              state.isSaving = false;
              state.selectedTimeSlots.clear();
              state.isCreating = false;
              state.currentView = 'upcoming';
            });

            return true;
          } catch (error) {
            set((state) => {
              state.error = 'Failed to create availability';
              state.isSaving = false;
            });
            return false;
          }
        },

        updateAvailability: async (id, data) => {
          set((state) => {
            state.isSaving = true;
            state.error = null;
          });

          try {
            const result = await availabilityService.updateAvailability(id, data);

            if (result.error) {
              set((state) => {
                state.error = result.error!.message;
                state.isSaving = false;
              });
              return false;
            }

            // Process the updated slot
            const updatedSlot = processSlotData(result.response!);
            
            // Update local state
            set((state) => {
              // Update in upcoming or past slots
              const upcomingIndex = state.upcomingSlots.findIndex(s => s.id === id);
              if (upcomingIndex !== -1) {
                state.upcomingSlots[upcomingIndex] = updatedSlot;
              } else {
                const pastIndex = state.pastSlots.findIndex(s => s.id === id);
                if (pastIndex !== -1) {
                  state.pastSlots[pastIndex] = updatedSlot;
                }
              }
              
              state.isSaving = false;
              state.isEditing = false;
              state.editingSlotId = null;
            });

            return true;
          } catch (error) {
            set((state) => {
              state.error = 'Failed to update availability';
              state.isSaving = false;
            });
            return false;
          }
        },

        deleteAvailability: async (id) => {
          set((state) => {
            state.isDeleting = true;
            state.error = null;
          });

          try {
            const result = await availabilityService.deleteAvailability(id);

            if (result.error) {
              set((state) => {
                state.error = result.error!.message;
                state.isDeleting = false;
              });
              return false;
            }

            // Remove from local state
            set((state) => {
              state.upcomingSlots = state.upcomingSlots.filter(s => s.id !== id);
              state.pastSlots = state.pastSlots.filter(s => s.id !== id);
              state.isDeleting = false;
            });

            return true;
          } catch (error) {
            set((state) => {
              state.error = 'Failed to delete availability';
              state.isDeleting = false;
            });
            return false;
          }
        },

        // UI actions (unchanged)
        toggleTimeSlot: (date, timeSlot) => set((state) => {
          const daySlots = state.selectedTimeSlots.get(date) || [];
          const existingIndex = daySlots.findIndex(s => s.startTime === timeSlot.startTime);
          
          if (existingIndex !== -1) {
            daySlots.splice(existingIndex, 1);
          } else {
            if (daySlots.length < AVAILABILITY_CONSTANTS.MAX_SLOTS_PER_DAY) {
              daySlots.push({ ...timeSlot, isSelected: true });
            }
          }
          
          if (daySlots.length === 0) {
            state.selectedTimeSlots.delete(date);
          } else {
            state.selectedTimeSlots.set(date, daySlots);
          }
          
          const day = state.availableDays.find(d => d.date === date);
          if (day) {
            day.maxSlotsReached = daySlots.length >= AVAILABILITY_CONSTANTS.MAX_SLOTS_PER_DAY;
            day.timeSlots.forEach(slot => {
              slot.isSelected = daySlots.some(s => s.startTime === slot.startTime);
            });
          }
        }),

        clearSelectedSlots: () => set((state) => {
          state.selectedTimeSlots.clear();
          state.availableDays.forEach(day => {
            day.maxSlotsReached = false;
            day.timeSlots.forEach(slot => {
              slot.isSelected = false;
            });
          });
        }),

        setError: (error) => set((state) => {
          state.error = error;
        }),

        clearError: () => set((state) => {
          state.error = null;
          state.validationErrors = {};
        }),

        generateAvailableDays: () => set((state) => {
          state.availableDays = generateNext7Days();
        }),

        startCreating: () => set((state) => {
          state.isCreating = true;
          state.isEditing = false;
          state.editingSlotId = null;
          state.currentView = 'create';
          state.selectedTimeSlots.clear();
        }),

        startEditing: (slotId) => set((state) => {
          state.isEditing = true;
          state.isCreating = false;
          state.editingSlotId = slotId;
          state.currentView = 'upcoming';
        }),

        cancelEditing: () => set((state) => {
          state.isEditing = false;
          state.isCreating = false;
          state.editingSlotId = null;
          state.selectedTimeSlots.clear();
        }),

        // Enhanced helpers with booking awareness
        getUpcomingSlots: () => {
          return get().upcomingSlots;
        },

        getPastSlots: () => {
          return get().pastSlots;
        },

        getBookedSlots: () => {
          return get().upcomingSlots.filter(slot => slot.isBooked);
        },

        getAvailableSlots: () => {
          return get().upcomingSlots.filter(slot => !slot.isBooked);
        },

        getSelectedSlotsCount: () => {
          const selectedSlots = get().selectedTimeSlots;
          let count = 0;
          selectedSlots.forEach(slots => {
            count += slots.length;
          });
          return count;
        },

        canAddMoreSlots: (date) => {
          const selectedSlots = get().selectedTimeSlots.get(date) || [];
          return selectedSlots.length < AVAILABILITY_CONSTANTS.MAX_SLOTS_PER_DAY;
        },
      })),
      {
        name: 'availability-store',
        partialize: (state) => ({
          calendarMonth: state.calendarMonth,
          currentView: state.currentView
        })
      }
    ),
    { name: 'availability-store' }
  )
);