/**
 * Partner Preferences Service Interface
 * 
 * Following established codebase patterns:
 * ✅ Clean interface segregation principle
 * ✅ Proper abstraction for business logic
 * ✅ Comprehensive error type definitions
 * ✅ Request tracking support
 * ✅ Testable contract definitions
 * 
 * @author Staff Engineer - Dating Platform Team
 * @version 1.0.0
 */

import { UpdatePartnerPreferencesRequestDto } from '../dtos/PartnerPreferencesDtos';
import { 
  PartnerPreferencesResponseDto,
  CompatibilityResultDto,
  PreferencesAnalyticsDto 
} from '../dtos/PartnerPreferencesResponseDtos';

/**
 * Partner Preferences Service Interface
 * 
 * Defines the contract for partner preferences business logic operations.
 * This interface ensures loose coupling between controller and service layers
 * and enables easy testing with mock implementations.
 */
export interface IPartnerPreferencesService {
  /**
   * Get user's partner preferences by user ID
   * 
   * @param userId - Authenticated user's ID
   * @param requestId - Request tracking ID for logging
   * @returns Promise<PartnerPreferencesResponseDto | null> - User preferences or null if not set
   * @throws UserNotFoundError - If user doesn't exist
   * @throws InternalServerError - If database operation fails
   */
  getPartnerPreferences(
    userId: number, 
    requestId: string
  ): Promise<PartnerPreferencesResponseDto | null>;

  /**
   * Update or create user's partner preferences
   * 
   * @param userId - Authenticated user's ID
   * @param updateData - Validated preferences update data
   * @param requestId - Request tracking ID for logging
   * @returns Promise<PartnerPreferencesResponseDto> - Updated/created preferences
   * @throws UserNotFoundError - If user doesn't exist
   * @throws ValidationError - If preferences data is invalid
   * @throws InternalServerError - If database operation fails
   */
  updatePartnerPreferences(
    userId: number,
    updateData: UpdatePartnerPreferencesRequestDto,
    requestId: string
  ): Promise<PartnerPreferencesResponseDto>;

  /**
   * Delete user's partner preferences (soft delete)
   * 
   * @param userId - Authenticated user's ID
   * @param requestId - Request tracking ID for logging
   * @returns Promise<void>
   * @throws UserNotFoundError - If user doesn't exist
   * @throws PreferencesNotFoundError - If preferences don't exist
   * @throws InternalServerError - If database operation fails
   */
  deletePartnerPreferences(
    userId: number, 
    requestId: string
  ): Promise<void>;

  /**
   * Calculate compatibility score between two users
   * 
   * @param userId - Current user's ID
   * @param targetUserId - Target user's ID for compatibility check
   * @param requestId - Request tracking ID for logging
   * @returns Promise<CompatibilityResultDto> - Detailed compatibility analysis
   * @throws UserNotFoundError - If either user doesn't exist
   * @throws PreferencesNotFoundError - If preferences missing for either user
   * @throws InternalServerError - If calculation fails
   */
  calculateCompatibility(
    userId: number,
    targetUserId: number,
    requestId: string
  ): Promise<CompatibilityResultDto>;

  /**
   * Get matching recommendations based on user's preferences
   * 
   * @param userId - User ID to get recommendations for
   * @param limit - Maximum number of recommendations (default: 20)
   * @param requestId - Request tracking ID for logging
   * @returns Promise<UserRecommendationDto[]> - Array of recommended users
   * @throws UserNotFoundError - If user doesn't exist
   * @throws PreferencesNotFoundError - If user hasn't set preferences
   * @throws InternalServerError - If recommendation engine fails
   */
  getMatchingRecommendations(
    userId: number,
    limit: number,
    requestId: string
  ): Promise<UserRecommendationDto[]>;

  /**
   * Validate preferences completeness and provide suggestions
   * 
   * @param userId - User ID to validate preferences for
   * @param requestId - Request tracking ID for logging
   * @returns Promise<PreferencesValidationDto> - Validation results and suggestions
   * @throws UserNotFoundError - If user doesn't exist
   * @throws InternalServerError - If validation fails
   */
  validatePreferencesCompleteness(
    userId: number,
    requestId: string
  ): Promise<PreferencesValidationDto>;

  /**
   * Get preferences analytics for admin/insights
   * 
   * @param requestId - Request tracking ID for logging
   * @returns Promise<PreferencesAnalyticsDto> - Aggregated preferences data
   * @throws InternalServerError - If analytics calculation fails
   * @requires Admin permissions
   */
  getPreferencesAnalytics(requestId: string): Promise<PreferencesAnalyticsDto>;

  /**
   * Update preferences based on user behavior (ML-driven)
   * 
   * @param userId - User ID to update preferences for
   * @param behaviorData - User interaction and behavior data
   * @param requestId - Request tracking ID for logging
   * @returns Promise<PartnerPreferencesResponseDto> - Updated preferences
   * @throws UserNotFoundError - If user doesn't exist
   * @throws InternalServerError - If ML processing fails
   * @internal This method is used by recommendation engine
   */
  updatePreferencesFromBehavior(
    userId: number,
    behaviorData: UserBehaviorData,
    requestId: string
  ): Promise<PartnerPreferencesResponseDto>;
}

