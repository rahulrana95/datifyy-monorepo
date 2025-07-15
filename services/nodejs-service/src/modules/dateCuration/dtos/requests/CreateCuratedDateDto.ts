// =============================================================================
// FILE: dtos/requests/CreateCuratedDateDto.ts
// =============================================================================

import { 
  IsInt, 
  IsString, 
  IsOptional, 
  IsEnum, 
  IsArray, 
  IsNumber, 
  Min, 
  Max, 
  IsISO8601,
  IsUrl,
  MinLength,
  MaxLength,
  ArrayMaxSize,
  ValidateNested,
  IsObject
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { DateMode } from '../../../../proto-types/dating/curated_dates';
import { VALIDATION_RULES, VALIDATION_MESSAGES, FIELD_LENGTHS } from '../base/CommonTypes';

/**
 * Location coordinates DTO
 */
export class LocationCoordinatesDto {
  @IsNumber({}, { message: VALIDATION_MESSAGES.INVALID_COORDINATES })
  @Min(VALIDATION_RULES.location.latRange.min, { 
    message: 'Latitude must be between -90 and 90' 
  })
  @Max(VALIDATION_RULES.location.latRange.max, { 
    message: 'Latitude must be between -90 and 90' 
  })
  lat: number;

  @IsNumber({}, { message: VALIDATION_MESSAGES.INVALID_COORDINATES })
  @Min(VALIDATION_RULES.location.lngRange.min, { 
    message: 'Longitude must be between -180 and 180' 
  })
  @Max(VALIDATION_RULES.location.lngRange.max, { 
    message: 'Longitude must be between -180 and 180' 
  })
  lng: number;
}

/**
 * Create curated date request DTO
 */
export class CreateCuratedDateDto {
  @IsInt({ message: 'User1 ID must be a positive integer' })
  @Min(1, { message: 'User1 ID must be positive' })
  user1Id: number;

  @IsInt({ message: 'User2 ID must be a positive integer' })
  @Min(1, { message: 'User2 ID must be positive' })
  user2Id: number;

  @IsISO8601({}, { message: VALIDATION_MESSAGES.INVALID_DATE })
  dateTime: string;

  @IsOptional()
  @IsInt({ message: 'Duration must be an integer' })
  @Min(VALIDATION_RULES.dateScheduling.minDurationMinutes, { 
    message: `Duration must be at least ${VALIDATION_RULES.dateScheduling.minDurationMinutes} minutes` 
  })
  @Max(VALIDATION_RULES.dateScheduling.maxDurationMinutes, { 
    message: `Duration cannot exceed ${VALIDATION_RULES.dateScheduling.maxDurationMinutes} minutes` 
  })
  durationMinutes?: number = 60;

  @IsEnum(DateMode, { 
    message: VALIDATION_MESSAGES.INVALID_ENUM(Object.values(DateMode)) 
  })
  mode: DateMode;

  // Location fields (for offline dates)
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
  locationGoogleMapsUrl?: string;

  // Online meeting fields
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

  // Admin instructions
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

  // Matching context
  @IsOptional()
  @IsInt({ message: 'Compatibility score must be an integer' })
  @Min(0, { message: 'Compatibility score must be between 0 and 100' })
  @Max(100, { message: 'Compatibility score must be between 0 and 100' })
  compatibilityScore?: number;

  @IsOptional()
  @IsString({ message: 'Match reason must be a string' })
  @MaxLength(500, { message: VALIDATION_MESSAGES.TOO_LONG(500) })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  matchReason?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Algorithm confidence must be a number' })
  @Min(0, { message: 'Algorithm confidence must be between 0 and 1' })
  @Max(1, { message: 'Algorithm confidence must be between 0 and 1' })
  algorithmConfidence?: number;

  // Token costs
  @IsOptional()
  @IsInt({ message: 'Token cost for user1 must be an integer' })
  @Min(0, { message: 'Token cost must be non-negative' })
  tokensCostUser1?: number = 0;

  @IsOptional()
  @IsInt({ message: 'Token cost for user2 must be an integer' })
  @Min(0, { message: 'Token cost must be non-negative' })
  tokensCostUser2?: number = 0;
}
