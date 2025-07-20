import { IsOptional, IsArray, IsEnum, IsBoolean, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';
import { } from '../../../../proto-types/dating/curated_dates';
import { BaseDateRangeQueryDto } from '../base/BaseQueryDto';
import { VALIDATION_MESSAGES } from '../base/CommonTypes';
import { CuratedDateStatus, DateMode } from '../../../../proto-types';

/**
 * Get user dates query parameters DTO
 */
export class GetUserDatesQueryDto extends BaseDateRangeQueryDto {
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
  @Transform(({ value }) => value === 'true')
  @IsBoolean({ message: 'Include history must be a boolean' })
  includeHistory?: boolean = false;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean({ message: 'Include feedback must be a boolean' })
  includeFeedback?: boolean = false;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean({ message: 'Include partner info must be a boolean' })
  includePartnerInfo?: boolean = false;
}
