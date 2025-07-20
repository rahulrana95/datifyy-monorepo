/**
 * Partner Preferences Service Implementation - Core Business Logic Layer
 * 
 * Following established codebase patterns from UserProfileService:
 * ✅ Comprehensive error handling with specific error types
 * ✅ Detailed logging with request tracking
 * ✅ Business rule validation and processing
 * ✅ Small, focused, testable methods
 * ✅ Proper abstraction and separation of concerns
 * ✅ Performance monitoring and optimization
 * ✅ ML-ready compatibility algorithms
 * 
 * @author Staff Engineer - Dating Platform Team
 * @version 1.0.0
 */

import { Logger } from '../../../infrastructure/logging/Logger';
import { IPartnerPreferencesService, UserRecommendationDto, PreferencesValidationDto } from './IPartnerPreferencesService';
import { IPartnerPreferencesRepository } from '../repositories/IPartnerPreferencesRepository';
import { IUserProfileRepository } from '../../userProfile/repositories/IUserProfileRepository';
import { PartnerPreferencesMapper } from '../mappers/PartnerPreferencesMapper';
import { UpdatePartnerPreferencesRequestDto } from '../dtos/PartnerPreferencesDtos';
import { 
  PartnerPreferencesResponseDto,
  CompatibilityResultDto,
  PreferencesAnalyticsDto,
  CompatibilityCategoryDto,
  MatchStrengthDto,
  MatchConcernDto
} from '../dtos/PartnerPreferencesResponseDtos';
import {
  UserNotFoundError,
  InternalServerError,
  InvalidEmailError
} from '../../../domain/errors/AuthErrors';
import {
  PreferencesNotFoundError,
  InvalidPreferencesError,
  CompatibilityCalculationError,
  InsufficientDataError
} from './IPartnerPreferencesService';
import { DatifyyUserPartnerPreferences } from '../../../models/entities/DatifyyUserPartnerPreferences';
import { DatifyyUsersInformation } from '../../../models/entities/DatifyyUsersInformation';

/**
 * Partner Preferences Service Implementation
 * 
 * Following the exact patterns from UserProfileService:
 * - Comprehensive logging with request tracking
 * - Business rule validation
 * - Error handling with specific error types
 * - Performance monitoring
 * - Clean separation of concerns
 */
export class PartnerPreferencesService implements IPartnerPreferencesService {
  private readonly logger: Logger;

  constructor(
    private readonly partnerPreferencesRepository: IPartnerPreferencesRepository,
    private readonly userProfileRepository: IUserProfileRepository,
    private readonly partnerPreferencesMapper: PartnerPreferencesMapper,
    logger?: Logger
  ) {
    this.logger = logger || Logger.getInstance();
  }

  /**
   * Get user's partner preferences by user ID
   * Following UserProfileService.getUserProfile patterns
   */
  async getPartnerPreferences(
    userId: number, 
    requestId: string
  ): Promise<PartnerPreferencesResponseDto | null> {
    this.logger.info('PartnerPreferencesService.getPartnerPreferences initiated', {
      requestId,
      userId,
      operation: 'getPartnerPreferences',
      timestamp: new Date().toISOString()
    });

    try {
      // Validate user exists (following UserProfileService pattern)
      const userProfile = await this.userProfileRepository.findByUserId(userId);
      if (!userProfile || userProfile.isDeleted) {
        this.logger.warn('User profile not found for preferences lookup', {
          requestId,
          userId,
          operation: 'getPartnerPreferences'
        });
        throw new UserNotFoundError('User profile not found');
      }

      // Get preferences from repository
      const preferences = await this.partnerPreferencesRepository.findByUserId(userId);

      if (!preferences) {
        this.logger.info('No partner preferences found for user', {
          requestId,
          userId,
          operation: 'getPartnerPreferences',
          hasPreferences: false
        });
        return null;
      }

      // Transform to response DTO using mapper
      const preferencesResponse = await this.partnerPreferencesMapper.toResponseDto(
        preferences, 
        userProfile
      );

      // Calculate additional insights
      const estimatedMatches = await this.calculateEstimatedMatches(preferences, requestId);
      preferencesResponse.estimatedMatches = estimatedMatches;

      this.logger.info('Partner preferences retrieved successfully', {
        requestId,
        userId,
        preferencesId: preferences.id,
        completionPercentage: preferencesResponse.completionPercentage,
        estimatedMatches,
        matchingScore: preferencesResponse.matchingScore,
        operation: 'getPartnerPreferences'
      });

      return preferencesResponse;

    } catch (error) {
      this.logger.error('Failed to get partner preferences', {
        requestId,
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        operation: 'getPartnerPreferences'
      });

      // Re-throw known errors, wrap unknown errors (following established pattern)
      if (error instanceof UserNotFoundError) {
        throw error;
      }
      throw new InternalServerError('Failed to retrieve partner preferences');
    }
  }

