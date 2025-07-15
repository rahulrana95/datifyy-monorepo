// services/nodejs-service/src/modules/userAvailability/repositories/AvailabilityBookingRepository.ts

import { DataSource, Repository } from 'typeorm';
import { 
  BookAvailabilityRequest,
  UpdateBookingRequest,
  PaginationResponse
} from '../../../proto-types/user/availability';
import { DatifyyAvailabilityBookings } from '../../../models/entities/DatifyyAvailabilityBookings';
import { Logger } from '../../../infrastructure/logging/Logger';
import { IAvailabilityBookingRepository, BookingStats, PaginatedResponse } from './IAvailabilityBookingRepository';

/**
 * Availability Booking Repository Implementation
 * 
 * Handles all database operations for availability booking management.
 * Implements complex queries for booking relationships and statistics.
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */
export class AvailabilityBookingRepository implements IAvailabilityBookingRepository {
  private readonly repository: Repository<DatifyyAvailabilityBookings>;

  constructor(
    private readonly dataSource: DataSource,
    private readonly logger: Logger
  ) {
    this.repository = dataSource.getRepository(DatifyyAvailabilityBookings);
  }

  /**
   * Create a new booking for an availability slot
   */
  async create(userId: number, bookingData: BookAvailabilityRequest): Promise<DatifyyAvailabilityBookings> {
    this.logger.info('Creating booking', { userId, slotId: bookingData.availabilitySlotId });

    try {
      const booking = this.repository.create({
        availabilityId: parseInt(bookingData.availabilitySlotId),
        bookedByUserId: userId,
        selectedActivity: 'activity' as const, // Default activity since proto doesn't provide it
        bookingNotes: bookingData.notes,
        bookingStatus: 'pending'
      });

      const savedBooking = await this.repository.save(booking);
      
      this.logger.info('Booking created successfully', { 
        userId, 
        bookingId: savedBooking.id 
      });

      return savedBooking;
    } catch (error) {
      this.logger.error('Failed to create booking', { userId, error });
      throw error;
    }
  }

  /**
   * Find booking by ID
   */
  async findById(bookingId: number): Promise<DatifyyAvailabilityBookings | null> {
    this.logger.debug('Finding booking by ID', { bookingId });

    try {
      const booking = await this.repository.findOne({
        where: { id: bookingId },
        relations: [
          'availability',
          'availability.user',
          'bookedByUser'
        ]
      });

      this.logger.debug('Booking found', { bookingId, found: !!booking });
      return booking;
    } catch (error) {
      this.logger.error('Failed to find booking by ID', { bookingId, error });
      throw error;
    }
  }

  /**
   * Find booking by ID with access validation
   */
  async findByIdWithAccess(bookingId: number, userId: number): Promise<DatifyyAvailabilityBookings | null> {
    this.logger.debug('Finding booking by ID with access validation', { bookingId, userId });

    try {
      const booking = await this.repository.createQueryBuilder('booking')
        .leftJoinAndSelect('booking.availability', 'availability')
        .leftJoinAndSelect('availability.user', 'availabilityOwner')
        .leftJoinAndSelect('booking.bookedByUser', 'bookedByUser')
        .where('booking.id = :bookingId', { bookingId })
        .andWhere('(booking.bookedByUserId = :userId OR availability.userId = :userId)', { userId })
        .getOne();

      this.logger.debug('Booking with access found', { bookingId, userId, found: !!booking });
      return booking;
    } catch (error) {
      this.logger.error('Failed to find booking with access', { bookingId, userId, error });
      throw error;
    }
  }

  /**
   * Find booking by ID for availability owner
   */
  async findByIdForOwner(bookingId: number, ownerId: number): Promise<DatifyyAvailabilityBookings | null> {
    this.logger.debug('Finding booking by ID for owner', { bookingId, ownerId });

    try {
      const booking = await this.repository.createQueryBuilder('booking')
        .leftJoinAndSelect('booking.availability', 'availability')
        .leftJoinAndSelect('booking.bookedByUser', 'bookedByUser')
        .where('booking.id = :bookingId', { bookingId })
        .andWhere('availability.userId = :ownerId', { ownerId })
        .getOne();

      this.logger.debug('Booking for owner found', { bookingId, ownerId, found: !!booking });
      return booking;
    } catch (error) {
      this.logger.error('Failed to find booking for owner', { bookingId, ownerId, error });
      throw error;
    }
  }

