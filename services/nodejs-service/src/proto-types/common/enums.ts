// Auto-generated from proto/common/enums.proto
// Generated at: 2025-07-15T14:41:46.183Z

export enum UserStatus {
  UNSPECIFIED = 'UNSPECIFIED',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED',
}

export enum Gender {
  UNSPECIFIED = 'UNSPECIFIED',
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  NON_BINARY = 'NON_BINARY',
  OTHER = 'OTHER',
}

export enum RelationshipStage {
  UNSPECIFIED = 'UNSPECIFIED',
  SINGLE = 'SINGLE',
  DATING = 'DATING',
  EXCLUSIVE = 'EXCLUSIVE',
  ENGAGED = 'ENGAGED',
  MARRIED = 'MARRIED',
}

// DateType moved to user/availability module to avoid conflicts

export enum AuthView {
  UNSPECIFIED = 'UNSPECIFIED',
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  RESET_PASSWORD = 'RESET_PASSWORD',
  VERIFY_EMAIL = 'VERIFY_EMAIL',
}

export enum SwipeAction {
  UNSPECIFIED = 'UNSPECIFIED',
  LIKE = 'LIKE',
  PASS = 'PASS',
  SUPER_LIKE = 'SUPER_LIKE',
}
