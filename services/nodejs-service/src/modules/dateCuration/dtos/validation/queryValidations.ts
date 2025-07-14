// =============================================================================
// FIXED: dtos/validation/queryValidations.ts
// =============================================================================

import { Request, Response, NextFunction, RequestHandler } from 'express';
import { query, validationResult, ValidationChain } from 'express-validator';
import { CuratedDateStatus, DateMode } from '@datifyy/shared-types';

/**
 * Validation middleware for getting user dates
 * ✅ FIXED: Proper Express middleware signature
 */
export const validateGetUserDates: (ValidationChain | RequestHandler)[] = [
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

  // ✅ FIXED: Proper middleware function signature
  ((req: Request, res: Response, next: NextFunction): void => {
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
      return; // ✅ FIXED: Return void, not Response
    }
    next();
  }) as RequestHandler
];
