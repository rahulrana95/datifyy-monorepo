/**
 * Partner Preferences Response DTOs - Output Data Transfer Objects
 * 
 * Following established codebase patterns:
 * ✅ Clean response structure with consistent metadata
 * ✅ Comprehensive data types for all response scenarios
 * ✅ Performance and analytics data inclusion
 * ✅ Extensible design for future features
 * ✅ Type safety with proper interfaces
 * 
 * @author Staff Engineer - Dating Platform Team
 * @version 1.0.0
 */

// ============================================================================
// CORE RESPONSE INTERFACES
// ============================================================================

/**
 * Main Partner Preferences Response DTO
 * Represents the complete partner preferences data returned to clients
 */
export interface PartnerPreferencesResponseDto {
  id: number;
  
  // Basic Demographics
  genderPreference: string | null;
  minAge: number | null;
  maxAge: number | null;
  
  // Physical Preferences  
  minHeight: number | null;
  maxHeight: number | null;
  
  // Cultural & Religious
  religion: string | null;
  educationLevel: string[] | null;
  profession: string[] | null;
  
  // Financial
  minIncome: string | null;
  maxIncome: string | null;
  currency: string | null;
  
  // Location
  locationPreference: LocationPreferenceResponseDto | null;
  locationPreferenceRadius: number | null;
  
  // Lifestyle
  smokingPreference: string | null;
  drinkingPreference: string | null;
  maritalStatus: string | null;
  childrenPreference: string | null;
  religionPreference: string | null;
  ethnicityPreference: string | null;
  castePreference: string | null;
  
  // Detailed Preferences
  partnerDescription: string | null;
  hobbies: string[] | null;
  interests: string[] | null;
  booksReading: string[] | null;
  music: string[] | null;
  movies: string[] | null;
  travel: string[] | null;
  sports: string[] | null;
  personalityTraits: string[] | null;
  relationshipGoals: string | null;
  lifestylePreference: LifestylePreferenceResponseDto | null;
  whatOtherPersonShouldKnow: string | null;
  activityLevel: string | null;
  petPreference: string | null;
  
  // Compatibility Scores (for ML matching)
  religionCompatibilityScore: number | null;
  incomeCompatibilityScore: number | null;
  educationCompatibilityScore: number | null;
  appearanceCompatibilityScore: number | null;
  personalityCompatibilityScore: number | null;
  valuesCompatibilityScore: number | null;
  matchingScore: number | null;
  
  // Metadata
  completionPercentage: number;
  lastUpdated: string;
  createdAt: string;
  isActive: boolean;
  
  // Analytics & Insights
  estimatedMatches: number;
  profileViews: number;
  matchesGenerated: number;
  preferencesSimilarityScore?: number; // Compared to similar users
}

/**
 * Location Preference Response DTO
 */
export interface LocationPreferenceResponseDto {
  cities: string[];
  states: string[];
  countries: string[];
  radiusKm: number;
  willingToRelocate: boolean;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

/**
 * Lifestyle Preference Response DTO
 */
export interface LifestylePreferenceResponseDto {
  activityLevel: string;
  dietPreferences: string[];
  fitnessActivities: string[];
  socialMediaActive: boolean;
  isNightOwl: boolean;
  isEarlyRiser: boolean;
  workLifeBalance: string;
  socialCircleSize: string;
}

// ============================================================================
// COMPATIBILITY & MATCHING RESPONSES
// ============================================================================

/**
 * Compatibility Result DTO for user-to-user matching
 */
export interface CompatibilityResultDto {
  // Overall Compatibility
  overallScore: number; // 0-100
  compatibilityLevel: 'Low' | 'Medium' | 'High' | 'Excellent';
  isGoodMatch: boolean;
  
  // Detailed Breakdown
  categoryScores: {
    demographics: CompatibilityCategoryDto;
    lifestyle: CompatibilityCategoryDto;
    interests: CompatibilityCategoryDto;
    values: CompatibilityCategoryDto;
    physical: CompatibilityCategoryDto;
    financial: CompatibilityCategoryDto;
    location: CompatibilityCategoryDto;
  };
  
