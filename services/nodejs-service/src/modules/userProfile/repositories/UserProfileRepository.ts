// src/modules/userProfile/repositories/UserProfileRepository.ts

import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { Logger } from '../../../infrastructure/logging/Logger';
import { DatifyyUsersInformation } from '../../../models/entities/DatifyyUsersInformation';
import { DatifyyUsersLogin } from '../../../models/entities/DatifyyUsersLogin';
import {
  IUserProfileRepository,
  IProfileQueryBuilder,
  ProfileQueryOptions,
  ProfileAnalytics,
  BulkProfileUpdate,
  RepositoryError,
  ProfileNotFoundError,
  DuplicateEmailError,
  DatabaseConnectionError
} from './IUserProfileRepository';

/**
 * User Profile Repository Implementation
 * 
 * Implements data access operations for user profiles using TypeORM.
 * Provides optimized queries, error handling, and performance monitoring.
 */
export class UserProfileRepository implements IUserProfileRepository {
  private readonly repository: Repository<DatifyyUsersInformation>;
  private readonly userLoginRepository: Repository<DatifyyUsersLogin>;
  private readonly logger: Logger;

  constructor(
    private readonly dataSource: DataSource,
    logger?: Logger
  ) {
    this.repository = dataSource.getRepository(DatifyyUsersInformation);
    this.userLoginRepository = dataSource.getRepository(DatifyyUsersLogin);
    this.logger = logger || Logger.getInstance();
  }

  /**
   * Find user profile by user login ID
   */
  async findByUserId(userId: number): Promise<DatifyyUsersInformation | null> {
    try {
      this.logger.debug('UserProfileRepository.findByUserId', { userId });

      const profile = await this.repository.findOne({
        where: { 
          userLogin: { id: userId },
          isDeleted: false 
        },
        relations: ['userLogin']
      });

      this.logger.debug('Profile lookup result', { 
        userId, 
        found: !!profile,
        profileId: profile?.id 
      });

      return profile;

    } catch (error) {
      this.logger.error('Failed to find profile by user ID', { userId, error });
      throw new DatabaseConnectionError('findByUserId', error as Error);
    }
  }

  /**
   * Find user profile by profile UUID
   */
  async findById(profileId: string): Promise<DatifyyUsersInformation | null> {
    try {
      this.logger.debug('UserProfileRepository.findById', { profileId });

      const profile = await this.repository.findOne({
        where: { 
          id: profileId,
          isDeleted: false 
        },
        relations: ['userLogin']
      });

      return profile;

    } catch (error) {
      this.logger.error('Failed to find profile by ID', { profileId, error });
      throw new DatabaseConnectionError('findById', error as Error);
    }
  }

  /**
   * Find user profile by official email
   */
  async findByEmail(email: string): Promise<DatifyyUsersInformation | null> {
    try {
      this.logger.debug('UserProfileRepository.findByEmail', { email });

      const profile = await this.repository.findOne({
        where: { 
          officialEmail: email.toLowerCase(),
          isDeleted: false 
        },
        relations: ['userLogin']
      });

      return profile;

    } catch (error) {
      this.logger.error('Failed to find profile by email', { email, error });
      throw new DatabaseConnectionError('findByEmail', error as Error);
    }
  }

  /**
   * Create a new user profile
   */
  async create(profileData: Partial<DatifyyUsersInformation>): Promise<DatifyyUsersInformation> {
    try {
      this.logger.debug('UserProfileRepository.create', { 
        email: profileData.officialEmail 
      });

      // Check for duplicate email
      if (profileData.officialEmail) {
        const existing = await this.isEmailInUse(profileData.officialEmail);
        if (existing) {
          throw new DuplicateEmailError(profileData.officialEmail);
        }
      }

      const profile = this.repository.create(profileData);
      const savedProfile = await this.repository.save(profile);

      this.logger.info('Profile created successfully', { 
        profileId: savedProfile.id,
        email: savedProfile.officialEmail 
      });

      return savedProfile;

    } catch (error) {
      this.logger.error('Failed to create profile', { profileData, error });
      
      if (error instanceof DuplicateEmailError) {
        throw error;
      }
      throw new DatabaseConnectionError('create', error as Error);
    }
  }

