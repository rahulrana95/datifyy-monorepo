/**
 * Partner Preferences Mapper Interface
 * 
 * Following established codebase patterns from UserProfileMapper:
 * ✅ Clean interface segregation principle
 * ✅ Proper abstraction for data transformation
 * ✅ Comprehensive mapping contract definitions
 * ✅ Type safety with proper interfaces
 * ✅ Small, focused, testable methods
 * 
 * @author Staff Engineer - Dating Platform Team
 * @version 1.0.0
 */

import { DatifyyUserPartnerPreferences } from '../../../models/entities/DatifyyUserPartnerPreferences';
import { DatifyyUsersInformation } from '../../../models/entities/DatifyyUsersInformation';
import { UpdatePartnerPreferencesRequestDto } from '../dtos/PartnerPreferencesDtos';
import { 
  PartnerPreferencesResponseDto,
  PreferencesValidationDto,
  CompatibilityResultDto
} from '../dtos/PartnerPreferencesResponseDtos';

/**
 * Partner Preferences Mapper Interface
 * 
 * Defines the contract for partner preferences data transformation operations.
 * This interface ensures loose coupling between data layers and provides
 * consistent transformation logic for all preference-related operations.
 */
export interface IPartnerPreferencesMapper {
  /**
   * Transform entity to full response DTO
   * 
   * @param entity - Partner preferences entity from database
   * @param userProfile - User profile entity for context
   * @returns Promise<PartnerPreferencesResponseDto> - Complete preferences response
   */
  toResponseDto(
    entity: DatifyyUserPartnerPreferences,
    userProfile?: DatifyyUsersInformation | null
  ): Promise<PartnerPreferencesResponseDto>;

  /**
   * Transform multiple entities to response DTOs
   * 
   * @param entities - Array of partner preferences entities
   * @param userProfiles - Map of user profiles by user ID for context
   * @returns Promise<PartnerPreferencesResponseDto[]> - Array of preferences responses
   */
  toResponseDtos(
    entities: DatifyyUserPartnerPreferences[],
    userProfiles?: Map<number, DatifyyUsersInformation>
  ): Promise<PartnerPreferencesResponseDto[]>;

  /**
   * Transform request DTO to entity update data
   * 
   * @param dto - Validated preferences update request DTO
   * @returns Partial<DatifyyUserPartnerPreferences> - Entity update data
   */
  fromUpdateRequestDto(
    dto: UpdatePartnerPreferencesRequestDto
  ): Partial<DatifyyUserPartnerPreferences>;

  /**
   * Calculate preferences completeness and validation
   * 
   * @param entity - Partner preferences entity
   * @returns PreferencesValidationDto - Completeness analysis and suggestions
   */
  calculatePreferencesCompleteness(
    entity: DatifyyUserPartnerPreferences
  ): PreferencesValidationDto;

  /**
   * Transform preferences for compatibility analysis
   * 
   * @param userPreferences - Current user's preferences
   * @param targetPreferences - Target user's preferences
   * @param userProfile - Current user's profile
   * @param targetProfile - Target user's profile
   * @returns CompatibilityAnalysisInput - Processed data for compatibility calculation
   */
  toCompatibilityAnalysisInput(
    userPreferences: DatifyyUserPartnerPreferences,
    targetPreferences: DatifyyUserPartnerPreferences,
    userProfile: DatifyyUsersInformation,
    targetProfile: DatifyyUsersInformation
  ): CompatibilityAnalysisInput;

  /**
   * Transform entity to summary DTO (for lists/cards)
   * 
   * @param entity - Partner preferences entity
   * @returns PartnerPreferencesSummaryDto - Lightweight preferences data
   */
  toSummaryDto(
    entity: DatifyyUserPartnerPreferences
  ): PartnerPreferencesSummaryDto;

  /**
   * Transform preferences for analytics aggregation
   * 
   * @param entities - Array of preferences entities
   * @returns PreferencesAnalyticsInput - Processed data for analytics
   */
  toAnalyticsInput(
    entities: DatifyyUserPartnerPreferences[]
  ): PreferencesAnalyticsInput;