  // Match Insights
  strengths: MatchStrengthDto[];
  concerns: MatchConcernDto[];
  mutualInterests: string[];
  complementaryTraits: string[];
  
  // Actionable Insights
  conversationStarters: string[];
  dateIdeas: string[];
  potentialChallenges: string[];
  
  // Metadata
  calculatedAt: string;
  confidence: number; // How confident we are in this score (0-100)
  dataCompleteness: number; // How complete both profiles are (0-100)
  
  // Mutual Preferences Check
  mutualAttraction: {
    userLikesTarget: boolean;
    targetLikesUser: boolean;
    mutualPreferencesMatch: boolean;
  };
}

/**
 * Compatibility Category DTO
 */
export interface CompatibilityCategoryDto {
  score: number; // 0-100
  weight: number; // Importance weight in overall calculation
  details: {
    matchingFactors: string[];
    conflictingFactors: string[];
    neutralFactors: string[];
  };
  improvement: string | null; // Suggestion for better compatibility
}

/**
 * Match Strength DTO
 */
export interface MatchStrengthDto {
  category: string;
  factor: string;
  impact: 'High' | 'Medium' | 'Low';
  description: string;
  score: number;
}

/**
 * Match Concern DTO
 */
export interface MatchConcernDto {
  category: string;
  concern: string;
  severity: 'High' | 'Medium' | 'Low';
  description: string;
  suggestion: string;
}

// ============================================================================
// ANALYTICS & INSIGHTS RESPONSES
// ============================================================================

/**
 * Preferences Analytics DTO for admin insights
 */
export interface PreferencesAnalyticsDto {
  // Overview
  totalUsersWithPreferences: number;
  averageCompletionPercentage: number;
  
  // Demographic Trends
  demographicTrends: {
    genderPreferences: TrendDataDto[];
    ageRangePreferences: TrendDataDto[];
    locationTrends: TrendDataDto[];
  };
  
  // Lifestyle Trends
  lifestyleTrends: {
    smokingPreferences: TrendDataDto[];
    drinkingPreferences: TrendDataDto[];
    activityLevels: TrendDataDto[];
    relationshipGoals: TrendDataDto[];
  };
  
  // Matching Insights
  matchingInsights: {
    averageMatchingScore: number;
    mostImportantFactors: string[];
    commonDealBreakers: string[];
    successfulMatchPatterns: string[];
  };
  
  // Time-based Analysis
  timeAnalysis: {
    preferenceChangesOverTime: TimeSeriesDataDto[];
    seasonalTrends: SeasonalTrendDto[];
    userEngagementByPreferences: EngagementDataDto[];
  };
  
  // Performance Metrics
  performanceMetrics: {
    averageResponseTime: number; // ms
    cacheHitRate: number; // percentage
    errorRate: number; // percentage
    apiUsage: ApiUsageDto;
  };
}

/**
 * Trend Data DTO
 */
export interface TrendDataDto {
  category: string;
  value: string;
  count: number;
  percentage: number;
  changeFromPrevious: number; // percentage change
  trend: 'increasing' | 'decreasing' | 'stable';
}

/**
 * Time Series Data DTO
 */
export interface TimeSeriesDataDto {
  date: string;
  value: number;
  category: string;
  metadata?: Record<string, any>;
}

/**
 * Seasonal Trend DTO
 */
export interface SeasonalTrendDto {
  season: 'Spring' | 'Summer' | 'Fall' | 'Winter';
  month: number;
  trend: string;
  percentage: number;
  insights: string[];
}

/**
 * Engagement Data DTO
 */
export interface EngagementDataDto {
  preferenceCategory: string;
  userCount: number;
  avgSessionDuration: number;
  conversionRate: number;
  satisfactionScore: number;
}

/**
 * API Usage DTO
 */
export interface ApiUsageDto {
  totalRequests: number;
  requestsPerMinute: number;
  peakUsageTime: string;
  mostUsedEndpoints: {
    endpoint: string;
    count: number;
    percentage: number;
  }[];
}

// ============================================================================
// RECOMMENDATION & DISCOVERY RESPONSES
// ============================================================================

/**
 * User Recommendation DTO for matching
 */
export interface UserRecommendationDto {
  // Basic Info
  userId: number;
  profileId: string;
  firstName: string;
  lastName: string;
  age: number;
  city: string;
  images: string[];
  
