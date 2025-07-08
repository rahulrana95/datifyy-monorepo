// apps/frontend/src/mvp/profile/partnerPreferences/hooks/usePartnerPreferences.ts

import { useState, useCallback, useMemo } from 'react';
import { useToast } from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DatifyyUserPartnerPreferences } from '../../types';
import userProfileService from '../../../../service/userService/userProfileService';
import { Logger } from '../../../../utils/Logger';

/**
 * Enterprise-grade Partner Preferences Data Hook
 * 
 * Responsibilities:
 * - Server state management with React Query
 * - Optimistic updates for better UX
 * - Error handling with user feedback
 * - Loading states management
 * - Cache invalidation strategies
 * 
 * Patterns:
 * - Single Responsibility Principle
 * - Observer pattern via React Query
 * - Command Query Separation
 * - Error boundary integration
 */

interface UsePartnerPreferencesOptions {
  enableOptimisticUpdates?: boolean;
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
}

interface UsePartnerPreferencesReturn {
  // Data
  preferences: DatifyyUserPartnerPreferences | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  
  // Mutations
  updatePreferences: (data: Partial<DatifyyUserPartnerPreferences>) => Promise<void>;
  resetPreferences: () => Promise<void>;
  
  // State
  isUpdating: boolean;
  hasUnsavedChanges: boolean;
  lastSaved: string | null;
  
  // Actions
  refetch: () => Promise<void>;
  invalidateCache: () => void;
}

const QUERY_KEYS = {
  partnerPreferences: ['partner-preferences'] as const,
  userProfile: ['user-profile'] as const,
} as const;

const DEFAULT_OPTIONS: UsePartnerPreferencesOptions = {
  enableOptimisticUpdates: true,
  refetchOnWindowFocus: false,
  staleTime: 5 * 60 * 1000, // 5 minutes
};

export const usePartnerPreferences = (
  options: UsePartnerPreferencesOptions = {}
): UsePartnerPreferencesReturn => {
  
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  const toast = useToast();
  const queryClient = useQueryClient();
  const logger = useMemo(() => new Logger('usePartnerPreferences'), []);
  
  // Local state for UX enhancements
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  /**
   * Fetch partner preferences with caching
   */
  const {
    data: preferences,
    isLoading,
    isError,
    error,
    refetch: queryRefetch,
  } = useQuery({
    queryKey: QUERY_KEYS.partnerPreferences,
    queryFn: async () => {
      logger.info('Fetching partner preferences');
      
      const result = await userProfileService.getPartnerPreferences();
      
      if (result.error) {
        logger.error('Failed to fetch partner preferences', { error: result.error });
        throw new Error(result.error.message);
      }
      
      logger.info('Partner preferences fetched successfully', {
        hasData: !!result.response,
        dataKeys: result.response ? Object.keys(result.response) : []
      });
      
      return result.response;
    },
    staleTime: mergedOptions.staleTime,
    refetchOnWindowFocus: mergedOptions.refetchOnWindowFocus,
    retry: (failureCount, error) => {
      // Smart retry logic - don't retry on client errors
      if (error.message.includes('404') || error.message.includes('403')) {
        return false;
      }
      return failureCount < 3;
    },
    meta: {
      errorMessage: 'Failed to load partner preferences'
    }
  });

  /**
   * Update partner preferences with optimistic updates
   */
  const updateMutation = useMutation({
    mutationFn: async (updateData: Partial<DatifyyUserPartnerPreferences>) => {
      logger.info('Updating partner preferences', {
        fieldsToUpdate: Object.keys(updateData),
        optimisticUpdates: mergedOptions.enableOptimisticUpdates
      });

      const result = await userProfileService.updatePartnerPreferences(updateData);
      
      if (result.error) {
        logger.error('Failed to update partner preferences', { 
          error: result.error,
          updateData: Object.keys(updateData)
        });
        throw new Error(result.error.message);
      }

      logger.info('Partner preferences updated successfully');
      return result.response;
    },
    
    onMutate: async (updateData) => {
      if (!mergedOptions.enableOptimisticUpdates) return;

      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.partnerPreferences });

      // Snapshot previous value
      const previousPreferences = queryClient.getQueryData(QUERY_KEYS.partnerPreferences);

      // Optimistically update cache
      queryClient.setQueryData(
        QUERY_KEYS.partnerPreferences,
        (old: DatifyyUserPartnerPreferences | undefined) => 
          old ? { ...old, ...updateData } : null
      );

      logger.debug('Applied optimistic update', { updateData });

      return { previousPreferences };
    },

    onSuccess: (updatedPreferences) => {
      // Update cache with server response
      queryClient.setQueryData(QUERY_KEYS.partnerPreferences, updatedPreferences);
      
      // Reset unsaved changes
      setHasUnsavedChanges(false);
      setLastSaved(new Date().toISOString());

      // Show success feedback
      toast({
        title: 'Preferences Updated ✨',
        description: 'Your partner preferences have been saved successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });

      logger.info('Partner preferences update completed successfully');
    },

    onError: (error, updateData, context) => {
      // Revert optimistic update
      if (context?.previousPreferences) {
        queryClient.setQueryData(QUERY_KEYS.partnerPreferences, context.previousPreferences);
        logger.debug('Reverted optimistic update due to error');
      }

      // Show error feedback
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to save preferences. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });

      logger.error('Partner preferences update failed', { 
        error: error.message,
        updateData: Object.keys(updateData)
      });
    },

    onSettled: () => {
      // Always invalidate after mutation settles
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.partnerPreferences });
    }
  });

  /**
   * Reset preferences to default
   */
  const resetMutation = useMutation({
    mutationFn: async () => {
      logger.info('Resetting partner preferences to default');
      
      // TODO: Implement reset endpoint or use default values
      const defaultPreferences = {}; // Import from constants
      
      const result = await userProfileService.updatePartnerPreferences(defaultPreferences);
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      return result.response;
    },
    
    onSuccess: () => {
      setHasUnsavedChanges(false);
      setLastSaved(new Date().toISOString());
      
      toast({
        title: 'Preferences Reset',
        description: 'Your preferences have been reset to default values',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    },
    
    onError: (error) => {
      toast({
        title: 'Reset Failed',
        description: error.message || 'Failed to reset preferences',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  });

  // Memoized actions to prevent unnecessary re-renders
  const actions = useMemo(() => ({
    updatePreferences: async (data: Partial<DatifyyUserPartnerPreferences>) => {
      setHasUnsavedChanges(true);
      await updateMutation.mutateAsync(data);
    },
    
    resetPreferences: async () => {
      await resetMutation.mutateAsync();
    },
    
    refetch: async () => {
      logger.info('Manual refetch triggered');
      await queryRefetch();
    },
    
    invalidateCache: () => {
      logger.info('Cache invalidation triggered');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.partnerPreferences });
    }
  }), [updateMutation, resetMutation, queryRefetch, queryClient, logger]);

  return {
    // Data
    preferences: preferences ?? null,
    isLoading,
    isError,
    error: error as Error | null,
    
    // Mutations
    updatePreferences: actions.updatePreferences,
    resetPreferences: actions.resetPreferences,
    
    // State
    isUpdating: updateMutation.isPending || resetMutation.isPending,
    hasUnsavedChanges,
    lastSaved,
    
    // Actions
    refetch: actions.refetch,
    invalidateCache: actions.invalidateCache,
  };
};

// Export for testing
export { QUERY_KEYS };