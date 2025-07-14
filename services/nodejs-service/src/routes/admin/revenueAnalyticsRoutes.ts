// /**
//  * Admin Revenue Analytics Routes
//  * World-class revenue tracking, analytics, and financial reporting
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
//   validateGetRevenueAnalytics,
//   validateGetTransactions,
//   validateRevenueExport,
//   validateCreateRevenueAlert,
//   validateUpdateRevenueAlert,
//   validateProcessRefund,
//   validateReviewTransaction,
// } from '../../modules/admin/dtos/RevenueAnalyticsDtos';

// // Import controller (we'll create this)
// import { AdminRevenueAnalyticsController } from '../../modules/admin/controllers/AdminRevenueAnalyticsController';

// /**
//  * Factory function to create admin revenue analytics routes
//  */
// export function createAdminRevenueAnalyticsRoutes(dataSource: DataSource): Router {
//   const router = Router();
//   const logger = Logger.getInstance();
  
//   // Initialize controller with dependencies
//   const revenueController = new AdminRevenueAnalyticsController(dataSource, logger);

//   // Apply middleware to all routes
//   router.use(authenticateToken); // Ensure user is authenticated
//   router.use(checkIsAdmin);      // Ensure user has admin privileges

//   // =============================================================================
//   // REVENUE OVERVIEW & ANALYTICS
//   // =============================================================================

//   /**
//    * GET /admin/revenue/overview
//    * Get comprehensive revenue analytics overview
//    */
//   router.get('/overview',
//     validateGetRevenueAnalytics,
//     asyncHandler(async (req, res, next) => {
//       await revenueController.getRevenueOverview(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/revenue/real-time
//    * Get real-time revenue metrics for live dashboard
//    */
//   router.get('/real-time',
//     asyncHandler(async (req, res, next) => {
//       await revenueController.getRealTimeRevenue(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/revenue/trends
//    * Get revenue trends over time with forecasting
//    */
//   router.get('/trends',
//     asyncHandler(async (req, res, next) => {
//       await revenueController.getRevenueTrends(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/revenue/forecasts
//    * Get revenue forecasting data
//    */
//   router.get('/forecasts',
//     asyncHandler(async (req, res, next) => {
//       await revenueController.getRevenueForecasts(req as AuthenticatedRequest, res, next);
//     })
//   );

//   // =============================================================================
//   // REVENUE BREAKDOWNS & SEGMENTATION
//   // =============================================================================

//   /**
//    * GET /admin/revenue/by-category
//    * Get revenue breakdown by category (online dates, offline dates, etc.)
//    */
//   router.get('/by-category',
//     asyncHandler(async (req, res, next) => {
//       await revenueController.getRevenueByCategory(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/revenue/by-location
//    * Get revenue breakdown by city/country
//    */
//   router.get('/by-location',
//     asyncHandler(async (req, res, next) => {
//       await revenueController.getRevenueByLocation(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/revenue/by-payment-method
//    * Get revenue breakdown by payment method
//    */
//   router.get('/by-payment-method',
//     asyncHandler(async (req, res, next) => {
//       await revenueController.getRevenueByPaymentMethod(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/revenue/by-user-segment
//    * Get revenue breakdown by user segments (new, returning, premium)
//    */
//   router.get('/by-user-segment',
//     asyncHandler(async (req, res, next) => {
//       await revenueController.getRevenueByUserSegment(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/revenue/by-time
//    * Get revenue patterns by time (hourly, daily, weekly)
//    */
//   router.get('/by-time',
//     asyncHandler(async (req, res, next) => {
//       await revenueController.getRevenueByTime(req as AuthenticatedRequest, res, next);
//     })
//   );

//   // =============================================================================
//   // TRANSACTION MANAGEMENT
//   // =============================================================================

