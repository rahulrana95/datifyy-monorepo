
// =============================================================================
// USAGE GUIDE: How to use the refactored Date Curation DTOs
// =============================================================================

/**
 * 📚 Implementation Guide for Date Curation DTOs
 * 
 * This guide shows how to use the refactored DTOs following best practices
 * established in your codebase.
 */

// =============================================================================
// 1. Updated Route Implementation
// =============================================================================

// FILE: routes/dateCuration/dateCurationRoutes.ts (UPDATED)
import { Router } from 'express';
import { DataSource } from 'typeorm';
import { DateCurationController } from '../../modules/dateCuration/controllers/DateCurationController';

// ✅ Import specific validations (following your pattern)
import { 
  validateCreateCuratedDate,
  validateUpdateCuratedDate,
  validateConfirmDate,
  validateCancelDate,
  validateSubmitDateFeedback,
  validateGetUserDates,
} from '../../modules/dateCuration/dtos/validation';

import { asyncHandler } from '../../infrastructure/utils/asyncHandler';
import { authenticateToken, checkIsAdmin } from '../../middlewares/authentication';
import { Logger } from '../../infrastructure/logging/Logger';
import { AuthenticatedRequest } from '../../infrastructure/middleware/authentication';

export function createDateCurationRoutes(dataSource: DataSource): Router {
  const router = Router();
  const logger = Logger.getInstance();
  const dateCurationController = new DateCurationController(dataSource, logger);

  // ✅ Clean, focused route definitions with specific validations
  
  // USER ROUTES
  router.get('/my-dates',
    authenticateToken,
    validateGetUserDates,  // ← Specific validation
    asyncHandler(async (req, res, next) => {
      await dateCurationController.getUserDates(req as AuthenticatedRequest, res, next);
    })
  );

  router.post('/my-dates/:dateId/confirm',
    authenticateToken,
    validateConfirmDate,  // ← Specific validation
    asyncHandler(async (req, res, next) => {
      await dateCurationController.confirmDate(req as AuthenticatedRequest, res, next);
    })
  );

//   router.post('/my-dates/:dateId/cancel',
//     authenticateToken,
//     validateCancelDate,  // ← Specific validation
//     asyncHandler(async (req, res, next) => {
//       await dateCurationController.cancelDate(req as AuthenticatedRequest, res, next);
//     })
//   );

  router.post('/my-dates/:dateId/feedback',
    authenticateToken,
    validateSubmitDateFeedback,  // ← Specific validation
    asyncHandler(async (req, res, next) => {
      await dateCurationController.submitDateFeedback(req as AuthenticatedRequest, res, next);
    })
  );

  // ADMIN ROUTES
  router.post('/admin/curated-dates',
    authenticateToken,
    checkIsAdmin,
    validateCreateCuratedDate,  // ← Specific validation with business rules
    asyncHandler(async (req, res, next) => {
      await dateCurationController.createCuratedDate(req as AuthenticatedRequest, res, next);
    })
  );

//   router.put('/admin/curated-dates/:dateId',
//     authenticateToken,
//     checkIsAdmin,
//     validateUpdateCuratedDate,  // ← Specific validation
//     asyncHandler(async (req, res, next) => {
//       await dateCurationController.updateCuratedDate(req as AuthenticatedRequest, res, next);
//     })
//   );

//   router.get('/admin/curated-dates',
//     authenticateToken,
//     checkIsAdmin,
//     validateAdminGetDates,  // ← Admin-specific validation
//     asyncHandler(async (req, res, next) => {
//       await dateCurationController.getAdminCuratedDates(req as AuthenticatedRequest, res, next);
//     })
//   );

//   router.post('/admin/search-potential-matches',
//     authenticateToken,
//     checkIsAdmin,
//     validateSearchPotentialMatches,  // ← Complex search validation
//     asyncHandler(async (req, res, next) => {
//       await dateCurationController.searchPotentialMatches(req as AuthenticatedRequest, res, next);
//     })
//   );

//   router.get('/admin/analytics/date-curation',
//     authenticateToken,
//     checkIsAdmin,
//     validateDateCurationAnalytics,  // ← Analytics validation
//     asyncHandler(async (req, res, next) => {
//       await dateCurationController.getDateCurationAnalytics(req as AuthenticatedRequest, res, next);
//     })
//   );

  return router;
}
