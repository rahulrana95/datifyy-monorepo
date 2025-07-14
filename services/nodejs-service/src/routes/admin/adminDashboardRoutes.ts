/**
 * Admin Dashboard Routes
 * Core dashboard overview, metrics, alerts, and system health monitoring
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */

import { Router } from 'express';
import { DataSource } from 'typeorm';
import { Logger } from '../../infrastructure/logging/Logger';
import { asyncHandler } from '../../infrastructure/utils/asyncHandler';
import { authenticateToken, checkIsAdmin } from '../../middlewares/authentication';
import { AuthenticatedAdminRequest } from '../../infrastructure/middleware/authentication';

// Import validation middleware (we'll create these)
import { 
  validateGetDashboardOverview,
  validateGetMetricTrends,
  validateGetAdminActivity,
  validateGetAvailabilityAnalytics,
} from '../../modules/admin/dtos/AdminDashboardDtos';

// Import controller (we'll create this)
import { AdminDashboardController } from '../../modules/admin/controllers/AdminDashboardController';

/**
 * Factory function to create admin dashboard routes
 */
export function createAdminDashboardRoutes(dataSource: DataSource): Router {
  const router = Router();
  const logger = Logger.getInstance();
  
  // Initialize controller with dependencies
  const dashboardController = new AdminDashboardController(dataSource, logger);

  // Apply middleware to all routes
  router.use(authenticateToken); // Ensure user is authenticated
  router.use(checkIsAdmin);      // Ensure user has admin privileges

  // =============================================================================
  // DASHBOARD OVERVIEW & METRICS
  // =============================================================================

  /**
   * GET /admin/dashboard/overview
   * Get comprehensive dashboard overview with all key metrics
   */
  router.get('/overview',
    validateGetDashboardOverview,
    asyncHandler(async (req, res, next) => {
      await dashboardController.getDashboardOverview(req as AuthenticatedAdminRequest, res, next);
    })
  );

  /**
   * GET /admin/dashboard/metrics/trends
   * Get metric trends for charts and graphs
   */
  router.get('/metrics/trends',
    validateGetMetricTrends,
    asyncHandler(async (req, res, next) => {
      await dashboardController.getMetricTrends(req as AuthenticatedAdminRequest, res, next);
    })
  );

  /**
   * GET /admin/dashboard/metrics/real-time
   * Get real-time dashboard metrics
   */
  router.get('/metrics/real-time',
    asyncHandler(async (req, res, next) => {
      await dashboardController.getRealTimeMetrics(req as AuthenticatedAdminRequest, res, next);
    })
  );

  /**
   * GET /admin/dashboard/metrics/summary
   * Get dashboard metrics summary for widgets
   */
  router.get('/metrics/summary',
    asyncHandler(async (req, res, next) => {
      await dashboardController.getMetricsSummary(req as AuthenticatedAdminRequest, res, next);
    })
  );

  // =============================================================================
  // USER METRICS & ANALYTICS
  // =============================================================================

  /**
   * GET /admin/dashboard/users/metrics
   * Get comprehensive user metrics
   */
  router.get('/users/metrics',
    asyncHandler(async (req, res, next) => {
      await dashboardController.getUserMetrics(req as AuthenticatedAdminRequest, res, next);
    })
  );

  /**
   * GET /admin/dashboard/users/activity
   * Get user activity analytics
   */
  router.get('/users/activity',
    asyncHandler(async (req, res, next) => {
      await dashboardController.getUserActivity(req as AuthenticatedAdminRequest, res, next);
    })
  );

  /**
   * GET /admin/dashboard/users/verification-status
   * Get user verification status overview
   */
  router.get('/users/verification-status',
    asyncHandler(async (req, res, next) => {
      await dashboardController.getUserVerificationStatus(req as AuthenticatedAdminRequest, res, next);
    })
  );

  /**
   * GET /admin/dashboard/users/geographic-distribution
   * Get user geographic distribution
   */
  router.get('/users/geographic-distribution',
    asyncHandler(async (req, res, next) => {
      await dashboardController.getUserGeographicDistribution(req as AuthenticatedAdminRequest, res, next);
    })
  );

  // =============================================================================
  // DATE METRICS & ANALYTICS
  // =============================================================================

  /**
   * GET /admin/dashboard/dates/metrics
   * Get comprehensive date metrics
   */
  router.get('/dates/metrics',
    asyncHandler(async (req, res, next) => {
      await dashboardController.getDateMetrics(req as AuthenticatedAdminRequest, res, next);
    })
  );

  /**
   * GET /admin/dashboard/dates/success-rates
   * Get date success rate analytics
   */
  router.get('/dates/success-rates',
    asyncHandler(async (req, res, next) => {
      await dashboardController.getDateSuccessRates(req as AuthenticatedAdminRequest, res, next);
    })
  );

  /**
   * GET /admin/dashboard/dates/completion-trends
   * Get date completion trends over time
   */
  router.get('/dates/completion-trends',
    asyncHandler(async (req, res, next) => {
      await dashboardController.getDateCompletionTrends(req as AuthenticatedAdminRequest, res, next);
    })
  );

  /**
   * GET /admin/dashboard/dates/pending-actions
   * Get dates requiring admin action
   */
  router.get('/dates/pending-actions',
    asyncHandler(async (req, res, next) => {
      await dashboardController.getDatesPendingAction(req as AuthenticatedAdminRequest, res, next);
    })
  );

  // =============================================================================
  // REVENUE METRICS (Dashboard Summary)
  // =============================================================================

  /**
   * GET /admin/dashboard/revenue/summary
   * Get revenue summary for dashboard
   */
  router.get('/revenue/summary',
    asyncHandler(async (req, res, next) => {
      await dashboardController.getRevenueSummary(req as AuthenticatedAdminRequest, res, next);
    })
  );

  /**
   * GET /admin/dashboard/revenue/trends
   * Get revenue trends for dashboard charts
   */
  router.get('/revenue/trends',
    asyncHandler(async (req, res, next) => {
      await dashboardController.getRevenueTrends(req as AuthenticatedAdminRequest, res, next);
    })
  );

  /**
   * GET /admin/dashboard/revenue/top-performers
   * Get top performing cities/users by revenue
   */
  router.get('/revenue/top-performers',
    asyncHandler(async (req, res, next) => {
      await dashboardController.getRevenueTopPerformers(req as AuthenticatedAdminRequest, res, next);
    })
  );

  // =============================================================================
  // ADMIN ACTIVITY & AUDIT
  // =============================================================================

  /**
   * GET /admin/dashboard/admin-activity
   * Get admin activity logs and summary
   */
  router.get('/admin-activity',
    validateGetAdminActivity,
    asyncHandler(async (req, res, next) => {
      await dashboardController.getAdminActivity(req as AuthenticatedAdminRequest, res, next);
    })
  );

  /**
   * GET /admin/dashboard/admin-activity/recent
   * Get recent admin activities for dashboard
   */
  router.get('/admin-activity/recent',
    asyncHandler(async (req, res, next) => {
      await dashboardController.getRecentAdminActivity(req as AuthenticatedAdminRequest, res, next);
    })
  );

  /**
   * GET /admin/dashboard/admin-activity/summary
   * Get admin activity summary statistics
   */
  router.get('/admin-activity/summary',
    asyncHandler(async (req, res, next) => {
      await dashboardController.getAdminActivitySummary(req as AuthenticatedAdminRequest, res, next);
    })
  );

  // =============================================================================
  // ALERTS & NOTIFICATIONS
  // =============================================================================

  /**
   * GET /admin/dashboard/alerts
   * Get dashboard alerts requiring attention
   */
  router.get('/alerts',
    asyncHandler(async (req, res, next) => {
      await dashboardController.getDashboardAlerts(req as AuthenticatedAdminRequest, res, next);
    })
  );

  /**
   * PUT /admin/dashboard/alerts/:alertId/acknowledge
   * Acknowledge/dismiss an alert
   */
  router.put('/alerts/:alertId/acknowledge',
    asyncHandler(async (req, res, next) => {
      await dashboardController.acknowledgeAlert(req as AuthenticatedAdminRequest, res, next);
    })
  );

  /**
   * GET /admin/dashboard/alerts/critical
   * Get critical alerts requiring immediate attention
   */
  router.get('/alerts/critical',
    asyncHandler(async (req, res, next) => {
      await dashboardController.getCriticalAlerts(req as AuthenticatedAdminRequest, res, next);
    })
  );

  // =============================================================================
  // SYSTEM HEALTH & MONITORING
  // =============================================================================

  /**
   * GET /admin/dashboard/system/health
   * Get comprehensive system health status
   */
  router.get('/system/health',
    asyncHandler(async (req, res, next) => {
      await dashboardController.getSystemHealth(req as AuthenticatedAdminRequest, res, next);
    })
  );

  /**
   * GET /admin/dashboard/system/performance
   * Get system performance metrics
   */
  router.get('/system/performance',
    asyncHandler(async (req, res, next) => {
      await dashboardController.getSystemPerformance(req as AuthenticatedAdminRequest, res, next);
    })
  );

  /**
   * GET /admin/dashboard/system/services-status
   * Get individual service health status
   */
  router.get('/system/services-status',
    asyncHandler(async (req, res, next) => {
      await dashboardController.getServicesStatus(req as AuthenticatedAdminRequest, res, next);
    })
  );

  // =============================================================================
  // EXPORT & REPORTING
  // =============================================================================

  /**
   * POST /admin/dashboard/export/metrics
   * Export dashboard metrics data
   */
  router.post('/export/metrics',
    asyncHandler(async (req, res, next) => {
      await dashboardController.exportMetrics(req as AuthenticatedAdminRequest, res, next);
    })
  );

  /**
   * GET /admin/dashboard/reports/daily-summary
   * Get daily summary report
   */
  router.get('/reports/daily-summary',
    asyncHandler(async (req, res, next) => {
      await dashboardController.getDailySummaryReport(req as AuthenticatedAdminRequest, res, next);
    })
  );

  /**
   * GET /admin/dashboard/reports/weekly-summary
   * Get weekly summary report
   */
  router.get('/reports/weekly-summary',
    asyncHandler(async (req, res, next) => {
      await dashboardController.getWeeklySummaryReport(req as AuthenticatedAdminRequest, res, next);
    })
  );

  // =============================================================================
  // CACHE & UTILITIES
  // =============================================================================

  /**
   * POST /admin/dashboard/refresh-cache
   * Refresh dashboard cache
   */
  router.post('/refresh-cache',
    asyncHandler(async (req, res, next) => {
      await dashboardController.refreshDashboardCache(req as AuthenticatedAdminRequest, res, next);
    })
  );

  /**
   * GET /admin/dashboard/health
   * Dashboard service health check
   */
  router.get('/health',
    asyncHandler(async (req, res, next) => {
      await dashboardController.getServiceHealth(req as AuthenticatedAdminRequest, res, next);
    })
  );

  // Log route registration
  logger.info('Admin Dashboard routes registered successfully', {
    routes: [
      // Overview & Metrics
      'GET /admin/dashboard/overview',
      'GET /admin/dashboard/metrics/trends',
      'GET /admin/dashboard/metrics/real-time',
      'GET /admin/dashboard/metrics/summary',
      
      // User Metrics
      'GET /admin/dashboard/users/metrics',
      'GET /admin/dashboard/users/activity',
      'GET /admin/dashboard/users/verification-status',
      'GET /admin/dashboard/users/geographic-distribution',
      
      // Date Metrics
      'GET /admin/dashboard/dates/metrics',
      'GET /admin/dashboard/dates/success-rates',
      'GET /admin/dashboard/dates/completion-trends',
      'GET /admin/dashboard/dates/pending-actions',
      
      // Revenue Summary
      'GET /admin/dashboard/revenue/summary',
      'GET /admin/dashboard/revenue/trends',
      'GET /admin/dashboard/revenue/top-performers',
      
      // Admin Activity
      'GET /admin/dashboard/admin-activity',
      'GET /admin/dashboard/admin-activity/recent',
      'GET /admin/dashboard/admin-activity/summary',
      
      // Alerts
      'GET /admin/dashboard/alerts',
      'PUT /admin/dashboard/alerts/:alertId/acknowledge',
      'GET /admin/dashboard/alerts/critical',
      
      // System Health
      'GET /admin/dashboard/system/health',
      'GET /admin/dashboard/system/performance',
      'GET /admin/dashboard/system/services-status',
      
      // Export & Reports
      'POST /admin/dashboard/export/metrics',
      'GET /admin/dashboard/reports/daily-summary',
      'GET /admin/dashboard/reports/weekly-summary',
      
      // Utilities
      'POST /admin/dashboard/refresh-cache',
      'GET /admin/dashboard/health',
    ],
    routeCount: 28
  });

  return router;
}