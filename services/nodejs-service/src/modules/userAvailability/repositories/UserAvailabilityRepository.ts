// services/nodejs-service/src/modules/userAvailability/repositories/UserAvailabilityRepository.ts

import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { 
  CreateAvailabilityRequest,
  UpdateAvailabilityRequest,
  GetAvailabilityRequest,
  PaginationResponse
} from '../../../proto-types/user/availability';
import { DatifyyUserAvailability } from '../../../models/entities/DatifyyUserAvailability';
import { DatifyyUsersInformation } from '../../../models/entities/DatifyyUsersInformation';
import { DatifyyAvailabilityBookings } from '../../../models/entities/DatifyyAvailabilityBookings';
import { Logger } from '../../../infrastructure/logging/Logger';
import { 
  IUserAvailabilityRepository, 
  AvailabilityStats,
  AvailabilitySearchCriteria,
  UserAvailabilityMatch,
  CalendarDayData
} from './IUserAvailabilityRepository';

/**
 * User Availability Repository Implementation
 * 
 * Handles all database operations for user availability management.
 * Implements sophisticated querying, conflict detection, and analytics.
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */
export class UserAvailabilityRepository implements IUserAvailabilityRepository {
  private readonly repository: Repository<DatifyyUserAvailability>;
  private readonly userRepository: Repository<DatifyyUsersInformation>;
  private readonly bookingRepository: Repository<DatifyyAvailabilityBookings>;

  constructor(
    private readonly dataSource: DataSource,
    private readonly logger: Logger
  ) {
    this.repository = dataSource.getRepository(DatifyyUserAvailability);
    this.userRepository = dataSource.getRepository(DatifyyUsersInformation);
    this.bookingRepository = dataSource.getRepository(DatifyyAvailabilityBookings);
  }

  /**
   * Create a new availability slot for a user
   */
  async create(userId: number, availabilityData: CreateAvailabilityRequest): Promise<DatifyyUserAvailability> {
    this.logger.info('Creating availability slot', { userId, date: availabilityData.availabilityDate });

    try {
      const availability = this.repository.create({
        userId,
        availabilityDate: availabilityData.availabilityDate,
        startTime: availabilityData.startTime,
        endTime: availabilityData.endTime,
        timezone: availabilityData.timezone || 'UTC',
        dateType: availabilityData.dateType,
        title: availabilityData.title,
        notes: availabilityData.notes,
        locationPreference: availabilityData.locationPreference,
        bufferTimeMinutes: availabilityData.bufferTimeMinutes || 30,
        preparationTimeMinutes: availabilityData.preparationTimeMinutes || 15,
        cancellationPolicy: availabilityData.cancellationPolicy || '24_hours',
        isRecurring: availabilityData.isRecurring || false,
        recurrenceType: availabilityData.recurrenceType || 'none',
        recurrenceEndDate: availabilityData.recurrenceEndDate,
        status: 'active'
      });

      const savedAvailability = await this.repository.save(availability);
      
      this.logger.info('Availability slot created successfully', { 
        userId, 
        availabilityId: savedAvailability.id 
      });

      return savedAvailability;
    } catch (error) {
      this.logger.error('Failed to create availability slot', { userId, error });
      throw error;
    }
  }