//   /**
//    * GET /admin/revenue/transactions
//    * Get all transactions with advanced filtering
//    */
//   router.get('/transactions',
//     validateGetTransactions,
//     asyncHandler(async (req, res, next) => {
//       await revenueController.getAllTransactions(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/revenue/transactions/:transactionId
//    * Get specific transaction details
//    */
//   router.get('/transactions/:transactionId',
//     asyncHandler(async (req, res, next) => {
//       await revenueController.getTransactionById(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * PUT /admin/revenue/transactions/:transactionId/review
//    * Admin review and approve/reject transaction
//    */
//   router.put('/transactions/:transactionId/review',
//     validateReviewTransaction,
//     asyncHandler(async (req, res, next) => {
//       await revenueController.reviewTransaction(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/revenue/transactions/pending-review
//    * Get transactions requiring admin review
//    */
//   router.get('/transactions/pending-review',
//     asyncHandler(async (req, res, next) => {
//       await revenueController.getPendingTransactions(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/revenue/transactions/high-value
//    * Get high-value transactions for monitoring
//    */
//   router.get('/transactions/high-value',
//     asyncHandler(async (req, res, next) => {
//       await revenueController.getHighValueTransactions(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/revenue/transactions/failed
//    * Get failed transactions for analysis
//    */
//   router.get('/transactions/failed',
//     asyncHandler(async (req, res, next) => {
//       await revenueController.getFailedTransactions(req as AuthenticatedRequest, res, next);
//     })
//   );

//   // =============================================================================
//   // REFUND MANAGEMENT
//   // =============================================================================

//   /**
//    * GET /admin/revenue/refunds
//    * Get all refunds with filtering
//    */
//   router.get('/refunds',
//     asyncHandler(async (req, res, next) => {
//       await revenueController.getAllRefunds(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * POST /admin/revenue/refunds
//    * Process a new refund
//    */
//   router.post('/refunds',
//     validateProcessRefund,
//     asyncHandler(async (req, res, next) => {
//       await revenueController.processRefund(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/revenue/refunds/:refundId
//    * Get specific refund details
//    */
//   router.get('/refunds/:refundId',
//     asyncHandler(async (req, res, next) => {
//       await revenueController.getRefundById(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * PUT /admin/revenue/refunds/:refundId/approve
//    * Approve a refund request
//    */
//   router.put('/refunds/:refundId/approve',
//     asyncHandler(async (req, res, next) => {
//       await revenueController.approveRefund(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * PUT /admin/revenue/refunds/:refundId/reject
//    * Reject a refund request
//    */
//   router.put('/refunds/:refundId/reject',
//     asyncHandler(async (req, res, next) => {
//       await revenueController.rejectRefund(req as AuthenticatedRequest, res, next);
//     })
//   );

//   // =============================================================================
//   // REVENUE ALERTS & MONITORING
//   // =============================================================================

//   /**
//    * GET /admin/revenue/alerts
//    * Get revenue alerts and notifications
//    */
//   router.get('/alerts',
//     asyncHandler(async (req, res, next) => {
//       await revenueController.getRevenueAlerts(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * POST /admin/revenue/alerts
//    * Create new revenue alert/threshold
//    */
//   router.post('/alerts',
//     validateCreateRevenueAlert,
//     asyncHandler(async (req, res, next) => {
//       await revenueController.createRevenueAlert(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * PUT /admin/revenue/alerts/:alertId
//    * Update revenue alert settings
//    */
//   router.put('/alerts/:alertId',
//     validateUpdateRevenueAlert,
//     asyncHandler(async (req, res, next) => {
//       await revenueController.updateRevenueAlert(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * DELETE /admin/revenue/alerts/:alertId
//    * Delete revenue alert
//    */
//   router.delete('/alerts/:alertId',
//     asyncHandler(async (req, res, next) => {
//       await revenueController.deleteRevenueAlert(req as AuthenticatedRequest, res, next);
//     })
//   );

//   // =============================================================================
//   // PAYMENT GATEWAY MANAGEMENT
//   // =============================================================================

