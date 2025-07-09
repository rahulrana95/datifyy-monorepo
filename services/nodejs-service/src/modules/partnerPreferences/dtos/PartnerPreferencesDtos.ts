/**
 * Partner Preferences DTOs - Request Validation Layer
 * 
 * Following established codebase patterns:
 * ✅ Comprehensive validation with class-validator
 * ✅ Proper enum definitions for type safety
 * ✅ Transform decorators for data sanitization
 * ✅ Small, focused, testable validation rules
 * ✅ Consistent error messages for UX
 * ✅ Business rule validation
 * 
 * @author Staff Engineer - Dating Platform Team
 * @version 1.0.0
 */

import { 
  IsString, 
  IsOptional, 
  IsArray, 
  IsBoolean, 
  IsNumber, 
  IsEnum, 
  IsObject,
  Min, 
  Max,
  MinLength,
  MaxLength,
  ArrayMaxSize,
  ValidateNested,
  IsIn,
  validate,
  ValidationError
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { Request, Response, NextFunction } from 'express';
import { plainToClass } from 'class-transformer';

// ============================================================================
// ENUM DEFINITIONS (Following your established enum patterns)
// ============================================================================

export enum GenderPreference {
  BOTH = 'Both',
  MALE = 'Male',
  FEMALE = 'Female'
}

export enum SmokingPreference {
  NO = 'No',
  YES = 'Yes',
  SOMETIMES = 'Sometimes'
}

export enum DrinkingPreference {
  NO = 'No',
  YES = 'Yes', 
  SOMETIMES = 'Occasional'
}

export enum MaritalStatus {
  SINGLE = 'Single',
  DIVORCED = 'Divorced',
  WIDOWED = 'Widowed'
}

export enum ChildrenPreference {
  DOESNT_MATTER = 'Doesnt matter',
  YES = 'Yes',
  NO = 'No'
}

export enum EducationLevel {
  HIGH_SCHOOL = 'High School',
  UNDERGRADUATE = 'Undergraduate', 
  GRADUATE = 'Graduate',
  POSTGRADUATE = 'Postgraduate',
  PHD = 'PhD',
  PROFESSIONAL = 'Professional'
}

export enum RelationshipGoal {
  CASUAL_DATING = 'Casual Dating',
  SERIOUS_RELATIONSHIP = 'Serious Relationship',
  MARRIAGE = 'Marriage',
  FRIENDSHIP = 'Friendship',
  OPEN_TO_ANYTHING = 'Open to Anything'
}

export enum ActivityLevel {
  LOW = 'Low',
  MODERATE = 'Medium', 
  HIGH = 'High',
}

export enum PetPreference {
    YES= 'Yes',
    NO = 'No',
    DOES_NOT_MATTER='Doesnt matter'
}

// ============================================================================
// TRANSFORM DECORATORS (Following your established patterns)
// ============================================================================

const trimTransform = Transform(({ value }) => 
  typeof value === 'string' ? value.trim() : value
);

const arrayTrimTransform = Transform(({ value }) => 
  Array.isArray(value) 
    ? value.map(item => typeof item === 'string' ? item.trim() : item)
    : value
);

const currencyTransform = Transform(({ value }) => 
  typeof value === 'string' ? value.toUpperCase().trim() : value
);

const numberTransform = Transform(({ value }) => 
  typeof value === 'string' ? parseFloat(value) : value
);

// ============================================================================
// NESTED OBJECT VALIDATION CLASSES
// ============================================================================

/**
 * Location Preference validation class
 */
export class LocationPreferenceDto {
  @IsOptional()
  @IsArray({ message: 'Preferred cities must be an array' })
  @ArrayMaxSize(10, { message: 'Maximum 10 preferred cities allowed' })
  @IsString({ each: true, message: 'Each city must be a string' })
  @arrayTrimTransform
  cities?: string[];

  @IsOptional()
  @IsArray({ message: 'Preferred states must be an array' })
  @ArrayMaxSize(5, { message: 'Maximum 5 preferred states allowed' })
  @IsString({ each: true, message: 'Each state must be a string' })
  @arrayTrimTransform
  states?: string[];

  @IsOptional()
  @IsArray({ message: 'Preferred countries must be an array' })
  @ArrayMaxSize(3, { message: 'Maximum 3 preferred countries allowed' })
  @IsString({ each: true, message: 'Each country must be a string' })
  @arrayTrimTransform
  countries?: string[];

  @IsOptional()
  @IsNumber({}, { message: 'Search radius must be a number' })
  @Min(1, { message: 'Search radius must be at least 1 km' })
  @Max(500, { message: 'Search radius cannot exceed 500 km' })
  @numberTransform
  radiusKm?: number;

  @IsOptional()
  @IsBoolean({ message: 'Willing to relocate must be a boolean' })
  willingToRelocate?: boolean;
}

/**
 * Lifestyle Preference validation class
 */
export class LifestylePreferenceDto {
  @IsOptional()
  @IsEnum(ActivityLevel, { message: 'Activity level must be a valid option' })
  activityLevel?: ActivityLevel;

  @IsOptional()
  @IsArray({ message: 'Diet preferences must be an array' })
  @ArrayMaxSize(5, { message: 'Maximum 5 diet preferences allowed' })
  @IsString({ each: true, message: 'Each diet preference must be a string' })
  @arrayTrimTransform
  dietPreferences?: string[];

  @IsOptional()
  @IsArray({ message: 'Fitness activities must be an array' })
  @ArrayMaxSize(10, { message: 'Maximum 10 fitness activities allowed' })
  @IsString({ each: true, message: 'Each fitness activity must be a string' })
  @arrayTrimTransform
  fitnessActivities?: string[];

  @IsOptional()
  @IsBoolean({ message: 'Social media active must be a boolean' })
  socialMediaActive?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Night owl preference must be a boolean' })
  isNightOwl?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Early riser preference must be a boolean' })
  isEarlyRiser?: boolean;
}

// ============================================================================
// MAIN DTO CLASS
// ============================================================================

/**
 * Main DTO for updating partner preferences
 * Following your established UserProfile DTO patterns
 */
export class UpdatePartnerPreferencesRequestDto {
  // Basic Demographics
  @IsOptional()
  @IsEnum(GenderPreference, { message: 'Gender preference must be Both, Male, or Female' })
  genderPreference?: GenderPreference;

  @IsOptional()
  @IsNumber({}, { message: 'Minimum age must be a number' })
  @Min(18, { message: 'Minimum age cannot be less than 18' })
  @Max(100, { message: 'Minimum age cannot exceed 100' })
  @numberTransform
  minAge?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Maximum age must be a number' })
  @Min(18, { message: 'Maximum age cannot be less than 18' })
  @Max(100, { message: 'Maximum age cannot exceed 100' })
  @numberTransform
  maxAge?: number;

  // Physical Preferences
  @IsOptional()
  @IsNumber({}, { message: 'Minimum height must be a number' })
  @Min(100, { message: 'Minimum height cannot be less than 100 cm' })
  @Max(250, { message: 'Minimum height cannot exceed 250 cm' })
  @numberTransform
  minHeight?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Maximum height must be a number' })
  @Min(100, { message: 'Maximum height cannot be less than 100 cm' })
  @Max(250, { message: 'Maximum height cannot exceed 250 cm' })
  @numberTransform
  maxHeight?: number;

  // Cultural & Religious Preferences
  @IsOptional()
  @IsString({ message: 'Religion must be a string' })
  @MaxLength(50, { message: 'Religion cannot exceed 50 characters' })
  @trimTransform
  religion?: string;

  @IsOptional()
  @IsArray({ message: 'Education levels must be an array' })
  @ArrayMaxSize(6, { message: 'Maximum 6 education levels allowed' })
  @IsEnum(EducationLevel, { 
    each: true, 
    message: 'Each education level must be a valid option' 
  })
  educationLevel?: EducationLevel[];

  @IsOptional()
  @IsArray({ message: 'Professions must be an array' })
  @ArrayMaxSize(10, { message: 'Maximum 10 professions allowed' })
  @IsString({ each: true, message: 'Each profession must be a string' })
  @arrayTrimTransform
  profession?: string[];

  // Financial Preferences
  @IsOptional()
  @IsString({ message: 'Minimum income must be a string' })
  @trimTransform
  minIncome?: string;

  @IsOptional()
  @IsString({ message: 'Maximum income must be a string' })
  @trimTransform
  maxIncome?: string;

  @IsOptional()
  @IsString({ message: 'Currency must be a string' })
  @MinLength(3, { message: 'Currency code must be exactly 3 characters' })
  @MaxLength(3, { message: 'Currency code must be exactly 3 characters' })
  @currencyTransform
  currency?: string;

  // Location Preferences
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationPreferenceDto)
  locationPreference?: LocationPreferenceDto;

  @IsOptional()
  @IsNumber({}, { message: 'Location preference radius must be a number' })
  @Min(1, { message: 'Location radius must be at least 1 km' })
  @Max(500, { message: 'Location radius cannot exceed 500 km' })
  @numberTransform
  locationPreferenceRadius?: number;

  // Lifestyle Preferences
  @IsOptional()
  @IsEnum(SmokingPreference, { message: 'Smoking preference must be No, Yes, or Sometimes' })
  smokingPreference?: SmokingPreference;

  @IsOptional()
  @IsEnum(DrinkingPreference, { message: 'Drinking preference must be No, Yes, or Sometimes' })
  drinkingPreference?: DrinkingPreference;

  @IsOptional()
  @IsEnum(MaritalStatus, { message: 'Marital status must be Single, Divorced, or Widowed' })
  maritalStatus?: MaritalStatus;

  @IsOptional()
  @IsEnum(ChildrenPreference, { message: 'Children preference must be a valid option' })
  childrenPreference?: ChildrenPreference;

  @IsOptional()
  @IsString({ message: 'Religion preference must be a string' })
  @MaxLength(50, { message: 'Religion preference cannot exceed 50 characters' })
  @trimTransform
  religionPreference?: string;

  @IsOptional()
  @IsString({ message: 'Ethnicity preference must be a string' })
  @MaxLength(50, { message: 'Ethnicity preference cannot exceed 50 characters' })
  @trimTransform
  ethnicityPreference?: string;

  @IsOptional()
  @IsString({ message: 'Caste preference must be a string' })
  @MaxLength(50, { message: 'Caste preference cannot exceed 50 characters' })
  @trimTransform
  castePreference?: string;

  // Detailed Preferences
  @IsOptional()
  @IsString({ message: 'Partner description must be a string' })
  @MaxLength(1000, { message: 'Partner description cannot exceed 1000 characters' })
  @trimTransform
  partnerDescription?: string;

  @IsOptional()
  @IsArray({ message: 'Hobbies must be an array' })
  @ArrayMaxSize(15, { message: 'Maximum 15 hobbies allowed' })
  @IsString({ each: true, message: 'Each hobby must be a string' })
  @arrayTrimTransform
  hobbies?: string[];

  @IsOptional()
  @IsArray({ message: 'Interests must be an array' })
  @ArrayMaxSize(20, { message: 'Maximum 20 interests allowed' })
  @IsString({ each: true, message: 'Each interest must be a string' })
  @arrayTrimTransform
  interests?: string[];

  @IsOptional()
  @IsArray({ message: 'Books reading must be an array' })
  @ArrayMaxSize(10, { message: 'Maximum 10 book genres allowed' })
  @IsString({ each: true, message: 'Each book genre must be a string' })
  @arrayTrimTransform
  booksReading?: string[];

  @IsOptional()
  @IsArray({ message: 'Music preferences must be an array' })
  @ArrayMaxSize(15, { message: 'Maximum 15 music genres allowed' })
  @IsString({ each: true, message: 'Each music genre must be a string' })
  @arrayTrimTransform
  music?: string[];

  @IsOptional()
  @IsArray({ message: 'Movie preferences must be an array' })
  @ArrayMaxSize(15, { message: 'Maximum 15 movie genres allowed' })
  @IsString({ each: true, message: 'Each movie genre must be a string' })
  @arrayTrimTransform
  movies?: string[];

  @IsOptional()
  @IsArray({ message: 'Travel preferences must be an array' })
  @ArrayMaxSize(10, { message: 'Maximum 10 travel preferences allowed' })
  @IsString({ each: true, message: 'Each travel preference must be a string' })
  @arrayTrimTransform
  travel?: string[];

  @IsOptional()
  @IsArray({ message: 'Sports preferences must be an array' })
  @ArrayMaxSize(15, { message: 'Maximum 15 sports allowed' })
  @IsString({ each: true, message: 'Each sport must be a string' })
  @arrayTrimTransform
  sports?: string[];

  @IsOptional()
  @IsArray({ message: 'Personality traits must be an array' })
  @ArrayMaxSize(10, { message: 'Maximum 10 personality traits allowed' })
  @IsString({ each: true, message: 'Each personality trait must be a string' })
  @arrayTrimTransform
  personalityTraits?: string[];

  @IsOptional()
  @IsEnum(RelationshipGoal, { message: 'Relationship goals must be a valid option' })
  relationshipGoals?: RelationshipGoal;

  @IsOptional()
  @ValidateNested()
  @Type(() => LifestylePreferenceDto)
  lifestylePreference?: LifestylePreferenceDto;

  @IsOptional()
  @IsString({ message: 'What other person should know must be a string' })
  @MaxLength(500, { message: 'Description cannot exceed 500 characters' })
  @trimTransform
  whatOtherPersonShouldKnow?: string;

  @IsOptional()
  @IsEnum(ActivityLevel, { message: 'Activity level must be a valid option' })
  activityLevel?: ActivityLevel;

  @IsOptional()
  @IsEnum(PetPreference, { message: 'Pet preference must be a valid option' })
  petPreference?: PetPreference;

  // Compatibility Score Weights (Advanced users)
  @IsOptional()
  @IsNumber({}, { message: 'Religion compatibility score must be a number' })
  @Min(0, { message: 'Compatibility score cannot be negative' })
  @Max(100, { message: 'Compatibility score cannot exceed 100' })
  @numberTransform
  religionCompatibilityScore?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Income compatibility score must be a number' })
  @Min(0, { message: 'Compatibility score cannot be negative' })
  @Max(100, { message: 'Compatibility score cannot exceed 100' })
  @numberTransform
  incomeCompatibilityScore?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Education compatibility score must be a number' })
  @Min(0, { message: 'Compatibility score cannot be negative' })
  @Max(100, { message: 'Compatibility score cannot exceed 100' })
  @numberTransform
  educationCompatibilityScore?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Appearance compatibility score must be a number' })
  @Min(0, { message: 'Compatibility score cannot be negative' })
  @Max(100, { message: 'Compatibility score cannot exceed 100' })
  @numberTransform
  appearanceCompatibilityScore?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Personality compatibility score must be a number' })
  @Min(0, { message: 'Compatibility score cannot be negative' })
  @Max(100, { message: 'Compatibility score cannot exceed 100' })
  @numberTransform
  personalityCompatibilityScore?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Values compatibility score must be a number' })
  @Min(0, { message: 'Compatibility score cannot be negative' })
  @Max(100, { message: 'Compatibility score cannot exceed 100' })
  @numberTransform
  valuesCompatibilityScore?: number;
}

