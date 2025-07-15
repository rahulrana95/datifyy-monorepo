// services/nodejs-service/src/modules/userAvailability/services/UserAvailabilityService.ts
import { Logger } from '../../../infrastructure/logging/Logger';
import { IUserAvailabilityRepository } from '../repositories/IUserAvailabilityRepository';
import { UserAvailabilityMapper } from '../mappers/UserAvailabilityMapper';
import { 
  IUserAvailabilityService,
  ValidationResult,
  RecurringGenerationOptions,
  AvailabilityStatsSummary,
  ScheduleOptimizationPreferences,
  ScheduleOptimizationResult,
  NearbyAvailableUsersResponse,
  SlotCreationResult
} from './IUserAvailabilityService';
import { BusinessRuleViolationError, NotFoundError, ValidationError } from '../../../infrastructure/errors/AppErrors';
import {  CreateAvailabilityRequest,
  UpdateAvailabilityRequest,
  BulkCreateAvailabilityRequest,
  GetAvailabilityRequest,
  SearchAvailableUsersRequest,
  GetAvailabilityAnalyticsRequest,
  AvailabilityResponse,
  AvailabilityListResponse,
  BulkCreateAvailabilityResponse,
  SearchAvailableUsersResponse,
  AvailabilityAnalyticsResponse,
  CalendarViewResponse,
  TimeSuggestionsResponse,
  AvailabilityConflict,
  AvailabilitySlot,
  AvailabilitySlotStatus,
  AvailabilityBookingStatus,
  AvailabilityAnalytics,
  AvailabilityDateType,
  AvailabilityCancellationPolicy
} from '../../../proto-types';

// Default validation rules
const DEFAULT_VALIDATION_RULES = {
  timeSlot: {
    minDuration: 30,
    maxDuration: 240,
    maxFutureDays: 90
  },
  booking: {
    minAdvanceHours: 24,
    maxAdvanceDays: 60
  },
  limits: {
    maxSlotsPerDay: 5,
    maxSlotsPerWeek: 20
  }
};

/**
 * User Availability Service Implementation
 * 
 * Comprehensive business logic for user availability management.
 * Handles validation, conflict resolution, optimization, and analytics.
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */
export class UserAvailabilityService implements IUserAvailabilityService {
  constructor(
    private readonly repository: IUserAvailabilityRepository,
    private readonly mapper: UserAvailabilityMapper,
    private readonly logger: Logger
  ) {}

  /**
   * Create a new availability slot for a user
   */
  async createAvailability(userId: number, availabilityData: CreateAvailabilityRequest): Promise<AvailabilityResponse> {
    this.logger.info('Creating availability slot', { userId, availabilityData });

    try {
      // 1. Validate the availability slot
      const validation = await this.validateAvailabilitySlot(userId, availabilityData);
      if (!validation.isValid) {
        throw new ValidationError('Availability validation failed', validation.conflicts);
      }

      // 2. Check business rules
      await this.enforceBusinessRules(userId, availabilityData);

      // 3. Create the availability slot
      const createdAvailability = await this.repository.create(userId, availabilityData);

      // 4. Handle recurring slots if applicable
      if (availabilityData.isRecurring && availabilityData.recurrenceEndDate) {
        await this.generateRecurringSlots(
          userId,
          availabilityData,
          availabilityData.recurrenceEndDate?.toISOString() || '',
          { skipConflicts: true }
        );
      }

      // 5. Convert to response DTO
      const response = await this.mapper.toAvailabilityResponse(createdAvailability);
      
      this.logger.info('Availability slot created successfully', { 
        userId, 
        availabilityId: createdAvailability.id 
      });

      return response;
    } catch (error) {
      this.logger.error('Failed to create availability slot', { userId, error });
      throw error;
    }
  }

