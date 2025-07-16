/**
 * Revenue Analytics Interfaces
 * World-class revenue tracking and analytics for admin dashboard
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */

// =============================================================================
// REVENUE ANALYTICS ENUMS
// =============================================================================

/**
 * Revenue time periods for analytics
 */
export enum RevenueTimePeriod {
  HOURLY = 'hourly',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

/**
 * Revenue categories for classification
 */
export enum RevenueCategory {
  DATE_BOOKING = 'date_booking',
  ONLINE_DATE = 'online_date',
  OFFLINE_DATE = 'offline_date',
  PREMIUM_FEATURE = 'premium_feature',
  EVENT_TICKET = 'event_ticket',
  SUBSCRIPTION = 'subscription',
  GIFT_PURCHASE = 'gift_purchase',
  OTHER = 'other',
}

/**
 * Transaction status for revenue tracking
 */
export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
  DISPUTED = 'disputed',
  UNDER_REVIEW = 'under_review',
}

/**
 * Payment methods for revenue breakdown
 */
export enum PaymentMethod {
  UPI = 'upi',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  NET_BANKING = 'net_banking',
  WALLET = 'wallet',
  CASH = 'cash',
  OTHER = 'other',
}

/**
 * Refund status tracking
 */
export enum RefundStatus {
  NOT_APPLICABLE = 'not_applicable',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PROCESSED = 'processed',
  FAILED = 'failed',
}

/**
 * Revenue trend directions
 */
export enum TrendDirection {
  UP = 'up',
  DOWN = 'down',
  STABLE = 'stable',
  VOLATILE = 'volatile',
}

// =============================================================================
// CORE REVENUE INTERFACES
// =============================================================================

/**
 * Main revenue analytics overview
 */
export interface RevenueAnalyticsOverview {
  readonly summary: RevenueSummary;
  readonly trends: RevenueTrends;
  readonly breakdowns: RevenueBreakdowns;
  readonly comparisons: RevenueComparisons;
  readonly forecasts: RevenueForecast;
  readonly alerts: RevenueAlert[];
  readonly lastUpdated: string;
}

/**
 * Revenue summary metrics
 */
export interface RevenueSummary {
  readonly totalRevenue: number;
  readonly netRevenue: number; // After refunds and fees
  readonly grossRevenue: number; // Before any deductions
  readonly totalTransactions: number;
  readonly successfulTransactions: number;
  readonly failedTransactions: number;
  readonly refundedTransactions: number;
  readonly averageTransactionValue: number;
  readonly averageOrderValue: number;
  readonly totalRefunds: number;
  readonly refundRate: number; // Percentage
  readonly conversionRate: number; // Percentage
  readonly revenueGrowthRate: number; // Percentage vs previous period
  readonly transactionGrowthRate: number; // Percentage vs previous period
}

/**
 * Revenue trends over time
 */
export interface RevenueTrends {
  readonly revenueByPeriod: RevenueDataPoint[];
  readonly transactionsByPeriod: RevenueDataPoint[];
  readonly averageValueByPeriod: RevenueDataPoint[];
  readonly refundsByPeriod: RevenueDataPoint[];
  readonly conversionByPeriod: RevenueDataPoint[];
  readonly trendDirection: TrendDirection;
  readonly seasonalPatterns: SeasonalPattern[];
}

/**
 * Individual revenue data point
 */
export interface RevenueDataPoint {
  readonly period: string; // ISO date or period identifier
  readonly value: number;
  readonly count?: number; // Transaction count for this period
  readonly change: number; // Percentage change from previous period
  readonly isProjected?: boolean; // For forecast data
}

/**
 * Revenue breakdowns by various dimensions
 */
export interface RevenueBreakdowns {
  readonly byCategory: CategoryBreakdown[];
  readonly byCity: LocationBreakdown[];
  readonly byCountry: LocationBreakdown[];
  readonly byPaymentMethod: PaymentMethodBreakdown[];
  readonly byUserSegment: UserSegmentBreakdown[];
  readonly byDateType: DateTypeBreakdown[];
  readonly byTimeOfDay: TimeBreakdown[];
  readonly byDayOfWeek: DayBreakdown[];
}

/**
 * Revenue breakdown by category
 */
export interface CategoryBreakdown {
  readonly category: RevenueCategory;
  readonly revenue: number;
  readonly transactions: number;
  readonly percentage: number;
  readonly growth: number; // Percentage change
  readonly averageValue: number;
}

/**
 * Revenue breakdown by location
 */
