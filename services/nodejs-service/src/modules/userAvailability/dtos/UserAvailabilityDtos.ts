// services/nodejs-service/src/modules/userAvailability/dtos/UserAvailabilityDtos.ts

import { IsString, IsOptional, IsBoolean, IsEnum, IsInt, Min, Max, IsDateString, Matches, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { 
  DateType, 
  AvailabilityStatus, 
  RecurrenceType, 
  CancellationPolicy,
  SelectedActivity,
  BookingStatus, 
  type DateTypeValue,
  type AvailabilityStatusValue,
  type RecurrenceTypeValue,
  type CancellationPolicyValue,
  type SelectedActivityValue,
  type BookingStatusValue
} from '@datifyy/shared-types';

/**
 * DTO for creating a new availability slot
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */
export class CreateAvailabilityDto {
  /**
   * Date of availability in YYYY-MM-DD format
   * Must be today or in the future, max 90 days ahead
   */
  @IsDateString({}, { message: 'Availability date must be in YYYY-MM-DD format' })
  @Transform(({ value }) => {
    const date = new Date(value);
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 90);
    
    if (date < today) {
      throw new Error('Availability date cannot be in the past');
    }
    if (date > maxDate) {
      throw new Error('Availability date cannot be more than 90 days in the future');
    }
    return value;
  })
  availabilityDate: string;

  /**
   * Start time in HH:MM format (24-hour)
   */
  @IsString({ message: 'Start time is required' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { 
    message: 'Start time must be in HH:MM format (24-hour)' 
  })
  startTime: string;

  /**
   * End time in HH:MM format (24-hour)
   * Must be after start time
   */
  @IsString({ message: 'End time is required' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { 
    message: 'End time must be in HH:MM format (24-hour)' 
  })
  endTime: string;

  /**
   * Timezone (optional, defaults to UTC)
   */
  @IsOptional()
  @IsString({ message: 'Timezone must be a valid string' })
  timezone?: string;

  /**
   * Type of date - online or offline
   */
  @IsEnum(DateType, { message: 'Date type must be either "online" or "offline"' })
  dateType: DateTypeValue;

  /**
   * Optional title for the availability slot
   */
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  @Transform(({ value }) => value?.trim())
  title?: string;

  /**
   * Optional notes or description
   */
  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  @Transform(({ value }) => value?.trim())
  notes?: string;

  /**
   * Location preference for offline dates
   */
  @IsOptional()
  @IsString({ message: 'Location preference must be a string' })
  @Transform(({ value }) => value?.trim())
  locationPreference?: string;

  /**
   * Buffer time in minutes before/after the slot
   */
  @IsOptional()
  @IsInt({ message: 'Buffer time must be an integer' })
  @Min(0, { message: 'Buffer time cannot be negative' })
  @Max(120, { message: 'Buffer time cannot exceed 120 minutes' })
  bufferTimeMinutes?: number;

  /**
   * Preparation time in minutes before the date
   */
  @IsOptional()
  @IsInt({ message: 'Preparation time must be an integer' })
  @Min(0, { message: 'Preparation time cannot be negative' })
  @Max(60, { message: 'Preparation time cannot exceed 60 minutes' })
  preparationTimeMinutes?: number;

  /**
   * Cancellation policy for bookings
   */
  @IsOptional()
  @IsEnum(CancellationPolicy, { 
    message: 'Cancellation policy must be one of: flexible, 24_hours, 48_hours, strict' 
  })
  cancellationPolicy?: CancellationPolicyValue;

  /**
   * Whether this slot is recurring
   */
  @IsOptional()
  @IsBoolean({ message: 'Is recurring must be a boolean' })
  @Transform(({ value }) => value === true || value === 'true')
  isRecurring?: boolean;

  /**
   * Type of recurrence (if recurring)
   */
  @IsOptional()
  @IsEnum(RecurrenceType, { 
    message: 'Recurrence type must be one of: none, weekly, custom' 
  })
  recurrenceType?: RecurrenceTypeValue;

  /**
   * End date for recurrence (if recurring)
   */
  @IsOptional()
  @IsDateString({}, { message: 'Recurrence end date must be in YYYY-MM-DD format' })
  recurrenceEndDate?: string;
}

/**
 * DTO for updating an existing availability slot
 * All fields are optional for partial updates
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */
export class UpdateAvailabilityDto {
  @IsOptional()
  @IsDateString({}, { message: 'Availability date must be in YYYY-MM-DD format' })
  availabilityDate?: string;

  @IsOptional()
  @IsString({ message: 'Start time must be a string' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { 
    message: 'Start time must be in HH:MM format (24-hour)' 
  })
  startTime?: string;

  @IsOptional()
  @IsString({ message: 'End time must be a string' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { 
    message: 'End time must be in HH:MM format (24-hour)' 
  })
  endTime?: string;

  @IsOptional()
  @IsString({ message: 'Timezone must be a valid string' })
  timezone?: string;

  @IsOptional()
  @IsEnum(DateType, { message: 'Date type must be either "online" or "offline"' })
  dateType?: DateTypeValue;

  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  @Transform(({ value }) => value?.trim())
  title?: string;

  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  @Transform(({ value }) => value?.trim())
  notes?: string;

  @IsOptional()
  @IsString({ message: 'Location preference must be a string' })
  @Transform(({ value }) => value?.trim())
  locationPreference?: string;

  @IsOptional()
  @IsInt({ message: 'Buffer time must be an integer' })
  @Min(0, { message: 'Buffer time cannot be negative' })
  @Max(120, { message: 'Buffer time cannot exceed 120 minutes' })
  bufferTimeMinutes?: number;

  @IsOptional()
  @IsInt({ message: 'Preparation time must be an integer' })
  @Min(0, { message: 'Preparation time cannot be negative' })
  @Max(60, { message: 'Preparation time cannot exceed 60 minutes' })
  preparationTimeMinutes?: number;

  @IsOptional()
  @IsEnum(CancellationPolicy, { 
    message: 'Cancellation policy must be one of: flexible, 24_hours, 48_hours, strict' 
  })
  cancellationPolicy?: CancellationPolicyValue;

  @IsOptional()
  @IsEnum(AvailabilityStatus, { 
    message: 'Status must be one of: active, cancelled, completed, deleted' 
  })
  status?: AvailabilityStatusValue;
}

/**
 * DTO for bulk creating availability slots
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */
export class BulkCreateAvailabilityDto {
  /**
   * Array of availability slots to create
   */
  @IsArray({ message: 'Slots must be an array' })
  @ValidateNested({ each: true })
  @Type(() => CreateAvailabilityDto)
  slots: CreateAvailabilityDto[];

  /**
   * Whether to skip conflicting slots instead of erroring
   */
  @IsOptional()
  @IsBoolean({ message: 'Skip conflicts must be a boolean' })
  @Transform(({ value }) => value === true || value === 'true')
  skipConflicts?: boolean;
}

/**
 * DTO for filtering and paginating availability slots
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */
export class GetAvailabilityDto {
  /**
   * Page number for pagination (starts from 1)
   */
  @IsOptional()
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  @Transform(({ value }) => parseInt(value, 10))
  page?: number;

  /**
   * Number of items per page (max 100)
   */
  @IsOptional()
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number;

  /**
   * Start date filter (YYYY-MM-DD)
   */
  @IsOptional()
  @IsDateString({}, { message: 'Start date must be in YYYY-MM-DD format' })
  startDate?: string;

  /**
   * End date filter (YYYY-MM-DD)
   */
  @IsOptional()
  @IsDateString({}, { message: 'End date must be in YYYY-MM-DD format' })
  endDate?: string;

  /**
   * Filter by availability status
   */
  @IsOptional()
  @IsArray({ message: 'Status filter must be an array' })
  @IsEnum(AvailabilityStatus, { 
    each: true, 
    message: 'Each status must be one of: active, cancelled, completed, deleted' 
  })
  @Transform(({ value }) => Array.isArray(value) ? value : [value])
  status?: AvailabilityStatusValue[];

  /**
   * Filter by date type
   */
  @IsOptional()
  @IsArray({ message: 'Date type filter must be an array' })
  @IsEnum(DateType, { 
    each: true, 
    message: 'Each date type must be either "online" or "offline"' 
  })
  @Transform(({ value }) => Array.isArray(value) ? value : [value])
  dateType?: DateTypeValue[];

  /**
   * Timezone for filtering and display
   */
  @IsOptional()
  @IsString({ message: 'Timezone must be a string' })
  timezone?: string;

  /**
   * Include booking information in response
   */
  @IsOptional()
  @IsBoolean({ message: 'Include bookings must be a boolean' })
  @Transform(({ value }) => value === true || value === 'true')
  includeBookings?: boolean;

  /**
   * Include recurring slot information
   */
  @IsOptional()
  @IsBoolean({ message: 'Include recurring must be a boolean' })
  @Transform(({ value }) => value === true || value === 'true')
  includeRecurring?: boolean;

  /**
   * Show only available slots (not booked)
   */
  @IsOptional()
  @IsBoolean({ message: 'Only available must be a boolean' })
  @Transform(({ value }) => value === true || value === 'true')
  onlyAvailable?: boolean;
}

/**
 * DTO for age range in searches
 */
export class AgeRangeDto {
  @IsInt({ message: 'Minimum age must be an integer' })
  @Min(18, { message: 'Minimum age must be at least 18' })
  @Max(100, { message: 'Minimum age cannot exceed 100' })
  min: number;

  @IsInt({ message: 'Maximum age must be an integer' })
  @Min(18, { message: 'Maximum age must be at least 18' })
  @Max(100, { message: 'Maximum age cannot exceed 100' })
  max: number;
}


/**
 * DTO for searching available users
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */
export class SearchAvailableUsersDto {
  /**
   * Date to search for availability (YYYY-MM-DD)
   */
  @IsDateString({}, { message: 'Availability date must be in YYYY-MM-DD format' })
  availabilityDate: string;

  /**
   * Optional start time filter (HH:MM)
   */
  @IsOptional()
  @IsString({ message: 'Start time must be a string' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { 
    message: 'Start time must be in HH:MM format (24-hour)' 
  })
  startTime?: string;

  /**
   * Optional end time filter (HH:MM)
   */
  @IsOptional()
  @IsString({ message: 'End time must be a string' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { 
    message: 'End time must be in HH:MM format (24-hour)' 
  })
  endTime?: string;

  /**
   * Type of date preference
   */
  @IsOptional()
  @IsEnum(DateType, { message: 'Date type must be either "online" or "offline"' })
  dateType?: DateTypeValue;

  /**
   * Search radius in kilometers (for offline dates)
   */
  @IsOptional()
  @IsNumber({}, { message: 'Location radius must be a number' })
  @Min(1, { message: 'Location radius must be at least 1 km' })
  @Max(100, { message: 'Location radius cannot exceed 100 km' })
  locationRadius?: number;

  /**
   * Preferred activities for the date
   */
  @IsOptional()
  @IsArray({ message: 'Preferred activities must be an array' })
  @IsEnum(SelectedActivity, { 
    each: true, 
    message: 'Each activity must be a valid activity type' 
  })
  preferredActivities?: SelectedActivityValue[];

  /**
   * Age range preference
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => AgeRangeDto)
  ageRange?: AgeRangeDto;

  /**
   * Gender preference
   */
  @IsOptional()
  @IsString({ message: 'Gender preference must be a string' })
  genderPreference?: string;

  /**
   * Page number for pagination
   */
  @IsOptional()
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  @Transform(({ value }) => parseInt(value, 10))
  page?: number;

  /**
   * Number of items per page
   */
  @IsOptional()
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(50, { message: 'Limit cannot exceed 50' })
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number;
}


/**
 * DTO for booking an availability slot
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */
export class BookAvailabilityDto {
  /**
   * ID of the availability slot to book
   */
  @IsInt({ message: 'Availability ID must be an integer' })
  @Min(1, { message: 'Availability ID must be positive' })
  availabilityId: number;

  /**
   * Selected activity for the date
   */
  @IsEnum(SelectedActivity, { 
    message: 'Selected activity must be a valid activity type' 
  })
  selectedActivity: SelectedActivityValue;

  /**
   * Optional notes for the booking
   */
  @IsOptional()
  @IsString({ message: 'Booking notes must be a string' })
  @Transform(({ value }) => value?.trim())
  bookingNotes?: string;
}

/**
 * DTO for updating a booking
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */
export class UpdateBookingDto {
  @IsOptional()
  @IsEnum(BookingStatus, { 
    message: 'Booking status must be one of: pending, confirmed, cancelled, completed' 
  })
  bookingStatus?: BookingStatusValue;

  @IsOptional()
  @IsEnum(SelectedActivity, { 
    message: 'Selected activity must be a valid activity type' 
  })
  selectedActivity?: SelectedActivityValue;

  @IsOptional()
  @IsString({ message: 'Booking notes must be a string' })
  @Transform(({ value }) => value?.trim())
  bookingNotes?: string;

  @IsOptional()
  @IsString({ message: 'Cancellation reason must be a string' })
  @Transform(({ value }) => value?.trim())
  cancellationReason?: string;
}

/**
 * DTO for cancelling availability
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */
export class CancelAvailabilityDto {
  @IsOptional()
  @IsString({ message: 'Reason must be a string' })
  @Transform(({ value }) => value?.trim())
  reason?: string;

  @IsOptional()
  @IsBoolean({ message: 'Notify booked users must be a boolean' })
  @Transform(({ value }) => value === true || value === 'true')
  notifyBookedUsers?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Refund bookings must be a boolean' })
  @Transform(({ value }) => value === true || value === 'true')
  refundBookings?: boolean;
}

/**
 * DTO for getting availability analytics
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */
export class GetAvailabilityAnalyticsDto {
  @IsOptional()
  @IsDateString({}, { message: 'Start date must be in YYYY-MM-DD format' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'End date must be in YYYY-MM-DD format' })
  endDate?: string;

  @IsOptional()
  @IsEnum(['day', 'week', 'month'], { 
    message: 'Group by must be one of: day, week, month' 
  })
  groupBy?: 'day' | 'week' | 'month';

  @IsOptional()
  @IsBoolean({ message: 'Include booking stats must be a boolean' })
  @Transform(({ value }) => value === true || value === 'true')
  includeBookingStats?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Include revenue must be a boolean' })
  @Transform(({ value }) => value === true || value === 'true')
  includeRevenue?: boolean;
}