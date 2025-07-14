// libs/shared-types/src/index.ts - FIXED VERSION

// Export all enums
export * from './enums';

// Export core interfaces (keeping existing structure)
export * from './interfaces/storage.interfaces';
export * from './interfaces/admin.interfaces'; 
export * from './interfaces/api.interfaces';
export * from './interfaces/user.interfaces';
export * from './interfaces/dating.interfaces';
export * from './interfaces/userAvailability.interfaces';

// 🎯 NEW: Export admin dashboard interfaces (but avoid conflicts)
export * from './interfaces/admin/adminDashboard.interfaces';
export * from './interfaces/admin/revenueAnalytics.interfaces';
export * from './interfaces/admin/adminNotifications.interfaces';
export * from './interfaces/admin/matchSuggestions.interfaces';

// 🎯 CONFLICTING: Handle date curation interfaces carefully
// Export existing date curation interfaces (original)
export * from './interfaces/dateCuration.interfaces';

// Export admin date curation with specific aliases to avoid conflicts
export {
  // Admin-specific date curation interfaces (renamed to avoid conflicts)
  CuratedDate as AdminCuratedDate,
  DateFeedback as AdminDateFeedback,
  UserTrustScore as AdminUserTrustScore,
  DateSeries as AdminDateSeries,
  CurationWorkflow as AdminCurationWorkflow,
  
  // Admin-specific requests (renamed)
  CreateCuratedDateRequest as AdminCreateCuratedDateRequest,
  UpdateCuratedDateRequest as AdminUpdateCuratedDateRequest,
  AdminGetDatesRequest as AdminGetAllDatesRequest,
  SearchPotentialMatchesRequest as AdminSearchMatchesRequest,
  
  // Admin-specific responses (renamed)
  CuratedDateResponse as AdminCuratedDateResponse,
  UserDatesResponse as AdminUserDatesResponse,
  SearchPotentialMatchesResponse as AdminMatchSearchResponse,
  DateCurationAnalyticsResponse as AdminDateAnalyticsResponse,
  
  // Keep enums without conflicts
  DateMode,
  CuratedDateStatus,
  RelationshipStage,
  CancellationCategory,
  CurationWorkflowStage,
  WorkflowStageStatus,
  
  // Helper functions with prefixes
  getDateModeValues,
  getCuratedDateStatusValues,
  getRelationshipStageValues,
  getCancellationCategoryValues,
  getCurationWorkflowStageValues,
  getWorkflowStageStatusValues,
  DateCurationValidationRules as AdminDateCurationValidationRules,
  
} from './interfaces/admin/dateCuration.interfaces';

// 🔧 FIXED: Export enums from correct files
export {
  // Revenue enums - from revenueAnalytics.interfaces
  RevenueTimePeriod,
  RevenueCategory,
  TransactionStatus,
  PaymentMethod,
  TrendDirection,
} from './interfaces/admin/revenueAnalytics.interfaces';

export {
  // Notification enums - from adminNotifications.interfaces  
  NotificationChannel,
  NotificationTriggerEvent,
  NotificationPriority,
  NotificationStatus,
  NotificationFrequency,
} from './interfaces/admin/adminNotifications.interfaces';

export {
  // Match suggestion enums - from matchSuggestions.interfaces
  MatchAlgorithm,
  CompatibilityFactor,
  MatchConfidenceLevel,
  DateSuccessPrediction,
  MatchSuggestionStatus,
} from './interfaces/admin/matchSuggestions.interfaces';

// Export constants from correct files
export {
  DASHBOARD_REFRESH_INTERVALS,
  ALERT_SEVERITY_LEVELS,
  DASHBOARD_METRIC_TYPES,
} from './interfaces/admin/adminDashboard.interfaces';

export {
  NOTIFICATION_CONSTANTS,
  NotificationValidationRules,
} from './interfaces/admin/adminNotifications.interfaces';

export {
  MATCH_SUGGESTION_CONSTANTS,
  MatchSuggestionValidationRules,
} from './interfaces/admin/matchSuggestions.interfaces';

export {
  REVENUE_ANALYTICS_CONSTANTS,
  RevenueValidationRules,
} from './interfaces/admin/revenueAnalytics.interfaces';

// Explicit dating interface exports (keeping existing)
export {
  AuthView,
  type UserData,
  type AuthModalState,
  type FormFieldErrors,
  type SignupFormData,
  type LoginFormData,
  type ForgotPasswordFormData,
  type AuthStep,
  type ForgotPasswordStep,
  type DatifyyUserProfile,
  type DatifyyUserPartnerPreferences,
  type PartnerPreferences,
  type PreferencePage,
  type SwipeAction,
  type SwipeData,
  type MatchData,
  type ProfileCardData,
  type ProfileCardProps,
  type LastSeenInfo,
  type AgeInfo,
  type ValidationResult,
  type Coordinates,
  type LocationInfo,
  type DistanceInfo,
} from './interfaces/dating.interfaces';

// Admin permission exports
export {
  AdminPermissionLevel,
  AdminPermission,
  AdminAccountStatus,
  AdminTwoFactorMethod,
  AdminSessionStatus,
  ADMIN_SECURITY_CONSTANTS,
  ADMIN_ROLE_PERMISSIONS,
  AdminLoginAttemptResult,
  AdminRiskLevel
} from './enums/admin.enum';

// User availability exports
export {
  DateType,
  AvailabilityStatus,
  RecurrenceType,
  CancellationPolicy,
  BookingStatus,
  SelectedActivity,
  
  type AvailabilitySlot,
  type AvailabilityBooking,
  type UserAvailabilityPreferences,
  type CreateAvailabilityRequest,
  type UpdateAvailabilityRequest,
  type GetAvailabilityRequest,
  type SearchAvailableUsersRequest,
  type AvailabilityResponse,
  type AvailabilityListResponse,
  
  AvailabilityValidationRules
} from './interfaces/userAvailability.interfaces';

// 🔧 FIXED: Helper function exports from correct files
export {
  formatCurrency,
  calculatePercentageChange,
  getRevenueCategoryValues,
  getTransactionStatusValues,
  getPaymentMethodValues,
  getRevenueTimePeriodValues,
} from './interfaces/admin/revenueAnalytics.interfaces';

export {
  formatNotificationMessage,
  getNotificationTriggerEventValues,
  getNotificationChannelValues,
  getNotificationPriorityValues,
  getNotificationStatusValues,
} from './interfaces/admin/adminNotifications.interfaces';

export {
  getMatchAlgorithmValues,
  getCompatibilityFactorValues,
  calculateOverallCompatibilityScore,
  determineMatchConfidenceLevel,
  predictDateSuccess,
} from './interfaces/admin/matchSuggestions.interfaces';

// 🔧 REMOVED THE PROBLEMATIC export type BLOCK
// The `export *` statements above already handle all type exports
// Individual type exports are handled within the specific export blocks above