import { IsOptional, IsString, IsEnum, IsNumber, Min, Max, IsBoolean, IsDateString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PaginationRequest } from '../../../../../proto-types/common/base';

export enum UserSortField {
  CREATED_AT = 'createdAt',
  LAST_ACTIVE = 'lastActiveAt',
  EMAIL = 'email',
  TRUST_SCORE = 'overallScore',
  TOTAL_DATES = 'totalDatesAttended'
}

export enum AccountStatusFilter {
  ACTIVE = 'active',
  DEACTIVATED = 'deactivated',
  LOCKED = 'locked',
  PENDING = 'pending',
  SUSPENDED = 'suspended'
}

export enum GenderFilter {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

export enum VerificationStatusFilter {
  EMAIL_VERIFIED = 'emailVerified',
  PHONE_VERIFIED = 'phoneVerified',
  ID_VERIFIED = 'idVerified',
  ALL_VERIFIED = 'allVerified',
  UNVERIFIED = 'unverified'
}

export class GetUsersRequestDto implements PaginationRequest {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
    // @ts-ignore
  limit?: number = 20;

  @IsOptional()
  @IsEnum(UserSortField)
  sortBy: UserSortField = UserSortField.CREATED_AT;

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder: 'ASC' | 'DESC' = 'DESC';

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  search: string;

  @IsOptional()
  @IsEnum(AccountStatusFilter)
  accountStatus?: AccountStatusFilter;

  @IsOptional()
  @IsEnum(GenderFilter)
  gender?: GenderFilter;

  @IsOptional()
  @IsEnum(VerificationStatusFilter)
  verificationStatus?: VerificationStatusFilter;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  minTrustScore?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  maxTrustScore?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isOnProbation?: boolean;

  @IsOptional()
  @IsDateString()
  createdAfter?: string;

  @IsOptional()
  @IsDateString()
  createdBefore?: string;

  @IsOptional()
  @IsDateString()
  lastActiveAfter?: string;

  @IsOptional()
  @IsDateString()
  lastActiveBefore?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minDatesAttended?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxDatesAttended?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  hasProfileIssues?: boolean;
}