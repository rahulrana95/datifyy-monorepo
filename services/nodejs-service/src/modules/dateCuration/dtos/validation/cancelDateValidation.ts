// services/nodejs-service/src/modules/dateCuration/dtos/validation/cancelDateValidation.ts

import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult, ValidationChain } from 'express-validator';
import {  } from '../../../../proto-types/dating/curated_dates';
import { CancellationCategory } from '../../../../proto-types';

/**
 * Validation rules for canceling dates
 */
const cancelDateValidationRules: ValidationChain[] = [
  param('dateId')
    .isInt({ min: 1 })
    .withMessage('Date ID must be a positive integer'),
    
  body('reason')
    .isLength({ min: 5, max: 1000 })
    .withMessage('Reason must be 5-1000 characters')
    .trim(),
    
  body('category')
    .isIn(Object.values(CancellationCategory))
    .withMessage('Invalid cancellation category'),
    
  body('notifyPartner')
    .optional()
    .isBoolean()
    .withMessage('Notify partner must be a boolean'),
    
  body('refundTokens')
    .optional()
    .isBoolean()
    .withMessage('Refund tokens must be a boolean'),
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
 * Complete validation middleware for canceling dates
 * Following your existing auth validation pattern
 */
export const validateCancelDate = [
  ...cancelDateValidationRules,
  handleValidationErrors
];