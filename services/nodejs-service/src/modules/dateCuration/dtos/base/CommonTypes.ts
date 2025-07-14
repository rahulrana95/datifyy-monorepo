// =============================================================================
// FILE: dtos/base/CommonTypes.ts
// =============================================================================

import { 
  DateMode, 
  CuratedDateStatus, 
  CancellationCategory,
  DateCurationValidationRules 
} from '@datifyy/shared-types';

/**
 * Common validation constraints and rules
 */
export const VALIDATION_RULES = {
  dateScheduling: {
    minAdvanceHours: 24,
    maxAdvanceDays: 90,
    minDurationMinutes: 30,
    maxDurationMinutes: 240,
    allowedTimeSlots: {
      start: '09:00',
      end: '22:00'
    }
  },
  feedback: {
    submissionDeadlineHours: 48,
    minRating: 1,
    maxRating: 5,
    maxRedFlags: 5,
    maxCommentLength: 1000
  },
  location: {
    maxNameLength: 255,
    maxAddressLength: 1000,
    latRange: { min: -90, max: 90 },
    lngRange: { min: -180, max: 180 }
  },
  notes: {
    maxAdminNotesLength: 2000,
    maxSpecialInstructionsLength: 1000,
    maxCancellationReasonLength: 1000
  }
} as const;

/**
 * Common field validation helpers
 */
export const FIELD_LENGTHS = {
  REASON_MIN: 5,
  REASON_MAX: 1000,
  NOTES_MAX: 500,
  ADMIN_NOTES_MAX: 2000,
  LOCATION_NAME_MIN: 2,
  LOCATION_NAME_MAX: 255
} as const;

/**
 * Common error messages
 */
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_DATE: 'Invalid date format',
  INVALID_TIME: 'Invalid time format',
  INVALID_DURATION: 'Duration must be between 30 and 240 minutes',
  INVALID_RATING: 'Rating must be between 1 and 5',
  INVALID_URL: 'Invalid URL format',
  INVALID_COORDINATES: 'Invalid coordinates',
  TOO_SHORT: (min: number) => `Must be at least ${min} characters`,
  TOO_LONG: (max: number) => `Must be less than ${max} characters`,
  INVALID_ENUM: (values: string[]) => `Must be one of: ${values.join(', ')}`
} as const;

// =============================================================================
// FILE: dtos/base/BaseQueryDto.ts
// =============================================================================

import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * Base query DTO for pagination
 */
export abstract class BaseQueryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  limit?: number = 10;
}

/**
 * Base date range query DTO
 */
export abstract class BaseDateRangeQueryDto extends BaseQueryDto {
  @IsOptional()
  @Transform(({ value }) => typeof value === 'string' ? value : undefined)
  startDate?: string;

  @IsOptional()
  @Transform(({ value }) => typeof value === 'string' ? value : undefined)
  endDate?: string;
}