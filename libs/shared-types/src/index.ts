// libs/shared-types/src/index.ts
// Export all enums
export * from './enums';

// Export all interfaces
export * from './interfaces';

// Export storage interfaces (NEW)
export * from './interfaces/storage.interfaces';

export * from './interfaces/admin.interfaces'; 
export * from './interfaces/api.interfaces';
export * from './interfaces/user.interfaces';
export * from './interfaces/storage.interfaces';  // Add this line
export * from './interfaces/admin.interfaces';    // Add this line if not already there
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

// Explicit storage exports (NEW)
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