//   /**
//    * GET /admin/revenue/payment-gateways/status
//    * Get payment gateway health and status
//    */
//   router.get('/payment-gateways/status',
//     asyncHandler(async (req, res, next) => {
//       await revenueController.getPaymentGatewayStatus(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/revenue/payment-gateways/performance
//    * Get payment gateway performance metrics
//    */
//   router.get('/payment-gateways/performance',
//     asyncHandler(async (req, res, next) => {
//       await revenueController.getPaymentGatewayPerformance(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * POST /admin/revenue/payment-gateways/test
//    * Test payment gateway connectivity
//    */
//   router.post('/payment-gateways/test',
//     asyncHandler(async (req, res, next) => {
//       await revenueController.testPaymentGateways(req as AuthenticatedRequest, res, next);
//     })
//   );

//   // =============================================================================
//   // CUSTOMER LIFETIME VALUE & COHORTS
//   // =============================================================================

//   /**
//    * GET /admin/revenue/ltv-analysis
//    * Get customer lifetime value analysis
//    */
//   router.get('/ltv-analysis',
//     asyncHandler(async (req, res, next) => {
//       await revenueController.getCustomerLTVAnalysis(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/revenue/cohort-analysis
//    * Get user cohort revenue analysis
//    */
//   router.get('/cohort-analysis',
//     asyncHandler(async (req, res, next) => {
//       await revenueController.getCohortAnalysis(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/revenue/churn-analysis
//    * Get revenue impact of user churn
//    */
//   router.get('/churn-analysis',
//     asyncHandler(async (req, res, next) => {
//       await revenueController.getChurnAnalysis(req as AuthenticatedRequest, res, next);
//     })
//   );

//   // =============================================================================
//   // PRICING & OPTIMIZATION
//   // =============================================================================

//   /**
//    * GET /admin/revenue/pricing-analysis
//    * Get pricing effectiveness analysis
//    */
//   router.get('/pricing-analysis',
//     asyncHandler(async (req, res, next) => {
//       await revenueController.getPricingAnalysis(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/revenue/conversion-funnel
//    * Get revenue conversion funnel analysis
//    */
//   router.get('/conversion-funnel',
//     asyncHandler(async (req, res, next) => {
//       await revenueController.getConversionFunnelAnalysis(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/revenue/ab-test-results
//    * Get A/B testing results for pricing
//    */
//   router.get('/ab-test-results',
//     asyncHandler(async (req, res, next) => {
//       await revenueController.getABTestResults(req as AuthenticatedRequest, res, next);
//     })
//   );

//   // =============================================================================
//   // REPORTING & EXPORT
//   // =============================================================================

//   /**
//    * POST /admin/revenue/export
//    * Export revenue data in various formats
//    */
//   router.post('/export',
//     validateRevenueExport,
//     asyncHandler(async (req, res, next) => {
//       await revenueController.exportRevenueData(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/revenue/reports/daily
//    * Get daily revenue report
//    */
//   router.get('/reports/daily',
//     asyncHandler(async (req, res, next) => {
//       await revenueController.getDailyRevenueReport(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/revenue/reports/monthly
//    * Get monthly revenue report
//    */
//   router.get('/reports/monthly',
//     asyncHandler(async (req, res, next) => {
//       await revenueController.getMonthlyRevenueReport(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/revenue/reports/quarterly
//    * Get quarterly revenue report
//    */
//   router.get('/reports/quarterly',
//     asyncHandler(async (req, res, next) => {
//       await revenueController.getQuarterlyRevenueReport(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * POST /admin/revenue/reports/custom
//    * Generate custom revenue report
//    */
//   router.post('/reports/custom',
//     asyncHandler(async (req, res, next) => {
//       await revenueController.generateCustomReport(req as AuthenticatedRequest, res, next);
//     })
//   );

//   // =============================================================================
//   // FRAUD DETECTION & SECURITY
//   // =============================================================================

//   /**
//    * GET /admin/revenue/fraud/suspicious-transactions
//    * Get transactions flagged as suspicious
//    */
//   router.get('/fraud/suspicious-transactions',
//     asyncHandler(async (req, res, next) => {
//       await revenueController.getSuspiciousTransactions(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * POST /admin/revenue/fraud/investigate
//    * Initiate fraud investigation
//    */
//   router.post('/fraud/investigate',
//     asyncHandler(async (req, res, next) => {
//       await revenueController.initiateFraudInvestigation(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * GET /admin/revenue/fraud/patterns
//    * Get fraud pattern analysis
//    */
//   router.get('/fraud/patterns',
//     asyncHandler(async (req, res, next) => {
//       await revenueController.getFraudPatterns(req as AuthenticatedRequest, res, next);
//     })
//   );

