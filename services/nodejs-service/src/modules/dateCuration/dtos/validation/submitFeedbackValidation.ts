// services/nodejs-service/src/modules/dateCuration/dtos/validation/submitFeedbackValidation.ts

import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult, ValidationChain } from 'express-validator';

/**
 * Validation rules for submitting date feedback
 */
const submitDateFeedbackValidationRules: ValidationChain[] = [
  param('dateId')
    .isInt({ min: 1 })
    .withMessage('Date ID must be a positive integer'),

  // Rating fields validation (1-5 scale)
  body('overallRating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Overall rating must be between 1 and 5'),
    
  body('chemistryRating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Chemistry rating must be between 1 and 5'),
    
  body('conversationQuality')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Conversation quality must be between 1 and 5'),
    
  body('partnerPunctuality')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Partner punctuality must be between 1 and 5'),
    
  body('partnerAppearanceMatch')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Partner appearance match must be between 1 and 5'),
    
  body('venueRating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Venue rating must be between 1 and 5'),
    
  body('timingSatisfaction')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Timing satisfaction must be between 1 and 5'),
    
  body('durationSatisfaction')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Duration satisfaction must be between 1 and 5'),

  // Boolean fields validation
  body('wouldMeetAgain')
    .optional()
    .isBoolean()
    .withMessage('Would meet again must be a boolean'),
    
  body('safetyConcerns')
    .optional()
    .isBoolean()
    .withMessage('Safety concerns must be a boolean'),
    
  body('reportUser')
    .optional()
    .isBoolean()
    .withMessage('Report user must be a boolean'),
    
  body('interestedInSecondDate')
    .optional()
    .isBoolean()
    .withMessage('Interested in second date must be a boolean'),
    
  body('isAnonymous')
    .optional()
    .isBoolean()
    .withMessage('Is anonymous must be a boolean'),

  // Text fields validation
  body('whatWentWell')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('What went well must be less than 1000 characters')
    .trim(),
    
  body('whatCouldImprove')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('What could improve must be less than 1000 characters')
    .trim(),
    
  body('favoriteMoment')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Favorite moment must be less than 1000 characters')
    .trim(),
    
  body('suggestedImprovements')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Suggested improvements must be less than 1000 characters')
    .trim(),
    
  body('reportReason')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Report reason must be less than 1000 characters')
    .trim(),
    
  body('additionalComments')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Additional comments must be less than 1000 characters')
    .trim(),

  // Short text fields
  body('preferredNextDateActivity')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Preferred next date activity must be less than 200 characters')
    .trim(),
    
  body('preferredNextDateTiming')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Preferred next date timing must be less than 200 characters')
    .trim(),
    
  body('preferredContactMethod')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Preferred contact method must be less than 100 characters')
    .trim(),

  // Red flags array validation
  body('redFlags')
    .optional()
    .isArray({ max: 5 })
    .withMessage('Maximum 5 red flags allowed')
    .custom((redFlags) => {
      if (redFlags && redFlags.some((flag: any) => typeof flag !== 'string' || flag.trim().length === 0)) {
        throw new Error('Each red flag must be a non-empty string');
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
        message: 'Invalid feedback data',
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
 * Complete validation middleware for submitting date feedback
 */
export const validateSubmitDateFeedback = [
  ...submitDateFeedbackValidationRules,
  handleValidationErrors
];