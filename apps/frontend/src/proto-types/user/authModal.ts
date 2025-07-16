// Authentication modal types

/** Auth view states */
export enum AuthView {
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD'
}

/** Auth modal state */
export interface AuthModalState {
  isLoginOpen: boolean;
  isSignupOpen: boolean;
  isForgotPasswordOpen: boolean;
  isLoading: boolean;
  error: string | null;
}

/** Auth steps */
export enum AuthStep {
  INITIAL = 'INITIAL',
  EMAIL_SENT = 'EMAIL_SENT',
  CODE_VERIFIED = 'CODE_VERIFIED',
  PASSWORD_RESET = 'PASSWORD_RESET'
}

/** Forgot password steps */
export enum ForgotPasswordStep {
  ENTER_EMAIL = 'ENTER_EMAIL',
  VERIFY_CODE = 'VERIFY_CODE',
  RESET_PASSWORD = 'RESET_PASSWORD',
  SUCCESS = 'SUCCESS'
}

/** Form field errors */
export interface FormFieldErrors {
  [key: string]: string;
}

/** Signup form data */
export interface SignupFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  agreeToTerms: boolean;
}

/** Login form data */
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/** Forgot password form data */
export interface ForgotPasswordFormData {
  email: string;
  verificationCode?: string;
  newPassword?: string;
  confirmPassword?: string;
}