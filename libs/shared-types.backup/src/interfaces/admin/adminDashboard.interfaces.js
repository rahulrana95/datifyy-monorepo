"use strict";
/**
 * Admin Dashboard Interfaces
 * Core interfaces for the admin dashboard overview and metrics
 *
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DASHBOARD_METRIC_TYPES = exports.ALERT_SEVERITY_LEVELS = exports.DASHBOARD_REFRESH_INTERVALS = void 0;
// =============================================================================
// CONSTANTS
// =============================================================================
/**
 * Dashboard refresh intervals in seconds
 */
exports.DASHBOARD_REFRESH_INTERVALS = {
    METRICS: 300, // 5 minutes
    ALERTS: 60, // 1 minute
    TRENDS: 3600, // 1 hour
    SYSTEM_HEALTH: 30, // 30 seconds
};
/**
 * Alert severity levels
 */
exports.ALERT_SEVERITY_LEVELS = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical',
};
/**
 * Metric types for dashboard
 */
exports.DASHBOARD_METRIC_TYPES = {
    USERS: 'users',
    DATES: 'dates',
    REVENUE: 'revenue',
    ACTIVITY: 'activity',
};
