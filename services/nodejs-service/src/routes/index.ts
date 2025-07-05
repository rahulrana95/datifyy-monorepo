import { Router } from 'express';
import { DataSource } from 'typeorm';
import { createAuthRoutes } from './auth/authRoutes';
import { Logger } from '../infrastructure/logging/Logger';

/**
 * Main application routes factory
 */
export function createAppRoutes(dataSource: DataSource): Router {
  const router = Router();
  const logger = Logger.getInstance();

  // Health check route (no auth required)
  router.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });

  // Authentication routes
  router.use('/auth', createAuthRoutes(dataSource));

  // TODO: Add other route modules here
  // router.use('/events', createEventRoutes(dataSource));
  // router.use('/users', createUserRoutes(dataSource));
  // router.use('/admin', createAdminRoutes(dataSource));

  logger.info('Application routes initialized successfully');

  return router;
}
