/**
 * Admin Repository Implementation - TypeORM Data Access
 * 
 * Implements admin data access operations using TypeORM.
 * Provides optimized queries and comprehensive error handling.
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */

import { Repository, DataSource, QueryRunner, SelectQueryBuilder } from 'typeorm';
import {
  IAdminRepository,
  PaginationOptions,
  PaginatedResult,
  AdminSearchCriteria,
  AdminActivityMetrics
} from './IAdminRepository';
import {
  AdminPermissionLevel,
  AdminAccountStatus,
} from '../../../proto-types/admin/enums';
import { Logger } from '../../../infrastructure/logging/Logger';
import { DatifyyUsersLogin } from '../../../models/entities/DatifyyUsersLogin';
import {
  adminPermissionLevelToDb,
  dbToAdminPermissionLevel,
  adminAccountStatusToDb,
  dbToAdminAccountStatus
} from '../../../utils/enum-converters';
import { ADMIN_SECURITY_CONSTANTS } from '../../../utils/admin-auth-constants';

/**
 * TypeORM implementation of Admin Repository
 * 
 * Provides efficient database operations with comprehensive error handling.
 * Implements all interface methods with optimized queries and logging.
 */
export class AdminRepository implements IAdminRepository {
  private readonly repository: Repository<DatifyyUsersLogin>;
  private readonly logger: Logger;

  constructor(
    private readonly dataSource: DataSource,
    logger?: Logger
  ) {
    this.repository = dataSource.getRepository(DatifyyUsersLogin);
    this.logger = logger || Logger.getInstance();
  }

  /**
   * Core CRUD Operations
   */

  async findById(id: number): Promise<DatifyyUsersLogin | null> {
    try {
      this.logger.debug('Finding admin by ID', { adminId: id });
      
      const admin = await this.repository.findOne({
        where: { id, isactive: true }
      });

      this.logger.debug('Admin found by ID', { 
        adminId: id, 
        found: !!admin,
        email: admin?.email 
      });

      return admin;
    } catch (error) {
      this.logger.error('Error finding admin by ID', { adminId: id, error });
      throw error;
    }
  }

  async findByEmail(email: string): Promise<DatifyyUsersLogin | null> {
    try {
      this.logger.debug('Finding admin by email', { email });
      
      const admin = await this.repository.findOne({
        where: { email: email.toLowerCase(), isactive: true }
      });

      this.logger.debug('Admin found by email', { 
        email, 
        found: !!admin,
        adminId: admin?.id 
      });

      return admin;
    } catch (error) {
      this.logger.error('Error finding admin by email', { email, error });
      throw error;
    }
  }

  async create(adminData: Partial<DatifyyUsersLogin>): Promise<DatifyyUsersLogin> {
    try {
      this.logger.info('Creating new admin', { 
        email: adminData.email,
        permissionLevel: adminData.permissionLevel 
      });

      // Normalize email
      if (adminData.email) {
        adminData.email = adminData.email.toLowerCase();
      }

      const admin = this.repository.create(adminData);
      const savedAdmin = await this.repository.save(admin);

      this.logger.info('Admin created successfully', { 
        adminId: savedAdmin.id,
        email: savedAdmin.email 
      });

      return savedAdmin;
    } catch (error) {
      this.logger.error('Error creating admin', { adminData, error });
      throw error;
    }
  }

  async update(id: number, updateData: Partial<DatifyyUsersLogin>): Promise<DatifyyUsersLogin> {
    try {
      this.logger.info('Updating admin', { adminId: id, fields: Object.keys(updateData) });

      // Normalize email if provided
      if (updateData.email) {
        updateData.email = updateData.email.toLowerCase();
      }

      await this.repository.update(id, updateData);
      const updatedAdmin = await this.findById(id);

      if (!updatedAdmin) {
        throw new Error(`Admin with ID ${id} not found after update`);
      }

      this.logger.info('Admin updated successfully', { 
        adminId: id,
        email: updatedAdmin.email 
      });

      return updatedAdmin;
    } catch (error) {
      this.logger.error('Error updating admin', { adminId: id, updateData, error });
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      this.logger.info('Soft deleting admin', { adminId: id });

      const result = await this.repository.update(id, { 
        isactive: false,
        accountStatus: adminAccountStatusToDb(AdminAccountStatus.DEACTIVATED) as any,
        updatedAt: new Date()
      });

      const success = result.affected === 1;
      
      this.logger.info('Admin deletion result', { adminId: id, success });
      
      return success;
    } catch (error) {
      this.logger.error('Error deleting admin', { adminId: id, error });
      throw error;
    }
  }

