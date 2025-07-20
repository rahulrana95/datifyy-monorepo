/**
 * Admin Notifications Routes
 * Real-time notification management for Slack, Email, SMS, and In-App alerts
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */

import { Router } from 'express';
import { DataSource } from 'typeorm';
import { Logger } from '../../infrastructure/logging/Logger';

// Import notification routes
import { createNotificationRoutes } from '../../modules/admin/notification/routes/NotificationRoutes';

/**
 * Factory function to create admin notifications routes
 */
export function createAdminNotificationsRoutes(dataSource: DataSource): Router {
  const logger = Logger.getInstance();
  
  // Use the modular notification routes
  const router = createNotificationRoutes(dataSource);

  // Log route registration
  logger.info('Admin Notifications routes registered successfully', {
    message: 'Using modular notification route structure',
    routeCount: 35,
    categories: ['core', 'bulk', 'templates', 'analytics', 'integrations', 'utilities']
  });

  return router;
}