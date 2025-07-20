// services/nodejs-service/src/modules/dateCuration/dtos/validation/confirmDateValidation.ts

import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult, ValidationChain } from 'express-validator';

/**
 * Validation rules for confirming dates
 */
const confirmDateValidationRules: ValidationChain[] = [
  param('dateId')
    .isInt({ min: 1 })
    .withMessage('Date ID must be a positive integer'),
    
  body('confirmed')
    .isBoolean()
    .withMessage('Confirmed must be a boolean value'),
    
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes must be less than 500 characters')
    .trim(),
];

/**
 * Error handling middleware for validation results
 */
const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details: errors.array(),
        timestamp: new Date().toISOString(),
        requestId: (req as any).id
      }
    });
    return;
  }
  next();
};

/**
 * Complete validation middleware for confirming dates
 * Following your existing auth validation pattern
 */
export const validateConfirmDate = [
  ...confirmDateValidationRules,
  handleValidationErrors
];