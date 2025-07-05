// src/modules/userProfile/services/UserProfileService.ts

import { Logger } from '../../../infrastructure/logging/Logger';
import { IUserProfileService } from './IUserProfileService';
import { IUserProfileRepository } from '../repositories/IUserProfileRepository';
import { UserProfileMapper } from '../mappers/UserProfileMapper';
import { 
  UpdateUserProfileRequestDto,
  ValidationUtils 
} from '../dtos/UserProfileDtos';
import {
  UserProfileResponseDto,
  UserProfileStatsDto
} from '../dtos/UserProfileResponseDtos';
import {
  UserNotFoundError,
  ValidationError,
  InternalServerError
} from '../../../domain/errors/AuthErrors';
import { DatifyyUsersInformation } from '../../../models/entities/DatifyyUsersInformation';

/**
 * User Profile Service Implementation
 * 
 * Responsibilities:
 * - Core business logic for user profiles
 * - Data validation and business rules
 * - Profile completeness analysis
 * - Coordination between repository and presentation layers
 */
export class UserProfileService implements IUserProfileService {
  private readonly logger: Logger;

  constructor(
    private readonly userProfileRepository: IUserProfileRepository,
    private readonly userProfileMapper: UserProfileMapper,
    logger?: Logger
  ) {
    this.logger = logger || Logger.getInstance();
  }

