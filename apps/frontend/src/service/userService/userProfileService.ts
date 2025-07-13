// apps/frontend/src/service/userService/userProfileService.ts

import {
  getErrorObject,
  getResponseNotExistErrorObject,
} from "../../mvp/common/utils/serviceUtils";
import { DatifyyUserPartnerPreferences } from "../../mvp/profile/types";
import api from "../apiService";
import { ErrorObject } from "../ErrorTypes";
import { DatifyyUsersInformation } from "./UserProfileTypes";

/**
 * Enhanced User Profile Service
 * Handles both user profile and partner preferences with proper error handling and logging
 */
class UserProfileService {

  prefix = "/user/partner-preferences"
  
  // ===== USER PROFILE METHODS =====

  /**
   * Get current user's profile information
   */
  async getUserProfile(): Promise<{
    response: DatifyyUsersInformation | null;
    error?: ErrorObject;
  }> {
    try {
      console.log('🔍 Fetching user profile...');
      
      // @ts-ignore
      const response: {
        response: DatifyyUsersInformation,
        error: ErrorObject
      } = await api.get(`user-profile`);

      if (response.error) {
        console.error('❌ Failed to fetch user profile:', response.error);
        return { response: null, error: response.error };
      }

      if (!response?.response?.id) {
        console.warn('⚠️ No user profile data found');
        return getResponseNotExistErrorObject();
      }

      console.log('✅ User profile fetched successfully');
      return { response: response?.response, error: undefined };
      
    } catch (error: any) {
      console.error('❌ User profile fetch error:', error);
      return getErrorObject(error);
    }
  }

  /**
   * Update user profile information
   */
  async updateUserProfile(data: Partial<DatifyyUsersInformation>): Promise<{
    response: DatifyyUsersInformation | null;
    error?: ErrorObject;
  }> {
    try {
      console.log('📝 Updating user profile...', { fields: Object.keys(data) });

      // Validate data before sending
      const validationResult = this.validateUserProfileData(data);
      if (!validationResult.isValid) {
        console.error('❌ Validation failed:', validationResult.errors);
        return {
          response: null,
          error: {
            code: 400,
            message: `Validation failed: ${validationResult.errors.join(', ')}`
          }
        };
      }

      const response: {
        response?: DatifyyUsersInformation;
        error?: ErrorObject;
      } = await api.put("user-profile", data);

      if (response.error) {
        console.error('❌ Failed to update user profile:', response.error);
        return { response: null, error: response.error };
      }

      if (!response.response) {
        console.warn('⚠️ No response data after profile update');
        return getResponseNotExistErrorObject();
      }

      console.log('✅ User profile updated successfully');
      return { response: response.response, error: undefined };
      
    } catch (error: any) {
      console.error('❌ User profile update error:', error);
      return getErrorObject(error);
    }
  }

  // ===== PARTNER PREFERENCES METHODS =====

  /**
   * Get current user's partner preferences
   */
  async getPartnerPreferences(): Promise<{
    response: DatifyyUserPartnerPreferences | null;
    error?: ErrorObject;
  }> {
    try {
      console.log('🔍 Fetching partner preferences...');
      
      const response: {
        response?: {
          success?: boolean;
          data?: DatifyyUserPartnerPreferences;
        };
        error?: ErrorObject;
      } = await api.get(`${this.prefix}`);

      if (response.error) {
        console.error('❌ Failed to fetch partner preferences:', response.error);
        return { response: null, error: response.error };
      }

      if (!response.response?.data) {
        console.warn('⚠️ No partner preferences found - user may need to create them');
        return { response: null, error: undefined };
      }

      console.log('✅ Partner preferences fetched successfully');
      return { response: response.response.data, error: undefined };
      
    } catch (error: any) {
      console.error('❌ Partner preferences fetch error:', error);
      return getErrorObject(error);
    }
  }

  /**
   * Update partner preferences
   */
  async updatePartnerPreferences(data: Partial<DatifyyUserPartnerPreferences>): Promise<{
    response: DatifyyUserPartnerPreferences | null;
    error?: ErrorObject;
  }> {
    try {
      console.log('📝 Updating partner preferences...', { fields: Object.keys(data) });

      // Validate data before sending
      const validationResult = this.validatePartnerPreferencesData(data);
      if (!validationResult.isValid) {
        console.error('❌ Validation failed:', validationResult.errors);
        return {
          response: null,
          error: {
            code: 400,
            message: `Validation failed: ${validationResult.errors.join(', ')}`
          }
        };
      }

      const response: {
        response?: {
          success?: boolean;
          data?: DatifyyUserPartnerPreferences;
        };
        error?: ErrorObject;
      } = await api.put(`${this.prefix}`, data);

      if (response.error) {
        console.error('❌ Failed to update partner preferences:', response.error);
        return { response: null, error: response.error };
      }

      if (!response.response?.data) {
        console.warn('⚠️ No response data after partner preferences update');
        return getResponseNotExistErrorObject();
      }

      console.log('✅ Partner preferences updated successfully');
      return { response: response.response.data, error: undefined };
      
    } catch (error: any) {
      console.error('❌ Partner preferences update error:', error);
      return getErrorObject(error);
    }
  }

