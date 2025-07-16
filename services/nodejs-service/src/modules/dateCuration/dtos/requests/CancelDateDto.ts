// =============================================================================
// FILE: dtos/requests/CancelDateDto.ts
// =============================================================================

import { IsString, IsEnum, IsOptional, IsBoolean, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { CancellationCategory } from '../../../../proto-types';
import { VALIDATION_MESSAGES, FIELD_LENGTHS } from '../base/CommonTypes';

/**
 * Cancel date request DTO
 */
export class CancelDateDto {
  @IsString({ message: 'Reason must be a string' })
  @MinLength(FIELD_LENGTHS.REASON_MIN, { 
    message: VALIDATION_MESSAGES.TOO_SHORT(FIELD_LENGTHS.REASON_MIN) 
  })
  @MaxLength(FIELD_LENGTHS.REASON_MAX, { 
    message: VALIDATION_MESSAGES.TOO_LONG(FIELD_LENGTHS.REASON_MAX) 
  })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  reason: string;

  @IsEnum(CancellationCategory, { 
    message: VALIDATION_MESSAGES.INVALID_ENUM(Object.values(CancellationCategory)) 
  })
  category: CancellationCategory;

  @IsOptional()
  @IsBoolean({ message: 'Notify partner must be a boolean' })
  notifyPartner?: boolean = true;

  @IsOptional()
  @IsBoolean({ message: 'Refund tokens must be a boolean' })
  refundTokens?: boolean = true;
}
