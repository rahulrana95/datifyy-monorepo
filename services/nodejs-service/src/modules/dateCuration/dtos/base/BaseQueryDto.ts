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