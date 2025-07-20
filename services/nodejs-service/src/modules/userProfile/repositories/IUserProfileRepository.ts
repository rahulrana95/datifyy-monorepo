// src/modules/userProfile/repositories/IUserProfileRepository.ts

import { DatifyyUsersInformation } from '../../../models/entities/DatifyyUsersInformation';

/**
 * User Profile Repository Interface
 * 
 * Defines the contract for user profile data access operations.
 * This interface abstracts database operations and enables easy testing
 * and potential database technology changes.
 */
export interface IUserProfileRepository {
  /**
   * Find user profile by user login ID
   * 
   * @param userId - User login ID
   * @returns Promise<DatifyyUsersInformation | null> - Profile entity or null if not found
   */
  findByUserId(userId: number): Promise<DatifyyUsersInformation | null>;

  /**
   * Find user profile by profile UUID
   * 
   * @param profileId - Profile UUID
   * @returns Promise<DatifyyUsersInformation | null> - Profile entity or null if not found
   */
  findById(profileId: string): Promise<DatifyyUsersInformation | null>;

  /**
   * Find user profile by official email
   * 
   * @param email - Official email address
   * @returns Promise<DatifyyUsersInformation | null> - Profile entity or null if not found
   */
  findByEmail(email: string): Promise<DatifyyUsersInformation | null>;

  /**
   * Create a new user profile
   * 
   * @param profileData - Profile creation data
   * @returns Promise<DatifyyUsersInformation> - Created profile entity
   */
  create(profileData: Partial<DatifyyUsersInformation>): Promise<DatifyyUsersInformation>;

  /**
   * Update user profile by profile ID
   * 
   * @param profileId - Profile UUID
   * @param updateData - Fields to update
   * @returns Promise<DatifyyUsersInformation> - Updated profile entity
   */
  update(
    profileId: string, 
    updateData: Partial<DatifyyUsersInformation>
  ): Promise<DatifyyUsersInformation>;

  /**
   * Soft delete user profile
   * 
   * @param profileId - Profile UUID
   * @returns Promise<void>
   */
  softDelete(profileId: string): Promise<void>;

  /**
   * Hard delete user profile (admin only)
   * 
   * @param profileId - Profile UUID
   * @returns Promise<void>
   */
  hardDelete(profileId: string): Promise<void>;

  /**
   * Check if user profile exists by user ID
   * 
   * @param userId - User login ID
   * @returns Promise<boolean> - True if profile exists and is not deleted
   */
  existsByUserId(userId: number): Promise<boolean>;

  /**
   * Check if email is already in use by another profile
   * 
   * @param email - Email to check
   * @param excludeProfileId - Profile ID to exclude from check (for updates)
   * @returns Promise<boolean> - True if email is in use
   */
  isEmailInUse(email: string, excludeProfileId?: string): Promise<boolean>;

  /**
   * Find multiple profiles by user IDs
   * 
   * @param userIds - Array of user login IDs
   * @returns Promise<DatifyyUsersInformation[]> - Array of profile entities
   */
  findByUserIds(userIds: number[]): Promise<DatifyyUsersInformation[]>;

  /**
   * Get profiles with pagination and filtering
   * 
   * @param options - Query options
   * @returns Promise<{ profiles: DatifyyUsersInformation[]; total: number }> - Paginated results
   */
  findWithPagination(options: ProfileQueryOptions): Promise<{
    profiles: DatifyyUsersInformation[];
    total: number;
  }>;

  /**
   * Update verification status fields
   * 
   * @param profileId - Profile UUID
   * @param verificationType - Type of verification
   * @param status - Verification status
   * @returns Promise<DatifyyUsersInformation> - Updated profile entity
   */
  updateVerificationStatus(
    profileId: string,
    verificationType: 'email' | 'phone' | 'aadhar',
    status: boolean
  ): Promise<DatifyyUsersInformation>;

  /**
   * Find profiles by location (city/hometown)
   * 
   * @param location - City or hometown to search
   * @param radius - Search radius (for future geo-search)
   * @returns Promise<DatifyyUsersInformation[]> - Profiles in location
   */
  findByLocation(location: string, radius?: number): Promise<DatifyyUsersInformation[]>;

  /**
   * Get profile statistics for analytics
   * 
   * @returns Promise<ProfileAnalytics> - Aggregated profile statistics
   */
  getProfileAnalytics(): Promise<ProfileAnalytics>;

  /**
   * Find incomplete profiles for engagement campaigns
   * 
   * @param completionThreshold - Minimum completion percentage
   * @returns Promise<DatifyyUsersInformation[]> - Incomplete profiles
   */
  findIncompleteProfiles(completionThreshold: number): Promise<DatifyyUsersInformation[]>;

