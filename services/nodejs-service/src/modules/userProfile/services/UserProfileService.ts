// src/modules/userProfile/services/UserProfileService.ts

import { Logger } from '../../../infrastructure/logging/Logger';
import { IUserProfileService } from './IUserProfileService';
import { IUserProfileRepository } from '../repositories/IUserProfileRepository';
import { UserProfileMapper } from '../mapper/UserProfileMapper';
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
  WeakPasswordError,
  InvalidEmailError,
  InternalServerError
} from '../../../domain/errors/AuthErrors';
import { DatifyyUsersInformation } from '../../../models/entities/DatifyyUsersInformation';

/**
 * User Profile Service Implementation
 * 
 * Following the same patterns as your AuthController business logic:
 * ✅ Comprehensive error handling with specific error types
 * ✅ Detailed logging with request tracking
 * ✅ Business rule validation
 * ✅ Data transformation and sanitization
 * ✅ Performance monitoring
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
   * Follows the same pattern as AuthController's user lookup
   */
  async getUserProfile(userId: number, requestId: string): Promise<UserProfileResponseDto> {
    this.logger.info('UserProfileService.getUserProfile initiated', {
      requestId,
      userId,
      operation: 'getUserProfile',
      timestamp: new Date().toISOString()
    });

    try {
      // Get profile from repository (similar to AuthController's findUserByEmail)
      const userProfile = await this.userProfileRepository.findByUserId(userId);

      if (!userProfile) {
        this.logger.warn('User profile not found', {
          requestId,
          userId,
          operation: 'getUserProfile'
        });
        throw new UserNotFoundError('User profile not found');
      }

      // Check if profile is deleted (business rule validation)
      if (userProfile.isDeleted) {
        this.logger.warn('Attempted to access deleted profile', {
          requestId,
          userId,
          profileId: userProfile.id,
          operation: 'getUserProfile'
        });
        throw new UserNotFoundError('User profile not found');
      }

      // Transform to response DTO (following your mapper patterns)
      const profileResponse = await this.userProfileMapper.toResponseDto(userProfile);

      this.logger.info('User profile retrieved successfully', {
        requestId,
        userId,
        profileId: userProfile.id,
        completionPercentage: profileResponse.profileCompletionPercentage,
        lastUpdated: profileResponse.lastUpdated,
        operation: 'getUserProfile'
      });

      return profileResponse;

    } catch (error) {
      this.logger.error('Failed to get user profile', {
        requestId,
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        operation: 'getUserProfile'
      });

      // Re-throw known errors, wrap unknown errors (AuthController pattern)
      if (error instanceof UserNotFoundError) {
        throw error;
      }
      throw new InternalServerError('Failed to retrieve user profile');
    }
  }

  /**
   * Update user profile with validation and business rules
   * Follows AuthController's comprehensive validation approach
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
      updateFieldCount: Object.keys(updateData).length,
      operation: 'updateUserProfile',
      timestamp: new Date().toISOString()
    });

    try {
      // Get existing profile (similar to AuthController's user validation)
      const existingProfile = await this.userProfileRepository.findByUserId(userId);
      if (!existingProfile || existingProfile.isDeleted) {
        this.logger.warn('Profile not found for update', {
          requestId,
          userId,
          operation: 'updateUserProfile'
        });
        throw new UserNotFoundError('User profile not found');
      }

      // Apply business validation rules (following AuthController's validation pattern)
      const validatedData = await this.validateAndProcessUpdateData(
        updateData,
        existingProfile,
        requestId
      );

      this.logger.debug('Update data validated successfully', {
        requestId,
        userId,
        originalFieldCount: Object.keys(updateData).length,
        validatedFieldCount: Object.keys(validatedData).length,
        operation: 'updateUserProfile'
      });

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
        previousCompletion: 'N/A', // Could calculate if needed
        newCompletionPercentage: profileResponse.profileCompletionPercentage,
        operation: 'updateUserProfile',
        timestamp: new Date().toISOString()
      });

      return profileResponse;

    } catch (error) {
      this.logger.error('Failed to update user profile', {
        requestId,
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
        updateFields: Object.keys(updateData),
        stack: error instanceof Error ? error.stack : undefined,
        operation: 'updateUserProfile'
      });

      // Re-throw known errors (AuthController pattern)
      if (error instanceof UserNotFoundError || 
          error instanceof WeakPasswordError || 
          error instanceof InvalidEmailError) {
        throw error;
      }
      throw new InternalServerError('Failed to update user profile');
    }
  }

  /**
   * Soft delete user profile
   * Follows AuthController's safe deletion approach
   */
  async deleteUserProfile(userId: number, requestId: string): Promise<void> {
    this.logger.warn('UserProfileService.deleteUserProfile initiated', {
      requestId,
      userId,
      operation: 'deleteUserProfile',
      deletionType: 'SOFT_DELETE',
      timestamp: new Date().toISOString()
    });

    try {
      // Get existing profile
      const existingProfile = await this.userProfileRepository.findByUserId(userId);
      if (!existingProfile || existingProfile.isDeleted) {
        this.logger.warn('Profile not found for deletion', {
          requestId,
          userId,
          operation: 'deleteUserProfile'
        });
        throw new UserNotFoundError('User profile not found');
      }

      this.logger.info('Profile found, proceeding with soft deletion', {
        requestId,
        userId,
        profileId: existingProfile.id,
        profileEmail: existingProfile.officialEmail,
        operation: 'deleteUserProfile'
      });

      // Soft delete the profile (following your existing soft delete patterns)
      await this.userProfileRepository.softDelete(existingProfile.id);

      this.logger.warn('User profile soft deleted successfully', {
        requestId,
        userId,
        profileId: existingProfile.id,
        profileEmail: existingProfile.officialEmail,
        operation: 'deleteUserProfile',
        deletionType: 'SOFT_DELETE_COMPLETED',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      this.logger.error('Failed to delete user profile', {
        requestId,
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        operation: 'deleteUserProfile'
      });

      if (error instanceof UserNotFoundError) {
        throw error;
      }
      throw new InternalServerError('Failed to delete user profile');
    }
  }

  /**
   * Update user's avatar/profile image
   * Follows AuthController's image handling approach
   */
  async updateUserAvatar(
    userId: number,
    imageUrl: string,
    requestId: string
  ): Promise<UserProfileResponseDto> {
    this.logger.info('UserProfileService.updateUserAvatar initiated', {
      requestId,
      userId,
      hasImageUrl: !!imageUrl,
      operation: 'updateUserAvatar',
      timestamp: new Date().toISOString()
    });

    try {
      // Get existing profile
      const existingProfile = await this.userProfileRepository.findByUserId(userId);
      if (!existingProfile || existingProfile.isDeleted) {
        throw new UserNotFoundError('User profile not found');
      }

      // Validate image URL (following AuthController's validation patterns)
      const imageValidation = ValidationUtils.validateImageUrls([imageUrl]);
      if (!imageValidation.isValid) {
        this.logger.warn('Invalid image URL provided', {
          requestId,
          userId,
          imageUrl: imageUrl.substring(0, 50) + '...', // Log partial URL for privacy
          validationErrors: imageValidation.errors,
          operation: 'updateUserAvatar'
        });
        throw new InvalidEmailError(`Invalid image: ${imageValidation.errors.join(', ')}`);
      }

      // Update images array (business logic: add new image as primary)
      const currentImages = existingProfile.images || [];
      const updatedImages = [imageUrl, ...currentImages.slice(0, 5)]; // Keep max 6 images

      this.logger.debug('Avatar update prepared', {
        requestId,
        userId,
        currentImageCount: currentImages.length,
        newImageCount: updatedImages.length,
        operation: 'updateUserAvatar'
      });

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
        totalImages: updatedImages.length,
        newCompletionPercentage: profileResponse.profileCompletionPercentage,
        operation: 'updateUserAvatar',
        timestamp: new Date().toISOString()
      });

      return profileResponse;

    } catch (error) {
      this.logger.error('Failed to update user avatar', {
        requestId,
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
        imageUrlProvided: !!imageUrl,
        stack: error instanceof Error ? error.stack : undefined,
        operation: 'updateUserAvatar'
      });

      if (error instanceof UserNotFoundError || error instanceof InvalidEmailError) {
        throw error;
      }
      throw new InternalServerError('Failed to update user avatar');
    }
  }

  /**
   * Get user profile completion statistics
   * Follows AuthController's analytics approach
   */
  async getUserProfileStats(userId: number, requestId: string): Promise<UserProfileStatsDto> {
    this.logger.info('UserProfileService.getUserProfileStats initiated', {
      requestId,
      userId,
      operation: 'getUserProfileStats',
      timestamp: new Date().toISOString()
    });

    try {
      // Get profile
      const userProfile = await this.userProfileRepository.findByUserId(userId);
      if (!userProfile || userProfile.isDeleted) {
        throw new UserNotFoundError('User profile not found');
      }

      // Calculate profile statistics using mapper
      const stats = this.userProfileMapper.toProfileStatsDto(userProfile);

      this.logger.info('User profile stats calculated successfully', {
        requestId,
        userId,
        profileId: userProfile.id,
        completionPercentage: stats.completionPercentage,
        profileStrength: stats.profileStrength,
        missingFieldsCount: stats.missingFields.length,
        verificationCount: Object.values(stats.verificationStatus).filter(Boolean).length,
        operation: 'getUserProfileStats',
        timestamp: new Date().toISOString()
      });

      return stats;

    } catch (error) {
      this.logger.error('Failed to get user profile stats', {
        requestId,
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        operation: 'getUserProfileStats'
      });

      if (error instanceof UserNotFoundError) {
        throw error;
      }
      throw new InternalServerError('Failed to retrieve profile statistics');
    }
  }

  /**
   * Check if user profile exists and is active
   * Helper method for other services
   */
  async doesUserProfileExist(userId: number, requestId: string): Promise<boolean> {
    try {
      this.logger.debug('Checking user profile existence', {
        requestId,
        userId,
        operation: 'doesUserProfileExist'
      });

      const profile = await this.userProfileRepository.findByUserId(userId);
      const exists = !!(profile && !profile.isDeleted);

      this.logger.debug('User profile existence check completed', {
        requestId,
        userId,
        exists,
        operation: 'doesUserProfileExist'
      });

      return exists;
    } catch (error) {
      this.logger.error('Failed to check user profile existence', {
        requestId,
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
        operation: 'doesUserProfileExist'
      });
      return false;
    }
  }

  /**
   * Validate profile data completeness
   * Business logic for profile completion analysis
   */
  async validateProfileCompleteness(userId: number, requestId: string): Promise<{
    isComplete: boolean;
    missingFields: string[];
    completionPercentage: number;
  }> {
    try {
      this.logger.debug('Validating profile completeness', {
        requestId,
        userId,
        operation: 'validateProfileCompleteness'
      });

      const profile = await this.userProfileRepository.findByUserId(userId);
      if (!profile) {
        throw new UserNotFoundError('User profile not found');
      }

      const completeness = this.calculateProfileCompleteness(profile);

      this.logger.debug('Profile completeness validation completed', {
        requestId,
        userId,
        isComplete: completeness.isComplete,
        completionPercentage: completeness.completionPercentage,
        missingFieldsCount: completeness.missingFields.length,
        operation: 'validateProfileCompleteness'
      });

      return completeness;
    } catch (error) {
      this.logger.error('Failed to validate profile completeness', {
        requestId,
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
        operation: 'validateProfileCompleteness'
      });
      throw new InternalServerError('Failed to validate profile completeness');
    }
  }

  /**
   * Update user's verification status (admin only)
   * Follows AuthController's admin operation patterns
   */
  async updateVerificationStatus(
    userId: number,
    verificationType: 'email' | 'phone' | 'aadhar',
    status: boolean,
    requestId: string
  ): Promise<UserProfileResponseDto> {
    this.logger.warn('UserProfileService.updateVerificationStatus initiated', {
      requestId,
      userId,
      verificationType,
      status,
      operation: 'updateVerificationStatus',
      adminOperation: true,
      timestamp: new Date().toISOString()
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

      this.logger.warn('Verification status updated successfully', {
        requestId,
        userId,
        verificationType,
        status,
        profileId: profile.id,
        operation: 'updateVerificationStatus',
        adminOperation: true,
        timestamp: new Date().toISOString()
      });

      return profileResponse;

    } catch (error) {
      this.logger.error('Failed to update verification status', {
        requestId,
        userId,
        verificationType,
        error: error instanceof Error ? error.message : 'Unknown error',
        operation: 'updateVerificationStatus',
        adminOperation: true
      });

      if (error instanceof UserNotFoundError) {
        throw error;
      }
      throw new InternalServerError('Failed to update verification status');
    }
  }

  // ============================================================================
  // PRIVATE HELPER METHODS (Following AuthController's helper pattern)
  // ============================================================================

  /**
   * Validate and process update data with business rules
   * Follows AuthController's comprehensive validation approach
   */
  private async validateAndProcessUpdateData(
    updateData: UpdateUserProfileRequestDto,
    existingProfile: DatifyyUsersInformation,
    requestId: string
  ): Promise<Partial<DatifyyUsersInformation>> {
    this.logger.debug('Applying business validation rules', {
      requestId,
      updateFields: Object.keys(updateData),
      operation: 'validateAndProcessUpdateData'
    });

    // Use mapper to transform DTO to entity update data
    const processedData = this.userProfileMapper.fromUpdateRequestDto(updateData);

    // Additional business rule validations (following AuthController patterns)
    if (updateData.dob) {
      const ageValidation = ValidationUtils.validateAge(updateData.dob);
      if (!ageValidation.isValid) {
        this.logger.warn('Invalid age provided in update', {
          requestId,
          userId: existingProfile.userLogin?.id,
          dobProvided: !!updateData.dob,
          validationError: ageValidation.error,
          operation: 'validateAndProcessUpdateData'
        });
        throw new InvalidEmailError(ageValidation.error || 'Invalid age');
      }
    }

    // Validate images if provided
    if (updateData.images && updateData.images.length > 0) {
      const imageValidation = ValidationUtils.validateImageUrls(updateData.images);
      if (!imageValidation.isValid) {
        this.logger.warn('Invalid images provided in update', {
          requestId,
          userId: existingProfile.userLogin?.id,
          imageCount: updateData.images.length,
          validationErrors: imageValidation.errors,
          operation: 'validateAndProcessUpdateData'
        });
        throw new InvalidEmailError(`Invalid images: ${imageValidation.errors.join(', ')}`);
      }
    }

    // Business rule: Cannot change email through this endpoint
    if ('officialEmail' in updateData) {
      delete (processedData as any).officialEmail;
      this.logger.warn('Attempted to update email through profile endpoint', {
        requestId,
        userId: existingProfile.userLogin?.id,
        operation: 'validateAndProcessUpdateData'
      });
    }

    this.logger.debug('Business validation completed successfully', {
      requestId,
      originalFieldCount: Object.keys(updateData).length,
      processedFieldCount: Object.keys(processedData).length,
      operation: 'validateAndProcessUpdateData'
    });

    return processedData;
  }

  /**
   * Calculate profile completeness percentage
   * Following your existing completion calculation patterns
   */
  private calculateProfileCompleteness(profile: DatifyyUsersInformation): {
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
   * Reusable validation logic
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
   * Get list of required fields for profile completion
   * Business rules configuration
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
   * Business rules configuration
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