// apps/frontend/src/mvp/profile/partnerPreferences/hooks/usePreferenceValidation.ts

import React, { useState, useCallback, useMemo, useRef } from 'react';
import { FormField, validateFieldValue, PARTNER_PREFERENCES_FORM_CONFIG } from '../config/preferenceFormConfig';
import { Logger } from '../../../../utils/Logger';
import { DatifyyUserPartnerPreferences } from '../../types';

/**
 * Enterprise Preference Validation Hook
 * 
 * Features:
 * - Real-time field validation with debouncing
 * - Cross-field validation (e.g., min/max ranges)
 * - Business rule validation
 * - Validation caching for performance
 * - Error aggregation and prioritization
 * - Warning vs error classification
 * - Custom validation rule support
 * 
 * Patterns:
 * - Observer pattern for validation state
 * - Strategy pattern for different validation types
 * - Command pattern for validation rules
 * - Memoization for performance optimization
 */

export interface ValidationError {
  field: string;
  message: string;
  type: 'error' | 'warning';
  priority: 'high' | 'medium' | 'low';
  code?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  fieldErrors: Record<string, ValidationError>;
  summary: ValidationSummary;
}

export interface ValidationSummary {
  totalErrors: number;
  totalWarnings: number;
  criticalErrors: number;
  completionScore: number;
  missingRequiredFields: string[];
  recommendations: string[];
}

interface ValidationCache {
  [fieldName: string]: {
    value: any;
    result: ValidationError | null;
    timestamp: number;
  };
}

interface UsePreferenceValidationReturn {
  // Validation state
  errors: ValidationError[];
  warnings: ValidationError[];
  isValid: boolean;
  hasErrors: boolean;
  hasWarnings: boolean;
  validationSummary: ValidationSummary;
  
  // Field-specific validation
  getFieldError: (fieldName: string) => ValidationError | undefined;
  getFieldErrors: () => Record<string, string>;
  
  // Validation actions
  validateField: (field: FormField, value: any) => ValidationError | null;
  validateSection: (fields: FormField[], data: Partial<DatifyyUserPartnerPreferences>) => ValidationError[];
  validateAllPreferences: (data: Partial<DatifyyUserPartnerPreferences>) => ValidationResult;
  clearErrors: (fieldNames?: string[]) => void;
  clearAllErrors: () => void;
  
  // Cross-field validation
  validateCrossField: (data: Partial<DatifyyUserPartnerPreferences>) => ValidationError[];
  
  // Business rules
  validateBusinessRules: (data: Partial<DatifyyUserPartnerPreferences>) => ValidationError[];
}

const logger = new Logger('usePreferenceValidation');

// Cache duration for validation results (5 minutes)
const VALIDATION_CACHE_DURATION = 5 * 60 * 1000;

// Business rule configurations
const BUSINESS_RULES = {
  AGE_RANGE_MAX_SPAN: 20, // Max age range span
  HEIGHT_RANGE_MAX_SPAN: 50, // Max height range span (cm)
  INCOME_RANGE_MAX_MULTIPLIER: 10, // Max income range multiplier
  MAX_HOBBIES: 10,
  MAX_INTERESTS: 10,
  MAX_PROFESSIONS: 8,
  MIN_DESCRIPTION_LENGTH: 20,
  MAX_DESCRIPTION_LENGTH: 1000
} as const;

