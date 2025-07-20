/**
 * Genie Section Service
 * Handles all API calls for genie date management
 */

import { BaseService, ServiceResponse } from '../../../../services/baseService';
import {
  GenieDate,
  DateLocation,
  ReminderTemplate,
  DateFilters,
  RescheduleRequest,
  SendReminderRequest,
} from '../types';
import {
  generateMockDates,
  mockLocations,
  mockReminderTemplates,
  simulateApiDelay,
} from './mockGenieSectionData';

const ADMIN_API_PREFIX = 'admin/genie';

// Mock genie ID (in real app, this would come from auth)
// TODO: Replace with actual genie ID from auth store when backend is integrated
const MOCK_GENIE_ID = 'genie-1';
const MOCK_GENIE_NAME = 'Riya Admin';

class GenieSectionService extends BaseService {
  private mockDates: GenieDate[] = generateMockDates(MOCK_GENIE_ID, MOCK_GENIE_NAME);

  /**
   * Get dates assigned to genie with filters
   */
  async getGenieDates(
    filters: DateFilters,
    page: number = 1,
    pageSize: number = 10
  ): Promise<ServiceResponse<{ dates: GenieDate[]; totalCount: number }>> {
    return this.getData<{ dates: GenieDate[]; totalCount: number }>(
      async () => {
        await simulateApiDelay();

        let filteredDates = [...this.mockDates];

        // Apply filters
        if (filters.status && filters.status !== 'all') {
          filteredDates = filteredDates.filter(date => date.status === filters.status);
        }

        if (filters.mode && filters.mode !== 'all') {
          filteredDates = filteredDates.filter(date => date.mode === filters.mode);
        }

        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredDates = filteredDates.filter(
            date =>
              date.user1.firstName.toLowerCase().includes(searchLower) ||
              date.user1.lastName.toLowerCase().includes(searchLower) ||
              date.user2.firstName.toLowerCase().includes(searchLower) ||
              date.user2.lastName.toLowerCase().includes(searchLower) ||
              date.user1.email.toLowerCase().includes(searchLower) ||
              date.user2.email.toLowerCase().includes(searchLower)
          );
        }

        if (filters.verificationStatus && filters.verificationStatus !== 'all') {
          filteredDates = filteredDates.filter(date => {
            const user1Verified = date.user1.verificationStatus.idVerified;
            const user2Verified = date.user2.verificationStatus.idVerified;

            switch (filters.verificationStatus) {
              case 'both-verified':
                return user1Verified && user2Verified;
              case 'one-verified':
                return user1Verified || user2Verified;
              case 'none-verified':
                return !user1Verified && !user2Verified;
              default:
                return true;
            }
          });
        }

        if (filters.dateRange) {
          const startDate = new Date(filters.dateRange.start);
          const endDate = new Date(filters.dateRange.end);
          filteredDates = filteredDates.filter(date => {
            const dateTime = new Date(date.scheduledDate);
            return dateTime >= startDate && dateTime <= endDate;
          });
        }

        // Sort by scheduled date (upcoming first)
        filteredDates.sort((a, b) => 
          new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
        );

        // Pagination
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedDates = filteredDates.slice(startIndex, endIndex);

        return {
          response: {
            dates: paginatedDates,
            totalCount: filteredDates.length,
          },
          error: null,
        };
      },
      `${ADMIN_API_PREFIX}/dates/${MOCK_GENIE_ID}`,
      { ...filters, page, pageSize }
    );
  }

  /**
   * Update date status
   */
  async updateDateStatus(
    dateId: string,
    status: GenieDate['status']
  ): Promise<ServiceResponse<{ success: boolean }>> {
    return this.putData<{ success: boolean }>(
      async () => {
        await simulateApiDelay(500);

        const dateIndex = this.mockDates.findIndex(d => d.id === dateId);
        if (dateIndex >= 0) {
          this.mockDates[dateIndex].status = status;
          this.mockDates[dateIndex].updatedAt = new Date().toISOString();
        }

        return {
          response: { success: true },
          error: null,
        };
      },
      `${ADMIN_API_PREFIX}/dates/${dateId}/status`,
      { status }
    );
  }

  /**
   * Reschedule date
   */
  async rescheduleDate(
    request: RescheduleRequest
  ): Promise<ServiceResponse<{ success: boolean }>> {
    return this.putData<{ success: boolean }>(
      async () => {
        await simulateApiDelay(1000);

        const dateIndex = this.mockDates.findIndex(d => d.id === request.dateId);
        if (dateIndex >= 0) {
          this.mockDates[dateIndex].scheduledDate = request.newDate;
          this.mockDates[dateIndex].timeSlot = request.newTimeSlot;
          if (request.newMode) {
            this.mockDates[dateIndex].mode = request.newMode;
          }
          if (request.newLocationId) {
            const location = mockLocations.find(l => l.id === request.newLocationId);
            if (location) {
              this.mockDates[dateIndex].location = location;
            }
          }
          this.mockDates[dateIndex].status = 'rescheduled';
          this.mockDates[dateIndex].updatedAt = new Date().toISOString();
        }

        return {
          response: { success: true },
          error: null,
        };
      },
      `${ADMIN_API_PREFIX}/dates/${request.dateId}/reschedule`,
      request
    );
  }

  /**
   * Get locations
   */
  async getLocations(
    city?: string,
    searchQuery?: string
  ): Promise<ServiceResponse<DateLocation[]>> {
    return this.getData<DateLocation[]>(
      async () => {
        await simulateApiDelay(500);

        let filteredLocations = [...mockLocations];

        if (city) {
          filteredLocations = filteredLocations.filter(
            loc => loc.city.toLowerCase() === city.toLowerCase()
          );
        }

        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredLocations = filteredLocations.filter(
            loc =>
              loc.name.toLowerCase().includes(query) ||
              loc.address.toLowerCase().includes(query)
          );
        }

        return {
          response: filteredLocations,
          error: null,
        };
      },
      `${ADMIN_API_PREFIX}/locations`
    );
  }

  /**
   * Get reminder templates
   */
  async getReminderTemplates(): Promise<ServiceResponse<ReminderTemplate[]>> {
    return this.getData<ReminderTemplate[]>(
      async () => {
        await simulateApiDelay(300);
        return {
          response: mockReminderTemplates,
          error: null,
        };
      },
      `${ADMIN_API_PREFIX}/reminder-templates`
    );
  }

  /**
   * Send reminder
   */
  async sendReminder(
    request: SendReminderRequest
  ): Promise<ServiceResponse<{ success: boolean }>> {
    return this.postData<{ success: boolean }>(
      async () => {
        await simulateApiDelay(1000);

        const dateIndex = this.mockDates.findIndex(d => d.id === request.dateId);
        if (dateIndex >= 0) {
          if (request.recipients.includes('user1') || request.recipients.includes('both')) {
            this.mockDates[dateIndex].remindersSent.user1 = true;
          }
          if (request.recipients.includes('user2') || request.recipients.includes('both')) {
            this.mockDates[dateIndex].remindersSent.user2 = true;
          }
          this.mockDates[dateIndex].remindersSent.lastSentAt = new Date().toISOString();
        }

        return {
          response: { success: true },
          error: null,
        };
      },
      `${ADMIN_API_PREFIX}/dates/${request.dateId}/send-reminder`,
      request
    );
  }

  /**
   * Update date notes
   */
  async updateDateNotes(
    dateId: string,
    notes: string
  ): Promise<ServiceResponse<{ success: boolean }>> {
    return this.putData<{ success: boolean }>(
      async () => {
        await simulateApiDelay(500);

        const dateIndex = this.mockDates.findIndex(d => d.id === dateId);
        if (dateIndex >= 0) {
          this.mockDates[dateIndex].notes = notes;
          this.mockDates[dateIndex].updatedAt = new Date().toISOString();
        }

        return {
          response: { success: true },
          error: null,
        };
      },
      `${ADMIN_API_PREFIX}/dates/${dateId}/notes`,
      { notes }
    );
  }
}

export default new GenieSectionService();