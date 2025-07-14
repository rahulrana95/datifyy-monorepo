// /**
//  * Admin User Management Routes
//  * Comprehensive user management, verification, moderation, and analytics
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
//   validateGetUsers,
//   validateUpdateUser,
//   validateBulkUserAction,
//   validateVerifyUser,
//   validateUserModeration,
//   validateUserAnalytics,
//   validateExportUsers,
// } from '../../modules/admin/dtos/AdminUserManagementDtos';

// // Import controller (we'll create this)
// import { AdminUserManagementController } from '../../modules/admin/controllers/AdminUserManagementController';

// /**
//  * Factory function to create admin user management routes
//  */
// export function createAdminUserManagementRoutes(dataSource: DataSource): Router {
//   const router = Router();
//   const logger = Logger.getInstance();
  
//   // Initialize controller with dependencies
//   const userManagementController = new AdminUserManagementController(dataSource, logger);

//   // Apply middleware to all routes
//   router.use(authenticateToken); // Ensure user is authenticated
//   router.use(checkIsAdmin);      // Ensure user has admin privileges

//   // =============================================================================
//   // USER LISTING & SEARCH
//   // =============================================================================

//   /**
//    * GET /admin/users
//    * Get all users with advanced filtering and pagination
//    */
//   router.get('/',
//     validateGetUsers,
//     asyncHandler(async (req, res, next) => {
//       await userManagementController.getAllUsers(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/users/:userId
//    * Get specific user details with comprehensive information
//    */
//   router.get('/:userId',
//     asyncHandler(async (req, res, next) => {
//       await userManagementController.getUserById(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * POST /admin/users/search
//    * Advanced user search with multiple criteria
//    */
//   router.post('/search',
//     asyncHandler(async (req, res, next) => {
//       await userManagementController.searchUsers(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/users/profile/:userId
//    * Get complete user profile including private data
//    */
//   router.get('/profile/:userId',
//     asyncHandler(async (req, res, next) => {
//       await userManagementController.getUserProfile(req as AuthenticatedRequest, res, next);
//     })
//   );

//   // =============================================================================
//   // USER MODIFICATION & ACTIONS
//   // =============================================================================

//   /**
//    * PUT /admin/users/:userId
//    * Update user information (admin override)
//    */
//   router.put('/:userId',
//     validateUpdateUser,
//     asyncHandler(async (req, res, next) => {
//       await userManagementController.updateUser(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * POST /admin/users/:userId/ban
//    * Ban user with reason and duration
//    */
//   router.post('/:userId/ban',
//     validateUserModeration,
//     asyncHandler(async (req, res, next) => {
//       await userManagementController.banUser(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * POST /admin/users/:userId/unban
//    * Unban a previously banned user
//    */
//   router.post('/:userId/unban',
//     asyncHandler(async (req, res, next) => {
//       await userManagementController.unbanUser(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * POST /admin/users/:userId/suspend
//    * Temporarily suspend user account
//    */
//   router.post('/:userId/suspend',
//     validateUserModeration,
//     asyncHandler(async (req, res, next) => {
//       await userManagementController.suspendUser(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * POST /admin/users/:userId/activate
//    * Activate suspended or deactivated user
//    */
//   router.post('/:userId/activate',
//     asyncHandler(async (req, res, next) => {
//       await userManagementController.activateUser(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * DELETE /admin/users/:userId
//    * Permanently delete user (with confirmation)
//    */
//   router.delete('/:userId',
//     asyncHandler(async (req, res, next) => {
//       await userManagementController.deleteUser(req as AuthenticatedRequest, res, next);
//     })
//   );

//   // =============================================================================
//   // USER VERIFICATION MANAGEMENT
//   // =============================================================================

//   /**
//    * GET /admin/users/verification/pending
//    * Get users pending verification
//    */
//   router.get('/verification/pending',
//     asyncHandler(async (req, res, next) => {
//       await userManagementController.getPendingVerifications(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * POST /admin/users/:userId/verify/email
//    * Manually verify user email
//    */
//   router.post('/:userId/verify/email',
//     validateVerifyUser,
//     asyncHandler(async (req, res, next) => {
//       await userManagementController.verifyUserEmail(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * POST /admin/users/:userId/verify/phone
//    * Manually verify user phone
//    */
//   router.post('/:userId/verify/phone',
//     validateVerifyUser,
//     asyncHandler(async (req, res, next) => {
//       await userManagementController.verifyUserPhone(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * POST /admin/users/:userId/verify/identity
//    * Manually verify user identity (ID verification)
//    */
//   router.post('/:userId/verify/identity',
//     validateVerifyUser,
//     asyncHandler(async (req, res, next) => {
//       await userManagementController.verifyUserIdentity(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * POST /admin/users/:userId/reject-verification
//    * Reject user verification with reason
//    */
//   router.post('/:userId/reject-verification',
//     asyncHandler(async (req, res, next) => {
//       await userManagementController.rejectVerification(req as AuthenticatedRequest, res, next);
//     })
//   );

