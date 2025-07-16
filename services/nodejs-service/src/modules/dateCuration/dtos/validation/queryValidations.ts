// services/nodejs-service/src/modules/dateCuration/dtos/validation/queryValidations.ts

import { Request, Response, NextFunction } from 'express';
import { query, validationResult, ValidationChain } from 'express-validator';
import { } from '../../../../proto-types/dating/curated_dates';
import { CuratedDateStatus, DateMode } from '../../../../proto-types';

/**
 * Validation rules for getting user dates
 */
const getUserDatesValidationRules: ValidationChain[] = [
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
    
  query('mode')
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        const modes = value.split(',');
        const validModes = Object.values(DateMode);
        for (const mode of modes) {
          if (!validModes.includes(mode as DateMode)) {
            throw new Error(`Invalid mode: ${mode}`);
          }
        }
      }
      return true;
    }),
    
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
    
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date'),
    
  query('includeHistory')
    .optional()
    .isBoolean()
    .withMessage('Include history must be a boolean'),
    
  query('includeFeedback')
    .optional()
    .isBoolean()
    .withMessage('Include feedback must be a boolean'),

  query('includePartnerInfo')
    .optional()
    .isBoolean()
    .withMessage('Include partner info must be a boolean'),
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
        message: 'Invalid query parameters',
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
 * Complete validation middleware for getting user dates
 */
export const validateGetUserDates = [
  ...getUserDatesValidationRules,
  handleValidationErrors
];

/**
 * Validation rules for admin getting dates
 */
const adminGetDatesValidationRules: ValidationChain[] = [
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

  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
    
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date'),

  query('includeWorkflow')
    .optional()
    .isBoolean()
    .withMessage('Include workflow must be a boolean'),

  query('includeFeedback')
    .optional()
    .isBoolean()
    .withMessage('Include feedback must be a boolean'),
];

/**
 * Complete validation middleware for admin getting dates
 */
export const validateAdminGetDates = [
  ...adminGetDatesValidationRules,
  handleValidationErrors
];

/**
 * Validation rules for searching potential matches
 */
const searchPotentialMatchesValidationRules: ValidationChain[] = [
  query('userId')
    .isInt({ min: 1 })
    .withMessage('User ID must be a positive integer'),
    
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
    
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
    
  query('ageRange.min')
    .optional()
    .isInt({ min: 18, max: 100 })
    .withMessage('Minimum age must be between 18 and 100'),
    
  query('ageRange.max')
    .optional()
    .isInt({ min: 18, max: 100 })
    .withMessage('Maximum age must be between 18 and 100'),
    
  query('locationRadius')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Location radius must be between 1 and 1000 km'),
    
  query('minCompatibilityScore')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Minimum compatibility score must be between 0 and 100'),

  query('excludeRecentDates')
    .optional()
    .isBoolean()
    .withMessage('Exclude recent dates must be a boolean'),

  query('includeCompatibilityDetails')
    .optional()
    .isBoolean()
    .withMessage('Include compatibility details must be a boolean'),
];

/**
 * Complete validation middleware for searching potential matches
 */
export const validateSearchPotentialMatches = [
  ...searchPotentialMatchesValidationRules,
  handleValidationErrors
];

/**
 * Validation rules for date curation analytics
 */
const dateCurationAnalyticsValidationRules: ValidationChain[] = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
    
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date'),
    
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
];

/**
 * Complete validation middleware for date curation analytics
 */
export const validateDateCurationAnalytics = [
  ...dateCurationAnalyticsValidationRules,
  handleValidationErrors
];