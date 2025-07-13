// services/nodejs-service/src/modules/dateCuration/dtos/DateCurationDtos.ts
import { Request, Response, NextFunction } from 'express';
import { body, query, param, validationResult } from 'express-validator';
import { 
  DateMode, 
  CuratedDateStatus, 
  CancellationCategory,
  DateCurationValidationRules 
} from '@datifyy/shared-types';

/**
 * Validation middleware for creating curated dates
 */
export const validateCreateCuratedDate = [
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
    
  body('dateTime')
    .isISO8601()
    .withMessage('Date time must be a valid ISO 8601 date')
    .custom((value) => {
      const dateTime = new Date(value);
      const now = new Date();
      const minAdvance = new Date(now.getTime() + DateCurationValidationRules.dateScheduling.minAdvanceHours * 60 * 60 * 1000);
      const maxAdvance = new Date(now.getTime() + DateCurationValidationRules.dateScheduling.maxAdvanceDays * 24 * 60 * 60 * 1000);
      
      if (dateTime < minAdvance) {
        throw new Error(`Date must be at least ${DateCurationValidationRules.dateScheduling.minAdvanceHours} hours in advance`);
      }
      if (dateTime > maxAdvance) {
        throw new Error(`Date cannot be more than ${DateCurationValidationRules.dateScheduling.maxAdvanceDays} days in advance`);
      }
      return true;
    }),
    
  body('durationMinutes')
    .optional()
    .isInt({ min: DateCurationValidationRules.dateScheduling.minDurationMinutes, max: DateCurationValidationRules.dateScheduling.maxDurationMinutes })
    .withMessage(`Duration must be between ${DateCurationValidationRules.dateScheduling.minDurationMinutes} and ${DateCurationValidationRules.dateScheduling.maxDurationMinutes} minutes`),
    
  body('mode')
    .isIn(Object.values(DateMode))
    .withMessage('Mode must be either online or offline'),
    
  body('locationName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Location name must be 2-255 characters'),
    
  body('locationAddress')
    .optional()
    .trim()
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
    
  body('adminNotes')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Admin notes must be less than 2000 characters'),
    
  body('specialInstructions')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Special instructions must be less than 1000 characters'),
    
  body('suggestedConversationTopics')
    .optional()
    .isArray()
    .withMessage('Suggested conversation topics must be an array'),
    
  body('suggestedConversationTopics.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Each conversation topic must be 1-200 characters'),
    
  body('compatibilityScore')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Compatibility score must be between 0 and 100'),
    
  body('tokensCostUser1')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Token cost for user1 must be non-negative'),
    
  body('tokensCostUser2')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Token cost for user2 must be non-negative'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: errors.array()
        }
      });
    }
    next();
  }
];

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
    .withMessage('Date time must be a valid ISO 8601 date'),
    
  body('durationMinutes')
    .optional()
    .isInt({ min: DateCurationValidationRules.dateScheduling.minDurationMinutes, max: DateCurationValidationRules.dateScheduling.maxDurationMinutes })
    .withMessage(`Duration must be between ${DateCurationValidationRules.dateScheduling.minDurationMinutes} and ${DateCurationValidationRules.dateScheduling.maxDurationMinutes} minutes`),
    
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
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Location name must be 2-255 characters'),
    
  body('adminNotes')
    .optional()
    .trim()
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
          details: errors.array()
        }
      });
    }
    next();
  }
];

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
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes must be less than 500 characters'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: errors.array()
        }
      });
    }
    next();
  }
];

/**
 * Validation middleware for canceling dates
 */
export const validateCancelDate = [
  param('dateId')
    .isInt({ min: 1 })
    .withMessage('Date ID must be a positive integer'),
    
  body('reason')
    .trim()
    .isLength({ min: 5, max: 1000 })
    .withMessage('Reason must be 5-1000 characters'),
    
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
          details: errors.array()
        }
      });
    }
    next();
  }
];

/**
 * Validation middleware for submitting date feedback
 */
