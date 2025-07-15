"use strict";
/**
 * Match Suggestions Interfaces
 * AI-powered match suggestions and compatibility analysis for admin curation
 *
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchSuggestionValidationRules = exports.predictDateSuccess = exports.determineMatchConfidenceLevel = exports.calculateOverallCompatibilityScore = exports.getMatchSuggestionStatusValues = exports.getCompatibilityFactorValues = exports.getMatchAlgorithmValues = exports.MATCH_SUGGESTION_CONSTANTS = exports.MatchRejectionReason = exports.DateSuccessPrediction = exports.MatchConfidenceLevel = exports.UserAvailabilityStatus = exports.MatchSuggestionStatus = exports.CompatibilityFactor = exports.MatchAlgorithm = void 0;
// =============================================================================
// MATCH SUGGESTION ENUMS
// =============================================================================
/**
 * Match suggestion algorithms
 */
var MatchAlgorithm;
(function (MatchAlgorithm) {
    MatchAlgorithm["PREFERENCE_BASED"] = "preference_based";
    MatchAlgorithm["BEHAVIOR_BASED"] = "behavior_based";
    MatchAlgorithm["COLLABORATIVE_FILTERING"] = "collaborative_filtering";
    MatchAlgorithm["HYBRID_ML"] = "hybrid_ml";
    MatchAlgorithm["LOCATION_PROXIMITY"] = "location_proximity";
    MatchAlgorithm["ACTIVITY_BASED"] = "activity_based";
    MatchAlgorithm["TRUST_SCORE_WEIGHTED"] = "trust_score_weighted";
})(MatchAlgorithm || (exports.MatchAlgorithm = MatchAlgorithm = {}));
/**
 * Compatibility factors for scoring
 */
var CompatibilityFactor;
(function (CompatibilityFactor) {
    CompatibilityFactor["AGE_COMPATIBILITY"] = "age_compatibility";
    CompatibilityFactor["LOCATION_PROXIMITY"] = "location_proximity";
    CompatibilityFactor["EDUCATION_LEVEL"] = "education_level";
    CompatibilityFactor["CAREER_COMPATIBILITY"] = "career_compatibility";
    CompatibilityFactor["LIFESTYLE_ALIGNMENT"] = "lifestyle_alignment";
    CompatibilityFactor["INTERESTS_OVERLAP"] = "interests_overlap";
    CompatibilityFactor["VALUES_ALIGNMENT"] = "values_alignment";
    CompatibilityFactor["COMMUNICATION_STYLE"] = "communication_style";
    CompatibilityFactor["RELATIONSHIP_GOALS"] = "relationship_goals";
    CompatibilityFactor["PHYSICAL_PREFERENCES"] = "physical_preferences";
    CompatibilityFactor["RELIGIOUS_COMPATIBILITY"] = "religious_compatibility";
    CompatibilityFactor["FAMILY_PLANNING"] = "family_planning";
    CompatibilityFactor["SOCIAL_HABITS"] = "social_habits";
    CompatibilityFactor["ACTIVITY_PREFERENCES"] = "activity_preferences";
    CompatibilityFactor["PERSONALITY_MATCH"] = "personality_match";
})(CompatibilityFactor || (exports.CompatibilityFactor = CompatibilityFactor = {}));
/**
 * Match suggestion status
 */
var MatchSuggestionStatus;
(function (MatchSuggestionStatus) {
    MatchSuggestionStatus["PENDING"] = "pending";
    MatchSuggestionStatus["REVIEWED"] = "reviewed";
    MatchSuggestionStatus["ACCEPTED"] = "accepted";
    MatchSuggestionStatus["REJECTED"] = "rejected";
    MatchSuggestionStatus["DATE_CREATED"] = "date_created";
    MatchSuggestionStatus["EXPIRED"] = "expired";
    MatchSuggestionStatus["CANCELLED"] = "cancelled";
})(MatchSuggestionStatus || (exports.MatchSuggestionStatus = MatchSuggestionStatus = {}));
/**
 * User availability status for matching
 */
var UserAvailabilityStatus;
(function (UserAvailabilityStatus) {
    UserAvailabilityStatus["AVAILABLE"] = "available";
    UserAvailabilityStatus["BUSY"] = "busy";
    UserAvailabilityStatus["ON_DATE"] = "on_date";
    UserAvailabilityStatus["UNAVAILABLE"] = "unavailable";
    UserAvailabilityStatus["PROBATION"] = "probation";
    UserAvailabilityStatus["INACTIVE"] = "inactive";
})(UserAvailabilityStatus || (exports.UserAvailabilityStatus = UserAvailabilityStatus = {}));
/**
 * Match confidence levels
 */
var MatchConfidenceLevel;
(function (MatchConfidenceLevel) {
    MatchConfidenceLevel["VERY_LOW"] = "very_low";
    MatchConfidenceLevel["LOW"] = "low";
    MatchConfidenceLevel["MEDIUM"] = "medium";
    MatchConfidenceLevel["HIGH"] = "high";
    MatchConfidenceLevel["VERY_HIGH"] = "very_high";
    MatchConfidenceLevel["EXCEPTIONAL"] = "exceptional";
})(MatchConfidenceLevel || (exports.MatchConfidenceLevel = MatchConfidenceLevel = {}));
/**
 * Date success prediction categories
 */
