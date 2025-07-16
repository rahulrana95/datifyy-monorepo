// libs/shared-types/src/interfaces/api.interfaces.ts
/**
 * Enhanced API interfaces for Dating App
 * Used by both frontend and backend
 */

// Base API Response
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    requestId: string;
    timestamp: string;
    version?: string;
    processingTime?: number;
  };
}

// Pagination interfaces
export interface PaginationRequest {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

// Authentication API Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    isAdmin: boolean;
  };
}

export interface SignupRequest {
  email: string;
  password: string;
  verificationCode: string;
}

export interface SignupResponse {
  message: string;
  userId: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
  resetCode: string;
}

export interface EmailVerificationRequest {
  to: Array<{ email: string; name: string }>;
  type: 'verifyEmail' | 'forgotPassword';
}

export interface TokenValidationResponse {
  id: string;
  firstName: string;
  officialEmail: string;
  isadmin: boolean;
}

// Profile API Types
export interface UserProfileResponse {
  id: string;
  firstName: string;
  lastName: string;
  officialEmail: string;
  bio?: string;
  images?: string[];
  dob?: string;
  gender?: string;
  height?: number;
  currentCity?: string;
  hometown?: string;
  isOfficialEmailVerified?: boolean;
  isAadharVerified?: boolean;
  isPhoneVerified?: boolean;
  // Add other profile fields as needed
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  bio?: string;
  images?: string[];
  dob?: string;
  gender?: string;
  height?: number;
  currentCity?: string;
  hometown?: string;
  // Add other updatable fields
}

// Partner Preferences API Types
export interface PartnerPreferencesResponse {
  id?: string;
  minAge?: number;
  maxAge?: number;
  interests?: string[];
  hobbies?: string[];
  educationLevel?: string[];
  profession?: string[];
  minHeight?: number;
  maxHeight?: number;
  minIncome?: number;
  maxIncome?: number;
  religion?: string[];
  smoking?: string;
  drinking?: string;
  hasKids?: string;
  wantsKids?: string;
  locationPreferenceRadius?: number;
  whatOtherPersonShouldKnow?: string;
}

export interface UpdatePartnerPreferencesRequest {
  minAge?: number;
  maxAge?: number;
  interests?: string[];
  hobbies?: string[];
  educationLevel?: string[];
  profession?: string[];
  minHeight?: number;
  maxHeight?: number;
  minIncome?: number;
  maxIncome?: number;
  religion?: string[];
  smoking?: string;
  drinking?: string;
  hasKids?: string;
  wantsKids?: string;
  locationPreferenceRadius?: number;
  whatOtherPersonShouldKnow?: string;
}

// Error Response Types
export interface ErrorResponse {
  code: number;
  message: string;
  details?: any;
}

// Generic Service Response
export interface ServiceResponse<T = any> {
  response?: T;
  error?: ErrorResponse;
}

// File Upload Types
export interface FileUploadResponse {
  url: string;
  filename: string;
  size: number;
  mimetype: string;
}

// Matching API Types
export interface MatchResponse {
  matches: Array<{
    userId: string;
    profile: UserProfileResponse;
    compatibilityScore: number;
    matchReasons: string[];
  }>;
  pagination: PaginationResponse<any>['pagination'];
}

export interface CompatibilityResponse {
  compatibilityScore: number;
  breakdown: {
    religion: number;
    income: number;
    education: number;
    appearance: number;
    personality: number;
    values: number;
  };
  recommendations: string[];
}