  /**
   * Create multiple availability slots in bulk
   */
  async createBulk(userId: number, availabilitySlots: CreateAvailabilityRequest[]): Promise<DatifyyUserAvailability[]> {
    this.logger.info('Creating bulk availability slots', { userId, count: availabilitySlots.length });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const createdSlots: DatifyyUserAvailability[] = [];

      for (const slotData of availabilitySlots) {
        const availability = queryRunner.manager.create(DatifyyUserAvailability, {
          userId,
          availabilityDate: slotData.availabilityDate,
          startTime: slotData.startTime,
          endTime: slotData.endTime,
          timezone: slotData.timezone || 'UTC',
          dateType: slotData.dateType,
          title: slotData.title,
          notes: slotData.notes,
          locationPreference: slotData.locationPreference,
          bufferTimeMinutes: slotData.bufferTimeMinutes || 30,
          preparationTimeMinutes: slotData.preparationTimeMinutes || 15,
          cancellationPolicy: slotData.cancellationPolicy || '24_hours',
          isRecurring: slotData.isRecurring || false,
          recurrenceType: slotData.recurrenceType || 'none',
          recurrenceEndDate: slotData.recurrenceEndDate,
          status: 'active'
        });

        const savedSlot = await queryRunner.manager.save(availability);
        createdSlots.push(savedSlot);
      }

      await queryRunner.commitTransaction();
      
      this.logger.info('Bulk availability slots created successfully', { 
        userId, 
        createdCount: createdSlots.length 
      });

      return createdSlots;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Failed to create bulk availability slots', { userId, error });
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Find availability slot by ID
   */
  async findById(availabilityId: number, includeBookings = false): Promise<DatifyyUserAvailability | null> {
    this.logger.debug('Finding availability by ID', { availabilityId, includeBookings });

    try {
      const query = this.repository.createQueryBuilder('availability')
        .leftJoinAndSelect('availability.user', 'user')
        .where('availability.id = :availabilityId', { availabilityId })
        .andWhere('availability.isDeleted = :isDeleted', { isDeleted: false });

      if (includeBookings) {
        query.leftJoinAndSelect('availability.datifyyAvailabilityBookings', 'bookings')
          .leftJoinAndSelect('bookings.bookedByUser', 'bookedByUser');
      }

      const availability = await query.getOne();
      
      this.logger.debug('Availability found', { 
        availabilityId, 
        found: !!availability 
      });

      return availability;
    } catch (error) {
      this.logger.error('Failed to find availability by ID', { availabilityId, error });
      throw error;
    }
  }

  /**
   * Find availability slot by ID and user ID
   */
  async findByIdAndUserId(
    availabilityId: number, 
    userId: number, 
    includeBookings = false
  ): Promise<DatifyyUserAvailability | null> {
    this.logger.debug('Finding availability by ID and user ID', { availabilityId, userId });

    try {
      const query = this.repository.createQueryBuilder('availability')
        .leftJoinAndSelect('availability.user', 'user')
        .where('availability.id = :availabilityId', { availabilityId })
        .andWhere('availability.userId = :userId', { userId })
        .andWhere('availability.isDeleted = :isDeleted', { isDeleted: false });

      if (includeBookings) {
        query.leftJoinAndSelect('availability.datifyyAvailabilityBookings', 'bookings')
          .leftJoinAndSelect('bookings.bookedByUser', 'bookedByUser');
      }

      return await query.getOne();
    } catch (error) {
      this.logger.error('Failed to find availability by ID and user ID', { availabilityId, userId, error });
      throw error;
    }
  }

  /**
   * Find all availability slots for a user with filtering and pagination
   */
  async findByUserId(userId: number, filters: GetAvailabilityRequest): Promise<PaginationResponse<DatifyyUserAvailability>> {
    this.logger.debug('Finding availability by user ID', { userId, filters });

    try {
      const query = this.buildUserAvailabilityQuery(userId, filters);
      
      const page = filters.page || 1;
      const limit = Math.min(filters.limit || 20, 100); // Max 100 items per page
      const skip = (page - 1) * limit;

      // Get total count
      const total = await query.getCount();

      // Get paginated results
      const items = await query
        .skip(skip)
        .take(limit)
        .orderBy('availability.availabilityDate', 'ASC')
        .addOrderBy('availability.startTime', 'ASC')
        .getMany();

      const totalPages = Math.ceil(total / limit);

      this.logger.debug('User availability found', { 
        userId, 
        total, 
        page, 
        limit, 
        itemsReturned: items.length 
      });

      return {
        data: items,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrevious: page > 1
        }
      };
    } catch (error) {
      this.logger.error('Failed to find availability by user ID', { userId, error });
      throw error;
    }
  }

