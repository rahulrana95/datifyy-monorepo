// =============================================================================
// FILE: dtos/queries/AdminGetDatesQueryDto.ts
// =============================================================================

import { IsOptional, IsInt, IsArray, IsEnum, IsBoolean, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { CuratedDateStatus, DateMode } from '@datifyy/shared-types';
import { BaseDateRangeQueryDto } from '../base/BaseQueryDto';
import { VALIDATION_MESSAGES } from '../base/CommonTypes';

/**
 * Admin get dates query parameters DTO
 */
export class AdminGetDatesQueryDto extends BaseDateRangeQueryDto {
  @IsOptional()
  @Transform(({ value }) => 
    typeof value === 'string' ? value.split(',') : value
  )
  @IsArray({ message: 'Status must be an array' })
  @IsEnum(CuratedDateStatus, { 
    each: true, 
    message: VALIDATION_MESSAGES.INVALID_ENUM(Object.values(CuratedDateStatus)) 
  })
  status?: CuratedDateStatus[];

  @IsOptional()
  @Transform(({ value }) => 
    typeof value === 'string' ? value.split(',') : value
  )
  @IsArray({ message: 'Mode must be an array' })
  @IsEnum(DateMode, { 
    each: true, 
    message: VALIDATION_MESSAGES.INVALID_ENUM(Object.values(DateMode)) 
  })
  mode?: DateMode[];

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'Curated by must be an integer' })
  @Min(1, { message: 'Curated by must be a positive integer' })
  curatedBy?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'User1 ID must be an integer' })
  @Min(1, { message: 'User1 ID must be a positive integer' })
  user1Id?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'User2 ID must be an integer' })
  @Min(1, { message: 'User2 ID must be a positive integer' })
  user2Id?: number;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean({ message: 'Include workflow must be a boolean' })
  includeWorkflow?: boolean = false;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean({ message: 'Include feedback must be a boolean' })
  includeFeedback?: boolean = false;
}