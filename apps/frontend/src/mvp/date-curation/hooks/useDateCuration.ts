// apps/frontend/src/mvp/date-curation/hooks/useDateCuration.ts

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  CuratedDateCard, 
  DateAction, 
  DateCurationSummary,
  DateFilter,
  DateFeedbackForm, 
  CuratedDateStatus
} from '../types';
import { dateCurationService } from '../services/dateCurationService';
import { useAuthStore } from '../../login-signup';

/**
 * Date Curation Hook
 * 
 * Manages all date curation state and operations:
 * - Fetching upcoming dates and history
 * - Handling user actions (accept, cancel, feedback)
 * - Real-time updates and optimistic UI
 * - Error handling and loading states
 */
export const useDateCuration = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [filters, setFilters] = useState<DateFilter>({
    status: [
      CuratedDateStatus.CURATED_DATE_STATUS_PENDING,
      CuratedDateStatus.CURATED_DATE_STATUS_BOTH_CONFIRMED
    ],
    timeRange: 'upcoming',
    includeHistory: false
  });
  
  const toast = useToast();
  const queryClient = useQueryClient();

  // Query keys for cache management
  const QUERY_KEYS = {
    upcomingDates: ['dateCuration', 'upcoming', user?.id],
    dateHistory: ['dateCuration', 'history', user?.id],
    summary: ['dateCuration', 'summary', user?.id],
  };

  // Fetch upcoming dates
  const {
    data: upcomingDatesResponse,
    isLoading: isLoadingUpcoming,
    error: upcomingError,
    refetch: refetchUpcoming
  } = useQuery({
    queryKey: QUERY_KEYS.upcomingDates,
    queryFn: () => dateCurationService.getUpcomingDates(filters),
    enabled: isAuthenticated && !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });

  // Fetch date history
  const {
    data: dateHistoryResponse,
    isLoading: isLoadingHistory,
    error: historyError
  } = useQuery({
    queryKey: QUERY_KEYS.dateHistory,
    queryFn: () => dateCurationService.getDateHistory(filters),
    enabled: isAuthenticated && !!user?.id && filters.includeHistory,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch summary statistics
  const {
    data: summaryResponse,
    isLoading: isLoadingSummary,
    error: summaryError
  } = useQuery({
    queryKey: QUERY_KEYS.summary,
    queryFn: () => dateCurationService.getSummary(),
    enabled: isAuthenticated && !!user?.id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Date action mutation (accept/cancel/reschedule)
  const dateActionMutation = useMutation({
    mutationFn: (action: DateAction) => dateCurationService.handleDateAction(action),
    onMutate: async (action: DateAction) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.upcomingDates });
      
      const previousDates = queryClient.getQueryData(QUERY_KEYS.upcomingDates);
      
      if (action.type === 'accept') {
        // Optimistically update status to confirmed
        queryClient.setQueryData(QUERY_KEYS.upcomingDates, (old: any) => ({
          ...old,
          data: old?.data?.map((date: CuratedDateCard) =>
            date.id === action.dateId
              ? { ...date, status: 'confirmed', canConfirm: false }
              : date
          ) || []
        }));
      }
      
      return { previousDates };
    },
    onError: (error, action, context) => {
      // Revert optimistic update
      if (context?.previousDates) {
        queryClient.setQueryData(QUERY_KEYS.upcomingDates, context.previousDates);
      }
      
      toast({
        title: "Action failed",
        description: "Something went wrong. Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    },
    onSuccess: (data, action) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.upcomingDates });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.summary });
      
      // Show success message
      const messages = {
        accept: "Date confirmed! 💕 You'll receive a reminder 24 hours before.",
        cancel: "Date cancelled. We've notified your match and will find you another connection!",
        reschedule: "Reschedule request sent! We'll coordinate with your match.",
      };
      
      toast({
        title: action.type === 'accept' ? "Date confirmed! 💕" : 
               action.type === 'cancel' ? "Date cancelled" : "Request sent",
        description: messages[action.type as keyof typeof messages],
        status: action.type === 'accept' ? "success" : "info",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    },
  });

  // Feedback submission mutation
  const feedbackMutation = useMutation({
    mutationFn: ({ dateId, feedback }: { dateId: string; feedback: DateFeedbackForm }) => 
      dateCurationService.submitFeedback(dateId, feedback),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dateHistory });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.summary });
      
      toast({
        title: "Feedback submitted! 🙏",
        description: "Thank you for helping us improve your experience.",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    },
    onError: () => {
      toast({
        title: "Submission failed",
        description: "Please try submitting your feedback again.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    },
  });

  // Handle date actions
  const handleDateAction = useCallback(async (action: DateAction): Promise<void> => {
    try {
      await dateActionMutation.mutateAsync(action);
    } catch (error) {
      // Error handling is done in mutation callbacks
      throw error;
    }
  }, [dateActionMutation]);

  // Submit feedback
  const submitFeedback = useCallback(async (dateId: string, feedback: DateFeedbackForm): Promise<void> => {
    try {
      await feedbackMutation.mutateAsync({ dateId, feedback });
    } catch (error) {
      throw error;
    }
  }, [feedbackMutation]);

  // Refresh all data
  const refreshDates = useCallback(async () => {
    await Promise.all([
      refetchUpcoming(),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dateHistory }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.summary }),
    ]);
  }, [refetchUpcoming, queryClient]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<DateFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Computed values
  const upcomingDates = upcomingDatesResponse?.data || [];
  const dateHistory = dateHistoryResponse?.data || [];
  const summary = summaryResponse?.data || {
    totalDates: 0,
    upcomingDates: 0,
    completedDates: 0,
    pendingConfirmation: 0,
    awaitingFeedback: 0,
    averageRating: 0,
    successfulConnections: 0,
  };

  const isLoading = isLoadingUpcoming || isLoadingSummary || 
                   (filters.includeHistory && isLoadingHistory);
  
  const error = upcomingError?.message || 
               historyError?.message || 
               summaryError?.message || 
               null;

  const isProcessing = dateActionMutation.isPending || feedbackMutation.isPending;

  return {
    // Data
    upcomingDates,
    dateHistory,
    summary,
    filters,
    
    // Loading states
    isLoading,
    isProcessing,
    error,
    
    // Actions
    handleDateAction,
    submitFeedback,
    refreshDates,
    updateFilters,
    
    // Mutation states for individual actions
    isSubmittingAction: dateActionMutation.isPending,
    isSubmittingFeedback: feedbackMutation.isPending,
  };
};