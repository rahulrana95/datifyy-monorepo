/**
 * Validation Middleware - Request Validation with class-validator
 * 
 * Provides comprehensive request validation using class-validator decorators.
 * Supports body, query, and parameter validation with detailed error responses.
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */

import { Request, Response, NextFunction } from 'express';
import { plainToClass, Transform, ClassConstructor } from 'class-transformer';
import { validate, ValidationError as ClassValidationError, ValidatorOptions } from 'class-validator';
import { Logger } from '../logging/Logger';
import { ValidationError } from '../errors/AppErrors';

/**
 * Validation target types
 */
export enum ValidationTarget {
  BODY = 'body',
  QUERY = 'query',
  PARAMS = 'params',
  HEADERS = 'headers'
}

/**
 * Validation options interface
 */
interface ValidationOptions {
  /** Target to validate (body, query, params, headers) */
  target?: ValidationTarget;
  /** Skip missing properties */
  skipMissingProperties?: boolean;
  /** Whitelist only known properties */
  whitelist?: boolean;
  /** Forbid non-whitelisted properties */
  forbidNonWhitelisted?: boolean;
  /** Transform payload to class instance */
  transform?: boolean;
  /** Validation groups to apply */
  groups?: string[];
  /** Custom validator options */
  validatorOptions?: ValidatorOptions;
  /** Strip unknown properties */
  stripUnknown?: boolean;
  /** Custom error message */
  customErrorMessage?: string;
  /** Log validation failures */
  logValidationFailures?: boolean;
}

/**
 * Validation result interface
 */
interface ValidationResult {
  isValid: boolean;
  validatedData?: any;
  errors?: ValidationErrorDetail[];
}

/**
 * Detailed validation error
 */
interface ValidationErrorDetail {
  property: string;
  value: any;
  constraints: Record<string, string>;
  children?: ValidationErrorDetail[];
  context?: Record<string, any>;
}

/**
 * Request Validation Middleware Factory
 * 
 * Creates validation middleware for DTOs using class-validator decorators.
 * Provides comprehensive validation with detailed error reporting.
 * 
 * @param dtoClass DTO class with validation decorators
 * @param options Validation configuration options
 * @returns Express middleware function
 */
export function validateRequest<T extends object>(
  dtoClass: ClassConstructor<T>,
  options: ValidationOptions = {}
) {
  const logger = Logger.getInstance();
  
  const defaultOptions: ValidationOptions = {
    target: ValidationTarget.BODY,
    skipMissingProperties: false,
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    stripUnknown: false,
    logValidationFailures: true,
    validatorOptions: {
      skipMissingProperties: false,
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: false
    }
  };

  const finalOptions = { ...defaultOptions, ...options };

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const requestId = (req as any).requestId || `val_${Date.now()}`;
    const startTime = Date.now();

    try {
      logger.debug('Request validation started', {
        requestId,
        dtoClass: dtoClass.name,
        target: finalOptions.target,
        path: req.path,
        method: req.method
      });

      // Extract data to validate based on target
      const dataToValidate = extractValidationData(req, finalOptions.target!);

      // Perform validation
      const validationResult = await performValidation(
        dataToValidate,
        dtoClass,
        finalOptions,
        requestId,
        logger
      );

      if (!validationResult.isValid) {
        // Log validation failure if enabled
        if (finalOptions.logValidationFailures) {
          logger.warn('Request validation failed', {
            requestId,
            dtoClass: dtoClass.name,
            target: finalOptions.target,
            errors: validationResult.errors,
            path: req.path,
            method: req.method,
            dataReceived: sanitizeDataForLogging(dataToValidate)
          });
        }

        // Create detailed validation error
        const validationError = new ValidationError(
          finalOptions.customErrorMessage || 'Request validation failed',
          validationResult.errors
        );

        // Attach validation context
        (validationError as any).validationContext = {
          target: finalOptions.target,
          dtoClass: dtoClass.name,
          requestId
        };

        throw validationError;
      }

      // Replace original data with validated and transformed data
      if (validationResult.validatedData) {
        replaceRequestData(req, finalOptions.target!, validationResult.validatedData);
      }

      const validationTime = Date.now() - startTime;
      
      logger.debug('Request validation completed', {
        requestId,
        dtoClass: dtoClass.name,
        target: finalOptions.target,
        validationTime,
        path: req.path
      });

      next();

    }catch (error: any) {
      const validationTime = Date.now() - startTime;
      
      logger.error('Request validation error', {
        requestId,
        dtoClass: dtoClass.name,
        target: finalOptions.target,
        error: error.message,
        validationTime,
        path: req.path,
        method: req.method
      });

      next(error);
    }
  };
}