  /**
   * Transform preferences for recommendation engine
   * 
   * @param entity - Partner preferences entity
   * @param userProfile - User profile for context
   * @returns RecommendationEngineInput - Processed data for ML recommendations
   */
  toRecommendationEngineInput(
    entity: DatifyyUserPartnerPreferences,
    userProfile: DatifyyUsersInformation
  ): RecommendationEngineInput;

  /**
   * Transform preferences for search/filtering
   * 
   * @param entity - Partner preferences entity
   * @returns SearchCriteria - Processed search filters
   */
  toSearchCriteria(
    entity: DatifyyUserPartnerPreferences
  ): SearchCriteria;

  /**
   * Calculate preference quality score
   * 
   * @param entity - Partner preferences entity
   * @returns PreferenceQualityScore - Quality analysis with improvement suggestions
   */
  calculatePreferenceQualityScore(
    entity: DatifyyUserPartnerPreferences
  ): PreferenceQualityScore;

  /**
   * Transform preferences for ML feature extraction
   * 
   * @param entity - Partner preferences entity
   * @param userProfile - User profile for additional features
   * @returns MLFeatureVector - Numerical features for machine learning
   */
  toMLFeatureVector(
    entity: DatifyyUserPartnerPreferences,
    userProfile: DatifyyUsersInformation
  ): MLFeatureVector;

  /**
   * Transform preferences for export operations
   * 
   * @param entity - Partner preferences entity
   * @param format - Export format ('csv' | 'json' | 'excel')
   * @returns ExportData - Formatted data for export
   */
  toExportData(
    entity: DatifyyUserPartnerPreferences,
    format: 'csv' | 'json' | 'excel'
  ): ExportData;
}

// ============================================================================
// SUPPORTING INTERFACES AND TYPES
// ============================================================================

/**
 * Partner Preferences Summary DTO for lightweight operations
 */
export interface PartnerPreferencesSummaryDto {
  id: number;
  userId: number;
  genderPreference: string | null;
  ageRange: string | null; // "25-35"
  locationSummary: string | null; // "Mumbai, Delhi +2 more"
  relationshipGoals: string | null;
  completionPercentage: number;
  matchingScore: number | null;
  isActive: boolean;
  lastUpdated: string;
}

/**
 * Compatibility Analysis Input for ML algorithms
 */
export interface CompatibilityAnalysisInput {
  userFeatures: UserCompatibilityFeatures;
  targetFeatures: UserCompatibilityFeatures;
  preferenceWeights: PreferenceWeights;
  contextualFactors: ContextualFactors;
}

/**
 * User Compatibility Features
 */
export interface UserCompatibilityFeatures {
  // Demographics
  age: number;
  gender: string;
  location: LocationFeatures;
  
  // Preferences
  genderPreference: string;
  ageRange: [number, number];
  heightRange: [number, number];
  
  // Lifestyle
  smoking: string;
  drinking: string;
  exercise: string;
  education: string;
  
  // Interests & Values
  interests: string[];
  values: string[];
  relationshipGoals: string;
  
  // Personality
  personalityTraits: string[];
  activityLevel: string;
  
  // Social
  socialPreferences: string[];
  communicationStyle: string;
}

/**
 * Preference Weights for compatibility calculation
 */
export interface PreferenceWeights {
  demographics: number;
  physical: number;
  lifestyle: number;
  interests: number;
  values: number;
  personality: number;
  location: number;
  social: number;
}

/**
 * Contextual Factors affecting compatibility
 */
export interface ContextualFactors {
  timeOfYear: string;
  userActivity: string;
  platformBehavior: string;
  mutualConnections: number;
  communicationHistory: boolean;
}

/**
 * Location Features for compatibility analysis
 */
