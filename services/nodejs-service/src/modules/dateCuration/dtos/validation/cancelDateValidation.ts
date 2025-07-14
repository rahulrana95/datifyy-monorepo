// =============================================================================
// FILE: dtos/validation/cancelDateValidation.ts
// =============================================================================

import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';
import { CancellationCategory } from '@datifyy/shared-types';

/**
 * Validation middleware for canceling dates
 */
export const validateCancelDate = [
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