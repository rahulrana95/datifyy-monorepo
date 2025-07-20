// =============================================================================
// FILE: dtos/queries/AnalyticsQueryDto.ts
// =============================================================================

import { IsOptional, IsEnum, IsBoolean, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';
import { VALIDATION_MESSAGES } from '../base/CommonTypes';

/**
 * Analytics query parameters DTO
 */
export class DateCurationAnalyticsQueryDto {
  @IsOptional()
  @IsDateString({}, { message: VALIDATION_MESSAGES.INVALID_DATE })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: VALIDATION_MESSAGES.INVALID_DATE })
  endDate?: string;

  @IsOptional()
  @IsEnum(['day', 'week', 'month'], { 
    message: VALIDATION_MESSAGES.INVALID_ENUM(['day', 'week', 'month']) 
  })
  groupBy?: 'day' | 'week' | 'month';

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean({ message: 'Include user stats must be a boolean' })
  includeUserStats?: boolean = false;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean({ message: 'Include feedback stats must be a boolean' })
  includeFeedbackStats?: boolean = false;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean({ message: 'Include success metrics must be a boolean' })
  includeSuccessMetrics?: boolean = false;
}