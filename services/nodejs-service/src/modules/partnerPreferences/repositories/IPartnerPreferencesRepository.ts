/**
 * Partner Preferences Repository Interface
 * 
 * Following established codebase patterns:
 * ✅ Clean interface segregation principle
 * ✅ Proper abstraction for data access operations
 * ✅ Comprehensive error type definitions
 * ✅ Testable contract definitions
 * ✅ Small, focused interface
 * 
 * @author Staff Engineer - Dating Platform Team
 * @version 1.0.0
 */

import { DatifyyUserPartnerPreferences } from '../../../models/entities/DatifyyUserPartnerPreferences';
import { PreferencesAnalyticsDto } from '../dtos/PartnerPreferencesResponseDtos';

/**
 * Partner Preferences Repository Interface
 * 
 * Defines the contract for partner preferences data access operations.
 * This interface abstracts database operations and enables easy testing
 * and potential database technology changes.
 */
export interface IPartnerPreferencesRepository {
  /**
   * Find partner preferences by user login ID
   * 
   * @param userId - User login ID
   * @returns Promise<DatifyyUserPartnerPreferences | null> - Preferences entity or null
   */
  findByUserId(userId: number): Promise<DatifyyUserPartnerPreferences | null>;

  /**
   * Find partner preferences by preferences ID
   * 
   * @param preferencesId - Preferences ID
   * @returns Promise<DatifyyUserPartnerPreferences | null> - Preferences entity or null
   */
  findById(preferencesId: number): Promise<DatifyyUserPartnerPreferences | null>;

  /**
   * Create new partner preferences
   * 
   * @param preferencesData - Preferences creation data
   * @returns Promise<DatifyyUserPartnerPreferences> - Created preferences entity
   */
  create(preferencesData: Partial<DatifyyUserPartnerPreferences>): Promise<DatifyyUserPartnerPreferences>;

  /**
   * Update partner preferences by ID
   * 
   * @param preferencesId - Preferences ID
   * @param updateData - Fields to update
   * @returns Promise<DatifyyUserPartnerPreferences> - Updated preferences entity
   */
  update(
    preferencesId: number,
    updateData: Partial<DatifyyUserPartnerPreferences>
  ): Promise<DatifyyUserPartnerPreferences>;

  /**
   * Soft delete partner preferences
   * 
   * @param preferencesId - Preferences ID
   * @returns Promise<void>
   */
  softDelete(preferencesId: number): Promise<void>;

  /**
   * Hard delete partner preferences (admin only)
   * 
   * @param preferencesId - Preferences ID
   * @returns Promise<void>
   */
  hardDelete(preferencesId: number): Promise<void>;

  /**
   * Check if preferences exist for user
   * 
   * @param userId - User login ID
   * @returns Promise<boolean> - True if preferences exist
   */
  existsByUserId(userId: number): Promise<boolean>;

  /**
   * Find potential matches based on user's preferences
   * 
   * @param userId - Current user's ID
   * @param preferences - User's partner preferences
   * @param limit - Maximum number of matches to return
   * @returns Promise<MatchCandidate[]> - Array of potential matches
   */
  findPotentialMatches(
    userId: number,
    preferences: DatifyyUserPartnerPreferences,
    limit: number
  ): Promise<MatchCandidate[]>;

  /**
   * Get preferences analytics for admin insights
   * 
   * @returns Promise<PreferencesAnalyticsDto> - Aggregated preferences data
   */
  getAnalytics(): Promise<PreferencesAnalyticsDto>;

  /**
   * Find users with similar preferences (for recommendations)
   * 
   * @param userId - Current user's ID
   * @param limit - Maximum number of similar users
   * @returns Promise<DatifyyUserPartnerPreferences[]> - Similar users' preferences
   */
  findSimilarPreferences(
    userId: number,
    limit: number
  ): Promise<DatifyyUserPartnerPreferences[]>;

  /**
   * Get preferences by multiple user IDs (bulk operation)
   * 
   * @param userIds - Array of user IDs
   * @returns Promise<DatifyyUserPartnerPreferences[]> - Array of preferences
   */
  findByUserIds(userIds: number[]): Promise<DatifyyUserPartnerPreferences[]>;