// ============================================================================
// VALIDATION MIDDLEWARE FACTORY (Following your established patterns)
// ============================================================================

/**
 * Validation middleware factory for DTOs
 * Following your UserProfile validation patterns
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
            message: 'Partner preferences validation failed',
            code: 'PREFERENCES_VALIDATION_ERROR',
            details: formattedErrors,
            timestamp: new Date().toISOString(),
            requestId: (req as any).id
          }
        });
        return;
      }

      // Apply business rule validations
      const businessValidationErrors = validateBusinessRules(dto as UpdatePartnerPreferencesRequestDto);
      if (businessValidationErrors.length > 0) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Partner preferences business rule validation failed',
            code: 'PREFERENCES_BUSINESS_VALIDATION_ERROR',
            details: businessValidationErrors,
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
 * Business rules validation (following your established patterns)
 */
function validateBusinessRules(dto: UpdatePartnerPreferencesRequestDto): any[] {
  const errors: any[] = [];

  // Age range validation
  if (dto.minAge && dto.maxAge && dto.minAge > dto.maxAge) {
    errors.push({
      field: 'ageRange',
      message: 'Minimum age cannot be greater than maximum age',
      value: { minAge: dto.minAge, maxAge: dto.maxAge }
    });
  }

  // Height range validation
  if (dto.minHeight && dto.maxHeight && dto.minHeight > dto.maxHeight) {
    errors.push({
      field: 'heightRange',
      message: 'Minimum height cannot be greater than maximum height',
      value: { minHeight: dto.minHeight, maxHeight: dto.maxHeight }
    });
  }

  // Income range validation
  if (dto.minIncome && dto.maxIncome) {
    const minIncomeNum = parseFloat(dto.minIncome.replace(/[^0-9.]/g, ''));
    const maxIncomeNum = parseFloat(dto.maxIncome.replace(/[^0-9.]/g, ''));
    
    if (!isNaN(minIncomeNum) && !isNaN(maxIncomeNum) && minIncomeNum > maxIncomeNum) {
      errors.push({
        field: 'incomeRange',
        message: 'Minimum income cannot be greater than maximum income',
        value: { minIncome: dto.minIncome, maxIncome: dto.maxIncome }
      });
    }
  }

  // Location radius validation with location preference
  if (dto.locationPreferenceRadius && !dto.locationPreference?.cities?.length) {
    errors.push({
      field: 'locationPreferenceRadius',
      message: 'Location radius requires at least one preferred city',
      value: dto.locationPreferenceRadius
    });
  }

  // Lifestyle consistency validation
  if (dto.lifestylePreference?.isNightOwl && dto.lifestylePreference?.isEarlyRiser) {
    errors.push({
      field: 'lifestylePreference',
      message: 'Cannot be both night owl and early riser',
      value: { isNightOwl: true, isEarlyRiser: true }
    });
  }

  return errors;
}

