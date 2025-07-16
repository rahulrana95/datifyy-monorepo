/**
 * Curate Dates Service
 * Handles all API calls for date curation
 */

import apiService from '../../../../service/apiService';
import { 
  User, 
  SuggestedMatch, 
  Genie, 
  OfflineLocation, 
  TableFilters,
  SuggestedMatchFilters,
  CuratedDate
} from '../types';
import { 
  mockUsers, 
  generateSuggestedMatches,
  mockGenies,
  mockOfflineLocations,
  simulateApiDelay 
} from './mockCurateDatesData';

const ADMIN_API_PREFIX = 'admin/curate-dates';

class CurateDatesService {
  /**
   * Get users list with filters and pagination
   */
  async getUsers(filters?: TableFilters, page: number = 1, pageSize: number = 10): Promise<{
    response?: {
      users: User[];
      totalCount: number;
    };
    error?: { code: number; message: string };
  }> {
    try {
      // TODO: Replace with actual API call
      await simulateApiDelay();
      
      let filteredUsers = [...mockUsers];
      
      // Apply filters
      if (filters) {
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredUsers = filteredUsers.filter(user => 
            user.firstName.toLowerCase().includes(searchLower) ||
            user.lastName.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower) ||
            user.city.toLowerCase().includes(searchLower)
          );
        }
        
        if (filters.gender && filters.gender !== 'all') {
          filteredUsers = filteredUsers.filter(user => user.gender === filters.gender);
        }
        
        if (filters.city) {
          filteredUsers = filteredUsers.filter(user => 
            user.city.toLowerCase().includes(filters.city!.toLowerCase())
          );
        }
        
        if (filters.verificationStatus && filters.verificationStatus !== 'all') {
          filteredUsers = filteredUsers.filter(user => 
            filters.verificationStatus === 'verified' ? user.isVerified : !user.isVerified
          );
        }
        
        if (filters.hasAvailability && filters.hasAvailability !== 'all') {
          filteredUsers = filteredUsers.filter(user => 
            filters.hasAvailability === 'yes' ? user.submittedAvailability : !user.submittedAvailability
          );
        }
        
        if (filters.ageRange) {
          filteredUsers = filteredUsers.filter(user => 
            user.age >= filters.ageRange!.min && user.age <= filters.ageRange!.max
          );
        }
        
        if (filters.minProfileScore) {
          filteredUsers = filteredUsers.filter(user => 
            user.profileScore >= filters.minProfileScore!
          );
        }
      }
      
      // Apply pagination
      const startIndex = (page - 1) * pageSize;
      const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize);
      
      return { 
        response: {
          users: paginatedUsers,
          totalCount: filteredUsers.length
        }
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      return { 
        error: { 
          code: 500, 
          message: 'Failed to fetch users' 
        } 
      };
    }
  }

  /**
   * Get suggested matches for a user
   */
  async getSuggestedMatches(
    userId: string, 
    filters?: SuggestedMatchFilters
  ): Promise<{
    response?: SuggestedMatch[];
    error?: { code: number; message: string };
  }> {
    try {
      // TODO: Replace with actual API call
      await simulateApiDelay();
      
      const user = mockUsers.find(u => u.id === userId);
      if (!user) {
        return { error: { code: 404, message: 'User not found' } };
      }
      
      let matches = generateSuggestedMatches(user);
      
      // Apply filters
      if (filters) {
        if (filters.minMatchScore) {
          matches = matches.filter(m => m.matchScore >= filters.minMatchScore!);
        }
        
        if (filters.hasCommonSlots && filters.hasCommonSlots !== 'all') {
          matches = matches.filter(m => {
            if (filters.hasCommonSlots === 'online') {
              return m.matchingSlotsCounts.online > 0;
            } else if (filters.hasCommonSlots === 'offline') {
              return m.matchingSlotsCounts.offline > 0;
            } else {
              return m.matchingSlotsCounts.online > 0 && m.matchingSlotsCounts.offline > 0;
            }
          });
        }
        
        if (filters.noPreviousDates) {
          matches = matches.filter(m => !m.previousDates || m.previousDates.length === 0);
        }
        
        if (filters.city) {
          matches = matches.filter(m => 
            m.user.city.toLowerCase().includes(filters.city!.toLowerCase())
          );
        }
        
        if (filters.ageRange) {
          matches = matches.filter(m => 
            m.user.age >= filters.ageRange!.min && m.user.age <= filters.ageRange!.max
          );
        }
      }
      
      return { response: matches };
    } catch (error) {
      console.error('Error fetching suggested matches:', error);
      return { 
        error: { 
          code: 500, 
          message: 'Failed to fetch suggested matches' 
        } 
      };
    }
  }

  /**
   * Get available genies
   */
  async getGenies(): Promise<{
    response?: Genie[];
    error?: { code: number; message: string };
  }> {
    try {
      // TODO: Replace with actual API call
      await simulateApiDelay(500);
      return { response: mockGenies };
    } catch (error) {
      console.error('Error fetching genies:', error);
      return { 
        error: { 
          code: 500, 
          message: 'Failed to fetch genies' 
        } 
      };
    }
  }

  /**
   * Get offline locations
   */
  async getOfflineLocations(city?: string): Promise<{
    response?: OfflineLocation[];
    error?: { code: number; message: string };
  }> {
    try {
      // TODO: Replace with actual API call
      await simulateApiDelay(600);
      
      let locations = mockOfflineLocations;
      if (city) {
        locations = locations.filter(loc => 
          loc.city.toLowerCase().includes(city.toLowerCase())
        );
      }
      
      return { response: locations };
    } catch (error) {
      console.error('Error fetching locations:', error);
      return { 
        error: { 
          code: 500, 
          message: 'Failed to fetch locations' 
        } 
      };
    }
  }

  /**
   * Create a curated date
   */
  async createCuratedDate(dateData: CuratedDate): Promise<{
    response?: { success: boolean; dateId: string };
    error?: { code: number; message: string };
  }> {
    try {
      // TODO: Replace with actual API call
      await simulateApiDelay(1000);
      
      // Validate love tokens
      if (dateData.user1.loveTokens < 10 || dateData.user2.loveTokens < 10) {
        return { 
          error: { 
            code: 400, 
            message: 'Insufficient love tokens for one or both users' 
          } 
        };
      }
      
      return { 
        response: { 
          success: true, 
          dateId: `date-${Date.now()}` 
        } 
      };
    } catch (error) {
      console.error('Error creating curated date:', error);
      return { 
        error: { 
          code: 500, 
          message: 'Failed to create curated date' 
        } 
      };
    }
  }

  /**
   * Send email to users
   */
  async sendEmail(
    userIds: string[], 
    template: 'forgot-password' | 'event-reminder' | 'feedback-request'
  ): Promise<{
    response?: { success: boolean };
    error?: { code: number; message: string };
  }> {
    try {
      // TODO: Replace with actual API call
      await simulateApiDelay(800);
      
      return { 
        response: { 
          success: true 
        } 
      };
    } catch (error) {
      console.error('Error sending email:', error);
      return { 
        error: { 
          code: 500, 
          message: 'Failed to send email' 
        } 
      };
    }
  }
}

export default new CurateDatesService();