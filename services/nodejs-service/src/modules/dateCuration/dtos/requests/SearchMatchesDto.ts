// =============================================================================
// FILE: dtos/requests/SearchMatchesDto.ts
// =============================================================================

import { 
  IsInt, 
  IsOptional, 
  IsString, 
  IsBoolean, 
  Min, 
  Max, 
  ValidateNested 
} from 'class-validator';
import { Type } from 'class-transformer';
import { BaseQueryDto } from '../base/BaseQueryDto';

/**
 * Age range filter DTO
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
 * Search potential matches request DTO
 */
export class SearchPotentialMatchesDto extends BaseQueryDto {
  @IsInt({ message: 'User ID must be a positive integer' })
  @Min(1, { message: 'User ID must be positive' })
  userId: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => AgeRangeDto)
  ageRange?: AgeRangeDto;

  @IsOptional()
  @IsString({ message: 'Gender preference must be a string' })
  genderPreference?: string;

  @IsOptional()
  @IsInt({ message: 'Location radius must be an integer' })
  @Min(1, { message: 'Location radius must be at least 1 km' })
  @Max(1000, { message: 'Location radius cannot exceed 1000 km' })
  locationRadius?: number;

  @IsOptional()
  @IsInt({ message: 'Minimum compatibility score must be an integer' })
  @Min(0, { message: 'Compatibility score must be between 0 and 100' })
  @Max(100, { message: 'Compatibility score must be between 0 and 100' })
  minCompatibilityScore?: number;

  @IsOptional()
  @IsBoolean({ message: 'Exclude recent dates must be a boolean' })
  excludeRecentDates?: boolean = true;

  @IsOptional()
  @IsBoolean({ message: 'Include compatibility details must be a boolean' })
  includeCompatibilityDetails?: boolean = false;
}
