// =============================================================================
// FILE: dtos/requests/UpdateCuratedDateDto.ts
// =============================================================================

import { 
  IsOptional, 
  IsEnum, 
  IsISO8601, 
  IsInt, 
  IsString, 
  IsUrl,
  MinLength,
  MaxLength,
  Min,
  Max,
  ValidateNested,
  ArrayMaxSize,
  IsArray
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { DateMode, CuratedDateStatus } from '../../../../proto-types/dating/curated_dates';
import { LocationCoordinatesDto } from './CreateCuratedDateDto';
import { VALIDATION_RULES, VALIDATION_MESSAGES, FIELD_LENGTHS } from '../base/CommonTypes';

/**
 * Update curated date request DTO
 */
export class UpdateCuratedDateDto {
  @IsOptional()
  @IsISO8601({}, { message: VALIDATION_MESSAGES.INVALID_DATE })
  dateTime?: string;

  @IsOptional()
  @IsInt({ message: 'Duration must be an integer' })
  @Min(VALIDATION_RULES.dateScheduling.minDurationMinutes, { 
    message: `Duration must be at least ${VALIDATION_RULES.dateScheduling.minDurationMinutes} minutes` 
  })
  @Max(VALIDATION_RULES.dateScheduling.maxDurationMinutes, { 
    message: `Duration cannot exceed ${VALIDATION_RULES.dateScheduling.maxDurationMinutes} minutes` 
  })
  durationMinutes?: number;

  @IsOptional()
  @IsEnum(DateMode, { 
    message: VALIDATION_MESSAGES.INVALID_ENUM(Object.values(DateMode)) 
  })
  mode?: DateMode;

  @IsOptional()
  @IsEnum(CuratedDateStatus, { 
    message: VALIDATION_MESSAGES.INVALID_ENUM(Object.values(CuratedDateStatus)) 
  })
  status?: CuratedDateStatus;

  @IsOptional()
  @IsString({ message: 'Location name must be a string' })
  @MinLength(FIELD_LENGTHS.LOCATION_NAME_MIN, { 
    message: VALIDATION_MESSAGES.TOO_SHORT(FIELD_LENGTHS.LOCATION_NAME_MIN) 
  })
  @MaxLength(FIELD_LENGTHS.LOCATION_NAME_MAX, { 
    message: VALIDATION_MESSAGES.TOO_LONG(FIELD_LENGTHS.LOCATION_NAME_MAX) 
  })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  locationName?: string;

  @IsOptional()
  @IsString({ message: 'Location address must be a string' })
  @MaxLength(VALIDATION_RULES.location.maxAddressLength, { 
    message: VALIDATION_MESSAGES.TOO_LONG(VALIDATION_RULES.location.maxAddressLength) 
  })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  locationAddress?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationCoordinatesDto)
  locationCoordinates?: LocationCoordinatesDto;

  @IsOptional()
  @IsUrl({}, { message: VALIDATION_MESSAGES.INVALID_URL })
  meetingLink?: string;

  @IsOptional()
  @IsString({ message: 'Meeting ID must be a string' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  meetingId?: string;

  @IsOptional()
  @IsString({ message: 'Meeting password must be a string' })
  meetingPassword?: string;

  @IsOptional()
  @IsString({ message: 'Admin notes must be a string' })
  @MaxLength(VALIDATION_RULES.notes.maxAdminNotesLength, { 
    message: VALIDATION_MESSAGES.TOO_LONG(VALIDATION_RULES.notes.maxAdminNotesLength) 
  })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  adminNotes?: string;

  @IsOptional()
  @IsString({ message: 'Special instructions must be a string' })
  @MaxLength(FIELD_LENGTHS.ADMIN_NOTES_MAX, { 
    message: VALIDATION_MESSAGES.TOO_LONG(FIELD_LENGTHS.ADMIN_NOTES_MAX) 
  })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  specialInstructions?: string;

  @IsOptional()
  @IsString({ message: 'Dress code must be a string' })
  @MaxLength(200, { message: VALIDATION_MESSAGES.TOO_LONG(200) })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  dressCode?: string;

  @IsOptional()
  @IsArray({ message: 'Suggested conversation topics must be an array' })
  @ArrayMaxSize(10, { message: 'Maximum 10 conversation topics allowed' })
  @IsString({ each: true, message: 'Each topic must be a string' })
  @Transform(({ value }) => 
    Array.isArray(value) 
      ? value.map(item => typeof item === 'string' ? item.trim() : item)
      : value
  )
  suggestedConversationTopics?: string[];
}