/**
 * Format validation errors for client response
 * Following your established error formatting patterns
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

// Export validation middleware for the DTO
export const validateUpdatePartnerPreferences = validateDto(UpdatePartnerPreferencesRequestDto);

/**
 * Additional validation utilities following your established patterns
 */
export class PartnerPreferencesValidationUtils {
  /**
   * Validate age range consistency
   */
  static validateAgeRange(minAge?: number, maxAge?: number): { isValid: boolean; error?: string } {
    if (!minAge && !maxAge) return { isValid: true };
    if (!minAge || !maxAge) return { isValid: true };
    
    if (minAge < 18 || maxAge > 100) {
      return { isValid: false, error: 'Age range must be between 18 and 100' };
    }
    
    if (minAge > maxAge) {
      return { isValid: false, error: 'Minimum age cannot be greater than maximum age' };
    }
    
    const ageDifference = maxAge - minAge;
    if (ageDifference > 50) {
      return { isValid: false, error: 'Age range cannot exceed 50 years' };
    }
    
    return { isValid: true };
  }

  /**
   * Validate income format
   */
  static validateIncomeFormat(income: string): { isValid: boolean; parsedValue?: number; error?: string } {
    if (!income) return { isValid: true };
    
    // Remove currency symbols and commas
    const cleanIncome = income.replace(/[₹$,\s]/g, '');
    const numericIncome = parseFloat(cleanIncome);
    
    if (isNaN(numericIncome)) {
      return { isValid: false, error: 'Income must be a valid number' };
    }
    
    if (numericIncome < 0) {
      return { isValid: false, error: 'Income cannot be negative' };
    }
    
    if (numericIncome > 10000000) { // 1 crore limit
      return { isValid: false, error: 'Income value seems unrealistic' };
    }
    
    return { isValid: true, parsedValue: numericIncome };
  }

