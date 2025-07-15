"use strict";
/**
 * Revenue Analytics Interfaces
 * World-class revenue tracking and analytics for admin dashboard
 *
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RevenueValidationRules = exports.calculatePercentageChange = exports.formatCurrency = exports.getRevenueTimePeriodValues = exports.getPaymentMethodValues = exports.getTransactionStatusValues = exports.getRevenueCategoryValues = exports.REVENUE_ANALYTICS_CONSTANTS = exports.TrendDirection = exports.RefundStatus = exports.PaymentMethod = exports.TransactionStatus = exports.RevenueCategory = exports.RevenueTimePeriod = void 0;
// =============================================================================
// REVENUE ANALYTICS ENUMS
// =============================================================================
/**
 * Revenue time periods for analytics
 */
var RevenueTimePeriod;
(function (RevenueTimePeriod) {
    RevenueTimePeriod["HOURLY"] = "hourly";
    RevenueTimePeriod["DAILY"] = "daily";
    RevenueTimePeriod["WEEKLY"] = "weekly";
    RevenueTimePeriod["MONTHLY"] = "monthly";
    RevenueTimePeriod["QUARTERLY"] = "quarterly";
    RevenueTimePeriod["YEARLY"] = "yearly";
})(RevenueTimePeriod || (exports.RevenueTimePeriod = RevenueTimePeriod = {}));
/**
 * Revenue categories for classification
 */
var RevenueCategory;
(function (RevenueCategory) {
    RevenueCategory["DATE_BOOKING"] = "date_booking";
    RevenueCategory["ONLINE_DATE"] = "online_date";
    RevenueCategory["OFFLINE_DATE"] = "offline_date";
    RevenueCategory["PREMIUM_FEATURE"] = "premium_feature";
    RevenueCategory["EVENT_TICKET"] = "event_ticket";
    RevenueCategory["SUBSCRIPTION"] = "subscription";
    RevenueCategory["GIFT_PURCHASE"] = "gift_purchase";
    RevenueCategory["OTHER"] = "other";
})(RevenueCategory || (exports.RevenueCategory = RevenueCategory = {}));
/**
 * Transaction status for revenue tracking
 */
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PENDING"] = "pending";
    TransactionStatus["COMPLETED"] = "completed";
    TransactionStatus["FAILED"] = "failed";
    TransactionStatus["CANCELLED"] = "cancelled";
    TransactionStatus["REFUNDED"] = "refunded";
    TransactionStatus["PARTIALLY_REFUNDED"] = "partially_refunded";
    TransactionStatus["DISPUTED"] = "disputed";
    TransactionStatus["UNDER_REVIEW"] = "under_review";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
/**
 * Payment methods for revenue breakdown
 */
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["UPI"] = "upi";
    PaymentMethod["CREDIT_CARD"] = "credit_card";
    PaymentMethod["DEBIT_CARD"] = "debit_card";
    PaymentMethod["NET_BANKING"] = "net_banking";
    PaymentMethod["WALLET"] = "wallet";
    PaymentMethod["CASH"] = "cash";
    PaymentMethod["OTHER"] = "other";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
/**
 * Refund status tracking
 */
var RefundStatus;
(function (RefundStatus) {
    RefundStatus["NOT_APPLICABLE"] = "not_applicable";
    RefundStatus["PENDING"] = "pending";
    RefundStatus["APPROVED"] = "approved";
    RefundStatus["REJECTED"] = "rejected";
    RefundStatus["PROCESSED"] = "processed";
    RefundStatus["FAILED"] = "failed";
})(RefundStatus || (exports.RefundStatus = RefundStatus = {}));
/**
 * Revenue trend directions
 */
var TrendDirection;
(function (TrendDirection) {
    TrendDirection["UP"] = "up";
    TrendDirection["DOWN"] = "down";
    TrendDirection["STABLE"] = "stable";
    TrendDirection["VOLATILE"] = "volatile";
})(TrendDirection || (exports.TrendDirection = TrendDirection = {}));
// =============================================================================
// CONSTANTS AND HELPERS
// =============================================================================
/**
 * Revenue analytics constants
 */
exports.REVENUE_ANALYTICS_CONSTANTS = {
    DEFAULT_CURRENCY: 'INR',
    MIN_TRANSACTION_AMOUNT: 1,
    MAX_EXPORT_RECORDS: 50000,
    CACHE_DURATION_MINUTES: 15,
    REAL_TIME_UPDATE_INTERVAL: 30, // seconds
    FORECAST_CONFIDENCE_THRESHOLD: 70, // percentage
    ANOMALY_DETECTION_THRESHOLD: 2, // standard deviations
};
/**
 * Get revenue category values
 */
const getRevenueCategoryValues = () => Object.values(RevenueCategory);
exports.getRevenueCategoryValues = getRevenueCategoryValues;
/**
 * Get transaction status values
 */
const getTransactionStatusValues = () => Object.values(TransactionStatus);
exports.getTransactionStatusValues = getTransactionStatusValues;
/**
 * Get payment method values
 */
const getPaymentMethodValues = () => Object.values(PaymentMethod);
exports.getPaymentMethodValues = getPaymentMethodValues;
/**
 * Get time period values
 */
const getRevenueTimePeriodValues = () => Object.values(RevenueTimePeriod);
exports.getRevenueTimePeriodValues = getRevenueTimePeriodValues;
/**
 * Format currency amount
 */
const formatCurrency = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
    }).format(amount);
};
exports.formatCurrency = formatCurrency;
/**
 * Calculate percentage change
 */
const calculatePercentageChange = (current, previous) => {
    if (previous === 0)
        return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
};
exports.calculatePercentageChange = calculatePercentageChange;
/**
 * Revenue validation rules
 */
exports.RevenueValidationRules = {
    MAX_DATE_RANGE_DAYS: 365,
    MIN_AMOUNT_FILTER: 0,
    MAX_AMOUNT_FILTER: 1000000,
    MAX_EXPORT_DAYS: 90,
    MIN_FORECAST_DAYS: 1,
    MAX_FORECAST_DAYS: 90,
};
