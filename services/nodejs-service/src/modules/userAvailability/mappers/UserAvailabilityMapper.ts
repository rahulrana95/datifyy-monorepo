// services/nodejs-service/src/modules/userAvailability/mappers/UserAvailabilityMapper.ts

import {
  AvailabilityResponse,
  BookingResponse,
  SearchAvailableUsersResponse,
  AvailabilitySlot,
  AvailabilityBooking,
  AvailabilityDateType,
  AvailabilitySlotStatus,
  AvailabilityRecurrenceType,
  AvailabilityCancellationPolicy,
  AvailabilityBookingStatus
} from '../../../proto-types/user/availability';
import { DatifyyUserAvailability } from '../../../models/entities/DatifyyUserAvailability';
import { DatifyyAvailabilityBookings } from '../../../models/entities/DatifyyAvailabilityBookings';
import { DatifyyUsersInformation } from '../../../models/entities/DatifyyUsersInformation';
import { Logger } from '../../../infrastructure/logging/Logger';

/**
 * User Availability Mapper
 * 
 * Handles transformations between database entities and API DTOs.
 * Provides comprehensive mapping for availability slots, bookings, and user data.
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */
export class UserAvailabilityMapper {
  constructor(private readonly logger: Logger) {}

  /**
   * Convert DatifyyUserAvailability entity to AvailabilityResponse DTO
   * @param entity - Database entity
   * @returns AvailabilityResponse - API response DTO
   */
  async toAvailabilityResponse(entity: DatifyyUserAvailability): Promise<AvailabilityResponse> {
    try {
      this.logger.debug('Mapping availability entity to response', { 
        availabilityId: entity.id,
        userId: entity.userId 
      });

      // Calculate helper fields
      const durationMinutes = this.calculateDurationMinutes(entity.startTime, entity.endTime);
      const formattedDateTime = this.formatDateTime(entity.availabilityDate, entity.startTime, entity.endTime);
      const currentBooking = this.getActiveBooking(entity.datifyyAvailabilityBookings);
      const isBooked = !!currentBooking;
      const bookingCount = entity.datifyyAvailabilityBookings?.length || 0;
      
      // Determine if user can cancel or modify
      const canCancel = this.canCancelAvailability(entity);
      const canModify = this.canModifyAvailability(entity, isBooked);

      const availabilitySlot: AvailabilitySlot = {
        id: entity.id.toString(),
        userId: entity.userId,
        dateType: this.mapDateType(entity.dateType),
        status: this.mapAvailabilityStatus(entity.status),
        date: entity.availabilityDate ? new Date(entity.availabilityDate) : undefined,
        startTime: entity.startTime,
        endTime: entity.endTime,
        timezone: entity.timezone || 'UTC',
        recurrenceType: this.mapRecurrenceType(entity.recurrenceType),
        recurrenceDays: [],
        recurrenceEndDate: entity.recurrenceEndDate ? new Date(entity.recurrenceEndDate) : undefined,
        maxBookings: 1,
        currentBookings: bookingCount || 0,
        durationMinutes: durationMinutes,
        bufferTimeMinutes: entity.bufferTimeMinutes || 0,
        location: entity.locationPreference || '',
        venue: '',
        virtualLink: '',
        notes: entity.notes || '',
        preferredActivities: [],
        cancellationPolicy: this.mapCancellationPolicy(entity.cancellationPolicy),
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        isBooked: isBooked,
        availabilityDate: entity.availabilityDate ? new Date(entity.availabilityDate) : undefined
      };

      const response: AvailabilityResponse = {
        success: true,
        data: availabilitySlot,
        message: 'Availability retrieved successfully'
      };

      this.logger.debug('Availability entity mapped successfully', { 
        availabilityId: entity.id,
        isBooked,
        durationMinutes 
      });

      return response;
    } catch (error) {
      this.logger.error('Failed to map availability entity to response', { 
        availabilityId: entity.id,
        error 
      });
      throw error;
    }
  }

