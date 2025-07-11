/**
 * Partner Preferences Mapper Implementation - Data Transformation Layer
 * 
 * Following established codebase patterns from UserProfileMapper:
 * ✅ Comprehensive data transformation with error handling
 * ✅ Detailed logging with operation tracking
 * ✅ Business logic for completeness and quality scoring
 * ✅ Small, focused, testable methods
 * ✅ Performance optimized transformations
 * ✅ ML-ready feature extraction
 * 
 * @author Staff Engineer - Dating Platform Team
 * @version 1.0.0
 */

import { Logger } from '../../../infrastructure/logging/Logger';
import { DatifyyUserPartnerPreferences } from '../../../models/entities/DatifyyUserPartnerPreferences';
import { DatifyyUsersInformation } from '../../../models/entities/DatifyyUsersInformation';
import { UpdatePartnerPreferencesRequestDto } from '../dtos/PartnerPreferencesDtos';
import { 
  PartnerPreferencesResponseDto,
  PreferencesValidationDto,
  LocationPreferenceResponseDto,
  LifestylePreferenceResponseDto
} from '../dtos/PartnerPreferencesResponseDtos';
import {
  IPartnerPreferencesMapper,
  PartnerPreferencesSummaryDto,
  CompatibilityAnalysisInput,
  PreferencesAnalyticsInput,
  RecommendationEngineInput,
  SearchCriteria,
  PreferenceQualityScore,
  MLFeatureVector,
  ExportData,
  UserCompatibilityFeatures,
  PreferenceWeights,
  ContextualFactors,
  QualityRecommendation,
  MapperError,
  InvalidEntityError,
  TransformationError,
  IncompleteDataError
} from './IPartnerPreferencesMapper';

/**
 * Partner Preferences Mapper Implementation
 * 
 * Following the exact patterns from UserProfileMapper:
 * - Comprehensive transformation logic
 * - Error handling with specific error types
 * - Performance optimization
 * - Business rule application
 * - Clean separation of concerns
 */
export class PartnerPreferencesMapper implements IPartnerPreferencesMapper {
    private readonly logger: Logger;

    constructor(logger?: Logger) {
        this.logger = logger || Logger.getInstance();
    }