/**
 * Body Validation Middleware (Shorthand)
 * 
 * Convenient middleware for validating request body only.
 */
export function validateBody<T extends object>(
  dtoClass: ClassConstructor<T>,
  options: Omit<ValidationOptions, 'target'> = {}
) {
  return validateRequest(dtoClass, { ...options, target: ValidationTarget.BODY });
}

/**
 * Query Parameters Validation Middleware (Shorthand)
 * 
 * Convenient middleware for validating query parameters.
 */
export function validateQuery<T extends object>(
  dtoClass: ClassConstructor<T>,
  options: Omit<ValidationOptions, 'target'> = {}
) {
  return validateRequest(dtoClass, { 
    ...options, 
    target: ValidationTarget.QUERY,
    transform: true // Always transform query params (strings to proper types)
  });
}

/**
 * URL Parameters Validation Middleware (Shorthand)
 * 
 * Convenient middleware for validating URL parameters.
 */
export function validateParams<T extends object>(
  dtoClass: ClassConstructor<T>,
  options: Omit<ValidationOptions, 'target'> = {}
) {
  return validateRequest(dtoClass, { 
    ...options, 
    target: ValidationTarget.PARAMS,
    transform: true // Always transform params (strings to proper types)
  });
}

/**
 * Headers Validation Middleware (Shorthand)
 * 
 * Convenient middleware for validating request headers.
 */
export function validateHeaders<T extends object>(
  dtoClass: ClassConstructor<T>,
  options: Omit<ValidationOptions, 'target'> = {}
) {
  return validateRequest(dtoClass, { 
    ...options, 
    target: ValidationTarget.HEADERS,
    forbidNonWhitelisted: false // Headers often contain extra fields
  });
}

/**
 * Multiple Target Validation Middleware
 * 
 * Validates multiple request parts with different DTOs.
 */
export function validateMultiple(validations: Array<{
  target: ValidationTarget;
  dtoClass: ClassConstructor<any>;
  options?: ValidationOptions;
}>) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const logger = Logger.getInstance();
    const requestId = (req as any).requestId || `multi_val_${Date.now()}`;

    try {
      logger.debug('Multiple validation started', {
        requestId,
        validationCount: validations.length,
        targets: validations.map(v => v.target)
      });

      // Perform all validations
      for (const validation of validations) {
        const middleware = validateRequest(validation.dtoClass, {
          ...validation.options,
          target: validation.target
        });

        // Execute middleware synchronously
        await new Promise<void>((resolve, reject) => {
          middleware(req, res, (error) => {
            if (error) reject(error);
            else resolve();
          });
        });
      }

      logger.debug('Multiple validation completed', {
        requestId,
        validationCount: validations.length
      });

      next();

    }catch (error: any) {
      logger.error('Multiple validation failed', {
        requestId,
        error: error.message
      });

      next(error);
    }
  };
}

/**
 * Conditional Validation Middleware
 * 
 * Applies validation only when condition is met.
 */
export function validateConditional<T extends object>(
  condition: (req: Request) => boolean,
  dtoClass: ClassConstructor<T>,
  options: ValidationOptions = {}
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (condition(req)) {
      const validationMiddleware = validateRequest(dtoClass, options);
      validationMiddleware(req, res, next);
    } else {
      next();
    }
  };
}

/**
 * Helper Functions
 */

/**
 * Extract data to validate based on target
 */
function extractValidationData(req: Request, target: ValidationTarget): any {
  switch (target) {
    case ValidationTarget.BODY:
      return req.body;
    case ValidationTarget.QUERY:
      return req.query;
    case ValidationTarget.PARAMS:
      return req.params;
    case ValidationTarget.HEADERS:
      return req.headers;
    default:
      return req.body;
  }
}

/**
 * Replace request data with validated data
 */
function replaceRequestData(req: Request, target: ValidationTarget, validatedData: any): void {
  switch (target) {
    case ValidationTarget.BODY:
      req.body = validatedData;
      break;
    case ValidationTarget.QUERY:
      req.query = validatedData;
      break;
    case ValidationTarget.PARAMS:
      req.params = validatedData;
      break;
    case ValidationTarget.HEADERS:
      // Don't replace headers, just validate them
      break;
  }
}