  /**
   * Update user profile by profile ID
   */
  async update(
    profileId: string, 
    updateData: Partial<DatifyyUsersInformation>
  ): Promise<DatifyyUsersInformation> {
    try {
      this.logger.debug('UserProfileRepository.update', { 
        profileId, 
        updateFields: Object.keys(updateData) 
      });

      // Find existing profile
      const existingProfile = await this.findById(profileId);
      if (!existingProfile) {
        throw new ProfileNotFoundError(profileId, 'id');
      }

      // Check email uniqueness if email is being updated
      if (updateData.officialEmail && 
          updateData.officialEmail !== existingProfile.officialEmail) {
        const emailInUse = await this.isEmailInUse(updateData.officialEmail, profileId);
        if (emailInUse) {
          throw new DuplicateEmailError(updateData.officialEmail);
        }
      }

      // Merge and save updates
      const updatedProfile = this.repository.merge(existingProfile, updateData);
      updatedProfile.updatedAt = new Date();
      
      const savedProfile = await this.repository.save(updatedProfile);

      this.logger.info('Profile updated successfully', { 
        profileId, 
        updatedFields: Object.keys(updateData) 
      });

      return savedProfile;

    } catch (error) {
      this.logger.error('Failed to update profile', { profileId, updateData, error });
      
      if (error instanceof ProfileNotFoundError || error instanceof DuplicateEmailError) {
        throw error;
      }
      throw new DatabaseConnectionError('update', error as Error);
    }
  }

  /**
   * Soft delete user profile
   */
  async softDelete(profileId: string): Promise<void> {
    try {
      this.logger.debug('UserProfileRepository.softDelete', { profileId });

      const result = await this.repository.update(
        { id: profileId },
        { 
          isDeleted: true,
          updatedAt: new Date()
        }
      );

      if (result.affected === 0) {
        throw new ProfileNotFoundError(profileId, 'id');
      }

      this.logger.info('Profile soft deleted successfully', { profileId });

    } catch (error) {
      this.logger.error('Failed to soft delete profile', { profileId, error });
      
      if (error instanceof ProfileNotFoundError) {
        throw error;
      }
      throw new DatabaseConnectionError('softDelete', error as Error);
    }
  }

  /**
   * Hard delete user profile (admin only)
   */
  async hardDelete(profileId: string): Promise<void> {
    try {
      this.logger.warn('UserProfileRepository.hardDelete - ADMIN OPERATION', { profileId });

      const result = await this.repository.delete({ id: profileId });

      if (result.affected === 0) {
        throw new ProfileNotFoundError(profileId, 'id');
      }

      this.logger.warn('Profile hard deleted successfully', { profileId });

    } catch (error) {
      this.logger.error('Failed to hard delete profile', { profileId, error });
      
      if (error instanceof ProfileNotFoundError) {
        throw error;
      }
      throw new DatabaseConnectionError('hardDelete', error as Error);
    }
  }

  /**
   * Check if user profile exists by user ID
   */
  async existsByUserId(userId: number): Promise<boolean> {
    try {
      const count = await this.repository.count({
        where: { 
          userLogin: { id: userId },
          isDeleted: false 
        }
      });
      
      return count > 0;

    } catch (error) {
      this.logger.error('Failed to check profile existence', { userId, error });
      return false;
    }
  }

  /**
   * Check if email is already in use by another profile
   */
  async isEmailInUse(email: string, excludeProfileId?: string): Promise<boolean> {
    try {
      const whereCondition: any = { 
        officialEmail: email.toLowerCase(),
        isDeleted: false 
      };

      if (excludeProfileId) {
        whereCondition.id = { $ne: excludeProfileId };
      }

      const count = await this.repository.count({ where: whereCondition });
      return count > 0;

    } catch (error) {
      this.logger.error('Failed to check email usage', { email, error });
      return false;
    }
  }

  /**
   * Find multiple profiles by user IDs
   */
  async findByUserIds(userIds: number[]): Promise<DatifyyUsersInformation[]> {
    try {
      this.logger.debug('UserProfileRepository.findByUserIds', { 
        userIds, 
        count: userIds.length 
      });

      const profiles = await this.repository.find({
        where: { 
          userLogin: { id: { $in: userIds } as any },
          isDeleted: false 
        },
        relations: ['userLogin']
      });

      return profiles;

    } catch (error) {
      this.logger.error('Failed to find profiles by user IDs', { userIds, error });
      throw new DatabaseConnectionError('findByUserIds', error as Error);
    }
  }

