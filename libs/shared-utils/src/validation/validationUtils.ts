// libs/shared-utils/src/validation/validationUtils.ts
/**
 * Shared Validation Utilities
 * Used by both frontend and backend for consistent validation
 */

import { ValidationResult } from '@datifyy/shared-types';

/**
 * Email validation
 */
export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!email.trim()) {
    errors.push('Email is required');
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.push('Please enter a valid email address');
  } else if (email.length > 254) {
    errors.push('Email address is too long');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Password validation
 */
export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('Password is required');
  } else {
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (password.length > 128) {
      errors.push('Password must be less than 128 characters');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Name validation
 */
export const validateName = (name: string, fieldName: string = 'Name'): ValidationResult => {
  const errors: string[] = [];
  
  if (!name.trim()) {
    errors.push(`${fieldName} is required`);
  } else if (name.trim().length < 2) {
    errors.push(`${fieldName} must be at least 2 characters long`);
  } else if (name.trim().length > 50) {
    errors.push(`${fieldName} must be less than 50 characters`);
  } else if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) {
    errors.push(`${fieldName} can only contain letters, spaces, hyphens, and apostrophes`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Age validation for dating app
 */
export const validateAge = (age: number): ValidationResult => {
  const errors: string[] = [];
  
  if (!age) {
    errors.push('Age is required');
  } else if (age < 18) {
    errors.push('You must be at least 18 years old');
  } else if (age > 100) {
    errors.push('Please enter a valid age');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Height validation (in cm)
 */
export const validateHeight = (height: number): ValidationResult => {
  const errors: string[] = [];
  
  if (height && (height < 100 || height > 250)) {
    errors.push('Height must be between 100-250 cm');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Bio validation
 */
export const validateBio = (bio: string): ValidationResult => {
  const errors: string[] = [];
  
  if (bio && bio.length > 500) {
    errors.push('Bio cannot exceed 500 characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Phone number validation
 */
export const validatePhoneNumber = (phone: string): ValidationResult => {
  const errors: string[] = [];
  
  if (phone) {
    // Remove all non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, '');
    
    if (digitsOnly.length < 10) {
      errors.push('Phone number must be at least 10 digits');
    } else if (digitsOnly.length > 15) {
      errors.push('Phone number cannot exceed 15 digits');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * URL validation
 */
export const validateUrl = (url: string): ValidationResult => {
  const errors: string[] = [];
  
  if (url) {
    try {
      new URL(url);
    } catch {
      errors.push('Please enter a valid URL');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Verify code validation (for email/SMS verification)
 */
export const validateVerificationCode = (code: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!code.trim()) {
    errors.push('Verification code is required');
  } else if (!/^\d{4,8}$/.test(code.trim())) {
    errors.push('Verification code must be 4-8 digits');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Combine multiple validation results
 */
export const combineValidationResults = (...results: ValidationResult[]): ValidationResult => {
  const allErrors = results.flatMap(result => result.errors);
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
};

/**
 * Dating app specific validations
 */

/**
 * Validate interests array
 */
export const validateInterests = (interests: string[]): ValidationResult => {
  const errors: string[] = [];
  
  if (interests && interests.length > 10) {
    errors.push('You can select up to 10 interests');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate age range for partner preferences
 */
export const validateAgeRange = (minAge: number, maxAge: number): ValidationResult => {
  const errors: string[] = [];
  
  if (minAge && maxAge) {
    if (minAge > maxAge) {
      errors.push('Minimum age cannot be greater than maximum age');
    }
    if (minAge < 18) {
      errors.push('Minimum age must be at least 18');
    }
    if (maxAge > 100) {
      errors.push('Maximum age cannot exceed 100');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate income range
 */
export const validateIncomeRange = (minIncome: number, maxIncome: number): ValidationResult => {
  const errors: string[] = [];
  
  if (minIncome && maxIncome) {
    if (minIncome > maxIncome) {
      errors.push('Minimum income cannot be greater than maximum income');
    }
    if (minIncome < 0 || maxIncome < 0) {
      errors.push('Income values cannot be negative');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};