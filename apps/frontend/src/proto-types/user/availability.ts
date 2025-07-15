// Auto-generated from proto/user/availability.proto
// Generated at: 2025-07-15T14:41:46.190Z

import { ApiResponse, PaginationRequest, PaginationResponse, LocationInfo } from '../common';

export enum DateType {
  UNSPECIFIED = 'UNSPECIFIED',
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
}

export enum AvailabilityStatus {
  UNSPECIFIED = 'UNSPECIFIED',
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  DELETED = 'DELETED',
}

export enum RecurrenceType {
  UNSPECIFIED = 'UNSPECIFIED',
  NONE = 'NONE',
  WEEKLY = 'WEEKLY',
  CUSTOM = 'CUSTOM',
}

export enum CancellationPolicy {
  UNSPECIFIED = 'UNSPECIFIED',
  FLEXIBLE = 'FLEXIBLE',
  TWENTY_FOUR_HOURS = 'TWENTY_FOUR_HOURS',
  FORTY_EIGHT_HOURS = 'FORTY_EIGHT_HOURS',
  STRICT = 'STRICT',
}

export enum BookingStatus {
  UNSPECIFIED = 'UNSPECIFIED',
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  NO_SHOW = 'NO_SHOW',
}

export interface AvailabilitySlot {
  id: string;
  userId: string;
  dateType: DateType;
  startTime: string;
  endTime: string;
  maxBookings: number;
  currentBookings: number;
  location?: LocationInfo;
  notes?: string;
  status: AvailabilityStatus;
  recurrenceType?: RecurrenceType;
  recurrenceEndDate?: string;
  cancellationPolicy: CancellationPolicy;
  autoConfirm: boolean;
  bufferTime: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AvailabilityBooking {
  id: string;
  slotId: string;
  bookerUserId: string;
  hostUserId: string;
  bookingTime: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  notes?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  cancelledBy?: string;
  confirmedAt?: string;
  completedAt?: string;
  noShowReportedAt?: string;
  feedbackSubmitted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserAvailabilityPreferences {
  userId: string;
  defaultDateType: DateType;
  defaultCancellationPolicy: CancellationPolicy;
  defaultBufferTime: number;
  autoConfirmBookings: boolean;
  allowBackToBackBookings: boolean;
  maxAdvanceBookingDays: number;
  minAdvanceBookingHours: number;
  defaultLocation?: LocationInfo;
  timeZone: string;
  workingHours: {
    monday?: { start: string; end: string; };
    tuesday?: { start: string; end: string; };
    wednesday?: { start: string; end: string; };
    thursday?: { start: string; end: string; };
    friday?: { start: string; end: string; };
    saturday?: { start: string; end: string; };
    sunday?: { start: string; end: string; };
  };
  blackoutDates: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SelectedActivity {
  id: string;
  name: string;
  description: string;
  category: string;
  estimatedDuration: number;
  location: LocationInfo;
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Request interfaces
export interface CreateAvailabilityRequest {
  dateType: DateType;
  startTime: string;
  endTime: string;
  maxBookings: number;
  location?: LocationInfo;
  notes?: string;
  recurrenceType?: RecurrenceType;
  recurrenceEndDate?: string;
  cancellationPolicy: CancellationPolicy;
  autoConfirm?: boolean;
  bufferTime?: number;
  isVisible?: boolean;
}

export interface UpdateAvailabilityRequest {
  slotId: string;
  startTime?: string;
  endTime?: string;
  maxBookings?: number;
  location?: LocationInfo;
  notes?: string;
  cancellationPolicy?: CancellationPolicy;
  autoConfirm?: boolean;
  bufferTime?: number;
  isVisible?: boolean;
  status?: AvailabilityStatus;
}

export interface GetAvailabilityRequest {
  userId?: string;
  dateType?: DateType;
  startDate?: string;
  endDate?: string;
  status?: AvailabilityStatus;
  pagination?: PaginationRequest;
}

export interface SearchAvailableUsersRequest {
  dateType: DateType;
  startTime: string;
  endTime: string;
  location?: LocationInfo;
  radius?: number;
  maxUsers?: number;
  excludeUserIds?: string[];
}

export interface BookAvailabilityRequest {
  slotId: string;
  startTime: string;
  endTime: string;
  notes?: string;
}

export interface UpdateBookingRequest {
  bookingId: string;
  status?: BookingStatus;
  notes?: string;
  cancellationReason?: string;
}

// Response interfaces
export interface AvailabilityResponse extends ApiResponse<AvailabilitySlot> {}

export interface AvailabilityListResponse extends ApiResponse<{
  slots: AvailabilitySlot[];
  pagination: PaginationResponse;
}> {}

export interface BookingResponse extends ApiResponse<AvailabilityBooking> {}

export interface BookingListResponse extends ApiResponse<{
  bookings: AvailabilityBooking[];
  pagination: PaginationResponse;
}> {}

export interface AvailableUsersResponse extends ApiResponse<{
  users: Array<{
    userId: string;
    availableSlots: AvailabilitySlot[];
    distance?: number;
  }>;
}> {}

// Validation rules
export const AvailabilityValidationRules = {
  minSlotDuration: 30 * 60 * 1000, // 30 minutes in milliseconds
  maxSlotDuration: 8 * 60 * 60 * 1000, // 8 hours in milliseconds
  minAdvanceBooking: 1 * 60 * 60 * 1000, // 1 hour in milliseconds
  maxAdvanceBooking: 90 * 24 * 60 * 60 * 1000, // 90 days in milliseconds
  maxBookingsPerSlot: 50,
  maxBufferTime: 2 * 60 * 60 * 1000, // 2 hours in milliseconds
  dateScheduling: {
    minAdvanceHours: 1,
    maxAdvanceDays: 90,
    minDurationMinutes: 30,
    maxDurationMinutes: 480,
  },
  feedback: {
    minRating: 1,
    maxRating: 5,
    maxCommentLength: 2000,
    maxRedFlags: 10,
  },
};
