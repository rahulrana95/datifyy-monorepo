// =============================================================================
// FILE: dtos/validation/confirmDateValidation.ts
// =============================================================================

import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';

/**
 * Validation middleware for confirming dates
 */
export const validateConfirmDate = [
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

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: errors.array(),
          timestamp: new Date().toISOString(),
          requestId: (req as any).id
        }
      });
    }
    next();
  }
];