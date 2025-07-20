// apps/frontend/src/utils/validation.utils.ts

import { REGEX_PATTERNS, CHAR_LIMITS, AGE_LIMITS } from '../constants';

/**
 * Email validation utility
 */
export const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) {
    return 'Email is required';
  }
  
  if (email.length > CHAR_LIMITS.EMAIL_MAX) {
    return `Email must not exceed ${CHAR_LIMITS.EMAIL_MAX} characters`;
  }
  
  if (!REGEX_PATTERNS.EMAIL.test(email)) {
    return 'Please provide a valid email address';
  }
  
  return undefined;
};

/**
 * Password validation utility
 */
export const validatePassword = (password: string): string | undefined => {
  if (!password) {
    return 'Password is required';
  }
  
  if (password.length < CHAR_LIMITS.PASSWORD_MIN) {
    return `Password must be at least ${CHAR_LIMITS.PASSWORD_MIN} characters long`;
  }
  
  if (password.length > CHAR_LIMITS.PASSWORD_MAX) {
    return `Password must not exceed ${CHAR_LIMITS.PASSWORD_MAX} characters`;
  }
  
  return undefined;
};

/**
 * Strong password validation (includes complexity requirements)
 */
export const validateStrongPassword = (password: string): string | undefined => {
  const basicError = validatePassword(password);
  if (basicError) return basicError;
  
  if (!REGEX_PATTERNS.PASSWORD_STRONG.test(password)) {
    return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
  }
  
  return undefined;
};

/**
 * Phone number validation
 */
export const validatePhone = (phone: string): string | undefined => {
  if (!phone.trim()) {
    return 'Phone number is required';
  }
  
  if (!REGEX_PATTERNS.PHONE.test(phone)) {
    return 'Please provide a valid 10-digit phone number';
  }
  
  return undefined;
};

/**
 * Name validation
 */
export const validateName = (name: string, fieldName: string = 'Name'): string | undefined => {
  if (!name.trim()) {
    return `${fieldName} is required`;
  }
  
  if (name.length < CHAR_LIMITS.NAME_MIN) {
    return `${fieldName} must be at least ${CHAR_LIMITS.NAME_MIN} characters`;
  }
  
  if (name.length > CHAR_LIMITS.NAME_MAX) {
    return `${fieldName} must not exceed ${CHAR_LIMITS.NAME_MAX} characters`;
  }
  
  if (!REGEX_PATTERNS.NAME.test(name)) {
    return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`;
  }
  
  return undefined;
};

/**
 * Age validation
 */
export const validateAge = (age: number): string | undefined => {
  if (age < AGE_LIMITS.MIN) {
    return `You must be at least ${AGE_LIMITS.MIN} years old`;
  }
  
  if (age > AGE_LIMITS.MAX) {
    return `Age must not exceed ${AGE_LIMITS.MAX} years`;
  }
  
  return undefined;
};

/**
 * OTP validation
 */
export const validateOTP = (otp: string): string | undefined => {
  if (!otp.trim()) {
    return 'OTP is required';
  }
  
  if (!REGEX_PATTERNS.OTP.test(otp)) {
    return 'OTP must be a 6-digit number';
  }
  
  return undefined;
};

/**
 * URL validation
 */
export const validateURL = (url: string): string | undefined => {
  if (!url.trim()) {
    return 'URL is required';
  }
  
  if (!REGEX_PATTERNS.URL.test(url)) {
    return 'Please provide a valid URL';
  }
  
  return undefined;
};

/**
 * File size validation
 */
export const validateFileSize = (file: File, maxSize: number): string | undefined => {
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
    return `File size must not exceed ${maxSizeMB}MB`;
  }
  
  return undefined;
};

/**
 * File type validation
 */
export const validateFileType = (file: File, allowedTypes: string[]): string | undefined => {
  if (!allowedTypes.includes(file.type)) {
    return `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`;
  }
  
  return undefined;
};

/**
 * Form validation helper
 */
export interface ValidationRule<T> {
  field: keyof T;
  validate: (value: any) => string | undefined;
}

export const validateForm = <T extends Record<string, any>>(
  data: T,
  rules: ValidationRule<T>[]
): Partial<Record<keyof T, string>> => {
  const errors: Partial<Record<keyof T, string>> = {};
  
  rules.forEach(rule => {
    const error = rule.validate(data[rule.field]);
    if (error) {
      errors[rule.field] = error;
    }
  });
  
  return errors;
};

/**
 * Check if form has errors
 */
export const hasFormErrors = (errors: Record<string, any>): boolean => {
  return Object.values(errors).some(error => error !== undefined && error !== '');
};