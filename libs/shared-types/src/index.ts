// libs/shared-types/src/index.ts
// Export all enums
export * from './enums';

// Export all interfaces
export * from './interfaces';

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