  /**
   * Find available slots in a date range
   */
  async findAvailableInDateRange(
    startDate: string, 
    endDate: string, 
    excludeUserId?: number
  ): Promise<DatifyyUserAvailability[]> {
    this.logger.debug('Finding available slots in date range', { startDate, endDate, excludeUserId });

    try {
      const query = this.repository.createQueryBuilder('availability')
        .leftJoinAndSelect('availability.user', 'user')
        .leftJoin('availability.datifyyAvailabilityBookings', 'bookings', 
          'bookings.bookingStatus IN (:...activeStatuses)', 
          { activeStatuses: ['pending', 'confirmed'] }
        )
        .where('availability.availabilityDate >= :startDate', { startDate })
        .andWhere('availability.availabilityDate <= :endDate', { endDate })
        .andWhere('availability.status = :status', { status: 'active' })
        .andWhere('availability.isDeleted = :isDeleted', { isDeleted: false })
        .andWhere('bookings.id IS NULL'); // No active bookings

      if (excludeUserId) {
        query.andWhere('availability.userId != :excludeUserId', { excludeUserId });
      }

      const availableSlots = await query
        .orderBy('availability.availabilityDate', 'ASC')
        .addOrderBy('availability.startTime', 'ASC')
        .getMany();

      this.logger.debug('Available slots found', { 
        startDate, 
        endDate, 
        count: availableSlots.length 
      });

      return availableSlots;
    } catch (error) {
      this.logger.error('Failed to find available slots in date range', { startDate, endDate, error });
      throw error;
    }
  }

  /**
   * Find conflicting availability slots for a user
   */
  async findConflictingSlots(
    userId: number,
    date: string,
    startTime: string,
    endTime: string,
    excludeId?: number
  ): Promise<DatifyyUserAvailability[]> {
    this.logger.debug('Finding conflicting slots', { userId, date, startTime, endTime, excludeId });

    try {
      const query = this.repository.createQueryBuilder('availability')
        .where('availability.userId = :userId', { userId })
        .andWhere('availability.availabilityDate = :date', { date })
        .andWhere('availability.status IN (:...activeStatuses)', { activeStatuses: ['active', 'completed'] })
        .andWhere('availability.isDeleted = :isDeleted', { isDeleted: false })
        .andWhere(`(
          (availability.startTime <= :startTime AND availability.endTime > :startTime) OR
          (availability.startTime < :endTime AND availability.endTime >= :endTime) OR
          (availability.startTime >= :startTime AND availability.endTime <= :endTime)
        )`, { startTime, endTime });

      if (excludeId) {
        query.andWhere('availability.id != :excludeId', { excludeId });
      }

      const conflicts = await query.getMany();

      this.logger.debug('Conflicting slots found', { 
        userId, 
        date, 
        conflicts: conflicts.length 
      });

      return conflicts;
    } catch (error) {
      this.logger.error('Failed to find conflicting slots', { userId, date, error });
      throw error;
    }
  }

  /**
   * Update an availability slot
   */
  async update(availabilityId: number, updateData: UpdateAvailabilityRequest): Promise<DatifyyUserAvailability> {
    this.logger.info('Updating availability slot', { availabilityId, updateData });

    try {
      await this.repository.update(availabilityId, {
        ...updateData,
        updatedAt: new Date()
      });

      const updatedAvailability = await this.findById(availabilityId);
      if (!updatedAvailability) {
        throw new Error('Availability slot not found after update');
      }

      this.logger.info('Availability slot updated successfully', { availabilityId });
      return updatedAvailability;
    } catch (error) {
      this.logger.error('Failed to update availability slot', { availabilityId, error });
      throw error;
    }
  }

  /**
   * Soft delete an availability slot
   */
  async softDelete(availabilityId: number, reason?: string): Promise<void> {
    this.logger.info('Soft deleting availability slot', { availabilityId, reason });

    try {
      await this.repository.update(availabilityId, {
        status: 'deleted',
        isDeleted: true,
        deletedReason: reason,
        updatedAt: new Date()
      });

      this.logger.info('Availability slot soft deleted successfully', { availabilityId });
    } catch (error) {
      this.logger.error('Failed to soft delete availability slot', { availabilityId, error });
      throw error;
    }
  }

