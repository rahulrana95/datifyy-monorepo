// =============================================================================
// FILE: dtos/requests/SubmitFeedbackDto.ts
// =============================================================================

import { 
  IsOptional, 
  IsInt, 
  IsBoolean, 
  IsString, 
  IsArray, 
  Min, 
  Max, 
  MaxLength,
  ArrayMaxSize
} from 'class-validator';
import { Transform } from 'class-transformer';
import { VALIDATION_RULES, VALIDATION_MESSAGES } from '../base/CommonTypes';

/**
 * Submit date feedback request DTO
 */
export class SubmitFeedbackDto {
  // Overall experience ratings (1-5)
  @IsOptional()
  @IsInt({ message: 'Overall rating must be an integer' })
  @Min(VALIDATION_RULES.feedback.minRating, { 
    message: `Rating must be between ${VALIDATION_RULES.feedback.minRating} and ${VALIDATION_RULES.feedback.maxRating}` 
  })
  @Max(VALIDATION_RULES.feedback.maxRating, { 
    message: `Rating must be between ${VALIDATION_RULES.feedback.minRating} and ${VALIDATION_RULES.feedback.maxRating}` 
  })
  overallRating?: number;

  @IsOptional()
  @IsBoolean({ message: 'Would meet again must be a boolean' })
  wouldMeetAgain?: boolean;

  @IsOptional()
  @IsInt({ message: 'Chemistry rating must be an integer' })
  @Min(VALIDATION_RULES.feedback.minRating, { 
    message: `Rating must be between ${VALIDATION_RULES.feedback.minRating} and ${VALIDATION_RULES.feedback.maxRating}` 
  })
  @Max(VALIDATION_RULES.feedback.maxRating, { 
    message: `Rating must be between ${VALIDATION_RULES.feedback.minRating} and ${VALIDATION_RULES.feedback.maxRating}` 
  })
  chemistryRating?: number;

  @IsOptional()
  @IsInt({ message: 'Conversation quality must be an integer' })
  @Min(VALIDATION_RULES.feedback.minRating, { 
    message: `Rating must be between ${VALIDATION_RULES.feedback.minRating} and ${VALIDATION_RULES.feedback.maxRating}` 
  })
  @Max(VALIDATION_RULES.feedback.maxRating, { 
    message: `Rating must be between ${VALIDATION_RULES.feedback.minRating} and ${VALIDATION_RULES.feedback.maxRating}` 
  })
  conversationQuality?: number;

  // Text feedback
  @IsOptional()
  @IsString({ message: 'What went well must be a string' })
  @MaxLength(VALIDATION_RULES.feedback.maxCommentLength, { 
    message: VALIDATION_MESSAGES.TOO_LONG(VALIDATION_RULES.feedback.maxCommentLength) 
  })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  whatWentWell?: string;

  @IsOptional()
  @IsString({ message: 'What could improve must be a string' })
  @MaxLength(VALIDATION_RULES.feedback.maxCommentLength, { 
    message: VALIDATION_MESSAGES.TOO_LONG(VALIDATION_RULES.feedback.maxCommentLength) 
  })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  whatCouldImprove?: string;

  @IsOptional()
  @IsString({ message: 'Favorite moment must be a string' })
  @MaxLength(VALIDATION_RULES.feedback.maxCommentLength, { 
    message: VALIDATION_MESSAGES.TOO_LONG(VALIDATION_RULES.feedback.maxCommentLength) 
  })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  favoriteMoment?: string;

  // Partner evaluation (1-5)
  @IsOptional()
  @IsInt({ message: 'Partner punctuality must be an integer' })
  @Min(VALIDATION_RULES.feedback.minRating, { 
    message: `Rating must be between ${VALIDATION_RULES.feedback.minRating} and ${VALIDATION_RULES.feedback.maxRating}` 
  })
  @Max(VALIDATION_RULES.feedback.maxRating, { 
    message: `Rating must be between ${VALIDATION_RULES.feedback.minRating} and ${VALIDATION_RULES.feedback.maxRating}` 
  })
  partnerPunctuality?: number;

  @IsOptional()
  @IsInt({ message: 'Partner appearance match must be an integer' })
  @Min(VALIDATION_RULES.feedback.minRating, { 
    message: `Rating must be between ${VALIDATION_RULES.feedback.minRating} and ${VALIDATION_RULES.feedback.maxRating}` 
  })
  @Max(VALIDATION_RULES.feedback.maxRating, { 
    message: `Rating must be between ${VALIDATION_RULES.feedback.minRating} and ${VALIDATION_RULES.feedback.maxRating}` 
  })
  partnerAppearanceMatch?: number;