export interface LocationBreakdown {
  readonly location: string; // City or country name
  readonly revenue: number;
  readonly transactions: number;
  readonly users: number; // Unique paying users
  readonly percentage: number;
  readonly growth: number;
  readonly averageValue: number;
  readonly conversionRate: number;
}

/**
 * Revenue breakdown by payment method
 */
export interface PaymentMethodBreakdown {
  readonly method: PaymentMethod;
  readonly revenue: number;
  readonly transactions: number;
  readonly percentage: number;
  readonly successRate: number;
  readonly averageValue: number;
  readonly processingFee: number;
}

/**
 * Revenue breakdown by user segment
 */
export interface UserSegmentBreakdown {
  readonly segment: string; // 'new', 'returning', 'premium', etc.
  readonly revenue: number;
  readonly users: number;
  readonly transactions: number;
  readonly averageValuePerUser: number;
  readonly lifetimeValue: number;
  readonly retentionRate: number;
}

/**
 * Revenue breakdown by date type
 */
export interface DateTypeBreakdown {
  readonly dateType: 'online' | 'offline';
  readonly revenue: number;
  readonly bookings: number;
  readonly averageValue: number;
  readonly completionRate: number;
  readonly satisfactionScore: number;
}

/**
 * Revenue breakdown by time periods
 */
export interface TimeBreakdown {
  readonly hour?: number; // 0-23
  readonly day?: string; // 'monday', 'tuesday', etc.
  readonly revenue: number;
  readonly transactions: number;
  readonly percentage: number;
}

/**
 * Day of week breakdown
 */
export interface DayBreakdown {
  readonly day: string; // 'Monday', 'Tuesday', etc.
  readonly revenue: number;
  readonly transactions: number;
  readonly percentage: number;
  readonly peakHour: number; // Most active hour on this day
}

/**
 * Revenue comparisons with previous periods
 */
export interface RevenueComparisons {
  readonly vsYesterday: ComparisonMetrics;
  readonly vsLastWeek: ComparisonMetrics;
  readonly vsLastMonth: ComparisonMetrics;
  readonly vsLastQuarter: ComparisonMetrics;
  readonly vsLastYear: ComparisonMetrics;
  readonly bestPerformingPeriod: PerformancePeriod;
  readonly worstPerformingPeriod: PerformancePeriod;
}

/**
 * Comparison metrics between periods
 */
export interface ComparisonMetrics {
  readonly revenueChange: number; // Percentage
  readonly transactionChange: number; // Percentage
  readonly averageValueChange: number; // Percentage
  readonly userCountChange: number; // Percentage
  readonly trend: TrendDirection;
  readonly significance: 'high' | 'medium' | 'low'; // Statistical significance
}

/**
 * Performance period details
 */
export interface PerformancePeriod {
  readonly period: string;
  readonly revenue: number;
  readonly transactions: number;
  readonly reason: string; // Why it performed well/poorly
}

/**
 * Revenue forecasting
 */
export interface RevenueForecast {
  readonly nextWeek: ForecastData;
  readonly nextMonth: ForecastData;
  readonly nextQuarter: ForecastData;
  readonly confidenceLevel: number; // 0-100
  readonly methodology: string; // 'trend_analysis', 'ml_model', etc.
  readonly factorsConsidered: string[];
  readonly risks: string[];
  readonly opportunities: string[];
}

/**
 * Forecast data structure
 */
export interface ForecastData {
  readonly projected: number;
  readonly conservative: number; // Lower bound
  readonly optimistic: number; // Upper bound
  readonly confidence: number; // Percentage
  readonly keyAssumptions: string[];
}

/**
 * Revenue alerts and notifications
 */
export interface RevenueAlert {
  readonly id: string;
  readonly type: 'threshold' | 'anomaly' | 'trend' | 'target';
  readonly severity: 'info' | 'warning' | 'critical';
  readonly title: string;
  readonly message: string;
  readonly metric: string; // Which metric triggered the alert
  readonly currentValue: number;
  readonly thresholdValue?: number;
  readonly trend?: TrendDirection;
  readonly actionSuggested: string;
  readonly createdAt: string;
  readonly isRead: boolean;
}

/**
 * Seasonal pattern detection
 */
export interface SeasonalPattern {
  readonly type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  readonly pattern: string; // Description of the pattern
  readonly strength: number; // 0-1, how strong the pattern is
  readonly peakPeriods: string[];
  readonly lowPeriods: string[];
  readonly confidence: number; // Statistical confidence
}