export interface LocationFeatures {
  currentCity: string;
  preferredCities: string[];
  maxDistance: number;
  willingToRelocate: boolean;
  coordinates?: [number, number]; // [lat, lng]
}

/**
 * Preferences Analytics Input for business intelligence
 */
export interface PreferencesAnalyticsInput {
  totalPreferences: number;
  categoricalData: {
    genderPreferences: CategoryDistribution;
    ageRanges: CategoryDistribution;
    locationPreferences: CategoryDistribution;
    relationshipGoals: CategoryDistribution;
    lifestylePreferences: CategoryDistribution;
  };
  numericalData: {
    completionPercentages: number[];
    matchingScores: number[];
    ageRanges: AgeRangeData[];
    heightRanges: HeightRangeData[];
  };
  temporalData: {
    creationDates: Date[];
    updateDates: Date[];
    activityPatterns: ActivityPattern[];
  };
  qualityMetrics: {
    averageCompleteness: number;
    averageQualityScore: number;
    commonIssues: string[];
  };
}

/**
 * Category Distribution for analytics
 */
export interface CategoryDistribution {
  [category: string]: {
    count: number;
    percentage: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  };
}

/**
 * Age Range Data for analytics
 */
export interface AgeRangeData {
  minAge: number;
  maxAge: number;
  range: number;
  count: number;
}

/**
 * Height Range Data for analytics
 */
export interface HeightRangeData {
  minHeight: number;
  maxHeight: number;
  range: number;
  count: number;
}

/**
 * Activity Pattern for temporal analysis
 */
export interface ActivityPattern {
  date: Date;
  action: 'created' | 'updated' | 'viewed' | 'matched';
  count: number;
  metadata?: Record<string, any>;
}

/**
 * Recommendation Engine Input for ML processing
 */
export interface RecommendationEngineInput {
  userId: number;
  userVector: number[]; // Numerical representation of user
  preferenceVector: number[]; // Numerical representation of preferences
  behaviorVector: number[]; // User behavior patterns
  contextVector: number[]; // Contextual information
  constraintVector: number[]; // Hard constraints (deal breakers)
  weightVector: number[]; // Importance weights
  metadata: {
    profileCompleteness: number;
    preferencesCompleteness: number;
    activityLevel: string;
    joinDate: Date;
    lastActive: Date;
  };
}

/**
 * Search Criteria for filtering operations
 */
export interface SearchCriteria {
  mustHave: SearchFilter[];
  shouldHave: SearchFilter[];
  mustNotHave: SearchFilter[];
  preferences: {
    genderFilter: string | null;
    ageFilter: [number, number] | null;
    locationFilter: LocationFilter | null;
    lifestyleFilter: LifestyleFilter | null;
    interestFilter: string[] | null;
  };
  sorting: {
    primary: 'compatibility' | 'distance' | 'activity' | 'score';
    secondary?: 'age' | 'education' | 'lastActive' | 'activity';
    direction: 'asc' | 'desc';
  };
  pagination: {
    limit: number;
    offset: number;
  };
}

/**
 * Search Filter for criteria building
 */
export interface SearchFilter {
  field: string;
  operator: 'equals' | 'in' | 'range' | 'contains' | 'exists';
  value: any;
  weight: number;
}

/**
 * Location Filter for search
 */
export interface LocationFilter {
  cities: string[];
  radius: number;
  coordinates?: [number, number];
  includeNearby: boolean;
}

/**
 * Lifestyle Filter for search
 */
export interface LifestyleFilter {
  smoking: string[];
  drinking: string[];
  exercise: string[];
  diet: string[];
  pets: string[];
}

/**
 * Preference Quality Score for improvement recommendations
 */