  /**
   * Update or create user's partner preferences
   * Following UserProfileService.updateUserProfile patterns
   */
  async updatePartnerPreferences(
    userId: number,
    updateData: UpdatePartnerPreferencesRequestDto,
    requestId: string
  ): Promise<PartnerPreferencesResponseDto> {
    this.logger.info('PartnerPreferencesService.updatePartnerPreferences initiated', {
      requestId,
      userId,
      updateFields: Object.keys(updateData),
      updateFieldCount: Object.keys(updateData).length,
      operation: 'updatePartnerPreferences',
      timestamp: new Date().toISOString()
    });

    try {
      // Validate user exists
      const userProfile = await this.userProfileRepository.findByUserId(userId);
      if (!userProfile || userProfile.isDeleted) {
        this.logger.warn('User profile not found for preferences update', {
          requestId,
          userId,
          operation: 'updatePartnerPreferences'
        });
        throw new UserNotFoundError('User profile not found');
      }

      // Get existing preferences or prepare for creation
      let existingPreferences = await this.partnerPreferencesRepository.findByUserId(userId);
      const isNewPreferences = !existingPreferences;

      // Apply business validation rules (following established pattern)
      const validatedData = await this.validateAndProcessUpdateData(
        updateData,
        existingPreferences,
        userProfile,
        requestId
      );

      this.logger.debug('Preferences update data validated successfully', {
        requestId,
        userId,
        originalFieldCount: Object.keys(updateData).length,
        validatedFieldCount: Object.keys(validatedData).length,
        isNewPreferences,
        operation: 'updatePartnerPreferences'
      });

      // Update or create preferences
      let updatedPreferences: DatifyyUserPartnerPreferences;
      
      if (existingPreferences) {
        updatedPreferences = await this.partnerPreferencesRepository.update(
          existingPreferences.id,
          validatedData
        );
      } else {
        // Create new preferences
        const createData = {
          ...validatedData,
          user: userProfile.userLogin
        };
        updatedPreferences = await this.partnerPreferencesRepository.create(createData);
      }

      // Calculate matching score and insights
      const matchingScore = await this.calculateMatchingScore(updatedPreferences, requestId);
      updatedPreferences.matchingScore = matchingScore;
      
      // Save the updated matching score
      if (matchingScore !== updatedPreferences.matchingScore) {
        updatedPreferences = await this.partnerPreferencesRepository.update(
          updatedPreferences.id,
          { matchingScore }
        );
      }

      // Transform to response DTO
      const preferencesResponse = await this.partnerPreferencesMapper.toResponseDto(
        updatedPreferences,
        userProfile
      );

      // Calculate estimated matches
      const estimatedMatches = await this.calculateEstimatedMatches(updatedPreferences, requestId);
      preferencesResponse.estimatedMatches = estimatedMatches;

      this.logger.info('Partner preferences updated successfully', {
        requestId,
        userId,
        preferencesId: updatedPreferences.id,
        updatedFields: Object.keys(validatedData),
        isNewPreferences,
        completionPercentage: preferencesResponse.completionPercentage,
        matchingScore,
        estimatedMatches,
        operation: 'updatePartnerPreferences'
      });

      return preferencesResponse;

    } catch (error) {
      this.logger.error('Failed to update partner preferences', {
        requestId,
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
        updateFields: Object.keys(updateData),
        stack: error instanceof Error ? error.stack : undefined,
        operation: 'updatePartnerPreferences'
      });

      // Re-throw known errors (following established pattern)
      if (error instanceof UserNotFoundError || 
          error instanceof InvalidPreferencesError || 
          error instanceof InvalidEmailError) {
        throw error;
      }
      throw new InternalServerError('Failed to update partner preferences');
    }
  }

