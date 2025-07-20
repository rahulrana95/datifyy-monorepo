// User authentication types

import type { UserProfile, UserData } from "./profile";

/** Service response wrapper */
export interface ServiceResponse<T> {
  response?: T;
  error?: {
    code: string | number;
    message: string;
    details?: any;
  };
}

/** Login request */
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/** Login response */
export interface LoginResponse {
  success: boolean;
  user?: UserProfile;
  accessToken?: string;
  refreshToken?: string;
  message?: string;
}

/** Signup request */
export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  agreeToTerms: boolean;
}

/** Signup response */
export interface SignupResponse {
  success: boolean;
  user?: UserProfile;
  accessToken?: string;
  refreshToken?: string;
  message?: string;
  requiresEmailVerification?: boolean;
}

/** Forgot password request */
export interface ForgotPasswordRequest {
  email: string;
}

/** Reset password request */
export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

/** Email verification request */
export interface EmailVerificationRequest {
  token: string;
  email?: string;
}

/** Token validation response */
export interface TokenValidationResponse {
  valid: boolean;
  user?: UserData;
  expiresAt?: string;
  message?: string;
}

