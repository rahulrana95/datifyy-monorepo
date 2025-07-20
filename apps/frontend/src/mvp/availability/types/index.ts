// apps/frontend/src/mvp/availability/types/index.ts
/**
 * User Availability Types
 * 
 * Core types for the availability management feature.
 * Designed for dating app's availability scheduling system.
 */

// Core enums matching backend
export enum DateType {
  ONLINE = 'online',
  OFFLINE = 'offline'
}

export enum AvailabilityStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  DELETED = 'deleted'
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

export enum SelectedActivity {
  COFFEE = 'coffee',
  LUNCH = 'lunch',
  DINNER = 'dinner',
  DRINKS = 'drinks',
  MOVIE = 'movie',
  WALK = 'walk',
  ACTIVITY = 'activity',
  CASUAL = 'casual',
  FORMAL = 'formal'
}

// Frontend UI types
export interface TimeSlot {
  id?: string; // Temporary ID for frontend tracking
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  isSelected: boolean;
  isBooked?: boolean;
  bookingDetails?: AvailabilityBooking;
}

export interface DayAvailability {
  date: string; // YYYY-MM-DD format
  dayOfWeek: string;
  isToday: boolean;
  isPast: boolean;
  timeSlots: TimeSlot[];
  maxSlotsReached: boolean;
  hasExistingSlots: boolean;
}

export interface AvailabilitySlot {
  id?: number;
  userId: number;
  availabilityDate: string;
  startTime: string;
  endTime: string;
  timezone: string;
  dateType: DateType;
  status: AvailabilityStatus;
  title?: string;
  notes?: string;
  locationPreference?: string;
  isRecurring: boolean;
  bufferTimeMinutes: number;
  preparationTimeMinutes: number;
  createdAt?: string;
  updatedAt?: string;
  
  // Computed fields for UI
  isBooked: boolean;
  canEdit: boolean;
  canCancel: boolean;
  durationMinutes: number;
  formattedTime: string;
  formattedDate: string;
  booking?: AvailabilityBooking;
}

export interface AvailabilityBooking {
  id: number;
  availabilityId: number;
  bookedByUserId: number;
  bookingStatus: BookingStatus;
  selectedActivity: SelectedActivity;
  bookingNotes?: string;
  confirmedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
  
  // User info
  bookedByUser: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
  };
}

// Form and API types
export interface CreateAvailabilityRequest {
  availabilityDate: string;
  startTime: string;
  endTime: string;
  timezone?: string;
  dateType: DateType;
  title?: string;
  notes?: string;
  locationPreference?: string;
  bufferTimeMinutes?: number;
  preparationTimeMinutes?: number;
}

export interface BulkCreateAvailabilityRequest {
  slots: CreateAvailabilityRequest[];
  skipConflicts?: boolean;
}

export interface UpdateAvailabilityRequest {
  availabilityDate?: string;
  startTime?: string;
  endTime?: string;
  dateType?: DateType;
  title?: string;
  notes?: string;
  locationPreference?: string;
  status?: AvailabilityStatus;
}

export interface GetAvailabilityParams {
  startDate?: string;
  endDate?: string;
  status?: AvailabilityStatus[];
  dateType?: DateType[];
  includeBookings?: boolean;
  page?: number;
  limit?: number;
}

// UI State management
export interface AvailabilityState {
  // View state
  currentView: 'upcoming' | 'past' | 'create';
  selectedDate: string | null;
  
  // Calendar state
  calendarMonth: string;
  availableDays: DayAvailability[];
  
  // Form state
  isCreating: boolean;
  isEditing: boolean;
  editingSlotId: number | null;
  
  // Selection state
  selectedTimeSlots: Map<string, TimeSlot[]>;
  
  // Data
  upcomingSlots: AvailabilitySlot[];
  pastSlots: AvailabilitySlot[];
  
  // Loading states
  isLoading: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  
  // Error handling
  error: string | null;
  validationErrors: Record<string, string>;
}

// Form types
export interface AvailabilityFormData {
  dateType: DateType;
  locationPreference?: string;
  notes?: string;
  selectedSlots: Map<string, TimeSlot[]>;
}

export interface AvailabilityFormErrors {
  dateType?: string;
  locationPreference?: string;
  notes?: string;
  timeSlots?: string;
  general?: string;
}

// Constants
export const AVAILABILITY_CONSTANTS = {
  MAX_SLOTS_PER_DAY: 4,
  SLOT_DURATION_HOURS: 1,
  DAYS_IN_ADVANCE: 7,
  MIN_BUFFER_MINUTES: 15,
  DEFAULT_TIMEZONE: Intl.DateTimeFormat().resolvedOptions().timeZone,
  
  // Available time slots (9 AM to 9 PM)
  TIME_SLOTS: [
    { value: '09:00', label: '9:00 AM', endTime: '10:00' },
    { value: '10:00', label: '10:00 AM', endTime: '11:00' },
    { value: '11:00', label: '11:00 AM', endTime: '12:00' },
    { value: '12:00', label: '12:00 PM', endTime: '13:00' },
    { value: '13:00', label: '1:00 PM', endTime: '14:00' },
    { value: '14:00', label: '2:00 PM', endTime: '15:00' },
    { value: '15:00', label: '3:00 PM', endTime: '16:00' },
    { value: '16:00', label: '4:00 PM', endTime: '17:00' },
    { value: '17:00', label: '5:00 PM', endTime: '18:00' },
    { value: '18:00', label: '6:00 PM', endTime: '19:00' },
    { value: '19:00', label: '7:00 PM', endTime: '20:00' },
    { value: '20:00', label: '8:00 PM', endTime: '21:00' },
    { value: '21:00', label: '9:00 PM', endTime: '22:00' },
  ],
  
  // Activity options with emojis for better UX
  ACTIVITIES: [
    { value: SelectedActivity.COFFEE, label: 'Coffee ☕', icon: '☕' },
    { value: SelectedActivity.LUNCH, label: 'Lunch 🍽️', icon: '🍽️' },
    { value: SelectedActivity.DINNER, label: 'Dinner 🍷', icon: '🍷' },
    { value: SelectedActivity.DRINKS, label: 'Drinks 🍸', icon: '🍸' },
    { value: SelectedActivity.MOVIE, label: 'Movie 🎬', icon: '🎬' },
    { value: SelectedActivity.WALK, label: 'Walk 🚶', icon: '🚶' },
    { value: SelectedActivity.ACTIVITY, label: 'Activity 🎯', icon: '🎯' },
    { value: SelectedActivity.CASUAL, label: 'Casual 😊', icon: '😊' },
    { value: SelectedActivity.FORMAL, label: 'Formal 👔', icon: '👔' },
  ]
} as const;

// Helper types
export type AvailabilityTab = 'upcoming' | 'past' | 'create';
export type TimeSlotValue = typeof AVAILABILITY_CONSTANTS.TIME_SLOTS[number]['value'];
export type ActivityOption = typeof AVAILABILITY_CONSTANTS.ACTIVITIES[number];

// Utility types for better type safety
export interface AvailabilityMetrics {
  totalSlots: number;
  upcomingSlots: number;
  bookedSlots: number;
  completedSlots: number;
  cancellationRate: number;
  averageBookingsPerWeek: number;
}