  /**
   * Find bookings made by a user (outgoing bookings)
   */
  async findByUserId(userId: number, filters: any): Promise<PaginatedResponse<DatifyyAvailabilityBookings>> {
    this.logger.debug('Finding bookings by user ID', { userId, filters });

    try {
      const query = this.repository.createQueryBuilder('booking')
        .leftJoinAndSelect('booking.availability', 'availability')
        .leftJoinAndSelect('availability.user', 'availabilityOwner')
        .where('booking.bookedByUserId = :userId', { userId });

      // Apply filters
      if (filters.status) {
        query.andWhere('booking.bookingStatus IN (:...statuses)', { statuses: filters.status });
      }

      if (filters.startDate) {
        query.andWhere('availability.availabilityDate >= :startDate', { startDate: filters.startDate });
      }

      if (filters.endDate) {
        query.andWhere('availability.availabilityDate <= :endDate', { endDate: filters.endDate });
      }

      const page = filters.page || 1;
      const limit = Math.min(filters.limit || 20, 100);
      const skip = (page - 1) * limit;

      const total = await query.getCount();
      const items = await query
        .orderBy('booking.createdAt', 'DESC')
        .skip(skip)
        .take(limit)
        .getMany();

      const totalPages = Math.ceil(total / limit);

      this.logger.debug('User bookings found', { userId, total, itemsReturned: items.length });

      return {
        data: items,
        pagination: {
          page,
          limit,
          total,
          totalPages
        }
      };
    } catch (error) {
      this.logger.error('Failed to find bookings by user ID', { userId, error });
      throw error;
    }
  }

  /**
   * Find incoming bookings for user's availability slots
   */
  async findIncomingBookings(ownerId: number, filters: any): Promise<PaginatedResponse<DatifyyAvailabilityBookings>> {
    this.logger.debug('Finding incoming bookings', { ownerId, filters });

    try {
      const query = this.repository.createQueryBuilder('booking')
        .leftJoinAndSelect('booking.availability', 'availability')
        .leftJoinAndSelect('booking.bookedByUser', 'bookedByUser')
        .where('availability.userId = :ownerId', { ownerId });

      // Apply filters
      if (filters.status) {
        query.andWhere('booking.bookingStatus IN (:...statuses)', { statuses: filters.status });
      }

      if (filters.startDate) {
        query.andWhere('availability.availabilityDate >= :startDate', { startDate: filters.startDate });
      }

      if (filters.endDate) {
        query.andWhere('availability.availabilityDate <= :endDate', { endDate: filters.endDate });
      }

      const page = filters.page || 1;
      const limit = Math.min(filters.limit || 20, 100);
      const skip = (page - 1) * limit;

      const total = await query.getCount();
      const items = await query
        .orderBy('booking.createdAt', 'DESC')
        .skip(skip)
        .take(limit)
        .getMany();

      const totalPages = Math.ceil(total / limit);

      this.logger.debug('Incoming bookings found', { ownerId, total, itemsReturned: items.length });

      return {
        data: items,
        pagination: {
          page,
          limit,
          total,
          totalPages
        }
      };
    } catch (error) {
      this.logger.error('Failed to find incoming bookings', { ownerId, error });
      throw error;
    }
  }

  /**
   * Find bookings for a specific availability slot
   */
  async findByAvailabilityId(availabilityId: number): Promise<DatifyyAvailabilityBookings[]> {
    this.logger.debug('Finding bookings by availability ID', { availabilityId });

    try {
      const bookings = await this.repository.find({
        where: { availabilityId },
        relations: ['bookedByUser'],
        order: { createdAt: 'DESC' }
      });

      this.logger.debug('Bookings for availability found', { 
        availabilityId, 
        count: bookings.length 
      });

      return bookings;
    } catch (error) {
      this.logger.error('Failed to find bookings by availability ID', { availabilityId, error });
      throw error;
    }
  }

  /**
   * Update an existing booking
   */
  async update(bookingId: number, updateData: UpdateBookingRequest): Promise<DatifyyAvailabilityBookings> {
    this.logger.info('Updating booking', { bookingId, updateData });

    try {
      await this.repository.update(bookingId, {
        ...updateData,
        updatedAt: new Date()
      });

      const updatedBooking = await this.findById(bookingId);
      if (!updatedBooking) {
        throw new Error('Booking not found after update');
      }

      this.logger.info('Booking updated successfully', { bookingId });
      return updatedBooking;
    } catch (error) {
      this.logger.error('Failed to update booking', { bookingId, error });
      throw error;
    }
  }

  /**
   * Cancel a booking
   */
  async cancel(bookingId: number, reason?: string): Promise<DatifyyAvailabilityBookings> {
    this.logger.info('Cancelling booking', { bookingId, reason });

    try {
      await this.repository.update(bookingId, {
        bookingStatus: 'cancelled',
        cancelledAt: new Date(),
        cancellationReason: reason,
        updatedAt: new Date()
      });

      const cancelledBooking = await this.findById(bookingId);
      if (!cancelledBooking) {
        throw new Error('Booking not found after cancellation');
      }

      this.logger.info('Booking cancelled successfully', { bookingId });
      return cancelledBooking;
    } catch (error) {
      this.logger.error('Failed to cancel booking', { bookingId, error });
      throw error;
    }
  }

