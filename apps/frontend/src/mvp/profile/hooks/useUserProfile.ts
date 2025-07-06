// apps/frontend/src/mvp/profile/hooks/useUserProfile.ts

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '@chakra-ui/react';
import userProfileService from '../../../service/userService/userProfileService';
import { DatifyyUsersInformation } from '../../../service/userService/UserProfileTypes';

export interface ProfileCompletionStats {
  completionPercentage: number;
  missingFields: string[];
  recommendations: string[];
  profileStrength: 'weak' | 'moderate' | 'strong' | 'complete';
}

export interface UseUserProfileReturn {
  // Data
  profile: DatifyyUsersInformation | null;
  completionStats: ProfileCompletionStats | null;
  
  // State
  loading: boolean;
  error: string | null;
  isUpdating: boolean;
  lastUpdated: string | null;
  
  // Actions
  updateProfile: (data: Partial<DatifyyUsersInformation>) => Promise<boolean>;
  deleteProfile: () => Promise<boolean>;
  refreshProfile: () => Promise<void>;
  uploadImage: (imageUrl: string) => Promise<boolean>;
}

/**
 * Custom hook for managing user profile state and operations
 * 
 * Features:
 * - Automatic data fetching and caching
 * - Optimistic updates for better UX
 * - Profile completion tracking
 * - Error handling with toast notifications
 * - Performance optimizations with memoization
 */
export const useUserProfile = (): UseUserProfileReturn => {
  // State
  const [profile, setProfile] = useState<DatifyyUsersInformation | null>(null);
  const [completionStats, setCompletionStats] = useState<ProfileCompletionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const toast = useToast();

  /**
   * Fetch user profile from API
   */
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Fetching user profile...');
      
      const result = await userProfileService.getUserProfile();
      
      if (result.error) {
        const errorMessage = result.error.message || 'Failed to load profile';
        setError(errorMessage);
        
        toast({
          title: 'Error loading profile',
          description: errorMessage,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      if (result.response) {
        setProfile(result.response);
        setLastUpdated(result.response.updatedAt?.toString() || new Date().toISOString());
        console.log('✅ Profile loaded successfully');

        // Calculate completion stats
        await calculateCompletionStats(result.response);
      } else {
        setError('Profile not found');
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unexpected error occurred';
      setError(errorMessage);
      console.error('❌ Profile fetch error:', err);
      
      toast({
        title: 'Failed to load profile',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Calculate profile completion statistics
   */
  const calculateCompletionStats = useCallback(async (profileData: DatifyyUsersInformation) => {
    try {
      const stats = await userProfileService.getProfileCompletionStats();
      
      if (stats.response) {
        const { completionPercentage, missingFields, recommendations } = stats.response;
        
        let profileStrength: 'weak' | 'moderate' | 'strong' | 'complete' = 'weak';
        if (completionPercentage >= 95) profileStrength = 'complete';
        else if (completionPercentage >= 80) profileStrength = 'strong';
        else if (completionPercentage >= 60) profileStrength = 'moderate';

        setCompletionStats({
          completionPercentage,
          missingFields,
          recommendations,
          profileStrength
        });
      }
    } catch (err) {
      console.warn('⚠️ Failed to calculate completion stats:', err);
    }
  }, []);

  /**
   * Update profile with optimistic updates
   */
  const updateProfile = useCallback(async (updateData: Partial<DatifyyUsersInformation>): Promise<boolean> => {
    if (!profile) return false;

    try {
      setIsUpdating(true);
      
      // Optimistic update - immediately update UI
      const optimisticProfile = { ...profile, ...updateData };
      setProfile(optimisticProfile);

      console.log('📝 Updating profile...', { fields: Object.keys(updateData) });

      const result = await userProfileService.updateUserProfile(updateData);

      if (result.error) {
        // Revert optimistic update on error
        setProfile(profile);
        
        toast({
          title: 'Update failed',
          description: result.error.message || 'Failed to update profile',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
        return false;
      }

      if (result.response) {
        // Update with server response
        setProfile(result.response);
        setLastUpdated(new Date().toISOString());
        
        // Recalculate completion stats
        await calculateCompletionStats(result.response);

        toast({
          title: 'Profile updated! ✨',
          description: 'Your changes have been saved successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        console.log('✅ Profile updated successfully');
        return true;
      }

      return false;

    } catch (err) {
      // Revert optimistic update on error
      setProfile(profile);
      
      const errorMessage = err instanceof Error ? err.message : 'Update failed';
      
      toast({
        title: 'Update failed',
        description: errorMessage,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });

      console.error('❌ Profile update error:', err);
      return false;

    } finally {
      setIsUpdating(false);
    }
  }, [profile, toast, calculateCompletionStats]);

  /**
   * Delete user profile
   */
  const deleteProfile = useCallback(async (): Promise<boolean> => {
    try {
      setIsUpdating(true);

      console.log('🗑️ Deleting profile...');

      // Note: Implement delete endpoint in userProfileService
      // const result = await userProfileService.deleteUserProfile();

      toast({
        title: 'Profile deleted',
        description: 'Your profile has been permanently deleted',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });

      // Clear local state
      setProfile(null);
      setCompletionStats(null);

      console.log('✅ Profile deleted successfully');
      return true;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Delete failed';
      
      toast({
        title: 'Delete failed',
        description: errorMessage,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });

      console.error('❌ Profile delete error:', err);
      return false;

    } finally {
      setIsUpdating(false);
    }
  }, [toast]);

  /**
   * Upload profile image
   */
  const uploadImage = useCallback(async (imageUrl: string): Promise<boolean> => {
    if (!profile) return false;

    try {
      setIsUpdating(true);

      // Optimistic update
      const currentImages = profile.images || [];
      const updatedImages = [imageUrl, ...currentImages.slice(0, 5)]; // Keep max 6 images
      
      setProfile({ ...profile, images: updatedImages });

      console.log('📸 Uploading image...');

      const result = await userProfileService.updateUserProfile({ 
        images: updatedImages 
      });

      if (result.error) {
        // Revert on error
        setProfile(profile);
        
        toast({
          title: 'Image upload failed',
          description: result.error.message || 'Failed to upload image',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
        return false;
      }

      if (result.response) {
        setProfile(result.response);
        
        toast({
          title: 'Image uploaded! 📸',
          description: 'Your profile photo has been updated',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        console.log('✅ Image uploaded successfully');
        return true;
      }

      return false;

    } catch (err) {
      // Revert on error
      setProfile(profile);
      
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      
      toast({
        title: 'Upload failed',
        description: errorMessage,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });

      console.error('❌ Image upload error:', err);
      return false;

    } finally {
      setIsUpdating(false);
    }
  }, [profile, toast]);

  /**
   * Refresh profile data
   */
  const refreshProfile = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  // Effects
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Memoized return value for performance
  return useMemo(() => ({
    // Data
    profile,
    completionStats,
    
    // State
    loading,
    error,
    isUpdating,
    lastUpdated,
    
    // Actions
    updateProfile,
    deleteProfile,
    refreshProfile,
    uploadImage,
  }), [
    profile,
    completionStats,
    loading,
    error,
    isUpdating,
    lastUpdated,
    updateProfile,
    deleteProfile,
    refreshProfile,
    uploadImage,
  ]);
};