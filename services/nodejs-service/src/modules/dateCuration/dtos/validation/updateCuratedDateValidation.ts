// services/nodejs-service/src/modules/dateCuration/dtos/validation/updateCuratedDateValidation.ts

import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult, ValidationChain } from 'express-validator';
import { } from '../../../../proto-types/dating/curated_dates';
import { CuratedDateStatus, DateMode } from '../../../../proto-types';

/**
 * Validation rules for updating curated dates
 */
const updateCuratedDateValidationRules: ValidationChain[] = [
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
    .isInt({ min: 30, max: 240 })
    .withMessage('Duration must be between 30 and 240 minutes'),
    
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
    
  body('locationCoordinates.lat')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
    
  body('locationCoordinates.lng')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
    
  body('meetingLink')
    .optional()
    .isURL()
    .withMessage('Meeting link must be a valid URL'),
    
  body('meetingId')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Meeting ID must be 1-100 characters'),
    
  body('meetingPassword')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Meeting password must be less than 50 characters'),
    
  body('adminNotes')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Admin notes must be less than 2000 characters'),
    
  body('specialInstructions')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Special instructions must be less than 1000 characters'),
    
  body('dressCode')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Dress code must be less than 200 characters'),
    
  body('suggestedConversationTopics')
    .optional()
    .isArray()
    .withMessage('Suggested conversation topics must be an array')
    .custom((topics) => {
      if (topics && topics.length > 10) {
        throw new Error('Maximum 10 conversation topics allowed');
      }
      if (topics && topics.some((topic: any) => typeof topic !== 'string' || topic.trim().length === 0)) {
        throw new Error('Each conversation topic must be a non-empty string');
      }
      return true;
    }),
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
 * Complete validation middleware for updating curated dates
 */
export const validateUpdateCuratedDate = [
  ...updateCuratedDateValidationRules,
  handleValidationErrors
];