  /**
   * Get profiles with pagination and filtering
   */
  async findWithPagination(options: ProfileQueryOptions): Promise<{
    profiles: DatifyyUsersInformation[];
    total: number;
  }> {
    try {
      this.logger.debug('UserProfileRepository.findWithPagination', { options });

      const queryBuilder = this.repository.createQueryBuilder('profile')
        .leftJoinAndSelect('profile.userLogin', 'userLogin')
        .where('profile.isDeleted = :isDeleted', { isDeleted: false });

      // Apply filters
      this.applyFilters(queryBuilder, options.filters);

      // Apply search
      if (options.search) {
        this.applySearch(queryBuilder, options.search);
      }

      // Apply sorting
      const sortBy = options.sortBy || 'updatedAt';
      const sortOrder = options.sortOrder || 'DESC';
      queryBuilder.orderBy(`profile.${sortBy}`, sortOrder);

      // Apply pagination
      const page = options.page || 1;
      const limit = options.limit || 20;
      const skip = (page - 1) * limit;

      queryBuilder.skip(skip).take(limit);

      // Execute queries
      const [profiles, total] = await queryBuilder.getManyAndCount();

      this.logger.debug('Pagination query completed', { 
        total, 
        returned: profiles.length,
        page,
        limit 
      });

      return { profiles, total };

    } catch (error) {
      this.logger.error('Failed to find profiles with pagination', { options, error });
      throw new DatabaseConnectionError('findWithPagination', error as Error);
    }
  }

  /**
   * Update verification status fields
   */
  async updateVerificationStatus(
    profileId: string,
    verificationType: 'email' | 'phone' | 'aadhar',
    status: boolean
  ): Promise<DatifyyUsersInformation> {
    try {
      this.logger.debug('UserProfileRepository.updateVerificationStatus', { 
        profileId, 
        verificationType, 
        status 
      });

      const updateData: Partial<DatifyyUsersInformation> = {
        updatedAt: new Date()
      };

      switch (verificationType) {
        case 'email':
          updateData.isOfficialEmailVerified = status;
          break;
        case 'phone':
          updateData.isPhoneVerified = status;
          break;
        case 'aadhar':
          updateData.isAadharVerified = status;
          break;
      }

      const updatedProfile = await this.update(profileId, updateData);

      this.logger.info('Verification status updated successfully', { 
        profileId, 
        verificationType, 
        status 
      });

      return updatedProfile;

    } catch (error) {
      this.logger.error('Failed to update verification status', { 
        profileId, 
        verificationType, 
        error 
      });
      throw error; // Re-throw specific errors from update method
    }
  }

  /**
   * Find profiles by location
   */
  async findByLocation(location: string, radius?: number): Promise<DatifyyUsersInformation[]> {
    try {
      this.logger.debug('UserProfileRepository.findByLocation', { location, radius });

      const queryBuilder = this.repository.createQueryBuilder('profile')
        .leftJoinAndSelect('profile.userLogin', 'userLogin')
        .where('profile.isDeleted = :isDeleted', { isDeleted: false })
        .andWhere(
          '(LOWER(profile.currentCity) LIKE LOWER(:location) OR LOWER(profile.hometown) LIKE LOWER(:location))',
          { location: `%${location}%` }
        );

      const profiles = await queryBuilder.getMany();

      this.logger.debug('Location search completed', { 
        location, 
        foundCount: profiles.length 
      });

      return profiles;

    } catch (error) {
      this.logger.error('Failed to find profiles by location', { location, error });
      throw new DatabaseConnectionError('findByLocation', error as Error);
    }
  }

  /**
   * Get profile statistics for analytics
   */
  async getProfileAnalytics(): Promise<ProfileAnalytics> {
    try {
      this.logger.debug('UserProfileRepository.getProfileAnalytics');

      // Execute multiple queries for comprehensive analytics
      const [
        totalProfiles,
        activeProfiles,
        deletedProfiles,
        verifiedEmail,
        verifiedPhone,
        verifiedAadhar,
        genderStats,
        cityStats
      ] = await Promise.all([
        this.repository.count(),
        this.repository.count({ where: { isDeleted: false } }),
        this.repository.count({ where: { isDeleted: true } }),
        this.repository.count({ where: { isOfficialEmailVerified: true, isDeleted: false } }),
        this.repository.count({ where: { isPhoneVerified: true, isDeleted: false } }),
        this.repository.count({ where: { isAadharVerified: true, isDeleted: false } }),
        this.getGenderDistribution(),
        this.getCityDistribution()
      ]);

      const analytics: ProfileAnalytics = {
        totalProfiles,
        activeProfiles,
        deletedProfiles,
        verifiedProfiles: {
          email: verifiedEmail,
          phone: verifiedPhone,
          aadhar: verifiedAadhar,
          all: await this.repository.count({
            where: {
              isOfficialEmailVerified: true,
              isPhoneVerified: true,
              isAadharVerified: true,
              isDeleted: false
            }
          })
        },
        completionStats: await this.getCompletionStats(),
        demographics: {
          genderDistribution: genderStats,
          ageDistribution: await this.getAgeDistribution(),
          cityDistribution: cityStats
        },
        growthMetrics: await this.getGrowthMetrics()
      };

      this.logger.info('Profile analytics generated successfully', { 
        totalProfiles: analytics.totalProfiles,
        activeProfiles: analytics.activeProfiles 
      });

      return analytics;

    } catch (error) {
      this.logger.error('Failed to get profile analytics', { error });
      throw new DatabaseConnectionError('getProfileAnalytics', error as Error);
    }
  }