  /**
   * Hard delete an availability slot
   */
  async hardDelete(availabilityId: number): Promise<void> {
    this.logger.info('Hard deleting availability slot', { availabilityId });

    try {
      await this.repository.delete(availabilityId);
      this.logger.info('Availability slot hard deleted successfully', { availabilityId });
    } catch (error) {
      this.logger.error('Failed to hard delete availability slot', { availabilityId, error });
      throw error;
    }
  }

  /**
   * Get user's availability statistics
   */
  async getUserAvailabilityStats(userId: number, startDate: string, endDate: string): Promise<AvailabilityStats> {
    this.logger.debug('Getting user availability stats', { userId, startDate, endDate });

    try {
      const baseQuery = this.repository.createQueryBuilder('availability')
        .where('availability.userId = :userId', { userId })
        .andWhere('availability.availabilityDate >= :startDate', { startDate })
        .andWhere('availability.availabilityDate <= :endDate', { endDate })
        .andWhere('availability.isDeleted = :isDeleted', { isDeleted: false });

      // Get basic counts
      const [
        totalSlots,
        activeSlots,
        bookedSlots,
        completedSlots,
        cancelledSlots
      ] = await Promise.all([
        baseQuery.getCount(),
        baseQuery.clone().andWhere('availability.status = :status', { status: 'active' }).getCount(),
        baseQuery.clone()
          .innerJoin('availability.datifyyAvailabilityBookings', 'bookings')
          .andWhere('bookings.bookingStatus IN (:...statuses)', { statuses: ['pending', 'confirmed'] })
          .getCount(),
        baseQuery.clone().andWhere('availability.status = :status', { status: 'completed' }).getCount(),
        baseQuery.clone().andWhere('availability.status = :status', { status: 'cancelled' }).getCount()
      ]);

      // Calculate hours and rates
      const bookingRate = totalSlots > 0 ? (bookedSlots / totalSlots) * 100 : 0;

      // TODO: Implement more detailed calculations for hours, popular times, etc.
      const stats: AvailabilityStats = {
        totalSlots,
        activeSlots,
        bookedSlots,
        completedSlots,
        cancelledSlots,
        totalHours: 0, // Calculate from time slots
        bookedHours: 0, // Calculate from booked time slots
        bookingRate,
        averageSlotDuration: 0, // Calculate average
        mostPopularTimeSlot: 'Morning', // Calculate from data
        mostPopularDay: 'Saturday' // Calculate from data
      };

      this.logger.debug('User availability stats calculated', { userId, stats });
      return stats;
    } catch (error) {
      this.logger.error('Failed to get user availability stats', { userId, error });
      throw error;
    }
  }

  /**
   * Get recurring availability slots
   */
  async getRecurringSlots(parentAvailabilityId: number): Promise<DatifyyUserAvailability[]> {
    this.logger.debug('Getting recurring slots', { parentAvailabilityId });

    try {
      const recurringSlots = await this.repository.find({
        where: {
          parentAvailabilityId,
          isDeleted: false
        },
        order: {
          availabilityDate: 'ASC',
          startTime: 'ASC'
        }
      });

      this.logger.debug('Recurring slots found', { 
        parentAvailabilityId, 
        count: recurringSlots.length 
      });

      return recurringSlots;
    } catch (error) {
      this.logger.error('Failed to get recurring slots', { parentAvailabilityId, error });
      throw error;
    }
  }

  /**
   * Cancel all recurring slots
   */
  async cancelRecurringSlots(parentAvailabilityId: number, reason: string): Promise<number> {
    this.logger.info('Cancelling recurring slots', { parentAvailabilityId, reason });

    try {
      const result = await this.repository.update(
        { 
          parentAvailabilityId, 
          isDeleted: false,
          status: 'active'
        },
        {
          status: 'cancelled',
          deletedReason: reason,
          updatedAt: new Date()
        }
      );

      const cancelledCount = result.affected || 0;
      
      this.logger.info('Recurring slots cancelled', { 
        parentAvailabilityId, 
        cancelledCount 
      });

      return cancelledCount;
    } catch (error) {
      this.logger.error('Failed to cancel recurring slots', { parentAvailabilityId, error });
      throw error;
    }
  }

