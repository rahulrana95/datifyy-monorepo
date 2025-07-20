// apps/frontend/src/constants/validation.constants.ts

/**
 * Validation constants for forms and inputs
 */

// Character limits
export const CHAR_LIMITS = {
  EMAIL_MAX: 255,
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 128,
  NAME_MIN: 2,
  NAME_MAX: 50,
  BIO_MAX: 500,
  MESSAGE_MAX: 1000,
  PHONE_MAX: 15,
  OTP_LENGTH: 6,
} as const;

// Age limits
export const AGE_LIMITS = {
  MIN: 18,
  MAX: 50,
  DEFAULT_MIN: 21,
  DEFAULT_MAX: 30,
} as const;

// Height limits (in cm)
export const HEIGHT_LIMITS = {
  MIN: 150,
  MAX: 200,
  DEFAULT_MIN: 160,
  DEFAULT_MAX: 175,
} as const;

// Income range (in lakhs)
export const INCOME_LIMITS = {
  MIN: 2,
  MAX: 100,
  DEFAULT_MIN: 5,
  DEFAULT_MAX: 20,
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1,
  USERS_PER_PAGE: 20,
  DATES_PER_PAGE: 20,
  TRANSACTIONS_PER_PAGE: 50,
} as const;

// Time constants (in milliseconds)
export const TIME_CONSTANTS = {
  TOAST_DURATION: 3000,
  LONG_TOAST_DURATION: 5000,
  DEBOUNCE_DELAY: 300,
  SEARCH_DELAY: 500,
  AUTO_SAVE_DELAY: 1000,
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  TOKEN_REFRESH_INTERVAL: 20 * 60 * 1000, // 20 minutes
} as const;

// Days for cookie/token expiry
export const EXPIRY_DAYS = {
  SESSION: 1,
  REMEMBER_ME: 30,
  REFRESH_TOKEN: 7,
} as const;

// Regular expressions
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[6-9]\d{9}$/,
  NAME: /^[a-zA-Z\s'-]+$/,
  USERNAME: /^[a-zA-Z0-9_-]{3,20}$/,
  PASSWORD_STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  OTP: /^\d{6}$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
} as const;

// File upload limits
export const FILE_LIMITS = {
  IMAGE_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  DOCUMENT_MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
  MAX_PROFILE_PHOTOS: 6,
} as const;

// Date/Time formats
export const DATE_FORMATS = {
  DISPLAY_DATE: 'dd MMM yyyy',
  DISPLAY_TIME: 'hh:mm a',
  DISPLAY_DATETIME: 'dd MMM yyyy, hh:mm a',
  INPUT_DATE: 'yyyy-MM-dd',
  INPUT_TIME: 'HH:mm',
  API_FORMAT: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
} as const;