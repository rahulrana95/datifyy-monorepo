import { Router } from 'express';
import { Container } from '../../../infrastructure/di/Container';
import { AdminController } from '../controllers/admin.controller';
import { adminValidation } from '../validation/admin.validation';
import { asyncHandler } from '../../../infrastructure/utils/asyncHandler';
import { authenticate, requireAdmin } from '../../../infrastructure/middleware/authentication';
import { validateRequest } from '../../../infrastructure/middleware/validateRequest';

export async function createAdminRouter(container: Container): Promise<Router> {
  const router = Router();
  
  // Resolve controller from container
  const adminController = await container.resolve<AdminController>('AdminController');

  // All admin routes require authentication and admin privileges
  router.use(authenticate());
  router.use(requireAdmin());

  // Get all tables
  router.get(
    '/tables',
    asyncHandler((req, res, next) => adminController.getAllTables(req, res, next))
  );

  // Get all enums
  router.get(
    '/enums',
    asyncHandler((req, res, next) => adminController.getAllEnums(req, res, next))
  );

  // Update enums
  router.put(
    '/enums',
    validateRequest(adminValidation.updateEnums),
    asyncHandler((req, res, next) => adminController.updateEnums(req, res, next))
  );

  // Get user email statuses
  router.get(
    '/email-statuses',
    asyncHandler((req, res, next) => adminController.getUserEmailStatuses(req, res, next))
  );

  return router;
}