  /**
   * Search for users with availability matching criteria
   */
  async searchAvailableUsers(criteria: AvailabilitySearchCriteria): Promise<UserAvailabilityMatch[]> {
    this.logger.debug('Searching available users', { criteria });

    try {
      // TODO: Implement sophisticated search with user profiles, compatibility scores, etc.
      const matches: UserAvailabilityMatch[] = [];
      
      this.logger.debug('Available users found', { count: matches.length });
      return matches;
    } catch (error) {
      this.logger.error('Failed to search available users', { criteria, error });
      throw error;
    }
  }

  /**
   * Get calendar view data for a user
   */
  async getCalendarView(userId: number, month: string): Promise<CalendarDayData[]> {
    this.logger.debug('Getting calendar view', { userId, month });

    try {
      // TODO: Implement calendar view with daily aggregations
      const calendarData: CalendarDayData[] = [];
      
      this.logger.debug('Calendar view generated', { userId, month, days: calendarData.length });
      return calendarData;
    } catch (error) {
      this.logger.error('Failed to get calendar view', { userId, month, error });
      throw error;
    }
  }

  /**
   * Check if user has availability conflicts on a specific date
   */
  async hasConflictsOnDate(userId: number, date: string, excludeStatuses: string[] = ['deleted', 'cancelled']): Promise<boolean> {
    this.logger.debug('Checking conflicts on date', { userId, date, excludeStatuses });

    try {
      const count = await this.repository.createQueryBuilder('availability')
        .where('availability.userId = :userId', { userId })
        .andWhere('availability.availabilityDate = :date', { date })
        .andWhere('availability.status NOT IN (:...excludeStatuses)', { excludeStatuses })
        .andWhere('availability.isDeleted = :isDeleted', { isDeleted: false })
        .getCount();

      const hasConflicts = count > 0;
      
      this.logger.debug('Conflicts check result', { userId, date, hasConflicts, count });
      return hasConflicts;
    } catch (error) {
      this.logger.error('Failed to check conflicts on date', { userId, date, error });
      throw error;
    }
  }

  /**
   * Build user availability query with filters
   * @private
   */
  private buildUserAvailabilityQuery(userId: number, filters: GetAvailabilityRequest): SelectQueryBuilder<DatifyyUserAvailability> {
    const query = this.repository.createQueryBuilder('availability')
      .leftJoinAndSelect('availability.user', 'user')
      .where('availability.userId = :userId', { userId })
      .andWhere('availability.isDeleted = :isDeleted', { isDeleted: false });

    // Date filters
    if (filters.startDate) {
      query.andWhere('availability.availabilityDate >= :startDate', { startDate: filters.startDate });
    }
    if (filters.endDate) {
      query.andWhere('availability.availabilityDate <= :endDate', { endDate: filters.endDate });
    }

    // Status filters
    if (filters.status && filters.status.length > 0) {
      query.andWhere('availability.status IN (:...statuses)', { statuses: filters.status });
    }

    // Date type filters
    if (filters.dateType && filters.dateType.length > 0) {
      query.andWhere('availability.dateType IN (:...dateTypes)', { dateTypes: filters.dateType });
    }

    // Include bookings if requested
    if (filters.includeBookings) {
      query.leftJoinAndSelect('availability.datifyyAvailabilityBookings', 'bookings')
        .leftJoinAndSelect('bookings.bookedByUser', 'bookedByUser');
    }

    // Only available slots (no bookings)
    if (filters.onlyAvailable) {
      query.leftJoin('availability.datifyyAvailabilityBookings', 'activeBookings', 
        'activeBookings.bookingStatus IN (:...activeStatuses)', 
        { activeStatuses: ['pending', 'confirmed'] }
      )
      .andWhere('activeBookings.id IS NULL');
    }

    return query;
  }
}