// src/modules/userProfile/services/IUserProfileService.ts

import { UpdateUserProfileRequestDto } from '../dtos/UserProfileDtos';

/**
 * User Profile Service Interface
 * 
 * Defines the contract for user profile business logic operations.
 * This interface ensures loose coupling between controller and service layers.
 */
export interface IUserProfileService {
  /**
   * Get user profile by user ID
   * 
   * @param userId - Authenticated user's ID
   * @param requestId - Request tracking ID
   * @returns Promise<UserProfileResponseDto> - User profile data
   * @throws UserNotFoundError - If user profile doesn't exist
   * @throws InternalServerError - If database operation fails
   */
  getUserProfile(userId: number, requestId: string): Promise<UserProfileResponseDto>;

  /**
   * Update user profile with provided data
   * 
   * @param userId - Authenticated user's ID
   * @param updateData - Validated profile update data
   * @param requestId - Request tracking ID
   * @returns Promise<UserProfileResponseDto> - Updated profile data
   * @throws UserNotFoundError - If user profile doesn't exist
   * @throws ValidationError - If update data is invalid
   * @throws InternalServerError - If database operation fails
   */
  updateUserProfile(
    userId: number, 
    updateData: UpdateUserProfileRequestDto, 
    requestId: string
  ): Promise<UserProfileResponseDto>;

  /**
   * Soft delete user profile
   * 
   * @param userId - Authenticated user's ID
   * @param requestId - Request tracking ID
   * @returns Promise<void>
   * @throws UserNotFoundError - If user profile doesn't exist
   * @throws InternalServerError - If database operation fails
   */
  deleteUserProfile(userId: number, requestId: string): Promise<void>;

  /**
   * Update user's avatar/profile image
   * 
   * @param userId - Authenticated user's ID
   * @param imageUrl - New profile image URL
   * @param requestId - Request tracking ID
   * @returns Promise<UserProfileResponseDto> - Updated profile with new image
   * @throws UserNotFoundError - If user profile doesn't exist
   * @throws ValidationError - If image URL is invalid
   * @throws InternalServerError - If database operation fails
   */
  updateUserAvatar(
    userId: number, 
    imageUrl: string, 
    requestId: string
  ): Promise<UserProfileResponseDto>;

  /**
   * Get user profile completion statistics
   * 
   * @param userId - Authenticated user's ID
   * @param requestId - Request tracking ID
   * @returns Promise<UserProfileStatsDto> - Profile completion stats
   * @throws UserNotFoundError - If user profile doesn't exist
   * @throws InternalServerError - If database operation fails
   */
  getUserProfileStats(userId: number, requestId: string): Promise<UserProfileStatsDto>;

  /**
   * Check if user profile exists and is active
   * 
   * @param userId - User ID to check
   * @param requestId - Request tracking ID
   * @returns Promise<boolean> - True if profile exists and is active
   */
  doesUserProfileExist(userId: number, requestId: string): Promise<boolean>;

  /**
   * Validate profile data completeness
   * 
   * @param userId - User ID to validate
   * @param requestId - Request tracking ID
   * @returns Promise<{ isComplete: boolean; missingFields: string[] }>
   */
  validateProfileCompleteness(
    userId: number, 
    requestId: string
  ): Promise<{
    isComplete: boolean;
    missingFields: string[];
    completionPercentage: number;
  }>;

  /**
   * Update user's verification status (admin only)
   * 
   * @param userId - Target user's ID
   * @param verificationType - Type of verification (email, phone, aadhar)
   * @param status - Verification status
   * @param requestId - Request tracking ID
   * @returns Promise<UserProfileResponseDto> - Updated profile
   */
  updateVerificationStatus(
    userId: number,
    verificationType: 'email' | 'phone' | 'aadhar',
    status: boolean,
    requestId: string
  ): Promise<UserProfileResponseDto>;
}

// src/modules/userProfile/dtos/UserProfileResponseDtos.ts

/**
 * User Profile Response DTO
 * Represents the sanitized user profile data returned to clients
 */
export interface UserProfileResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string | null;
  bio: string | null;
  images: string[] | null;
  dob: string | null;
  age?: number; // Calculated field
  isOfficialEmailVerified: boolean | null;
  isAadharVerified: boolean | null;
  isPhoneVerified: boolean | null;
  height: number | null;
  currentCity: string | null;
  hometown: string | null;
  exercise: string | null;
  educationLevel: string | null;
  drinking: string | null;
  smoking: string | null;
  lookingFor: string | null;
  settleDownInMonths: string | null;
  haveKids: boolean | null;
  wantsKids: boolean | null;
  starSign: string | null;
  religion: string | null;
  pronoun: string | null;
  favInterest: string[] | null;
  causesYouSupport: string[] | null;
  qualityYouValue: string[] | null;
  prompts: object[] | null;
  education: object[] | null;
  // Metadata
  profileCompletionPercentage: number;
  lastUpdated: string;
  createdAt: string;
}

/**
 * User Profile Statistics DTO
 * Represents profile completion and engagement stats
 */
export interface UserProfileStatsDto {
  completionPercentage: number;
  missingFields: string[];
  requiredFields: string[];
  optionalFields: string[];
  verificationStatus: {
    email: boolean;
    phone: boolean;
    aadhar: boolean;
  };
  profileStrength: 'weak' | 'moderate' | 'strong' | 'complete';
  recommendations: string[];
  lastUpdated: string;
}

/**
 * Profile Completeness Response
 */
export interface ProfileCompletenessDto {
  isComplete: boolean;
  completionPercentage: number;
  missingFields: string[];
  criticalMissingFields: string[];
  recommendations: {
    field: string;
    reason: string;
    priority: 'high' | 'medium' | 'low';
  }[];
}

/**
 * User Profile Summary DTO
 * Lightweight profile data for listings/cards
 */
export interface UserProfileSummaryDto {
  id: string;
  firstName: string;
  lastName: string;
  age: number | null;
  currentCity: string | null;
  images: string[] | null;
  bio: string | null;
  lookingFor: string | null;
  isVerified: boolean;
  profileCompletionPercentage: number;
}