  async save(admin: DatifyyUsersLogin): Promise<DatifyyUsersLogin> {
    try {
      this.logger.debug('Saving admin entity', { adminId: admin.id });
      
      const savedAdmin = await this.repository.save(admin);
      
      this.logger.debug('Admin entity saved', { adminId: savedAdmin.id });
      
      return savedAdmin;
    } catch (error) {
      this.logger.error('Error saving admin entity', { adminId: admin.id, error });
      throw error;
    }
  }

  async existsByEmail(email: string): Promise<boolean> {
    try {
      const count = await this.repository.count({
        where: { email: email.toLowerCase(), isactive: true }
      });
      
      return count > 0;
    } catch (error) {
      this.logger.error('Error checking admin exists by email', { email, error });
      throw error;
    }
  }

  /**
   * Query & Search Operations
   */

  async findAllActive(): Promise<DatifyyUsersLogin[]> {
    try {
      this.logger.debug('Finding all active admins');
      
      const admins = await this.repository.find({
        where: { 
          isactive: true,
          accountStatus: adminAccountStatusToDb(AdminAccountStatus.ADMIN_ACTIVE) as any
        },
        order: { createdAt: 'DESC' }
      });

      this.logger.debug('Active admins found', { count: admins.length });
      
      return admins;
    } catch (error) {
      this.logger.error('Error finding all active admins', { error });
      throw error;
    }
  }

  async findByPermissionLevel(permissionLevel: AdminPermissionLevel): Promise<DatifyyUsersLogin[]> {
    try {
      const admins = await this.repository.find({
        where: { 
          permissionLevel: adminPermissionLevelToDb(permissionLevel) as any,
          isactive: true 
        },
        order: { createdAt: 'DESC' }
      });

      return admins;
    } catch (error) {
      this.logger.error('Error finding admins by permission level', { 
        permissionLevel, 
        error 
      });
      throw error;
    }
  }

  async findByAccountStatus(accountStatus: AdminAccountStatus): Promise<DatifyyUsersLogin[]> {
    try {
      const admins = await this.repository.find({
        where: { 
          accountStatus: adminAccountStatusToDb(accountStatus) as any,
          isactive: true 
        },
        order: { createdAt: 'DESC' }
      });

      return admins;
    } catch (error) {
      this.logger.error('Error finding admins by account status', { 
        accountStatus, 
        error 
      });
      throw error;
    }
  }