  /**
   * Get user profile by user ID
   */
  async getUserProfile(userId: number, requestId: string): Promise<UserProfileResponseDto> {
    this.logger.info('UserProfileService.getUserProfile initiated', {
      requestId,
      userId,
      operation: 'getUserProfile'
    });

    try {
      // Get profile from repository
      const userProfile = await this.userProfileRepository.findByUserId(userId);

      if (!userProfile) {
        this.logger.warn('User profile not found', {
          requestId,
          userId,
          operation: 'getUserProfile'
        });
        throw new UserNotFoundError('User profile not found');
      }

      // Check if profile is deleted
      if (userProfile.isDeleted) {
        this.logger.warn('Attempted to access deleted profile', {
          requestId,
          userId,
          profileId: userProfile.id
        });
        throw new UserNotFoundError('User profile not found');
      }

      // Transform to response DTO
      const profileResponse = await this.userProfileMapper.toResponseDto(userProfile);

      this.logger.info('User profile retrieved successfully', {
        requestId,
        userId,
        profileId: userProfile.id,
        completionPercentage: profileResponse.profileCompletionPercentage
      });

      return profileResponse;

    } catch (error) {
      this.logger.error('Failed to get user profile', {
        requestId,
        userId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      if (error instanceof UserNotFoundError) {
        throw error;
      }
      throw new InternalServerError('Failed to retrieve user profile');
    }
  }

  /**
   * Update user profile with validation and business rules
   */
  async updateUserProfile(
    userId: number,
    updateData: UpdateUserProfileRequestDto,
    requestId: string
  ): Promise<UserProfileResponseDto> {
    this.logger.info('UserProfileService.updateUserProfile initiated', {
      requestId,
      userId,
      updateFields: Object.keys(updateData),
      operation: 'updateUserProfile'
    });

    try {
      // Get existing profile
      const existingProfile = await this.userProfileRepository.findByUserId(userId);
      if (!existingProfile || existingProfile.isDeleted) {
        throw new UserNotFoundError('User profile not found');
      }

      // Apply business validation rules
      const validatedData = await this.validateAndProcessUpdateData(
        updateData,
        existingProfile,
        requestId
      );

      // Update profile in repository
      const updatedProfile = await this.userProfileRepository.update(
        existingProfile.id,
        validatedData
      );

      // Transform to response DTO
      const profileResponse = await this.userProfileMapper.toResponseDto(updatedProfile);

      this.logger.info('User profile updated successfully', {
        requestId,
        userId,
        profileId: updatedProfile.id,
        updatedFields: Object.keys(validatedData),
        newCompletionPercentage: profileResponse.profileCompletionPercentage
      });

      return profileResponse;

    } catch (error) {
      this.logger.error('Failed to update user profile', {
        requestId,
        userId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      if (error instanceof UserNotFoundError || error instanceof ValidationError) {
        throw error;
      }
      throw new InternalServerError('Failed to update user profile');
    }
  }

  /**
   * Soft delete user profile
   */
  async deleteUserProfile(userId: number, requestId: string): Promise<void> {
    this.logger.info('UserProfileService.deleteUserProfile initiated', {
      requestId,
      userId,
      operation: 'deleteUserProfile'
    });

    try {
      // Get existing profile
      const existingProfile = await this.userProfileRepository.findByUserId(userId);
      if (!existingProfile || existingProfile.isDeleted) {
        throw new UserNotFoundError('User profile not found');
      }

      // Soft delete the profile
      await this.userProfileRepository.softDelete(existingProfile.id);

      this.logger.info('User profile deleted successfully', {
        requestId,
        userId,
        profileId: existingProfile.id
      });

    } catch (error) {
      this.logger.error('Failed to delete user profile', {
        requestId,
        userId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      if (error instanceof UserNotFoundError) {
        throw error;
      }
      throw new InternalServerError('Failed to delete user profile');
    }
  }

  /**
   * Update user's avatar/profile image
   */
  async updateUserAvatar(
    userId: number,
    imageUrl: string,
    requestId: string
  ): Promise<UserProfileResponseDto> {
    this.logger.info('UserProfileService.updateUserAvatar initiated', {
      requestId,
      userId,
      operation: 'updateUserAvatar'
    });

    try {
      // Get existing profile
      const existingProfile = await this.userProfileRepository.findByUserId(userId);
      if (!existingProfile || existingProfile.isDeleted) {
        throw new UserNotFoundError('User profile not found');
      }

      // Validate image URL
      const imageValidation = ValidationUtils.validateImageUrls([imageUrl]);
      if (!imageValidation.isValid) {
        throw new ValidationError(`Invalid image: ${imageValidation.errors.join(', ')}`);
      }

      // Update images array (add new image as primary)
      const currentImages = existingProfile.images || [];
      const updatedImages = [imageUrl, ...currentImages.slice(0, 5)]; // Keep max 6 images

      // Update profile
      const updatedProfile = await this.userProfileRepository.update(
        existingProfile.id,
        { images: updatedImages }
      );

      // Transform to response DTO
      const profileResponse = await this.userProfileMapper.toResponseDto(updatedProfile);

      this.logger.info('User avatar updated successfully', {
        requestId,
        userId,
        profileId: updatedProfile.id,
        totalImages: updatedImages.length
      });

      return profileResponse;

    } catch (error) {
      this.logger.error('Failed to update user avatar', {
        requestId,
        userId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      if (error instanceof UserNotFoundError || error instanceof ValidationError) {
        throw error;
      }
      throw new InternalServerError('Failed to update user avatar');
    }
  }

  /**
   * Get user profile completion statistics
   */
  async getUserProfileStats(userId: number, requestId: string): Promise<UserProfileStatsDto> {
    this.logger.info('UserProfileService.getUserProfileStats initiated', {
      requestId,
      userId,
      operation: 'getUserProfileStats'
    });

    try {
      // Get profile
      const userProfile = await this.userProfileRepository.findByUserId(userId);
      if (!userProfile || userProfile.isDeleted) {
        throw new UserNotFoundError('User profile not found');
      }

      // Calculate profile statistics
      const stats = this.calculateProfileStats(userProfile);

      this.logger.info('User profile stats calculated successfully', {
        requestId,
        userId,
        profileId: userProfile.id,
        completionPercentage: stats.completionPercentage,
        profileStrength: stats.profileStrength
      });

      return stats;

    } catch (error) {
      this.logger.error('Failed to get user profile stats', {
        requestId,
        userId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      if (error instanceof UserNotFoundError) {
        throw error;
      }
      throw new InternalServerError('Failed to retrieve profile statistics');
    }
  }

  /**
   * Check if user profile exists and is active
   */
  async doesUserProfileExist(userId: number, requestId: string): Promise<boolean> {
    try {
      const profile = await this.userProfileRepository.findByUserId(userId);
      return !!(profile && !profile.isDeleted);
    } catch (error) {
      this.logger.error('Failed to check user profile existence', {
        requestId,
        userId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  }

  /**
   * Validate profile data completeness
   */
  async validateProfileCompleteness(userId: number, requestId: string): Promise<{
    isComplete: boolean;
    missingFields: string[];
    completionPercentage: number;
  }> {
    try {
      const profile = await this.userProfileRepository.findByUserId(userId);
      if (!profile) {
        throw new UserNotFoundError('User profile not found');
      }

      return this.calculateCompleteness(profile);
    } catch (error) {
      this.logger.error('Failed to validate profile completeness', {
        requestId,
        userId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw new InternalServerError('Failed to validate profile completeness');
    }
  }

  /**
   * Update user's verification status (admin only)
   */
  async updateVerificationStatus(
    userId: number,
    verificationType: 'email' | 'phone' | 'aadhar',
    status: boolean,
    requestId: string
  ): Promise<UserProfileResponseDto> {
    this.logger.info('UserProfileService.updateVerificationStatus initiated', {
      requestId,
      userId,
      verificationType,
      status,
      operation: 'updateVerificationStatus'
    });

    try {
      const profile = await this.userProfileRepository.findByUserId(userId);
      if (!profile || profile.isDeleted) {
        throw new UserNotFoundError('User profile not found');
      }

      // Prepare update data based on verification type
      const updateData: Partial<DatifyyUsersInformation> = {};
      switch (verificationType) {
        case 'email':
          updateData.isOfficialEmailVerified = status;
          break;
        case 'phone':
          updateData.isPhoneVerified = status;
          break;
        case 'aadhar':
          updateData.isAadharVerified = status;
          break;
      }

      const updatedProfile = await this.userProfileRepository.update(profile.id, updateData);
      const profileResponse = await this.userProfileMapper.toResponseDto(updatedProfile);

      this.logger.info('Verification status updated successfully', {
        requestId,
        userId,
        verificationType,
        status,
        profileId: profile.id
      });

      return profileResponse;

    } catch (error) {
      this.logger.error('Failed to update verification status', {
        requestId,
        userId,
        verificationType,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      if (error instanceof UserNotFoundError) {
        throw error;
      }
      throw new InternalServerError('Failed to update verification status');
    }
  }

  /**
   * Validate and process update data with business rules
   */
  private async validateAndProcessUpdateData(
    updateData: UpdateUserProfileRequestDto,
    existingProfile: DatifyyUsersInformation,
    requestId: string
  ): Promise<Partial<DatifyyUsersInformation>> {
    this.logger.debug('Applying business validation rules', {
      requestId,
      updateFields: Object.keys(updateData)
    });

    const processedData: Partial<DatifyyUsersInformation> = { ...updateData };

    // Validate date of birth and calculate age
    if (updateData.dob) {
      const ageValidation = ValidationUtils.validateAge(updateData.dob);
      if (!ageValidation.isValid) {
        throw new ValidationError(ageValidation.error || 'Invalid age');
      }
    }

    // Validate images if provided
    if (updateData.images) {
      const imageValidation = ValidationUtils.validateImageUrls(updateData.images);
      if (!imageValidation.isValid) {
        throw new ValidationError(`Invalid images: ${imageValidation.errors.join(', ')}`);
      }
    }

    // Business rule: Cannot change email through this endpoint
    if ('officialEmail' in updateData) {
      delete (processedData as any).officialEmail;
      this.logger.warn('Attempted to update email through profile endpoint', {
        requestId,
        userId: existingProfile.userLogin?.id
      });
    }

    return processedData;
  }

  /**
   * Calculate profile completion statistics
   */
  private calculateProfileStats(profile: DatifyyUsersInformation): UserProfileStatsDto {
    const completeness = this.calculateCompleteness(profile);
    
    const verificationStatus = {
      email: profile.isOfficialEmailVerified || false,
      phone: profile.isPhoneVerified || false,
      aadhar: profile.isAadharVerified || false
    };

    const profileStrength = this.determineProfileStrength(completeness.completionPercentage);
    const recommendations = this.generateRecommendations(profile, completeness.missingFields);

    return {
      completionPercentage: completeness.completionPercentage,
      missingFields: completeness.missingFields,
      requiredFields: this.getRequiredFields(),
      optionalFields: this.getOptionalFields(),
      verificationStatus,
      profileStrength,
      recommendations,
      lastUpdated: profile.updatedAt?.toISOString() || new Date().toISOString()
    };
  }

  /**
   * Calculate profile completeness percentage
   */
  private calculateCompleteness(profile: DatifyyUsersInformation): {
    isComplete: boolean;
    missingFields: string[];
    completionPercentage: number;
  } {
    const requiredFields = this.getRequiredFields();
    const optionalFields = this.getOptionalFields();
    const allFields = [...requiredFields, ...optionalFields];

    const missingFields: string[] = [];
    let filledFields = 0;

    for (const field of allFields) {
      const value = (profile as any)[field];
      if (this.isFieldFilled(value)) {
        filledFields++;
      } else {
        missingFields.push(field);
      }
    }

    const completionPercentage = Math.round((filledFields / allFields.length) * 100);
    const isComplete = missingFields.filter(field => requiredFields.includes(field)).length === 0;

    return {
      isComplete,
      missingFields,
      completionPercentage
    };
  }

  /**
   * Check if a field is properly filled
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
   * Determine profile strength based on completion percentage
   */
  private determineProfileStrength(completionPercentage: number): 'weak' | 'moderate' | 'strong' | 'complete' {
    if (completionPercentage >= 95) return 'complete';
    if (completionPercentage >= 80) return 'strong';
    if (completionPercentage >= 60) return 'moderate';
    return 'weak';
  }

  /**
   * Generate personalized recommendations
   */
  private generateRecommendations(profile: DatifyyUsersInformation, missingFields: string[]): string[] {
    const recommendations: string[] = [];

    if (missingFields.includes('images')) {
      recommendations.push('Add profile photos to increase your visibility');
    }
    if (missingFields.includes('bio')) {
      recommendations.push('Write a compelling bio to attract matches');
    }
    if (missingFields.includes('favInterest')) {
      recommendations.push('Add your interests to find compatible matches');
    }
    if (!profile.isOfficialEmailVerified) {
      recommendations.push('Verify your email address for better security');
    }

    return recommendations;
  }

  /**
   * Get list of required fields for profile completion
   */
  private getRequiredFields(): string[] {
    return [
      'firstName',
      'lastName',
      'gender',
      'dob',
      'currentCity',
      'lookingFor'
    ];
  }

  /**
   * Get list of optional fields that enhance profile quality
   */
  private getOptionalFields(): string[] {
    return [
      'bio',
      'images',
      'height',
      'hometown',
      'exercise',
      'educationLevel',
      'drinking',
      'smoking',
      'settleDownInMonths',
      'haveKids',
      'wantsKids',
      'starSign',
      'religion',
      'pronoun',
      'favInterest',
      'causesYouSupport',
      'qualityYouValue'
    ];
  }
}