  // Matching Data
  compatibilityScore: number;
  matchingReasons: string[];
  mutualInterests: string[];
  complementaryTraits: string[];
  
  // Location & Activity
  distance?: number; // in kilometers
  isOnline: boolean;
  lastActive: string;
  responseRate: number; // percentage
  
  // Engagement Metrics
  profileViews: number;
  likes: number;
  messageResponseTime: number; // average in minutes
  
  // Quick Insights
  quickFacts: string[];
  iceBreakers: string[];
  conversationStarters: string[];
  
  // Verification & Trust
  verificationStatus: {
    email: boolean;
    phone: boolean;
    photo: boolean;
    government: boolean;
  };
  trustScore: number; // 0-100
  
  // Recommendation Metadata
  recommendationReason: 'compatibility' | 'location' | 'activity' | 'interests' | 'premium';
  recommendationStrength: 'High' | 'Medium' | 'Low';
  estimatedMessageSuccessRate: number; // percentage
}

// ============================================================================
// VALIDATION & COMPLETENESS RESPONSES
// ============================================================================

/**
 * Preferences Validation DTO
 */
export interface PreferencesValidationDto {
  // Overall Status
  isComplete: boolean;
  completionPercentage: number;
  
  // Field Analysis
  missingFields: string[];
  criticalMissingFields: string[];
  incompleteFields: IncompleteFieldDto[];
  
  // Improvement Suggestions
  suggestions: PreferenceSuggestionDto[];
  priorityActions: ActionItemDto[];
  
  // Impact Analysis
  estimatedMatchIncrease: number; // percentage increase in potential matches
  currentMatchEstimate: number;
  improvedMatchEstimate: number;
  
  // Benchmarking
  completionComparedToSimilarUsers: number; // percentile
  popularMissingPreferences: string[];
  
  // Quality Score
  qualityScore: number; // 0-100
  qualityFactors: QualityFactorDto[];
}

/**
 * Incomplete Field DTO
 */
export interface IncompleteFieldDto {
  field: string;
  currentValue: any;
  suggestion: string;
  impact: 'High' | 'Medium' | 'Low';
  category: string;
}

/**
 * Preference Suggestion DTO
 */
export interface PreferenceSuggestionDto {
  field: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  impactOnMatching: string;
  suggestedValues: string[];
  userBenefit: string;
}

/**
 * Action Item DTO
 */
export interface ActionItemDto {
  action: string;
  description: string;
  estimatedTime: string; // "2 minutes", "5 minutes"
  difficulty: 'Easy' | 'Medium' | 'Hard';
  impact: 'High' | 'Medium' | 'Low';
  category: string;
}

/**
 * Quality Factor DTO
 */
export interface QualityFactorDto {
  factor: string;
  score: number; // 0-100
  weight: number; // importance
  description: string;
  improvement: string | null;
}

// ============================================================================
// BULK OPERATIONS & ADMIN RESPONSES
// ============================================================================

/**
 * Bulk Update Result DTO
 */
export interface BulkUpdateResultDto {
  // Summary
  totalRequested: number;
  successful: number;
  failed: number;
  
  // Detailed Results
  successfulUpdates: BulkUpdateSuccessDto[];
  failedUpdates: BulkUpdateFailureDto[];
  
  // Performance
  processingTime: number; // milliseconds
  averageProcessingTimePerUpdate: number;
  