export interface PreferenceQualityScore {
  overallScore: number; // 0-100
  categoryScores: {
    completeness: number;
    specificity: number;
    realism: number;
    consistency: number;
    diversity: number;
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: QualityRecommendation[];
  estimatedImpact: {
    matchPotential: number; // Increase in potential matches
    responseRate: number; // Increase in response rate
    qualityScore: number; // Overall quality improvement
  };
}

/**
 * Quality Recommendation for preference improvement
 */
export interface QualityRecommendation {
  category: string;
  issue: string;
  suggestion: string;
  priority: 'high' | 'medium' | 'low';
  effort: 'easy' | 'medium' | 'hard';
  impact: 'high' | 'medium' | 'low';
  examples?: string[];
}

/**
 * ML Feature Vector for machine learning algorithms
 */
export interface MLFeatureVector {
  // Categorical features (one-hot encoded)
  categoricalFeatures: {
    genderPreference: number[];
    relationshipGoals: number[];
    educationLevel: number[];
    lifestyle: number[];
    location: number[];
  };
  
  // Numerical features (normalized)
  numericalFeatures: {
    ageRange: [number, number];
    heightRange: [number, number];
    locationRadius: number;
    completeness: number;
    specificity: number;
    flexibility: number;
  };
  
  // Text features (vectorized)
  textFeatures: {
    interests: number[];
    values: number[];
    description: number[];
    hobbies: number[];
  };
  
  // Behavioral features
  behavioralFeatures: {
    activityLevel: number;
    responseRate: number;
    selectivity: number;
    consistency: number;
  };
  
  // Temporal features
  temporalFeatures: {
    accountAge: number;
    preferencesAge: number;
    updateFrequency: number;
    seasonality: number[];
  };
  
  // Metadata
  metadata: {
    featureVersion: string;
    extractionDate: Date;
    totalFeatures: number;
    qualityScore: number;
  };
}

/**
 * Export Data for different formats
 */
export interface ExportData {
  format: 'csv' | 'json' | 'excel';
  headers: string[];
  rows: any[][];
  metadata: {
    exportDate: Date;
    recordCount: number;
    includePersonalData: boolean;
    anonymized: boolean;
  };
  formatting?: {
    dateFormat?: string;
    numberFormat?: string;
    customFormatters?: Record<string, (value: any) => string>;
  };
}

/**
 * Mapper Error Types for transformation errors
 */
export class MapperError extends Error {
  constructor(
    message: string,
    public readonly operation: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'MapperError';
  }
}

export class InvalidEntityError extends MapperError {
  constructor(entityType: string, reason: string) {
    super(
      `Invalid ${entityType} entity: ${reason}`,
      'entityValidation'
    );
    this.name = 'InvalidEntityError';
  }
}

export class TransformationError extends MapperError {
  constructor(fromType: string, toType: string, reason: string) {
    super(
      `Failed to transform from ${fromType} to ${toType}: ${reason}`,
      'transformation'
    );
    this.name = 'TransformationError';
  }
}

export class IncompleteDataError extends MapperError {
  constructor(requiredFields: string[]) {
    super(
      `Incomplete data for transformation. Missing fields: ${requiredFields.join(', ')}`,
      'dataValidation'
    );
    this.name = 'IncompleteDataError';
  }
}

/**
 * Mapper Configuration Interface for customizable behavior
 */
export interface PartnerPreferencesMapperConfig {
  // Feature flags
  features: {
    enableMLFeatures: boolean;
    enableAnalytics: boolean;
    enableCompatibilityAnalysis: boolean;
    enableQualityScoring: boolean;
  };
  
  // Default values and thresholds
  defaults: {
    completenessThreshold: number;
    qualityScoreThreshold: number;
    compatibilityThreshold: number;
    maxRecommendations: number;
  };
  
  // Validation rules
  validation: {
    strictValidation: boolean;
    allowPartialData: boolean;
    requireUserProfile: boolean;
    validateCompatibility: boolean;
  };
  
  // Performance settings
  performance: {
    enableCaching: boolean;
    cacheExpiry: number;
    batchSize: number;
    parallelProcessing: boolean;
  };
  
  // Privacy settings
  privacy: {
    anonymizeExports: boolean;
    includePersonalData: boolean;
    maskSensitiveFields: boolean;
    auditTransformations: boolean;
  };
}