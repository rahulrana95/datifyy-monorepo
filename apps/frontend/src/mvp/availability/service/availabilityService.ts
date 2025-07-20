// apps/frontend/src/mvp/availability/service/availabilityService.ts
/**
 * Availability API Service
 *
 * Handles all API interactions for the availability management system.
 * Follows the same patterns as your existing services.
 */

import apiService from "../../../service/apiService";
import { ServiceResponse } from "../../../service/ErrorTypes";
import {
  AvailabilitySlot,
  CreateAvailabilityRequest,
  BulkCreateAvailabilityRequest,
  UpdateAvailabilityRequest,
  GetAvailabilityParams,
  AvailabilityBooking,
  AvailabilityMetrics,
} from "../types";

class AvailabilityService {
  private baseUrl = "availability";

  /**
   * Create a single availability slot
   */
  async createAvailability(
    data: CreateAvailabilityRequest
  ): Promise<ServiceResponse<AvailabilitySlot>> {
    try {
      const { response } = await apiService.post<AvailabilitySlot>(
        this.baseUrl,
        data
      );
      return { response };
    } catch (error) {
      return { error: apiService.handleError(error) };
    }
  }

  /**
   * Create multiple availability slots in bulk
   */
  async createBulkAvailability(data: BulkCreateAvailabilityRequest): Promise<
    ServiceResponse<{
      created: AvailabilitySlot[];
      skipped: Array<{ slot: CreateAvailabilityRequest; reason: string }>;
      summary: {
        totalRequested: number;
        successfullyCreated: number;
        skipped: number;
      };
    }>
  > {
    try {
      const { response } = await apiService.post<{
        created: AvailabilitySlot[];
        skipped: Array<{ slot: CreateAvailabilityRequest; reason: string }>;
        summary: {
          totalRequested: number;
          successfullyCreated: number;
          skipped: number;
        };
      }>(`${this.baseUrl}/bulk`, data);
      return { response };
    } catch (error) {
      return { error: apiService.handleError(error) };
    }
  }

