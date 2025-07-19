import { BaseService } from '../../../../service/BaseService';
import { ServiceResponse } from '../../../../service/ErrorTypes';
import { 
  UserVerification, 
  VerificationFilter, 
  BulkEmailRequest, 
  EmailTemplate,
  VerificationUpdateRequest,
  VerificationStats
} from '../types';
import { mockVerificationData } from './mockVerificationData';

export class VerificationService extends BaseService {
  private useMockData = true;

  constructor() {
    super();
    // Check feature flag
    this.useMockData = localStorage.getItem('useVerificationMockData') === 'true';
  }

  /**
   * Get users for verification with filters
   */
  async getUsers(
    page: number = 1,
    limit: number = 20,
    filters?: VerificationFilter
  ): Promise<ServiceResponse<{
    users: UserVerification[];
    total: number;
    page: number;
    totalPages: number;
  }>> {
    if (this.useMockData) {
      return mockVerificationData.getUsers(page, limit, filters);
    }

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (filters) {
        if (filters.userType && filters.userType !== 'all') {
          params.append('userType', filters.userType);
        }
        if (filters.verificationStatus && filters.verificationStatus !== 'all') {
          params.append('verificationStatus', filters.verificationStatus);
        }
        if (filters.specificVerification) {
          params.append('specificVerification', filters.specificVerification);
        }
        if (filters.city) {
          params.append('city', filters.city);
        }
        if (filters.country) {
          params.append('country', filters.country);
        }
        if (filters.dateRange) {
          params.append('fromDate', filters.dateRange.from.toISOString());
          params.append('toDate', filters.dateRange.to.toISOString());
        }
      }

      return await this.apiService.get(`admin/verification/users?${params.toString()}`);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get verification statistics
   */
  async getStats(): Promise<ServiceResponse<VerificationStats>> {
    if (this.useMockData) {
      return mockVerificationData.getStats();
    }

    try {
      return await this.apiService.get('admin/verification/stats');
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Update user verification status
   */
  async updateVerificationStatus(
    request: VerificationUpdateRequest
  ): Promise<ServiceResponse<{ success: boolean; user: UserVerification }>> {
    if (this.useMockData) {
      return mockVerificationData.updateVerificationStatus(request);
    }

    try {
      return await this.apiService.put(
        `admin/verification/users/${request.userId}/status`,
        request
      );
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Send bulk emails to users
   */
  async sendBulkEmail(
    request: BulkEmailRequest
  ): Promise<ServiceResponse<{ success: boolean; emailsSent: number }>> {
    if (this.useMockData) {
      return mockVerificationData.sendBulkEmail(request);
    }

    try {
      return await this.apiService.post('admin/verification/bulk-email', request);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get email templates
   */
  async getEmailTemplates(
    category?: 'verification' | 'reminder' | 'general'
  ): Promise<ServiceResponse<EmailTemplate[]>> {
    if (this.useMockData) {
      return mockVerificationData.getEmailTemplates(category);
    }

    try {
      const params = category ? `?category=${category}` : '';
      return await this.apiService.get(`admin/verification/email-templates${params}`);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get document preview URL
   */
  async getDocumentPreview(
    userId: string,
    documentType: string
  ): Promise<ServiceResponse<{ url: string }>> {
    if (this.useMockData) {
      return mockVerificationData.getDocumentPreview(userId, documentType);
    }

    try {
      return await this.apiService.get(
        `admin/verification/users/${userId}/documents/${documentType}/preview`
      );
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Export users data
   */
  async exportUsers(
    filters?: VerificationFilter
  ): Promise<ServiceResponse<{ downloadUrl: string }>> {
    if (this.useMockData) {
      return {
        response: {
          downloadUrl: '/mock-export.csv'
        }
      };
    }

    try {
      const params = new URLSearchParams();
      if (filters) {
        // Add filter params similar to getUsers
      }
      return await this.apiService.get(`admin/verification/export?${params.toString()}`);
    } catch (error) {
      return this.handleError(error);
    }
  }
}

// Create and export singleton instance
const verificationService = new VerificationService();
export default verificationService;