  /**
   * Convert DatifyyAvailabilityBookings entity to BookingResponse DTO
   * @param entity - Database entity
   * @returns BookingResponse - API response DTO
   */
  async toBookingResponse(entity: DatifyyAvailabilityBookings): Promise<BookingResponse> {
    try {
      this.logger.debug('Mapping booking entity to response', { 
        bookingId: entity.id,
        availabilityId: entity.availabilityId 
      });

      // Calculate helper fields
      const canCancel = this.canCancelBooking(entity);
      const canModify = this.canModifyBooking(entity);
      const refundEligible = this.isRefundEligible(entity);
      const hoursUntilMeeting = this.calculateHoursUntilMeeting(entity);

      // Map the availability if included
      const availability = entity.availability ? 
        await this.toAvailabilityResponse(entity.availability) : 
        undefined;

      const booking: AvailabilityBooking = {
        id: entity.id.toString(),
        availabilitySlotId: entity.availabilityId.toString(),
        hostUserId: entity.availability?.userId || 0,
        guestUserId: entity.bookedByUserId,
        status: this.mapBookingStatus(entity.bookingStatus),
        bookingDate: entity.createdAt,
        startTime: entity.availability?.startTime || '',
        endTime: entity.availability?.endTime || '',
        location: '',
        venue: '',
        virtualLink: '',
        activity: entity.selectedActivity || '',
        notes: entity.bookingNotes || '',
        cancellationReason: entity.cancellationReason || '',
        cancelledByUserId: entity.cancelledAt ? entity.bookedByUserId : 0,
        cancelledAt: entity.cancelledAt || undefined,
        confirmedAt: entity.confirmedAt || undefined,
        completedAt: undefined,
        hostRating: 0,
        guestRating: 0,
        hostFeedback: '',
        guestFeedback: '',
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt
      };

      const response: BookingResponse = {
        success: true,
        data: booking,
        message: 'Booking retrieved successfully'
      };

      this.logger.debug('Booking entity mapped successfully', { 
        bookingId: entity.id,
        status: entity.bookingStatus,
        canCancel 
      });

      return response;
    } catch (error) {
      this.logger.error('Failed to map booking entity to response', { 
        bookingId: entity.id,
        error 
      });
      throw error;
    }
  }

  /**
   * Convert availability entity with user info to AvailableUserResponse
   * @param availability - Availability entity
   * @param userProfile - User profile entity
   * @param additionalData - Additional computed data
   * @returns AvailableUserResponse - API response DTO
   */
  async toAvailableUserResponse(
    availability: DatifyyUserAvailability,
    userProfile: DatifyyUsersInformation,
    additionalData: {
      distance?: number;
      compatibilityScore?: number;
      commonInterests?: string[];
      matchReasons?: string[];
    } = {}
  ): Promise<any> {
    try {
      this.logger.debug('Mapping available user response', { 
        userId: userProfile.id,
        availabilityId: availability.id 
      });

      const availabilityResponse = await this.toAvailabilityResponse(availability);
      const age = this.calculateAge(userProfile.dob);

      const response = {
        availability: availabilityResponse,
        user: {
          id: parseInt(userProfile.id),
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
          profileImage: this.extractProfileImage(userProfile.images),
          age,
          location: this.formatLocation(userProfile.currentCity, userProfile.hometown),
          bio: userProfile.bio || undefined,
          verificationStatus: {
            email: userProfile.isOfficialEmailVerified || false,
            phone: userProfile.isPhoneVerified || false,
            identity: userProfile.isAadharVerified || false
          }
        },
        compatibilityScore: additionalData.compatibilityScore,
        distance: additionalData.distance,
        commonInterests: additionalData.commonInterests,
        matchReasons: additionalData.matchReasons
      };

      this.logger.debug('Available user response mapped successfully', { 
        userId: userProfile.id,
        age,
        hasProfileImage: !!response.user.profileImage 
      });

      return response;
    } catch (error) {
      this.logger.error('Failed to map available user response', { 
        userId: userProfile.id,
        error 
      });
      throw error;
    }
  }

