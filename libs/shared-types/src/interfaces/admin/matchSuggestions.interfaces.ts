/**
 * Match Suggestions Interfaces
 * AI-powered match suggestions and compatibility analysis for admin curation
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */

// =============================================================================
// MATCH SUGGESTION ENUMS
// =============================================================================

/**
 * Match suggestion algorithms
 */
export enum MatchAlgorithm {
  PREFERENCE_BASED = 'preference_based',
  BEHAVIOR_BASED = 'behavior_based',
  COLLABORATIVE_FILTERING = 'collaborative_filtering',
  HYBRID_ML = 'hybrid_ml',
  LOCATION_PROXIMITY = 'location_proximity',
  ACTIVITY_BASED = 'activity_based',
  TRUST_SCORE_WEIGHTED = 'trust_score_weighted',
}

/**
 * Compatibility factors for scoring
 */
export enum CompatibilityFactor {
  AGE_COMPATIBILITY = 'age_compatibility',
  LOCATION_PROXIMITY = 'location_proximity',
  EDUCATION_LEVEL = 'education_level',
  CAREER_COMPATIBILITY = 'career_compatibility',
  LIFESTYLE_ALIGNMENT = 'lifestyle_alignment',
  INTERESTS_OVERLAP = 'interests_overlap',
  VALUES_ALIGNMENT = 'values_alignment',
  COMMUNICATION_STYLE = 'communication_style',
  RELATIONSHIP_GOALS = 'relationship_goals',
  PHYSICAL_PREFERENCES = 'physical_preferences',
  RELIGIOUS_COMPATIBILITY = 'religious_compatibility',
  FAMILY_PLANNING = 'family_planning',
  SOCIAL_HABITS = 'social_habits',
  ACTIVITY_PREFERENCES = 'activity_preferences',
  PERSONALITY_MATCH = 'personality_match',
}

/**
 * Match suggestion status
 */