//   // =============================================================================
//   // UTILITY ENDPOINTS
//   // =============================================================================

//   /**
//    * GET /admin/revenue/health
//    * Revenue service health check
//    */
//   router.get('/health',
//     asyncHandler(async (req, res, next) => {
//       await revenueController.getServiceHealth(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * POST /admin/revenue/recalculate-metrics
//    * Manually trigger metrics recalculation
//    */
//   router.post('/recalculate-metrics',
//     asyncHandler(async (req, res, next) => {
//       await revenueController.recalculateMetrics(req as AuthenticatedRequest, res, next);
//     })
//   );

//   /**
//    * POST /admin/revenue/refresh-cache
//    * Refresh revenue analytics cache
//    */
//   router.post('/refresh-cache',
//     asyncHandler(async (req, res, next) => {
//       await revenueController.refreshAnalyticsCache(req as AuthenticatedRequest, res, next);
//     })
//   );

//   // Log route registration
//   logger.info('Admin Revenue Analytics routes registered successfully', {
//     routes: [
//       // Overview & Analytics
//       'GET /admin/revenue/overview',
//       'GET /admin/revenue/real-time',
//       'GET /admin/revenue/trends',
//       'GET /admin/revenue/forecasts',
      
//       // Breakdowns
//       'GET /admin/revenue/by-category',
//       'GET /admin/revenue/by-location',
//       'GET /admin/revenue/by-payment-method',
//       'GET /admin/revenue/by-user-segment',
//       'GET /admin/revenue/by-time',
      
//       // Transactions
//       'GET /admin/revenue/transactions',
//       'GET /admin/revenue/transactions/:transactionId',
//       'PUT /admin/revenue/transactions/:transactionId/review',
//       'GET /admin/revenue/transactions/pending-review',
//       'GET /admin/revenue/transactions/high-value',
//       'GET /admin/revenue/transactions/failed',
      
//       // Refunds
//       'GET /admin/revenue/refunds',
//       'POST /admin/revenue/refunds',
//       'GET /admin/revenue/refunds/:refundId',
//       'PUT /admin/revenue/refunds/:refundId/approve',
//       'PUT /admin/revenue/refunds/:refundId/reject',
      
//       // Alerts
//       'GET /admin/revenue/alerts',
//       'POST /admin/revenue/alerts',
//       'PUT /admin/revenue/alerts/:alertId',
//       'DELETE /admin/revenue/alerts/:alertId',
      
//       // Payment Gateways
//       'GET /admin/revenue/payment-gateways/status',
//       'GET /admin/revenue/payment-gateways/performance',
//       'POST /admin/revenue/payment-gateways/test',
      
//       // Customer Analytics
//       'GET /admin/revenue/ltv-analysis',
//       'GET /admin/revenue/cohort-analysis',
//       'GET /admin/revenue/churn-analysis',
      
//       // Pricing & Optimization
//       'GET /admin/revenue/pricing-analysis',
//       'GET /admin/revenue/conversion-funnel',
//       'GET /admin/revenue/ab-test-results',
      
//       // Reporting
//       'POST /admin/revenue/export',
//       'GET /admin/revenue/reports/daily',
//       'GET /admin/revenue/reports/monthly',
//       'GET /admin/revenue/reports/quarterly',
//       'POST /admin/revenue/reports/custom',
      
//       // Fraud Detection
//       'GET /admin/revenue/fraud/suspicious-transactions',
//       'POST /admin/revenue/fraud/investigate',
//       'GET /admin/revenue/fraud/patterns',
      
//       // Utilities
//       'GET /admin/revenue/health',
//       'POST /admin/revenue/recalculate-metrics',
//       'POST /admin/revenue/refresh-cache',
//     ],
//     routeCount: 40
//   });

//   return router;
// }