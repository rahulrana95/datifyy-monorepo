"use strict";
/**
 * Admin Notifications Interfaces
 * Real-time notifications for Slack, Email, and In-App alerts
 *
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationValidationRules = exports.formatNotificationMessage = exports.getNotificationStatusValues = exports.getNotificationPriorityValues = exports.getNotificationChannelValues = exports.getNotificationTriggerEventValues = exports.NOTIFICATION_CONSTANTS = exports.SlackNotificationType = exports.NotificationFrequency = exports.NotificationStatus = exports.NotificationPriority = exports.NotificationTriggerEvent = exports.NotificationChannel = void 0;
// =============================================================================
// NOTIFICATION ENUMS
// =============================================================================
/**
 * Notification delivery channels
 */
var NotificationChannel;
(function (NotificationChannel) {
    NotificationChannel["EMAIL"] = "email";
    NotificationChannel["SLACK"] = "slack";
    NotificationChannel["IN_APP"] = "in_app";
    NotificationChannel["SMS"] = "sms";
    NotificationChannel["WEBHOOK"] = "webhook";
    NotificationChannel["PUSH"] = "push";
})(NotificationChannel || (exports.NotificationChannel = NotificationChannel = {}));
/**
 * Notification trigger events
 */
var NotificationTriggerEvent;
(function (NotificationTriggerEvent) {
    // User Events
    NotificationTriggerEvent["NEW_USER_SIGNUP"] = "new_user_signup";
    NotificationTriggerEvent["USER_PROFILE_COMPLETED"] = "user_profile_completed";
    NotificationTriggerEvent["USER_EMAIL_VERIFIED"] = "user_email_verified";
    NotificationTriggerEvent["USER_PHONE_VERIFIED"] = "user_phone_verified";
    NotificationTriggerEvent["USER_DELETED_ACCOUNT"] = "user_deleted_account";
    NotificationTriggerEvent["USER_REPORTED"] = "user_reported";
    // Date Events
    NotificationTriggerEvent["DATE_CURATED"] = "date_curated";
    NotificationTriggerEvent["DATE_CONFIRMED"] = "date_confirmed";
    NotificationTriggerEvent["DATE_CANCELLED"] = "date_cancelled";
    NotificationTriggerEvent["DATE_CANCELLED_LAST_MINUTE"] = "date_cancelled_last_minute";
    NotificationTriggerEvent["DATE_COMPLETED"] = "date_completed";
    NotificationTriggerEvent["DATE_NO_SHOW"] = "date_no_show";
    NotificationTriggerEvent["DATE_FEEDBACK_SUBMITTED"] = "date_feedback_submitted";
    NotificationTriggerEvent["DATE_SAFETY_CONCERN"] = "date_safety_concern";
    // Payment Events
    NotificationTriggerEvent["PAYMENT_SUCCESSFUL"] = "payment_successful";
    NotificationTriggerEvent["PAYMENT_FAILED"] = "payment_failed";
    NotificationTriggerEvent["REFUND_REQUESTED"] = "refund_requested";
    NotificationTriggerEvent["REFUND_PROCESSED"] = "refund_processed";
    NotificationTriggerEvent["HIGH_VALUE_TRANSACTION"] = "high_value_transaction";
    NotificationTriggerEvent["CHARGEBACK_RECEIVED"] = "chargeback_received";
    // System Events
    NotificationTriggerEvent["SYSTEM_ERROR"] = "system_error";
    NotificationTriggerEvent["DATABASE_SLOW"] = "database_slow";
    NotificationTriggerEvent["API_RATE_LIMIT_EXCEEDED"] = "api_rate_limit_exceeded";
    NotificationTriggerEvent["STORAGE_QUOTA_WARNING"] = "storage_quota_warning";
    NotificationTriggerEvent["EMAIL_DELIVERY_FAILED"] = "email_delivery_failed";
    // Revenue Events
    NotificationTriggerEvent["DAILY_REVENUE_TARGET_MET"] = "daily_revenue_target_met";
    NotificationTriggerEvent["MONTHLY_REVENUE_TARGET_MET"] = "monthly_revenue_target_met";
    NotificationTriggerEvent["REVENUE_DROP_DETECTED"] = "revenue_drop_detected";
    NotificationTriggerEvent["NEW_PAYING_USER"] = "new_paying_user";
    // Trust & Safety Events
    NotificationTriggerEvent["LOW_TRUST_SCORE"] = "low_trust_score";
    NotificationTriggerEvent["MULTIPLE_CANCELLATIONS"] = "multiple_cancellations";
    NotificationTriggerEvent["SUSPICIOUS_ACTIVITY"] = "suspicious_activity";
    NotificationTriggerEvent["FAKE_PROFILE_DETECTED"] = "fake_profile_detected";
    // Admin Events
    NotificationTriggerEvent["ADMIN_LOGIN"] = "admin_login";
    NotificationTriggerEvent["ADMIN_LOGIN_FAILED"] = "admin_login_failed";
    NotificationTriggerEvent["ADMIN_PERMISSION_CHANGED"] = "admin_permission_changed";
    NotificationTriggerEvent["ADMIN_ACTION_HIGH_RISK"] = "admin_action_high_risk";
})(NotificationTriggerEvent || (exports.NotificationTriggerEvent = NotificationTriggerEvent = {}));
/**
 * Notification priority levels
 */