// =============================================================================
// TRANSACTION DETAILS
// =============================================================================

/**
 * Detailed transaction information
 */
export interface TransactionDetails {
  readonly transactionId: number;
  readonly userId: number;
  readonly userEmail: string;
  readonly userName: string;
  readonly transactionType: string;
  readonly category: RevenueCategory;
  readonly amount: number;
  readonly currency: string;
  readonly status: TransactionStatus;
  readonly paymentMethod: PaymentMethod;
  readonly paymentGateway: string;
  readonly gatewayTransactionId?: string;
  readonly description: string;
  readonly city?: string;
  readonly country: string;
  readonly fees: TransactionFees;
  readonly refund?: RefundDetails;
  readonly metadata: Record<string, any>;
  readonly createdAt: string;
  readonly completedAt?: string;
  readonly adminReviewedBy?: number;
  readonly adminReviewedAt?: string;
  readonly disputeStatus?: string;
}

/**
 * Transaction fees breakdown
 */
export interface TransactionFees {
  readonly transactionFee: number;
  readonly gatewayFee: number;
  readonly platformFee: number;
  readonly totalFees: number;
  readonly netAmount: number; // Amount after fees
}

/**
 * Refund details
 */
export interface RefundDetails {
  readonly refundId: string;
  readonly amount: number;
  readonly reason: string;
  readonly status: RefundStatus;
  readonly requestedAt: string;
  readonly processedAt?: string;
  readonly gatewayRefundId?: string;
  readonly adminProcessedBy?: number;
}

// =============================================================================
// REQUEST INTERFACES
// =============================================================================

/**
 * Get revenue analytics request
 */
export interface GetRevenueAnalyticsRequest {
  readonly startDate: string; // YYYY-MM-DD
  readonly endDate: string; // YYYY-MM-DD
  readonly timePeriod: RevenueTimePeriod;
  readonly categories?: RevenueCategory[];
  readonly cities?: string[];
  readonly countries?: string[];
  readonly paymentMethods?: PaymentMethod[];
  readonly userSegments?: string[];
  readonly includeForecasts?: boolean;
  readonly includeComparisons?: boolean;
  readonly includeBreakdowns?: boolean;
  readonly includeTrends?: boolean;
  readonly compareWithPrevious?: boolean;
  readonly timezone?: string;
}

/**
 * Get transactions request with filters
 */
export interface GetTransactionsRequest {
  readonly startDate?: string;
  readonly endDate?: string;
  readonly status?: TransactionStatus[];
  readonly categories?: RevenueCategory[];
  readonly paymentMethods?: PaymentMethod[];
  readonly minAmount?: number;
  readonly maxAmount?: number;
  readonly userId?: number;
  readonly city?: string;
  readonly country?: string;
  readonly hasRefund?: boolean;
  readonly isDisputed?: boolean;
  readonly adminReviewed?: boolean;
  readonly page?: number;
  readonly limit?: number;
  readonly sortBy?: 'createdAt' | 'amount' | 'status';
  readonly sortOrder?: 'asc' | 'desc';
  readonly includeUserDetails?: boolean;
  readonly includeRefundDetails?: boolean;
}

/**
 * Revenue export request
 */
export interface RevenueExportRequest {
  readonly startDate: string;
  readonly endDate: string;
  readonly format: 'csv' | 'excel' | 'pdf';
  readonly includeTransactions?: boolean;
  readonly includeRefunds?: boolean;
  readonly includeAnalytics?: boolean;
  readonly groupBy?: ('category' | 'city' | 'payment_method')[];
  readonly filters?: GetTransactionsRequest;
}

/**
 * Update revenue alert request
 */
export interface UpdateRevenueAlertRequest {
  readonly alertId: string;
  readonly isRead?: boolean;
  readonly isArchived?: boolean;
  readonly notes?: string;
}

/**
 * Create revenue alert request
 */
export interface CreateRevenueAlertRequest {
  readonly type: 'threshold' | 'anomaly' | 'trend' | 'target';
  readonly metric: string;
  readonly thresholdValue?: number;
  readonly condition: 'above' | 'below' | 'equals';
  readonly severity: 'info' | 'warning' | 'critical';
  readonly title: string;
  readonly message: string;
  readonly actionSuggested: string;
  readonly isActive: boolean;
  readonly notifyEmail?: boolean;
  readonly notifySlack?: boolean;
}

// =============================================================================
// RESPONSE INTERFACES
// =============================================================================

/**
 * Revenue analytics response
 */