export enum MatchSuggestionStatus {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  DATE_CREATED = 'date_created',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

/**
 * User availability status for matching
 */
export enum UserAvailabilityStatus {
  AVAILABLE = 'available',
  BUSY = 'busy',
  ON_DATE = 'on_date',
  UNAVAILABLE = 'unavailable',
  PROBATION = 'probation',
  INACTIVE = 'inactive',
}

/**
 * Match confidence levels
 */
export enum MatchConfidenceLevel {
  VERY_LOW = 'very_low',      // < 30%
  LOW = 'low',                // 30-50%
  MEDIUM = 'medium',          // 50-70%
  HIGH = 'high',              // 70-85%
  VERY_HIGH = 'very_high',    // 85-95%
  EXCEPTIONAL = 'exceptional', // > 95%
}

/**
 * Date success prediction categories
 */
export enum DateSuccessPrediction {
  UNLIKELY = 'unlikely',           // < 25%
  POSSIBLE = 'possible',           // 25-50%
  LIKELY = 'likely',               // 50-75%
  VERY_LIKELY = 'very_likely',     // 75-90%
  ALMOST_CERTAIN = 'almost_certain', // > 90%
}

/**
 * Match rejection reasons for learning
 */
export enum MatchRejectionReason {
  COMPATIBILITY_TOO_LOW = 'compatibility_too_low',
  LOCATION_TOO_FAR = 'location_too_far',
  AGE_MISMATCH = 'age_mismatch',
  LIFESTYLE_CONFLICT = 'lifestyle_conflict',
  RECENT_INTERACTION = 'recent_interaction',
  USER_PREFERENCE_MISMATCH = 'user_preference_mismatch',
  TRUST_SCORE_LOW = 'trust_score_low',
  ADMIN_INTUITION = 'admin_intuition',
  SCHEDULING_CONFLICT = 'scheduling_conflict',
  OTHER = 'other',
}

// =============================================================================
// CORE MATCH SUGGESTION INTERFACES
// =============================================================================

/**
 * Main match suggestion interface
 */
export interface MatchSuggestion {
  readonly id: string;
  readonly requestingAdminId: number;
  readonly targetUserId: number;
  readonly suggestedUserId: number;
  readonly algorithm: MatchAlgorithm;
  readonly compatibilityScore: number; // 0-100
  readonly confidenceLevel: MatchConfidenceLevel;
  readonly matchReason: string;
  readonly detailedAnalysis: CompatibilityAnalysis;
  readonly successPrediction: DateSuccessPrediction;
  readonly successProbability: number; // 0-1
  readonly estimatedChemistry: number; // 0-100
  readonly recommendedDateType: 'online' | 'offline';
  readonly recommendedLocation?: string;
  readonly recommendedActivities: string[];
  readonly conversationStarters: string[];
  readonly potentialConcerns: string[];
  readonly status: MatchSuggestionStatus;
  readonly adminNotes?: string;
  readonly rejectionReason?: MatchRejectionReason;
  readonly rejectionNotes?: string;
  readonly generatedAt: string;
  readonly expiresAt: string;
  readonly reviewedAt?: string;
  readonly reviewedBy?: number;
  readonly isUsed: boolean;
  readonly usageDetails?: MatchUsageDetails;
  readonly targetUser: MatchUserProfile;
  readonly suggestedUser: MatchUserProfile;
  readonly requestingAdmin: AdminUserProfile;
}

/**
 * Comprehensive compatibility analysis
 */
export interface CompatibilityAnalysis {
  readonly overallScore: number; // 0-100
  readonly factorScores: Record<CompatibilityFactor, FactorScore>;
  readonly strengthAreas: CompatibilityStrength[];
  readonly concernAreas: CompatibilityStrength[];
  readonly improvementSuggestions: string[];
  readonly dealBreakers: string[];
  readonly positiveIndicators: string[];
  readonly riskFactors: RiskFactor[];
  readonly longTermCompatibility: number; // 0-100
  readonly chemistryPrediction: number; // 0-100
  readonly communicationFit: number; // 0-100
}

/**
 * Individual compatibility factor score
 */
export interface FactorScore {
  readonly score: number; // 0-100
  readonly weight: number; // 0-1, importance weight
  readonly explanation: string;
  readonly dataPoints: string[];
  readonly confidence: number; // 0-1
}

/**
 * Compatibility strength or concern area
 */
export interface CompatibilityStrength {
  readonly factor: CompatibilityFactor;
  readonly score: number;
  readonly impact: 'high' | 'medium' | 'low';
  readonly description: string;
  readonly examples: string[];
}

/**
 * Risk factor analysis
 */
export interface RiskFactor {
  readonly type: string;
  readonly severity: 'low' | 'medium' | 'high' | 'critical';
  readonly description: string;
  readonly likelihood: number; // 0-1
  readonly mitigation: string;
  readonly impact: string;
}

/**
 * User profile for matching
 */
export interface MatchUserProfile {
  readonly id: number;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly age: number;
  readonly gender: string;
  readonly location: UserLocation;
  readonly education: string;
  readonly profession: string;
  readonly bio: string;
  readonly interests: string[];
  readonly lifestyle: UserLifestyle;
  readonly preferences: UserPreferences;
  readonly verificationStatus: UserVerificationStatus;
  readonly trustScore: number;
  readonly activityLevel: UserActivityLevel;
  readonly availabilityStatus: UserAvailabilityStatus;
  readonly lastActiveAt: string;
  readonly dateHistory: UserDateHistory;
  readonly photos: string[];
  readonly isProfileComplete: boolean;
}

/**
 * User location details
 */
export interface UserLocation {
  readonly city: string;
  readonly state: string;
  readonly country: string;
  readonly coordinates?: {
    readonly lat: number;
    readonly lng: number;
  };
  readonly timezone: string;
}

/**
 * User lifestyle information
 */
export interface UserLifestyle {
  readonly drinking: string;
  readonly smoking: string;
  readonly exercise: string;
  readonly diet: string;
  readonly socialLevel: string;
  readonly workLifeBalance: string;
  readonly travelFrequency: string;
  readonly petOwner: boolean;
  readonly livingArrangement: string;
}

/**
 * User preferences summary
 */
export interface UserPreferences {
  readonly ageRange: { min: number; max: number; };
  readonly locationRadius: number; // km
  readonly education: string[];
  readonly lifestyle: Record<string, string>;
  readonly interests: string[];
  readonly dealBreakers: string[];
  readonly priorities: string[];
}

/**
 * User verification status
 */
export interface UserVerificationStatus {
  readonly email: boolean;
  readonly phone: boolean;
  readonly identity: boolean;
  readonly photos: boolean;
  readonly workplace: boolean;
  readonly overallLevel: 'basic' | 'verified' | 'premium';
}

/**
 * User activity level
 */
export interface UserActivityLevel {
  readonly loginFrequency: string; // 'daily', 'weekly', etc.
  readonly responseRate: number; // 0-1
  readonly initiationRate: number; // 0-1
  readonly completionRate: number; // 0-1
  readonly feedbackRate: number; // 0-1
  readonly overallEngagement: 'low' | 'medium' | 'high';
}

/**
 * User dating history summary
 */
export interface UserDateHistory {
  readonly totalDates: number;
  readonly completedDates: number;
  readonly cancelledDates: number;
  readonly noShows: number;
  readonly averageRating: number;
  readonly secondDateRate: number; // 0-1
  readonly lastDateAt?: string;
  readonly favoriteActivities: string[];
  readonly preferredLocations: string[];
  readonly timePreferences: string[];
}

/**
 * Admin user profile for match requests
 */
export interface AdminUserProfile {
  readonly id: number;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly role: string;
  readonly experience: string;
  readonly specialization: string[];
  readonly successRate: number; // 0-1
  readonly totalMatches: number;
}

/**
 * Match usage details when suggestion is used
 */
export interface MatchUsageDetails {
  readonly dateCreated: boolean;
  readonly dateId?: number;
  readonly dateScheduledAt?: string;
  readonly usedAt: string;
  readonly adminNotes?: string;
  readonly modifications?: string[];
  readonly outcome?: 'scheduled' | 'accepted' | 'declined' | 'cancelled';
}

// =============================================================================
// ADVANCED MATCHING FEATURES
// =============================================================================

/**
 * Batch match suggestion request
 */
export interface BatchMatchSuggestion {
  readonly batchId: string;
  readonly targetUserIds: number[];
  readonly algorithms: MatchAlgorithm[];
  readonly filters: MatchFilters;
  readonly limits: BatchLimits;
  readonly prioritization: MatchPrioritization;
  readonly generatedSuggestions: MatchSuggestion[];
  readonly processingStats: BatchProcessingStats;
  readonly createdAt: string;
  readonly completedAt?: string;
  readonly status: 'processing' | 'completed' | 'failed';
}

/**
 * Match filters for advanced searching
 */
export interface MatchFilters {
  readonly minCompatibilityScore?: number;
  readonly maxDistance?: number; // km
  readonly ageRange?: { min: number; max: number; };
  readonly education?: string[];
  readonly profession?: string[];
  readonly interests?: string[];
  readonly lifestyle?: Record<string, string[]>;
  readonly verificationLevel?: string;
  readonly minTrustScore?: number;
  readonly activityLevel?: string[];
  readonly availabilityStatus?: UserAvailabilityStatus[];
  readonly excludeRecentMatches?: boolean;
  readonly excludePreviousRejections?: boolean;
  readonly onlyMutualInterest?: boolean;
  readonly customCriteria?: Record<string, any>;
}

/**
 * Batch processing limits
 */
export interface BatchLimits {
  readonly maxSuggestionsPerUser: number;
  readonly maxTotalSuggestions: number;
  readonly timeoutMinutes: number;
  readonly priorityThreshold: number;
  readonly diversityFactor: number; // 0-1, ensures variety in suggestions
}

/**
 * Match prioritization criteria
 */
export interface MatchPrioritization {
  readonly factors: Array<{
    readonly factor: CompatibilityFactor;
    readonly weight: number; // 0-1
  }>;
  readonly boosts: Array<{
    readonly condition: string;
    readonly multiplier: number;
  }>;
  readonly penalties: Array<{
    readonly condition: string;
    readonly reduction: number;
  }>;
  readonly diversityWeight: number; // 0-1
}

/**
 * Batch processing statistics
 */
export interface BatchProcessingStats {
  readonly totalUsersProcessed: number;
  readonly totalCombinationsEvaluated: number;
  readonly suggestionsGenerated: number;
  readonly averageCompatibilityScore: number;
  readonly processingTimeMs: number;
  readonly algorithmsUsed: MatchAlgorithm[];
  readonly filterStats: Record<string, number>;
  readonly errorCount: number;
  readonly warningCount: number;
}

/**
 * Match learning feedback for algorithm improvement
 */
export interface MatchLearningFeedback {
  readonly suggestionId: string;
  readonly outcome: 'date_scheduled' | 'date_completed' | 'date_cancelled' | 'rejected_by_admin' | 'rejected_by_user';
  readonly actualCompatibility?: number; // Measured post-date
  readonly userFeedback?: {
    readonly user1Rating: number;
    readonly user2Rating: number;
    readonly chemistryRating: number;
    readonly wouldMeetAgain: boolean;
  };
  readonly adminFeedback?: {
    readonly accuracyRating: number; // How accurate was the prediction
    readonly surpriseFactors: string[];
    readonly missedFactors: string[];
    readonly improvementSuggestions: string[];
  };
  readonly learningPoints: string[];
  readonly algorithmAdjustments: string[];
  readonly submittedAt: string;
  readonly submittedBy: number;
}

/**
 * Algorithm performance metrics
 */
export interface AlgorithmPerformance {
  readonly algorithm: MatchAlgorithm;
  readonly period: { startDate: string; endDate: string; };
  readonly metrics: {
    readonly totalSuggestions: number;
    readonly acceptanceRate: number; // Suggestions accepted by admins
    readonly dateCreationRate: number; // Suggestions that led to dates
    readonly dateCompletionRate: number; // Dates that were completed
    readonly averageFeedbackScore: number;
    readonly averageCompatibilityAccuracy: number;
    readonly averageProcessingTime: number; // ms
  };
  readonly topPerformingFactors: CompatibilityFactor[];
  readonly improvementAreas: string[];
  readonly confidenceLevel: number; // 0-1
  readonly recommendedAdjustments: string[];
}

// =============================================================================
// REQUEST INTERFACES
// =============================================================================

/**
 * Generate match suggestions request
 */
export interface GenerateMatchSuggestionsRequest {
  readonly targetUserId: number;
  readonly algorithms?: MatchAlgorithm[];
  readonly filters?: MatchFilters;
  readonly maxSuggestions?: number;
  readonly includedFactors?: CompatibilityFactor[];
  readonly excludedUserIds?: number[];
  readonly prioritizeNewUsers?: boolean;
  readonly includePredictions?: boolean;
  readonly includeDetailedAnalysis?: boolean;
  readonly customWeights?: Record<CompatibilityFactor, number>;
  readonly cacheResults?: boolean;
  readonly adminNotes?: string;
}

/**
 * Batch match suggestions request
 */
export interface BatchMatchSuggestionsRequest {
  readonly targetUserIds: number[];
  readonly algorithms: MatchAlgorithm[];
  readonly filters: MatchFilters;
  readonly limits: BatchLimits;
  readonly prioritization: MatchPrioritization;
  readonly processingMode: 'sequential' | 'parallel';
  readonly notifyOnCompletion?: boolean;
  readonly adminId: number;
}

/**
 * Update match suggestion request
 */
export interface UpdateMatchSuggestionRequest {
  readonly suggestionId: string;
  readonly status?: MatchSuggestionStatus;
  readonly adminNotes?: string;
  readonly rejectionReason?: MatchRejectionReason;
  readonly rejectionNotes?: string;
  readonly usageDetails?: Partial<MatchUsageDetails>;
  readonly adminId: number;
}

/**
 * Get match suggestions request
 */
export interface GetMatchSuggestionsRequest {
  readonly targetUserId?: number;
  readonly suggestedUserId?: number;
  readonly adminId?: number;
  readonly algorithms?: MatchAlgorithm[];
  readonly statuses?: MatchSuggestionStatus[];
  readonly minCompatibilityScore?: number;
  readonly maxCompatibilityScore?: number;
  readonly generatedAfter?: string;
  readonly generatedBefore?: string;
  readonly includeExpired?: boolean;
  readonly includeUsed?: boolean;
  readonly sortBy?: 'compatibilityScore' | 'generatedAt' | 'successProbability';
  readonly sortOrder?: 'asc' | 'desc';
  readonly page?: number;
  readonly limit?: number;
}

/**
 * Algorithm performance analysis request
 */
export interface AnalyzeAlgorithmPerformanceRequest {
  readonly algorithms?: MatchAlgorithm[];
  readonly startDate: string;
  readonly endDate: string;
  readonly includeComparison?: boolean;
  readonly groupBy?: 'algorithm' | 'factor' | 'admin' | 'timeperiod';
  readonly minSampleSize?: number;
}

/**
 * Match learning feedback request
 */
export interface SubmitMatchLearningFeedbackRequest {
  readonly suggestionId: string;
  readonly outcome: string;
  readonly actualCompatibility?: number;
  readonly userFeedback?: any;
  readonly adminFeedback?: any;
  readonly learningPoints: string[];
  readonly submittedBy: number;
}

// =============================================================================
// RESPONSE INTERFACES
// =============================================================================

/**
 * Match suggestions response
 */
export interface MatchSuggestionsResponse {
  readonly success: boolean;
  readonly data: {
    readonly suggestions: MatchSuggestion[];
    readonly targetUser: MatchUserProfile;
    readonly requestCriteria: GenerateMatchSuggestionsRequest;
    readonly processingStats: {
      readonly candidatesEvaluated: number;
      readonly algorithmUsed: MatchAlgorithm;
      readonly processingTimeMs: number;
      readonly cacheHit: boolean;
    };
    readonly recommendations: {
      readonly topSuggestion?: MatchSuggestion;
      readonly mostDiverseOptions: MatchSuggestion[];
      readonly safestOptions: MatchSuggestion[];
      readonly highPotentialOptions: MatchSuggestion[];
    };
  };
  readonly message: string;
}

/**
 * Batch match suggestions response
 */
export interface BatchMatchSuggestionsResponse {
  readonly success: boolean;
  readonly data: BatchMatchSuggestion;
  readonly message: string;
}

/**
 * Match suggestion details response
 */
export interface MatchSuggestionDetailsResponse {
  readonly success: boolean;
  readonly data: {
    readonly suggestion: MatchSuggestion;
    readonly similarSuggestions: MatchSuggestion[];
    readonly historicalPerformance?: {
      readonly similarMatches: number;
      readonly successRate: number;
      readonly averageRating: number;
    };
    readonly adminInsights: {
      readonly recommendedActions: string[];
      readonly potentialConcerns: string[];
      readonly confidenceFactors: string[];
    };
  };
  readonly message: string;
}

/**
 * Algorithm performance response
 */
export interface AlgorithmPerformanceResponse {
  readonly success: boolean;
  readonly data: {
    readonly performance: AlgorithmPerformance[];
    readonly comparison?: {
      readonly bestPerforming: MatchAlgorithm;
      readonly mostAccurate: MatchAlgorithm;
      readonly fastest: MatchAlgorithm;
      readonly recommendations: string[];
    };
    readonly trends: Array<{
      readonly date: string;
      readonly algorithm: MatchAlgorithm;
      readonly score: number;
    }>;
  };
  readonly message: string;
}

/**
 * Match learning feedback response
 */
export interface MatchLearningFeedbackResponse {
  readonly success: boolean;
  readonly data: {
    readonly feedbackId: string;
    readonly algorithmUpdates: string[];
    readonly modelImprovements: string[];
    readonly confidenceAdjustments: Record<CompatibilityFactor, number>;
  };
  readonly message: string;
}

// =============================================================================
// CONSTANTS AND UTILITIES
// =============================================================================

/**
 * Match suggestion constants
 */
export const MATCH_SUGGESTION_CONSTANTS = {
  MIN_COMPATIBILITY_SCORE: 30,
  DEFAULT_MAX_SUGGESTIONS: 10,
  DEFAULT_CACHE_DURATION: 24, // hours
  MAX_BATCH_SIZE: 100,
  DEFAULT_PROCESSING_TIMEOUT: 5, // minutes
  MIN_TRUST_SCORE: 50,
  MAX_DISTANCE_KM: 100,
  DEFAULT_DIVERSITY_FACTOR: 0.3,
  ALGORITHM_CONFIDENCE_THRESHOLD: 0.7,
} as const;

/**
 * Get match algorithm values
 */
export const getMatchAlgorithmValues = (): MatchAlgorithm[] => Object.values(MatchAlgorithm);

/**
 * Get compatibility factor values
 */
export const getCompatibilityFactorValues = (): CompatibilityFactor[] => Object.values(CompatibilityFactor);

/**
 * Get match suggestion status values
 */
export const getMatchSuggestionStatusValues = (): MatchSuggestionStatus[] => Object.values(MatchSuggestionStatus);

/**
 * Calculate overall compatibility score
 */
export const calculateOverallCompatibilityScore = (
  factorScores: Record<CompatibilityFactor, FactorScore>
): number => {
  const scores = Object.values(factorScores);
  const weightedSum = scores.reduce((sum, score) => sum + (score.score * score.weight), 0);
  const totalWeight = scores.reduce((sum, score) => sum + score.weight, 0);
  return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
};

/**
 * Determine match confidence level
 */
export const determineMatchConfidenceLevel = (score: number): MatchConfidenceLevel => {
  if (score >= 95) return MatchConfidenceLevel.EXCEPTIONAL;
  if (score >= 85) return MatchConfidenceLevel.VERY_HIGH;
  if (score >= 70) return MatchConfidenceLevel.HIGH;
  if (score >= 50) return MatchConfidenceLevel.MEDIUM;
  if (score >= 30) return MatchConfidenceLevel.LOW;
  return MatchConfidenceLevel.VERY_LOW;
};

/**
 * Predict date success probability
 */
export const predictDateSuccess = (
  compatibilityScore: number,
  trustScores: [number, number],
  historicalData?: any
): DateSuccessPrediction => {
  const baseScore = compatibilityScore;
  const trustAdjustment = (trustScores[0] + trustScores[1]) / 200; // 0-1
  const adjustedScore = baseScore * (0.7 + 0.3 * trustAdjustment);
  
  if (adjustedScore >= 90) return DateSuccessPrediction.ALMOST_CERTAIN;
  if (adjustedScore >= 75) return DateSuccessPrediction.VERY_LIKELY;
  if (adjustedScore >= 50) return DateSuccessPrediction.LIKELY;
  if (adjustedScore >= 25) return DateSuccessPrediction.POSSIBLE;
  return DateSuccessPrediction.UNLIKELY;
};

/**
 * Match suggestion validation rules
 */
export const MatchSuggestionValidationRules = {
  MIN_AGE_DIFFERENCE: 1,
  MAX_AGE_DIFFERENCE: 20,
  MIN_PROFILE_COMPLETION: 60, // percentage
  MIN_ACTIVITY_DAYS: 7, // days since last activity
  MAX_SUGGESTION_AGE: 7, // days
  MIN_ALGORITHM_CONFIDENCE: 0.3,
  MAX_CONCURRENT_SUGGESTIONS: 50,
} as const;