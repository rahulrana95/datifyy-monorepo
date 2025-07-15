// apps/frontend/src/mvp/login-signup/types/auth.types.ts
/**
 * Authentication related types - now importing from shared types
 * Only frontend-specific types should remain here
 */
// Re-export from shared types for convenience
export {
  AuthView, type ForgotPasswordStep
} from '../../../proto-types';
export type {
  FormFieldErrors,
  SignupFormData,
  LoginFormData,
  ForgotPasswordFormData,
  AuthStep
} from '../../../proto-types';

// Frontend-specific interfaces only
export interface AuthFormProps {
  onLogin?: () => void;
  onSignup?: () => void;
  onForgotPassword?: () => void;
}

export interface PasswordStrength {
  strength: number;
  checks: {
    length: boolean;
    lowercase: boolean;
    uppercase: boolean;
    numbers: boolean;
    special: boolean;
  };
}