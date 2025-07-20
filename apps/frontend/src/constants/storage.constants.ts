// apps/frontend/src/constants/storage.constants.ts

/**
 * Storage key constants for localStorage, sessionStorage, and cookies
 */

// Auth storage keys
export const AUTH_STORAGE_KEYS = {
  // User auth
  TOKEN: 'token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  
  // Admin auth
  ADMIN_TOKEN: 'admin_access_token',
  ADMIN_SESSION_ID: 'admin_session_id',
  ADMIN_REMEMBER_ME: 'admin_remember_me',
  ADMIN_PROFILE: 'admin_profile',
  
  // Auth state
  AUTH_STATE: 'datifyy-auth',
} as const;

// Feature flag storage keys
export const FEATURE_FLAG_KEYS = {
  USE_MOCK_DATA: 'useMockData',
  USE_VERIFICATION_MOCK_DATA: 'useVerificationMockData',
  USE_REVENUE_MOCK_DATA: 'useRevenueMockData',
  USE_GENIE_MOCK_DATA: 'useGenieMockData',
  ENABLE_DEBUG_MODE: 'enableDebugMode',
} as const;

// User preference storage keys
export const USER_PREFERENCE_KEYS = {
  THEME: 'user_theme',
  LANGUAGE: 'user_language',
  NOTIFICATION_SETTINGS: 'notification_settings',
  SEARCH_FILTERS: 'search_filters',
  TABLE_PREFERENCES: 'table_preferences',
} as const;

// Cache storage keys
export const CACHE_KEYS = {
  DASHBOARD_METRICS: 'dashboard_metrics_cache',
  USER_LIST: 'user_list_cache',
  TEMPLATES: 'email_templates_cache',
  LOCATIONS: 'locations_cache',
} as const;

// Session storage keys
export const SESSION_KEYS = {
  CURRENT_TAB: 'current_tab',
  SCROLL_POSITION: 'scroll_position',
  FORM_DATA: 'form_data_temp',
  SEARCH_QUERY: 'search_query',
} as const;

// Cookie names
export const COOKIE_NAMES = {
  AUTH_TOKEN: 'token',
  ADMIN_TOKEN: 'admin_token',
  SESSION_ID: 'session_id',
  REMEMBER_ME: 'remember_me',
  CONSENT: 'cookie_consent',
  ANALYTICS: 'analytics_consent',
} as const;

// Storage expiry times (in days)
export const STORAGE_EXPIRY = {
  SHORT_TERM: 1, // 1 day
  MEDIUM_TERM: 7, // 1 week
  LONG_TERM: 30, // 30 days
  PERMANENT: 365, // 1 year
} as const;