  async search(
    criteria: AdminSearchCriteria,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<DatifyyUsersLogin>> {
    try {
      this.logger.debug('Searching admins', { criteria, pagination });

      const queryBuilder = this.repository.createQueryBuilder('admin');
      
      // Apply search criteria
      this.applySearchCriteria(queryBuilder, criteria);
      
      // Apply pagination and sorting
      const { page, limit, sortBy = 'createdAt', sortOrder = 'DESC' } = pagination;
      const skip = (page - 1) * limit;
      
      queryBuilder
        .skip(skip)
        .take(limit)
        .orderBy(`admin.${sortBy}`, sortOrder);

      const [data, total] = await queryBuilder.getManyAndCount();
      
      const result: PaginatedResult<DatifyyUsersLogin> = {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrevious: page > 1
      };

      this.logger.debug('Admin search completed', { 
        total, 
        page, 
        limit,
        resultsCount: data.length 
      });

      return result;
    } catch (error) {
      this.logger.error('Error searching admins', { criteria, pagination, error });
      throw error;
    }
  }

  async findWithFilters(
    filters: any,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<DatifyyUsersLogin>> {
    try {
      const criteria: AdminSearchCriteria = {
        permissionLevel: filters.permissionLevel,
        accountStatus: filters.accountStatus,
        department: filters.department,
        createdAfter: filters.createdAfter ? new Date(filters.createdAfter) : undefined,
        createdBefore: filters.createdBefore ? new Date(filters.createdBefore) : undefined,
        lastLoginAfter: filters.lastLoginAfter ? new Date(filters.lastLoginAfter) : undefined,
        lastLoginBefore: filters.lastLoginBefore ? new Date(filters.lastLoginBefore) : undefined
      };

      // Handle search term
      // if (filters.search) {
      //   const searchTerm = filters.search.toLowerCase();
      //   criteria.email = searchTerm;
      //   criteria.firstName = searchTerm;
      //   criteria.lastName = searchTerm;
      // }

      return this.search(criteria, pagination);
    } catch (error) {
      this.logger.error('Error finding admins with filters', { filters, pagination, error });
      throw error;
    }
  }

  /**
   * Security & Authentication Operations
   */

  async findLockedAccounts(): Promise<DatifyyUsersLogin[]> {
    try {
      const now = new Date();
      
      const admins = await this.repository.find({
        where: [
          { accountStatus: adminAccountStatusToDb(AdminAccountStatus.ADMIN_LOCKED) as any, isactive: true },
          { 
            lockedAt: new Date(),
            isactive: true
          }
        ]
      });

      // Filter for currently locked accounts
      const lockedAdmins = admins.filter(admin => 
        admin.lockExpiresAt && admin.lockExpiresAt > now
      );

      return lockedAdmins;
    } catch (error) {
      this.logger.error('Error finding locked accounts', { error });
      throw error;
    }
  }

  async updateLoginInfo(
    id: number,
    loginData: {
      lastLoginAt: Date;
      lastLoginIp: string;
      lastLoginUserAgent: string;
      loginCount: number;
    }
  ): Promise<DatifyyUsersLogin> {
    try {
      this.logger.info('Updating admin login info', { adminId: id });

      await this.repository.update(id, {
        ...loginData,
        lastActiveAt: new Date(),
        failedLoginAttempts: 0 // Reset on successful login
      });

      const updatedAdmin = await this.findById(id);
      if (!updatedAdmin) {
        throw new Error(`Admin with ID ${id} not found after login update`);
      }

      return updatedAdmin;
    } catch (error) {
      this.logger.error('Error updating admin login info', { adminId: id, error });
      throw error;
    }
  }

  async updateLastActivity(id: number): Promise<boolean> {
    try {
      const result = await this.repository.update(id, {
        lastActiveAt: new Date()
      });

      return result.affected === 1;
    } catch (error) {
      this.logger.error('Error updating admin last activity', { adminId: id, error });
      throw error;
    }
  }

  async incrementFailedLoginAttempts(id: number): Promise<number> {
    try {
      const admin = await this.findById(id);
      if (!admin) {
        throw new Error(`Admin with ID ${id} not found`);
      }

      const newAttempts = admin.failedLoginAttempts + 1;
      
      // Check if account should be locked
      if (newAttempts >= ADMIN_SECURITY_CONSTANTS.maxLoginAttempts) {
        await this.lockAccount(id, ADMIN_SECURITY_CONSTANTS.accountLockDurationMinutes);
      } else {
        await this.repository.update(id, { failedLoginAttempts: newAttempts });
      }

      return newAttempts;
    } catch (error) {
      this.logger.error('Error incrementing failed login attempts', { adminId: id, error });
      throw error;
    }
  }

  async resetFailedLoginAttempts(id: number): Promise<boolean> {
    try {
      const result = await this.repository.update(id, {
        failedLoginAttempts: 0
      });

      return result.affected === 1;
    } catch (error) {
      this.logger.error('Error resetting failed login attempts', { adminId: id, error });
      throw error;
    }
  }

  async lockAccount(id: number, lockDurationMinutes: number): Promise<boolean> {
    try {
      this.logger.warn('Locking admin account', { adminId: id, lockDurationMinutes });

      const now = new Date();
      const lockExpiresAt = new Date(now.getTime() + lockDurationMinutes * 60 * 1000);

      const result = await this.repository.update(id, {
        accountStatus: adminAccountStatusToDb(AdminAccountStatus.ADMIN_LOCKED) as any,
        lockedAt: now,
        lockExpiresAt,
        failedLoginAttempts: 0
      });

      const success = result.affected === 1;
      
      this.logger.warn('Admin account lock result', { adminId: id, success });
      
      return success;
    } catch (error) {
      this.logger.error('Error locking admin account', { adminId: id, error });
      throw error;
    }
  }

  async unlockAccount(id: number): Promise<boolean> {
    try {
      this.logger.info('Unlocking admin account', { adminId: id });

      const result = await this.repository.update(id, {
        accountStatus: adminAccountStatusToDb(AdminAccountStatus.ADMIN_ACTIVE) as any,
        lockedAt: undefined,
        lockExpiresAt: undefined,
        failedLoginAttempts: 0
      });

      const success = result.affected === 1;
      
      this.logger.info('Admin account unlock result', { adminId: id, success });
      
      return success;
    } catch (error) {
      this.logger.error('Error unlocking admin account', { adminId: id, error });
      throw error;
    }
  }

  /**
   * Analytics & Reporting Operations
   */

  async getActivityMetrics(): Promise<AdminActivityMetrics> {
    try {
      this.logger.debug('Getting admin activity metrics');

      const [
        totalAdmins,
        activeAdmins,
        lockedAdmins,
        adminsLoggedInToday,
        adminsLoggedInThisWeek
      ] = await Promise.all([
        this.repository.count({ where: { isactive: true } }),
        this.repository.count({ 
          where: { 
            isactive: true, 
            accountStatus: adminAccountStatusToDb(AdminAccountStatus.ADMIN_ACTIVE) as any
          } 
        }),
        this.repository.count({ 
          where: { 
            isactive: true, 
            accountStatus: adminAccountStatusToDb(AdminAccountStatus.ADMIN_LOCKED) as any
          } 
        }),
        this.getAdminsLoggedInSince(this.getStartOfDay()),
        this.getAdminsLoggedInSince(this.getStartOfWeek())
      ]);

      const adminsByPermissionLevel = await this.getAdminCountByPermissionLevel();

      return {
        totalAdmins,
        activeAdmins,
        lockedAdmins,
        adminsLoggedInToday,
        adminsLoggedInThisWeek,
        adminsByPermissionLevel,
        averageLoginFrequency: 0 // TODO: Implement calculation
      };
    } catch (error) {
      this.logger.error('Error getting admin activity metrics', { error });
      throw error;
    }
  }

  /**
   * Transaction Support
   */

  async runInTransaction<T>(
    operation: (repository: IAdminRepository) => Promise<T>
  ): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const transactionalRepo = new AdminRepository(queryRunner.manager.connection, this.logger);
      const result = await operation(transactionalRepo);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Health & Maintenance Operations
   */

  async healthCheck(): Promise<{
    isHealthy: boolean;
    connectionStatus: 'connected' | 'disconnected' | 'error';
    totalRecords: number;
    lastHealthCheck: Date;
  }> {
    try {
      const totalRecords = await this.repository.count();
      
      return {
        isHealthy: true,
        connectionStatus: 'connected',
        totalRecords,
        lastHealthCheck: new Date()
      };
    } catch (error) {
      this.logger.error('Admin repository health check failed', { error });
      
      return {
        isHealthy: false,
        connectionStatus: 'error',
        totalRecords: 0,
        lastHealthCheck: new Date()
      };
    }
  }

  /**
   * Private Helper Methods
   */

  private applySearchCriteria(
    queryBuilder: SelectQueryBuilder<DatifyyUsersLogin>,
    criteria: AdminSearchCriteria
  ): void {
    queryBuilder.where('admin.isactive = :isactive', { isactive: true });

    if (criteria.email || criteria.firstName || criteria.lastName) {
      const searchConditions: string[] = [];
      const searchParams: any = {};

      if (criteria.email) {
        searchConditions.push('LOWER(admin.email) LIKE :email');
        searchParams.email = `%${criteria.email.toLowerCase()}%`;
      }

      if (criteria.firstName) {
        searchConditions.push('LOWER(admin.firstName) LIKE :firstName');
        searchParams.firstName = `%${criteria.firstName.toLowerCase()}%`;
      }

      if (criteria.lastName) {
        searchConditions.push('LOWER(admin.lastName) LIKE :lastName');
        searchParams.lastName = `%${criteria.lastName.toLowerCase()}%`;
      }

      if (searchConditions.length > 0) {
        queryBuilder.andWhere(`(${searchConditions.join(' OR ')})`, searchParams);
      }
    }

    if (criteria.permissionLevel) {
      queryBuilder.andWhere('admin.permissionLevel = :permissionLevel', {
        permissionLevel: adminPermissionLevelToDb(criteria.permissionLevel)
      });
    }

    if (criteria.accountStatus) {
      queryBuilder.andWhere('admin.accountStatus = :accountStatus', {
        accountStatus: adminAccountStatusToDb(criteria.accountStatus)
      });
    }

    if (criteria.department) {
      queryBuilder.andWhere('admin.department = :department', {
        department: criteria.department
      });
    }

    if (criteria.createdAfter) {
      queryBuilder.andWhere('admin.createdAt >= :createdAfter', {
        createdAfter: criteria.createdAfter
      });
    }

    if (criteria.createdBefore) {
      queryBuilder.andWhere('admin.createdAt <= :createdBefore', {
        createdBefore: criteria.createdBefore
      });
    }

    if (criteria.lastLoginAfter) {
      queryBuilder.andWhere('admin.lastLoginAt >= :lastLoginAfter', {
        lastLoginAfter: criteria.lastLoginAfter
      });
    }

    if (criteria.lastLoginBefore) {
      queryBuilder.andWhere('admin.lastLoginAt <= :lastLoginBefore', {
        lastLoginBefore: criteria.lastLoginBefore
      });
    }
  }

  private async getAdminsLoggedInSince(since: Date): Promise<number> {
    return this.repository.count({
      where: {
        isactive: true,
        lastLoginAt: new Date() // Use MoreThanOrEqual when imported
      }
    });
  }

  private async getAdminCountByPermissionLevel(): Promise<Record<AdminPermissionLevel, number>> {
    const levels = Object.values(AdminPermissionLevel);
    const counts: Record<AdminPermissionLevel, number> = {} as any;

      for (const level of levels) {
      counts[level] = await this.repository.count({
        where: { permissionLevel: adminPermissionLevelToDb(level) as any, isactive: true }
      });
    }

    return counts;
  }

  private getStartOfDay(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  private getStartOfWeek(): Date {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek;
    return new Date(now.setDate(diff));
  }

  // Implement remaining interface methods...
  async findExpiredPasswords(): Promise<DatifyyUsersLogin[]> {
    // TODO: Implement
    return [];
  }

  async findRequirePasswordChange(): Promise<DatifyyUsersLogin[]> {
    // TODO: Implement
    return [];
  }

  async findWithTwoFactorEnabled(): Promise<DatifyyUsersLogin[]> {
    // TODO: Implement
    return [];
  }

  async findByLastLoginSince(since: Date): Promise<DatifyyUsersLogin[]> {
    // TODO: Implement
    return [];
  }

  async findInactiveAdmins(inactiveSince: Date): Promise<DatifyyUsersLogin[]> {
    // TODO: Implement
    return [];
  }

  async countByCriteria(criteria: Partial<AdminSearchCriteria>): Promise<number> {
    // TODO: Implement
    return 0;
  }

  async findCreatedInDateRange(startDate: Date, endDate: Date): Promise<DatifyyUsersLogin[]> {
    // TODO: Implement
    return [];
  }

  async getLoginActivityReport(startDate: Date, endDate: Date): Promise<Array<{
    adminId: number;
    email: string;
    loginCount: number;
    lastLoginAt: Date;
    totalHoursActive: number;
  }>> {
    // TODO: Implement
    return [];
  }

  async findByIds(ids: number[]): Promise<DatifyyUsersLogin[]> {
    // TODO: Implement
    return [];
  }

  async batchUpdateStatus(ids: number[], status: AdminAccountStatus): Promise<number> {
    // TODO: Implement
    return 0;
  }

  async batchUpdatePermissionLevel(ids: number[], permissionLevel: AdminPermissionLevel): Promise<number> {
    // TODO: Implement
    return 0;
  }

  async cleanupExpiredLocks(): Promise<number> {
    // TODO: Implement
    return 0;
  }

  async archiveInactiveAccounts(inactiveDays: number): Promise<number> {
    // TODO: Implement
    return 0;
  }
}