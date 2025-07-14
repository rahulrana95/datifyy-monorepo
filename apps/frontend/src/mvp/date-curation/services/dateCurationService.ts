// apps/frontend/src/mvp/date-curation/services/dateCurationService.ts

import apiService from '../../../service/apiService';
import { 
  CuratedDateCard, 
  DateAction, 
  DateCurationSummary,
  DateFilter,
  DateFeedbackForm 
} from '../types';
import {
  GetUserDatesRequest,
  UserDatesResponse,
  ConfirmDateResponse,
  CancelDateResponse,
  SubmitDateFeedbackResponse,
  CancellationCategory,
  CuratedDateStatus
} from '@datifyy/shared-types';
import { formatDateForDisplay, calculateHoursUntil } from '../utils/dateUtils';


const PATH_PREFIX: string = 'date-curation/';

/**
 * Date Curation Service
 * 
 * Handles all API communications for date curation features:
 * - Fetching user dates (upcoming and history)
 * - Date actions (confirm, cancel, reschedule)
 * - Feedback submission
 * - Summary statistics
 */
class DateCurationService {

  /**
   * Get upcoming dates for the current user
   */
  async getUpcomingDates(filters: DateFilter): Promise<{ data: CuratedDateCard[] }> {
    try {
      console.log('🔍 Fetching upcoming dates...', { filters });

      const params = {
        status: [],//(filters.status || [CuratedDateStatus.PENDING, 'confirmed']) as CuratedDateStatus[],
        mode: filters.mode,
        includeHistory: false,
        includeFeedback: false,
        includePartnerInfo: true,
        page: 1,
          limit: 20,
        startDate: ''
      };

      // Add date range filter
      if (filters.timeRange === 'upcoming') {
        params.startDate = new Date().toISOString().split('T')[0]; // Today
      }

    
      const paramsReq: GetUserDatesRequest = params;
        
      const response = await apiService.get<UserDatesResponse>(`${PATH_PREFIX}my-dates`, { params });

      if (response.error) {
        console.error('❌ Failed to fetch upcoming dates:', response.error);
        throw new Error(response.error.message || 'Failed to fetch dates');
      }

      if (!response.response?.data) {
        console.warn('⚠️ No dates data in response');
        return { data: [] };
      }

      // Transform API response to frontend format
      const dates = response.response.data.data?.map(this.transformToDateCard) || [];
      
      console.log('✅ Upcoming dates fetched successfully', { count: dates.length });
      return { data: dates };

    } catch (error: any) {
      console.error('❌ Error fetching upcoming dates:', error);
      throw new Error(error.message || 'Failed to fetch upcoming dates');
    }
  }