var NotificationPriority;
(function (NotificationPriority) {
    NotificationPriority[NotificationPriority["LOW"] = 1] = "LOW";
    NotificationPriority[NotificationPriority["NORMAL"] = 2] = "NORMAL";
    NotificationPriority[NotificationPriority["HIGH"] = 3] = "HIGH";
    NotificationPriority[NotificationPriority["URGENT"] = 4] = "URGENT";
    NotificationPriority[NotificationPriority["CRITICAL"] = 5] = "CRITICAL";
})(NotificationPriority || (exports.NotificationPriority = NotificationPriority = {}));
/**
 * Notification status
 */
var NotificationStatus;
(function (NotificationStatus) {
    NotificationStatus["PENDING"] = "pending";
    NotificationStatus["SENT"] = "sent";
    NotificationStatus["DELIVERED"] = "delivered";
    NotificationStatus["FAILED"] = "failed";
    NotificationStatus["BOUNCED"] = "bounced";
    NotificationStatus["OPENED"] = "opened";
    NotificationStatus["CLICKED"] = "clicked";
    NotificationStatus["UNSUBSCRIBED"] = "unsubscribed";
})(NotificationStatus || (exports.NotificationStatus = NotificationStatus = {}));
/**
 * Notification frequency settings
 */
var NotificationFrequency;
(function (NotificationFrequency) {
    NotificationFrequency["IMMEDIATE"] = "immediate";
    NotificationFrequency["BATCHED_5MIN"] = "batched_5min";
    NotificationFrequency["BATCHED_15MIN"] = "batched_15min";
    NotificationFrequency["BATCHED_HOURLY"] = "batched_hourly";
    NotificationFrequency["DAILY_DIGEST"] = "daily_digest";
    NotificationFrequency["WEEKLY_DIGEST"] = "weekly_digest";
    NotificationFrequency["DISABLED"] = "disabled";
})(NotificationFrequency || (exports.NotificationFrequency = NotificationFrequency = {}));
/**
 * Slack notification types
 */
var SlackNotificationType;
(function (SlackNotificationType) {
    SlackNotificationType["MESSAGE"] = "message";
    SlackNotificationType["ALERT"] = "alert";
    SlackNotificationType["MENTION"] = "mention";
    SlackNotificationType["THREAD_REPLY"] = "thread_reply";
    SlackNotificationType["DIRECT_MESSAGE"] = "direct_message";
})(SlackNotificationType || (exports.SlackNotificationType = SlackNotificationType = {}));
// =============================================================================
// CONSTANTS AND HELPERS
// =============================================================================
/**
 * Notification constants
 */
exports.NOTIFICATION_CONSTANTS = {
    MAX_EMAIL_RECIPIENTS: 100,
    MAX_SMS_LENGTH: 160,
    MAX_SLACK_BLOCKS: 50,
    DEFAULT_RETRY_ATTEMPTS: 3,
    BATCH_SIZE: 50,
    RATE_LIMIT_PER_MINUTE: 1000,
    MAX_TEMPLATE_VARIABLES: 20,
    ANALYTICS_RETENTION_DAYS: 90,
};
/**
 * Get notification trigger event values
 */
const getNotificationTriggerEventValues = () => Object.values(NotificationTriggerEvent);
exports.getNotificationTriggerEventValues = getNotificationTriggerEventValues;
/**
 * Get notification channel values
 */
const getNotificationChannelValues = () => Object.values(NotificationChannel);
exports.getNotificationChannelValues = getNotificationChannelValues;
/**
 * Get notification priority values
 */
const getNotificationPriorityValues = () => [
    NotificationPriority.LOW,
    NotificationPriority.NORMAL,
    NotificationPriority.HIGH,
    NotificationPriority.URGENT,
    NotificationPriority.CRITICAL,
];
exports.getNotificationPriorityValues = getNotificationPriorityValues;
/**
 * Get notification status values
 */
const getNotificationStatusValues = () => Object.values(NotificationStatus);
exports.getNotificationStatusValues = getNotificationStatusValues;
/**
 * Helper to format notification message with variables
 */
const formatNotificationMessage = (template, variables) => {
    let formatted = template;
    Object.entries(variables).forEach(([key, value]) => {
        formatted = formatted.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    return formatted;
};
exports.formatNotificationMessage = formatNotificationMessage;
/**
 * Notification validation rules
 */
exports.NotificationValidationRules = {
    MIN_TITLE_LENGTH: 5,
    MAX_TITLE_LENGTH: 200,
    MIN_MESSAGE_LENGTH: 10,
    MAX_MESSAGE_LENGTH: 2000,
    MAX_METADATA_SIZE: 5000, // bytes
    MAX_TEMPLATE_VARIABLES: 50,
    MIN_RETRY_DELAY: 60, // seconds
    MAX_RETRY_DELAY: 3600, // seconds
};