  /**
   * Update last active timestamp
   * 
   * @param userId - User login ID
   * @returns Promise<void>
   */
  updateLastActive(userId: number): Promise<void>;

  /**
   * Bulk update multiple profiles (admin operation)
   * 
   * @param updates - Array of profile updates
   * @returns Promise<DatifyyUsersInformation[]> - Updated profiles
   */
  bulkUpdate(updates: BulkProfileUpdate[]): Promise<DatifyyUsersInformation[]>;
}

/**
 * Profile query options for pagination and filtering
 */
export interface ProfileQueryOptions {
  page?: number;
  limit?: number;
  sortBy?: keyof DatifyyUsersInformation;
  sortOrder?: 'ASC' | 'DESC';
  filters?: {
    gender?: string;
    ageMin?: number;
    ageMax?: number;
    city?: string;
    lookingFor?: string;
    isVerified?: boolean;
    isDeleted?: boolean;
    completionPercentage?: {
      min?: number;
      max?: number;
    };
  };
  search?: {
    query: string;
    fields: (keyof DatifyyUsersInformation)[];
  };
}

/**
 * Profile analytics data structure
 */
export interface ProfileAnalytics {
  totalProfiles: number;
  activeProfiles: number;
  deletedProfiles: number;
  verifiedProfiles: {
    email: number;
    phone: number;
    aadhar: number;
    all: number;
  };
  completionStats: {
    average: number;
    distribution: {
      range: string;
      count: number;
    }[];
  };
  demographics: {
    genderDistribution: Record<string, number>;
    ageDistribution: Record<string, number>;
    cityDistribution: Record<string, number>;
  };
  growthMetrics: {
    newProfilesThisMonth: number;
    newProfilesThisWeek: number;
    activeThisMonth: number;
  };
}

/**
 * Bulk update operation structure
 */
export interface BulkProfileUpdate {
  profileId: string;
  updateData: Partial<DatifyyUsersInformation>;
  reason?: string; // For audit trail
}

/**
 * Repository error types for specific database errors
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

export class ProfileNotFoundError extends RepositoryError {
  constructor(identifier: string, identifierType: 'id' | 'userId' | 'email' = 'id') {
    super(
      `Profile not found with ${identifierType}: ${identifier}`,
      'find',
    );
    this.name = 'ProfileNotFoundError';
  }
}

export class DuplicateEmailError extends RepositoryError {
  constructor(email: string) {
    super(
      `Profile with email ${email} already exists`,
      'create',
    );
    this.name = 'DuplicateEmailError';
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
 * Repository query builder interface for complex queries
 */
export interface IProfileQueryBuilder {
  /**
   * Add WHERE conditions
   */
  where(field: keyof DatifyyUsersInformation, operator: string, value: any): IProfileQueryBuilder;

  /**
   * Add OR conditions
   */
  orWhere(field: keyof DatifyyUsersInformation, operator: string, value: any): IProfileQueryBuilder;

  /**
   * Add JOIN conditions
   */
  join(relation: string, condition?: string): IProfileQueryBuilder;

  /**
   * Add ORDER BY clause
   */
  orderBy(field: keyof DatifyyUsersInformation, direction: 'ASC' | 'DESC'): IProfileQueryBuilder;

  /**
   * Add LIMIT and OFFSET
   */
  paginate(page: number, limit: number): IProfileQueryBuilder;

  /**
   * Execute query and return results
   */
  execute(): Promise<DatifyyUsersInformation[]>;

  /**
   * Execute query and return count
   */
  count(): Promise<number>;

  /**
   * Execute query and return first result
   */
  first(): Promise<DatifyyUsersInformation | null>;
}

/**
 * Advanced repository interface for complex operations
 */
export interface IAdvancedUserProfileRepository extends IUserProfileRepository {
  /**
   * Get query builder for complex queries
   */
  createQueryBuilder(): IProfileQueryBuilder;

  /**
   * Execute raw SQL query (admin only)
   */
  executeRaw(query: string, parameters?: any[]): Promise<any>;

  /**
   * Get database health status
   */
  healthCheck(): Promise<{
    isHealthy: boolean;
    responseTime: number;
    connectionCount: number;
  }>;

  /**
   * Backup profile data
   */
  backupProfile(profileId: string): Promise<string>; // Returns backup ID

  /**
   * Restore profile from backup
   */
  restoreProfile(backupId: string): Promise<DatifyyUsersInformation>;
}