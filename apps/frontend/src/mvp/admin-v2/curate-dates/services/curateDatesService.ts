/**
 * Curate Dates Service
 * Handles all API calls for date curation
 */

import { BaseService, ServiceResponse } from '../../../../services/baseService';
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

const ADMIN_API_PREFIX = 'admin/date-curation';

class CurateDatesService extends BaseService {
  /**
   * Get users list with filters and pagination
   */
  async getUsers(filters?: TableFilters, page: number = 1, pageSize: number = 10): Promise<ServiceResponse<{
    users: User[];
    totalCount: number;
  }>> {
    return this.getData<{ users: User[]; totalCount: number }>(
      async () => {
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
          },
          error: null
        };
      },
      `${ADMIN_API_PREFIX}/users`,
      { filters, page, pageSize }
    );
  }

  /**
   * Get suggested matches for a user
   */
  async getSuggestedMatches(
    userId: string, 
    filters?: SuggestedMatchFilters
  ): Promise<ServiceResponse<SuggestedMatch[]>> {
    return this.postData<SuggestedMatch[]>(
      async () => {
        await simulateApiDelay();
        
        const user = mockUsers.find(u => u.id === userId);
        if (!user) {
          return { 
            response: null,
            error: { message: 'User not found' }
          };
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
        
        return { 
          response: matches,
          error: null
        };
      },
      `${ADMIN_API_PREFIX}/search-potential-matches`,
      { userId, filters }
    );
  }

  /**
   * Get available genies
   */
  async getGenies(): Promise<ServiceResponse<Genie[]>> {
    return this.getData<Genie[]>(
      async () => {
        await simulateApiDelay(500);
        return { 
          response: mockGenies,
          error: null
        };
      },
      `${ADMIN_API_PREFIX}/genies`
    );
  }

  /**
   * Get offline locations
   */
  async getOfflineLocations(city?: string): Promise<ServiceResponse<OfflineLocation[]>> {
    return this.getData<OfflineLocation[]>(
      async () => {
        await simulateApiDelay(600);
        
        let locations = mockOfflineLocations;
        if (city) {
          locations = locations.filter(loc => 
            loc.city.toLowerCase().includes(city.toLowerCase())
          );
        }
        
        return { 
          response: locations,
          error: null
        };
      },
      `${ADMIN_API_PREFIX}/offline-locations`,
      { city }
    );
  }

  /**
   * Create a curated date
   */
  async createCuratedDate(dateData: CuratedDate): Promise<ServiceResponse<{ success: boolean; dateId: string }>> {
    return this.postData<{ success: boolean; dateId: string }>(
      async () => {
        await simulateApiDelay(1000);
        
        // Validate love tokens
        if (dateData.user1.loveTokens < 10 || dateData.user2.loveTokens < 10) {
          return { 
            response: null,
            error: { message: 'Insufficient love tokens for one or both users' }
          };
        }
        
        return { 
          response: { 
            success: true, 
            dateId: `date-${Date.now()}` 
          },
          error: null
        };
      },
      `${ADMIN_API_PREFIX}/curated-dates`,
      dateData
    );
  }

  /**
   * Send email to users
   */
  async sendEmail(
    userIds: string[], 
    template: 'forgot-password' | 'event-reminder' | 'feedback-request'
  ): Promise<ServiceResponse<{ success: boolean }>> {
    return this.postData<{ success: boolean }>(
      async () => {
        await simulateApiDelay(800);
        
        return { 
          response: { 
            success: true 
          },
          error: null
        };
      },
      'admin/notifications/email/bulk-send',
      { userIds, template }
    );
  }
}

export default new CurateDatesService();