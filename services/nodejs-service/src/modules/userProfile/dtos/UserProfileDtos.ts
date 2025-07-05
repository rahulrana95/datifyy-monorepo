// src/modules/userProfile/dtos/UserProfileDtos.ts

import { 
  IsString, 
  IsOptional, 
  IsArray, 
  IsBoolean, 
  IsNumber, 
  IsEnum, 
  IsDateString,
  MinLength, 
  MaxLength, 
  Min, 
  Max,
  IsUrl,
  IsIn,
  ArrayMaxSize,
  ValidateNested,
  IsObject
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

// Enum definitions for validation
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

export enum Exercise {
  NONE = 'None',
  LIGHT = 'Light',
  MODERATE = 'Moderate',
  HEAVY = 'Heavy'
}

export enum EducationLevel {
  HIGH_SCHOOL = 'High School',
  UNDERGRADUATE = 'Undergraduate',
  GRADUATE = 'Graduate',
  POSTGRADUATE = 'Postgraduate'
}

export enum DrinkingHabit {
  NEVER = 'Never',
  OCCASIONALLY = 'Occasionally',
  REGULARLY = 'Regularly'
}

export enum SmokingHabit {
  NEVER = 'Never',
  OCCASIONALLY = 'Occasionally',
  REGULARLY = 'Regularly'
}

export enum LookingFor {
  FRIENDSHIP = 'Friendship',
  CASUAL = 'Casual',
  RELATIONSHIP = 'Relationship'
}

export enum SettleDownTimeframe {
  ZERO_TO_SIX = '0-6',
  SIX_TO_TWELVE = '6-12',
  TWELVE_TO_TWENTY_FOUR = '12-24',
  TWENTY_FOUR_PLUS = '24+'
}

export enum StarSign {
  ARIES = 'Aries',
  TAURUS = 'Taurus',
  GEMINI = 'Gemini',
  CANCER = 'Cancer',
  LEO = 'Leo',
  VIRGO = 'Virgo',
  LIBRA = 'Libra',
  SCORPIO = 'Scorpio',
  SAGITTARIUS = 'Sagittarius',
  CAPRICORN = 'Capricorn',
  AQUARIUS = 'Aquarius',
  PISCES = 'Pisces'
}

export enum Pronoun {
  HE_HIM = 'He/Him',
  SHE_HER = 'She/Her',
  THEY_THEM = 'They/Them',
  OTHER = 'Other'
}

// Transform decorators
const trimTransform = Transform(({ value }) => typeof value === 'string' ? value.trim() : value);
const arrayTrimTransform = Transform(({ value }) => 
  Array.isArray(value) ? value.map(item => typeof item === 'string' ? item.trim() : item) : value
);

/**
 * Main DTO for updating user profile
 */
export class UpdateUserProfileRequestDto {
  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  @MinLength(1, { message: 'First name cannot be empty' })
  @MaxLength(50, { message: 'First name cannot exceed 50 characters' })
  @trimTransform
  firstName?: string;

  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  @MinLength(1, { message: 'Last name cannot be empty' })
  @MaxLength(50, { message: 'Last name cannot exceed 50 characters' })
  @trimTransform
  lastName?: string;

  @IsOptional()
  @IsEnum(Gender, { message: 'Gender must be male, female, or other' })
  gender?: Gender;

  @IsOptional()
  @IsString({ message: 'Bio must be a string' })
  @MaxLength(500, { message: 'Bio cannot exceed 500 characters' })
  @trimTransform
  bio?: string;

  @IsOptional()
  @IsArray({ message: 'Images must be an array' })
  @ArrayMaxSize(6, { message: 'Maximum 6 images allowed' })
  @IsUrl({}, { each: true, message: 'Each image must be a valid URL' })
  images?: string[];

  @IsOptional()
  @IsDateString({}, { message: 'Date of birth must be a valid date string (YYYY-MM-DD)' })
  dob?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Height must be a number' })
  @Min(100, { message: 'Height must be at least 100 cm' })
  @Max(250, { message: 'Height cannot exceed 250 cm' })
  height?: number;

  @IsOptional()
  @IsString({ message: 'Current city must be a string' })
  @MaxLength(100, { message: 'Current city cannot exceed 100 characters' })
  @trimTransform
  currentCity?: string;

  @IsOptional()
  @IsString({ message: 'Hometown must be a string' })
  @MaxLength(100, { message: 'Hometown cannot exceed 100 characters' })
  @trimTransform
  hometown?: string;

  @IsOptional()
  @IsEnum(Exercise, { message: 'Exercise must be None, Light, Moderate, or Heavy' })
  exercise?: Exercise;

  @IsOptional()
  @IsEnum(EducationLevel, { message: 'Education level must be a valid option' })
  educationLevel?: EducationLevel;

  @IsOptional()
  @IsEnum(DrinkingHabit, { message: 'Drinking habit must be Never, Occasionally, or Regularly' })
  drinking?: DrinkingHabit;

  @IsOptional()
  @IsEnum(SmokingHabit, { message: 'Smoking habit must be Never, Occasionally, or Regularly' })
  smoking?: SmokingHabit;

  @IsOptional()
  @IsEnum(LookingFor, { message: 'Looking for must be Friendship, Casual, or Relationship' })
  lookingFor?: LookingFor;

  @IsOptional()
  @IsEnum(SettleDownTimeframe, { message: 'Settle down timeframe must be a valid option' })
  settleDownInMonths?: SettleDownTimeframe;

  @IsOptional()
  @IsBoolean({ message: 'Have kids must be a boolean' })
  haveKids?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Wants kids must be a boolean' })
  wantsKids?: boolean;

  @IsOptional()
  @IsEnum(StarSign, { message: 'Star sign must be a valid zodiac sign' })
  starSign?: StarSign;

  @IsOptional()
  @IsString({ message: 'Religion must be a string' })
  @MaxLength(50, { message: 'Religion cannot exceed 50 characters' })
  @trimTransform
  religion?: string;

  @IsOptional()
  @IsEnum(Pronoun, { message: 'Pronoun must be a valid option' })
  pronoun?: Pronoun;

  @IsOptional()
  @IsArray({ message: 'Favorite interests must be an array' })
  @ArrayMaxSize(10, { message: 'Maximum 10 interests allowed' })
  @IsString({ each: true, message: 'Each interest must be a string' })
  @arrayTrimTransform
  favInterest?: string[];

  @IsOptional()
  @IsArray({ message: 'Causes you support must be an array' })
  @ArrayMaxSize(10, { message: 'Maximum 10 causes allowed' })
  @IsString({ each: true, message: 'Each cause must be a string' })
  @arrayTrimTransform
  causesYouSupport?: string[];

  @IsOptional()
  @IsArray({ message: 'Qualities you value must be an array' })
  @ArrayMaxSize(10, { message: 'Maximum 10 qualities allowed' })
  @IsString({ each: true, message: 'Each quality must be a string' })
  @arrayTrimTransform
  qualityYouValue?: string[];

  @IsOptional()
  @IsArray({ message: 'Prompts must be an array' })
  @ArrayMaxSize(5, { message: 'Maximum 5 prompts allowed' })
  prompts?: object[];

  @IsOptional()
  @IsArray({ message: 'Education must be an array' })
  @ArrayMaxSize(5, { message: 'Maximum 5 education entries allowed' })
  education?: object[];
}

/**
 * DTO for updating user avatar/images
 */
export class UpdateUserAvatarRequestDto {
  @IsString({ message: 'Image URL must be a string' })
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  imageUrl: string;

  @IsOptional()
  @IsBoolean({ message: 'Set as primary must be a boolean' })
  setAsPrimary?: boolean;
}

/**
 * DTO for verification status updates (admin only)
 */
export class UpdateVerificationStatusRequestDto {
  @IsEnum(['email', 'phone', 'aadhar'], { 
    message: 'Verification type must be email, phone, or aadhar' 
  })
  verificationType: 'email' | 'phone' | 'aadhar';

  @IsBoolean({ message: 'Status must be a boolean' })
  status: boolean;

  @IsOptional()
  @IsString({ message: 'Reason must be a string' })
  @MaxLength(200, { message: 'Reason cannot exceed 200 characters' })
  @trimTransform
  reason?: string;
}

/**
 * Validation middleware factory for DTOs
 */
export function validateDto<T extends object>(DtoClass: new () => T) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Transform plain object to class instance
      const dto = plainToClass(DtoClass, req.body);
      
      // Validate the DTO
      const errors = await validate(dto as any, {
        whitelist: true, // Strip unknown properties
        forbidNonWhitelisted: true, // Reject unknown properties
        transform: true, // Apply transformations
        skipMissingProperties: true, // Allow optional fields
      });

      if (errors.length > 0) {
        const formattedErrors = formatValidationErrors(errors);
        
        res.status(400).json({
          success: false,
          error: {
            message: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: formattedErrors,
            timestamp: new Date().toISOString(),
            requestId: (req as any).id
          }
        });
        return;
      }

      // Attach validated and transformed data to request
      req.body = dto;
      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Format validation errors for client response
 */
function formatValidationErrors(errors: ValidationError[]): any[] {
  return errors.map(error => ({
    field: error.property,
    value: error.value,
    constraints: Object.values(error.constraints || {}),
    children: error.children && error.children.length > 0 
      ? formatValidationErrors(error.children) 
      : undefined
  }));
}

// Export validation middleware for each DTO
export const validateUpdateUserProfile = validateDto(UpdateUserProfileRequestDto);
export const validateUpdateUserAvatar = validateDto(UpdateUserAvatarRequestDto);
export const validateUpdateVerificationStatus = validateDto(UpdateVerificationStatusRequestDto);

/**
 * Additional validation utilities
 */
export class ValidationUtils {
  /**
   * Validate age from date of birth
   */
  static validateAge(dob: string): { isValid: boolean; age?: number; error?: string } {
    try {
      const birthDate = new Date(dob);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return { isValid: age >= 18, age: age - 1 };
      }
      
      if (age < 18) {
        return { isValid: false, error: 'User must be at least 18 years old' };
      }
      
      if (age > 100) {
        return { isValid: false, error: 'Invalid age' };
      }
      
      return { isValid: true, age };
    } catch (error) {
      return { isValid: false, error: 'Invalid date format' };
    }
  }

  /**
   * Validate image URLs
   */
  static validateImageUrls(urls: string[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    
    urls.forEach((url, index) => {
      try {
        const urlObj = new URL(url);
        const hasValidExtension = validExtensions.some(ext => 
          urlObj.pathname.toLowerCase().endsWith(ext)
        );
        
        if (!hasValidExtension) {
          errors.push(`Image ${index + 1}: Invalid image format`);
        }
      } catch {
        errors.push(`Image ${index + 1}: Invalid URL format`);
      }
    });
    
    return { isValid: errors.length === 0, errors };
  }
}