  /**
   * Validate preferences completeness for better matching
   */
  static calculatePreferencesCompleteness(preferences: UpdatePartnerPreferencesRequestDto): {
    completionPercentage: number;
    missingCriticalFields: string[];
    suggestions: string[];
  } {
    const criticalFields = [
      'genderPreference', 'minAge', 'maxAge', 'locationPreference',
      'educationLevel', 'relationshipGoals'
    ];
    
    const optionalFields = [
      'minHeight', 'maxHeight', 'religion', 'smokingPreference',
      'drinkingPreference', 'hobbies', 'interests'
    ];
    
    const allFields = [...criticalFields, ...optionalFields];
    const filledFields = allFields.filter(field => {
      const value = (preferences as any)[field];
      return value !== null && value !== undefined && value !== '';
    });
    
    const missingCriticalFields = criticalFields.filter(field => {
      const value = (preferences as any)[field];
      return value === null || value === undefined || value === '';
    });
    
    const completionPercentage = Math.round((filledFields.length / allFields.length) * 100);
    
    const suggestions: string[] = [];
    if (missingCriticalFields.includes('genderPreference')) {
      suggestions.push('Specify your gender preference to improve matching accuracy');
    }
    if (missingCriticalFields.includes('minAge') || missingCriticalFields.includes('maxAge')) {
      suggestions.push('Set an age range to find age-appropriate matches');
    }
    if (missingCriticalFields.includes('locationPreference')) {
      suggestions.push('Add location preferences to find nearby matches');
    }
    
    return { completionPercentage, missingCriticalFields, suggestions };
  }
}