  /**
   * Create multiple availability slots in bulk
   */
  async createBulkAvailability(userId: number, bulkData: BulkCreateAvailabilityRequest): Promise<BulkCreateAvailabilityResponse> {
    this.logger.info('Creating bulk availability slots', { userId, count: bulkData.slots.length });

    try {
      const created: AvailabilitySlot[] = [];
      const skipped: Array<{ slot: CreateAvailabilityRequest; reason: string }> = [];
      let errors = 0;

      for (const slotData of bulkData.slots) {
        try {
          // Validate each slot
          const validation = await this.validateAvailabilitySlot(userId, slotData);
          
          if (!validation.isValid) {
            if (bulkData.skipConflicts) {
              skipped.push({
                slot: slotData,
                reason: validation.conflicts.map(c => c.conflictDescription).join(', ')
              });
              continue;
            } else {
              throw new ValidationError('Slot validation failed', validation.conflicts);
            }
          }

          // Create the slot
          const createdSlot = await this.repository.create(userId, slotData);
          const response = await this.mapper.toAvailabilityResponse(createdSlot);
          if (response.data) {
            created.push(response.data);
          }

        } catch (error) {
          errors++;
          if (!bulkData.skipConflicts) {
            throw error;
          }
          
          skipped.push({
            slot: slotData,
            reason: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      const summary = {
        totalRequested: bulkData.slots.length,
        successfullyCreated: created.length,
        skipped: skipped.length,
        errors
      };

      this.logger.info('Bulk availability creation completed', { userId, summary });

      return {
        success: true,
        createdSlots: created,
        conflicts: skipped.map(s => ({
          requestedSlot: s.slot,
          conflictReason: s.reason,
          conflictingSlots: [],
          conflictDescription: s.reason,
          conflictingSlotId: ''
        })),
        totalRequested: bulkData.slots.length,
        totalCreated: created.length,
        totalConflicts: skipped.length,
        message: `Bulk availability creation completed. ${created.length} slots created, ${skipped.length} skipped.`,
        data: created // For backward compatibility
      };
    } catch (error) {
      this.logger.error('Failed to create bulk availability', { userId, error });
      throw error;
    }
  }

  /**
   * Get availability slot by ID with ownership validation
   */
  async getAvailabilityById(availabilityId: number, userId: number): Promise<AvailabilityResponse> {
    this.logger.debug('Getting availability by ID', { availabilityId, userId });

    try {
      const availability = await this.repository.findByIdAndUserId(availabilityId, userId, true);
      if (!availability) {
        throw new NotFoundError('Availability slot not found or access denied');
      }

      const response = await this.mapper.toAvailabilityResponse(availability);
      
      this.logger.debug('Availability retrieved successfully', { availabilityId, userId });
      return response;
    } catch (error) {
      this.logger.error('Failed to get availability by ID', { availabilityId, userId, error });
      throw error;
    }
  }

  /**
   * Get user's availability slots with filtering and pagination
   */
  async getUserAvailability(userId: number, filters: GetAvailabilityRequest): Promise<AvailabilityListResponse> {
    this.logger.debug('Getting user availability', { userId, filters });

    try {
      // Get paginated availability data
      const paginatedResult = await this.repository.findByUserId(userId, filters);
      
      // Convert entities to response DTOs
      const availabilityResponses = await Promise.all(
        paginatedResult.data.map(availability => this.mapper.toAvailabilityResponse(availability))
      );

      // Extract slots from responses
      const slots = availabilityResponses
        .map(r => r.data)
        .filter((d): d is AvailabilitySlot => !!d);

      const response: AvailabilityListResponse = {
        success: true,
        slots: slots,
        data: slots, // Alias for backward compatibility
        pagination: paginatedResult.pagination,
        message: 'Availability slots retrieved successfully'
      };

      this.logger.debug('User availability retrieved', { 
        userId, 
        total: paginatedResult.pagination.total,
        returned: availabilityResponses.length 
      });

      return response;
    } catch (error) {
      this.logger.error('Failed to get user availability', { userId, error });
      throw error;
    }
  }

  /**
   * Update an existing availability slot
   */
  async updateAvailability(
    availabilityId: number, 
    userId: number, 
    updateData: UpdateAvailabilityRequest
  ): Promise<AvailabilityResponse> {
    this.logger.info('Updating availability slot', { availabilityId, userId, updateData });

    try {
      // 1. Check ownership
      const existingAvailability = await this.repository.findByIdAndUserId(availabilityId, userId);
      if (!existingAvailability) {
        throw new NotFoundError('Availability slot not found or access denied');
      }

      // 2. Validate updates
      if (updateData.availabilityDate || updateData.startTime || updateData.endTime) {
        const validation = await this.validateAvailabilitySlot(userId, updateData, availabilityId);
        if (!validation.isValid) {
          throw new ValidationError('Update validation failed', validation.conflicts);
        }
      }

      // 3. Check if slot is booked and restrict certain updates
      const hasActiveBookings = await this.hasActiveBookings(availabilityId);
      if (hasActiveBookings) {
        await this.validateBookedSlotUpdate(updateData);
      }

      // 4. Update the availability slot
      const updatedAvailability = await this.repository.update(availabilityId, updateData);
      const response = await this.mapper.toAvailabilityResponse(updatedAvailability);

      this.logger.info('Availability slot updated successfully', { availabilityId, userId });
      return response;
    } catch (error) {
      this.logger.error('Failed to update availability slot', { availabilityId, userId, error });
      throw error;
    }
  }

  /**
   * Cancel an availability slot
   */
  async cancelAvailability(availabilityId: number, userId: number, reason?: string): Promise<AvailabilityResponse> {
    this.logger.info('Cancelling availability slot', { availabilityId, userId, reason });

    try {
      // 1. Check ownership
      const availability = await this.repository.findByIdAndUserId(availabilityId, userId, true);
      if (!availability) {
        throw new NotFoundError('Availability slot not found or access denied');
      }

      // 2. Handle existing bookings
      await this.handleCancellationBookings(availabilityId, reason);

      // 3. Cancel the slot
      const cancelledAvailability = await this.repository.update(availabilityId, {
        status: AvailabilitySlotStatus.AVAILABILITY_SLOT_STATUS_CANCELLED,
        availabilitySlotId: availabilityId.toString(),
        dateType: availability.dateType === 'online' 
          ? AvailabilityDateType.AVAILABILITY_DATE_TYPE_ONLINE 
          : AvailabilityDateType.AVAILABILITY_DATE_TYPE_OFFLINE,
        startTime: availability.startTime,
        endTime: availability.endTime,
        timezone: availability.timezone,
        maxBookings: 1,
        durationMinutes: 60,
        bufferTimeMinutes: availability.bufferTimeMinutes || 0,
        location: availability.locationPreference || '',
        venue: '',
        virtualLink: '',
        notes: availability.notes || '',
        preferredActivities: [],
        cancellationPolicy: this.mapCancellationPolicy(availability.cancellationPolicy)
      });

      const response = await this.mapper.toAvailabilityResponse(cancelledAvailability);

      this.logger.info('Availability slot cancelled successfully', { availabilityId, userId });
      return response;
    } catch (error) {
      this.logger.error('Failed to cancel availability slot', { availabilityId, userId, error });
      throw error;
    }
  }

  /**
   * Delete an availability slot (soft delete)
   */
  async deleteAvailability(availabilityId: number, userId: number, reason?: string): Promise<void> {
    this.logger.info('Deleting availability slot', { availabilityId, userId, reason });

    try {
      // 1. Check ownership
      const availability = await this.repository.findByIdAndUserId(availabilityId, userId);
      if (!availability) {
        throw new NotFoundError('Availability slot not found or access denied');
      }

      // 2. Check if slot has active bookings
      const hasActiveBookings = await this.hasActiveBookings(availabilityId);
      if (hasActiveBookings) {
        throw new BusinessRuleViolationError('Cannot delete availability slot with active bookings');
      }

      // 3. Soft delete the slot
      await this.repository.softDelete(availabilityId, reason);

      this.logger.info('Availability slot deleted successfully', { availabilityId, userId });
    } catch (error) {
      this.logger.error('Failed to delete availability slot', { availabilityId, userId, error });
      throw error;
    }
  }

  /**
   * Search for available users matching criteria
   */
  async searchAvailableUsers(
    searchCriteria: SearchAvailableUsersRequest, 
    requestingUserId: number
  ): Promise<SearchAvailableUsersResponse> {
    this.logger.debug('Searching available users', { searchCriteria, requestingUserId });

    try {
      // TODO: Implement sophisticated search with user profiles, compatibility, etc.
      const searchSummary = {
        searchCriteria,
        totalMatches: 0,
        averageCompatibility: 0,
        locationBasedResults: 0
      };

      const response: SearchAvailableUsersResponse = {
        success: true,
        message: 'Search completed successfully',
        availableUsers: [],
        data: [], // Alias for backward compatibility
        pagination: {
          page: searchCriteria.page || 1,
          limit: searchCriteria.limit || 20,
          total: 0,
          totalPages: 0
        }
      };

      this.logger.debug('Available users search completed', { 
        requestingUserId, 
        totalFound: 0 
      });

      return response;
    } catch (error) {
      this.logger.error('Failed to search available users', { searchCriteria, requestingUserId, error });
      throw error;
    }
  }

  /**
   * Get availability analytics for a user
   */
  async getAvailabilityAnalytics(
    userId: number, 
    analyticsRequest: GetAvailabilityAnalyticsRequest
  ): Promise<AvailabilityAnalyticsResponse> {
    this.logger.debug('Getting availability analytics', { userId, analyticsRequest });

    try {
      // Calculate date range if not provided
      const endDate = analyticsRequest.endDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0];
      const startDate = analyticsRequest.startDate?.toISOString().split('T')[0] || 
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // Get statistics from repository
      const stats = await this.repository.getUserAvailabilityStats(userId, startDate, endDate);

      // Build comprehensive analytics response
      const analyticsData: AvailabilityAnalytics = {
        totalSlotsCreated: stats.totalSlots,
        totalBookings: stats.bookedSlots,
        completedBookings: stats.completedSlots,
        cancelledBookings: stats.cancelledSlots,
        bookingRate: stats.bookingRate,
        completionRate: stats.completedSlots > 0 ? (stats.completedSlots / stats.bookedSlots) * 100 : 0,
        cancellationRate: stats.cancelledSlots > 0 ? (stats.cancelledSlots / stats.totalSlots) * 100 : 0,
        averageRating: 0, // TODO: Calculate from ratings
        trends: [], // TODO: Implement trend analysis
        activityStats: [], // TODO: Implement activity analysis
        timeSlotStats: [], // TODO: Implement time slot analysis
        totalSlots: stats.totalSlots,
        activeSlots: stats.activeSlots,
        expiredSlots: 0, // TODO: Calculate expired slots
        utilizationRate: stats.bookingRate,
        dateTypeStats: [], // TODO: Implement date type analysis
        locationStats: [] // TODO: Implement location analysis
      };

      const response: AvailabilityAnalyticsResponse = {
        success: true,
        data: analyticsData,
        message: 'Analytics data retrieved successfully'
      };

      this.logger.debug('Availability analytics calculated', { userId, totalSlots: analyticsData.totalSlots });
      return response;
    } catch (error) {
      this.logger.error('Failed to get availability analytics', { userId, error });
      throw error;
    }
  }

  /**
   * Get calendar view for a user's availability
   */
  async getCalendarView(userId: number, month: string): Promise<CalendarViewResponse> {
    this.logger.debug('Getting calendar view', { userId, month });

    try {
      // Get calendar data from repository
      const calendarData = await this.repository.getCalendarView(userId, month);

      // Calculate summary statistics
      const totalDaysWithSlots = calendarData.filter(day => day.hasAvailability).length;
      const totalSlots = calendarData.reduce((sum, day) => sum + day.availableSlots + day.bookedSlots, 0);
      const totalBookedSlots = calendarData.reduce((sum, day) => sum + day.bookedSlots, 0);
      const bookingRate = totalSlots > 0 ? (totalBookedSlots / totalSlots) * 100 : 0;

      const response: CalendarViewResponse = {
        success: true,
        calendarDays: calendarData.map(day => ({
          date: day.date,
          slots: [], // TODO: Include actual slot data
          bookings: [], // TODO: Include actual booking data
          isAvailable: day.hasAvailability,
          totalSlots: day.availableSlots + day.bookedSlots,
          bookedSlots: day.bookedSlots
        })),
        message: 'Calendar view retrieved successfully'
      };

      this.logger.debug('Calendar view generated', { userId, month, totalDaysWithSlots });
      return response;
    } catch (error) {
      this.logger.error('Failed to get calendar view', { userId, month, error });
      throw error;
    }
  }

  /**
   * Get AI-powered time slot suggestions
   */
  async getTimeSuggestions(userId: number, daysAhead = 14): Promise<TimeSuggestionsResponse> {
    this.logger.debug('Getting time suggestions', { userId, daysAhead });

    try {
      // TODO: Implement AI-powered suggestions based on:
      // - Historical booking patterns
      // - User preferences
      // - Market demand
      // - Seasonal trends

      const suggestedSlots = [
        {
          date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          startTime: '10:00',
          endTime: '11:00',
          confidence: 0.85,
          reason: 'High booking rate historically at this time',
          potentialMatches: 12
        }
      ];

      const optimizedSchedule = [
        {
          dayOfWeek: 'Saturday',
          recommendedTimes: [
            {
              startTime: '10:00',
              endTime: '11:00',
              expectedBookings: 3
            }
          ]
        }
      ];

      const response: TimeSuggestionsResponse = {
        success: true,
        suggestions: suggestedSlots.map(slot => ({
          date: slot.date,
          startTime: slot.startTime,
          endTime: slot.endTime,
          score: slot.confidence * 100, // Convert confidence to score
          reason: slot.reason,
          isPeakTime: false // Default value
        })),
        message: 'Time suggestions generated successfully'
      };

      this.logger.debug('Time suggestions generated', { userId, suggestionsCount: suggestedSlots.length });
      return response;
    } catch (error) {
      this.logger.error('Failed to get time suggestions', { userId, error });
      throw error;
    }
  }

  /**
   * Validate availability slot for conflicts and business rules
   */
  async validateAvailabilitySlot(
    userId: number,
    availabilityData: CreateAvailabilityRequest | UpdateAvailabilityRequest,
    excludeId?: number
  ): Promise<ValidationResult> {
    this.logger.debug('Validating availability slot', { userId, availabilityData, excludeId });

    const conflicts: AvailabilityConflict[] = [];
    const warnings: string[] = [];
    const businessRuleViolations: any[] = [];

    try {
      // 1. Basic data validation
      if (availabilityData.availabilityDate && availabilityData.startTime && availabilityData.endTime) {
        // Check time logic
        if (availabilityData.startTime >= availabilityData.endTime) {
          businessRuleViolations.push({
            rule: 'time_logic',
            description: 'Start time must be before end time',
            severity: 'error'
          });
        }

        // Check minimum duration
        const duration = this.calculateDurationMinutes(availabilityData.startTime, availabilityData.endTime);
        if (duration < DEFAULT_VALIDATION_RULES.timeSlot.minDuration) {
          businessRuleViolations.push({
            rule: 'min_duration',
            description: `Minimum duration is ${DEFAULT_VALIDATION_RULES.timeSlot.minDuration} minutes`,
            severity: 'error'
          });
        }

        // Check maximum duration
        if (duration > DEFAULT_VALIDATION_RULES.timeSlot.maxDuration) {
          businessRuleViolations.push({
            rule: 'max_duration',
            description: `Maximum duration is ${DEFAULT_VALIDATION_RULES.timeSlot.maxDuration} minutes`,
            severity: 'error'
          });
        }

        // Check future date constraint
        const slotDate = new Date(availabilityData.availabilityDate);
        const now = new Date();
        const daysDiff = Math.ceil((slotDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff > DEFAULT_VALIDATION_RULES.timeSlot.maxFutureDays) {
          businessRuleViolations.push({
            rule: 'max_future_days',
            description: `Cannot create availability more than ${DEFAULT_VALIDATION_RULES.timeSlot.maxFutureDays} days in advance`,
            severity: 'error'
          });
        }

        // 2. Check for conflicts
        const conflictingSlots = await this.repository.findConflictingSlots(
          userId,
          availabilityData.availabilityDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
          availabilityData.startTime,
          availabilityData.endTime,
          excludeId
        );

        for (const conflictSlot of conflictingSlots) {
          conflicts.push({
            conflictingSlotId: conflictSlot.id.toString(),
            conflictReason: 'overlap',
            conflictDescription: `Overlaps with existing slot from ${conflictSlot.startTime} to ${conflictSlot.endTime}`,
            conflictingSlots: [], // TODO: Convert entity to AvailabilitySlot
            requestedSlot: 'startTime' in availabilityData && 'recurrenceType' in availabilityData 
              ? availabilityData as CreateAvailabilityRequest 
              : undefined
          });
        }
      }

      const isValid = businessRuleViolations.filter(v => v.severity === 'error').length === 0 && conflicts.length === 0;

      const result: ValidationResult = {
        isValid,
        conflicts,
        warnings,
        suggestions: [], // TODO: Implement suggestions
        businessRuleViolations
      };

      this.logger.debug('Availability validation completed', { userId, isValid, conflictsCount: conflicts.length });
      return result;
    } catch (error) {
      this.logger.error('Failed to validate availability slot', { userId, error });
      throw error;
    }
  }

  /**
   * Generate recurring availability slots
   */
  async generateRecurringSlots(
    userId: number,
    baseSlot: CreateAvailabilityRequest,
    endDate: string,
    options: RecurringGenerationOptions = {}
  ): Promise<SlotCreationResult[]> {
    this.logger.info('Generating recurring slots', { userId, endDate, options });

    try {
      const results: SlotCreationResult[] = [];
      const startDate = baseSlot.availabilityDate ? new Date(baseSlot.availabilityDate) : new Date();
      const endDateTime = new Date(endDate);
      
      let currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + 7); // Start from next week

      while (currentDate <= endDateTime) {
        // Skip weekends if requested
        if (options.skipWeekends && (currentDate.getDay() === 0 || currentDate.getDay() === 6)) {
          currentDate.setDate(currentDate.getDate() + 1);
          continue;
        }

        const slotData: CreateAvailabilityRequest = {
          ...baseSlot,
          availabilityDate: currentDate,
          isRecurring: false, // Prevent infinite recursion
        };

        try {
          // Validate the slot
          const validation = await this.validateAvailabilitySlot(userId, slotData);
          
          if (!validation.isValid && !options.skipConflicts) {
            results.push({
              success: false,
              conflict: validation.conflicts[0], // Use first conflict
              error: 'Validation failed'
            });
          } else if (validation.isValid) {
            // Create the slot
            const createdSlot = await this.repository.create(userId, slotData);
            const response = await this.mapper.toAvailabilityResponse(createdSlot);
            
            results.push({
              success: true,
              slot: response.data || undefined
            });
          }
        } catch (error) {
          results.push({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }

        // Move to next week
        currentDate.setDate(currentDate.getDate() + 7);
      }

      this.logger.info('Recurring slots generation completed', { 
        userId, 
        totalGenerated: results.filter(r => r.success).length,
        totalFailed: results.filter(r => !r.success).length
      });

      return results;
    } catch (error) {
      this.logger.error('Failed to generate recurring slots', { userId, error });
      throw error;
    }
  }

  /**
   * Cancel all recurring slots generated from a parent slot
   */
  async cancelRecurringSlots(parentAvailabilityId: number, userId: number, reason: string): Promise<number> {
    this.logger.info('Cancelling recurring slots', { parentAvailabilityId, userId, reason });

    try {
      // Verify ownership of parent slot
      const parentSlot = await this.repository.findByIdAndUserId(parentAvailabilityId, userId);
      if (!parentSlot) {
        throw new NotFoundError('Parent availability slot not found or access denied');
      }

      // Cancel all recurring slots
      const cancelledCount = await this.repository.cancelRecurringSlots(parentAvailabilityId, reason);

      this.logger.info('Recurring slots cancelled successfully', { 
        parentAvailabilityId, 
        userId, 
        cancelledCount 
      });

      return cancelledCount;
    } catch (error) {
      this.logger.error('Failed to cancel recurring slots', { parentAvailabilityId, userId, error });
      throw error;
    }
  }

  /**
   * Check availability conflicts for a specific time slot
   */
  async checkAvailabilityConflicts(
    userId: number,
    date: string,
    startTime: string,
    endTime: string,
    excludeId?: number
  ): Promise<AvailabilityConflict[]> {
    this.logger.debug('Checking availability conflicts', { userId, date, startTime, endTime, excludeId });

    try {
      const conflictingSlots = await this.repository.findConflictingSlots(
        userId,
        date,
        startTime,
        endTime,
        excludeId
      );

      const conflicts: AvailabilityConflict[] = conflictingSlots.map(slot => ({
        conflictingSlotId: slot.id.toString(),
        conflictReason: 'overlap',
        conflictDescription: `Overlaps with existing slot from ${slot.startTime} to ${slot.endTime}`,
        conflictingSlots: [], // TODO: Convert entity to AvailabilitySlot
        requestedSlot: undefined
      }));

      this.logger.debug('Conflict check completed', { userId, conflictsFound: conflicts.length });
      return conflicts;
    } catch (error) {
      this.logger.error('Failed to check availability conflicts', { userId, error });
      throw error;
    }
  }

  /**
   * Get user's availability statistics summary
   */
  async getAvailabilityStatsSummary(userId: number, startDate: string, endDate: string): Promise<AvailabilityStatsSummary> {
    this.logger.debug('Getting availability stats summary', { userId, startDate, endDate });

    try {
      const stats = await this.repository.getUserAvailabilityStats(userId, startDate, endDate);

      // TODO: Implement comprehensive statistics calculation
      const summary: AvailabilityStatsSummary = {
        overview: {
          totalSlots: stats.totalSlots,
          bookedSlots: stats.bookedSlots,
          availableSlots: stats.totalSlots - stats.bookedSlots,
          bookingRate: stats.bookingRate,
          totalHours: stats.totalHours,
          earnedRevenue: 0 // TODO: Calculate from bookings
        },
        trends: {
          weeklyTrend: 'stable',
          popularDays: ['Saturday', 'Sunday'],
          popularTimes: ['10:00', '14:00'],
          seasonality: 'medium'
        },
        performance: {
          averageBookingTime: 24, // hours in advance
          cancellationRate: 10, // percentage
          noShowRate: 5, // percentage
          repeatBookingRate: 15 // percentage
        },
        recommendations: [
          {
            type: 'scheduling',
            description: 'Consider adding more weekend slots for higher booking rates',
            impact: 'high'
          }
        ]
      };

      this.logger.debug('Availability stats summary calculated', { userId, overview: summary.overview });
      return summary;
    } catch (error) {
      this.logger.error('Failed to get availability stats summary', { userId, error });
      throw error;
    }
  }

  /**
   * Optimize user's availability schedule
   */
  async optimizeAvailabilitySchedule(
    userId: number, 
    preferences?: ScheduleOptimizationPreferences
  ): Promise<ScheduleOptimizationResult> {
    this.logger.debug('Optimizing availability schedule', { userId, preferences });

    try {
      // TODO: Implement ML-based schedule optimization
      const result: ScheduleOptimizationResult = {
        currentEfficiency: 65,
        optimizedEfficiency: 85,
        recommendations: [
          {
            action: 'add_slot',
            description: 'Add Saturday morning slots for higher demand',
            expectedImpact: {
              bookingIncrease: 25,
              revenueIncrease: 30,
              efficiencyGain: 15
            },
            confidence: 85
          }
        ],
        weeklyTemplate: [
          {
            dayOfWeek: 'Saturday',
            recommendedSlots: [
              {
                startTime: '10:00',
                endTime: '11:00',
                expectedBookings: 3,
                reason: 'High historical demand'
              }
            ]
          }
        ]
      };

      this.logger.debug('Schedule optimization completed', { 
        userId, 
        currentEfficiency: result.currentEfficiency,
        optimizedEfficiency: result.optimizedEfficiency 
      });

      return result;
    } catch (error) {
      this.logger.error('Failed to optimize availability schedule', { userId, error });
      throw error;
    }
  }

  /**
   * Get nearby available users for offline dates
   */
  async getNearbyAvailableUsers(
    userId: number,
    date: string,
    radiusKm: number,
    timeRange?: { startTime: string; endTime: string }
  ): Promise<NearbyAvailableUsersResponse> {
    this.logger.debug('Getting nearby available users', { userId, date, radiusKm, timeRange });

    try {
      // TODO: Implement geospatial search for nearby users
      const response: NearbyAvailableUsersResponse = {
        users: [],
        searchRadius: radiusKm,
        totalFound: 0,
        averageDistance: 0
      };

      this.logger.debug('Nearby users search completed', { userId, totalFound: 0 });
      return response;
    } catch (error) {
      this.logger.error('Failed to get nearby available users', { userId, error });
      throw error;
    }
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  /**
   * Enforce business rules for availability creation
   * @private
   */
  private async enforceBusinessRules(userId: number, availabilityData: CreateAvailabilityRequest): Promise<void> {
    // TODO: Implement business rule enforcement
    // - Maximum slots per day/week
    // - Minimum advance notice
    // - Premium user restrictions
  }

  /**
   * Check if availability slot has active bookings
   * @private
   */
  private async hasActiveBookings(availabilityId: number): Promise<boolean> {
    // TODO: Implement booking check
    return false;
  }

  /**
   * Validate updates to booked slots
   * @private
   */
  private async validateBookedSlotUpdate(updateData: UpdateAvailabilityRequest): Promise<void> {
    // TODO: Implement validation for booked slot updates
    // - Prevent time changes
    // - Allow only certain status changes
  }

  /**
   * Handle bookings when cancelling availability
   * @private
   */
  private async handleCancellationBookings(availabilityId: number, reason?: string): Promise<void> {
    // TODO: Implement booking cancellation logic
    // - Notify booked users
    // - Process refunds if applicable
  }

  /**
   * Calculate summary statistics for availability list
   * @private
   */
  private async calculateAvailabilitySummary(
    availabilities: AvailabilityResponse[],
    startDate?: string,
    endDate?: string
  ): Promise<any> {
    const totalSlots = availabilities.length;
    const bookedSlots = availabilities.filter(a => a.data && a.data.isBooked).length;
    const availableSlots = totalSlots - bookedSlots;
    const upcomingSlots = availabilities.filter(a => 
      a.data && a.data.availabilityDate && new Date(a.data.availabilityDate) > new Date()
    ).length;

    return {
      totalSlots,
      bookedSlots,
      availableSlots,
      upcomingSlots,
      dateRange: {
        start: startDate || '',
        end: endDate || ''
      }
    };
  }

  /**
   * Calculate duration between two times in minutes
   * @private
   */
  private calculateDurationMinutes(startTime: string, endTime: string): number {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    return (end.getTime() - start.getTime()) / (1000 * 60);
  }

  /**
   * Add minutes to a time string
   * @private
   */
  private addMinutesToTime(time: string, minutes: number): string {
    const date = new Date(`2000-01-01T${time}`);
    date.setMinutes(date.getMinutes() + minutes);
    return date.toTimeString().slice(0, 5);
  }

  /**
   * Map entity cancellation policy to proto enum
   * @private
   */
  private mapCancellationPolicy(policy: string): AvailabilityCancellationPolicy {
    switch (policy) {
      case '24_hours':
        return AvailabilityCancellationPolicy.AVAILABILITY_CANCELLATION_POLICY_TWENTY_FOUR_HOURS;
      case '48_hours':
        return AvailabilityCancellationPolicy.AVAILABILITY_CANCELLATION_POLICY_FORTY_EIGHT_HOURS;
      case 'flexible':
        return AvailabilityCancellationPolicy.AVAILABILITY_CANCELLATION_POLICY_FLEXIBLE;
      case 'strict':
        return AvailabilityCancellationPolicy.AVAILABILITY_CANCELLATION_POLICY_STRICT;
      default:
        return AvailabilityCancellationPolicy.AVAILABILITY_CANCELLATION_POLICY_UNSPECIFIED;
    }
  }
}