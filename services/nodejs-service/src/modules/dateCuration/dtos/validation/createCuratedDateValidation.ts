// services/nodejs-service/src/modules/dateCuration/dtos/validation/createCuratedDateValidation.ts

import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';
import {  } from '../../../../proto-types/dating/curated_dates';
import { DateMode } from '../../../../proto-types';

/**
 * Validation rules for creating curated dates
 */
const createCuratedDateValidationRules: ValidationChain[] = [
  // Basic user validation
  body('user1Id')
    .isInt({ min: 1 })
    .withMessage('User1 ID must be a positive integer'),
    
  body('user2Id')
    .isInt({ min: 1 })
    .withMessage('User2 ID must be a positive integer')
    .custom((value, { req }) => {
      if (value === req.body.user1Id) {
        throw new Error('User1 and User2 cannot be the same person');
      }
      return true;
    }),

  // Date and time validation
  body('dateTime')
    .isISO8601()
    .withMessage('Date time must be a valid ISO 8601 date')
    .custom((value) => {
      const dateTime = new Date(value);
      const now = new Date();
      const minAdvance = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
      const maxAdvance = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000); // 90 days
      
      if (dateTime < minAdvance) {
        throw new Error('Date must be at least 24 hours in advance');
      }
      if (dateTime > maxAdvance) {
        throw new Error('Date cannot be more than 90 days in advance');
      }
      
      // Check business hours (9 AM to 10 PM)
      const hours = dateTime.getHours();
      if (hours < 9 || hours > 22) {
        throw new Error('Date time must be between 9:00 AM and 10:00 PM');
      }
      
      return true;
    }),
    
  body('durationMinutes')
    .optional()
    .isInt({ min: 30, max: 240 })
    .withMessage('Duration must be between 30 and 240 minutes'),
    
  body('mode')
    .isIn(Object.values(DateMode))
    .withMessage('Mode must be either online or offline'),

  // Location validation (conditional based on mode)
  body('locationName')
    .if(body('mode').equals('offline'))
    .notEmpty()
    .withMessage('Location name is required for offline dates')
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

  // Meeting link validation (conditional based on mode)
  body('meetingLink')
    .if(body('mode').equals('online'))
    .notEmpty()
    .withMessage('Meeting link is required for online dates')
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

  // Admin fields validation
  body('adminNotes')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Admin notes must be less than 2000 characters')
    .trim(),
    
  body('specialInstructions')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Special instructions must be less than 1000 characters')
    .trim(),
    
  body('dressCode')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Dress code must be less than 200 characters')
    .trim(),
    
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

  // Matching fields validation
  body('compatibilityScore')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Compatibility score must be between 0 and 100'),
    
  body('matchReason')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Match reason must be less than 500 characters')
    .trim(),
    
  body('algorithmConfidence')
    .optional()
    .isFloat({ min: 0, max: 1 })
    .withMessage('Algorithm confidence must be between 0 and 1'),

  // Token cost validation
  body('tokensCostUser1')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Token cost for user1 must be non-negative'),
    
  body('tokensCostUser2')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Token cost for user2 must be non-negative'),
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
 * Complete validation middleware for creating curated dates
 * Following your existing auth validation pattern
 */
export const validateCreateCuratedDate = [
  ...createCuratedDateValidationRules,
  handleValidationErrors
];