export const validateSubmitDateFeedback = [
  param('dateId')
    .isInt({ min: 1 })
    .withMessage('Date ID must be a positive integer'),
    
  body('overallRating')
    .optional()
    .isInt({ min: DateCurationValidationRules.feedback.minRating, max: DateCurationValidationRules.feedback.maxRating })
    .withMessage(`Overall rating must be between ${DateCurationValidationRules.feedback.minRating} and ${DateCurationValidationRules.feedback.maxRating}`),
    
  body('wouldMeetAgain')
    .optional()
    .isBoolean()
    .withMessage('Would meet again must be a boolean'),
    
  body('chemistryRating')
    .optional()
    .isInt({ min: DateCurationValidationRules.feedback.minRating, max: DateCurationValidationRules.feedback.maxRating })
    .withMessage(`Chemistry rating must be between ${DateCurationValidationRules.feedback.minRating} and ${DateCurationValidationRules.feedback.maxRating}`),
    
  body('conversationQuality')
    .optional()
    .isInt({ min: DateCurationValidationRules.feedback.minRating, max: DateCurationValidationRules.feedback.maxRating })
    .withMessage(`Conversation quality must be between ${DateCurationValidationRules.feedback.minRating} and ${DateCurationValidationRules.feedback.maxRating}`),
    
  body('whatWentWell')
    .optional()
    .trim()
    .isLength({ max: DateCurationValidationRules.feedback.maxCommentLength })
    .withMessage(`What went well must be less than ${DateCurationValidationRules.feedback.maxCommentLength} characters`),
    
  body('whatCouldImprove')
    .optional()
    .trim()
    .isLength({ max: DateCurationValidationRules.feedback.maxCommentLength })
    .withMessage(`What could improve must be less than ${DateCurationValidationRules.feedback.maxCommentLength} characters`),
    
  body('safetyConcerns')
    .optional()
    .isBoolean()
    .withMessage('Safety concerns must be a boolean'),
    
  body('redFlags')
    .optional()
    .isArray({ max: DateCurationValidationRules.feedback.maxRedFlags })
    .withMessage(`Maximum ${DateCurationValidationRules.feedback.maxRedFlags} red flags allowed`),
    
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

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: errors.array()
        }
      });
    }
    next();
  }
];

/**
 * Validation middleware for getting user dates
 */
export const validateGetUserDates = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
    
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
    
  query('status')
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        const statuses = value.split(',');
        const validStatuses = Object.values(CuratedDateStatus);
        for (const status of statuses) {
          if (!validStatuses.includes(status as CuratedDateStatus)) {
            throw new Error(`Invalid status: ${status}`);
          }
        }
      }
      return true;
    }),
    
  query('startDate')
    .optional()
    .isDate()
    .withMessage('Start date must be a valid date'),
    
  query('endDate')
    .optional()
    .isDate()
    .withMessage('End date must be a valid date'),
    
  query('includeHistory')
    .optional()
    .isBoolean()
    .withMessage('Include history must be a boolean'),
    
  query('includeFeedback')
    .optional()
    .isBoolean()
    .withMessage('Include feedback must be a boolean'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid query parameters',
          details: errors.array()
        }
      });
    }
    next();
  }
];

/**
 * Validation middleware for admin getting dates
 */
export const validateAdminGetDates = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
    
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
    
  query('status')
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        const statuses = value.split(',');
        const validStatuses = Object.values(CuratedDateStatus);
        for (const status of statuses) {
          if (!validStatuses.includes(status as CuratedDateStatus)) {
            throw new Error(`Invalid status: ${status}`);
          }
        }
      }
      return true;
    }),
    
  query('curatedBy')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Curated by must be a positive integer'),
    
  query('user1Id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('User1 ID must be a positive integer'),
    
  query('user2Id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('User2 ID must be a positive integer'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid query parameters',
          details: errors.array()
        }
      });
    }
    next();
  }
];

/**
 * Validation middleware for searching potential matches
 */
export const validateSearchPotentialMatches = [
  body('userId')
    .isInt({ min: 1 })
    .withMessage('User ID must be a positive integer'),
    
  body('ageRange.min')
    .optional()
    .isInt({ min: 18, max: 100 })
    .withMessage('Minimum age must be between 18 and 100'),
    
  body('ageRange.max')
    .optional()
    .isInt({ min: 18, max: 100 })
    .withMessage('Maximum age must be between 18 and 100'),
    
  body('locationRadius')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Location radius must be between 1 and 1000 km'),
    
  body('minCompatibilityScore')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Minimum compatibility score must be between 0 and 100'),
    
  body('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
    
  body('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: errors.array()
        }
      });
    }
    next();
  }
];

/**
 * Validation middleware for date curation analytics
 */
export const validateDateCurationAnalytics = [
  query('startDate')
    .optional()
    .isDate()
    .withMessage('Start date must be a valid date'),
    
  query('endDate')
    .optional()
    .isDate()
    .withMessage('End date must be a valid date'),
    
  query('groupBy')
    .optional()
    .isIn(['day', 'week', 'month'])
    .withMessage('Group by must be day, week, or month'),
    
  query('includeUserStats')
    .optional()
    .isBoolean()
    .withMessage('Include user stats must be a boolean'),
    
  query('includeFeedbackStats')
    .optional()
    .isBoolean()
    .withMessage('Include feedback stats must be a boolean'),
    
  query('includeSuccessMetrics')
    .optional()
    .isBoolean()
    .withMessage('Include success metrics must be a boolean'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid query parameters',
          details: errors.array()
        }
      });
    }
    next();
  }
];