import { IsNumber, Min, Max, IsOptional, IsString, MaxLength, IsEnum } from 'class-validator';

export enum TrustScoreAdjustmentReason {
  MANUAL_REVIEW = 'manual_review',
  POSITIVE_FEEDBACK = 'positive_feedback',
  NEGATIVE_FEEDBACK = 'negative_feedback',
  SAFETY_CONCERN = 'safety_concern',
  POLICY_VIOLATION = 'policy_violation',
  EXCEPTIONAL_BEHAVIOR = 'exceptional_behavior',
  SYSTEM_ERROR_CORRECTION = 'system_error_correction'
}

export class UpdateUserTrustScoreRequestDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  overallScore?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  attendanceScore?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  punctualityScore?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  feedbackScore?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  warningLevel?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  maxDatesPerWeek?: number;

  @IsEnum(TrustScoreAdjustmentReason)
  adjustmentReason: TrustScoreAdjustmentReason;

  @IsString()
  @MaxLength(1000)
  adminNotes: string;

  @IsOptional()
  @IsString()
  probationDuration?: string; // ISO duration format

  @IsOptional()
  @IsString()
  probationReason?: string;
}