  // Future preferences
  @IsOptional()
  @IsString({ message: 'Suggested improvements must be a string' })
  @MaxLength(VALIDATION_RULES.feedback.maxCommentLength, { 
    message: VALIDATION_MESSAGES.TOO_LONG(VALIDATION_RULES.feedback.maxCommentLength) 
  })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  suggestedImprovements?: string;

  @IsOptional()
  @IsString({ message: 'Preferred next date activity must be a string' })
  @MaxLength(200, { message: VALIDATION_MESSAGES.TOO_LONG(200) })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  preferredNextDateActivity?: string;

  @IsOptional()
  @IsString({ message: 'Preferred next date timing must be a string' })
  @MaxLength(200, { message: VALIDATION_MESSAGES.TOO_LONG(200) })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  preferredNextDateTiming?: string;

  // Safety and concerns
  @IsOptional()
  @IsBoolean({ message: 'Safety concerns must be a boolean' })
  safetyConcerns?: boolean = false;

  @IsOptional()
  @IsArray({ message: 'Red flags must be an array' })
  @ArrayMaxSize(VALIDATION_RULES.feedback.maxRedFlags, { 
    message: `Maximum ${VALIDATION_RULES.feedback.maxRedFlags} red flags allowed` 
  })
  @IsString({ each: true, message: 'Each red flag must be a string' })
  @Transform(({ value }) => 
    Array.isArray(value) 
      ? value.map(item => typeof item === 'string' ? item.trim() : item)
      : value
  )
  redFlags?: string[];

  @IsOptional()
  @IsBoolean({ message: 'Report user must be a boolean' })
  reportUser?: boolean = false;

  @IsOptional()
  @IsString({ message: 'Report reason must be a string' })
  @MaxLength(VALIDATION_RULES.feedback.maxCommentLength, { 
    message: VALIDATION_MESSAGES.TOO_LONG(VALIDATION_RULES.feedback.maxCommentLength) 
  })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  reportReason?: string;

  // Logistics feedback (1-5)
  @IsOptional()
  @IsInt({ message: 'Venue rating must be an integer' })
  @Min(VALIDATION_RULES.feedback.minRating, { 
    message: `Rating must be between ${VALIDATION_RULES.feedback.minRating} and ${VALIDATION_RULES.feedback.maxRating}` 
  })
  @Max(VALIDATION_RULES.feedback.maxRating, { 
    message: `Rating must be between ${VALIDATION_RULES.feedback.minRating} and ${VALIDATION_RULES.feedback.maxRating}` 
  })
  venueRating?: number;

  @IsOptional()
  @IsInt({ message: 'Timing satisfaction must be an integer' })
  @Min(VALIDATION_RULES.feedback.minRating, { 
    message: `Rating must be between ${VALIDATION_RULES.feedback.minRating} and ${VALIDATION_RULES.feedback.maxRating}` 
  })
  @Max(VALIDATION_RULES.feedback.maxRating, { 
    message: `Rating must be between ${VALIDATION_RULES.feedback.minRating} and ${VALIDATION_RULES.feedback.maxRating}` 
  })
  timingSatisfaction?: number;

  @IsOptional()
  @IsInt({ message: 'Duration satisfaction must be an integer' })
  @Min(VALIDATION_RULES.feedback.minRating, { 
    message: `Rating must be between ${VALIDATION_RULES.feedback.minRating} and ${VALIDATION_RULES.feedback.maxRating}` 
  })
  @Max(VALIDATION_RULES.feedback.maxRating, { 
    message: `Rating must be between ${VALIDATION_RULES.feedback.minRating} and ${VALIDATION_RULES.feedback.maxRating}` 
  })
  durationSatisfaction?: number;

  // Follow-up intentions
  @IsOptional()
  @IsBoolean({ message: 'Interested in second date must be a boolean' })
  interestedInSecondDate?: boolean;

  @IsOptional()
  @IsString({ message: 'Preferred contact method must be a string' })
  @MaxLength(100, { message: VALIDATION_MESSAGES.TOO_LONG(100) })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  preferredContactMethod?: string;

  @IsOptional()
  @IsString({ message: 'Additional comments must be a string' })
  @MaxLength(VALIDATION_RULES.feedback.maxCommentLength, { 
    message: VALIDATION_MESSAGES.TOO_LONG(VALIDATION_RULES.feedback.maxCommentLength) 
  })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  additionalComments?: string;

  @IsOptional()
  @IsBoolean({ message: 'Is anonymous must be a boolean' })
  isAnonymous?: boolean = false;
}