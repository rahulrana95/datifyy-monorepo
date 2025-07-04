import { Request, Response, NextFunction } from 'express';
import { ValidationChain, validationResult } from 'express-validator';
import { AppError } from '../errors/AppErrors';

/**
 * Middleware to validate request using express-validator chains
 */
export function validateRequest(validations: ValidationChain[]) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    // Check for errors
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => ({
        field: error.type === 'field' ? error.path : undefined,
        message: error.msg,
        value: error.type === 'field' ? error.value : undefined
      }));

      const error = new AppError(
        'Validation failed',
        400,
        'VALIDATION_ERROR'
      );
      
      // Attach validation details to error
      (error as any).validationErrors = errorMessages;
      
      next(error);
      return;
    }

    next();
  };
}

/**
 * Helper to create a validation middleware for a single field
 */
export function validateField(
  field: string,
  validator: (value: any) => boolean | Promise<boolean>,
  errorMessage: string
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const value = req.body[field] || req.params[field] || req.query[field];
    
    Promise.resolve(validator(value))
      .then(isValid => {
        if (!isValid) {
          next(new AppError(errorMessage, 400, 'VALIDATION_ERROR'));
        } else {
          next();
        }
      })
      .catch(next);
  };
}