/**
 * User Recommendation DTO for matching
 */
export interface UserRecommendationDto {
  userId: number;
  profileId: string;
  firstName: string;
  lastName: string;
  age: number;
  city: string;
  images: string[];
  compatibilityScore: number;
  matchingReasons: string[];
  mutualInterests: string[];
  distance?: number; // in kilometers
  isOnline: boolean;
  lastActive: string;
}

/**
 * Preferences Validation DTO
 */
export interface PreferencesValidationDto {
  isComplete: boolean;
  completionPercentage: number;
  missingFields: string[];
  criticalMissingFields: string[];
  suggestions: {
    field: string;
    reason: string;
    priority: 'high' | 'medium' | 'low';
    impactOnMatching: string;
  }[];
  estimatedMatchIncrease: number; // percentage increase in potential matches
}

/**
 * User Behavior Data for ML-driven preferences
 */
export interface UserBehaviorData {
  viewedProfiles: number[];
  likedProfiles: number[];
  passedProfiles: number[];
  messagesExchanged: number[];
  datesCompleted: number[];
  reportedProfiles: number[];
  preferenceAdjustments: {
    field: string;
    oldValue: any;
    newValue: any;
    timestamp: Date;
  }[];
}

/**
 * Service Error Types for specific business logic errors
 */
export class PartnerPreferencesError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number,
    public readonly context?: Record<string, any>
  ) {
    super(message);
    this.name = 'PartnerPreferencesError';
  }
}

export class PreferencesNotFoundError extends PartnerPreferencesError {
  constructor(userId: number) {
    super(
      'Partner preferences not found for user',
      'PREFERENCES_NOT_FOUND',
      404,
      { userId }
    );
  }
}

export class InvalidPreferencesError extends PartnerPreferencesError {
  constructor(field: string, reason: string) {
    super(
      `Invalid preference value for ${field}: ${reason}`,
      'INVALID_PREFERENCES',
      400,
      { field, reason }
    );
  }
}

export class CompatibilityCalculationError extends PartnerPreferencesError {
  constructor(userId: number, targetUserId: number, reason: string) {
    super(
      'Failed to calculate compatibility between users',
      'COMPATIBILITY_CALCULATION_FAILED',
      500,
      { userId, targetUserId, reason }
    );
  }
}

export class InsufficientDataError extends PartnerPreferencesError {
  constructor(operation: string, missingData: string) {
    super(
      `Insufficient data for ${operation}: ${missingData}`,
      'INSUFFICIENT_DATA',
      400,
      { operation, missingData }
    );
  }
}

/**
 * Service Configuration Interface
 */
export interface PartnerPreferencesServiceConfig {
  // Matching algorithm weights
  matching: {
    ageWeight: number;
    locationWeight: number;
    educationWeight: number;
    religionWeight: number;
    lifestyleWeight: number;
    interestsWeight: number;
  };
  
  // Recommendation limits
  recommendations: {
    maxDaily: number;
    maxDistance: number; // kilometers
    minCompatibilityScore: number;
  };
  
  // Caching configuration
  cache: {
    preferencesExpiry: number; // seconds
    recommendationsExpiry: number; // seconds
    compatibilityExpiry: number; // seconds
  };
  
  // Machine Learning configuration
  ml: {
    enableBehaviorLearning: boolean;
    minimumInteractionsForLearning: number;
    learningRateDecay: number;
  };
}

/**
 * Advanced Service Interface for Admin Operations
 */
export interface IAdvancedPartnerPreferencesService extends IPartnerPreferencesService {
  /**
   * Bulk update preferences for multiple users (admin operation)
   */
  bulkUpdatePreferences(
    updates: BulkPreferencesUpdate[],
    requestId: string
  ): Promise<BulkUpdateResult>;

  /**
   * Analyze preference trends for business insights
   */
  analyzePreferenceTrends(
    timeframe: 'week' | 'month' | 'quarter',
    requestId: string
  ): Promise<PreferenceTrendsDto>;

  /**
   * Export user preferences for data science (anonymized)
   */
  exportPreferencesForAnalysis(
    filters: PreferencesExportFilters,
    requestId: string
  ): Promise<string>; // Returns export job ID
}

/**
 * Supporting Types for Advanced Operations
 */
export interface BulkPreferencesUpdate {
  userId: number;
  preferences: Partial<UpdatePartnerPreferencesRequestDto>;
  reason: string;
}

export interface BulkUpdateResult {
  totalRequested: number;
  successful: number;
  failed: number;
  errors: { userId: number; error: string }[];
}

export interface PreferenceTrendsDto {
  timeframe: string;
  totalUsers: number;
  trends: {
    field: string;
    popularValues: { value: any; count: number; percentage: number }[];
    changeFromPrevious: number; // percentage change
  }[];
}

export interface PreferencesExportFilters {
  ageRange?: [number, number];
  genders?: string[];
  cities?: string[];
  registrationDate?: [Date, Date];
  includeInactive?: boolean;
}