/**
 * Perform validation using class-validator
 */
async function performValidation<T extends object>(
  data: any,
  dtoClass: ClassConstructor<T>,
  options: ValidationOptions,
  requestId: string,
  logger: Logger
): Promise<ValidationResult> {
  try {
    // Transform plain object to class instance
    const classInstance = plainToClass(dtoClass, data, {
      enableImplicitConversion: true,
      excludeExtraneousValues: options.whitelist
    });

    // Perform validation
    const errors = await validate(classInstance, {
      ...options.validatorOptions,
      groups: options.groups,
      skipMissingProperties: options.skipMissingProperties,
      whitelist: options.whitelist,
      forbidNonWhitelisted: options.forbidNonWhitelisted
    });

    if (errors.length > 0) {
      return {
        isValid: false,
        errors: formatValidationErrors(errors)
      };
    }

    return {
      isValid: true,
      validatedData: options.transform ? classInstance : data
    };

  }catch (error: any) {
    logger.error('Validation processing error', {
      requestId,
      error: error.message,
      dtoClass: dtoClass.name
    });

    return {
      isValid: false,
      errors: [{
        property: 'root',
        value: data,
        constraints: {
          'processing_error': `Validation processing failed: ${error.message}`
        }
      }]
    };
  }
}

/**
 * Format class-validator errors to our error format
 */
function formatValidationErrors(errors: ClassValidationError[]): ValidationErrorDetail[] {
  return errors.map(error => formatSingleValidationError(error));
}

/**
 * Format single validation error recursively
 */
function formatSingleValidationError(error: ClassValidationError): ValidationErrorDetail {
  const detail: ValidationErrorDetail = {
    property: error.property,
    value: error.value,
    constraints: error.constraints || {},
    context: error.contexts
  };

  // Format nested errors
  if (error.children && error.children.length > 0) {
    detail.children = error.children.map(child => formatSingleValidationError(child));
  }

  return detail;
}

/**
 * Sanitize data for logging (remove sensitive fields)
 */
function sanitizeDataForLogging(data: any): any {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const sensitiveFields = [
    'password',
    'confirmPassword',
    'currentPassword',
    'newPassword',
    'token',
    'refreshToken',
    'secret',
    'key',
    'apiKey',
    'accessKey',
    'secretKey',
    'authorization',
    'cookie'
  ];

  const sanitized = Array.isArray(data) ? [...data] : { ...data };

  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  }

  // Recursively sanitize nested objects
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeDataForLogging(sanitized[key]);
    }
  }

  return sanitized;
}

/**
 * Create validation error response
 */
export function createValidationErrorResponse(
  validationError: ValidationError,
  requestId?: string
): {
  success: boolean;
  error: {
    code: string;
    message: string;
    details: {
      validationErrors: ValidationErrorDetail[];
      target?: string;
      dtoClass?: string;
    };
  };
  metadata: {
    requestId: string;
    timestamp: string;
  };
} {
  return {
    success: false,
    error: {
      code: 'VALIDATION_ERROR',
      message: validationError.message,
      details: {
        validationErrors: [],
        target: (validationError as any).validationContext?.target,
        dtoClass: (validationError as any).validationContext?.dtoClass
      }
    },
    metadata: {
      requestId: requestId || 'unknown',
      timestamp: new Date().toISOString()
    }
  };
}

/**
 * Validation summary for debugging
 */
export function getValidationSummary(errors: ValidationErrorDetail[]): {
  totalErrors: number;
  errorsByProperty: Record<string, number>;
  constraintTypes: string[];
} {
  const summary = {
    totalErrors: 0,
    errorsByProperty: {} as Record<string, number>,
    constraintTypes: [] as string[]
  };

  function processError(error: ValidationErrorDetail) {
    summary.totalErrors++;
    
    if (!summary.errorsByProperty[error.property]) {
      summary.errorsByProperty[error.property] = 0;
    }
    summary.errorsByProperty[error.property]++;

    Object.keys(error.constraints).forEach(constraint => {
      if (!summary.constraintTypes.includes(constraint)) {
        summary.constraintTypes.push(constraint);
      }
    });

    if (error.children) {
      error.children.forEach(child => processError(child));
    }
  }

  errors.forEach(error => processError(error));

  return summary;
}