  /**
   * Confirm a booking
   */
  async confirm(bookingId: number): Promise<DatifyyAvailabilityBookings> {
    this.logger.info('Confirming booking', { bookingId });

    try {
      await this.repository.update(bookingId, {
        bookingStatus: 'confirmed',
        confirmedAt: new Date(),
        updatedAt: new Date()
      });

      const confirmedBooking = await this.findById(bookingId);
      if (!confirmedBooking) {
        throw new Error('Booking not found after confirmation');
      }

      this.logger.info('Booking confirmed successfully', { bookingId });
      return confirmedBooking;
    } catch (error) {
      this.logger.error('Failed to confirm booking', { bookingId, error });
      throw error;
    }
  }

  /**
   * Complete a booking
   */
  async complete(bookingId: number): Promise<DatifyyAvailabilityBookings> {
    this.logger.info('Completing booking', { bookingId });

    try {
      await this.repository.update(bookingId, {
        bookingStatus: 'completed',
        updatedAt: new Date()
      });

      const completedBooking = await this.findById(bookingId);
      if (!completedBooking) {
        throw new Error('Booking not found after completion');
      }

      this.logger.info('Booking completed successfully', { bookingId });
      return completedBooking;
    } catch (error) {
      this.logger.error('Failed to complete booking', { bookingId, error });
      throw error;
    }
  }

  /**
   * Check if an availability slot has active bookings
   */
  async hasActiveBookings(availabilityId: number): Promise<boolean> {
    this.logger.debug('Checking for active bookings', { availabilityId });

    try {
      const count = await this.repository.count({
        where: {
          availabilityId,
          bookingStatus: 'confirmed'
        }
      });

      const hasActive = count > 0;
      this.logger.debug('Active bookings check result', { availabilityId, hasActive, count });
      
      return hasActive;
    } catch (error) {
      this.logger.error('Failed to check active bookings', { availabilityId, error });
      throw error;
    }
  }

  /**
   * Get booking statistics for a user
   */
  async getBookingStats(userId: number, startDate: string, endDate: string): Promise<BookingStats> {
    this.logger.debug('Getting booking stats', { userId, startDate, endDate });

    try {
      const query = this.repository.createQueryBuilder('booking')
        .leftJoin('booking.availability', 'availability')
        .where('booking.bookedByUserId = :userId', { userId })
        .andWhere('availability.availabilityDate >= :startDate', { startDate })
        .andWhere('availability.availabilityDate <= :endDate', { endDate });

      const [
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings
      ] = await Promise.all([
        query.getCount(),
        query.clone().andWhere('booking.bookingStatus = :status', { status: 'pending' }).getCount(),
        query.clone().andWhere('booking.bookingStatus = :status', { status: 'confirmed' }).getCount(),
        query.clone().andWhere('booking.bookingStatus = :status', { status: 'completed' }).getCount(),
        query.clone().andWhere('booking.bookingStatus = :status', { status: 'cancelled' }).getCount()
      ]);

      const bookingRate = totalBookings > 0 ? (confirmedBookings / totalBookings) * 100 : 0;

      // TODO: Calculate average response time and popular activities
      const stats: BookingStats = {
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
        bookingRate,
        averageResponseTime: 24, // placeholder
        popularActivities: [] // placeholder
      };

      this.logger.debug('Booking stats calculated', { userId, stats });
      return stats;
    } catch (error) {
      this.logger.error('Failed to get booking stats', { userId, error });
      throw error;
    }
  }

  /**
   * Find conflicting bookings for a time slot
   */
  async findConflictingBookings(
    userId: number,
    date: string,
    startTime: string,
    endTime: string
  ): Promise<DatifyyAvailabilityBookings[]> {
    this.logger.debug('Finding conflicting bookings', { userId, date, startTime, endTime });

    try {
      const conflicts = await this.repository.createQueryBuilder('booking')
        .leftJoin('booking.availability', 'availability')
        .where('booking.bookedByUserId = :userId', { userId })
        .andWhere('availability.availabilityDate = :date', { date })
        .andWhere('booking.bookingStatus IN (:...activeStatuses)', { 
          activeStatuses: ['pending', 'confirmed'] 
        })
        .andWhere(`(
          (availability.startTime <= :startTime AND availability.endTime > :startTime) OR
          (availability.startTime < :endTime AND availability.endTime >= :endTime) OR
          (availability.startTime >= :startTime AND availability.endTime <= :endTime)
        )`, { startTime, endTime })
        .getMany();

      this.logger.debug('Conflicting bookings found', { 
        userId, 
        date, 
        conflicts: conflicts.length 
      });

      return conflicts;
    } catch (error) {
      this.logger.error('Failed to find conflicting bookings', { userId, date, error });
      throw error;
    }
  }
}