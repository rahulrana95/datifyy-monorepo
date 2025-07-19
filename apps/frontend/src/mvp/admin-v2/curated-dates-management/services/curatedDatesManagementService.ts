/**
 * Curated Dates Management Service
 * Mock API service for managing curated dates
 */

import { BaseService, ServiceResponse } from '../../../../services/baseService';
import { CuratedDateDetails, DateStats, DateFilters } from '../types';

// Mock data generator
const generateMockDates = (count: number = 50): CuratedDateDetails[] => {
  const statuses: CuratedDateDetails['status'][] = ['scheduled', 'ongoing', 'completed', 'cancelled', 'no_show'];
  const cities = ['Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Pune', 'Hyderabad'];
  const genies = [
    { id: 'g1', name: 'Sarah Anderson', email: 'sarah@datifyy.com' },
    { id: 'g2', name: 'Mike Chen', email: 'mike@datifyy.com' },
    { id: 'g3', name: 'Priya Sharma', email: 'priya@datifyy.com' },
  ];
  
  const locations = [
    { name: 'The Coffee House', address: 'Indiranagar, 100 Feet Road', city: 'Bangalore' },
    { name: 'Cafe Social', address: 'Koramangala, 5th Block', city: 'Bangalore' },
    { name: 'The Blue Door', address: 'Bandra West', city: 'Mumbai' },
    { name: 'Tea Villa Cafe', address: 'Connaught Place', city: 'Delhi' },
  ];

  return Array.from({ length: count }, (_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const dateType = Math.random() > 0.5 ? 'online' : 'offline';
    const city = cities[Math.floor(Math.random() * cities.length)];
    const hasGenie = dateType === 'offline' && Math.random() > 0.3;
    const hasFeedback = status === 'completed' && Math.random() > 0.2;
    
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() - Math.floor(Math.random() * 30) + 10);
    
    return {
      id: `cd${i + 1}`,
      dateId: `DATE${String(i + 1).padStart(6, '0')}`,
      user1: {
        id: `u${i * 2 + 1}`,
        firstName: ['John', 'James', 'Robert', 'Michael'][i % 4],
        lastName: ['Smith', 'Johnson', 'Williams', 'Brown'][i % 4],
        email: `user${i * 2 + 1}@example.com`,
        profilePicture: `https://i.pravatar.cc/150?u=${i * 2 + 1}`,
        age: 25 + Math.floor(Math.random() * 10),
        city,
      },
      user2: {
        id: `u${i * 2 + 2}`,
        firstName: ['Emma', 'Olivia', 'Sophia', 'Isabella'][i % 4],
        lastName: ['Davis', 'Miller', 'Wilson', 'Moore'][i % 4],
        email: `user${i * 2 + 2}@example.com`,
        profilePicture: `https://i.pravatar.cc/150?u=${i * 2 + 2}`,
        age: 24 + Math.floor(Math.random() * 10),
        city,
      },
      dateType,
      scheduledAt: scheduledDate.toISOString(),
      status,
      location: dateType === 'offline' ? locations[i % locations.length] : undefined,
      genie: hasGenie ? genies[i % genies.length] : undefined,
      feedback: hasFeedback ? {
        user1: {
          rating: 3 + Math.floor(Math.random() * 3),
          interested: Math.random() > 0.5,
          comments: 'Had a great time!',
          submittedAt: new Date(scheduledDate.getTime() + 2 * 60 * 60 * 1000).toISOString(),
        },
        user2: {
          rating: 3 + Math.floor(Math.random() * 3),
          interested: Math.random() > 0.5,
          comments: 'Nice conversation!',
          submittedAt: new Date(scheduledDate.getTime() + 2 * 60 * 60 * 1000).toISOString(),
        },
      } : undefined,
      matchScore: 70 + Math.floor(Math.random() * 30),
      createdAt: new Date(scheduledDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: 'Admin User',
      lastUpdatedAt: scheduledDate.toISOString(),
      cancellationReason: status === 'cancelled' ? 'User requested cancellation' : undefined,
      notes: Math.random() > 0.7 ? 'Special arrangement requested' : undefined,
    };
  });
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const ADMIN_API_PREFIX = 'admin/date-curation';

class CuratedDatesManagementService extends BaseService {
  private mockDates: CuratedDateDetails[] = generateMockDates();

  async getDates(filters: DateFilters, page: number, pageSize: number): Promise<ServiceResponse<{
    dates: CuratedDateDetails[];
    totalCount: number;
  }>> {
    return this.getData<{ dates: CuratedDateDetails[]; totalCount: number }>(
      async () => {
        await delay(800);
      // Apply filters
      let filteredDates = [...this.mockDates];

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredDates = filteredDates.filter(date =>
          date.user1.firstName.toLowerCase().includes(searchLower) ||
          date.user1.lastName.toLowerCase().includes(searchLower) ||
          date.user2.firstName.toLowerCase().includes(searchLower) ||
          date.user2.lastName.toLowerCase().includes(searchLower) ||
          date.dateId.toLowerCase().includes(searchLower)
        );
      }

      // Status filter
      if (filters.status && filters.status !== 'all') {
        filteredDates = filteredDates.filter(date => date.status === filters.status);
      }

      // Date type filter
      if (filters.dateType && filters.dateType !== 'all') {
        filteredDates = filteredDates.filter(date => date.dateType === filters.dateType);
      }

      // City filter
      if (filters.city) {
        filteredDates = filteredDates.filter(date => date.user1.city === filters.city);
      }

      // Date range filter
      if (filters.dateRange) {
        const from = new Date(filters.dateRange.from);
        const to = new Date(filters.dateRange.to);
        filteredDates = filteredDates.filter(date => {
          const scheduled = new Date(date.scheduledAt);
          return scheduled >= from && scheduled <= to;
        });
      }

      // Has issues filter
      if (filters.hasIssues) {
        filteredDates = filteredDates.filter(date => 
          date.status === 'cancelled' || 
          date.status === 'no_show' ||
          (date.feedback && (date.feedback.user1.rating < 3 || date.feedback.user2.rating < 3))
        );
      }

      // Sort by scheduled date (most recent first)
      filteredDates.sort((a, b) => 
        new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
      );

      // Paginate
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
      `${ADMIN_API_PREFIX}/curated-dates`,
      { filters, page, pageSize }
    );
  }

  async getDateStats(): Promise<ServiceResponse<DateStats>> {
    return this.getData<DateStats>(
      async () => {
        await delay(500);
      const stats: DateStats = {
        total: this.mockDates.length,
        scheduled: this.mockDates.filter(d => d.status === 'scheduled').length,
        ongoing: this.mockDates.filter(d => d.status === 'ongoing').length,
        completed: this.mockDates.filter(d => d.status === 'completed').length,
        cancelled: this.mockDates.filter(d => d.status === 'cancelled').length,
        noShow: this.mockDates.filter(d => d.status === 'no_show').length,
        successRate: 0,
        averageRating: 0,
      };

      // Calculate success rate
      const completedDates = this.mockDates.filter(d => d.status === 'completed');
      const interestedCount = completedDates.filter(d => 
        d.feedback && (d.feedback.user1.interested || d.feedback.user2.interested)
      ).length;
      stats.successRate = completedDates.length > 0 
        ? Math.round((interestedCount / completedDates.length) * 100)
        : 0;

      // Calculate average rating
      const allRatings = completedDates
        .filter(d => d.feedback)
        .flatMap(d => [d.feedback!.user1.rating, d.feedback!.user2.rating]);
      stats.averageRating = allRatings.length > 0
        ? Math.round((allRatings.reduce((a, b) => a + b, 0) / allRatings.length) * 10) / 10
        : 0;

        return {
          response: stats,
          error: null,
        };
      },
      `${ADMIN_API_PREFIX}/analytics/overview`
    );
  }

  async updateDateStatus(dateId: string, status: CuratedDateDetails['status'], reason?: string): Promise<ServiceResponse<{ success: boolean }>> {
    return this.putData<{ success: boolean }>(
      async () => {
        await delay(500);
      const dateIndex = this.mockDates.findIndex(d => d.id === dateId);
      if (dateIndex !== -1) {
        this.mockDates[dateIndex] = {
          ...this.mockDates[dateIndex],
          status,
          cancellationReason: status === 'cancelled' ? reason : undefined,
          lastUpdatedAt: new Date().toISOString(),
        };
      }

        return {
          response: { success: true },
          error: null,
        };
      },
      `${ADMIN_API_PREFIX}/curated-dates/${dateId}`,
      { status, reason }
    );
  }

  async addNote(dateId: string, note: string): Promise<ServiceResponse<{ success: boolean }>> {
    return this.putData<{ success: boolean }>(
      async () => {
        await delay(500);
      const dateIndex = this.mockDates.findIndex(d => d.id === dateId);
      if (dateIndex !== -1) {
        this.mockDates[dateIndex] = {
          ...this.mockDates[dateIndex],
          notes: note,
          lastUpdatedAt: new Date().toISOString(),
        };
      }

        return {
          response: { success: true },
          error: null,
        };
      },
      `${ADMIN_API_PREFIX}/curated-dates/${dateId}/notes`,
      { note }
    );
  }
}

export default new CuratedDatesManagementService();