  /**
   * Convert entity to base AvailabilitySlot interface
   * @param entity - Database entity
   * @returns AvailabilitySlot - Base interface
   */
  toAvailabilitySlot(entity: DatifyyUserAvailability): AvailabilitySlot {
    try {
      const slot: AvailabilitySlot = {
        id: entity.id.toString(),
        userId: entity.userId,
        dateType: this.mapDateType(entity.dateType),
        status: this.mapAvailabilityStatus(entity.status),
        date: entity.availabilityDate ? new Date(entity.availabilityDate) : undefined,
        startTime: entity.startTime,
        endTime: entity.endTime,
        timezone: entity.timezone || 'UTC',
        recurrenceType: this.mapRecurrenceType(entity.recurrenceType),
        recurrenceDays: [],
        recurrenceEndDate: entity.recurrenceEndDate ? new Date(entity.recurrenceEndDate) : undefined,
        maxBookings: 1,
        currentBookings: 0,
        durationMinutes: this.calculateDurationMinutes(entity.startTime, entity.endTime),
        bufferTimeMinutes: entity.bufferTimeMinutes || 0,
        location: entity.locationPreference || '',
        venue: '',
        virtualLink: '',
        notes: entity.notes || '',
        preferredActivities: [],
        cancellationPolicy: this.mapCancellationPolicy(entity.cancellationPolicy),
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        isBooked: false,
        availabilityDate: entity.availabilityDate ? new Date(entity.availabilityDate) : undefined
      };

      return slot;
    } catch (error) {
      this.logger.error('Failed to map to availability slot', { 
        availabilityId: entity.id,
        error 
      });
      throw error;
    }
  }

  /**
   * Convert booking entity to base AvailabilityBooking interface
   * @param entity - Database entity
   * @returns AvailabilityBooking - Base interface
   */
  toAvailabilityBooking(entity: DatifyyAvailabilityBookings): AvailabilityBooking {
    try {
      const booking: AvailabilityBooking = {
        id: entity.id.toString(),
        availabilitySlotId: entity.availabilityId.toString(),
        hostUserId: entity.availability?.userId || 0,
        guestUserId: entity.bookedByUserId,
        status: this.mapBookingStatus(entity.bookingStatus),
        bookingDate: entity.createdAt,
        startTime: entity.availability?.startTime || '',
        endTime: entity.availability?.endTime || '',
        location: '',
        venue: '',
        virtualLink: '',
        activity: entity.selectedActivity || '',
        notes: entity.bookingNotes || '',
        cancellationReason: entity.cancellationReason || '',
        cancelledByUserId: entity.cancelledAt ? entity.bookedByUserId : 0,
        cancelledAt: entity.cancelledAt || undefined,
        confirmedAt: entity.confirmedAt || undefined,
        completedAt: undefined,
        hostRating: 0,
        guestRating: 0,
        hostFeedback: '',
        guestFeedback: '',
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt
      };

      return booking;
    } catch (error) {
      this.logger.error('Failed to map to availability booking', { 
        bookingId: entity.id,
        error 
      });
      throw error;
    }
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  /**
   * Convert booking entity to booking info for availability response
   * @private
   */
  private async toBookingInfo(entity: DatifyyAvailabilityBookings): Promise<AvailabilityBooking> {
    return this.toAvailabilityBooking(entity);
  }

  /**
   * Get the active booking from a list of bookings
   * @private
   */
  private getActiveBooking(bookings?: DatifyyAvailabilityBookings[]): DatifyyAvailabilityBookings | undefined {
    if (!bookings || bookings.length === 0) return undefined;
    
    // Find the most recent active booking (pending or confirmed)
    return bookings.find(booking => 
      booking.bookingStatus === 'pending' || booking.bookingStatus === 'confirmed'
    );
  }

  /**
   * Calculate duration between two times in minutes
   * @private
   */
  private calculateDurationMinutes(startTime: string, endTime: string): number {
    try {
      const start = new Date(`2000-01-01T${startTime}`);
      const end = new Date(`2000-01-01T${endTime}`);
      return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
    } catch (error) {
      this.logger.warn('Failed to calculate duration', { startTime, endTime, error });
      return 0;
    }
  }

  /**
   * Format date and time for display
   * @private
   */
  private formatDateTime(date: string, startTime: string, endTime: string): string {
    try {
      const dateObj = new Date(date);
      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
      const monthDay = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      // Convert 24h to 12h format
      const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return `${displayHour}:${minutes} ${ampm}`;
      };

      return `${dayName}, ${monthDay} • ${formatTime(startTime)} - ${formatTime(endTime)}`;
    } catch (error) {
      this.logger.warn('Failed to format date time', { date, startTime, endTime, error });
      return `${date} ${startTime} - ${endTime}`;
    }
  }