  /**
   * Create initial partner preferences
   */
  async createPartnerPreferences(data: Partial<DatifyyUserPartnerPreferences>): Promise<{
    response: DatifyyUserPartnerPreferences | null;
    error?: ErrorObject;
  }> {
    try {
      console.log('🆕 Creating partner preferences...');

      const validationResult = this.validatePartnerPreferencesData(data);
      if (!validationResult.isValid) {
        return {
          response: null,
          error: {
            code: 400,
            message: `Validation failed: ${validationResult.errors.join(', ')}`
          }
        };
      }

      const response: {
        response?: {
          success?: boolean;
          data?: DatifyyUserPartnerPreferences;
        };
        error?: ErrorObject;
      } = await api.post(`${this.prefix}`, data);

      if (response.error) {
        console.error('❌ Failed to create partner preferences:', response.error);
        return { response: null, error: response.error };
      }

      if (!response.response?.data) {
        return getResponseNotExistErrorObject();
      }

      console.log('✅ Partner preferences created successfully');
      return { response: response.response.data, error: undefined };
      
    } catch (error: any) {
      console.error('❌ Partner preferences creation error:', error);
      return getErrorObject(error);
    }
  }

  /**
   * Delete partner preferences
   */
  async deletePartnerPreferences(): Promise<{
    success: boolean;
    error?: ErrorObject;
  }> {
    try {
      console.log('🗑️ Deleting partner preferences...');

      const response: {
        response?: { success?: boolean };
        error?: ErrorObject;
      } = await api.delete("partner-preferences");

      if (response.error) {
        console.error('❌ Failed to delete partner preferences:', response.error);
        return { success: false, error: response.error };
      }

      console.log('✅ Partner preferences deleted successfully');
      return { success: true };
      
    } catch (error: any) {
      console.error('❌ Partner preferences deletion error:', error);
      return { success: false, error: getErrorObject(error).error };
    }
  }

  // ===== MATCHING METHODS =====

