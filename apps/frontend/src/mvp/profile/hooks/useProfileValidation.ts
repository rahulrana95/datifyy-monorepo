import { useState, useCallback, useMemo } from 'react';
import { DatifyyUsersInformation } from '../../../service/userService/UserProfileTypes';

export interface ValidationError {
  field: string;
  message: string;
  type: 'error' | 'warning';
}

export interface UseProfileValidationReturn {
  errors: ValidationError[];
  validateField: (field: keyof DatifyyUsersInformation, value: any) => ValidationError | null;
  validateSection: (data: Partial<DatifyyUsersInformation>) => ValidationError[];
  getFieldError: (field: string) => ValidationError | undefined;
  clearErrors: (fields?: string[]) => void;
  isValid: boolean;
}

/**
 * Custom hook for real-time profile validation
 */
export const useProfileValidation = (): UseProfileValidationReturn => {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  /**
   * Validate a single field
   */
  const validateField = useCallback((
    field: keyof DatifyyUsersInformation, 
    value: any
  ): ValidationError | null => {
    
    // Required field validation
    const requiredFields: (keyof DatifyyUsersInformation)[] = [
      'firstName', 'lastName', 'gender', 'dob', 'currentCity', 'lookingFor', 'officialEmail'
    ];

    if (requiredFields.includes(field)) {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return {
          field: field as string,
          message: `${getFieldDisplayName(field)} is required`,
          type: 'error'
        };
      }
    }

    // Field-specific validation
    switch (field) {
      case 'firstName':
      case 'lastName':
        if (value && value.length < 2) {
          return {
            field,
            message: `${getFieldDisplayName(field)} must be at least 2 characters`,
            type: 'error'
          };
        }
        if (value && value.length > 50) {
          return {
            field,
            message: `${getFieldDisplayName(field)} cannot exceed 50 characters`,
            type: 'error'
          };
        }
        break;

      case 'dob':
        if (value) {
          const age = calculateAge(value);
          if (age < 18) {
            return {
              field,
              message: 'You must be at least 18 years old',
              type: 'error'
            };
          }
          if (age > 100) {
            return {
              field,
              message: 'Please enter a valid date of birth',
              type: 'error'
            };
          }
        }
        break;

      case 'height':
        if (value !== null && value !== undefined) {
          if (value < 100 || value > 250) {
            return {
              field,
              message: 'Height must be between 100-250 cm',
              type: 'error'
            };
          }
        }
        break;

      case 'bio':
        if (value && value.length > 500) {
          return {
            field,
            message: 'Bio cannot exceed 500 characters',
            type: 'error'
          };
        }
        if (value && value.length < 10) {
          return {
            field,
            message: 'Bio should be at least 10 characters for better matches',
            type: 'warning'
          };
        }
        break;

      case 'images':
        if (value && Array.isArray(value)) {
          if (value.length > 6) {
            return {
              field,
              message: 'Maximum 6 images allowed',
              type: 'error'
            };
          }
          if (value.length === 0) {
            return {
              field,
              message: 'Adding photos increases profile views by 300%',
              type: 'warning'
            };
          }
        }
        break;

      case 'officialEmail':
        if (value && !isValidEmail(value)) {
          return {
            field,
            message: 'Please enter a valid email address',
            type: 'error'
          };
        }
        break;

      case 'favInterest':
      case 'causesYouSupport':
      case 'qualityYouValue':
        if (value && Array.isArray(value) && value.length > 10) {
          return {
            field,
            message: 'Maximum 10 items allowed',
            type: 'error'
          };
        }
        break;
    }

    return null;
  }, []);

  /**
   * Validate entire section
   */
  const validateSection = useCallback((data: Partial<DatifyyUsersInformation>): ValidationError[] => {
    const sectionErrors: ValidationError[] = [];

    Object.entries(data).forEach(([key, value]) => {
      const error = validateField(key as keyof DatifyyUsersInformation, value);
      if (error) {
        sectionErrors.push(error);
      }
    });

    // Update global errors state
    setErrors(prev => {
      const fieldsInSection = Object.keys(data);
      const otherErrors = prev.filter(error => !fieldsInSection.includes(error.field));
      return [...otherErrors, ...sectionErrors];
    });

    return sectionErrors;
  }, [validateField]);

  /**
   * Get error for specific field
   */
  const getFieldError = useCallback((field: string): ValidationError | undefined => {
    return errors.find(error => error.field === field);
  }, [errors]);

  /**
   * Clear errors for specific fields or all
   */
  const clearErrors = useCallback((fields?: string[]) => {
    if (fields) {
      setErrors(prev => prev.filter(error => !fields.includes(error.field)));
    } else {
      setErrors([]);
    }
  }, []);

  /**
   * Check if form is valid (no error-type validation issues)
   */
  const isValid = useMemo(() => {
    return !errors.some(error => error.type === 'error');
  }, [errors]);

  return {
    errors,
    validateField,
    validateSection,
    getFieldError,
    clearErrors,
    isValid
  };
};

// Helper functions
function getFieldDisplayName(field: keyof DatifyyUsersInformation): string {
  const displayNames: Record<string, string> = {
    firstName: 'First Name',
    lastName: 'Last Name',
    dob: 'Date of Birth',
    officialEmail: 'Email Address',
    currentCity: 'Current City',
    lookingFor: 'Looking For',
    // Add more as needed
  };
  
  return displayNames[field] || field.charAt(0).toUpperCase() + field.slice(1);
}

function calculateAge(dob: string): number {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}