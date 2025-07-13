// libs/shared-types/src/index.ts - Updated with User Availability Types

// Export all enums
export * from './enums';


// Export all interfaces
export * from './interfaces';

// Export storage interfaces
export * from './interfaces/storage.interfaces';

// Export admin interfaces
export * from './interfaces/admin.interfaces'; 
export * from './interfaces/api.interfaces';
export * from './interfaces/user.interfaces';
export * from './interfaces/dating.interfaces';

// Export user availability interfaces (NEW)
export * from './interfaces/userAvailability.interfaces';

// NEW: Date Curation exports
export * from './interfaces/dateCuration.interfaces';

// Re-export commonly used types for convenience
export type {
  // Date Curation Core Types
  CuratedDate,
  DateFeedback,
  UserTrustScore,
  DateSeries,
  PotentialMatchResponse,
  CuratedDateResponse,
  
  // Date Curation Requests
  CreateCuratedDateRequest,
  UpdateCuratedDateRequest,
  ConfirmDateRequest,
  CancelDateRequest,
  SubmitDateFeedbackRequest,
  GetUserDatesRequest,
  AdminGetDatesRequest,
  SearchPotentialMatchesRequest,
  DateCurationAnalyticsRequest,
  
  // Date Curation Responses
  UserDatesResponse,
  SearchPotentialMatchesResponse,
  DateFeedbackResponse,
  UserTrustScoreResponse,
  DateSeriesResponse,
  DateCurationAnalyticsResponse,
  CreateCuratedDateResponse,
  UpdateCuratedDateResponse,
  GetCuratedDateResponse,
  ConfirmDateResponse,
  CancelDateResponse,
  SubmitDateFeedbackResponse,
  GetUserTrustScoreResponse,
  GetDateSeriesResponse,
  
  // Utility Types
  DateConflict,
  CompatibilityDetails,
  DateCreationResult,
  BulkDateOperationResult
} from './interfaces/dateCuration.interfaces';

// Export enums for easy access
export {
  DateMode,
  CuratedDateStatus,
  RelationshipStage,
  CancellationCategory,
  CurationWorkflowStage,
  WorkflowStageStatus,
  
  // Helper functions
  getDateModeValues,
  getCuratedDateStatusValues,
  getRelationshipStageValues,
  getCancellationCategoryValues,
  getCurationWorkflowStageValues,
  getWorkflowStageStatusValues,
  
  // Validation rules
  DateCurationValidationRules
} from './interfaces/dateCuration.interfaces';  

// Explicit exports to ensure they're available
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

export {
  type ApiResponse,
  type PaginationRequest,
  type PaginationResponse,
  type ServiceResponse,
  type LoginRequest,
  type LoginResponse,
  type SignupRequest,
  type SignupResponse,
  type UserProfileResponse,
  type UpdateProfileRequest,
  type PartnerPreferencesResponse,
  type UpdatePartnerPreferencesRequest,
  type ErrorResponse,
} from './interfaces/api.interfaces';

// Explicit storage exports
export {
  type StorageUploadOptions,
  type StorageUploadResult,
  type StorageListOptions,
  type StorageListResult,
  type StorageFileInfo,
  type StorageHealthCheck,
  type StorageConfig,
  type ImageProcessingOptions,
  type UploadProgress,
  type FileValidationResult,
  type IClientStorageProvider,
  StorageError,
  StorageQuotaExceededError,
  StorageFileTooLargeError,
  StorageInvalidFileTypeError
} from './interfaces/storage.interfaces';

// Explicit admin exports
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

// Explicit user availability exports (NEW)
export {
  // Enums
  DateType,
  AvailabilityStatus,
  RecurrenceType,
  CancellationPolicy,
  BookingStatus,
  SelectedActivity,
  
  // Type helpers
  type DateTypeValue,
  type AvailabilityStatusValue,
  type RecurrenceTypeValue,
  type CancellationPolicyValue,
  type BookingStatusValue,
  type SelectedActivityValue,
  
  // Helper functions
  getDateTypeValues,
  getAvailabilityStatusValues,
  getRecurrenceTypeValues,
  getCancellationPolicyValues,
  getBookingStatusValues,
  getSelectedActivityValues,
  
  // Base interfaces
  type AvailabilitySlot,
  type AvailabilityBooking,
  type UserAvailabilityPreferences,
  
  // Request DTOs
  type CreateAvailabilityRequest,
  type UpdateAvailabilityRequest,
  type BulkCreateAvailabilityRequest,
  type GetAvailabilityRequest,
  type SearchAvailableUsersRequest,
  type BookAvailabilityRequest,
  type UpdateBookingRequest,
  type CancelAvailabilityRequest,
  type UpdateAvailabilityPreferencesRequest,
  type GetAvailabilityAnalyticsRequest,
  
  // Response DTOs
  type AvailabilityResponse,
  type AvailabilityListResponse,
  type BulkCreateAvailabilityResponse,
  type AvailableUserResponse,
  type SearchAvailableUsersResponse,
  type BookingResponse,
  type BookingsListResponse,
  type AvailabilityPreferencesResponse,
  type AvailabilityAnalyticsResponse,
  type CalendarViewResponse,
  type TimeSuggestionsResponse,
  
  // API endpoint responses
  type CreateAvailabilityResponse,
  type UpdateAvailabilityResponse,
  type GetAvailabilityResponse,
  type DeleteAvailabilityResponse,
  type BookAvailabilityResponse,
  type UpdateBookingResponse,
  type CancelBookingResponse,
  
  // Utility types
  type AvailabilityConflict,
  type SlotCreationResult,
  type RecurringGenerationOptions,
  
  // Validation rules
  AvailabilityValidationRules
} from './interfaces/userAvailability.interfaces';