//   // =============================================================================
//   // BULK USER OPERATIONS
//   // =============================================================================

//   /**
//    * POST /admin/users/bulk-action
//    * Perform bulk actions on multiple users
//    */
//   router.post('/bulk-action',
//     validateBulkUserAction,
//     asyncHandler(async (req, res, next) => {
//       await userManagementController.performBulkAction(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * POST /admin/users/bulk-verify
//    * Bulk verify multiple users
//    */
//   router.post('/bulk-verify',
//     asyncHandler(async (req, res, next) => {
//       await userManagementController.bulkVerifyUsers(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * POST /admin/users/bulk-message
//    * Send message to multiple users
//    */
//   router.post('/bulk-message',
//     asyncHandler(async (req, res, next) => {
//       await userManagementController.sendBulkMessage(req as AuthenticatedRequest, res, next);
//     })
//   );

//   // =============================================================================
//   // USER ACTIVITY & BEHAVIOR
//   // =============================================================================

//   /**
//    * GET /admin/users/:userId/activity
//    * Get user activity history and analytics
//    */
//   router.get('/:userId/activity',
//     asyncHandler(async (req, res, next) => {
//       await userManagementController.getUserActivity(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/users/:userId/dates-history
//    * Get user's dating history and statistics
//    */
//   router.get('/:userId/dates-history',
//     asyncHandler(async (req, res, next) => {
//       await userManagementController.getUserDatesHistory(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/users/:userId/trust-score-history
//    * Get user's trust score changes over time
//    */
//   router.get('/:userId/trust-score-history',
//     asyncHandler(async (req, res, next) => {
//       await userManagementController.getUserTrustScoreHistory(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/users/:userId/reports
//    * Get reports made by or against this user
//    */
//   router.get('/:userId/reports',
//     asyncHandler(async (req, res, next) => {
//       await userManagementController.getUserReports(req as AuthenticatedRequest, res, next);
//     })
//   );

//   // =============================================================================
//   // USER SEGMENTATION & ANALYTICS
//   // =============================================================================

//   /**
//    * GET /admin/users/analytics/overview
//    * Get comprehensive user analytics
//    */
//   router.get('/analytics/overview',
//     validateUserAnalytics,
//     asyncHandler(async (req, res, next) => {
//       await userManagementController.getUserAnalytics(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/users/analytics/demographics
//    * Get user demographic breakdown
//    */
//   router.get('/analytics/demographics',
//     asyncHandler(async (req, res, next) => {
//       await userManagementController.getUserDemographics(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/users/analytics/engagement
//    * Get user engagement metrics
//    */
//   router.get('/analytics/engagement',
//     asyncHandler(async (req, res, next) => {
//       await userManagementController.getUserEngagement(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/users/analytics/retention
//    * Get user retention analysis
//    */
//   router.get('/analytics/retention',
//     asyncHandler(async (req, res, next) => {
//       await userManagementController.getUserRetention(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/users/segments
//    * Get user segments (active, inactive, high-value, etc.)
//    */
//   router.get('/segments',
//     asyncHandler(async (req, res, next) => {
//       await userManagementController.getUserSegments(req as AuthenticatedRequest, res, next);
//     })
//   );

//   // =============================================================================
//   // CONTENT MODERATION
//   // =============================================================================

//   /**
//    * GET /admin/users/content/flagged
//    * Get users with flagged content
//    */
//   router.get('/content/flagged',
//     asyncHandler(async (req, res, next) => {
//       await userManagementController.getFlaggedContent(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * POST /admin/users/:userId/content/review
//    * Review and moderate user content
//    */
//   router.post('/:userId/content/review',
//     asyncHandler(async (req, res, next) => {
//       await userManagementController.reviewUserContent(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * POST /admin/users/:userId/photos/approve
//    * Approve user photos after review
//    */
//   router.post('/:userId/photos/approve',
//     asyncHandler(async (req, res, next) => {
//       await userManagementController.approveUserPhotos(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * POST /admin/users/:userId/photos/reject
//    * Reject user photos with reason
//    */
//   router.post('/:userId/photos/reject',
//     asyncHandler(async (req, res, next) => {
//       await userManagementController.rejectUserPhotos(req as AuthenticatedRequest, res, next);
//     })
//   );

//   // =============================================================================
//   // SUPPORT & COMMUNICATION
//   // =============================================================================

