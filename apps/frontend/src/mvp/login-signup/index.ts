// apps/frontend/src/mvp/login-signup/index.ts
/**
 * Authentication Module Exports
 * Clean barrel exports for the login-signup feature
 */

// Main Components
export { default as AuthModal } from './components/AuthModal';
export { default as LoginForm } from './components/LoginForm';
export { default as SignupForm } from './components/SignupForm';
export { default as ForgotPasswordForm } from './components/ForgotPasswordForm';
export { default as AuthModalHeader } from './components/AuthModalHeader';

// Store
export { useAuthStore } from './store/authStore';
export type { UserData, AuthModalState } from './store/authStore';

// Types
export { 
    AuthView, 
    type FormFieldErrors, 
    type PasswordStrength, 
    type AuthFormProps,
    type SignupFormData,
    type LoginFormData,
    type ForgotPasswordFormData,
    type AuthStep,
    type ForgotPasswordStep
} from './types/auth.types';

// Hooks (if we create any custom auth hooks)
// export { useAuth } from './hooks/useAuth';

// Constants (if any)
// export { AUTH_CONSTANTS } from './constants/auth';