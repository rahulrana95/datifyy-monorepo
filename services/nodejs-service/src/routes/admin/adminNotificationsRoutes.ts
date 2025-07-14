// /**
//  * Admin Notifications Routes
//  * Real-time notification management for Slack, Email, SMS, and In-App alerts
//  * 
//  * @author Datifyy Engineering Team
//  * @since 1.0.0
//  */

// import { Router } from 'express';
// import { DataSource } from 'typeorm';
// import { Logger } from '../../infrastructure/logging/Logger';
// import { asyncHandler } from '../../infrastructure/utils/asyncHandler';
// import { authenticateToken, checkIsAdmin } from '../../middlewares/authentication';
// import { AuthenticatedRequest } from '../../infrastructure/middleware/authentication';

// // Import validation middleware (we'll create these)
// import { 
//   validateCreateNotification,
//   validateGetNotifications,
//   validateUpdateNotification,
//   validateTestNotification,
//   validateBulkNotification,
//   validateCreateNotificationTemplate,
//   validateUpdateNotificationTemplate,
//   validateUpdateNotificationPreferences,
// } from '../../modules/admin/dtos/AdminNotificationsDtos';

// // Import controller (we'll create this)
// import { AdminNotificationsController } from '../../modules/admin/controllers/AdminNotificationsController';

// /**
//  * Factory function to create admin notifications routes
//  */
// export function createAdminNotificationsRoutes(dataSource: DataSource): Router {
//   const router = Router();
//   const logger = Logger.getInstance();
  
//   // Initialize controller with dependencies
//   const notificationsController = new AdminNotificationsController(dataSource, logger);

//   // Apply middleware to all routes
//   router.use(authenticateToken); // Ensure user is authenticated
//   router.use(checkIsAdmin);      // Ensure user has admin privileges

//   // =============================================================================
//   // NOTIFICATION MANAGEMENT
//   // =============================================================================