var DateSuccessPrediction;
(function (DateSuccessPrediction) {
    DateSuccessPrediction["UNLIKELY"] = "unlikely";
    DateSuccessPrediction["POSSIBLE"] = "possible";
    DateSuccessPrediction["LIKELY"] = "likely";
    DateSuccessPrediction["VERY_LIKELY"] = "very_likely";
    DateSuccessPrediction["ALMOST_CERTAIN"] = "almost_certain";
})(DateSuccessPrediction || (exports.DateSuccessPrediction = DateSuccessPrediction = {}));
/**
 * Match rejection reasons for learning
 */
var MatchRejectionReason;
(function (MatchRejectionReason) {
    MatchRejectionReason["COMPATIBILITY_TOO_LOW"] = "compatibility_too_low";
    MatchRejectionReason["LOCATION_TOO_FAR"] = "location_too_far";
    MatchRejectionReason["AGE_MISMATCH"] = "age_mismatch";
    MatchRejectionReason["LIFESTYLE_CONFLICT"] = "lifestyle_conflict";
    MatchRejectionReason["RECENT_INTERACTION"] = "recent_interaction";
    MatchRejectionReason["USER_PREFERENCE_MISMATCH"] = "user_preference_mismatch";
    MatchRejectionReason["TRUST_SCORE_LOW"] = "trust_score_low";
    MatchRejectionReason["ADMIN_INTUITION"] = "admin_intuition";
    MatchRejectionReason["SCHEDULING_CONFLICT"] = "scheduling_conflict";
    MatchRejectionReason["OTHER"] = "other";
})(MatchRejectionReason || (exports.MatchRejectionReason = MatchRejectionReason = {}));
// =============================================================================
// CONSTANTS AND UTILITIES
// =============================================================================
/**
 * Match suggestion constants
 */
exports.MATCH_SUGGESTION_CONSTANTS = {
    MIN_COMPATIBILITY_SCORE: 30,
    DEFAULT_MAX_SUGGESTIONS: 10,
    DEFAULT_CACHE_DURATION: 24, // hours
    MAX_BATCH_SIZE: 100,
    DEFAULT_PROCESSING_TIMEOUT: 5, // minutes
    MIN_TRUST_SCORE: 50,
    MAX_DISTANCE_KM: 100,
    DEFAULT_DIVERSITY_FACTOR: 0.3,
    ALGORITHM_CONFIDENCE_THRESHOLD: 0.7,
};
/**
 * Get match algorithm values
 */
const getMatchAlgorithmValues = () => Object.values(MatchAlgorithm);
exports.getMatchAlgorithmValues = getMatchAlgorithmValues;
/**
 * Get compatibility factor values
 */
const getCompatibilityFactorValues = () => Object.values(CompatibilityFactor);
exports.getCompatibilityFactorValues = getCompatibilityFactorValues;
/**
 * Get match suggestion status values
 */
const getMatchSuggestionStatusValues = () => Object.values(MatchSuggestionStatus);
exports.getMatchSuggestionStatusValues = getMatchSuggestionStatusValues;
/**
 * Calculate overall compatibility score
 */
const calculateOverallCompatibilityScore = (factorScores) => {
    const scores = Object.values(factorScores);
    const weightedSum = scores.reduce((sum, score) => sum + (score.score * score.weight), 0);
    const totalWeight = scores.reduce((sum, score) => sum + score.weight, 0);
    return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
};
exports.calculateOverallCompatibilityScore = calculateOverallCompatibilityScore;
/**
 * Determine match confidence level
 */
const determineMatchConfidenceLevel = (score) => {
    if (score >= 95)
        return MatchConfidenceLevel.EXCEPTIONAL;
    if (score >= 85)
        return MatchConfidenceLevel.VERY_HIGH;
    if (score >= 70)
        return MatchConfidenceLevel.HIGH;
    if (score >= 50)
        return MatchConfidenceLevel.MEDIUM;
    if (score >= 30)
        return MatchConfidenceLevel.LOW;
    return MatchConfidenceLevel.VERY_LOW;
};
exports.determineMatchConfidenceLevel = determineMatchConfidenceLevel;
/**
 * Predict date success probability
 */
const predictDateSuccess = (compatibilityScore, trustScores, historicalData) => {
    const baseScore = compatibilityScore;
    const trustAdjustment = (trustScores[0] + trustScores[1]) / 200; // 0-1
    const adjustedScore = baseScore * (0.7 + 0.3 * trustAdjustment);
    if (adjustedScore >= 90)
        return DateSuccessPrediction.ALMOST_CERTAIN;
    if (adjustedScore >= 75)
        return DateSuccessPrediction.VERY_LIKELY;
    if (adjustedScore >= 50)
        return DateSuccessPrediction.LIKELY;
    if (adjustedScore >= 25)
        return DateSuccessPrediction.POSSIBLE;
    return DateSuccessPrediction.UNLIKELY;
};
exports.predictDateSuccess = predictDateSuccess;
/**
 * Match suggestion validation rules
 */
exports.MatchSuggestionValidationRules = {
    MIN_AGE_DIFFERENCE: 1,
    MAX_AGE_DIFFERENCE: 20,
    MIN_PROFILE_COMPLETION: 60, // percentage
    MIN_ACTIVITY_DAYS: 7, // days since last activity
    MAX_SUGGESTION_AGE: 7, // days
    MIN_ALGORITHM_CONFIDENCE: 0.3,
    MAX_CONCURRENT_SUGGESTIONS: 50,
};
