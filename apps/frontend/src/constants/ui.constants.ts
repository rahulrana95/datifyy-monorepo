// apps/frontend/src/constants/ui.constants.ts

/**
 * UI text constants for labels, messages, and placeholders
 */

// App branding
export const APP_BRANDING = {
  NAME: 'Datifyy',
  ADMIN_NAME: 'Datifyy Admin',
  TAGLINE: 'Find your perfect match',
  COPYRIGHT: '© 2024 Datifyy. All rights reserved.',
  ADMIN_COPYRIGHT: '© 2024 Datifyy Admin Panel. All rights reserved.',
} as const;

// Admin login page
export const ADMIN_LOGIN = {
  TITLE: 'Admin Login',
  SUBTITLE: 'Secure access to Datifyy administration panel',
  SIGN_IN_TITLE: 'Sign In to Admin Panel',
  SECURITY_BADGE: '🔒 Encrypted & Monitored',
  SECURITY_NOTE: 'This is a secure admin area. All activities are logged and monitored.',
  FORGOT_PASSWORD_TEXT: 'Forgot your password?',
  REMEMBER_ME_TEXT: 'Remember me on this device',
} as const;

// Form labels
export const FORM_LABELS = {
  EMAIL: 'Email',
  PASSWORD: 'Password',
  CONFIRM_PASSWORD: 'Confirm Password',
  FIRST_NAME: 'First Name',
  LAST_NAME: 'Last Name',
  PHONE: 'Phone Number',
  DATE_OF_BIRTH: 'Date of Birth',
  GENDER: 'Gender',
  BIO: 'Bio',
  LOCATION: 'Location',
  PREFERENCES: 'Preferences',
} as const;

// Form placeholders
export const PLACEHOLDERS = {
  EMAIL: 'Enter your email',
  ADMIN_EMAIL: 'admin@datifyy.com',
  PASSWORD: 'Enter your password',
  SEARCH_USERS: 'Search by user or transaction ID...',
  SEARCH_DATES: 'Search by date or user...',
  SEARCH_LOCATION: 'Search for a location...',
  MESSAGE: 'Type your message here...',
  FILTER: 'Filter by...',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  // Auth errors
  LOGIN_FAILED: 'Login failed. Please try again.',
  INVALID_CREDENTIALS: 'Invalid email or password. Please try again.',
  ACCOUNT_LOCKED: 'Your account has been locked. Please contact support.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  
  // Validation errors
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Please provide a valid email address',
  EMAIL_TOO_LONG: 'Email must not exceed 255 characters',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters long',
  PASSWORD_TOO_LONG: 'Password must not exceed 128 characters',
  PASSWORDS_DO_NOT_MATCH: 'Passwords do not match',
  
  // General errors
  GENERIC_ERROR: 'An unexpected error occurred. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  NOT_FOUND: 'The requested resource was not found.',
  
  // Specific errors
  USER_NOT_FOUND: 'User not found',
  INSUFFICIENT_TOKENS: 'Insufficient love tokens for one or both users',
  INVALID_RESPONSE: 'Invalid response from server',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  LOGOUT_SUCCESS: 'Logged out successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  EMAIL_SENT: 'Email sent successfully',
  DATE_SCHEDULED: 'Date scheduled successfully',
  MATCH_CREATED: 'Match created successfully',
  VERIFICATION_COMPLETE: 'Verification completed successfully',
} as const;

// Button text
export const BUTTON_TEXT = {
  SIGN_IN: 'Sign In',
  SIGN_UP: 'Sign Up',
  LOGOUT: 'Logout',
  SUBMIT: 'Submit',
  CANCEL: 'Cancel',
  SAVE: 'Save',
  DELETE: 'Delete',
  CONFIRM: 'Confirm',
  BACK: 'Back',
  NEXT: 'Next',
  FINISH: 'Finish',
  RETRY: 'Retry',
  SEND: 'Send',
  SCHEDULE: 'Schedule',
  MATCH: 'Match',
  VIEW_DETAILS: 'View Details',
  EDIT: 'Edit',
  APPROVE: 'Approve',
  REJECT: 'Reject',
} as const;

// Status messages
export const STATUS_MESSAGES = {
  LOADING: 'Loading...',
  SAVING: 'Saving...',
  PROCESSING: 'Processing...',
  ALL_SYSTEMS_OPERATIONAL: 'All systems operational',
  ACTIVE_ALERTS: 'Active Alerts',
  PENDING_REVIEWS: 'pending reviews',
  NO_DATA: 'No data available',
  NO_RESULTS: 'No results found',
  END_OF_RESULTS: 'End of results',
} as const;

// Navigation items
export const NAV_ITEMS = {
  DASHBOARD: 'Dashboard',
  USERS: 'Users',
  CURATE_DATES: 'Curate Dates',
  GENIE: 'Genie',
  VERIFICATION: 'Verification',
  REVENUE: 'Revenue',
  SETTINGS: 'Settings',
  PROFILE: 'Profile',
  HELP: 'Help',
  NOTIFICATIONS: 'Notifications',
} as const;

// Table headers
export const TABLE_HEADERS = {
  ID: 'ID',
  NAME: 'Name',
  EMAIL: 'Email',
  STATUS: 'Status',
  DATE: 'Date',
  TIME: 'Time',
  AMOUNT: 'Amount',
  ACTIONS: 'Actions',
  CREATED_AT: 'Created At',
  UPDATED_AT: 'Updated At',
} as const;

