export interface ErrorObject { code: number; message: string }
// apps/frontend/src/service/ErrorTypes.ts
/**
 * Error Types and Service Response Interfaces
 * 
 * Standardized error handling and response types for all API services.
 * Provides consistent error structure across the application.
 */

/**
 * Standard API error structure
 */
export interface ApiError {
  code: string | number;
  message: string;
  details?: any;
  statusCode?: number;
}

/**
 * Service response wrapper
 * Either contains successful response data or error information
 */
export interface ServiceResponse<T> {
  response?: T;
  error?: ApiError;
}

/**
 * Validation error details
 */
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

/**
 * Network error types
 */
export enum NetworkErrorType {
  TIMEOUT = 'TIMEOUT',
  NO_CONNECTION = 'NO_CONNECTION',
  SERVER_ERROR = 'SERVER_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  CONFLICT = 'CONFLICT',
  RATE_LIMITED = 'RATE_LIMITED',
  UNKNOWN = 'UNKNOWN'
}

/**
 * Extended error interface for detailed error handling
 */
export interface ExtendedApiError extends ApiError {
  type: NetworkErrorType;
  timestamp: string;
  requestId?: string;
  validationErrors?: ValidationError[];
  retryable: boolean;
}

/**
 * Helper functions for error handling
 */
export class ErrorUtils {
  /**
   * Create a standardized API error
   */
  static createApiError(
    message: string, 
    code: string = 'UNKNOWN_ERROR', 
    statusCode?: number,
    details?: any
  ): ApiError {
    return {
      code,
      message,
      details,
      statusCode
    };
  }

  /**
   * Create an extended error with more context
   */
  static createExtendedError(
    message: string,
    type: NetworkErrorType,
    code: string = 'UNKNOWN_ERROR',
    statusCode?: number,
    retryable: boolean = false
  ): ExtendedApiError {
    return {
      code,
      message,
      type,
      statusCode,
      timestamp: new Date().toISOString(),
      retryable
    };
  }

  /**
   * Check if an error is retryable
   */
  static isRetryableError(error: ApiError | ExtendedApiError): boolean {
    if ('retryable' in error) {
      return error.retryable;
    }
    
    // Default retryable conditions
    const retryableCodes = [500, 502, 503, 504];
    return error.statusCode ? retryableCodes.includes(error.statusCode) : false;
  }

  /**
   * Get user-friendly error message
   */
  static getUserFriendlyMessage(error: ApiError): string {
    const { code, message, statusCode } = error;

    // Map common error codes to user-friendly messages
    const errorMessages: Record<string, string> = {
      'NETWORK_ERROR': 'Please check your internet connection and try again.',
      'TIMEOUT': 'Request timed out. Please try again.',
      'UNAUTHORIZED': 'You need to log in to continue.',
      'FORBIDDEN': 'You don\'t have permission to perform this action.',
      'NOT_FOUND': 'The requested resource was not found.',
      'VALIDATION_ERROR': 'Please check your input and try again.',
      'CONFLICT': 'This action conflicts with existing data.',
      'RATE_LIMITED': 'Too many requests. Please wait a moment and try again.',
      'SERVER_ERROR': 'Something went wrong on our end. Please try again later.'
    };

    // Check by error code first
    if (errorMessages[code]) {
      return errorMessages[code];
    }

    // Check by status code
    if (statusCode) {
      switch (statusCode) {
        case 400:
          return 'Invalid request. Please check your input.';
        case 401:
          return 'You need to log in to continue.';
        case 403:
          return 'You don\'t have permission to perform this action.';
        case 404:
          return 'The requested resource was not found.';
        case 409:
          return 'This action conflicts with existing data.';
        case 422:
          return 'Please check your input and try again.';
        case 429:
          return 'Too many requests. Please wait a moment and try again.';
        case 500:
        case 502:
        case 503:
        case 504:
          return 'Something went wrong on our end. Please try again later.';
      }
    }

    // Fall back to original message or generic message
    return message || 'An unexpected error occurred. Please try again.';
  }

  /**
   * Extract validation errors from API response
   */
  static extractValidationErrors(error: ApiError): ValidationError[] {
    if (!error.details) return [];

    // Handle different validation error formats
    if (Array.isArray(error.details)) {
      return error.details.map((detail: any) => ({
        field: detail.field || detail.property || 'unknown',
        message: detail.message || detail.error || 'Invalid value',
        code: detail.code || 'VALIDATION_ERROR'
      }));
    }

    if (typeof error.details === 'object') {
      return Object.entries(error.details).map(([field, message]) => ({
        field,
        message: Array.isArray(message) ? message[0] : String(message),
        code: 'VALIDATION_ERROR'
      }));
    }

    return [];
  }
}

/**
 * Common error constants
 */
export const ERROR_CODES = {
  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  NO_CONNECTION: 'NO_CONNECTION',
  
  // Authentication errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  
  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  MISSING_FIELD: 'MISSING_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',
  
  // Business logic errors
  CONFLICT: 'CONFLICT',
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  
  // Rate limiting
  RATE_LIMITED: 'RATE_LIMITED',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  
  // Server errors
  SERVER_ERROR: 'SERVER_ERROR',
  MAINTENANCE: 'MAINTENANCE',
  
  // Unknown
  UNKNOWN: 'UNKNOWN_ERROR'
} as const;

/**
 * HTTP Status Code constants
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
} as const;

export type HttpStatusCode = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];
export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];