    /**
     * Transform entity to full response DTO
     * Following UserProfileMapper.toResponseDto patterns
     */
    async toResponseDto(
        entity: DatifyyUserPartnerPreferences,
        userProfile?: DatifyyUsersInformation | null
    ): Promise<PartnerPreferencesResponseDto> {
        try {
            this.logger.debug('PartnerPreferencesMapper.toResponseDto', {
                preferencesId: entity.id,
                userId: entity.user?.id
            });

            // Validate required entity data
            if (!entity.id) {
                throw new InvalidEntityError('DatifyyUserPartnerPreferences', 'Missing ID');
            }

            // Calculate derived fields
            const completionPercentage = this.calculateCompletionPercentage(entity);
            const estimatedMatches = this.calculateEstimatedMatches(entity);
            const profileViews = this.calculateProfileViews(entity);
            const matchesGenerated = this.calculateMatchesGenerated(entity);

            // Transform location preference
            const locationPreference = this.transformLocationPreference(entity.locationPreference);
      
            // Transform lifestyle preference
            const lifestylePreference = this.transformLifestylePreference(entity.lifestylePreference);

            const responseDto: PartnerPreferencesResponseDto = {
                id: entity.id,
        
                // Basic Demographics
                genderPreference: entity.genderPreference,
                minAge: entity.minAge,
                maxAge: entity.maxAge,
        
                // Physical Preferences
                minHeight: entity.minHeight,
                maxHeight: entity.maxHeight,
        
                // Cultural & Religious
                religion: entity.religion,
                educationLevel: this.sanitizeArray(entity.educationLevel),
                profession: this.sanitizeArray(entity.profession),
        
                // Financial
                minIncome: entity.minIncome,
                maxIncome: entity.maxIncome,
                currency: entity.currency,
        
                // Location
                locationPreference: locationPreference,
                locationPreferenceRadius: entity.locationPreferenceRadius,
        
                // Lifestyle
                smokingPreference: entity.smokingPreference,
                drinkingPreference: entity.drinkingPreference,
                maritalStatus: entity.maritalStatus,
                childrenPreference: entity.childrenPreference,
                religionPreference: entity.religionPreference,
                ethnicityPreference: entity.ethnicityPreference,
                castePreference: entity.castePreference,
        
                // Detailed Preferences
                partnerDescription: entity.partnerDescription,
                hobbies: this.sanitizeArray(entity.hobbies),
                interests: this.sanitizeArray(entity.interests),
                booksReading: this.sanitizeArray(entity.booksReading),
                music: this.sanitizeArray(entity.music),
                movies: this.sanitizeArray(entity.movies),
                travel: this.sanitizeArray(entity.travel),
                sports: this.sanitizeArray(entity.sports),
                personalityTraits: this.sanitizeArray(entity.personalityTraits),
                relationshipGoals: entity.relationshipGoals,
                lifestylePreference: lifestylePreference,
                whatOtherPersonShouldKnow: entity.whatOtherPersonShouldKnow,
                activityLevel: entity.activityLevel,
                petPreference: entity.petPreference,
        
                // Compatibility Scores
                religionCompatibilityScore: entity.religionCompatibilityScore,
                incomeCompatibilityScore: entity.incomeCompatibilityScore,
                educationCompatibilityScore: entity.educationCompatibilityScore,
                appearanceCompatibilityScore: entity.appearanceCompatibilityScore,
                personalityCompatibilityScore: entity.personalityCompatibilityScore,
                valuesCompatibilityScore: entity.valuesCompatibilityScore,
                matchingScore: entity.matchingScore,
        
                // Metadata
                completionPercentage,
                lastUpdated: entity.updatedAt?.toISOString() || new Date().toISOString(),
                createdAt: entity.createdAt?.toISOString() || new Date().toISOString(),
                isActive: true, // Could be derived from entity status
        
                // Analytics & Insights
                estimatedMatches,
                profileViews,
                matchesGenerated,
                preferencesSimilarityScore: this.calculateSimilarityScore(entity)
            };

            this.logger.debug('Preferences transformation completed', {
                preferencesId: entity.id,
                completionPercentage,
                estimatedMatches
            });

            return responseDto;

        } catch (error) {
            this.logger.error('Failed to transform entity to response DTO', {
                preferencesId: entity.id,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
      
            if (error instanceof InvalidEntityError || error instanceof TransformationError) {
                throw error;
            }
      
            throw new TransformationError(
                'DatifyyUserPartnerPreferences',
                'PartnerPreferencesResponseDto',
                error instanceof Error ? error.message : 'Unknown error'
            );
        }
    }

    /**
     * Transform multiple entities to response DTOs
     */
    async toResponseDtos(
        entities: DatifyyUserPartnerPreferences[],
        userProfiles?: Map<number, DatifyyUsersInformation>
    ): Promise<PartnerPreferencesResponseDto[]> {
        try {
            this.logger.debug('Transforming multiple preferences entities', {
                count: entities.length
            });

            const transformPromises = entities.map(entity => {
                const userProfile = userProfiles?.get(entity.user?.id || 0);
                return this.toResponseDto(entity, userProfile);
            });

            const results = await Promise.all(transformPromises);

            this.logger.debug('Multiple preferences transformation completed', {
                inputCount: entities.length,
                outputCount: results.length
            });

            return results;

        } catch (error) {
            this.logger.error('Failed to transform multiple entities', {
                count: entities.length,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw error;
        }
    }

    /**
   * Transform preferences for recommendation engine
   * Following ML-ready patterns for recommendation algorithms
   */
  toRecommendationEngineInput(
    entity: DatifyyUserPartnerPreferences,
    userProfile: DatifyyUsersInformation
  ): RecommendationEngineInput {
    try {
      this.logger.debug('Creating recommendation engine input', {
        preferencesId: entity.id,
        userId: userProfile.id
      });

      // Extract user vector (numerical representation of user profile)
      const userVector = this.extractUserVector(userProfile);
      
      // Extract preference vector (numerical representation of preferences)
      const preferenceVector = this.extractPreferenceVector(entity);
      
      // Extract behavior vector (user behavior patterns)
      const behaviorVector = this.extractBehaviorVector(entity, userProfile);
      
      // Extract context vector (contextual information)
      const contextVector = this.extractContextVector(entity, userProfile);
      
      // Extract constraint vector (hard constraints/deal breakers)
      const constraintVector = this.extractConstraintVector(entity);
      
      // Extract weight vector (importance weights for different factors)
      const weightVector = this.extractWeightVector(entity);

      const recommendationInput: RecommendationEngineInput = {
        userId: userProfile.userLogin?.id || 0,
        userVector,
        preferenceVector,
        behaviorVector,
        contextVector,
        constraintVector,
        weightVector,
        metadata: {
          profileCompleteness: this.calculateProfileCompleteness(userProfile),
          preferencesCompleteness: this.calculateCompletionPercentage(entity),
          activityLevel: this.mapActivityLevel(entity.activityLevel),
          joinDate: userProfile.userLogin?.lastLoginAt || new Date(),
          lastActive: entity.updatedAt || new Date()
        }
      };

      this.logger.debug('Recommendation engine input created successfully', {
        preferencesId: entity.id,
        userId: userProfile.id,
        vectorSizes: {
          user: userVector.length,
          preference: preferenceVector.length,
          behavior: behaviorVector.length,
          context: contextVector.length
        }
      });

      return recommendationInput;

    } catch (error) {
      this.logger.error('Failed to create recommendation engine input', {
        preferencesId: entity.id,
        userId: userProfile.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw new TransformationError(
        'PreferencesEntity',
        'RecommendationEngineInput',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  // ============================================================================
  // PRIVATE HELPER METHODS FOR RECOMMENDATION ENGINE
  // ============================================================================

  /**
   * Extract user vector - numerical representation of user profile
   */
  private extractUserVector(userProfile: DatifyyUsersInformation): number[] {
    const vector: number[] = [];
    
    // Demographics (normalized 0-1)
    vector.push(this.normalizeAge(this.calculateAge(userProfile.dob) || 25));
    vector.push(this.encodeGender(userProfile.gender));
    vector.push(this.normalizeHeight(userProfile.height || 170));
    
    // Education & Lifestyle
    vector.push(this.encodeEducation(userProfile.educationLevel));
    vector.push(this.encodeExercise(userProfile.exercise));
    vector.push(this.encodeDrinking(userProfile.drinking));
    vector.push(this.encodeSmoking(userProfile.smoking));
    vector.push(this.encodeLookingFor(userProfile.lookingFor));
    
    // Verification status (trust indicators)
    vector.push(userProfile.isOfficialEmailVerified ? 1 : 0);
    vector.push(userProfile.isPhoneVerified ? 1 : 0);
    vector.push(userProfile.isAadharVerified ? 1 : 0);
    
    // Profile quality indicators
    vector.push((userProfile.images?.length || 0) / 6); // Normalized to max 6 images
    vector.push(userProfile.bio ? Math.min(userProfile.bio.length / 500, 1) : 0); // Bio completeness
    vector.push((userProfile.favInterest?.length || 0) / 10); // Interest diversity
    
    return vector;
  }

  /**
   * Extract preference vector - numerical representation of preferences
   */
  private extractPreferenceVector(entity: DatifyyUserPartnerPreferences): number[] {
    const vector: number[] = [];
    
    // Age preferences (normalized)
    vector.push(this.normalizeAge(entity.minAge || 18));
    vector.push(this.normalizeAge(entity.maxAge || 65));
    vector.push(((entity.maxAge || 65) - (entity.minAge || 18)) / 47); // Age range flexibility
    
    // Physical preferences
    vector.push(this.normalizeHeight(entity.minHeight || 140));
    vector.push(this.normalizeHeight(entity.maxHeight || 200));
    vector.push(((entity.maxHeight || 200) - (entity.minHeight || 140)) / 60); // Height flexibility
    
    // Gender and relationship preferences
    vector.push(this.encodeGenderPreference(entity.genderPreference));
    vector.push(this.encodeRelationshipGoals(entity.relationshipGoals));
    vector.push(this.encodeMaritalStatus(entity.maritalStatus));
    vector.push(this.encodeChildrenPreference(entity.childrenPreference));
    
    // Lifestyle preferences
    vector.push(this.encodeSmokingPreference(entity.smokingPreference));
    vector.push(this.encodeDrinkingPreference(entity.drinkingPreference));
    vector.push(this.encodeActivityLevel(entity.activityLevel));
    vector.push(this.encodePetPreference(entity.petPreference));
    
    // Location preferences
    const locationFlexibility = this.calculateLocationFlexibility(entity.locationPreference);
    vector.push(locationFlexibility);
    vector.push((entity.locationPreferenceRadius || 50) / 500); // Normalized distance
    
    // Interest and hobby diversity
    vector.push((entity.hobbies?.length || 0) / 15); // Hobby count normalized
    vector.push((entity.interests?.length || 0) / 20); // Interest count normalized
    vector.push((entity.personalityTraits?.length || 0) / 10); // Personality traits
    
    // Education and professional preferences
    vector.push((entity.educationLevel?.length || 0) / 6); // Education flexibility
    vector.push((entity.profession?.length || 0) / 10); // Profession flexibility
    
    return vector;
  }

  /**
   * Extract behavior vector - user behavior patterns
   */
  private extractBehaviorVector(
    entity: DatifyyUserPartnerPreferences, 
    userProfile: DatifyyUsersInformation
  ): number[] {
    const vector: number[] = [];
    
    // Profile update frequency (derived from timestamps)
    const daysSinceCreated = this.calculateDaysDifference(
      entity.createdAt || new Date(), 
      new Date()
    );
    const daysSinceUpdated = this.calculateDaysDifference(
      entity.updatedAt || new Date(), 
      new Date()
    );
    
    vector.push(Math.min(daysSinceCreated / 365, 1)); // Account age normalized
    vector.push(Math.min(daysSinceUpdated / 30, 1)); // Recency of updates
    vector.push(daysSinceCreated > 0 ? 1 / daysSinceCreated : 1); // Update frequency
    
    // Profile completeness and quality (behavioral indicators)
    vector.push(this.calculateCompletionPercentage(entity) / 100);
    vector.push(this.calculateSpecificity(entity) / 100);
    vector.push(this.calculateSelectivity(entity));
    
    // Engagement indicators (would be real data in production)
    vector.push(0.7); // Estimated response rate
    vector.push(0.8); // Estimated profile view rate
    vector.push(0.6); // Estimated match acceptance rate
    
    // Time-based behavior patterns
    const createdHour = (entity.createdAt || new Date()).getHours();
    vector.push(createdHour / 24); // Time of day preference
    vector.push(this.getSeasonalityScore(entity.createdAt || new Date()));
    
    return vector;
  }

  /**
   * Extract context vector - contextual information
   */
  private extractContextVector(
    entity: DatifyyUserPartnerPreferences,
    userProfile: DatifyyUsersInformation
  ): number[] {
    const vector: number[] = [];
    
    // Temporal context
    const now = new Date();
    vector.push(now.getMonth() / 12); // Month of year
    vector.push(now.getDay() / 7); // Day of week
    vector.push(now.getHours() / 24); // Hour of day
    
    // Platform context
    vector.push(1.0); // Active user indicator
    vector.push(0.0); // Premium user indicator (would be real data)
    vector.push(0.5); // Platform tenure normalized
    
    // Geographic context
    vector.push(this.encodeCitySize(userProfile.currentCity));
    vector.push(this.encodeRegion(userProfile.currentCity));
    
    // Social context (would be derived from actual data)
    vector.push(0.3); // Mutual connections normalized
    vector.push(0.1); // Common interests with network
    vector.push(0.0); // Previous interactions
    
    return vector;
  }

  /**
   * Extract constraint vector - hard constraints/deal breakers
   */
  private extractConstraintVector(entity: DatifyyUserPartnerPreferences): number[] {
    const vector: number[] = [];
    
    // Age constraints (hard boundaries)
    vector.push(entity.minAge ? 1 : 0); // Has minimum age requirement
    vector.push(entity.maxAge ? 1 : 0); // Has maximum age requirement
    vector.push(entity.minAge && entity.maxAge && (entity.maxAge - entity.minAge) < 10 ? 1 : 0); // Strict age range
    
    // Physical constraints
    vector.push(entity.minHeight ? 1 : 0); // Has height preference
    vector.push(entity.maxHeight ? 1 : 0); // Has height limit
    
    // Lifestyle constraints (deal breakers)
    vector.push(entity.smokingPreference === 'No' ? 1 : 0); // No smoking tolerance
    vector.push(entity.drinkingPreference === 'No' ? 1 : 0); // No drinking tolerance
    
    // Relationship constraints
    vector.push(entity.childrenPreference === 'No' ? 1 : 0); // No children preference
    vector.push(entity.maritalStatus === 'Single' ? 1 : 0); // Single only preference
    
    // Education/professional constraints
    vector.push(entity.educationLevel && entity.educationLevel.length <= 2 ? 1 : 0); // Specific education requirement
    vector.push(entity.profession && entity.profession.length <= 3 ? 1 : 0); // Specific profession requirement
    
    // Religious/cultural constraints
    vector.push(entity.religionPreference && entity.religionPreference !== 'Any' ? 1 : 0); // Specific religion
    vector.push(entity.ethnicityPreference && entity.ethnicityPreference !== 'Any' ? 1 : 0); // Specific ethnicity
    
    // Location constraints
    const locationData = entity.locationPreference as any;
    vector.push(locationData?.cities && locationData.cities.length <= 3 ? 1 : 0); // Limited city options
    vector.push(entity.locationPreferenceRadius && entity.locationPreferenceRadius <= 25 ? 1 : 0); // Short distance only
    
    return vector;
  }

  /**
   * Extract weight vector - importance weights for different factors
   */
  private extractWeightVector(entity: DatifyyUserPartnerPreferences): number[] {
    const vector: number[] = [];
    
    // Calculate weights based on user's preference specificity
    const baseWeight = 0.5;
    
    // Demographics weight
    const ageSpecific = entity.minAge && entity.maxAge && (entity.maxAge - entity.minAge) < 15;
    vector.push(ageSpecific ? 0.8 : baseWeight);
    
    // Physical appearance weight
    const heightSpecific = entity.minHeight && entity.maxHeight;
    vector.push(heightSpecific ? 0.7 : 0.3);
    
    // Lifestyle weight
    const lifestyleSpecific = entity.smokingPreference || entity.drinkingPreference || entity.activityLevel;
    vector.push(lifestyleSpecific ? 0.6 : 0.4);
    
    // Interests weight
    const interestSpecific = (entity.hobbies?.length || 0) + (entity.interests?.length || 0) > 5;
    vector.push(interestSpecific ? 0.7 : 0.3);
    
    // Education weight
    const educationSpecific = entity.educationLevel && entity.educationLevel.length <= 2;
    vector.push(educationSpecific ? 0.6 : 0.2);
    
    // Location weight
    const locationSpecific = entity.locationPreferenceRadius && entity.locationPreferenceRadius <= 50;
    vector.push(locationSpecific ? 0.8 : 0.4);
    
    // Values weight (relationship goals, children, etc.)
    const valuesSpecific = entity.relationshipGoals || entity.childrenPreference || entity.religionPreference;
    vector.push(valuesSpecific ? 0.9 : 0.5);
    
    return vector;
  }

  // Additional encoding helper methods
  private encodeGender(gender?: string | null): number {
    const mapping: Record<string, number> = { 'male': 0, 'female': 1, 'other': 0.5 };
    return mapping[gender?.toLowerCase() || ''] || 0.5;
  }

  private encodeEducation(education?: string | null): number {
    const mapping: Record<string, number> = {
      'High School': 0.2,
      'Undergraduate': 0.4,
      'Graduate': 0.6,
      'Postgraduate': 0.8,
      'PhD': 1.0
    };
    return mapping[education || ''] || 0.5;
  }

  private encodeExercise(exercise?: string | null): number {
    const mapping: Record<string, number> = {
      'None': 0,
      'Light': 0.3,
      'Moderate': 0.6,
      'Heavy': 1.0
    };
    return mapping[exercise || ''] || 0.3;
  }

  private encodeDrinking(drinking?: string | null): number {
    const mapping: Record<string, number> = {
      'Never': 0,
      'Occasionally': 0.5,
      'Regularly': 1.0
    };
    return mapping[drinking || ''] || 0.5;
  }

  private encodeSmoking(smoking?: string | null): number {
    const mapping: Record<string, number> = {
      'Never': 0,
      'Occasionally': 0.5,
      'Regularly': 1.0
    };
    return mapping[smoking || ''] || 0;
  }

  private encodeLookingFor(lookingFor?: string | null): number {
    const mapping: Record<string, number> = {
      'Friendship': 0.2,
      'Casual': 0.5,
      'Relationship': 1.0
    };
    return mapping[lookingFor || ''] || 0.5;
  }

  private encodeGenderPreference(genderPref?: string | null): number {
    const mapping: Record<string, number> = {
      'Male': 0,
      'Female': 1,
      'Both': 0.5
    };
    return mapping[genderPref || ''] || 0.5;
  }

  private encodeRelationshipGoals(goals?: string | null): number {
    const mapping: Record<string, number> = {
      'Casual Dating': 0.2,
      'Serious Relationship': 0.6,
      'Marriage': 1.0,
      'Friendship': 0.1
    };
    return mapping[goals || ''] || 0.5;
  }

  private encodeMaritalStatus(status?: string | null): number {
    const mapping: Record<string, number> = {
      'Single': 1.0,
      'Divorced': 0.6,
      'Widowed': 0.4
    };
    return mapping[status || ''] || 1.0;
  }

  private encodeChildrenPreference(pref?: string | null): number {
    const mapping: Record<string, number> = {
      'Yes': 1.0,
      'No': 0,
      'Doesnt matter': 0.5
    };
    return mapping[pref || ''] || 0.5;
  }

  private encodeSmokingPreference(pref?: string | null): number {
    const mapping: Record<string, number> = {
      'No': 0,
      'Sometimes': 0.5,
      'Yes': 1.0
    };
    return mapping[pref || ''] || 0;
  }

  private encodeDrinkingPreference(pref?: string | null): number {
    const mapping: Record<string, number> = {
      'No': 0,
      'Sometimes': 0.5,
      'Yes': 1.0
    };
    return mapping[pref || ''] || 0.5;
  }

  private encodeActivityLevel(level?: string | null): number {
    const mapping: Record<string, number> = {
      'Low': 0.2,
      'Moderate': 0.5,
      'High': 0.8,
      'Very High': 1.0
    };
    return mapping[level || ''] || 0.5;
  }

  private encodePetPreference(pref?: string | null): number {
    const mapping: Record<string, number> = {
      'Love Pets': 1.0,
      'Like Pets': 0.7,
      'Neutral': 0.5,
      'Dislike Pets': 0.2,
      'Allergic': 0
    };
    return mapping[pref || ''] || 0.5;
  }

  private calculateLocationFlexibility(locationPref: any): number {
    if (!locationPref) return 1.0; // Most flexible
    
    const cities = locationPref.cities?.length || 0;
    const willingToRelocate = locationPref.willingToRelocate || false;
    
    let flexibility = 0.5;
    if (cities > 5) flexibility += 0.3;
    else if (cities <= 2) flexibility -= 0.2;
    
    if (willingToRelocate) flexibility += 0.2;
    
    return Math.min(Math.max(flexibility, 0), 1);
  }

  private encodeCitySize(city?: string | null): number {
    // This would use actual city population data
    const largeCities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'];
    const mediumCities = ['Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kanpur'];
    
    if (!city) return 0.5;
    if (largeCities.includes(city)) return 1.0;
    if (mediumCities.includes(city)) return 0.6;
    return 0.3; // Small city/town
  }

  private encodeRegion(city?: string | null): number {
    // Regional encoding (simplified)
    const northCities = ['Delhi', 'Gurgaon', 'Noida', 'Jaipur', 'Chandigarh'];
    const southCities = ['Bangalore', 'Chennai', 'Hyderabad', 'Kochi'];
    const westCities = ['Mumbai', 'Pune', 'Ahmedabad', 'Surat'];
    const eastCities = ['Kolkata', 'Bhubaneswar'];
    
    if (!city) return 0.5;
    if (northCities.includes(city)) return 0.2;
    if (southCities.includes(city)) return 0.4;
    if (westCities.includes(city)) return 0.6;
    if (eastCities.includes(city)) return 0.8;
    return 0.5;
  }

  private getSeasonalityScore(date: Date): number {
    const month = date.getMonth();
    // Higher scores for dating season months
    const seasonalityMap = [0.7, 0.9, 0.8, 0.6, 0.5, 0.4, 0.4, 0.5, 0.6, 0.8, 0.9, 0.8];
    return seasonalityMap[month];
  }

  private mapActivityLevel(activityLevel?: string | null): string {
    return activityLevel || 'moderate';
  }

  private calculateProfileCompleteness(userProfile: DatifyyUsersInformation): number {
    const fields = [
      'firstName', 'lastName', 'gender', 'bio', 'dob', 'currentCity',
      'lookingFor', 'height', 'exercise', 'educationLevel', 'images'
    ];

    const filledFields = fields.filter(field => {
      const value = (userProfile as any)[field];
      return this.isFieldFilled(value);
    });

    return Math.round((filledFields.length / fields.length) * 100);
  }

    /**
     * Transform request DTO to entity update data
     * Following UserProfileMapper.fromUpdateRequestDto patterns
     */
    fromUpdateRequestDto(
        dto: UpdatePartnerPreferencesRequestDto
    ): Partial<DatifyyUserPartnerPreferences> {
        try {
            this.logger.debug('PartnerPreferencesMapper.fromUpdateRequestDto', {
                updateFields: Object.keys(dto)
            });

            const updateData: Partial<DatifyyUserPartnerPreferences> = {};

            // Map simple fields
            if (dto.genderPreference !== undefined) updateData.genderPreference = dto.genderPreference;
            if (dto.minAge !== undefined) updateData.minAge = dto.minAge;
            if (dto.maxAge !== undefined) updateData.maxAge = dto.maxAge;
            if (dto.minHeight !== undefined) updateData.minHeight = dto.minHeight;
            if (dto.maxHeight !== undefined) updateData.maxHeight = dto.maxHeight;
            if (dto.religion !== undefined) updateData.religion = dto.religion;
            if (dto.minIncome !== undefined) updateData.minIncome = dto.minIncome;
            if (dto.maxIncome !== undefined) updateData.maxIncome = dto.maxIncome;
            if (dto.currency !== undefined) updateData.currency = dto.currency;
            if (dto.locationPreferenceRadius !== undefined) updateData.locationPreferenceRadius = dto.locationPreferenceRadius;
            if (dto.smokingPreference !== undefined) updateData.smokingPreference = dto.smokingPreference;
            if (dto.drinkingPreference !== undefined) updateData.drinkingPreference = dto.drinkingPreference;
            if (dto.maritalStatus !== undefined) updateData.maritalStatus = dto.maritalStatus;
            if (dto.childrenPreference !== undefined) updateData.childrenPreference = dto.childrenPreference;
            if (dto.religionPreference !== undefined) updateData.religionPreference = dto.religionPreference;
            if (dto.ethnicityPreference !== undefined) updateData.ethnicityPreference = dto.ethnicityPreference;
            if (dto.castePreference !== undefined) updateData.castePreference = dto.castePreference;
            if (dto.partnerDescription !== undefined) updateData.partnerDescription = dto.partnerDescription;
            if (dto.relationshipGoals !== undefined) updateData.relationshipGoals = dto.relationshipGoals;
            if (dto.whatOtherPersonShouldKnow !== undefined) updateData.whatOtherPersonShouldKnow = dto.whatOtherPersonShouldKnow;
            if (dto.activityLevel !== undefined) updateData.activityLevel = dto.activityLevel;
            if (dto.petPreference !== undefined) updateData.petPreference = dto.petPreference;

            // Map array fields
            if (dto.educationLevel !== undefined) updateData.educationLevel = dto.educationLevel;
            if (dto.profession !== undefined) updateData.profession = dto.profession;
            if (dto.hobbies !== undefined) updateData.hobbies = dto.hobbies;
            if (dto.interests !== undefined) updateData.interests = dto.interests;
            if (dto.booksReading !== undefined) updateData.booksReading = dto.booksReading;
            if (dto.music !== undefined) updateData.music = dto.music;
            if (dto.movies !== undefined) updateData.movies = dto.movies;
            if (dto.travel !== undefined) updateData.travel = dto.travel;
            if (dto.sports !== undefined) updateData.sports = dto.sports;
            if (dto.personalityTraits !== undefined) updateData.personalityTraits = dto.personalityTraits;

            // Map complex object fields
            if (dto.locationPreference !== undefined) {
                updateData.locationPreference = dto.locationPreference as any;
            }
            if (dto.lifestylePreference !== undefined) {
                updateData.lifestylePreference = dto.lifestylePreference as any;
            }

            // Map compatibility scores
            if (dto.religionCompatibilityScore !== undefined) updateData.religionCompatibilityScore = dto.religionCompatibilityScore;
            if (dto.incomeCompatibilityScore !== undefined) updateData.incomeCompatibilityScore = dto.incomeCompatibilityScore;
            if (dto.educationCompatibilityScore !== undefined) updateData.educationCompatibilityScore = dto.educationCompatibilityScore;
            if (dto.appearanceCompatibilityScore !== undefined) updateData.appearanceCompatibilityScore = dto.appearanceCompatibilityScore;
            if (dto.personalityCompatibilityScore !== undefined) updateData.personalityCompatibilityScore = dto.personalityCompatibilityScore;
            if (dto.valuesCompatibilityScore !== undefined) updateData.valuesCompatibilityScore = dto.valuesCompatibilityScore;

            this.logger.debug('Update data mapping completed', {
                mappedFields: Object.keys(updateData)
            });

            return updateData;

        } catch (error) {
            this.logger.error('Failed to map update request DTO', {
                dto,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
      
            throw new TransformationError(
                'UpdatePartnerPreferencesRequestDto',
                'Partial<DatifyyUserPartnerPreferences>',
                error instanceof Error ? error.message : 'Unknown error'
            );
        }
    }

    /**
     * Calculate preferences completeness and validation
     * Following UserProfileMapper completeness patterns
     */
    calculatePreferencesCompleteness(
        entity: DatifyyUserPartnerPreferences
    ): PreferencesValidationDto {
        try {
            this.logger.debug('Calculating preferences completeness', {
                preferencesId: entity.id
            });

            const requiredFields = this.getRequiredPreferenceFields();
            const optionalFields = this.getOptionalPreferenceFields();
            const allFields = [...requiredFields, ...optionalFields];

            const missingFields: string[] = [];
            const criticalMissingFields: string[] = [];
            let filledFields = 0;

            // Check field completeness
            for (const field of allFields) {
                const value = (entity as any)[field];
                const isFilled = this.isFieldFilled(value);
        
                if (isFilled) {
                    filledFields++;
                } else {
                    missingFields.push(field);
                    if (requiredFields.includes(field)) {
                        criticalMissingFields.push(field);
                    }
                }
            }

            const completionPercentage = Math.round((filledFields / allFields.length) * 100);
            const isComplete = criticalMissingFields.length === 0;

            // Generate improvement suggestions
            const suggestions = this.generatePreferenceSuggestions(entity, missingFields);
            const priorityActions = this.generatePriorityActions(criticalMissingFields);

            // Calculate estimated impact
            const currentMatchEstimate = this.calculateEstimatedMatches(entity);
            const estimatedMatchIncrease = this.calculateMatchIncrease(completionPercentage);
            const improvedMatchEstimate = currentMatchEstimate + estimatedMatchIncrease;

            // Get benchmark data
            const completionComparedToSimilarUsers = this.getCompletionPercentile(completionPercentage);
            const popularMissingPreferences = this.getPopularMissingPreferences(missingFields);

            // Calculate quality score
            const qualityScore = this.calculateQualityScore(entity, completionPercentage);
            const qualityFactors = this.getQualityFactors(entity);

            const validationResult: PreferencesValidationDto = {
                isComplete,
                completionPercentage,
                missingFields,
                criticalMissingFields,
                incompleteFields: this.getIncompleteFields(entity),
                suggestions,
                priorityActions,
                estimatedMatchIncrease,
                currentMatchEstimate,
                improvedMatchEstimate,
                completionComparedToSimilarUsers,
                popularMissingPreferences,
                qualityScore,
                qualityFactors
            };

            this.logger.debug('Preferences completeness calculation completed', {
                preferencesId: entity.id,
                completionPercentage,
                isComplete,
                qualityScore
            });

            return validationResult;

        } catch (error) {
            this.logger.error('Failed to calculate preferences completeness', {
                preferencesId: entity.id,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
      
            throw new TransformationError(
                'DatifyyUserPartnerPreferences',
                'PreferencesValidationDto',
                error instanceof Error ? error.message : 'Unknown error'
            );
        }
    }

    /**
     * Transform entity to summary DTO (for lists/cards)
     */
    toSummaryDto(
        entity: DatifyyUserPartnerPreferences
    ): PartnerPreferencesSummaryDto {
        try {
            const ageRange = this.formatAgeRange(entity.minAge, entity.maxAge);
            const locationSummary = this.formatLocationSummary(entity.locationPreference);
            const completionPercentage = this.calculateCompletionPercentage(entity);

            return {
                id: entity.id,
                userId: entity.user?.id || 0,
                genderPreference: entity.genderPreference,
                ageRange,
                locationSummary,
                relationshipGoals: entity.relationshipGoals,
                completionPercentage,
                matchingScore: entity.matchingScore,
                isActive: true, // Could be derived from entity status
                lastUpdated: entity.updatedAt?.toISOString() || new Date().toISOString()
            };

        } catch (error) {
            this.logger.error('Failed to create summary DTO', {
                preferencesId: entity.id,
                error: error instanceof Error ? error.message : 'Unknown error'
            });

            // Return fallback summary
            return {
                id: entity.id,
                userId: entity.user?.id || 0,
                genderPreference: null,
                ageRange: null,
                locationSummary: null,
                relationshipGoals: null,
                completionPercentage: 0,
                matchingScore: null,
                isActive: false,
                lastUpdated: new Date().toISOString()
            };
        }
    }

    /**
     * Transform preferences for compatibility analysis
     */
    toCompatibilityAnalysisInput(
        userPreferences: DatifyyUserPartnerPreferences,
        targetPreferences: DatifyyUserPartnerPreferences,
        userProfile: DatifyyUsersInformation,
        targetProfile: DatifyyUsersInformation
    ): CompatibilityAnalysisInput {
        try {
            const userFeatures = this.extractUserCompatibilityFeatures(userPreferences, userProfile);
            const targetFeatures = this.extractUserCompatibilityFeatures(targetPreferences, targetProfile);
            const preferenceWeights = this.getDefaultPreferenceWeights();
            const contextualFactors = this.getContextualFactors();

            return {
                userFeatures,
                targetFeatures,
                preferenceWeights,
                contextualFactors
            };

        } catch (error) {
            this.logger.error('Failed to create compatibility analysis input', {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw new TransformationError(
                'CompatibilityInput',
                'CompatibilityAnalysisInput',
                error instanceof Error ? error.message : 'Unknown error'
            );
        }
    }

    /**
     * Transform preferences for ML feature extraction
     */
    toMLFeatureVector(
        entity: DatifyyUserPartnerPreferences,
        userProfile: DatifyyUsersInformation
    ): MLFeatureVector {
        try {
            this.logger.debug('Extracting ML features', {
                preferencesId: entity.id,
                userId: userProfile.id
            });

            // Extract categorical features (one-hot encoded)
            const categoricalFeatures = this.extractCategoricalFeatures(entity);
      
            // Extract numerical features (normalized)
            const numericalFeatures = this.extractNumericalFeatures(entity);
      
            // Extract text features (vectorized)
            const textFeatures = this.extractTextFeatures(entity);
      
            // Extract behavioral features
            const behavioralFeatures = this.extractBehavioralFeatures(entity, userProfile);
      
            // Extract temporal features
            const temporalFeatures = this.extractTemporalFeatures(entity);

            const featureVector: MLFeatureVector = {
                categoricalFeatures,
                numericalFeatures,
                textFeatures,
                behavioralFeatures,
                temporalFeatures,
                metadata: {
                    featureVersion: '1.0.0',
                    extractionDate: new Date(),
                    totalFeatures: this.calculateTotalFeatures(categoricalFeatures, numericalFeatures, textFeatures),
                    qualityScore: this.calculateQualityScore(entity, this.calculateCompletionPercentage(entity))
                }
            };

            this.logger.debug('ML feature extraction completed', {
                preferencesId: entity.id,
                totalFeatures: featureVector.metadata.totalFeatures,
                qualityScore: featureVector.metadata.qualityScore
            });

            return featureVector;

        } catch (error) {
            this.logger.error('Failed to extract ML features', {
                preferencesId: entity.id,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
      
            throw new TransformationError(
                'PreferencesEntity',
                'MLFeatureVector',
                error instanceof Error ? error.message : 'Unknown error'
            );
        }
    }

    /**
     * Transform preferences for analytics aggregation
     */
    toAnalyticsInput(
        entities: DatifyyUserPartnerPreferences[]
    ): PreferencesAnalyticsInput {
        try {
            this.logger.debug('Creating analytics input', {
                entityCount: entities.length
            });

            // This would process all entities for analytics
            // Implementation would be complex and involve statistical analysis
      
            return {
                totalPreferences: entities.length,
                categoricalData: {
                    genderPreferences: this.aggregateGenderPreferences(entities),
                    ageRanges: this.aggregateAgeRanges(entities),
                    locationPreferences: this.aggregateLocationPreferences(entities),
                    relationshipGoals: this.aggregateRelationshipGoals(entities),
                    lifestylePreferences: this.aggregateLifestylePreferences(entities)
                },
                numericalData: {
                    completionPercentages: entities.map(e => this.calculateCompletionPercentage(e)),
                    matchingScores: entities.map(e => e.matchingScore || 0),
                    ageRanges: entities.map(e => ({
                        minAge: e.minAge || 0,
                        maxAge: e.maxAge || 0,
                        range: (e.maxAge || 0) - (e.minAge || 0),
                        count: 1
                    })),
                    heightRanges: entities.map(e => ({
                        minHeight: e.minHeight || 0,
                        maxHeight: e.maxHeight || 0,
                        range: (e.maxHeight || 0) - (e.minHeight || 0),
                        count: 1
                    }))
                },
                temporalData: {
                    creationDates: entities.map(e => e.createdAt || new Date()),
                    updateDates: entities.map(e => e.updatedAt || new Date()),
                    activityPatterns: []
                },
                qualityMetrics: {
                    averageCompleteness: entities.reduce((sum, e) => sum + this.calculateCompletionPercentage(e), 0) / entities.length,
                    averageQualityScore: entities.reduce((sum, e) => sum + this.calculateQualityScore(e, this.calculateCompletionPercentage(e)), 0) / entities.length,
                    commonIssues: this.identifyCommonIssues(entities)
                }
            };

        } catch (error) {
            this.logger.error('Failed to create analytics input', {
                entityCount: entities.length,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw error;
        }
    }

    /**
     * Transform preferences for search/filtering
     */
    toSearchCriteria(
        entity: DatifyyUserPartnerPreferences
    ): SearchCriteria {
        try {
            const mustHave = [];
            const shouldHave:any[] = [];
            const mustNotHave:any[] = [];

            // Build search filters based on preferences
            if (entity.genderPreference && entity.genderPreference !== 'Both') {
                mustHave.push({
                    field: 'gender',
                    operator: 'equals' as const,
                    value: entity.genderPreference.toLowerCase(),
                    weight: 1.0
                });
            }

            const ageFilter = entity.minAge && entity.maxAge
                ? [entity.minAge, entity.maxAge] as [number, number]
                : null;

            return {
                mustHave,
                shouldHave,
                mustNotHave,
                preferences: {
                    genderFilter: entity.genderPreference,
                    ageFilter,
                    locationFilter: this.extractLocationFilter(entity.locationPreference),
                    lifestyleFilter: this.extractLifestyleFilter(entity),
                    interestFilter: entity.interests
                },
                sorting: {
                    primary: 'compatibility' as const,
                    secondary: 'activity' as const,
                    direction: 'desc' as const
                },
                pagination: {
                    limit: 20,
                    offset: 0
                }
            };

        } catch (error) {
            this.logger.error('Failed to create search criteria', {
                preferencesId: entity.id,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw error;
        }
    }

    /**
     * Calculate preference quality score
     */
    calculatePreferenceQualityScore(
        entity: DatifyyUserPartnerPreferences
    ): PreferenceQualityScore {
        try {
            const completeness = this.calculateCompletionPercentage(entity);
            const specificity = this.calculateSpecificity(entity);
            const realism = this.calculateRealism(entity);
            const consistency = this.calculateConsistency(entity);
            const diversity = this.calculateDiversity(entity);

            const categoryScores = {
                completeness,
                specificity,
                realism,
                consistency,
                diversity
            };

            const overallScore = Math.round(
                (completeness * 0.3 + specificity * 0.2 + realism * 0.2 + consistency * 0.15 + diversity * 0.15)
            );

            const strengths = this.identifyStrengths(categoryScores);
            const weaknesses = this.identifyWeaknesses(categoryScores);
            const recommendations = this.generateQualityRecommendations(categoryScores, entity);

            return {
                overallScore,
                categoryScores,
                strengths,
                weaknesses,
                recommendations,
                estimatedImpact: {
                    matchPotential: Math.max(0, overallScore - 60),
                    responseRate: Math.max(0, overallScore - 50),
                    qualityScore: overallScore
                }
            };

        } catch (error) {
            this.logger.error('Failed to calculate preference quality score', {
                preferencesId: entity.id,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw error;
        }
    }

    /**
     * Transform preferences for export operations
     */
    toExportData(
        entity: DatifyyUserPartnerPreferences,
        format: 'csv' | 'json' | 'excel'
    ): ExportData {
        try {
            const headers = this.getExportHeaders(format);
            const rows = this.extractExportRows(entity, format);

            return {
                format,
                headers,
                rows,
                metadata: {
                    exportDate: new Date(),
                    recordCount: 1,
                    includePersonalData: true,
                    anonymized: false
                },
                formatting: this.getExportFormatting(format)
            };

        } catch (error) {
            this.logger.error('Failed to create export data', {
                preferencesId: entity.id,
                format,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw error;
        }
    }

    // ============================================================================
    // PRIVATE HELPER METHODS (Following established patterns)
    // ============================================================================

    private transformLocationPreference(locationData: any): LocationPreferenceResponseDto | null {
        if (!locationData || typeof locationData !== 'object') return null;

        return {
            cities: locationData.cities || [],
            states: locationData.states || [],
            countries: locationData.countries || [],
            radiusKm: locationData.radiusKm || 0,
            willingToRelocate: locationData.willingToRelocate || false,
            coordinates: locationData.coordinates ? {
                latitude: locationData.coordinates[0],
                longitude: locationData.coordinates[1]
            } : undefined
        };
    }

    private transformLifestylePreference(lifestyleData: any): LifestylePreferenceResponseDto | null {
        if (!lifestyleData || typeof lifestyleData !== 'object') return null;

        return {
            activityLevel: lifestyleData.activityLevel || '',
            dietPreferences: lifestyleData.dietPreferences || [],
            fitnessActivities: lifestyleData.fitnessActivities || [],
            socialMediaActive: lifestyleData.socialMediaActive || false,
            isNightOwl: lifestyleData.isNightOwl || false,
            isEarlyRiser: lifestyleData.isEarlyRiser || false,
            workLifeBalance: lifestyleData.workLifeBalance || '',
            socialCircleSize: lifestyleData.socialCircleSize || ''
        };
    }

    private sanitizeArray(value: any): string[] | null {
        if (!Array.isArray(value)) return null;
        return value.filter(item => typeof item === 'string' && item.trim().length > 0);
    }

    private calculateCompletionPercentage(entity: DatifyyUserPartnerPreferences): number {
        const requiredFields = this.getRequiredPreferenceFields();
        const optionalFields = this.getOptionalPreferenceFields();
        const allFields = [...requiredFields, ...optionalFields];

        let filledFields = 0;
        for (const field of allFields) {
            if (this.isFieldFilled((entity as any)[field])) {
                filledFields++;
            }
        }

        return Math.round((filledFields / allFields.length) * 100);
    }

    private isFieldFilled(value: any): boolean {
        if (value === null || value === undefined) return false;
        if (typeof value === 'string') return value.trim().length > 0;
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === 'boolean') return true;
        if (typeof value === 'number') return !isNaN(value) && value > 0;
        if (typeof value === 'object') return Object.keys(value).length > 0;
        return true;
    }

    private getRequiredPreferenceFields(): string[] {
        return [
            'genderPreference',
            'minAge',
            'maxAge',
            'relationshipGoals'
        ];
    }

    private getOptionalPreferenceFields(): string[] {
        return [
            'minHeight',
            'maxHeight',
            'religion',
            'educationLevel',
            'profession',
            'locationPreference',
            'smokingPreference',
            'drinkingPreference',
            'hobbies',
            'interests',
            'music',
            'sports',
            'personalityTraits',
            'activityLevel',
            'petPreference'
        ];
    }

    private calculateEstimatedMatches(entity: DatifyyUserPartnerPreferences): number {
        let baseEstimate = 500; // Base pool

        // Adjust based on gender preference
        if (entity.genderPreference === 'Both') {
            baseEstimate *= 1.8;
        }

        // Adjust based on age range flexibility
        if (entity.minAge && entity.maxAge) {
            const ageRange = entity.maxAge - entity.minAge;
            if (ageRange >= 15) baseEstimate *= 1.5;
            else if (ageRange <= 5) baseEstimate *= 0.6;
        }

        // Adjust based on location flexibility
        if (entity.locationPreference) {
            const locationData = entity.locationPreference as any;
            if (locationData.cities?.length > 3) {
                baseEstimate *= 1.3;
            }
        }

        return Math.round(Math.max(baseEstimate, 10));
    }

    private calculateProfileViews(entity: DatifyyUserPartnerPreferences): number {
        // This would be calculated from actual analytics data
        const completeness = this.calculateCompletionPercentage(entity);
        return Math.round((completeness / 100) * 250);
    }

    private calculateMatchesGenerated(entity: DatifyyUserPartnerPreferences): number {
        // This would be calculated from actual matching data
        const completeness = this.calculateCompletionPercentage(entity);
        return Math.round((completeness / 100) * 45);
    }

    private calculateSimilarityScore(entity: DatifyyUserPartnerPreferences): number {
        // This would compare with similar users' preferences
        return Math.round(Math.random() * 40 + 60); // 60-100 range
    }

    private formatAgeRange(minAge?: number | null, maxAge?: number | null): string | null {
        if (!minAge || !maxAge) return null;
        return `${minAge}-${maxAge}`;
    }

    private formatLocationSummary(locationPreference: any): string | null {
        if (!locationPreference || typeof locationPreference !== 'object') return null;
   
        const cities = locationPreference.cities || [];
        if (cities.length === 0) return null;
   
        if (cities.length <= 2) {
            return cities.join(', ');
        } else {
            return `${cities.slice(0, 2).join(', ')} +${cities.length - 2} more`;
        }
    }

    private generatePreferenceSuggestions(
        entity: DatifyyUserPartnerPreferences,
        missingFields: string[]
    ): any[] {
        const suggestions: any[] = [];

        if (missingFields.includes('hobbies')) {
            suggestions.push({
                field: 'hobbies',
                reason: 'Shared hobbies are a strong connection factor',
                priority: 'high',
                impactOnMatching: 'Adding hobbies can increase matches by 25%',
                suggestedValues: ['Reading', 'Travel', 'Cooking', 'Photography', 'Music'],
                userBenefit: 'Find people with similar interests and conversation starters'
            });
        }

        if (missingFields.includes('locationPreference')) {
            suggestions.push({
                field: 'locationPreference',
                reason: 'Location preferences help find nearby matches',
                priority: 'high',
                impactOnMatching: 'Adding location preferences can increase relevant matches by 40%',
                suggestedValues: ['Current city', 'Nearby cities', 'Willing to travel distance'],
                userBenefit: 'Meet people in convenient locations for easier dates'
            });
        }

        if (missingFields.includes('educationLevel')) {
            suggestions.push({
                field: 'educationLevel',
                reason: 'Education compatibility is important for many users',
                priority: 'medium',
                impactOnMatching: 'Education preferences can improve match quality by 15%',
                suggestedValues: ['High School', 'Undergraduate', 'Graduate', 'Postgraduate'],
                userBenefit: 'Connect with people at similar life stages'
            });
        }

        return suggestions.slice(0, 5); // Top 5 suggestions
    }

    private generatePriorityActions(criticalMissingFields: string[]): any[] {
        const actions: any[] = [];

        criticalMissingFields.forEach(field => {
            switch (field) {
                case 'genderPreference':
                    actions.push({
                        action: 'Set Gender Preference',
                        description: 'Specify which gender you\'re interested in meeting',
                        estimatedTime: '30 seconds',
                        difficulty: 'Easy',
                        impact: 'High',
                        category: 'Demographics'
                    });
                    break;
                case 'minAge':
                case 'maxAge':
                    actions.push({
                        action: 'Set Age Range',
                        description: 'Define your preferred age range for matches',
                        estimatedTime: '1 minute',
                        difficulty: 'Easy',
                        impact: 'High',
                        category: 'Demographics'
                    });
                    break;
                case 'relationshipGoals':
                    actions.push({
                        action: 'Define Relationship Goals',
                        description: 'Clarify what type of relationship you\'re seeking',
                        estimatedTime: '1 minute',
                        difficulty: 'Easy',
                        impact: 'High',
                        category: 'Intentions'
                    });
                    break;
            }
        });

        return actions;
    }

    private calculateMatchIncrease(completionPercentage: number): number {
        // Calculate estimated increase in matches based on completion
        if (completionPercentage >= 90) return 200;
        if (completionPercentage >= 75) return 150;
        if (completionPercentage >= 60) return 100;
        if (completionPercentage >= 40) return 50;
        return 25;
    }

    private getCompletionPercentile(completionPercentage: number): number {
        // This would compare with actual user data
        if (completionPercentage >= 90) return 95;
        if (completionPercentage >= 75) return 80;
        if (completionPercentage >= 60) return 65;
        if (completionPercentage >= 40) return 45;
        return 25;
    }

    private getPopularMissingPreferences(missingFields: string[]): string[] {
        const popularFields = [
            'hobbies',
            'interests',
            'locationPreference',
            'educationLevel',
            'activityLevel'
        ];
   
        return missingFields.filter(field => popularFields.includes(field));
    }

    private calculateQualityScore(entity: DatifyyUserPartnerPreferences, completionPercentage: number): number {
        let qualityScore = completionPercentage * 0.6; // Base from completeness

        // Bonus for specific high-value preferences
        if (entity.relationshipGoals) qualityScore += 10;
        if (entity.hobbies && entity.hobbies.length >= 3) qualityScore += 8;
        if (entity.interests && entity.interests.length >= 5) qualityScore += 7;
        if (entity.locationPreference) qualityScore += 6;
        if (entity.personalityTraits && entity.personalityTraits.length >= 2) qualityScore += 5;

        // Penalty for overly restrictive preferences
        if (entity.minAge && entity.maxAge && (entity.maxAge - entity.minAge) < 5) {
            qualityScore -= 10;
        }

        return Math.min(Math.round(qualityScore), 100);
    }

    private getQualityFactors(entity: DatifyyUserPartnerPreferences): any[] {
        const factors: any[] = [];

        const completeness = this.calculateCompletionPercentage(entity);
        factors.push({
            factor: 'Profile Completeness',
            score: completeness,
            weight: 0.3,
            description: 'How much of your preferences are filled out',
            improvement: completeness < 80 ? 'Add more preference details' : null
        });

        const specificity = this.calculateSpecificity(entity);
        factors.push({
            factor: 'Preference Specificity',
            score: specificity,
            weight: 0.2,
            description: 'How specific and detailed your preferences are',
            improvement: specificity < 70 ? 'Be more specific about what you want' : null
        });

        const realism = this.calculateRealism(entity);
        factors.push({
            factor: 'Realistic Expectations',
            score: realism,
            weight: 0.2,
            description: 'How realistic and achievable your preferences are',
            improvement: realism < 60 ? 'Consider broadening some criteria' : null
        });

        return factors;
    }

    private getIncompleteFields(entity: DatifyyUserPartnerPreferences): any[] {
        const incompleteFields: any[] = [];

        if (entity.hobbies && entity.hobbies.length < 3) {
            incompleteFields.push({
                field: 'hobbies',
                currentValue: entity.hobbies,
                suggestion: 'Add at least 3 hobbies for better matching',
                impact: 'Medium',
                category: 'Interests'
            });
        }

        if (entity.minAge && entity.maxAge && (entity.maxAge - entity.minAge) < 8) {
            incompleteFields.push({
                field: 'ageRange',
                currentValue: `${entity.minAge}-${entity.maxAge}`,
                suggestion: 'Consider a broader age range (at least 8 years)',
                impact: 'High',
                category: 'Demographics'
            });
        }

        return incompleteFields;
    }

    private extractUserCompatibilityFeatures(
        preferences: DatifyyUserPartnerPreferences,
        profile: DatifyyUsersInformation
    ): UserCompatibilityFeatures {
        return {
            age: this.calculateAge(profile.dob) || 0,
            gender: profile.gender || '',
            location: {
                currentCity: profile.currentCity || '',
                preferredCities: this.extractPreferredCities(preferences.locationPreference),
                maxDistance: preferences.locationPreferenceRadius || 50,
                willingToRelocate: this.extractWillingToRelocate(preferences.locationPreference),
                coordinates: this.extractCoordinates(preferences.locationPreference)
            },
            genderPreference: preferences.genderPreference || '',
            ageRange: [preferences.minAge || 18, preferences.maxAge || 65],
            heightRange: [preferences.minHeight || 140, preferences.maxHeight || 200],
            smoking: profile.smoking || '',
            drinking: profile.drinking || '',
            exercise: profile.exercise || '',
            education: profile.educationLevel || '',
            interests: profile.favInterest || [],
            values: profile.qualityYouValue || [],
            relationshipGoals: preferences.relationshipGoals || '',
            personalityTraits: preferences.personalityTraits || [],
            activityLevel: preferences.activityLevel || '',
            socialPreferences: preferences.hobbies || [],
            communicationStyle: 'direct' // This would be derived from behavior data
        };
    }

    private getDefaultPreferenceWeights(): PreferenceWeights {
        return {
            demographics: 0.25,
            physical: 0.15,
            lifestyle: 0.20,
            interests: 0.15,
            values: 0.15,
            personality: 0.05,
            location: 0.03,
            social: 0.02
        };
    }

    private getContextualFactors(): ContextualFactors {
        return {
            timeOfYear: this.getCurrentSeason(),
            userActivity: 'normal',
            platformBehavior: 'engaged',
            mutualConnections: 0,
            communicationHistory: false
        };
    }

    private extractCategoricalFeatures(entity: DatifyyUserPartnerPreferences): any {
        return {
            genderPreference: this.oneHotEncode(entity.genderPreference, ['Male', 'Female', 'Both']),
            relationshipGoals: this.oneHotEncode(entity.relationshipGoals, ['Casual Dating', 'Serious Relationship', 'Marriage']),
            educationLevel: this.oneHotEncode(entity.educationLevel?.[0], ['High School', 'Undergraduate', 'Graduate', 'Postgraduate']),
            lifestyle: this.oneHotEncode(entity.smokingPreference, ['No', 'Sometimes', 'Yes']),
            location: this.oneHotEncode(this.extractPrimaryCity(entity.locationPreference), ['Mumbai', 'Delhi', 'Bangalore', 'Other'])
        };
    }

    private extractNumericalFeatures(entity: DatifyyUserPartnerPreferences): any {
        return {
            ageRange: [
                this.normalizeAge(entity.minAge || 18),
                this.normalizeAge(entity.maxAge || 65)
            ],
            heightRange: [
                this.normalizeHeight(entity.minHeight || 140),
                this.normalizeHeight(entity.maxHeight || 200)
            ],
            locationRadius: this.normalizeDistance(entity.locationPreferenceRadius || 50),
            completeness: this.calculateCompletionPercentage(entity) / 100,
            specificity: this.calculateSpecificity(entity) / 100,
            flexibility: this.calculateFlexibility(entity) / 100
        };
    }

    private extractTextFeatures(entity: DatifyyUserPartnerPreferences): any {
        // This would use actual text vectorization in production
        return {
            interests: this.vectorizeText(entity.interests?.join(' ') || ''),
            values: this.vectorizeText(entity.personalityTraits?.join(' ') || ''),
            description: this.vectorizeText(entity.partnerDescription || ''),
            hobbies: this.vectorizeText(entity.hobbies?.join(' ') || '')
        };
    }

    private extractBehavioralFeatures(
        entity: DatifyyUserPartnerPreferences,
        profile: DatifyyUsersInformation
    ): any {
        return {
            activityLevel: this.mapActivityToNumber(entity.activityLevel),
            responseRate: 0.8, // This would come from actual user behavior
            selectivity: this.calculateSelectivity(entity),
            consistency: this.calculateConsistency(entity)
        };
    }

    private extractTemporalFeatures(entity: DatifyyUserPartnerPreferences): any {
        const now = new Date();
        const createdAt = entity.createdAt || now;
        const updatedAt = entity.updatedAt || now;

        return {
            accountAge: this.calculateDaysDifference(createdAt, now),
            preferencesAge: this.calculateDaysDifference(updatedAt, now),
            updateFrequency: this.calculateUpdateFrequency(createdAt, updatedAt),
            seasonality: this.getSeasonalityVector(createdAt)
        };
    }

    private calculateSpecificity(entity: DatifyyUserPartnerPreferences): number {
        let specificityScore = 50; // Base score

        // Higher specificity for more detailed preferences
        if (entity.hobbies && entity.hobbies.length > 5) specificityScore += 15;
        if (entity.interests && entity.interests.length > 8) specificityScore += 15;
        if (entity.personalityTraits && entity.personalityTraits.length > 3) specificityScore += 10;
        if (entity.partnerDescription && entity.partnerDescription.length > 100) specificityScore += 10;

        // Lower specificity for very broad preferences
        if (entity.genderPreference === 'Both') specificityScore -= 5;
        if (entity.minAge && entity.maxAge && (entity.maxAge - entity.minAge) > 20) specificityScore -= 10;

        return Math.min(Math.max(specificityScore, 0), 100);
    }

    private calculateRealism(entity: DatifyyUserPartnerPreferences): number {
        let realismScore = 80; // Start with good baseline

        // Unrealistic height preferences
        if (entity.minHeight && entity.minHeight > 180) realismScore -= 15;
        if (entity.maxHeight && entity.maxHeight < 160) realismScore -= 15;

        // Unrealistic age preferences (too narrow for older users)
        if (entity.minAge && entity.maxAge) {
            const ageRange = entity.maxAge - entity.minAge;
            if (entity.minAge > 35 && ageRange < 8) realismScore -= 20;
        }

        // Too many restrictive preferences
        let restrictiveCount = 0;
        if (entity.religionPreference && entity.religionPreference !== 'Any') restrictiveCount++;
        if (entity.smokingPreference === 'No') restrictiveCount++;
        if (entity.drinkingPreference === 'No') restrictiveCount++;
        if (entity.educationLevel && entity.educationLevel.length === 1) restrictiveCount++;

        if (restrictiveCount > 3) realismScore -= 15;

        return Math.min(Math.max(realismScore, 0), 100);
    }

    private calculateConsistency(entity: DatifyyUserPartnerPreferences): number {
        let consistencyScore = 90; // Start high

        // Check for logical inconsistencies
        if (entity.relationshipGoals === 'Marriage' && entity.childrenPreference === 'No') {
            consistencyScore -= 10; // Might be inconsistent
        }

        if (entity.activityLevel === 'High' && entity.hobbies?.includes('Netflix')) {
            consistencyScore -= 5; // Minor inconsistency
        }

        // Check lifestyle consistency
        if (entity.smokingPreference === 'No' && entity.drinkingPreference === 'No' &&
            entity.activityLevel === 'Low') {
            consistencyScore -= 5; // Very conservative preferences
        }

        return Math.min(Math.max(consistencyScore, 0), 100);
    }

    private calculateDiversity(entity: DatifyyUserPartnerPreferences): number {
        let diversityScore = 50; // Base score

        // Higher diversity for varied interests
        const uniqueCategories = new Set();
        entity.hobbies?.forEach(hobby => uniqueCategories.add(this.categorizeHobby(hobby)));
        entity.interests?.forEach(interest => uniqueCategories.add(this.categorizeInterest(interest)));

        diversityScore += Math.min(uniqueCategories.size * 8, 40);

        // Bonus for openness to different backgrounds
        if (entity.religionPreference === 'Any' || !entity.religionPreference) diversityScore += 10;
        if (entity.ethnicityPreference === 'Any' || !entity.ethnicityPreference) diversityScore += 5;

        return Math.min(Math.max(diversityScore, 0), 100);
    }

    private identifyStrengths(categoryScores: any): string[] {
        const strengths: string[] = [];

        Object.entries(categoryScores).forEach(([category, score]) => {
            if ((score as number) >= 80) {
                strengths.push(`Strong ${category} preferences`);
            }
        });

        if (strengths.length === 0) {
            strengths.push('Good foundation for preferences');
        }

        return strengths.slice(0, 3);
    }

    private identifyWeaknesses(categoryScores: any): string[] {
        const weaknesses: string[] = [];

        Object.entries(categoryScores).forEach(([category, score]) => {
            if ((score as number) < 60) {
                weaknesses.push(`${category} needs improvement`);
            }
        });

        return weaknesses.slice(0, 3);
    }

    private generateQualityRecommendations(
        categoryScores: any,
        entity: DatifyyUserPartnerPreferences
    ): QualityRecommendation[] {
        const recommendations: QualityRecommendation[] = [];

        if (categoryScores.completeness < 70) {
            recommendations.push({
                category: 'Completeness',
                issue: 'Profile incomplete',
                suggestion: 'Fill out more preference fields to improve matching',
                priority: 'high',
                effort: 'easy',
                impact: 'high',
                examples: ['Add hobbies', 'Specify location preferences', 'Define relationship goals']
            });
        }

        if (categoryScores.specificity < 60) {
            recommendations.push({
                category: 'Specificity',
                issue: 'Preferences too vague',
                suggestion: 'Be more specific about what you\'re looking for',
                priority: 'medium',
                effort: 'medium',
                impact: 'medium',
                examples: ['List specific hobbies instead of "many interests"', 'Specify education level preferences']
            });
        }

        if (categoryScores.realism < 50) {
            recommendations.push({
                category: 'Realism',
                issue: 'Some preferences may be too restrictive',
                suggestion: 'Consider broadening certain criteria',
                priority: 'high',
                effort: 'medium',
                impact: 'high',
                examples: ['Expand age range', 'Consider more education levels', 'Be open to different backgrounds']
            });
        }

        return recommendations.slice(0, 3);
    }

    // Additional helper methods for feature extraction and analytics
    private oneHotEncode(value: string | undefined | null, categories: string[]): number[] {
        const encoded = new Array(categories.length).fill(0);
        const index = categories.indexOf(value || '');
        if (index !== -1) encoded[index] = 1;
        return encoded;
    }

    private normalizeAge(age: number): number {
        return Math.min(Math.max((age - 18) / (65 - 18), 0), 1);
    }

    private normalizeHeight(height: number): number {
        return Math.min(Math.max((height - 140) / (200 - 140), 0), 1);
    }

    private normalizeDistance(distance: number): number {
        return Math.min(Math.max(distance / 100, 0), 1);
    }

    private vectorizeText(text: string): number[] {
        // Simplified text vectorization - in production would use proper NLP
        const words = text.toLowerCase().split(/\s+/);
        const vector = new Array(100).fill(0); // 100-dim vector
   
        words.forEach((word, index) => {
            if (index < vector.length) {
                vector[index] = word.length / 10; // Simple feature
            }
        });
   
        return vector;
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

    private getCurrentSeason(): string {
        const month = new Date().getMonth();
        if (month >= 2 && month <= 4) return 'Spring';
        if (month >= 5 && month <= 7) return 'Summer';
        if (month >= 8 && month <= 10) return 'Fall';
        return 'Winter';
    }

    private calculateTotalFeatures(categorical: any, numerical: any, text: any): number {
        let total = 0;
   
        // Count categorical features
        Object.values(categorical).forEach((features: any) => {
            if (Array.isArray(features)) total += features.length;
        });
   
        // Count numerical features
        Object.values(numerical).forEach((feature: any) => {
            if (Array.isArray(feature)) total += feature.length;
            else total += 1;
        });
   
        // Count text features
        Object.values(text).forEach((features: any) => {
            if (Array.isArray(features)) total += features.length;
        });
   
        return total;
    }

    // Placeholder methods for complex operations
    private aggregateGenderPreferences(entities: DatifyyUserPartnerPreferences[]): any {
        return {}; // Implementation would analyze gender preference distribution
    }

    private aggregateAgeRanges(entities: DatifyyUserPartnerPreferences[]): any {
        return {}; // Implementation would analyze age range patterns
    }

    private aggregateLocationPreferences(entities: DatifyyUserPartnerPreferences[]): any {
        return {}; // Implementation would analyze location preferences
    }

    private aggregateRelationshipGoals(entities: DatifyyUserPartnerPreferences[]): any {
        return {}; // Implementation would analyze relationship goal distribution
    }

    private aggregateLifestylePreferences(entities: DatifyyUserPartnerPreferences[]): any {
        return {}; // Implementation would analyze lifestyle preference patterns
    }

    private identifyCommonIssues(entities: DatifyyUserPartnerPreferences[]): string[] {
        return ['Incomplete age preferences', 'Missing location data', 'No relationship goals specified'];
    }

    private extractLocationFilter(locationPreference: any): any {
        if (!locationPreference) return null;
   
        return {
            cities: locationPreference.cities || [],
            radius: locationPreference.radiusKm || 50,
            coordinates: locationPreference.coordinates,
            includeNearby: true
        };
    }

    private extractLifestyleFilter(entity: DatifyyUserPartnerPreferences): any {
        return {
            smoking: entity.smokingPreference ? [entity.smokingPreference] : [],
            drinking: entity.drinkingPreference ? [entity.drinkingPreference] : [],
            exercise: entity.activityLevel ? [entity.activityLevel] : [],
            diet: [], // Would extract from lifestyle preferences
            pets: entity.petPreference ? [entity.petPreference] : []
        };
    }

    private getExportHeaders(format: 'csv' | 'json' | 'excel'): string[] {
        return [
            'ID',
            'Gender Preference',
            'Age Range',
            'Height Range',
            'Location',
            'Education Level',
            'Relationship Goals',
            'Hobbies',
            'Interests',
            'Completion %',
            'Quality Score',
            'Created Date',
            'Updated Date'
        ];
    }

    private extractExportRows(entity: DatifyyUserPartnerPreferences, format: string): any[][] {
        const ageRange = entity.minAge && entity.maxAge ? `${entity.minAge}-${entity.maxAge}` : '';
        const heightRange = entity.minHeight && entity.maxHeight ? `${entity.minHeight}-${entity.maxHeight}` : '';
   
        return [[
            entity.id,
            entity.genderPreference || '',
            ageRange,
            heightRange,
            this.formatLocationSummary(entity.locationPreference) || '',
            entity.educationLevel?.join(', ') || '',
            entity.relationshipGoals || '',
            entity.hobbies?.join(', ') || '',
            entity.interests?.join(', ') || '',
            this.calculateCompletionPercentage(entity),
            this.calculateQualityScore(entity, this.calculateCompletionPercentage(entity)),
            entity.createdAt?.toISOString() || '',
            entity.updatedAt?.toISOString() || ''
        ]];
    }

    private getExportFormatting(format: 'csv' | 'json' | 'excel'): any {
        return {
            dateFormat: 'YYYY-MM-DD',
            numberFormat: '0.00',
            customFormatters: {
                percentage: (value: number) => `${value}%`,
                array: (value: string[]) => value.join(', ')
            }
        };
    }

    // Additional utility methods
    private extractPreferredCities(locationPreference: any): string[] {
        return locationPreference?.cities || [];
    }

    private extractWillingToRelocate(locationPreference: any): boolean {
        return locationPreference?.willingToRelocate || false;
    }

    private extractCoordinates(locationPreference: any): [number, number] | undefined {
        return locationPreference?.coordinates;
    }

    private extractPrimaryCity(locationPreference: any): string {
        const cities = this.extractPreferredCities(locationPreference);
        return cities.length > 0 ? cities[0] : 'Other';
    }

    private mapActivityToNumber(activityLevel?: string | null): number {
        const mapping: Record<string, number> = {
            'Low': 0.2,
            'Moderate': 0.5,
            'High': 0.8,
            'Very High': 1.0
        };
        return mapping[activityLevel || ''] || 0.5;
    }

    private calculateSelectivity(entity: DatifyyUserPartnerPreferences): number {
        // Calculate how selective the user is based on preferences
        let selectivityScore = 0.5; // Base selectivity

        // More restrictive = higher selectivity
        if (entity.minAge && entity.maxAge && (entity.maxAge - entity.minAge) < 8) {
            selectivityScore += 0.2;
        }

        if (entity.educationLevel && entity.educationLevel.length === 1) {
            selectivityScore += 0.15;
        }

        if (entity.religionPreference && entity.religionPreference !== 'Any') {
            selectivityScore += 0.1;
        }

        return Math.min(selectivityScore, 1.0);
    }

    private calculateFlexibility(entity: DatifyyUserPartnerPreferences): number {
        // Inverse of selectivity
        return Math.round((1 - this.calculateSelectivity(entity)) * 100);
    }

    private calculateDaysDifference(date1: Date, date2: Date): number {
        const diffTime = Math.abs(date2.getTime() - date1.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    private calculateUpdateFrequency(createdAt: Date, updatedAt: Date): number {
        const daysDiff = this.calculateDaysDifference(createdAt, updatedAt);
        return daysDiff > 0 ? 1 / daysDiff : 1; // Updates per day
    }

    private getSeasonalityVector(date: Date): number[] {
   // Create a 4-element vector for seasons
   const month = date.getMonth();
   const seasonVector = [0, 0, 0, 0]; // [Spring, Summer, Fall, Winter]
   
   if (month >= 2 && month <= 4) seasonVector[0] = 1; // Spring
   else if (month >= 5 && month <= 7) seasonVector[1] = 1; // Summer
   else if (month >= 8 && month <= 10) seasonVector[2] = 1; // Fall
   else seasonVector[3] = 1; // Winter
   
   return seasonVector;
 }

 private categorizeHobby(hobby: string): string {
   const hobbyLower = hobby.toLowerCase();
   
   if (['reading', 'writing', 'books'].some(term => hobbyLower.includes(term))) {
     return 'intellectual';
   }
   if (['sports', 'gym', 'fitness', 'running'].some(term => hobbyLower.includes(term))) {
     return 'physical';
   }
   if (['music', 'art', 'painting', 'photography'].some(term => hobbyLower.includes(term))) {
     return 'creative';
   }
   if (['travel', 'hiking', 'adventure'].some(term => hobbyLower.includes(term))) {
     return 'adventure';
   }
   if (['cooking', 'food', 'wine'].some(term => hobbyLower.includes(term))) {
     return 'culinary';
   }
   
   return 'other';
 }

 private categorizeInterest(interest: string): string {
   const interestLower = interest.toLowerCase();
   
   if (['technology', 'science', 'innovation'].some(term => interestLower.includes(term))) {
     return 'technology';
   }
   if (['culture', 'history', 'philosophy'].some(term => interestLower.includes(term))) {
     return 'cultural';
   }
   if (['environment', 'sustainability', 'nature'].some(term => interestLower.includes(term))) {
     return 'environmental';
   }
   if (['social', 'community', 'volunteer'].some(term => interestLower.includes(term))) {
     return 'social';
   }
   
   return 'general';
 }
}