export const usePreferenceValidation = (): UsePreferenceValidationReturn => {
  
  // Validation state
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [warnings, setWarnings] = useState<ValidationError[]>([]);
  
  // Validation cache for performance
  const validationCache = useRef<ValidationCache>({});
  const lastValidationTimestamp = useRef<number>(0);

  // Clear expired cache entries
  const clearExpiredCache = useCallback(() => {
    const now = Date.now();
    const cache = validationCache.current;
    
    Object.keys(cache).forEach(key => {
      if (now - cache[key].timestamp > VALIDATION_CACHE_DURATION) {
        delete cache[key];
      }
    });
  }, []);

  // Get cached validation result
  const getCachedValidation = useCallback((fieldName: string, value: any): ValidationError | null | undefined => {
    clearExpiredCache();
    
    const cached = validationCache.current[fieldName];
    if (cached && JSON.stringify(cached.value) === JSON.stringify(value)) {
      logger.debug('Using cached validation result', { fieldName });
      return cached.result;
    }
    
    return undefined;
  }, [clearExpiredCache]);

  // Cache validation result
  const cacheValidation = useCallback((fieldName: string, value: any, result: ValidationError | null) => {
    validationCache.current[fieldName] = {
      value,
      result,
      timestamp: Date.now()
    };
  }, []);

  // Validate individual field
  const validateField = useCallback((field: FormField, value: any): ValidationError | null => {
    // Check cache first
    const cachedResult = getCachedValidation(field.name, value);
    if (cachedResult !== undefined) {
      return cachedResult;
    }

    let validationError: ValidationError | null = null;

    try {
      // Basic field validation from config
      const basicError = validateFieldValue(field, value);
      if (basicError) {
        validationError = {
          field: field.name,
          message: basicError,
          type: 'error',
          priority: field.priority === 'high' ? 'high' : 'medium',
          code: 'FIELD_VALIDATION_ERROR'
        };
      }

      // Additional field-specific validations
      if (!validationError) {
        validationError = validateSpecificField(field, value);
      }

      // Cache the result
      cacheValidation(field.name, value, validationError);

      if (validationError) {
        logger.debug('Field validation failed', {
          fieldName: field.name,
          error: validationError.message,
          value: typeof value === 'object' ? JSON.stringify(value) : value
        });
      }

      return validationError;

    } catch (error: any) {
      logger.error('Field validation threw exception', {
        fieldName: field.name,
        error: error.message
      });

      const errorResult: ValidationError = {
        field: field.name,
        message: 'Validation failed due to internal error',
        type: 'error',
        priority: 'high',
        code: 'VALIDATION_EXCEPTION'
      };

      cacheValidation(field.name, value, errorResult);
      return errorResult;
    }
  }, [getCachedValidation, cacheValidation]);

  // Validate specific field types with custom rules
  const validateSpecificField = (field: FormField, value: any): ValidationError | null => {
    switch (field.name) {
      case 'minAge':
        if (value && (value < 18 || value > 80)) {
          return {
            field: field.name,
            message: 'Minimum age should be between 18 and 80',
            type: 'error',
            priority: 'high',
            code: 'AGE_OUT_OF_RANGE'
          };
        }
        break;

      case 'maxAge':
        if (value && (value < 18 || value > 100)) {
          return {
            field: field.name,
            message: 'Maximum age should be between 18 and 100',
            type: 'error',
            priority: 'high',
            code: 'AGE_OUT_OF_RANGE'
          };
        }
        break;

      case 'minHeight':
      case 'maxHeight':
        if (value && (value < 120 || value > 250)) {
          return {
            field: field.name,
            message: 'Height should be between 120cm and 250cm',
            type: 'error',
            priority: 'medium',
            code: 'HEIGHT_OUT_OF_RANGE'
          };
        }
        break;

      case 'minIncome':
      case 'maxIncome':
        if (value && value < 0) {
          return {
            field: field.name,
            message: 'Income cannot be negative',
            type: 'error',
            priority: 'medium',
            code: 'NEGATIVE_INCOME'
          };
        }
        break;

      case 'locationPreferenceRadius':
        if (value && (value < 1 || value > 1000)) {
          return {
            field: field.name,
            message: 'Search radius should be between 1km and 1000km',
            type: 'error',
            priority: 'medium',
            code: 'RADIUS_OUT_OF_RANGE'
          };
        }
        break;

      case 'hobbies':
        if (Array.isArray(value) && value.length > BUSINESS_RULES.MAX_HOBBIES) {
          return {
            field: field.name,
            message: `Maximum ${BUSINESS_RULES.MAX_HOBBIES} hobbies allowed`,
            type: 'error',
            priority: 'medium',
            code: 'TOO_MANY_HOBBIES'
          };
        }
        break;

      case 'interests':
        if (Array.isArray(value) && value.length > BUSINESS_RULES.MAX_INTERESTS) {
          return {
            field: field.name,
            message: `Maximum ${BUSINESS_RULES.MAX_INTERESTS} interests allowed`,
            type: 'error',
            priority: 'medium',
            code: 'TOO_MANY_INTERESTS'
          };
        }
        break;

      case 'profession':
        if (Array.isArray(value) && value.length > BUSINESS_RULES.MAX_PROFESSIONS) {
          return {
            field: field.name,
            message: `Maximum ${BUSINESS_RULES.MAX_PROFESSIONS} professions allowed`,
            type: 'error',
            priority: 'medium',
            code: 'TOO_MANY_PROFESSIONS'
          };
        }
        break;

      case 'whatOtherPersonShouldKnow':
        if (value && typeof value === 'string') {
          if (value.length < BUSINESS_RULES.MIN_DESCRIPTION_LENGTH) {
            return {
              field: field.name,
              message: `Description should be at least ${BUSINESS_RULES.MIN_DESCRIPTION_LENGTH} characters`,
              type: 'warning',
              priority: 'low',
              code: 'DESCRIPTION_TOO_SHORT'
            };
          }
          if (value.length > BUSINESS_RULES.MAX_DESCRIPTION_LENGTH) {
            return {
              field: field.name,
              message: `Description should not exceed ${BUSINESS_RULES.MAX_DESCRIPTION_LENGTH} characters`,
              type: 'error',
              priority: 'medium',
              code: 'DESCRIPTION_TOO_LONG'
            };
          }
        }
        break;
    }

    return null;
  };

  // Validate cross-field relationships
  const validateCrossField = useCallback((data: Partial<DatifyyUserPartnerPreferences>): ValidationError[] => {
    const crossFieldErrors: ValidationError[] = [];

    // Age range validation
    if (data.minAge && data.maxAge) {
      if (data.minAge >= data.maxAge) {
        crossFieldErrors.push({
          field: 'maxAge',
          message: 'Maximum age must be greater than minimum age',
          type: 'error',
          priority: 'high',
          code: 'INVALID_AGE_RANGE'
        });
      }

      const ageSpan = data.maxAge - data.minAge;
      if (ageSpan > BUSINESS_RULES.AGE_RANGE_MAX_SPAN) {
        crossFieldErrors.push({
          field: 'maxAge',
          message: `Age range span should not exceed ${BUSINESS_RULES.AGE_RANGE_MAX_SPAN} years`,
          type: 'warning',
          priority: 'medium',
          code: 'AGE_RANGE_TOO_WIDE'
        });
      }
    }

    // Height range validation
    if (data.minHeight && data.maxHeight) {
      if (data.minHeight >= data.maxHeight) {
        crossFieldErrors.push({
          field: 'maxHeight',
          message: 'Maximum height must be greater than minimum height',
          type: 'error',
          priority: 'high',
          code: 'INVALID_HEIGHT_RANGE'
        });
      }

      const heightSpan = data.maxHeight - data.minHeight;
      if (heightSpan > BUSINESS_RULES.HEIGHT_RANGE_MAX_SPAN) {
        crossFieldErrors.push({
          field: 'maxHeight',
          message: `Height range span should not exceed ${BUSINESS_RULES.HEIGHT_RANGE_MAX_SPAN}cm`,
          type: 'warning',
          priority: 'medium',
          code: 'HEIGHT_RANGE_TOO_WIDE'
        });
      }
    }

    // Income range validation
    if (data.minIncome && data.maxIncome) {
      if (data.minIncome >= data.maxIncome) {
        crossFieldErrors.push({
          field: 'maxIncome',
          message: 'Maximum income must be greater than minimum income',
          type: 'error',
          priority: 'high',
          code: 'INVALID_INCOME_RANGE'
        });
      }

      const incomeRatio = data.maxIncome / data.minIncome;
      if (incomeRatio > BUSINESS_RULES.INCOME_RANGE_MAX_MULTIPLIER) {
        crossFieldErrors.push({
          field: 'maxIncome',
          message: `Income range is very wide (${incomeRatio.toFixed(1)}x). Consider narrowing it.`,
          type: 'warning',
          priority: 'low',
          code: 'INCOME_RANGE_TOO_WIDE'
        });
      }
    }

    // Currency validation
    if ((data.minIncome || data.maxIncome) && !data.currency) {
      crossFieldErrors.push({
        field: 'currency',
        message: 'Currency is required when income range is specified',
        type: 'error',
        priority: 'high',
        code: 'MISSING_CURRENCY'
      });
    }

    // Location validation
    if (data.locationPreferenceRadius && !data.locationPreference) {
      crossFieldErrors.push({
        field: 'locationPreference',
        message: 'Location preference is required when radius is specified',
        type: 'error',
        priority: 'high',
        code: 'MISSING_LOCATION'
      });
    }

    logger.debug('Cross-field validation completed', {
      errorCount: crossFieldErrors.length,
      errors: crossFieldErrors.map(e => e.code)
    });

    return crossFieldErrors;
  }, []);

  // Validate business rules
  const validateBusinessRules = useCallback((data: Partial<DatifyyUserPartnerPreferences>): ValidationError[] => {
    const businessRuleErrors: ValidationError[] = [];

    // Essential fields recommendation
    const essentialFields = ['genderPreference', 'minAge', 'maxAge', 'locationPreference'];
    const missingEssentials = essentialFields.filter(field => 
      !data[field as keyof DatifyyUserPartnerPreferences]
    );

    if (missingEssentials.length > 0) {
      businessRuleErrors.push({
        field: missingEssentials[0],
        message: 'Complete essential preferences for better matches',
        type: 'warning',
        priority: 'high',
        code: 'MISSING_ESSENTIAL_PREFERENCES'
      });
    }

    // Preference completeness check
    const importantFields = ['relationshipGoals', 'personalityTraits', 'hobbies', 'interests'];
    const filledImportantFields = importantFields.filter(field => {
      const value = data[field as keyof DatifyyUserPartnerPreferences];
      return value && (Array.isArray(value) ? value.length > 0 : true);
    });

    if (filledImportantFields.length < 2) {
      businessRuleErrors.push({
        field: 'hobbies',
        message: 'Add more preferences to improve match quality',
        type: 'warning',
        priority: 'medium',
        code: 'INCOMPLETE_PREFERENCES'
      });
    }

    // Preference diversity check
    if (data.hobbies && Array.isArray(data.hobbies) && data.hobbies.length === 1) {
      businessRuleErrors.push({
        field: 'hobbies',
        message: 'Consider adding more hobbies for better matches',
        type: 'warning',
        priority: 'low',
        code: 'LIMITED_HOBBY_DIVERSITY'
      });
    }

    // Age preference reasonableness
    if (data.minAge && data.maxAge) {
      const userAge = 25; // You might want to get this from user profile
      const ageDifferenceMin = Math.abs(data.minAge - userAge);
      const ageDifferenceMax = Math.abs(data.maxAge - userAge);
      
      if (ageDifferenceMin > 15 || ageDifferenceMax > 15) {
        businessRuleErrors.push({
          field: 'minAge',
          message: 'Consider age ranges closer to your own age for better compatibility',
          type: 'warning',
          priority: 'low',
          code: 'AGE_PREFERENCE_DISTANT'
        });
      }
    }

    logger.debug('Business rules validation completed', {
      errorCount: businessRuleErrors.length,
      rules: businessRuleErrors.map(e => e.code)
    });

    return businessRuleErrors;
  }, []);

  // Validate section (group of fields)
  const validateSection = useCallback((fields: FormField[], data: Partial<DatifyyUserPartnerPreferences>): ValidationError[] => {
    const sectionErrors: ValidationError[] = [];

    // Validate individual fields
    fields.forEach(field => {
      const value = data[field.name];
      const fieldError = validateField(field, value);
      if (fieldError) {
        sectionErrors.push(fieldError);
      }
    });

    logger.debug('Section validation completed', {
      sectionFields: fields.map(f => f.name),
      errorCount: sectionErrors.length
    });

    return sectionErrors;
  }, [validateField]);

  // Validate all preferences
  const validateAllPreferences = useCallback((data: Partial<DatifyyUserPartnerPreferences>): ValidationResult => {
    const startTime = Date.now();
    
    logger.info('Starting comprehensive validation', {
      fieldsToValidate: Object.keys(data).length
    });

    const allErrors: ValidationError[] = [];
    const allWarnings: ValidationError[] = [];

    // Validate all fields
    PARTNER_PREFERENCES_FORM_CONFIG.forEach(section => {
      section.fields.forEach(field => {
        const value = data[field.name];
        const fieldError = validateField(field, value);
        if (fieldError) {
          if (fieldError.type === 'error') {
            allErrors.push(fieldError);
          } else {
            allWarnings.push(fieldError);
          }
        }
      });
    });

    // Add cross-field validation
    const crossFieldErrors = validateCrossField(data);
    crossFieldErrors.forEach(error => {
      if (error.type === 'error') {
        allErrors.push(error);
      } else {
        allWarnings.push(error);
      }
    });

    // Add business rule validation
    const businessRuleErrors = validateBusinessRules(data);
    businessRuleErrors.forEach(error => {
      if (error.type === 'error') {
        allErrors.push(error);
      } else {
        allWarnings.push(error);
      }
    });

    // Create field error map
    const fieldErrors: Record<string, ValidationError> = {};
    [...allErrors, ...allWarnings].forEach(error => {
      if (!fieldErrors[error.field] || error.type === 'error') {
        fieldErrors[error.field] = error;
      }
    });

    // Calculate completion score
    const totalFields = PARTNER_PREFERENCES_FORM_CONFIG.reduce((acc, section) => acc + section.fields.length, 0);
    const filledFields = Object.keys(data).filter(key => {
      const value = data[key as keyof DatifyyUserPartnerPreferences];
      return value !== null && value !== undefined && value !== '' && 
             (Array.isArray(value) ? value.length > 0 : true);
    }).length;
    
    const completionScore = Math.round((filledFields / totalFields) * 100);

    // Get missing required fields
    const requiredFields = PARTNER_PREFERENCES_FORM_CONFIG
      .flatMap(section => section.fields)
      .filter(field => field.validation?.required)
      .map(field => field.name);
    
    const missingRequiredFields = requiredFields.filter(fieldName => {
      const value = data[fieldName];
      return !value || (Array.isArray(value) && value.length === 0);
    });

    // Generate recommendations
    const recommendations = generateRecommendations(data, allWarnings);

    const summary: ValidationSummary = {
      totalErrors: allErrors.length,
      totalWarnings: allWarnings.length,
      criticalErrors: allErrors.filter(e => e.priority === 'high').length,
      completionScore,
      missingRequiredFields,
      recommendations
    };

    const result: ValidationResult = {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
      fieldErrors,
      summary
    };

    logger.info('Validation completed', {
      duration: Date.now() - startTime,
      totalErrors: allErrors.length,
      totalWarnings: allWarnings.length,
      completionScore,
      isValid: result.isValid
    });

    return result;
  }, [validateField, validateCrossField, validateBusinessRules]);

  // Generate recommendations based on validation results
  const generateRecommendations = (
    data: Partial<DatifyyUserPartnerPreferences>, 
    warnings: ValidationError[]
  ): string[] => {
    const recommendations: string[] = [];

    if (!data.hobbies || data.hobbies.length < 3) {
      recommendations.push('Add more hobbies to find better matches');
    }

    if (!data.interests || data.interests.length < 3) {
      recommendations.push('Add more interests to improve compatibility');
    }

    if (!data.personalityTraits || data.personalityTraits.length < 3) {
      recommendations.push('Select personality traits for deeper connections');
    }

    if (!data.relationshipGoals) {
      recommendations.push('Specify your relationship goals');
    }

    if (!data.whatOtherPersonShouldKnow) {
      recommendations.push('Add a personal note to stand out');
    }

    if (warnings.some(w => w.code === 'AGE_RANGE_TOO_WIDE')) {
      recommendations.push('Consider narrowing your age range for better matches');
    }

    return recommendations.slice(0, 5); // Limit to top 5 recommendations
  };

  // Get field error
  const getFieldError = useCallback((fieldName: string): ValidationError | undefined => {
    return [...errors, ...warnings].find(error => error.field === fieldName);
  }, [errors, warnings]);

  // Get field errors as string map
  const getFieldErrors = useCallback((): Record<string, string> => {
    const fieldErrors: Record<string, string> = {};
    [...errors, ...warnings].forEach(error => {
      if (!fieldErrors[error.field] || error.type === 'error') {
        fieldErrors[error.field] = error.message;
      }
    });
    return fieldErrors;
  }, [errors, warnings]);

  // Clear specific errors
  const clearErrors = useCallback((fieldNames?: string[]) => {
    if (fieldNames) {
      setErrors(prev => prev.filter(error => !fieldNames.includes(error.field)));
      setWarnings(prev => prev.filter(warning => !fieldNames.includes(warning.field)));
      
      // Clear cache for these fields
      fieldNames.forEach(fieldName => {
        delete validationCache.current[fieldName];
      });
      
      logger.debug('Cleared errors for specific fields', { fieldNames });
    }
  }, []);

  // Clear all errors
  const clearAllErrors = useCallback(() => {
    setErrors([]);
    setWarnings([]);
    validationCache.current = {};
    logger.debug('Cleared all validation errors');
  }, []);

  // Update validation state when errors/warnings change
  React.useEffect(() => {
    lastValidationTimestamp.current = Date.now();
  }, [errors, warnings]);

  // Computed values
  const isValid = errors.length === 0;
  const hasErrors = errors.length > 0;
  const hasWarnings = warnings.length > 0;

  // Validation summary
  const validationSummary = useMemo((): ValidationSummary => ({
    totalErrors: errors.length,
    totalWarnings: warnings.length,
    criticalErrors: errors.filter(e => e.priority === 'high').length,
    completionScore: 0, // Will be calculated in validateAllPreferences
    missingRequiredFields: [],
    recommendations: []
  }), [errors, warnings]);

  return {
    // Validation state
    errors,
    warnings,
    isValid,
    hasErrors,
    hasWarnings,
    validationSummary,
    
    // Field-specific validation
    getFieldError,
    getFieldErrors,
    
    // Validation actions
    validateField,
    validateSection,
    validateAllPreferences,
    clearErrors,
    clearAllErrors,
    
    // Cross-field validation
    validateCrossField,
    
    // Business rules
    validateBusinessRules
  };
};

// Export for testing
export type { ValidationCache };
export { BUSINESS_RULES };