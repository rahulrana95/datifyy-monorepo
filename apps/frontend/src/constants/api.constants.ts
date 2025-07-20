// apps/frontend/src/constants/api.constants.ts

/**
 * API endpoint constants for the application
 */

// API version prefix
export const API_VERSION = 'api/v1';

// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: 'auth/login',
  LOGOUT: 'auth/logout',
  SIGNUP: 'auth/signup',
  VERIFY_TOKEN: 'auth/verify-token',
  FORGOT_PASSWORD: 'auth/forgot-password',
  RESET_PASSWORD: 'auth/reset-password',
  CHANGE_PASSWORD: 'auth/change-password',
  REFRESH_TOKEN: 'auth/refresh-token',
  RESEND_OTP: 'auth/resend-otp',
  VERIFY_OTP: 'auth/verify-otp',
  USER_PROFILE: 'user-profile',
  CURRENT_USER: 'auth/current-user',
} as const;

// Admin auth endpoints
export const ADMIN_AUTH_ENDPOINTS = {
  PREFIX: 'admin/auth',
  LOGIN: 'admin/auth/login',
  LOGOUT: 'admin/auth/logout',
  VERIFY_TOKEN: 'admin/auth/verify-token',
  FORGOT_PASSWORD: 'admin/auth/forgot-password',
} as const;

// Admin API endpoints
export const ADMIN_ENDPOINTS = {
  // Dashboard
  DASHBOARD_METRICS: 'admin/dashboard/metrics',
  DASHBOARD_ANALYTICS: 'admin/dashboard/analytics',
  
  // Date curation
  DATE_CURATION_PREFIX: 'admin/date-curation',
  UNMATCHED_USERS: 'admin/date-curation/unmatched-users',
  MATCH_USERS: 'admin/date-curation/match-users',
  SCHEDULED_DATES: 'admin/date-curation/scheduled-dates',
  USER_PREFERENCES: 'admin/date-curation/user/{userId}/preferences',
  
  // Notifications
  BULK_EMAIL: 'admin/notifications/email/bulk-send',
  EMAIL_TEMPLATES: 'admin/notifications/templates',
  
  // User management
  USERS_LIST: 'admin/users',
  USER_DETAILS: 'admin/users/{userId}',
  USER_VERIFICATION: 'admin/users/{userId}/verify',
  
  // Revenue
  REVENUE_METRICS: 'admin/revenue/metrics',
  TRANSACTIONS: 'admin/revenue/transactions',
} as const;

// Frontend routes
export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  
  // Admin routes
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_CURATE_DATES: '/admin/curate-dates',
  ADMIN_GENIE: '/admin/genie',
  ADMIN_VERIFICATION: '/admin/verification',
  ADMIN_REVENUE: '/admin/revenue',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_FORGOT_PASSWORD: '/admin/forgot-password',
  
  // User routes
  USER_DASHBOARD: '/dashboard',
  USER_PROFILE: '/profile',
  USER_MATCHES: '/matches',
  USER_DATES: '/dates',
} as const;

// API response times (for mock data)
export const API_DELAYS = {
  SHORT: 500,
  MEDIUM: 800,
  LONG: 1000,
  EXTRA_LONG: 2000,
} as const;

// API headers
export const API_HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  ACCEPT: 'Accept',
  CLIENT_VERSION: 'X-Client-Version',
} as const;