  /**
   * Delete user's partner preferences (soft delete)
   * Following UserProfileService.deleteUserProfile patterns
   */
  async deletePartnerPreferences(
    userId: number, 
    requestId: string
  ): Promise<void> {
    this.logger.warn('PartnerPreferencesService.deletePartnerPreferences initiated', {
      requestId,
      userId,
      operation: 'deletePartnerPreferences',
      deletionType: 'SOFT_DELETE',
      timestamp: new Date().toISOString()
    });

    try {
      // Validate user exists
      const userProfile = await this.userProfileRepository.findByUserId(userId);
      if (!userProfile || userProfile.isDeleted) {
        throw new UserNotFoundError('User profile not found');
      }

      // Get existing preferences
      const existingPreferences = await this.partnerPreferencesRepository.findByUserId(userId);
      if (!existingPreferences) {
        this.logger.warn('Partner preferences not found for deletion', {
          requestId,
          userId,
          operation: 'deletePartnerPreferences'
        });
        throw new PreferencesNotFoundError(userId);
      }

      this.logger.info('Preferences found, proceeding with soft deletion', {
        requestId,
        userId,
        preferencesId: existingPreferences.id,
        operation: 'deletePartnerPreferences'
      });

      // Soft delete the preferences
      await this.partnerPreferencesRepository.softDelete(existingPreferences.id);

      this.logger.warn('Partner preferences soft deleted successfully', {
        requestId,
        userId,
        preferencesId: existingPreferences.id,
        operation: 'deletePartnerPreferences',
        deletionType: 'SOFT_DELETE_COMPLETED',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      this.logger.error('Failed to delete partner preferences', {
        requestId,
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        operation: 'deletePartnerPreferences'
      });

      if (error instanceof UserNotFoundError || error instanceof PreferencesNotFoundError) {
        throw error;
      }
      throw new InternalServerError('Failed to delete partner preferences');
    }
  }

  /**
   * Calculate compatibility score between two users
   * Advanced ML-ready compatibility algorithm
   */
  async calculateCompatibility(
    userId: number,
    targetUserId: number,
    requestId: string
  ): Promise<CompatibilityResultDto> {
    this.logger.info('PartnerPreferencesService.calculateCompatibility initiated', {
      requestId,
      userId,
      targetUserId,
      operation: 'calculateCompatibility',
      timestamp: new Date().toISOString()
    });

    try {
      // Get both users' profiles and preferences
      const [userProfile, targetProfile, userPreferences, targetPreferences] = await Promise.all([
        this.userProfileRepository.findByUserId(userId),
        this.userProfileRepository.findByUserId(targetUserId),
        this.partnerPreferencesRepository.findByUserId(userId),
        this.partnerPreferencesRepository.findByUserId(targetUserId)
      ]);

      // Validate data availability
      if (!userProfile || !targetProfile) {
        throw new UserNotFoundError('One or both users not found');
      }

      if (!userPreferences || !targetPreferences) {
        throw new InsufficientDataError(
          'compatibility calculation',
          'Both users must have partner preferences set'
        );
      }

      // Calculate compatibility using advanced algorithm
      const compatibilityResult = await this.calculateAdvancedCompatibility(
        userProfile,
        targetProfile,
        userPreferences,
        targetPreferences,
        requestId
      );

      this.logger.info('Compatibility calculation completed successfully', {
        requestId,
        userId,
        targetUserId,
        overallScore: compatibilityResult.overallScore,
        compatibilityLevel: compatibilityResult.compatibilityLevel,
        confidence: compatibilityResult.confidence,
        operation: 'calculateCompatibility'
      });

      return compatibilityResult;

    } catch (error) {
      this.logger.error('Failed to calculate compatibility', {
        requestId,
        userId,
        targetUserId,
        error: error instanceof Error ? error.message : 'Unknown error',
        operation: 'calculateCompatibility'
      });

      if (error instanceof UserNotFoundError || error instanceof InsufficientDataError) {
        throw error;
      }
      throw new CompatibilityCalculationError(userId, targetUserId, 'Algorithm execution failed');
    }
  }

  /**
   * Get matching recommendations based on user's preferences
   * Advanced recommendation engine
   */
  async getMatchingRecommendations(
    userId: number,
    limit: number = 20,
    requestId: string
  ): Promise<UserRecommendationDto[]> {
    this.logger.info('PartnerPreferencesService.getMatchingRecommendations initiated', {
      requestId,
      userId,
      limit,
      operation: 'getMatchingRecommendations',
      timestamp: new Date().toISOString()
    });

    try {
      // Get user profile and preferences
      const [userProfile, userPreferences] = await Promise.all([
        this.userProfileRepository.findByUserId(userId),
        this.partnerPreferencesRepository.findByUserId(userId)
      ]);

      if (!userProfile || userProfile.isDeleted) {
        throw new UserNotFoundError('User profile not found');
      }

      if (!userPreferences) {
        throw new InsufficientDataError(
          'recommendation generation',
          'User must have partner preferences set'
        );
      }

      // Get potential matches using advanced filtering
      const potentialMatches = await this.partnerPreferencesRepository.findPotentialMatches(
        userId,
        userPreferences,
        limit * 3 // Get more candidates for better filtering
      );

      // Calculate compatibility scores and rank matches
      const rankedRecommendations = await this.rankAndFilterRecommendations(
        userProfile,
        userPreferences,
        potentialMatches,
        limit,
        requestId
      );

      this.logger.info('Matching recommendations generated successfully', {
        requestId,
        userId,
        totalCandidates: potentialMatches.length,
        finalRecommendations: rankedRecommendations.length,
        avgCompatibilityScore: rankedRecommendations.reduce((sum, rec) => sum + rec.compatibilityScore, 0) / rankedRecommendations.length,
        operation: 'getMatchingRecommendations'
      });

      return rankedRecommendations;

    } catch (error) {
      this.logger.error('Failed to get matching recommendations', {
        requestId,
        userId,
        limit,
        error: error instanceof Error ? error.message : 'Unknown error',
        operation: 'getMatchingRecommendations'
      });

      if (error instanceof UserNotFoundError || error instanceof InsufficientDataError) {
        throw error;
      }
      throw new InternalServerError('Failed to generate recommendations');
    }
  }

  /**
   * Validate preferences completeness and provide suggestions
   */
  async validatePreferencesCompleteness(
    userId: number,
    requestId: string
  ): Promise<PreferencesValidationDto> {
    this.logger.debug('Validating preferences completeness', {
      requestId,
      userId,
      operation: 'validatePreferencesCompleteness'
    });

    try {
      const preferences = await this.partnerPreferencesRepository.findByUserId(userId);
      if (!preferences) {
        throw new PreferencesNotFoundError(userId);
      }

      const validationResult = this.partnerPreferencesMapper.calculatePreferencesCompleteness(preferences);

      this.logger.debug('Preferences completeness validation completed', {
        requestId,
        userId,
        completionPercentage: validationResult.completionPercentage,
        isComplete: validationResult.isComplete,
        missingFieldsCount: validationResult.missingFields.length,
        operation: 'validatePreferencesCompleteness'
      });

      return validationResult;
    } catch (error) {
      this.logger.error('Failed to validate preferences completeness', {
        requestId,
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
        operation: 'validatePreferencesCompleteness'
      });
      throw new InternalServerError('Failed to validate preferences completeness');
    }
  }

  /**
   * Get preferences analytics for admin/insights
   */
  async getPreferencesAnalytics(requestId: string): Promise<PreferencesAnalyticsDto> {
    this.logger.info('PartnerPreferencesService.getPreferencesAnalytics initiated', {
      requestId,
      operation: 'getPreferencesAnalytics',
      timestamp: new Date().toISOString()
    });

    try {
      const analytics = await this.partnerPreferencesRepository.getAnalytics();

      this.logger.info('Preferences analytics generated successfully', {
        requestId,
        totalUsers: analytics.totalUsersWithPreferences,
        avgCompletion: analytics.averageCompletionPercentage,
        operation: 'getPreferencesAnalytics'
      });

      return analytics;
    } catch (error) {
      this.logger.error('Failed to get preferences analytics', {
        requestId,
        error: error instanceof Error ? error.message : 'Unknown error',
        operation: 'getPreferencesAnalytics'
      });
      throw new InternalServerError('Failed to generate preferences analytics');
    }
  }

  /**
   * Update preferences based on user behavior (ML-driven)
   */
  async updatePreferencesFromBehavior(
    userId: number,
    behaviorData: any,
    requestId: string
  ): Promise<PartnerPreferencesResponseDto> {
    this.logger.info('ML-driven preferences update initiated', {
      requestId,
      userId,
      behaviorDataKeys: Object.keys(behaviorData),
      operation: 'updatePreferencesFromBehavior'
    });

    try {
      // This would integrate with ML algorithms to adjust preferences
      // Based on user interactions, likes, dislikes, etc.
      const preferences = await this.partnerPreferencesRepository.findByUserId(userId);
      if (!preferences) {
        throw new PreferencesNotFoundError(userId);
      }

      // ML algorithm would analyze behavior and suggest preference adjustments
      const adjustedPreferences = await this.applyBehaviorLearning(preferences, behaviorData);
      
      const updatedPreferences = await this.partnerPreferencesRepository.update(
        preferences.id,
        adjustedPreferences
      );

      const userProfile = await this.userProfileRepository.findByUserId(userId);
      const response = await this.partnerPreferencesMapper.toResponseDto(updatedPreferences, userProfile!);

      this.logger.info('ML-driven preferences update completed', {
        requestId,
        userId,
        adjustmentsMade: Object.keys(adjustedPreferences).length,
        operation: 'updatePreferencesFromBehavior'
      });

      return response;
    } catch (error) {
      this.logger.error('Failed to update preferences from behavior', {
        requestId,
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
        operation: 'updatePreferencesFromBehavior'
      });
      throw new InternalServerError('Failed to apply behavior learning');
    }
  }

  // ============================================================================
  // PRIVATE HELPER METHODS (Following established patterns)
  // ============================================================================

  /**
   * Validate and process update data with business rules
   * Following UserProfileService validation patterns
   */
  private async validateAndProcessUpdateData(
    updateData: UpdatePartnerPreferencesRequestDto,
    existingPreferences: DatifyyUserPartnerPreferences | null,
    userProfile: DatifyyUsersInformation,
    requestId: string
  ): Promise<Partial<DatifyyUserPartnerPreferences>> {
    this.logger.debug('Applying business validation rules', {
      requestId,
      updateFields: Object.keys(updateData),
      hasExistingPreferences: !!existingPreferences,
      operation: 'validateAndProcessUpdateData'
    });

    // Use mapper to transform DTO to entity update data
    const processedData = this.partnerPreferencesMapper.fromUpdateRequestDto(updateData);

    // Apply business validation rules
    this.validateAgeRange(updateData.minAge, updateData.maxAge);
    this.validateHeightRange(updateData.minHeight, updateData.maxHeight);
    this.validateIncomeRange(updateData.minIncome, updateData.maxIncome);
    this.validateLocationConsistency(updateData.locationPreference, updateData.locationPreferenceRadius);

    // Gender preference validation based on user's own profile
    if (updateData.genderPreference && userProfile.gender) {
      this.validateGenderPreferenceLogic(updateData.genderPreference, userProfile.gender);
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
   * Calculate advanced compatibility between two users
   * ML-ready algorithm with detailed scoring
   */
  private async calculateAdvancedCompatibility(
    userProfile: DatifyyUsersInformation,
    targetProfile: DatifyyUsersInformation,
    userPreferences: DatifyyUserPartnerPreferences,
    targetPreferences: DatifyyUserPartnerPreferences,
    requestId: string
  ): Promise<CompatibilityResultDto> {
    
    // Category weights (configurable for ML optimization)
    const weights = {
      demographics: 0.25,
      lifestyle: 0.20,
      interests: 0.20,
      values: 0.15,
      physical: 0.10,
      financial: 0.05,
      location: 0.05
    };

    // Calculate category scores
    const categoryScores = {
      demographics: this.calculateDemographicCompatibility(userProfile, targetProfile, userPreferences, targetPreferences),
      lifestyle: this.calculateLifestyleCompatibility(userProfile, targetProfile, userPreferences, targetPreferences),
      interests: this.calculateInterestCompatibility(userProfile, targetProfile, userPreferences, targetPreferences),
      values: this.calculateValuesCompatibility(userProfile, targetProfile, userPreferences, targetPreferences),
      physical: this.calculatePhysicalCompatibility(userProfile, targetProfile, userPreferences, targetPreferences),
      financial: this.calculateFinancialCompatibility(userProfile, targetProfile, userPreferences, targetPreferences),
      location: this.calculateLocationCompatibility(userProfile, targetProfile, userPreferences, targetPreferences)
    };

    // Calculate overall score
    const overallScore = Math.round(
      Object.entries(categoryScores).reduce((total, [category, data]) => {
        return total + (data.score * weights[category as keyof typeof weights]);
      }, 0)
    );

    // Determine compatibility level
    const compatibilityLevel = this.determineCompatibilityLevel(overallScore);

    // Generate insights
    const strengths = this.generateMatchStrengths(categoryScores);
    const concerns = this.generateMatchConcerns(categoryScores);
    const mutualInterests = this.findMutualInterests(userProfile, targetProfile);

    // Calculate confidence based on data completeness
    const confidence = this.calculateConfidenceScore(userProfile, targetProfile, userPreferences, targetPreferences);

    // Check mutual preferences
    const mutualAttraction = {
      userLikesTarget: this.checkUserLikesTarget(userPreferences, targetProfile),
      targetLikesUser: this.checkUserLikesTarget(targetPreferences, userProfile),
      mutualPreferencesMatch: false
    };
    mutualAttraction.mutualPreferencesMatch = mutualAttraction.userLikesTarget && mutualAttraction.targetLikesUser;

    return {
      overallScore,
      compatibilityLevel,
      isGoodMatch: overallScore >= 70,
      categoryScores,
      strengths,
      concerns,
      mutualInterests,
      complementaryTraits: this.findComplementaryTraits(userProfile, targetProfile),
      conversationStarters: this.generateConversationStarters(mutualInterests, categoryScores),
      dateIdeas: this.generateDateIdeas(mutualInterests, userProfile, targetProfile),
      potentialChallenges: this.identifyPotentialChallenges(concerns),
      calculatedAt: new Date().toISOString(),
      confidence,
      dataCompleteness: this.calculateDataCompleteness(userProfile, targetProfile),
      mutualAttraction
    };
  }

  /**
   * Calculate estimated matches based on preferences
   */
  private async calculateEstimatedMatches(
    preferences: DatifyyUserPartnerPreferences,
    requestId: string
  ): Promise<number> {
    try {
      // This would use actual database queries in production
      // For now, we'll use a simplified calculation
      let baseEstimate = 1000; // Base pool of users

      // Adjust based on age range
      if (preferences.minAge && preferences.maxAge) {
        const ageRange = preferences.maxAge - preferences.minAge;
        baseEstimate *= Math.min(ageRange / 20, 1.5); // Broader age range = more matches
      }

      // Adjust based on location preferences
      if (preferences.locationPreference) {
        const locationData = preferences.locationPreference as any;
        if (locationData.cities?.length > 3) {
          baseEstimate *= 1.3; // More cities = more matches
        }
      }

      // Adjust based on flexibility in other preferences
      const flexibilityScore = this.calculatePreferenceFlexibility(preferences);
      baseEstimate *= flexibilityScore;

      return Math.round(Math.max(baseEstimate, 10)); // Minimum 10 estimated matches
    } catch (error) {
      this.logger.error('Failed to calculate estimated matches', { requestId, error });
      return 100; // Fallback estimate
    }
  }

  /**
   * Calculate matching score for ML optimization
   */
  private async calculateMatchingScore(
    preferences: DatifyyUserPartnerPreferences,
    requestId: string
  ): Promise<number> {
    // Calculate based on preference completeness and quality
    const completeness = this.partnerPreferencesMapper.calculatePreferencesCompleteness(preferences);
    
    // Base score from completeness
    let score = completeness.completionPercentage * 0.6;
    
    // Bonus for specific high-value preferences
    if (preferences.relationshipGoals) score += 10;
    if (preferences.educationLevel?.length) score += 5;
    if (preferences.hobbies?.length && preferences.hobbies.length >= 3) score += 5;
    if (preferences.locationPreference) score += 5;
    
    // Penalty for overly restrictive preferences
    const restrictiveness = this.calculateRestrictiveness(preferences);
    score -= restrictiveness * 10;
    
    return Math.min(Math.round(score), 100);
  }

  // Additional helper methods for compatibility calculation
  private calculateDemographicCompatibility(
    user: DatifyyUsersInformation,
    target: DatifyyUsersInformation,
    userPrefs: DatifyyUserPartnerPreferences,
    targetPrefs: DatifyyUserPartnerPreferences
  ): CompatibilityCategoryDto {
    let score = 100;
    const matchingFactors: string[] = [];
    const conflictingFactors: string[] = [];

    // Age compatibility
    const userAge = this.calculateAge(user.dob);
    const targetAge = this.calculateAge(target.dob);

    if (userAge && targetAge) {
      if (userPrefs.minAge && userPrefs.maxAge) {
        if (targetAge >= userPrefs.minAge && targetAge <= userPrefs.maxAge) {
          matchingFactors.push(`Target age (${targetAge}) matches your preference`);
        } else {
          conflictingFactors.push(`Target age (${targetAge}) outside your preferred range`);
          score -= 20;
        }
      }
    }

    // Gender compatibility
    if (userPrefs.genderPreference && target.gender) {
      if (userPrefs.genderPreference === 'Both' || userPrefs.genderPreference.toLowerCase() === target.gender.toLowerCase()) {
        matchingFactors.push('Gender preference matches');
      } else {
        conflictingFactors.push('Gender preference mismatch');
        score -= 30;
      }
    }

    return {
      score: Math.max(score, 0),
      weight: 0.25,
      details: {
        matchingFactors,
        conflictingFactors,
        neutralFactors: []
      },
      improvement: conflictingFactors.length > 0 ? 'Consider expanding your demographic preferences' : null
    };
  }

  private calculateLifestyleCompatibility(
    user: DatifyyUsersInformation,
    target: DatifyyUsersInformation,
    userPrefs: DatifyyUserPartnerPreferences,
    targetPrefs: DatifyyUserPartnerPreferences
  ): CompatibilityCategoryDto {
    let score = 100;
    const matchingFactors: string[] = [];
    const conflictingFactors: string[] = [];

    // Smoking compatibility
    if (userPrefs.smokingPreference && target.smoking) {
      if (userPrefs.smokingPreference === 'Yes' || 
          (userPrefs.smokingPreference === 'Sometimes' && target.smoking !== 'Regularly') ||
          (userPrefs.smokingPreference === 'No' && target.smoking === 'Never')) {
        matchingFactors.push('Smoking preferences compatible');
      } else {
        conflictingFactors.push('Smoking preferences conflict');
        score -= 15;
      }
    }

    // Drinking compatibility (continued)
       if (userPrefs.drinkingPreference && target.drinking) {
         if (userPrefs.drinkingPreference === 'Yes' || 
             (userPrefs.drinkingPreference === 'Sometimes' && target.drinking !== 'Regularly') ||
             (userPrefs.drinkingPreference === 'No' && target.drinking === 'Never')) {
           matchingFactors.push('Drinking preferences compatible');
         } else {
           conflictingFactors.push('Drinking preferences conflict');
           score -= 15;
         }
       }

       // Exercise/Activity level compatibility
       if (userPrefs.activityLevel && target.exercise) {
         const activityMapping = {
           'Low': ['None', 'Light'],
           'Moderate': ['Light', 'Moderate'],
           'High': ['Moderate', 'Heavy'],
           'Very High': ['Heavy']
         };
         
         const compatibleLevels = activityMapping[userPrefs.activityLevel as keyof typeof activityMapping] || [];
         if (compatibleLevels.includes(target.exercise)) {
           matchingFactors.push('Activity levels align well');
         } else {
           conflictingFactors.push('Different activity levels');
           score -= 10;
         }
       }

       return {
         score: Math.max(score, 0),
         weight: 0.20,
         details: {
           matchingFactors,
           conflictingFactors,
           neutralFactors: []
         },
         improvement: conflictingFactors.length > 0 ? 'Consider lifestyle flexibility for better matches' : null
       };
     }

     private calculateInterestCompatibility(
       user: DatifyyUsersInformation,
       target: DatifyyUsersInformation,
       userPrefs: DatifyyUserPartnerPreferences,
       targetPrefs: DatifyyUserPartnerPreferences
     ): CompatibilityCategoryDto {
       let score = 70; // Start with neutral score
       const matchingFactors: string[] = [];
       const conflictingFactors: string[] = [];

       // Hobbies compatibility
       const mutualHobbies = this.findMutualElements(userPrefs.hobbies, target.favInterest);
       if (mutualHobbies.length > 0) {
         score += Math.min(mutualHobbies.length * 8, 25);
         matchingFactors.push(`Shared hobbies: ${mutualHobbies.join(', ')}`);
       }

       // Music compatibility
       const mutualMusic = this.findMutualElements(userPrefs.music, target.favInterest);
       if (mutualMusic.length > 0) {
         score += Math.min(mutualMusic.length * 5, 15);
         matchingFactors.push(`Similar music taste: ${mutualMusic.join(', ')}`);
       }

       // Sports compatibility
       const mutualSports = this.findMutualElements(userPrefs.sports, target.favInterest);
       if (mutualSports.length > 0) {
         score += Math.min(mutualSports.length * 6, 20);
         matchingFactors.push(`Shared sports interests: ${mutualSports.join(', ')}`);
       }

       // Travel compatibility
       const mutualTravel = this.findMutualElements(userPrefs.travel, target.favInterest);
       if (mutualTravel.length > 0) {
         score += Math.min(mutualTravel.length * 7, 20);
         matchingFactors.push(`Similar travel interests: ${mutualTravel.join(', ')}`);
       }

       return {
         score: Math.min(score, 100),
         weight: 0.20,
         details: {
           matchingFactors,
           conflictingFactors,
           neutralFactors: mutualHobbies.length === 0 ? ['No obvious shared interests found'] : []
         },
         improvement: mutualHobbies.length === 0 ? 'Add more interests to find better matches' : null
       };
     }

     private calculateValuesCompatibility(
       user: DatifyyUsersInformation,
       target: DatifyyUsersInformation,
       userPrefs: DatifyyUserPartnerPreferences,
       targetPrefs: DatifyyUserPartnerPreferences
     ): CompatibilityCategoryDto {
       let score = 80; // Start with good baseline
       const matchingFactors: string[] = [];
       const conflictingFactors: string[] = [];

       // Religion compatibility
       if (userPrefs.religionPreference && target.religion) {
         if (userPrefs.religionPreference.toLowerCase() === 'any' || 
             userPrefs.religionPreference.toLowerCase() === target.religion.toLowerCase()) {
           matchingFactors.push('Religious values align');
           score += 10;
         } else {
           conflictingFactors.push('Different religious backgrounds');
           score -= 15;
         }
       }

       // Relationship goals compatibility
       if (userPrefs.relationshipGoals && target.lookingFor) {
         const goalMapping = {
           'Casual Dating': ['Casual', 'Friendship'],
           'Serious Relationship': ['Relationship'],
           'Marriage': ['Relationship'],
           'Friendship': ['Friendship', 'Casual'],
           'Open to Anything': ['Casual', 'Relationship', 'Friendship']
         };
         
         const compatibleGoals = goalMapping[userPrefs.relationshipGoals as keyof typeof goalMapping] || [];
         if (compatibleGoals.includes(target.lookingFor)) {
           matchingFactors.push('Relationship goals aligned');
           score += 15;
         } else {
           conflictingFactors.push('Different relationship expectations');
           score -= 20;
         }
       }

       // Children preferences compatibility
       if (userPrefs.childrenPreference && target.haveKids !== null && target.wantsKids !== null) {
         if (userPrefs.childrenPreference === 'Doesnt matter' ||
             (userPrefs.childrenPreference === 'Yes' && (target.haveKids || target.wantsKids)) ||
             (userPrefs.childrenPreference === 'No' && !target.haveKids && !target.wantsKids)) {
           matchingFactors.push('Children preferences compatible');
           score += 10;
         } else {
           conflictingFactors.push('Different views on children');
           score -= 25;
         }
       }

       return {
         score: Math.max(score, 0),
         weight: 0.15,
         details: {
           matchingFactors,
           conflictingFactors,
           neutralFactors: []
         },
         improvement: conflictingFactors.length > 0 ? 'Core values differences may require discussion' : null
       };
     }

     private calculatePhysicalCompatibility(
       user: DatifyyUsersInformation,
       target: DatifyyUsersInformation,
       userPrefs: DatifyyUserPartnerPreferences,
       targetPrefs: DatifyyUserPartnerPreferences
     ): CompatibilityCategoryDto {
       let score = 100;
       const matchingFactors: string[] = [];
       const conflictingFactors: string[] = [];

       // Height compatibility
       if (userPrefs.minHeight && userPrefs.maxHeight && target.height) {
         if (target.height >= userPrefs.minHeight && target.height <= userPrefs.maxHeight) {
           matchingFactors.push(`Height (${target.height}cm) matches your preference`);
         } else {
           conflictingFactors.push(`Height (${target.height}cm) outside your preferred range`);
           score -= 20;
         }
       }

       // Mutual physical attraction check
       const userAge = this.calculateAge(user.dob);
       const targetAge = this.calculateAge(target.dob);
       
       if (userAge && targetAge && targetPrefs.minAge && targetPrefs.maxAge) {
         if (userAge >= targetPrefs.minAge && userAge <= targetPrefs.maxAge) {
           matchingFactors.push('You match their age preference');
         } else {
           conflictingFactors.push('You may not match their age preference');
           score -= 15;
         }
       }

       return {
         score: Math.max(score, 0),
         weight: 0.10,
         details: {
           matchingFactors,
           conflictingFactors,
           neutralFactors: []
         },
         improvement: conflictingFactors.length > 0 ? 'Physical preferences may need adjustment' : null
       };
     }

     private calculateFinancialCompatibility(
       user: DatifyyUsersInformation,
       target: DatifyyUsersInformation,
       userPrefs: DatifyyUserPartnerPreferences,
       targetPrefs: DatifyyUserPartnerPreferences
     ): CompatibilityCategoryDto {
       let score = 90; // Generally less critical factor
       const matchingFactors: string[] = [];
       const conflictingFactors: string[] = [];

       // Education level compatibility
       if (userPrefs.educationLevel && target.educationLevel) {
         if (userPrefs.educationLevel.includes(target.educationLevel)) {
           matchingFactors.push('Education levels compatible');
           score += 10;
         } else {
           // Check if education levels are close (e.g., Graduate vs Postgraduate)
           const educationHierarchy = ['High School', 'Undergraduate', 'Graduate', 'Postgraduate'];
           const userLevels = userPrefs.educationLevel.map(level => educationHierarchy.indexOf(level));
           const targetLevel = educationHierarchy.indexOf(target.educationLevel);
           
           const minUserLevel = Math.min(...userLevels);
           const maxUserLevel = Math.max(...userLevels);
           
           if (targetLevel >= minUserLevel && targetLevel <= maxUserLevel + 1) {
             matchingFactors.push('Education levels reasonably compatible');
           } else {
             conflictingFactors.push('Significant education gap');
             score -= 10;
           }
         }
       }

       // Professional compatibility
       if (userPrefs.profession && target.educationLevel) {
         // This could be enhanced with actual profession data
         matchingFactors.push('Professional backgrounds may align');
       }

       return {
         score: Math.max(score, 0),
         weight: 0.05,
         details: {
           matchingFactors,
           conflictingFactors,
           neutralFactors: []
         },
         improvement: conflictingFactors.length > 0 ? 'Consider broader education/career criteria' : null
       };
     }

     private calculateLocationCompatibility(
       user: DatifyyUsersInformation,
       target: DatifyyUsersInformation,
       userPrefs: DatifyyUserPartnerPreferences,
       targetPrefs: DatifyyUserPartnerPreferences
     ): CompatibilityCategoryDto {
       let score = 100;
       const matchingFactors: string[] = [];
       const conflictingFactors: string[] = [];

       // Current city compatibility
       if (user.currentCity && target.currentCity) {
         if (user.currentCity.toLowerCase() === target.currentCity.toLowerCase()) {
           matchingFactors.push('Same city - easy to meet');
           score += 20;
         } else {
           // Check if cities are in preferred locations
           if (userPrefs.locationPreference) {
             const locationData = userPrefs.locationPreference as any;
             if (locationData.cities?.includes(target.currentCity)) {
               matchingFactors.push(`Target city (${target.currentCity}) in your preferred list`);
               score += 10;
             } else {
               conflictingFactors.push(`Target city (${target.currentCity}) not in your preferred areas`);
               score -= 30;
             }
           } else {
             conflictingFactors.push('Different cities - may require travel');
             score -= 20;
           }
         }
       }

       // Hometown compatibility (for cultural alignment)
       if (user.hometown && target.hometown) {
         if (user.hometown.toLowerCase() === target.hometown.toLowerCase()) {
           matchingFactors.push('Shared hometown - common cultural background');
           score += 10;
         }
       }

       return {
         score: Math.max(score, 0),
         weight: 0.05,
         details: {
           matchingFactors,
           conflictingFactors,
           neutralFactors: []
         },
         improvement: conflictingFactors.length > 0 ? 'Consider expanding location preferences' : null
       };
     }

     // Helper methods for compatibility calculation
     private determineCompatibilityLevel(score: number): 'Low' | 'Medium' | 'High' | 'Excellent' {
       if (score >= 90) return 'Excellent';
       if (score >= 75) return 'High';
       if (score >= 60) return 'Medium';
       return 'Low';
     }

     private generateMatchStrengths(categoryScores: Record<string, CompatibilityCategoryDto>): MatchStrengthDto[] {
       const strengths: MatchStrengthDto[] = [];
       
       Object.entries(categoryScores).forEach(([category, data]) => {
         if (data.score >= 80) {
           data.details.matchingFactors.forEach(factor => {
             strengths.push({
               category,
               factor,
               impact: data.score >= 90 ? 'High' : 'Medium',
               description: factor,
               score: data.score
             });
           });
         }
       });

       return strengths.sort((a, b) => b.score - a.score).slice(0, 5); // Top 5 strengths
     }

     private generateMatchConcerns(categoryScores: Record<string, CompatibilityCategoryDto>): MatchConcernDto[] {
       const concerns: MatchConcernDto[] = [];
       
       Object.entries(categoryScores).forEach(([category, data]) => {
         if (data.score < 60) {
           data.details.conflictingFactors.forEach(factor => {
             concerns.push({
               category,
               concern: factor,
               severity: data.score < 40 ? 'High' : data.score < 60 ? 'Medium' : 'Low',
               description: factor,
               suggestion: data.improvement || 'Consider discussing this difference'
             });
           });
         }
       });

       return concerns;
     }

     private findMutualInterests(user: DatifyyUsersInformation, target: DatifyyUsersInformation): string[] {
       const userInterests = [
         ...(user.favInterest || []),
         ...(user.causesYouSupport || []),
         ...(user.qualityYouValue || [])
       ];
       
       const targetInterests = [
         ...(target.favInterest || []),
         ...(target.causesYouSupport || []),
         ...(target.qualityYouValue || [])
       ];

       return userInterests.filter(interest => 
         targetInterests.some(targetInterest => 
           interest.toLowerCase() === targetInterest.toLowerCase()
         )
       );
     }

     private findComplementaryTraits(user: DatifyyUsersInformation, target: DatifyyUsersInformation): string[] {
       const complementaryPairs = [
         { trait1: 'Introvert', trait2: 'Extrovert' },
         { trait1: 'Planner', trait2: 'Spontaneous' },
         { trait1: 'Homebody', trait2: 'Adventurous' },
         { trait1: 'Analytical', trait2: 'Creative' }
       ];

       const userTraits = user.qualityYouValue || [];
       const targetTraits = target.qualityYouValue || [];
       const complementary: string[] = [];

       complementaryPairs.forEach(pair => {
         const userHasTrait1 = userTraits.some(trait => trait.toLowerCase().includes(pair.trait1.toLowerCase()));
         const userHasTrait2 = userTraits.some(trait => trait.toLowerCase().includes(pair.trait2.toLowerCase()));
         const targetHasTrait1 = targetTraits.some(trait => trait.toLowerCase().includes(pair.trait1.toLowerCase()));
         const targetHasTrait2 = targetTraits.some(trait => trait.toLowerCase().includes(pair.trait2.toLowerCase()));

         if ((userHasTrait1 && targetHasTrait2) || (userHasTrait2 && targetHasTrait1)) {
           complementary.push(`${pair.trait1} complements ${pair.trait2}`);
         }
       });

       return complementary;
     }

     private generateConversationStarters(mutualInterests: string[], categoryScores: Record<string, CompatibilityCategoryDto>): string[] {
       const starters: string[] = [];

       // Interest-based starters
       mutualInterests.forEach(interest => {
         starters.push(`Ask about their experience with ${interest}`);
         starters.push(`Share your ${interest} story`);
       });

       // Category-based starters
       Object.entries(categoryScores).forEach(([category, data]) => {
         if (data.score >= 80 && data.details.matchingFactors.length > 0) {
           const factor = data.details.matchingFactors[0];
           if (category === 'lifestyle') {
             starters.push(`Discuss your shared lifestyle preferences`);
           } else if (category === 'values') {
             starters.push(`Talk about your similar values and goals`);
           }
         }
       });

       return starters.slice(0, 5); // Top 5 conversation starters
     }

     private generateDateIdeas(mutualInterests: string[], user: DatifyyUsersInformation, target: DatifyyUsersInformation): string[] {
       const dateIdeas: string[] = [];

       // Interest-based date ideas
       mutualInterests.forEach(interest => {
         const interestLower = interest.toLowerCase();
         if (interestLower.includes('music')) {
           dateIdeas.push('Attend a live music concert together');
         } else if (interestLower.includes('food') || interestLower.includes('cooking')) {
           dateIdeas.push('Try a cooking class or food tour');
         } else if (interestLower.includes('art')) {
           dateIdeas.push('Visit an art gallery or museum');
         } else if (interestLower.includes('travel')) {
           dateIdeas.push('Plan a weekend getaway');
         } else if (interestLower.includes('fitness') || interestLower.includes('sports')) {
           dateIdeas.push('Go for a hike or try a fitness class');
         }
       });

       // Default date ideas if no specific interests match
       if (dateIdeas.length === 0) {
         dateIdeas.push('Coffee date to get to know each other');
         dateIdeas.push('Casual dinner at a nice restaurant');
         dateIdeas.push('Walk in a local park or garden');
       }

       return dateIdeas.slice(0, 3); // Top 3 date ideas
     }

     private identifyPotentialChallenges(concerns: MatchConcernDto[]): string[] {
       return concerns
         .filter(concern => concern.severity === 'High')
         .map(concern => concern.description)
         .slice(0, 3); // Top 3 challenges
     }

     private calculateConfidenceScore(
       user: DatifyyUsersInformation,
       target: DatifyyUsersInformation,
       userPrefs: DatifyyUserPartnerPreferences,
       targetPrefs: DatifyyUserPartnerPreferences
     ): number {
       let confidence = 50; // Base confidence

       // Increase confidence based on data completeness
       const userCompleteness = this.calculateProfileCompleteness(user);
       const targetCompleteness = this.calculateProfileCompleteness(target);
       const userPrefsCompleteness = this.partnerPreferencesMapper.calculatePreferencesCompleteness(userPrefs);
       const targetPrefsCompleteness = this.partnerPreferencesMapper.calculatePreferencesCompleteness(targetPrefs);

       const avgCompleteness = (userCompleteness + targetCompleteness + userPrefsCompleteness.completionPercentage + targetPrefsCompleteness.completionPercentage) / 4;
       confidence += Math.round(avgCompleteness * 0.5);

       return Math.min(confidence, 100);
     }

     private calculateDataCompleteness(user: DatifyyUsersInformation, target: DatifyyUsersInformation): number {
       const userCompleteness = this.calculateProfileCompleteness(user);
       const targetCompleteness = this.calculateProfileCompleteness(target);
       return Math.round((userCompleteness + targetCompleteness) / 2);
     }

     private checkUserLikesTarget(preferences: DatifyyUserPartnerPreferences, target: DatifyyUsersInformation): boolean {
       let matches = true;

       // Check age preference
       const targetAge = this.calculateAge(target.dob);
       if (targetAge && preferences.minAge && preferences.maxAge) {
         if (targetAge < preferences.minAge || targetAge > preferences.maxAge) {
           matches = false;
         }
       }

       // Check gender preference
       if (preferences.genderPreference && target.gender) {
         if (preferences.genderPreference !== 'Both' && 
             preferences.genderPreference.toLowerCase() !== target.gender.toLowerCase()) {
           matches = false;
         }
       }

       // Check height preference
       if (preferences.minHeight && preferences.maxHeight && target.height) {
         if (target.height < preferences.minHeight || target.height > preferences.maxHeight) {
           matches = false;
         }
       }

       return matches;
     }

     private rankAndFilterRecommendations(
       userProfile: DatifyyUsersInformation,
       userPreferences: DatifyyUserPartnerPreferences,
       potentialMatches: any[],
       limit: number,
       requestId: string
     ): Promise<UserRecommendationDto[]> {
       // This would implement sophisticated ranking algorithm
       // For now, return a simplified implementation
       return Promise.resolve([]);
     }

     private applyBehaviorLearning(
       preferences: DatifyyUserPartnerPreferences,
       behaviorData: any
     ): Promise<Partial<DatifyyUserPartnerPreferences>> {
       // ML algorithm would analyze behavior patterns and adjust preferences
       // This is a placeholder for future ML implementation
       return Promise.resolve({});
     }

     // Validation helper methods
     private validateAgeRange(minAge?: number, maxAge?: number): void {
       if (minAge && maxAge && minAge > maxAge) {
         throw new InvalidPreferencesError('ageRange', 'Minimum age cannot be greater than maximum age');
       }
     }

     private validateHeightRange(minHeight?: number, maxHeight?: number): void {
       if (minHeight && maxHeight && minHeight > maxHeight) {
         throw new InvalidPreferencesError('heightRange', 'Minimum height cannot be greater than maximum height');
       }
     }

     private validateIncomeRange(minIncome?: string, maxIncome?: string): void {
       if (minIncome && maxIncome) {
         const minIncomeNum = parseFloat(minIncome.replace(/[^0-9.]/g, ''));
         const maxIncomeNum = parseFloat(maxIncome.replace(/[^0-9.]/g, ''));
         
         if (!isNaN(minIncomeNum) && !isNaN(maxIncomeNum) && minIncomeNum > maxIncomeNum) {
           throw new InvalidPreferencesError('incomeRange', 'Minimum income cannot be greater than maximum income');
         }
       }
     }

     private validateLocationConsistency(locationPreference?: any, radius?: number): void {
       if (radius && (!locationPreference || !locationPreference.cities?.length)) {
         throw new InvalidPreferencesError('locationPreference', 'Location radius requires at least one preferred city');
       }
     }

     private validateGenderPreferenceLogic(genderPreference: string, userGender: string): void {
       // Business rule: Users should generally prefer different genders for dating
       // This is a simplified check - real implementation would be more nuanced
       if (genderPreference.toLowerCase() === userGender.toLowerCase() && genderPreference !== 'Both') {
         this.logger.warn('User selected same gender preference as their own gender', {
           userGender,
           genderPreference
         });
       }
     }

     // Utility helper methods
     private findMutualElements(array1?: string[] | null, array2?: string[] | null): string[] {
       if (!array1 || !array2) return [];
       
       return array1.filter(item1 => 
         array2.some(item2 => 
           item1.toLowerCase().trim() === item2.toLowerCase().trim()
         )
       );
     }

     private calculateAge(dob: string | null): number | null {
       if (!dob) return null;

       try {
         const birthDate = new Date(dob);
         const today = new Date();
         let age = today.getFullYear() - birthDate.getFullYear();
         const monthDiff = today.getMonth() - birthDate.getMonth();

         if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
           age--;
         }

         return age >= 0 && age <= 150 ? age : null;
       } catch {
         return null;
       }
     }

     private calculateProfileCompleteness(profile: DatifyyUsersInformation): number {
       const fields = [
         'firstName', 'lastName', 'gender', 'bio', 'dob', 'currentCity',
         'lookingFor', 'height', 'exercise', 'educationLevel', 'images'
       ];

       const filledFields = fields.filter(field => {
         const value = (profile as any)[field];
         return value !== null && value !== undefined && value !== '';
       });

       return Math.round((filledFields.length / fields.length) * 100);
     }

     private calculatePreferenceFlexibility(preferences: DatifyyUserPartnerPreferences): number {
       let flexibilityScore = 1.0;

       // More restrictive preferences = lower flexibility
       if (preferences.minAge && preferences.maxAge) {
         const ageRange = preferences.maxAge - preferences.minAge;
         if (ageRange < 5) flexibilityScore *= 0.8;
         else if (ageRange > 15) flexibilityScore *= 1.2;
       }

       if (preferences.religionPreference && preferences.religionPreference !== 'Any') {
         flexibilityScore *= 0.9;
       }

       if (preferences.educationLevel && preferences.educationLevel.length === 1) {
         flexibilityScore *= 0.85;
       }

       return Math.max(flexibilityScore, 0.5); // Minimum 0.5x flexibility
     }

     private calculateRestrictiveness(preferences: DatifyyUserPartnerPreferences): number {
       let restrictiveness = 0;

       // Count highly restrictive preferences
       if (preferences.minAge && preferences.maxAge && (preferences.maxAge - preferences.minAge) < 8) {
         restrictiveness += 0.2;
       }

       if (preferences.minHeight && preferences.maxHeight && (preferences.maxHeight - preferences.minHeight) < 20) {
         restrictiveness += 0.1;
       }

       if (preferences.religionPreference && preferences.religionPreference !== 'Any') {
         restrictiveness += 0.1;
       }

       if (preferences.educationLevel && preferences.educationLevel.length === 1) {
         restrictiveness += 0.15;
       }

       return Math.min(restrictiveness, 1.0);
     }
   }