  /**
   * Check if user can cancel availability
   * @private
   */
  private canCancelAvailability(entity: DatifyyUserAvailability): boolean {
    try {
      // Can cancel if:
      // 1. Status is 'active'
      // 2. Not in the past
      // 3. No confirmed bookings (would need booking check)
      
      if (entity.status !== 'active') return false;
      
      const slotDateTime = new Date(`${entity.availabilityDate}T${entity.startTime}`);
      const now = new Date();
      
      return slotDateTime > now;
    } catch (error) {
      this.logger.warn('Failed to check can cancel availability', { 
        availabilityId: entity.id,
        error 
      });
      return false;
    }
  }

  /**
   * Check if user can modify availability
   * @private
   */
  private canModifyAvailability(entity: DatifyyUserAvailability, isBooked: boolean): boolean {
    try {
      // Can modify if:
      // 1. Status is 'active'
      // 2. Not in the past
      // 3. No active bookings or limited modifications allowed
      
      if (entity.status !== 'active') return false;
      
      const slotDateTime = new Date(`${entity.availabilityDate}T${entity.startTime}`);
      const now = new Date();
      const hoursUntil = (slotDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
      
      // If booked, only allow modifications with sufficient notice
      if (isBooked) {
        return hoursUntil > 24; // At least 24 hours notice
      }
      
      return hoursUntil > 2; // At least 2 hours notice
    } catch (error) {
      this.logger.warn('Failed to check can modify availability', { 
        availabilityId: entity.id,
        error 
      });
      return false;
    }
  }

  /**
   * Check if user can cancel booking
   * @private
   */
  private canCancelBooking(entity: DatifyyAvailabilityBookings): boolean {
    try {
      if (entity.bookingStatus !== 'pending' && entity.bookingStatus !== 'confirmed') {
        return false;
      }

      if (!entity.availability) return true; // Conservative approach

      const slotDateTime = new Date(`${entity.availability.availabilityDate}T${entity.availability.startTime}`);
      const now = new Date();
      const hoursUntil = (slotDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

      // Check cancellation policy
      switch (entity.availability.cancellationPolicy) {
        case 'flexible':
          return hoursUntil > 1;
        case '24_hours':
          return hoursUntil > 24;
        case '48_hours':
          return hoursUntil > 48;
        case 'strict':
          return hoursUntil > 72;
        default:
          return hoursUntil > 24;
      }
    } catch (error) {
      this.logger.warn('Failed to check can cancel booking', { 
        bookingId: entity.id,
        error 
      });
      return false;
    }
  }

  /**
   * Check if user can modify booking
   * @private
   */
  private canModifyBooking(entity: DatifyyAvailabilityBookings): boolean {
    try {
      // Can only modify pending bookings
      if (entity.bookingStatus !== 'pending') return false;

      if (!entity.availability) return true;

      const slotDateTime = new Date(`${entity.availability.availabilityDate}T${entity.availability.startTime}`);
      const now = new Date();
      const hoursUntil = (slotDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

      return hoursUntil > 2; // At least 2 hours notice
    } catch (error) {
      this.logger.warn('Failed to check can modify booking', { 
        bookingId: entity.id,
        error 
      });
      return false;
    }
  }

  /**
   * Check if booking is eligible for refund
   * @private
   */
  private isRefundEligible(entity: DatifyyAvailabilityBookings): boolean {
    try {
      if (entity.bookingStatus !== 'cancelled') return false;
      
      // Refund eligible if cancelled within policy
      return entity.withinPolicy || false;
    } catch (error) {
      this.logger.warn('Failed to check refund eligibility', { 
        bookingId: entity.id,
        error 
      });
      return false;
    }
  }

  /**
   * Calculate hours until meeting
   * @private
   */
  private calculateHoursUntilMeeting(entity: DatifyyAvailabilityBookings): number {
    try {
      if (!entity.availability) return 0;

      const slotDateTime = new Date(`${entity.availability.availabilityDate}T${entity.availability.startTime}`);
      const now = new Date();
      const hoursUntil = (slotDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

      return Math.max(0, Math.round(hoursUntil * 10) / 10); // Round to 1 decimal place
    } catch (error) {
      this.logger.warn('Failed to calculate hours until meeting', { 
        bookingId: entity.id,
        error 
      });
      return 0;
    }
  }

  /**
   * Extract profile image from images array
   * @private
   */
  private extractProfileImage(images?: string[] | null): string | undefined {
    if (!images || images.length === 0) return undefined;
    
    // Return the first image as profile image
    return images[0];
  }

  /**
   * Calculate age from date of birth
   * @private
   */
  private calculateAge(dob?: string | null): number {
    if (!dob) return 0;

    try {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return Math.max(0, age);
    } catch (error) {
      this.logger.warn('Failed to calculate age', { dob, error });
      return 0;
    }
  }

  /**
   * Format user location
   * @private
   */
  private formatLocation(currentCity?: string | null, hometown?: string | null): string {
    if (currentCity && hometown && currentCity !== hometown) {
      return `${currentCity} (from ${hometown})`;
    }
    return currentCity || hometown || 'Location not specified';
  }

  // ============================================================================
  // ENUM MAPPING HELPERS
  // ============================================================================

  private mapDateType(dateType: string): AvailabilityDateType {
    switch (dateType?.toLowerCase()) {
      case 'online': return AvailabilityDateType.AVAILABILITY_DATE_TYPE_ONLINE;
      case 'offline': return AvailabilityDateType.AVAILABILITY_DATE_TYPE_OFFLINE;
      default: return AvailabilityDateType.AVAILABILITY_DATE_TYPE_UNSPECIFIED;
    }
  }

  private mapAvailabilityStatus(status: string): AvailabilitySlotStatus {
    switch (status?.toLowerCase()) {
      case 'active': return AvailabilitySlotStatus.AVAILABILITY_SLOT_STATUS_ACTIVE;
      case 'cancelled': return AvailabilitySlotStatus.AVAILABILITY_SLOT_STATUS_CANCELLED;
      case 'completed': return AvailabilitySlotStatus.AVAILABILITY_SLOT_STATUS_COMPLETED;
      case 'deleted': return AvailabilitySlotStatus.AVAILABILITY_SLOT_STATUS_DELETED;
      default: return AvailabilitySlotStatus.AVAILABILITY_SLOT_STATUS_UNSPECIFIED;
    }
  }

  private mapRecurrenceType(recurrenceType: string | null): AvailabilityRecurrenceType {
    switch (recurrenceType?.toLowerCase()) {
      case 'none': return AvailabilityRecurrenceType.AVAILABILITY_RECURRENCE_TYPE_NONE;
      case 'weekly': return AvailabilityRecurrenceType.AVAILABILITY_RECURRENCE_TYPE_WEEKLY;
      case 'custom': return AvailabilityRecurrenceType.AVAILABILITY_RECURRENCE_TYPE_CUSTOM;
      default: return AvailabilityRecurrenceType.AVAILABILITY_RECURRENCE_TYPE_NONE;
    }
  }

  private mapCancellationPolicy(policy: string): AvailabilityCancellationPolicy {
    switch (policy?.toLowerCase()) {
      case 'flexible': return AvailabilityCancellationPolicy.AVAILABILITY_CANCELLATION_POLICY_FLEXIBLE;
      case '24_hours': return AvailabilityCancellationPolicy.AVAILABILITY_CANCELLATION_POLICY_TWENTY_FOUR_HOURS;
      case '48_hours': return AvailabilityCancellationPolicy.AVAILABILITY_CANCELLATION_POLICY_FORTY_EIGHT_HOURS;
      case 'strict': return AvailabilityCancellationPolicy.AVAILABILITY_CANCELLATION_POLICY_STRICT;
      default: return AvailabilityCancellationPolicy.AVAILABILITY_CANCELLATION_POLICY_FLEXIBLE;
    }
  }

  private mapBookingStatus(status: string): AvailabilityBookingStatus {
    switch (status?.toLowerCase()) {
      case 'pending': return AvailabilityBookingStatus.AVAILABILITY_BOOKING_STATUS_PENDING;
      case 'confirmed': return AvailabilityBookingStatus.AVAILABILITY_BOOKING_STATUS_CONFIRMED;
      case 'cancelled': return AvailabilityBookingStatus.AVAILABILITY_BOOKING_STATUS_CANCELLED;
      case 'completed': return AvailabilityBookingStatus.AVAILABILITY_BOOKING_STATUS_COMPLETED;
      default: return AvailabilityBookingStatus.AVAILABILITY_BOOKING_STATUS_UNSPECIFIED;
    }
  }
}