  /**
   * Find incomplete profiles for engagement campaigns
   */
  async findIncompleteProfiles(completionThreshold: number): Promise<DatifyyUsersInformation[]> {
    try {
      this.logger.debug('UserProfileRepository.findIncompleteProfiles', { completionThreshold });

      // This is a simplified approach - in production, you might want to 
      // calculate completion percentage in the database for better performance
      const allProfiles = await this.repository.find({
        where: { isDeleted: false },
        relations: ['userLogin']
      });

      const incompleteProfiles = allProfiles.filter(profile => {
        const completion = this.calculateProfileCompletion(profile);
        return completion < completionThreshold;
      });

      this.logger.debug('Incomplete profiles found', { 
        total: allProfiles.length,
        incomplete: incompleteProfiles.length,
        threshold: completionThreshold 
      });

      return incompleteProfiles;

    } catch (error) {
      this.logger.error('Failed to find incomplete profiles', { completionThreshold, error });
      throw new DatabaseConnectionError('findIncompleteProfiles', error as Error);
    }
  }

  /**
   * Update last active timestamp
   */
  async updateLastActive(userId: number): Promise<void> {
    try {
      await this.repository.update(
        { userLogin: { id: userId } },
        { updatedAt: new Date() }
      );
    } catch (error) {
      this.logger.error('Failed to update last active', { userId, error });
      // Don't throw error for last active updates to avoid disrupting main flow
    }
  }

  /**
   * Bulk update multiple profiles
   */
  async bulkUpdate(updates: BulkProfileUpdate[]): Promise<DatifyyUsersInformation[]> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      this.logger.info('UserProfileRepository.bulkUpdate initiated', { 
        updateCount: updates.length 
      });

      const updatedProfiles: DatifyyUsersInformation[] = [];

      for (const update of updates) {
        const profile = await queryRunner.manager.findOne(DatifyyUsersInformation, {
          where: { id: update.profileId }
        });

        if (profile) {
          const merged = queryRunner.manager.merge(DatifyyUsersInformation, profile, {
            ...update.updateData,
            updatedAt: new Date()
          });
          
          const saved = await queryRunner.manager.save(merged);
          updatedProfiles.push(saved);
        }
      }

      await queryRunner.commitTransaction();

      this.logger.info('Bulk update completed successfully', { 
        requested: updates.length,
        updated: updatedProfiles.length 
      });

