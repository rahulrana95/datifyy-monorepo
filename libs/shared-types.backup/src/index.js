"use strict";
// libs/shared-types/src/index.ts - FIXED VERSION
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancellationPolicy = exports.RecurrenceType = exports.AvailabilityStatus = exports.DateType = exports.AdminRiskLevel = exports.AdminLoginAttemptResult = exports.ADMIN_ROLE_PERMISSIONS = exports.ADMIN_SECURITY_CONSTANTS = exports.AdminSessionStatus = exports.AdminTwoFactorMethod = exports.AdminAccountStatus = exports.AdminPermission = exports.AdminPermissionLevel = exports.AuthView = exports.RevenueValidationRules = exports.REVENUE_ANALYTICS_CONSTANTS = exports.MatchSuggestionValidationRules = exports.MATCH_SUGGESTION_CONSTANTS = exports.NotificationValidationRules = exports.NOTIFICATION_CONSTANTS = exports.DASHBOARD_METRIC_TYPES = exports.ALERT_SEVERITY_LEVELS = exports.DASHBOARD_REFRESH_INTERVALS = exports.MatchSuggestionStatus = exports.DateSuccessPrediction = exports.MatchConfidenceLevel = exports.CompatibilityFactor = exports.MatchAlgorithm = exports.NotificationFrequency = exports.NotificationStatus = exports.NotificationPriority = exports.NotificationTriggerEvent = exports.NotificationChannel = exports.TrendDirection = exports.PaymentMethod = exports.TransactionStatus = exports.RevenueCategory = exports.RevenueTimePeriod = exports.AdminDateCurationValidationRules = exports.getWorkflowStageStatusValues = exports.getCurationWorkflowStageValues = exports.getCancellationCategoryValues = exports.getRelationshipStageValues = exports.getCuratedDateStatusValues = exports.getDateModeValues = exports.WorkflowStageStatus = exports.CurationWorkflowStage = exports.CancellationCategory = exports.RelationshipStage = exports.DateMode = void 0;
exports.predictDateSuccess = exports.determineMatchConfidenceLevel = exports.calculateOverallCompatibilityScore = exports.getCompatibilityFactorValues = exports.getMatchAlgorithmValues = exports.getNotificationStatusValues = exports.getNotificationPriorityValues = exports.getNotificationChannelValues = exports.getNotificationTriggerEventValues = exports.formatNotificationMessage = exports.getRevenueTimePeriodValues = exports.getPaymentMethodValues = exports.getTransactionStatusValues = exports.getRevenueCategoryValues = exports.calculatePercentageChange = exports.formatCurrency = exports.AvailabilityValidationRules = exports.SelectedActivity = exports.BookingStatus = void 0;
// Export all enums
__exportStar(require("./enums"), exports);
// Export core interfaces (keeping existing structure)
__exportStar(require("./interfaces/storage.interfaces"), exports);
__exportStar(require("./interfaces/admin.interfaces"), exports);
__exportStar(require("./interfaces/api.interfaces"), exports);
__exportStar(require("./interfaces/user.interfaces"), exports);
__exportStar(require("./interfaces/dating.interfaces"), exports);
__exportStar(require("./interfaces/userAvailability.interfaces"), exports);
// 🎯 NEW: Export admin dashboard interfaces (but avoid conflicts)
__exportStar(require("./interfaces/admin/adminDashboard.interfaces"), exports);
__exportStar(require("./interfaces/admin/revenueAnalytics.interfaces"), exports);
__exportStar(require("./interfaces/admin/adminNotifications.interfaces"), exports);
__exportStar(require("./interfaces/admin/matchSuggestions.interfaces"), exports);
// 🎯 CONFLICTING: Handle date curation interfaces carefully
// Export existing date curation interfaces (original)
__exportStar(require("./interfaces/dateCuration.interfaces"), exports);
// Export admin date curation with specific aliases to avoid conflicts
var dateCuration_interfaces_1 = require("./interfaces/admin/dateCuration.interfaces");
// Keep enums without conflicts
Object.defineProperty(exports, "DateMode", { enumerable: true, get: function () { return dateCuration_interfaces_1.DateMode; } });
Object.defineProperty(exports, "RelationshipStage", { enumerable: true, get: function () { return dateCuration_interfaces_1.RelationshipStage; } });
Object.defineProperty(exports, "CancellationCategory", { enumerable: true, get: function () { return dateCuration_interfaces_1.CancellationCategory; } });
Object.defineProperty(exports, "CurationWorkflowStage", { enumerable: true, get: function () { return dateCuration_interfaces_1.CurationWorkflowStage; } });
Object.defineProperty(exports, "WorkflowStageStatus", { enumerable: true, get: function () { return dateCuration_interfaces_1.WorkflowStageStatus; } });
// Helper functions with prefixes
Object.defineProperty(exports, "getDateModeValues", { enumerable: true, get: function () { return dateCuration_interfaces_1.getDateModeValues; } });
Object.defineProperty(exports, "getCuratedDateStatusValues", { enumerable: true, get: function () { return dateCuration_interfaces_1.getCuratedDateStatusValues; } });
Object.defineProperty(exports, "getRelationshipStageValues", { enumerable: true, get: function () { return dateCuration_interfaces_1.getRelationshipStageValues; } });
Object.defineProperty(exports, "getCancellationCategoryValues", { enumerable: true, get: function () { return dateCuration_interfaces_1.getCancellationCategoryValues; } });
Object.defineProperty(exports, "getCurationWorkflowStageValues", { enumerable: true, get: function () { return dateCuration_interfaces_1.getCurationWorkflowStageValues; } });
Object.defineProperty(exports, "getWorkflowStageStatusValues", { enumerable: true, get: function () { return dateCuration_interfaces_1.getWorkflowStageStatusValues; } });
Object.defineProperty(exports, "AdminDateCurationValidationRules", { enumerable: true, get: function () { return dateCuration_interfaces_1.DateCurationValidationRules; } });
// 🔧 FIXED: Export enums from correct files
var revenueAnalytics_interfaces_1 = require("./interfaces/admin/revenueAnalytics.interfaces");
// Revenue enums - from revenueAnalytics.interfaces
Object.defineProperty(exports, "RevenueTimePeriod", { enumerable: true, get: function () { return revenueAnalytics_interfaces_1.RevenueTimePeriod; } });
Object.defineProperty(exports, "RevenueCategory", { enumerable: true, get: function () { return revenueAnalytics_interfaces_1.RevenueCategory; } });
Object.defineProperty(exports, "TransactionStatus", { enumerable: true, get: function () { return revenueAnalytics_interfaces_1.TransactionStatus; } });
Object.defineProperty(exports, "PaymentMethod", { enumerable: true, get: function () { return revenueAnalytics_interfaces_1.PaymentMethod; } });
Object.defineProperty(exports, "TrendDirection", { enumerable: true, get: function () { return revenueAnalytics_interfaces_1.TrendDirection; } });
var adminNotifications_interfaces_1 = require("./interfaces/admin/adminNotifications.interfaces");
// Notification enums - from adminNotifications.interfaces  
Object.defineProperty(exports, "NotificationChannel", { enumerable: true, get: function () { return adminNotifications_interfaces_1.NotificationChannel; } });
Object.defineProperty(exports, "NotificationTriggerEvent", { enumerable: true, get: function () { return adminNotifications_interfaces_1.NotificationTriggerEvent; } });
Object.defineProperty(exports, "NotificationPriority", { enumerable: true, get: function () { return adminNotifications_interfaces_1.NotificationPriority; } });
Object.defineProperty(exports, "NotificationStatus", { enumerable: true, get: function () { return adminNotifications_interfaces_1.NotificationStatus; } });
Object.defineProperty(exports, "NotificationFrequency", { enumerable: true, get: function () { return adminNotifications_interfaces_1.NotificationFrequency; } });
var matchSuggestions_interfaces_1 = require("./interfaces/admin/matchSuggestions.interfaces");
// Match suggestion enums - from matchSuggestions.interfaces
Object.defineProperty(exports, "MatchAlgorithm", { enumerable: true, get: function () { return matchSuggestions_interfaces_1.MatchAlgorithm; } });
Object.defineProperty(exports, "CompatibilityFactor", { enumerable: true, get: function () { return matchSuggestions_interfaces_1.CompatibilityFactor; } });
Object.defineProperty(exports, "MatchConfidenceLevel", { enumerable: true, get: function () { return matchSuggestions_interfaces_1.MatchConfidenceLevel; } });
Object.defineProperty(exports, "DateSuccessPrediction", { enumerable: true, get: function () { return matchSuggestions_interfaces_1.DateSuccessPrediction; } });
Object.defineProperty(exports, "MatchSuggestionStatus", { enumerable: true, get: function () { return matchSuggestions_interfaces_1.MatchSuggestionStatus; } });
// Export constants from correct files
var adminDashboard_interfaces_1 = require("./interfaces/admin/adminDashboard.interfaces");
Object.defineProperty(exports, "DASHBOARD_REFRESH_INTERVALS", { enumerable: true, get: function () { return adminDashboard_interfaces_1.DASHBOARD_REFRESH_INTERVALS; } });
Object.defineProperty(exports, "ALERT_SEVERITY_LEVELS", { enumerable: true, get: function () { return adminDashboard_interfaces_1.ALERT_SEVERITY_LEVELS; } });
Object.defineProperty(exports, "DASHBOARD_METRIC_TYPES", { enumerable: true, get: function () { return adminDashboard_interfaces_1.DASHBOARD_METRIC_TYPES; } });
var adminNotifications_interfaces_2 = require("./interfaces/admin/adminNotifications.interfaces");
Object.defineProperty(exports, "NOTIFICATION_CONSTANTS", { enumerable: true, get: function () { return adminNotifications_interfaces_2.NOTIFICATION_CONSTANTS; } });
Object.defineProperty(exports, "NotificationValidationRules", { enumerable: true, get: function () { return adminNotifications_interfaces_2.NotificationValidationRules; } });
var matchSuggestions_interfaces_2 = require("./interfaces/admin/matchSuggestions.interfaces");
Object.defineProperty(exports, "MATCH_SUGGESTION_CONSTANTS", { enumerable: true, get: function () { return matchSuggestions_interfaces_2.MATCH_SUGGESTION_CONSTANTS; } });
Object.defineProperty(exports, "MatchSuggestionValidationRules", { enumerable: true, get: function () { return matchSuggestions_interfaces_2.MatchSuggestionValidationRules; } });
var revenueAnalytics_interfaces_2 = require("./interfaces/admin/revenueAnalytics.interfaces");
Object.defineProperty(exports, "REVENUE_ANALYTICS_CONSTANTS", { enumerable: true, get: function () { return revenueAnalytics_interfaces_2.REVENUE_ANALYTICS_CONSTANTS; } });
Object.defineProperty(exports, "RevenueValidationRules", { enumerable: true, get: function () { return revenueAnalytics_interfaces_2.RevenueValidationRules; } });
// Explicit dating interface exports (keeping existing)
var dating_interfaces_1 = require("./interfaces/dating.interfaces");
Object.defineProperty(exports, "AuthView", { enumerable: true, get: function () { return dating_interfaces_1.AuthView; } });
// Admin permission exports
var admin_enum_1 = require("./enums/admin.enum");
Object.defineProperty(exports, "AdminPermissionLevel", { enumerable: true, get: function () { return admin_enum_1.AdminPermissionLevel; } });
Object.defineProperty(exports, "AdminPermission", { enumerable: true, get: function () { return admin_enum_1.AdminPermission; } });
Object.defineProperty(exports, "AdminAccountStatus", { enumerable: true, get: function () { return admin_enum_1.AdminAccountStatus; } });
Object.defineProperty(exports, "AdminTwoFactorMethod", { enumerable: true, get: function () { return admin_enum_1.AdminTwoFactorMethod; } });
Object.defineProperty(exports, "AdminSessionStatus", { enumerable: true, get: function () { return admin_enum_1.AdminSessionStatus; } });
Object.defineProperty(exports, "ADMIN_SECURITY_CONSTANTS", { enumerable: true, get: function () { return admin_enum_1.ADMIN_SECURITY_CONSTANTS; } });
Object.defineProperty(exports, "ADMIN_ROLE_PERMISSIONS", { enumerable: true, get: function () { return admin_enum_1.ADMIN_ROLE_PERMISSIONS; } });
Object.defineProperty(exports, "AdminLoginAttemptResult", { enumerable: true, get: function () { return admin_enum_1.AdminLoginAttemptResult; } });
Object.defineProperty(exports, "AdminRiskLevel", { enumerable: true, get: function () { return admin_enum_1.AdminRiskLevel; } });
// User availability exports
var userAvailability_interfaces_1 = require("./interfaces/userAvailability.interfaces");
Object.defineProperty(exports, "DateType", { enumerable: true, get: function () { return userAvailability_interfaces_1.DateType; } });
Object.defineProperty(exports, "AvailabilityStatus", { enumerable: true, get: function () { return userAvailability_interfaces_1.AvailabilityStatus; } });
Object.defineProperty(exports, "RecurrenceType", { enumerable: true, get: function () { return userAvailability_interfaces_1.RecurrenceType; } });
Object.defineProperty(exports, "CancellationPolicy", { enumerable: true, get: function () { return userAvailability_interfaces_1.CancellationPolicy; } });
Object.defineProperty(exports, "BookingStatus", { enumerable: true, get: function () { return userAvailability_interfaces_1.BookingStatus; } });
Object.defineProperty(exports, "SelectedActivity", { enumerable: true, get: function () { return userAvailability_interfaces_1.SelectedActivity; } });
Object.defineProperty(exports, "AvailabilityValidationRules", { enumerable: true, get: function () { return userAvailability_interfaces_1.AvailabilityValidationRules; } });
// 🔧 FIXED: Helper function exports from correct files
var revenueAnalytics_interfaces_3 = require("./interfaces/admin/revenueAnalytics.interfaces");
Object.defineProperty(exports, "formatCurrency", { enumerable: true, get: function () { return revenueAnalytics_interfaces_3.formatCurrency; } });
Object.defineProperty(exports, "calculatePercentageChange", { enumerable: true, get: function () { return revenueAnalytics_interfaces_3.calculatePercentageChange; } });
Object.defineProperty(exports, "getRevenueCategoryValues", { enumerable: true, get: function () { return revenueAnalytics_interfaces_3.getRevenueCategoryValues; } });
Object.defineProperty(exports, "getTransactionStatusValues", { enumerable: true, get: function () { return revenueAnalytics_interfaces_3.getTransactionStatusValues; } });
Object.defineProperty(exports, "getPaymentMethodValues", { enumerable: true, get: function () { return revenueAnalytics_interfaces_3.getPaymentMethodValues; } });
Object.defineProperty(exports, "getRevenueTimePeriodValues", { enumerable: true, get: function () { return revenueAnalytics_interfaces_3.getRevenueTimePeriodValues; } });
var adminNotifications_interfaces_3 = require("./interfaces/admin/adminNotifications.interfaces");
Object.defineProperty(exports, "formatNotificationMessage", { enumerable: true, get: function () { return adminNotifications_interfaces_3.formatNotificationMessage; } });
Object.defineProperty(exports, "getNotificationTriggerEventValues", { enumerable: true, get: function () { return adminNotifications_interfaces_3.getNotificationTriggerEventValues; } });
Object.defineProperty(exports, "getNotificationChannelValues", { enumerable: true, get: function () { return adminNotifications_interfaces_3.getNotificationChannelValues; } });
Object.defineProperty(exports, "getNotificationPriorityValues", { enumerable: true, get: function () { return adminNotifications_interfaces_3.getNotificationPriorityValues; } });
Object.defineProperty(exports, "getNotificationStatusValues", { enumerable: true, get: function () { return adminNotifications_interfaces_3.getNotificationStatusValues; } });
var matchSuggestions_interfaces_3 = require("./interfaces/admin/matchSuggestions.interfaces");
Object.defineProperty(exports, "getMatchAlgorithmValues", { enumerable: true, get: function () { return matchSuggestions_interfaces_3.getMatchAlgorithmValues; } });
Object.defineProperty(exports, "getCompatibilityFactorValues", { enumerable: true, get: function () { return matchSuggestions_interfaces_3.getCompatibilityFactorValues; } });
Object.defineProperty(exports, "calculateOverallCompatibilityScore", { enumerable: true, get: function () { return matchSuggestions_interfaces_3.calculateOverallCompatibilityScore; } });
Object.defineProperty(exports, "determineMatchConfidenceLevel", { enumerable: true, get: function () { return matchSuggestions_interfaces_3.determineMatchConfidenceLevel; } });
Object.defineProperty(exports, "predictDateSuccess", { enumerable: true, get: function () { return matchSuggestions_interfaces_3.predictDateSuccess; } });
// 🔧 REMOVED THE PROBLEMATIC export type BLOCK
// The `export *` statements above already handle all type exports
// Individual type exports are handled within the specific export blocks above
