// =============================================================================
// FILE: dtos/validation/updateCuratedDateValidation.ts
// =============================================================================

import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';
import { DateMode, CuratedDateStatus } from '@datifyy/shared-types';
import { VALIDATION_RULES } from '../base/CommonTypes';

/**
 * Validation middleware for updating curated dates
 */
export const validateUpdateCuratedDate = [
  param('dateId')
    .isInt({ min: 1 })
    .withMessage('Date ID must be a positive integer'),
    
  body('dateTime')
    .optional()
    .isISO8601()
    .withMessage('Date time must be a valid ISO 8601 date')
    .custom((value) => {
      if (value) {
        const dateTime = new Date(value);
        const now = new Date();
        if (dateTime < now) {
          throw new Error('Cannot update date to a past time');
        }
      }
      return true;
    }),
    
  body('durationMinutes')
    .optional()
    .isInt({ 
      min: VALIDATION_RULES.dateScheduling.minDurationMinutes, 
      max: VALIDATION_RULES.dateScheduling.maxDurationMinutes 
    })
    .withMessage(`Duration must be between ${VALIDATION_RULES.dateScheduling.minDurationMinutes} and ${VALIDATION_RULES.dateScheduling.maxDurationMinutes} minutes`),
    
  body('mode')
    .optional()
    .isIn(Object.values(DateMode))
    .withMessage('Mode must be either online or offline'),
    
  body('status')
    .optional()
    .isIn(Object.values(CuratedDateStatus))
    .withMessage('Invalid status value'),
    
  body('locationName')
    .optional()
    .isLength({ min: 2, max: 255 })
    .withMessage('Location name must be 2-255 characters'),
    
  body('locationAddress')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Location address must be less than 1000 characters'),
    
  body('meetingLink')
    .optional()
    .isURL()
    .withMessage('Meeting link must be a valid URL'),
    
  body('adminNotes')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Admin notes must be less than 2000 characters'),

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