  /**
   * Get date history for the current user
   */
  async getDateHistory(filters: DateFilter): Promise<{ data: CuratedDateCard[] }> {
    try {
      console.log('🔍 Fetching date history...', { filters });

      const params = {
        status: ['completed', 'cancelled'] as CuratedDateStatus[],
        mode: filters.mode,
        includeHistory: true,
        includeFeedback: true,
        includePartnerInfo: true,
        page: 1,
          limit: 50,
        startDate: ''
      };

      // Add date range filter for history
      if (filters.timeRange === 'past_week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        params.startDate = weekAgo.toISOString().split('T')[0];
      } else if (filters.timeRange === 'past_month') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        params.startDate = monthAgo.toISOString().split('T')[0];
      }

        const paramReq: GetUserDatesRequest = params;
      const response = await apiService.get<UserDatesResponse>(`${PATH_PREFIX}dates`, { params: paramReq });

      if (response.error) {
        console.error('❌ Failed to fetch date history:', response.error);
        throw new Error(response.error.message || 'Failed to fetch date history');
      }

      const dates = response.response?.data?.data?.map(this.transformToDateCard) || [];
      
      console.log('✅ Date history fetched successfully', { count: dates.length });
      return { data: dates };

    } catch (error: any) {
      console.error('❌ Error fetching date history:', error);
      throw new Error(error.message || 'Failed to fetch date history');
    }
  }

  /**
   * Get summary statistics for user's date curation
   */
  async getSummary(): Promise<{ data: DateCurationSummary }> {
    try {
      console.log('🔍 Fetching date curation summary...');

      const response = await apiService.get<UserDatesResponse>(`${PATH_PREFIX}dates`, {
        params: { 
          includeHistory: true,
          includeFeedback: true,
          limit: 100 // Get more for summary calculation
        }
      });

      if (response.error) {
        console.error('❌ Failed to fetch summary:', response.error);
        throw new Error(response.error.message || 'Failed to fetch summary');
      }

      const summaryData = response.response?.data?.summary;
      
      const summary: DateCurationSummary = {
        totalDates: summaryData?.totalDates || 0,
        upcomingDates: summaryData?.upcomingDates || 0,
        completedDates: summaryData?.completedDates || 0,
        pendingConfirmation: summaryData?.pendingConfirmation || 0,
        awaitingFeedback: summaryData?.awaitingFeedback || 0,
        averageRating: 0, // Will be calculated from feedback
        successfulConnections: 0, // Will be calculated
      };

      console.log('✅ Summary fetched successfully', summary);
      return { data: summary };

    } catch (error: any) {
      console.error('❌ Error fetching summary:', error);
      throw new Error(error.message || 'Failed to fetch summary');
    }
  }

  /**
   * Handle date actions (confirm, cancel, reschedule)
   */
  async handleDateAction(action: DateAction): Promise<any> {
    try {
      console.log('🎯 Handling date action...', { action });

      switch (action.type) {
        case 'accept':
          return await this.confirmDate(action.dateId);
        
        case 'cancel':
          return await this.cancelDate(action.dateId, action.category, action.reason);
        
        case 'reschedule':
          // For now, treat as cancel with reschedule reason
          return await this.cancelDate(action.dateId, CancellationCategory.OTHER, action.reason || 'Reschedule requested');
        
        default:
          throw new Error(`Unknown action type: ${action.type}`);
      }

    } catch (error: any) {
      console.error('❌ Error handling date action:', error);
      throw new Error(error.message || 'Failed to process date action');
    }
  }

  /**
   * Confirm a date
   */
  private async confirmDate(dateId: string): Promise<ConfirmDateResponse> {
    const response = await apiService.post<ConfirmDateResponse>(
      `${PATH_PREFIX}dates/${dateId}/confirm`,
      { confirmed: true }
    );

    if (response.error) {
      throw new Error(response.error.message || 'Failed to confirm date');
    }

    return response.response!;
  }

  /**
   * Cancel a date
   */
  private async cancelDate(
    dateId: string, 
    category?: CancellationCategory, 
    reason?: string
  ): Promise<CancelDateResponse> {
    const response = await apiService.post<CancelDateResponse>(
      `${PATH_PREFIX}dates/${dateId}/cancel`,
      {
        reason: reason || 'User cancelled',
        category: category || 'other',
        notifyPartner: true,
        refundTokens: true
      }
    );

    if (response.error) {
      throw new Error(response.error.message || 'Failed to cancel date');
    }

    return response.response!;
  }

  /**
   * Submit feedback for a completed date
   */
  async submitFeedback(dateId: string, feedback: DateFeedbackForm): Promise<any> {
    try {
      console.log('📝 Submitting date feedback...', { dateId, feedback });

      const response = await apiService.post<SubmitDateFeedbackResponse>(
        `${PATH_PREFIX}dates/${dateId}/feedback`,
        {
          overallRating: feedback.overallRating,
          wouldMeetAgain: feedback.wouldMeetAgain,
          chemistryRating: feedback.chemistryRating,
          conversationQuality: feedback.conversationQuality,
          whatWentWell: feedback.whatWentWell,
          whatCouldImprove: feedback.whatCouldImprove,
          interestedInSecondDate: feedback.interestedInSecondDate,
          additionalComments: feedback.additionalComments,
          isAnonymous: false
        }
      );

      if (response.error) {
        console.error('❌ Failed to submit feedback:', response.error);
        throw new Error(response.error.message || 'Failed to submit feedback');
      }

      console.log('✅ Feedback submitted successfully');
      return response.response;

    } catch (error: any) {
      console.error('❌ Error submitting feedback:', error);
      throw new Error(error.message || 'Failed to submit feedback');
    }
  }

  /**
   * Transform API response to frontend date card format
   */
  private transformToDateCard(apiDate: any): CuratedDateCard {
    const dateTime = new Date(apiDate.dateTime || apiDate.availabilityDate);
    const now = new Date();
    const hoursUntilDate = calculateHoursUntil(dateTime);
    
    return {
      id: apiDate.id?.toString() || Math.random().toString(),
      matchName: apiDate.user?.firstName || apiDate.matchName || 'Unknown',
      matchAge: apiDate.user?.age || 25,
      matchImage: apiDate.user?.profileImage || apiDate.matchImage,
      dateTime: dateTime.toISOString(),
      mode: apiDate.mode || apiDate.dateType || 'offline',
      status: this.mapStatusToFrontend(apiDate.status),
      location: apiDate.locationName || apiDate.locationPreference,
      meetingLink: apiDate.meetingLink,
      compatibilityScore: apiDate.compatibilityScore || 85,
      isVerified: apiDate.user?.verificationStatus?.email || apiDate.isVerified || false,
      adminNote: apiDate.adminNotes || apiDate.notes,
      dressCode: apiDate.dressCode,
      canCancel: apiDate.canCancel ?? (hoursUntilDate > 4),
      canConfirm: apiDate.canConfirm ?? (apiDate.status === 'pending'),
      canSubmitFeedback: apiDate.canSubmitFeedback ?? (apiDate.status === 'completed'),
      hoursUntilDate,
      formattedDateTime: formatDateForDisplay(dateTime),
      isUpcoming: dateTime > now,
    };
  }

  /**
   * Map API status to frontend status
   */
  private mapStatusToFrontend(apiStatus: string): CuratedDateCard['status'] {
    const statusMap: Record<string, CuratedDateCard['status']> = {
      'pending': 'pending',
      'active': 'pending', 
      'booked': 'confirmed',
      'confirmed': 'confirmed',
      'cancelled': 'cancelled',
      'completed': 'completed',
    };

    return statusMap[apiStatus] || 'pending';
  }
}

// Export singleton instance
export const dateCurationService = new DateCurationService();
export default dateCurationService;