  // Metadata
  processedAt: string;
  processedBy: string; // admin user ID
  batchId: string;
}

/**
 * Bulk Update Success DTO
 */
export interface BulkUpdateSuccessDto {
  userId: number;
  preferencesId: number;
  updatedFields: string[];
  previousCompletionPercentage: number;
  newCompletionPercentage: number;
  processingTime: number;
}

/**
 * Bulk Update Failure DTO
 */
export interface BulkUpdateFailureDto {
  userId: number;
  error: string;
  errorCode: string;
  failedFields: string[];
  suggestion: string;
}

// ============================================================================
// EXPORT & IMPORT RESPONSES
// ============================================================================

/**
 * Preferences Export DTO
 */
export interface PreferencesExportDto {
  exportId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  expiresAt?: string;
  format: 'json' | 'csv' | 'excel';
  includedFields: string[];
  filters: Record<string, any>;
  
  // Statistics
  totalRecords: number;
  processedRecords: number;
  fileSize?: number; // bytes
  
  // Timestamps
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  
  // Error Info
  errorMessage?: string;
  failedRecords?: number;
}

// ============================================================================
// PREFERENCE TRENDS & INSIGHTS
// ============================================================================

/**
 * Preference Trends DTO
 */
export interface PreferenceTrendsDto {
  timeframe: string;
  totalUsers: number;
  
  // Trend Analysis
  trends: PreferenceTrendItemDto[];
  emergingTrends: EmergingTrendDto[];
  decliningTrends: DecliningTrendDto[];
  
  // Insights
  insights: TrendInsightDto[];
  recommendations: BusinessRecommendationDto[];
  
  // Comparative Analysis
  cohortComparison: CohortComparisonDto[];
  geographicVariations: GeographicVariationDto[];
}

/**
 * Preference Trend Item DTO
 */
export interface PreferenceTrendItemDto {
  field: string;
  category: string;
  popularValues: TrendValueDto[];
  changeFromPrevious: number; // percentage
  significance: 'High' | 'Medium' | 'Low';
  confidence: number; // 0-100
}

/**
 * Trend Value DTO
 */
export interface TrendValueDto {
  value: any;
  count: number;
  percentage: number;
  growth: number; // percentage change
  rank: number;
}

/**
 * Emerging Trend DTO
 */
export interface EmergingTrendDto {
  trend: string;
  description: string;
  growthRate: number; // percentage
  affectedUsers: number;
  timeToMainstream: string; // "3 months", "6 months"
  businessImpact: 'High' | 'Medium' | 'Low';
}

/**
 * Declining Trend DTO
 */
export interface DecliningTrendDto {
  trend: string;
  description: string;
  declineRate: number; // percentage
  affectedUsers: number;
  reasonsForDecline: string[];
  recommendation: string;
}

/**
 * Trend Insight DTO
 */
export interface TrendInsightDto {
  insight: string;
  category: string;
  impact: 'High' | 'Medium' | 'Low';
  actionable: boolean;
  relatedTrends: string[];
}

/**
 * Business Recommendation DTO
 */
export interface BusinessRecommendationDto {
  recommendation: string;
  category: 'feature' | 'marketing' | 'product' | 'ux';
  priority: 'High' | 'Medium' | 'Low';
  estimatedImpact: string;
  implementationComplexity: 'Easy' | 'Medium' | 'Hard';
  timeframe: string;
}

/**
 * Cohort Comparison DTO
 */
export interface CohortComparisonDto {
  cohort: string;
  description: string;
  userCount: number;
  distinctivePreferences: string[];
  comparisonToAverage: number; // percentage difference
}

/**
 * Geographic Variation DTO
 */
export interface GeographicVariationDto {
  location: string;
  locationType: 'city' | 'state' | 'country';
  userCount: number;
  uniquePreferences: string[];
  culturalFactors: string[];
  marketingOpportunities: string[];
}

// ============================================================================
// STANDARD API RESPONSE WRAPPER
// ============================================================================

/**
 * Standard API Response Wrapper for all partner preferences endpoints
 */
export interface PartnerPreferencesApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    requestId: string;
    timestamp: string;
    responseTime?: string;
    version: string;
    cacheStatus?: 'hit' | 'miss' | 'refresh';
    dataFreshness?: string; // "real-time", "5 minutes old"
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}