      return updatedProfiles;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Bulk update failed', { updates, error });
      throw new DatabaseConnectionError('bulkUpdate', error as Error);
    } finally {
      await queryRunner.release();
    }
  }

  // Private helper methods

  private applyFilters(
    queryBuilder: SelectQueryBuilder<DatifyyUsersInformation>, 
    filters?: ProfileQueryOptions['filters']
  ): void {
    if (!filters) return;

    if (filters.gender) {
      queryBuilder.andWhere('profile.gender = :gender', { gender: filters.gender });
    }

    if (filters.city) {
      queryBuilder.andWhere('profile.currentCity ILIKE :city', { city: `%${filters.city}%` });
    }

    if (filters.lookingFor) {
      queryBuilder.andWhere('profile.lookingFor = :lookingFor', { lookingFor: filters.lookingFor });
    }

    if (filters.isVerified !== undefined) {
      queryBuilder.andWhere('profile.isOfficialEmailVerified = :isVerified', { 
        isVerified: filters.isVerified 
      });
    }

    if (filters.ageMin || filters.ageMax) {
      const currentDate = new Date();
      
      if (filters.ageMin) {
        const maxBirthDate = new Date(currentDate.getFullYear() - filters.ageMin, 0, 1);
        queryBuilder.andWhere('profile.dob <= :maxBirthDate', { maxBirthDate });
      }
      
      if (filters.ageMax) {
        const minBirthDate = new Date(currentDate.getFullYear() - filters.ageMax - 1, 0, 1);
        queryBuilder.andWhere('profile.dob >= :minBirthDate', { minBirthDate });
      }
    }
  }

  private applySearch(
    queryBuilder: SelectQueryBuilder<DatifyyUsersInformation>, 
    search: ProfileQueryOptions['search']
  ): void {
    if (!search) return;

    const searchConditions = search.fields.map((field, index) => 
      `profile.${field} ILIKE :searchTerm${index}`
    );

    queryBuilder.andWhere(`(${searchConditions.join(' OR ')})`, 
      search.fields.reduce((params, field, index) => {
        params[`searchTerm${index}`] = `%${search.query}%`;
        return params;
      }, {} as Record<string, string>)
    );
  }

  private async getGenderDistribution(): Promise<Record<string, number>> {
    const result = await this.repository
      .createQueryBuilder('profile')
      .select('profile.gender', 'gender')
      .addSelect('COUNT(*)', 'count')
      .where('profile.isDeleted = false')
      .groupBy('profile.gender')
      .getRawMany();

    return result.reduce((acc, row) => {
      acc[row.gender || 'unknown'] = parseInt(row.count);
      return acc;
    }, {} as Record<string, number>);
  }

  private async getCityDistribution(): Promise<Record<string, number>> {
    const result = await this.repository
      .createQueryBuilder('profile')
      .select('profile.currentCity', 'city')
      .addSelect('COUNT(*)', 'count')
      .where('profile.isDeleted = false')
      .andWhere('profile.currentCity IS NOT NULL')
      .groupBy('profile.currentCity')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    return result.reduce((acc, row) => {
      acc[row.city] = parseInt(row.count);
      return acc;
    }, {} as Record<string, number>);
  }

  private async getAgeDistribution(): Promise<Record<string, number>> {
    // Simplified age distribution - in production, calculate age ranges
    const currentYear = new Date().getFullYear();
    const ageRanges = [
      { label: '18-25', min: currentYear - 25, max: currentYear - 18 },
      { label: '26-35', min: currentYear - 35, max: currentYear - 26 },
      { label: '36-45', min: currentYear - 45, max: currentYear - 36 },
      { label: '46+', min: 1900, max: currentYear - 46 }
    ];

    const distribution: Record<string, number> = {};

    for (const range of ageRanges) {
      const count = await this.repository.count({
        where: {
          isDeleted: false,
          dob: { $gte: `${range.min}-01-01`, $lte: `${range.max}-12-31` } as any
        }
      });
      distribution[range.label] = count;
    }

    return distribution;
  }

  private async getCompletionStats(): Promise<ProfileAnalytics['completionStats']> {
    // Simplified completion stats
    return {
      average: 75, // Calculate actual average
      distribution: [
        { range: '0-25%', count: 50 },
        { range: '26-50%', count: 100 },
        { range: '51-75%', count: 200 },
        { range: '76-100%', count: 300 }
      ]
    };
  }

  private async getGrowthMetrics(): Promise<ProfileAnalytics['growthMetrics']> {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [newThisMonth, newThisWeek, activeThisMonth] = await Promise.all([
      this.repository.count({
        where: { 
          userLogin: { lastlogin: { $gte: thisMonth } as any },
          isDeleted: false 
        }
      }),
      this.repository.count({
        where: { 
          userLogin: { lastlogin: { $gte: thisWeek } as any },
          isDeleted: false 
        }
      }),
      this.repository.count({
        where: { 
          updatedAt: { $gte: thisMonth } as any,
          isDeleted: false 
        }
      })
    ]);

    return {
      newProfilesThisMonth: newThisMonth,
      newProfilesThisWeek: newThisWeek,
      activeThisMonth: activeThisMonth
    };
  }

  private calculateProfileCompletion(profile: DatifyyUsersInformation): number {
    const fields = [
      'firstName', 'lastName', 'gender', 'bio', 'dob', 'currentCity',
      'lookingFor', 'height', 'exercise', 'educationLevel'
    ];

    const filledFields = fields.filter(field => {
      const value = (profile as any)[field];
      return value !== null && value !== undefined && value !== '';
    });

    return Math.round((filledFields.length / fields.length) * 100);
  }
}