 // Quick fix for availabilityService.ts - getUserAvailability method
// Add this to your existing service file around line 60-80

/**
 * Get user's availability slots with filtering - ENHANCED VERSION
 */
async getUserAvailability(params?: GetAvailabilityParams): Promise<
  ServiceResponse<{
    data: AvailabilitySlot[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrevious: boolean;
    };
    summary: {
      totalSlots: number;
      bookedSlots: number;
      availableSlots: number;
      upcomingSlots: number;
    };
  }>
> {
  try {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => queryParams.append(key, v.toString()));
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });
    }

    // FORCE includeBookings to true if not explicitly set
    if (!queryParams.has('includeBookings')) {
      queryParams.append('includeBookings', 'true');
    }

    const url = queryParams.toString()
      ? `${this.baseUrl}?${queryParams}`
      : `${this.baseUrl}?includeBookings=true`; // Fallback

    console.log('API Request URL:', url); // Debug log
    
    const { response } = await apiService.get<{
      data: AvailabilitySlot[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrevious: boolean;
      };
      summary: {
        totalSlots: number;
        bookedSlots: number;
        availableSlots: number;
        upcomingSlots: number;
      };
    }>(url);

    console.log('API Response:', response); // Debug log
    
    return { response };
  } catch (error) {
    console.error('Service error:', error); // Debug log
    return { error: apiService.handleError(error) };
  }
}

  /**
   * Get a specific availability slot by ID
   */
  async getAvailabilityById(
    id: number
  ): Promise<ServiceResponse<AvailabilitySlot>> {
    try {
      const { response } = await apiService.get<AvailabilitySlot>(
        `${this.baseUrl}/${id}`
      );
      return { response };
    } catch (error) {
      return { error: apiService.handleError(error) };
    }
  }

  /**
   * Update an existing availability slot
   */
  async updateAvailability(
    id: number,
    data: UpdateAvailabilityRequest
  ): Promise<ServiceResponse<AvailabilitySlot>> {
    try {
      const { response } = await apiService.put<AvailabilitySlot>(
        `${this.baseUrl}/${id}`,
        data
      );
      return { response };
    } catch (error) {
      return { error: apiService.handleError(error) };
    }
  }

  /**
   * Cancel an availability slot
   */
  async cancelAvailability(
    id: number,
    reason?: string
  ): Promise<ServiceResponse<{ cancelled: boolean }>> {
    try {
      const { response } = await apiService.post<{ cancelled: boolean }>(
        `${this.baseUrl}/${id}/cancel`,
        { reason }
      );
      return { response };
    } catch (error) {
      return { error: apiService.handleError(error) };
    }
  }

  /**
   * Delete an availability slot
   */
  async deleteAvailability(
    id: number
  ): Promise<ServiceResponse<{ deletedId: number }>> {
    try {
      const { response } = await apiService.delete<{ deletedId: number }>(
        `${this.baseUrl}/slot/${id}`
      );
      return { response };
    } catch (error) {
      return { error: apiService.handleError(error) };
    }
  }

  /**
   * Search for available users
   */
  async searchAvailableUsers(params: {
    availabilityDate: string;
    startTime?: string;
    endTime?: string;
    dateType?: string;
    page?: number;
    limit?: number;
  }): Promise<
    ServiceResponse<{
      users: Array<{
        availability: AvailabilitySlot;
        user: {
          id: number;
          firstName: string;
          lastName: string;
          profileImage?: string;
          age: number;
          location: string;
          bio?: string;
        };
        compatibilityScore?: number;
        distance?: number;
      }>;
      pagination: any;
    }>
  > {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });

      const { response } = await apiService.get<{
        users: Array<{
          availability: AvailabilitySlot;
          user: {
            id: number;
            firstName: string;
            lastName: string;
            profileImage?: string;
            age: number;
            location: string;
            bio?: string;
          };
          compatibilityScore?: number;
          distance?: number;
        }>;
        pagination: any;
      }>(`${this.baseUrl}/search/users?${queryParams}`);
      return { response };
    } catch (error) {
      return { error: apiService.handleError(error) };
    }
  }

  /**
   * Get availability analytics
   */
  async getAvailabilityAnalytics(params?: {
    startDate?: string;
    endDate?: string;
    groupBy?: "day" | "week" | "month";
  }): Promise<
    ServiceResponse<
      AvailabilityMetrics & {
        trends: Array<{
          date: string;
          slotsCreated: number;
          slotsBooked: number;
          meetingsCompleted: number;
        }>;
        popularTimeSlots: Array<{
          timeSlot: string;
          bookingCount: number;
          successRate: number;
        }>;
      }
    >
  > {
    try {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value);
          }
        });
      }

      const url = queryParams.toString()
        ? `${this.baseUrl}/analytics?${queryParams}`
        : `${this.baseUrl}/analytics`;
      const { response } = await apiService.get<
        AvailabilityMetrics & {
          trends: Array<{
            date: string;
            slotsCreated: number;
            slotsBooked: number;
            meetingsCompleted: number;
          }>;
          popularTimeSlots: Array<{
            timeSlot: string;
            bookingCount: number;
            successRate: number;
          }>;
        }
      >(url);
      return { response };
    } catch (error) {
      return { error: apiService.handleError(error) };
    }
  }

  /**
   * Get calendar view for a specific month
   */
  async getCalendarView(month: string): Promise<
    ServiceResponse<{
      month: string;
      days: Array<{
        date: string;
        dayOfWeek: string;
        availableSlots: number;
        bookedSlots: number;
        totalHours: number;
        slots: AvailabilitySlot[];
      }>;
      summary: {
        totalDaysWithSlots: number;
        totalSlots: number;
        bookingRate: number;
      };
    }>
  > {
    try {
      const { response } = await apiService.get<{
        month: string;
        days: Array<{
          date: string;
          dayOfWeek: string;
          availableSlots: number;
          bookedSlots: number;
          totalHours: number;
          slots: AvailabilitySlot[];
        }>;
        summary: {
          totalDaysWithSlots: number;
          totalSlots: number;
          bookingRate: number;
        };
      }>(`${this.baseUrl}/calendar/${month}`);
      return { response };
    } catch (error) {
      return { error: apiService.handleError(error) };
    }
  }

  /**
   * Get user's bookings (outgoing)
   */
  async getUserBookings(params?: {
    page?: number;
    limit?: number;
    status?: string[];
  }): Promise<
    ServiceResponse<{
      bookings: AvailabilityBooking[];
      pagination: any;
      summary: {
        totalBookings: number;
        upcomingBookings: number;
        completedBookings: number;
        cancelledBookings: number;
      };
    }>
  > {
    try {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            if (Array.isArray(value)) {
              value.forEach((v) => queryParams.append(key, v));
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });
      }

      const url = queryParams.toString()
        ? `${this.baseUrl}/bookings?${queryParams}`
        : `${this.baseUrl}/bookings`;
      const {response} = await apiService.get<any>(url);
      return { response };
    } catch (error) {
      return { error: apiService.handleError(error) };
    }
  }

  /**
   * Get incoming bookings (on user's availability)
   */
  async getIncomingBookings(params?: {
    page?: number;
    limit?: number;
    status?: string[];
  }): Promise<
    ServiceResponse<{
      bookings: AvailabilityBooking[];
      pagination: any;
    }>
  > {
    try {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            if (Array.isArray(value)) {
              value.forEach((v) => queryParams.append(key, v));
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });
      }

      const url = queryParams.toString()
        ? `${this.baseUrl}/incoming-bookings?${queryParams}`
        : `${this.baseUrl}/incoming-bookings`;
      const {response} = await apiService.get<any>(url);
      return { response };
    } catch (error) {
      return { error: apiService.handleError(error) };
    }
  }

  /**
   * Book an availability slot
   */
  async bookAvailability(data: {
    availabilityId: number;
    selectedActivity: string;
    bookingNotes?: string;
  }): Promise<ServiceResponse<AvailabilityBooking>> {
    try {
      const {response} = await apiService.post<AvailabilityBooking>(
        `${this.baseUrl}/book`,
        data
      );
      return { response };
    } catch (error) {
      return { error: apiService.handleError(error) };
    }
  }

  /**
   * Cancel a booking
   */
  async cancelBooking(
    bookingId: number,
    reason?: string
  ): Promise<ServiceResponse<{ cancelled: boolean }>> {
    try {
      const {response} = await apiService.post<any>(
        `${this.baseUrl}/bookings/${bookingId}/cancel`,
        { reason }
      );
      return { response };
    } catch (error) {
      return { error: apiService.handleError(error) };
    }
  }

  /**
   * Check for availability conflicts
   */
  async checkConflicts(data: {
    availabilityDate: string;
    timeSlots: Array<{ startTime: string; endTime: string }>;
  }): Promise<
    ServiceResponse<{
      conflicts: Array<{
        conflictingSlotId: number;
        conflictType: "overlap" | "too_close" | "duplicate";
        conflictDescription: string;
      }>;
      hasConflicts: boolean;
    }>
  > {
    try {
      const { response } = await apiService.post<{
        conflicts: Array<{
          conflictingSlotId: number;
          conflictType: "overlap" | "too_close" | "duplicate";
          conflictDescription: string;
        }>;
        hasConflicts: boolean;
      }>(`${this.baseUrl}/check-conflicts`, data);

      return { response };
    } catch (error) {
      return { error: apiService.handleError(error) };
    }
  }
}

// Export singleton instance
const availabilityService = new AvailabilityService();
export default availabilityService;