//   /**
//    * POST /admin/notifications
//    * Create and send a new notification
//    */
//   router.post('/',
//     validateCreateNotification,
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.createNotification(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/notifications
//    * Get all notifications with filtering and pagination
//    */
//   router.get('/',
//     validateGetNotifications,
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.getAllNotifications(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/notifications/:notificationId
//    * Get specific notification details
//    */
//   router.get('/:notificationId',
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.getNotificationById(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * PUT /admin/notifications/:notificationId
//    * Update notification status or details
//    */
//   router.put('/:notificationId',
//     validateUpdateNotification,
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.updateNotification(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * DELETE /admin/notifications/:notificationId
//    * Delete a notification
//    */
//   router.delete('/:notificationId',
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.deleteNotification(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * POST /admin/notifications/:notificationId/retry
//    * Retry sending a failed notification
//    */
//   router.post('/:notificationId/retry',
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.retryNotification(req as AuthenticatedRequest, res, next);
//     })
//   );

//   // =============================================================================
//   // BULK NOTIFICATION OPERATIONS
//   // =============================================================================

//   /**
//    * POST /admin/notifications/bulk-send
//    * Send notifications to multiple recipients
//    */
//   router.post('/bulk-send',
//     validateBulkNotification,
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.sendBulkNotifications(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * POST /admin/notifications/bulk-retry
//    * Retry multiple failed notifications
//    */
//   router.post('/bulk-retry',
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.retryBulkNotifications(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * PUT /admin/notifications/bulk-update
//    * Update multiple notifications at once
//    */
//   router.put('/bulk-update',
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.bulkUpdateNotifications(req as AuthenticatedRequest, res, next);
//     })
//   );

//   // =============================================================================
//   // NOTIFICATION TEMPLATES
//   // =============================================================================

//   /**
//    * GET /admin/notifications/templates
//    * Get all notification templates
//    */
//   router.get('/templates',
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.getAllTemplates(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * POST /admin/notifications/templates
//    * Create a new notification template
//    */
//   router.post('/templates',
//     validateCreateNotificationTemplate,
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.createTemplate(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/notifications/templates/:templateId
//    * Get specific template details
//    */
//   router.get('/templates/:templateId',
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.getTemplateById(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * PUT /admin/notifications/templates/:templateId
//    * Update notification template
//    */
//   router.put('/templates/:templateId',
//     validateUpdateNotificationTemplate,
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.updateTemplate(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * DELETE /admin/notifications/templates/:templateId
//    * Delete notification template
//    */
//   router.delete('/templates/:templateId',
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.deleteTemplate(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * POST /admin/notifications/templates/:templateId/duplicate
//    * Duplicate an existing template
//    */
//   router.post('/templates/:templateId/duplicate',
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.duplicateTemplate(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * POST /admin/notifications/templates/:templateId/test
//    * Test a notification template
//    */
//   router.post('/templates/:templateId/test',
//     validateTestNotification,
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.testTemplate(req as AuthenticatedRequest, res, next);
//     })
//   );

//   // =============================================================================
//   // SLACK INTEGRATION
//   // =============================================================================

//   /**
//    * GET /admin/notifications/slack/channels
//    * Get available Slack channels
//    */
//   router.get('/slack/channels',
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.getSlackChannels(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * POST /admin/notifications/slack/test-connection
//    * Test Slack workspace connection
//    */
//   router.post('/slack/test-connection',
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.testSlackConnection(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * POST /admin/notifications/slack/send-message
//    * Send a direct Slack message
//    */
//   router.post('/slack/send-message',
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.sendSlackMessage(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/notifications/slack/webhook-status
//    * Check Slack webhook status
//    */
//   router.get('/slack/webhook-status',
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.getSlackWebhookStatus(req as AuthenticatedRequest, res, next);
//     })
//   );

//   // =============================================================================
//   // EMAIL INTEGRATION
//   // =============================================================================

//   /**
//    * GET /admin/notifications/email/delivery-status
//    * Get email delivery statistics
//    */
//   router.get('/email/delivery-status',
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.getEmailDeliveryStatus(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * POST /admin/notifications/email/test-send
//    * Send a test email
//    */
//   router.post('/email/test-send',
//     validateTestNotification,
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.sendTestEmail(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/notifications/email/bounce-list
//    * Get bounced email addresses
//    */
//   router.get('/email/bounce-list',
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.getBounceList(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * POST /admin/notifications/email/suppress
//    * Add email to suppression list
//    */
//   router.post('/email/suppress',
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.suppressEmail(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * DELETE /admin/notifications/email/suppress/:email
//    * Remove email from suppression list
//    */
//   router.delete('/email/suppress/:email',
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.unsuppressEmail(req as AuthenticatedRequest, res, next);
//     })
//   );

//   // =============================================================================
//   // SMS INTEGRATION
//   // =============================================================================

//   /**
//    * POST /admin/notifications/sms/send
//    * Send SMS notification
//    */
//   router.post('/sms/send',
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.sendSMSNotification(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/notifications/sms/delivery-reports
//    * Get SMS delivery reports
//    */
//   router.get('/sms/delivery-reports',
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.getSMSDeliveryReports(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/notifications/sms/cost-analysis
//    * Get SMS cost analysis
//    */
//   router.get('/sms/cost-analysis',
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.getSMSCostAnalysis(req as AuthenticatedRequest, res, next);
//     })
//   );

//   // =============================================================================
//   // ADMIN PREFERENCES & SETTINGS
//   // =============================================================================

//   /**
//    * GET /admin/notifications/preferences
//    * Get admin notification preferences
//    */
//   router.get('/preferences',
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.getAdminPreferences(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * PUT /admin/notifications/preferences
//    * Update admin notification preferences
//    */
//   router.put('/preferences',
//     validateUpdateNotificationPreferences,
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.updateAdminPreferences(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/notifications/preferences/:adminId
//    * Get specific admin's notification preferences
//    */
//   router.get('/preferences/:adminId',
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.getAdminPreferencesById(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * PUT /admin/notifications/preferences/:adminId
//    * Update specific admin's notification preferences
//    */
//   router.put('/preferences/:adminId',
//     validateUpdateNotificationPreferences,
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.updateAdminPreferencesById(req as AuthenticatedRequest, res, next);
//     })
//   );

//   // =============================================================================
//   // ANALYTICS & REPORTING
//   // =============================================================================

//   /**
//    * GET /admin/notifications/analytics
//    * Get comprehensive notification analytics
//    */
//   router.get('/analytics',
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.getNotificationAnalytics(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/notifications/analytics/performance
//    * Get notification performance metrics
//    */
//   router.get('/analytics/performance',
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.getPerformanceMetrics(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/notifications/analytics/engagement
//    * Get notification engagement metrics
//    */
//   router.get('/analytics/engagement',
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.getEngagementMetrics(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/notifications/analytics/cost
//    * Get notification cost analysis
//    */
//   router.get('/analytics/cost',
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.getCostAnalysis(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/notifications/analytics/failure-analysis
//    * Get notification failure analysis
//    */
//   router.get('/analytics/failure-analysis',
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.getFailureAnalysis(req as AuthenticatedRequest, res, next);
//     })
//   );

//   // =============================================================================
//   // AUTOMATION & TRIGGERS
//   // =============================================================================

//   /**
//    * GET /admin/notifications/triggers
//    * Get all notification triggers
//    */
//   router.get('/triggers',
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.getAllTriggers(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * POST /admin/notifications/triggers
//    * Create new notification trigger
//    */
//   router.post('/triggers',
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.createTrigger(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * PUT /admin/notifications/triggers/:triggerId
//    * Update notification trigger
//    */
//   router.put('/triggers/:triggerId',
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.updateTrigger(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * DELETE /admin/notifications/triggers/:triggerId
//    * Delete notification trigger
//    */
//   router.delete('/triggers/:triggerId',
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.deleteTrigger(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * POST /admin/notifications/triggers/:triggerId/test
//    * Test notification trigger
//    */
//   router.post('/triggers/:triggerId/test',
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.testTrigger(req as AuthenticatedRequest, res, next);
//     })
//   );

//   // =============================================================================
//   // SCHEDULED NOTIFICATIONS
//   // =============================================================================

//   /**
//    * GET /admin/notifications/scheduled
//    * Get all scheduled notifications
//    */
//   router.get('/scheduled',
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.getScheduledNotifications(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * POST /admin/notifications/schedule
//    * Schedule a notification for later
//    */
//   router.post('/schedule',
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.scheduleNotification(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * PUT /admin/notifications/scheduled/:notificationId
//    * Update scheduled notification
//    */
//   router.put('/scheduled/:notificationId',
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.updateScheduledNotification(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * DELETE /admin/notifications/scheduled/:notificationId
//    * Cancel scheduled notification
//    */
//   router.delete('/scheduled/:notificationId',
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.cancelScheduledNotification(req as AuthenticatedRequest, res, next);
//     })
//   );

//   // =============================================================================
//   // REAL-TIME & WEBHOOKS
//   // =============================================================================

//   /**
//    * GET /admin/notifications/real-time/status
//    * Get real-time notification status
//    */
//   router.get('/real-time/status',
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.getRealTimeStatus(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * POST /admin/notifications/webhooks/slack
//    * Handle Slack webhook events
//    */
//   router.post('/webhooks/slack',
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.handleSlackWebhook(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * POST /admin/notifications/webhooks/email
//    * Handle email delivery webhooks
//    */
//   router.post('/webhooks/email',
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.handleEmailWebhook(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * POST /admin/notifications/webhooks/sms
//    * Handle SMS delivery webhooks
//    */
//   router.post('/webhooks/sms',
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.handleSMSWebhook(req as AuthenticatedRequest, res, next);
//     })
//   );

//   // =============================================================================
//   // UTILITY ENDPOINTS
//   // =============================================================================

//   /**
//    * GET /admin/notifications/health
//    * Notification service health check
//    */
//   router.get('/health',
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.getServiceHealth(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * POST /admin/notifications/purge-old
//    * Purge old notifications (cleanup)
//    */
//   router.post('/purge-old',
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.purgeOldNotifications(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * POST /admin/notifications/refresh-cache
//    * Refresh notification cache
//    */
//   router.post('/refresh-cache',
//     asyncHandler(async (req, res, next) => {
//       await notificationsController.refreshCache(req as AuthenticatedRequest, res, next);
//     })
//   );

//   // Log route registration
//   logger.info('Admin Notifications routes registered successfully', {
//     routes: [
//       // Core Notification Management
//       'POST /admin/notifications',
//       'GET /admin/notifications',
//       'GET /admin/notifications/:notificationId',
//       'PUT /admin/notifications/:notificationId',
//       'DELETE /admin/notifications/:notificationId',
//       'POST /admin/notifications/:notificationId/retry',
      
//       // Bulk Operations
//       'POST /admin/notifications/bulk-send',
//       'POST /admin/notifications/bulk-retry',
//       'PUT /admin/notifications/bulk-update',
      
//       // Templates
//       'GET /admin/notifications/templates',
//       'POST /admin/notifications/templates',
//       'GET /admin/notifications/templates/:templateId',
//       'PUT /admin/notifications/templates/:templateId',
//       'DELETE /admin/notifications/templates/:templateId',
//       'POST /admin/notifications/templates/:templateId/duplicate',
//       'POST /admin/notifications/templates/:templateId/test',
      
//       // Slack Integration
//       'GET /admin/notifications/slack/channels',
//       'POST /admin/notifications/slack/test-connection',
//       'POST /admin/notifications/slack/send-message',
//       'GET /admin/notifications/slack/webhook-status',
      
//       // Email Integration
//       'GET /admin/notifications/email/delivery-status',
//       'POST /admin/notifications/email/test-send',
//       'GET /admin/notifications/email/bounce-list',
//       'POST /admin/notifications/email/suppress',
//       'DELETE /admin/notifications/email/suppress/:email',
      
//       // SMS Integration
//       'POST /admin/notifications/sms/send',
//       'GET /admin/notifications/sms/delivery-reports',
//       'GET /admin/notifications/sms/cost-analysis',
      
//       // Preferences
//       'GET /admin/notifications/preferences',
//       'PUT /admin/notifications/preferences',
//       'GET /admin/notifications/preferences/:adminId',
//       'PUT /admin/notifications/preferences/:adminId',
      
//       // Analytics
//       'GET /admin/notifications/analytics',
//       'GET /admin/notifications/analytics/performance',
//       'GET /admin/notifications/analytics/engagement',
//       'GET /admin/notifications/analytics/cost',
//       'GET /admin/notifications/analytics/failure-analysis',
      
//       // Automation
//       'GET /admin/notifications/triggers',
//       'POST /admin/notifications/triggers',
//       'PUT /admin/notifications/triggers/:triggerId',
//       'DELETE /admin/notifications/triggers/:triggerId',
//       'POST /admin/notifications/triggers/:triggerId/test',
      
//       // Scheduling
//       'GET /admin/notifications/scheduled',
//       'POST /admin/notifications/schedule',
//       'PUT /admin/notifications/scheduled/:notificationId',
//       'DELETE /admin/notifications/scheduled/:notificationId',
      
//       // Real-time & Webhooks
//       'GET /admin/notifications/real-time/status',
//       'POST /admin/notifications/webhooks/slack',
//       'POST /admin/notifications/webhooks/email',
//       'POST /admin/notifications/webhooks/sms',
      
//       // Utilities
//       'GET /admin/notifications/health',
//       'POST /admin/notifications/purge-old',
//       'POST /admin/notifications/refresh-cache',
//     ],
//     routeCount: 50
//   });

//   return router;
// }