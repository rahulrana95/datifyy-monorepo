// =============================================================================
// FILE: dtos/validation/submitFeedbackValidation.ts
// =============================================================================

import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';
import { VALIDATION_RULES } from '../base/CommonTypes';

/**
 * Validation middleware for submitting date feedback
 */
export const validateSubmitDateFeedback = [
  param('dateId')
    .isInt({ min: 1 })
    .withMessage('Date ID must be a positive integer'),

  // Rating fields validation
  ...[
    'overallRating', 
    'chemistryRating', 
    'conversationQuality',
    'partnerPunctuality',
    'partnerAppearanceMatch',
    'venueRating',
    'timingSatisfaction',
    'durationSatisfaction'
  ].map(field => 
    body(field)
      .optional()
      .isInt({ 
        min: VALIDATION_RULES.feedback.minRating, 
        max: VALIDATION_RULES.feedback.maxRating 
      })
      .withMessage(`${field} must be between ${VALIDATION_RULES.feedback.minRating} and ${VALIDATION_RULES.feedback.maxRating}`)
  ),

  // Boolean fields validation
  ...[
    'wouldMeetAgain',
    'safetyConcerns', 
    'reportUser',
    'interestedInSecondDate',
    'isAnonymous'
  ].map(field => 
    body(field)
      .optional()
      .isBoolean()
      .withMessage(`${field} must be a boolean`)
  ),

  // Text fields validation
  ...[
    'whatWentWell',
    'whatCouldImprove', 
    'favoriteMoment',
    'suggestedImprovements',
    'reportReason',
    'additionalComments'
  ].map(field => 
    body(field)
      .optional()
      .isLength({ max: VALIDATION_RULES.feedback.maxCommentLength })
      .withMessage(`${field} must be less than ${VALIDATION_RULES.feedback.maxCommentLength} characters`)
      .trim()
  ),

  // Short text fields
  ...[
    'preferredNextDateActivity',
    'preferredNextDateTiming',
    'preferredContactMethod'
  ].map(field => 
    body(field)
      .optional()
      .isLength({ max: 200 })
      .withMessage(`${field} must be less than 200 characters`)
      .trim()
  ),

  // Red flags array validation
  body('redFlags')
    .optional()
    .isArray({ max: VALIDATION_RULES.feedback.maxRedFlags })
    .withMessage(`Maximum ${VALIDATION_RULES.feedback.maxRedFlags} red flags allowed`)
    .custom((redFlags) => {
      if (redFlags && redFlags.some((flag: any) => typeof flag !== 'string' || flag.trim().length === 0)) {
        throw new Error('Each red flag must be a non-empty string');
      }
      return true;
    }),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid feedback data',
          details: errors.array(),
          timestamp: new Date().toISOString(),
          requestId: (req as any).id
        }
      });
    }
    next();
  }
];