export interface RevenueAnalyticsResponse {
  readonly success: boolean;
  readonly data: RevenueAnalyticsOverview;
  readonly message: string;
  readonly generatedAt: string;
  readonly cacheExpiry?: string;
}

/**
 * Transactions list response
 */
export interface TransactionsListResponse {
  readonly success: boolean;
  readonly data: {
    readonly transactions: TransactionDetails[];
    readonly pagination: {
      readonly page: number;
      readonly limit: number;
      readonly total: number;
      readonly totalPages: number;
    };
    readonly summary: {
      readonly totalAmount: number;
      readonly totalFees: number;
      readonly netAmount: number;
      readonly averageValue: number;
      readonly statusBreakdown: Record<TransactionStatus, number>;
    };
  };
  readonly message: string;
}

/**
 * Revenue export response
 */
export interface RevenueExportResponse {
  readonly success: boolean;
  readonly data: {
    readonly downloadUrl: string;
    readonly fileName: string;
    readonly fileSize: number; // bytes
    readonly expiresAt: string; // When download link expires
    readonly recordCount: number;
  };
  readonly message: string;
}

/**
 * Revenue alerts response
 */
export interface RevenueAlertsResponse {
  readonly success: boolean;
  readonly data: {
    readonly alerts: RevenueAlert[];
    readonly unreadCount: number;
    readonly criticalCount: number;
    readonly totalCount: number;
  };
  readonly message: string;
}

// =============================================================================
// REAL-TIME REVENUE TRACKING
// =============================================================================

/**
 * Real-time revenue metrics for live dashboard
 */
export interface RealTimeRevenueMetrics {
  readonly currentDayRevenue: number;
  readonly currentHourRevenue: number;
  readonly liveTransactions: number; // Transactions in last 5 minutes
  readonly onlineUsers: number; // Users currently browsing
  readonly activeCheckouts: number; // Users in checkout process
  readonly conversionRate: number; // Real-time conversion rate
  readonly averageSessionValue: number;
  readonly topPerformingCity: string;
  readonly lastTransaction: {
    readonly amount: number;
    readonly city: string;
    readonly timeAgo: string; // "2 minutes ago"
  };
  readonly alerts: RevenueAlert[];
  readonly timestamp: string;
}

/**
 * Live revenue update for WebSocket
 */
export interface LiveRevenueUpdate {
  readonly type: 'transaction' | 'refund' | 'alert' | 'milestone';
  readonly data: {
    readonly amount?: number;
    readonly transactionId?: number;
    readonly city?: string;
    readonly paymentMethod?: PaymentMethod;
    readonly alert?: RevenueAlert;
    readonly milestone?: {
      readonly type: string;
      readonly value: number;
      readonly message: string;
    };
  };
  readonly timestamp: string;
}

// =============================================================================
// CONSTANTS AND HELPERS
// =============================================================================

/**
 * Revenue analytics constants
 */
export const REVENUE_ANALYTICS_CONSTANTS = {
  DEFAULT_CURRENCY: 'INR',
  MIN_TRANSACTION_AMOUNT: 1,
  MAX_EXPORT_RECORDS: 50000,
  CACHE_DURATION_MINUTES: 15,
  REAL_TIME_UPDATE_INTERVAL: 30, // seconds
  FORECAST_CONFIDENCE_THRESHOLD: 70, // percentage
  ANOMALY_DETECTION_THRESHOLD: 2, // standard deviations
} as const;

/**
 * Get revenue category values
 */
export const getRevenueCategoryValues = (): RevenueCategory[] => Object.values(RevenueCategory);

/**
 * Get transaction status values
 */
export const getTransactionStatusValues = (): TransactionStatus[] => Object.values(TransactionStatus);

/**
 * Get payment method values
 */
export const getPaymentMethodValues = (): PaymentMethod[] => Object.values(PaymentMethod);

/**
 * Get time period values
 */
export const getRevenueTimePeriodValues = (): RevenueTimePeriod[] => Object.values(RevenueTimePeriod);

/**
 * Format currency amount
 */
export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Calculate percentage change
 */
export const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Revenue validation rules
 */
export const RevenueValidationRules = {
  MAX_DATE_RANGE_DAYS: 365,
  MIN_AMOUNT_FILTER: 0,
  MAX_AMOUNT_FILTER: 1000000,
  MAX_EXPORT_DAYS: 90,
  MIN_FORECAST_DAYS: 1,
  MAX_FORECAST_DAYS: 90,
} as const;