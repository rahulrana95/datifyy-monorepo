// apps/frontend/src/mvp/login-signup/types/auth.types.ts
/**
 * Authentication related types and enums
 * Centralized type definitions for the auth module
 */

export enum AuthView {
    LOGIN = "login",
    SIGNUP = "signup",
    FORGOT_PASSWORD = "forgotPassword"
}

export interface FormFieldErrors {
    email?: string;
    password?: string;
    confirmPassword?: string;
    verificationCode?: string;
    terms?: string;
    code?: string;
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

export interface AuthFormProps {
    onLogin?: () => void;
    onSignup?: () => void;
    onForgotPassword?: () => void;
}

export interface SignupFormData {
    email: string;
    password: string;
    confirmPassword: string;
    agreeToTerms: boolean;
}

export interface LoginFormData {
    email: string;
    password: string;
}

export interface ForgotPasswordFormData {
    email: string;
    code: string;
    newPassword: string;
    confirmPassword: string;
}

export type AuthStep = 'details' | 'verification' | 'password';
export type ForgotPasswordStep = 'email' | 'code' | 'password';