  /**
   * Get potential matches based on partner preferences
   */
  async getMatches(options?: {
    page?: number;
    limit?: number;
    minCompatibilityScore?: number;
  }): Promise<{
    response: {
      matches: Array<{
        userId: string;
        profile: DatifyyUsersInformation;
        compatibilityScore: number;
        matchReasons: string[];
      }>;
      pagination: {
        page: number;
        limit: number;
        total: number;
        hasMore: boolean;
      };
    } | null;
    error?: ErrorObject;
  }> {
    try {
      console.log('🔍 Getting matches...', options);

      const params = new URLSearchParams();
      if (options?.page) params.append('page', options.page.toString());
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.minCompatibilityScore) {
        params.append('minScore', options.minCompatibilityScore.toString());
      }

      const endpoint = `matches${params.toString() ? `?${params}` : ''}`;
      const response: {
        response?: {
          success?: boolean;
          data?: any;
        };
        error?: ErrorObject;
      } = await api.get(endpoint);

      if (response.error) {
        console.error('❌ Failed to get matches:', response.error);
        return { response: null, error: response.error };
      }

      if (!response.response?.data) {
        console.warn('⚠️ No matches found');
        return { response: null, error: undefined };
      }

      console.log('✅ Matches retrieved successfully');
      return { response: response.response.data };
      
    } catch (error: any) {
      console.error('❌ Matches fetch error:', error);
      return getErrorObject(error);
    }
  }

  /**
   * Get compatibility score with another user
   */
  async getCompatibilityScore(targetUserId: string): Promise<{
    response: {
      compatibilityScore: number;
      breakdown: {
        religion: number;
        income: number;
        education: number;
        appearance: number;
        personality: number;
        values: number;
      };
      recommendations: string[];
    } | null;
    error?: ErrorObject;
  }> {
    try {
      console.log('🔍 Getting compatibility score...', { targetUserId });

      const response: {
        response?: {
          success?: boolean;
          data?: any;
        };
        error?: ErrorObject;
      } = await api.get(`compatibility/${targetUserId}`);

      if (response.error) {
        return { response: null, error: response.error };
      }

      if (!response.response?.data) {
        return getResponseNotExistErrorObject();
      }

      console.log('✅ Compatibility score retrieved successfully');
      return { response: response.response.data };
      
    } catch (error: any) {
      return getErrorObject(error);
    }
  }

  // ===== VALIDATION METHODS =====

  /**
   * Validate user profile data
   */
  private validateUserProfileData(data: Partial<DatifyyUsersInformation>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Age validation from DOB
    if (data.dob) {
      const age = this.calculateAge(data.dob);
      if (age < 18) {
        errors.push('User must be at least 18 years old');
      }
      if (age > 100) {
        errors.push('Invalid age');
      }
    }

    // Height validation
    if (data.height) {
      if (data?.height < 100 || data?.height > 250) {
        errors.push('Height must be between 100-250 cm');
      }
    }

    // Name validation
    if (data.firstName !== undefined && data.firstName.trim().length < 1) {
      errors.push('First name cannot be empty');
    }
    if (data.lastName !== undefined && data.lastName.trim().length < 1) {
      errors.push('Last name cannot be empty');
    }

    // Bio length validation
    if (data.bio && data.bio.length > 500) {
      errors.push('Bio cannot exceed 500 characters');
    }

    // Images validation
    if (data.images && data.images.length > 6) {
      errors.push('Maximum 6 images allowed');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate partner preferences data
   */
  private validatePartnerPreferencesData(data: Partial<DatifyyUserPartnerPreferences>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Age range validation
    if (data.minAge && data.maxAge) {
      if (data.minAge > data.maxAge) {
        errors.push('Minimum age cannot be greater than maximum age');
      }
      if (data.minAge < 18) {
        errors.push('Minimum age must be at least 18');
      }
      if (data.maxAge > 100) {
        errors.push('Maximum age cannot exceed 100');
      }
    }

    // Height range validation
    if (data.minHeight && data.maxHeight) {
      if (data.minHeight > data.maxHeight) {
        errors.push('Minimum height cannot be greater than maximum height');
      }
    }

    // Income range validation
    if (data.minIncome && data.maxIncome) {
      if (data.minIncome > data.maxIncome) {
        errors.push('Minimum income cannot be greater than maximum income');
      }
      if (data.minIncome < 0 || data.maxIncome < 0) {
        errors.push('Income values cannot be negative');
      }
    }

    // Array length validations
    if (data.hobbies && data.hobbies.length > 10) {
      errors.push('Maximum 10 hobbies allowed');
    }
    if (data.interests && data.interests.length > 10) {
      errors.push('Maximum 10 interests allowed');
    }
    if (data.educationLevel && data.educationLevel.length > 5) {
      errors.push('Maximum 5 education levels allowed');
    }
    if (data.profession && data.profession.length > 10) {
      errors.push('Maximum 10 professions allowed');
    }

    // Text length validation
    if (data.whatOtherPersonShouldKnow && data.whatOtherPersonShouldKnow.length > 1000) {
      errors.push('Description cannot exceed 1000 characters');
    }

    // Location radius validation
    if (data.locationPreferenceRadius) {
      if (data.locationPreferenceRadius < 1 || data.locationPreferenceRadius > 1000) {
        errors.push('Location radius must be between 1-1000 km');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // ===== UTILITY METHODS =====

  /**
   * Calculate age from date of birth
   */
  private calculateAge(dob: string): number {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  /**
   * Get profile completion percentage
   */
  async getProfileCompletionStats(): Promise<{
    response: {
      completionPercentage: number;
      missingFields: string[];
      recommendations: string[];
    } | null;
    error?: ErrorObject;
  }> {
    try {
      const profileResponse = await this.getUserProfile();
      if (profileResponse.error || !profileResponse.response) {
        return { response: null, error: profileResponse.error };
      }

      const profile = profileResponse.response;
      const requiredFields = ['firstName', 'lastName', 'gender', 'dob', 'currentCity', 'lookingFor'];
      const optionalFields = ['bio', 'images', 'height', 'hometown', 'exercise', 'educationLevel'];
      const allFields = [...requiredFields, ...optionalFields];

      let filledFields = 0;
      const missingFields: string[] = [];

      for (const field of allFields) {
        const value = (profile as any)[field];
        if (this.isFieldFilled(value)) {
          filledFields++;
        } else {
          missingFields.push(field);
        }
      }

      const completionPercentage = Math.round((filledFields / allFields.length) * 100);
      const recommendations = this.generateRecommendations(missingFields);

      return {
        response: {
          completionPercentage,
          missingFields,
          recommendations
        }
      };
    } catch (error: any) {
      return getErrorObject(error);
    }
  }

  /**
   * Check if field is filled
   */
  private isFieldFilled(value: any): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'boolean') return true;
    if (typeof value === 'number') return !isNaN(value);
    return true;
  }

  /**
   * Generate recommendations based on missing fields
   */
  private generateRecommendations(missingFields: string[]): string[] {
    const recommendations: string[] = [];

    if (missingFields.includes('images')) {
      recommendations.push('Add profile photos to increase your visibility by 300%');
    }
    if (missingFields.includes('bio')) {
      recommendations.push('Write a compelling bio to attract compatible matches');
    }
    if (missingFields.includes('height')) {
      recommendations.push('Adding your height helps with better matching');
    }

    return recommendations;
  }
}

const userProfileService = new UserProfileService();
export default userProfileService;