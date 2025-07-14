// =============================================================================
// FILE: dtos/requests/ConfirmDateDto.ts
// =============================================================================

import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { VALIDATION_MESSAGES, FIELD_LENGTHS } from '../base/CommonTypes';

/**
 * Confirm date request DTO
 */
export class ConfirmDateDto {
  @IsBoolean({ message: 'Confirmed must be a boolean value' })
  confirmed: boolean;

  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  @MaxLength(FIELD_LENGTHS.NOTES_MAX, { 
    message: VALIDATION_MESSAGES.TOO_LONG(FIELD_LENGTHS.NOTES_MAX) 
  })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  notes?: string;
}