//   /**
//    * POST /admin/users/:userId/send-message
//    * Send direct message to user
//    */
//   router.post('/:userId/send-message',
//     asyncHandler(async (req, res, next) => {
//       await userManagementController.sendMessageToUser(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/users/:userId/support-tickets
//    * Get user's support ticket history
//    */
//   router.get('/:userId/support-tickets',
//     asyncHandler(async (req, res, next) => {
//       await userManagementController.getUserSupportTickets(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * POST /admin/users/:userId/add-note
//    * Add internal admin note about user
//    */
//   router.post('/:userId/add-note',
//     asyncHandler(async (req, res, next) => {
//       await userManagementController.addUserNote(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/users/:userId/admin-notes
//    * Get all admin notes for user
//    */
//   router.get('/:userId/admin-notes',
//     asyncHandler(async (req, res, next) => {
//       await userManagementController.getUserAdminNotes(req as AuthenticatedRequest, res, next);
//     })
//   );

//   // =============================================================================
//   // EXPORT & REPORTING
//   // =============================================================================

//   /**
//    * POST /admin/users/export
//    * Export user data in various formats
//    */
//   router.post('/export',
//     validateExportUsers,
//     asyncHandler(async (req, res, next) => {
//       await userManagementController.exportUsers(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/users/reports/active-users
//    * Get active users report
//    */
//   router.get('/reports/active-users',
//     asyncHandler(async (req, res, next) => {
//       await userManagementController.getActiveUsersReport(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/users/reports/verification-status
//    * Get verification status report
//    */
//   router.get('/reports/verification-status',
//     asyncHandler(async (req, res, next) => {
//       await userManagementController.getVerificationStatusReport(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/users/reports/moderation-queue
//    * Get moderation queue report
//    */
//   router.get('/reports/moderation-queue',
//     asyncHandler(async (req, res, next) => {
//       await userManagementController.getModerationQueueReport(req as AuthenticatedRequest, res, next);
//     })
//   );

//   // =============================================================================
//   // UTILITIES
//   // =============================================================================

//   /**
//    * GET /admin/users/health
//    * User management service health check
//    */
//   router.get('/health',
//     asyncHandler(async (req, res, next) => {
//       await userManagementController.getServiceHealth(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * POST /admin/users/refresh-cache
//    * Refresh user management cache
//    */
//   router.post('/refresh-cache',
//     asyncHandler(async (req, res, next) => {
//       await userManagementController.refreshCache(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * POST /admin/users/cleanup-inactive
//    * Clean up inactive users (soft delete)
//    */
//   router.post('/cleanup-inactive',
//     asyncHandler(async (req, res, next) => {
//       await userManagementController.cleanupInactiveUsers(req as AuthenticatedRequest, res, next);
//     })
//   );

//   // Log route registration
//   logger.info('Admin User Management routes registered successfully', {
//     routes: [
//       // User Listing & Search
//       'GET /admin/users',
//       'GET /admin/users/:userId',
//       'POST /admin/users/search',
//       'GET /admin/users/profile/:userId',
      
//       // User Actions
//       'PUT /admin/users/:userId',
//       'POST /admin/users/:userId/ban',
//       'POST /admin/users/:userId/unban',
//       'POST /admin/users/:userId/suspend',
//       'POST /admin/users/:userId/activate',
//       'DELETE /admin/users/:userId',
      
//       // Verification
//       'GET /admin/users/verification/pending',
//       'POST /admin/users/:userId/verify/email',
//       'POST /admin/users/:userId/verify/phone',
//       'POST /admin/users/:userId/verify/identity',
//       'POST /admin/users/:userId/reject-verification',
      
//       // Bulk Operations
//       'POST /admin/users/bulk-action',
//       'POST /admin/users/bulk-verify',
//       'POST /admin/users/bulk-message',
      
//       // User Activity
//       'GET /admin/users/:userId/activity',
//       'GET /admin/users/:userId/dates-history',
//       'GET /admin/users/:userId/trust-score-history',
//       'GET /admin/users/:userId/reports',
      
//       // Analytics
//       'GET /admin/users/analytics/overview',
//       'GET /admin/users/analytics/demographics',
//       'GET /admin/users/analytics/engagement',
//       'GET /admin/users/analytics/retention',
//       'GET /admin/users/segments',
      
//       // Content Moderation
//       'GET /admin/users/content/flagged',
//       'POST /admin/users/:userId/content/review',
//       'POST /admin/users/:userId/photos/approve',
//       'POST /admin/users/:userId/photos/reject',
      
//       // Support & Communication
//       'POST /admin/users/:userId/send-message',
//       'GET /admin/users/:userId/support-tickets',
//       'POST /admin/users/:userId/add-note',
//       'GET /admin/users/:userId/admin-notes',
      
//       // Export & Reporting
//       'POST /admin/users/export',
//       'GET /admin/users/reports/active-users',
//       'GET /admin/users/reports/verification-status',
//       'GET /admin/users/reports/moderation-queue',
      
//       // Utilities
//       'GET /admin/users/health',
//       'POST /admin/users/refresh-cache',
//       'POST /admin/users/cleanup-inactive',
//     ],
//     routeCount: 41
//   });

//   return router;
// }