  /**
   * Update matching scores for multiple users (background job)
   * 
   * @param updates - Array of user ID and matching score pairs
   * @returns Promise<void>
   */
  bulkUpdateMatchingScores(updates: MatchingScoreUpdate[]): Promise<void>;
}

/**
 * Match Candidate interface for potential matches
 */
export interface MatchCandidate {
  userId: number;
  profileId: string;
  userProfile: {
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    currentCity: string;
    images: string[];
    height: number;
    educationLevel: string;
    lookingFor: string;
    exercise: string;
    drinking: string;
    smoking: string;
    isOfficialEmailVerified: boolean;
    isPhoneVerified: boolean;
  };
  preferences: DatifyyUserPartnerPreferences;
  distance?: number; // in kilometers
  lastActive: Date;
  isOnline: boolean;
}

/**
 * Matching Score Update interface for bulk operations
 */
export interface MatchingScoreUpdate {
  userId: number;
  matchingScore: number;
  calculatedAt: Date;
}

/**
 * Repository Query Options for filtering and pagination
 */
export interface PreferencesQueryOptions {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'matchingScore';
  sortOrder?: 'ASC' | 'DESC';
  filters?: {
    genderPreference?: string;
    ageRange?: [number, number];
    cities?: string[];
    relationshipGoals?: string;
    hasMatchingScore?: boolean;
    isActive?: boolean;
  };
}

/**
 * Repository Error Types for specific database errors
 */
export class RepositoryError extends Error {
  constructor(
    message: string,
    public readonly operation: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'RepositoryError';
  }
}

export class PreferencesNotFoundRepositoryError extends RepositoryError {
  constructor(identifier: string | number, identifierType: 'id' | 'userId' = 'id') {
    super(
      `Partner preferences not found with ${identifierType}: ${identifier}`,
      'find'
    );
    this.name = 'PreferencesNotFoundRepositoryError';
  }
}

export class DuplicatePreferencesError extends RepositoryError {
  constructor(userId: number) {
    super(
      `Partner preferences already exist for user: ${userId}`,
      'create'
    );
    this.name = 'DuplicatePreferencesError';
  }
}

export class DatabaseConnectionError extends RepositoryError {
  constructor(operation: string, cause?: Error) {
    super(
      `Database connection failed during ${operation}`,
      operation,
      cause
    );
    this.name = 'DatabaseConnectionError';
  }
}

/**
 * Advanced Repository Interface for complex operations
 */
export interface IAdvancedPartnerPreferencesRepository extends IPartnerPreferencesRepository {
  /**
   * Execute complex compatibility queries
   */
  executeCompatibilityQuery(
    userId: number,
    targetUserId: number
  ): Promise<CompatibilityQueryResult>;

  /**
   * Get trending preferences for analytics
   */
  getTrendingPreferences(
    timeframe: 'week' | 'month' | 'quarter'
  ): Promise<TrendingPreferencesData>;

  /**
   * Backup preferences data
   */
  backupPreferences(userId: number): Promise<string>; // Returns backup ID

  /**
   * Restore preferences from backup
   */
  restorePreferences(backupId: string): Promise<DatifyyUserPartnerPreferences>;
}

/**
 * Supporting interfaces for advanced operations
 */
export interface CompatibilityQueryResult {
  userPreferences: DatifyyUserPartnerPreferences;
  targetPreferences: DatifyyUserPartnerPreferences;
  sharedFactors: string[];
  conflictingFactors: string[];
  compatibilityMetrics: Record<string, number>;
}

export interface TrendingPreferencesData {
  timeframe: string;
  popularGenderPreferences: TrendData[];
  popularAgeRanges: TrendData[];
  popularCities: TrendData[];
  popularRelationshipGoals: TrendData[];
  emergingTrends: EmergingTrend[];
}

export interface TrendData {
  value: string;
  count: number;
  percentage: number;
  changeFromPrevious: number;
}

export interface EmergingTrend {
  category: string;
  trend: string;
  growthRate: number;
  significance: 'High' | 'Medium' | 'Low';
}