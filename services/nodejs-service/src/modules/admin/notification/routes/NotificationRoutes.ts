/**
 * Notification Routes
 * Integrated notification routes using all controllers
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */

import { Router } from 'express';
import { DataSource } from 'typeorm';
import { Logger } from '../../../../infrastructure/logging/Logger';
import { asyncHandler } from '../../../../infrastructure/utils/asyncHandler';
import { authenticateToken, checkIsAdmin } from '../../../../middlewares/authentication';
import { AuthenticatedRequest } from '../../../../infrastructure/middleware/authentication';

// Import validation middleware
import { 
  validateCreateNotification,
  validateGetNotifications,
  validateUpdateNotification,
  validateTestNotification,
  validateBulkNotification,
  validateCreateNotificationTemplate,
  validateUpdateNotificationTemplate,
  validateUpdateNotificationPreferences,
} from '../../dtos/AdminNotificationsDtos';

// Import controllers
import {
  NotificationController,
  NotificationBulkController,
  NotificationTemplateController,
  NotificationAnalyticsController,
  NotificationIntegrationController,
  NotificationUtilityController
} from '../controllers';

/**
 * Factory function to create notification routes
 */
export function createNotificationRoutes(dataSource: DataSource): Router {
  const router = Router();
  const logger = Logger.getInstance();
  
  // Initialize controllers
  const notificationController = new NotificationController(dataSource, logger);
  const bulkController = new NotificationBulkController(dataSource, logger);
  const templateController = new NotificationTemplateController(dataSource, logger);
  const analyticsController = new NotificationAnalyticsController(dataSource, logger);
  const integrationController = new NotificationIntegrationController(dataSource, logger);
  const utilityController = new NotificationUtilityController(dataSource, logger);

  // Apply middleware to all routes
  router.use(authenticateToken);
  router.use(checkIsAdmin);

  // =============================================================================
  // CORE NOTIFICATION MANAGEMENT
  // =============================================================================

  router.post('/',
    validateCreateNotification,
    asyncHandler(async (req, res, next) => {
      await notificationController.createNotification(req as AuthenticatedRequest, res, next);
    })
  );

  router.get('/',
    validateGetNotifications,
    asyncHandler(async (req, res, next) => {
      await notificationController.getAllNotifications(req as AuthenticatedRequest, res, next);
    })
  );

  router.get('/:notificationId',
    asyncHandler(async (req, res, next) => {
      await notificationController.getNotificationById(req as AuthenticatedRequest, res, next);
    })
  );

  router.put('/:notificationId',
    validateUpdateNotification,
    asyncHandler(async (req, res, next) => {
      await notificationController.updateNotification(req as AuthenticatedRequest, res, next);
    })
  );

  router.delete('/:notificationId',
    asyncHandler(async (req, res, next) => {
      await notificationController.deleteNotification(req as AuthenticatedRequest, res, next);
    })
  );

  router.post('/:notificationId/retry',
    asyncHandler(async (req, res, next) => {
      await notificationController.retryNotification(req as AuthenticatedRequest, res, next);
    })
  );

  // =============================================================================
  // BULK OPERATIONS
  // =============================================================================

  router.post('/bulk-send',
    validateBulkNotification,
    asyncHandler(async (req, res, next) => {
      await bulkController.sendBulkNotifications(req as AuthenticatedRequest, res, next);
    })
  );

  router.post('/bulk-retry',
    asyncHandler(async (req, res, next) => {
      await bulkController.retryBulkNotifications(req as AuthenticatedRequest, res, next);
    })
  );

  router.put('/bulk-update',
    asyncHandler(async (req, res, next) => {
      await bulkController.bulkUpdateNotifications(req as AuthenticatedRequest, res, next);
    })
  );

  // =============================================================================
  // TEMPLATES
  // =============================================================================

  router.get('/templates',
    asyncHandler(async (req, res, next) => {
      await templateController.getAllTemplates(req as AuthenticatedRequest, res, next);
    })
  );

  router.post('/templates',
    validateCreateNotificationTemplate,
    asyncHandler(async (req, res, next) => {
      await templateController.createTemplate(req as AuthenticatedRequest, res, next);
    })
  );

  router.get('/templates/:templateId',
    asyncHandler(async (req, res, next) => {
      await templateController.getTemplateById(req as AuthenticatedRequest, res, next);
    })
  );

  router.put('/templates/:templateId',
    validateUpdateNotificationTemplate,
    asyncHandler(async (req, res, next) => {
      await templateController.updateTemplate(req as AuthenticatedRequest, res, next);
    })
  );

  router.delete('/templates/:templateId',
    asyncHandler(async (req, res, next) => {
      await templateController.deleteTemplate(req as AuthenticatedRequest, res, next);
    })
  );

  router.post('/templates/:templateId/duplicate',
    asyncHandler(async (req, res, next) => {
      await templateController.duplicateTemplate(req as AuthenticatedRequest, res, next);
    })
  );

  router.post('/templates/:templateId/test',
    validateTestNotification,
    asyncHandler(async (req, res, next) => {
      await templateController.testTemplate(req as AuthenticatedRequest, res, next);
    })
  );

  // =============================================================================
  // ANALYTICS
  // =============================================================================

  router.get('/analytics',
    asyncHandler(async (req, res, next) => {
      await analyticsController.getNotificationAnalytics(req as AuthenticatedRequest, res, next);
    })
  );

  router.get('/analytics/performance',
    asyncHandler(async (req, res, next) => {
      await analyticsController.getPerformanceMetrics(req as AuthenticatedRequest, res, next);
    })
  );

  router.get('/analytics/engagement',
    asyncHandler(async (req, res, next) => {
      await analyticsController.getEngagementMetrics(req as AuthenticatedRequest, res, next);
    })
  );

  router.get('/analytics/cost',
    asyncHandler(async (req, res, next) => {
      await analyticsController.getCostAnalysis(req as AuthenticatedRequest, res, next);
    })
  );

  router.get('/analytics/failure-analysis',
    asyncHandler(async (req, res, next) => {
      await analyticsController.getFailureAnalysis(req as AuthenticatedRequest, res, next);
    })
  );

  // =============================================================================
  // INTEGRATIONS
  // =============================================================================

  // Slack Integration
  router.get('/slack/channels',
    asyncHandler(async (req, res, next) => {
      await integrationController.getSlackChannels(req as AuthenticatedRequest, res, next);
    })
  );

  router.post('/slack/test-connection',
    asyncHandler(async (req, res, next) => {
      await integrationController.testSlackConnection(req as AuthenticatedRequest, res, next);
    })
  );

  router.post('/slack/send-message',
    asyncHandler(async (req, res, next) => {
      await integrationController.sendSlackMessage(req as AuthenticatedRequest, res, next);
    })
  );

  router.get('/slack/webhook-status',
    asyncHandler(async (req, res, next) => {
      await integrationController.getSlackWebhookStatus(req as AuthenticatedRequest, res, next);
    })
  );

  // Email Integration
  router.get('/email/delivery-status',
    asyncHandler(async (req, res, next) => {
      await integrationController.getEmailDeliveryStatus(req as AuthenticatedRequest, res, next);
    })
  );

  router.post('/email/test-send',
    validateTestNotification,
    asyncHandler(async (req, res, next) => {
      await integrationController.sendTestEmail(req as AuthenticatedRequest, res, next);
    })
  );

  router.get('/email/bounce-list',
    asyncHandler(async (req, res, next) => {
      await integrationController.getBounceList(req as AuthenticatedRequest, res, next);
    })
  );

  router.post('/email/suppress',
    asyncHandler(async (req, res, next) => {
      await integrationController.suppressEmail(req as AuthenticatedRequest, res, next);
    })
  );

  router.delete('/email/suppress/:email',
    asyncHandler(async (req, res, next) => {
      await integrationController.unsuppressEmail(req as AuthenticatedRequest, res, next);
    })
  );

  // =============================================================================
  // UTILITIES
  // =============================================================================

  router.get('/health',
    asyncHandler(async (req, res, next) => {
      await utilityController.getServiceHealth(req as AuthenticatedRequest, res, next);
    })
  );

  router.post('/purge-old',
    asyncHandler(async (req, res, next) => {
      await utilityController.purgeOldNotifications(req as AuthenticatedRequest, res, next);
    })
  );

  router.post('/refresh-cache',
    asyncHandler(async (req, res, next) => {
      await utilityController.refreshCache(req as AuthenticatedRequest, res, next);
    })
  );

  router.get('/system-status',
    asyncHandler(async (req, res, next) => {
      await utilityController.getSystemStatus(req as AuthenticatedRequest, res, next);
    })
  );

  router.post('/test-all-channels',
    asyncHandler(async (req, res, next) => {
      await utilityController.testAllChannels(req as AuthenticatedRequest, res, next);
    })
  );

  router.get('/queue-status',
    asyncHandler(async (req, res, next) => {
      await utilityController.getQueueStatus(req as AuthenticatedRequest, res, next);
    })
  );

  // Log route registration
  logger.info('Notification routes registered successfully', {
    totalRoutes: 35,
    categories: ['core', 'bulk', 'templates', 'analytics', 'integrations', 'utilities']
  });

  return router;
}