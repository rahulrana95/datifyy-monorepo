// src/modules/userProfile/dtos/UserProfileResponseDtos.ts

/**
 * User Profile Response DTO
 * Represents the complete user profile data returned to clients
 */
export interface UserProfileResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string | null;
  bio: string | null;
  images: string[] | null;
  dob: string | null;
  age?: number; // Calculated field
  isOfficialEmailVerified: boolean | null;
  isAadharVerified: boolean | null;
  isPhoneVerified: boolean | null;
  height: number | null;
  currentCity: string | null;
  hometown: string | null;
  exercise: string | null;
  educationLevel: string | null;
  drinking: string | null;
  smoking: string | null;
  lookingFor: string | null;
  settleDownInMonths: string | null;
  haveKids: boolean | null;
  wantsKids: boolean | null;
  starSign: string | null;
  religion: string | null;
  pronoun: string | null;
  favInterest: string[] | null;
  causesYouSupport: string[] | null;
  qualityYouValue: string[] | null;
  prompts: object[] | null;
  education: object[] | null;
  // Metadata
  profileCompletionPercentage: number;
  lastUpdated: string;
  createdAt: string;
}

/**
 * User Profile Summary DTO
 * Lightweight profile data for listings/cards
 */
export interface UserProfileSummaryDto {
  id: string;
  firstName: string;
  lastName: string;
  age: number | null;
  currentCity: string | null;
  images: string[] | null;
  bio: string | null;
  lookingFor: string | null;
  isVerified: boolean;
  profileCompletionPercentage: number;
}

/**
 * User Profile Statistics DTO
 * Represents profile completion and engagement stats
 */
export interface UserProfileStatsDto {
  completionPercentage: number;
  missingFields: string[];
  requiredFields: string[];
  optionalFields: string[];
  verificationStatus: {
    email: boolean;
    phone: boolean;
    aadhar: boolean;
  };
  profileStrength: 'weak' | 'moderate' | 'strong' | 'complete';
  recommendations: string[];
  lastUpdated: string;
}

/**
 * Profile Completeness Response
 */
export interface ProfileCompletenessDto {
  isComplete: boolean;
  completionPercentage: number;
  missingFields: string[];
  criticalMissingFields: string[];
  recommendations: {
    field: string;
    reason: string;
    priority: 'high' | 'medium' | 'low';
  }[];
}

/**
 * Profile Analytics Response DTO
 */
export interface ProfileAnalyticsDto {
  totalProfiles: number;
  activeProfiles: number;
  deletedProfiles: number;
  verifiedProfiles: {
    email: number;
    phone: number;
    aadhar: number;
    all: number;
  };
  completionStats: {
    average: number;
    distribution: {
      range: string;
      count: number;
    }[];
  };
  demographics: {
    genderDistribution: Record<string, number>;
    ageDistribution: Record<string, number>;
    cityDistribution: Record<string, number>;
  };
  growthMetrics: {
    newProfilesThisMonth: number;
    newProfilesThisWeek: number;
    activeThisMonth: number;
  };
}

/**
 * Profile Update Response DTO
 */
export interface ProfileUpdateResponseDto {
  success: boolean;
  message: string;
  profile: UserProfileResponseDto;
  changedFields: string[];
  previousCompletionPercentage?: number;
  newCompletionPercentage: number;
  recommendations?: string[];
}

/**
 * Profile Verification Response DTO
 */
export interface ProfileVerificationResponseDto {
  success: boolean;
  message: string;
  verificationType: 'email' | 'phone' | 'aadhar';
  status: boolean;
  verificationDate: string;
  profile: UserProfileResponseDto;
}

/**
 * Bulk Profile Operation Response DTO
 */
export interface BulkProfileOperationResponseDto {
  success: boolean;
  message: string;
  totalRequested: number;
  successful: number;
  failed: number;
  errors: {
    profileId: string;
    error: string;
  }[];
  results: UserProfileSummaryDto[];
}

/**
 * Profile Search Response DTO
 */
export interface ProfileSearchResponseDto {
  profiles: UserProfileSummaryDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  filters: {
    applied: Record<string, any>;
    available: Record<string, any[]>;
  };
  searchQuery?: string;
  resultCount: number;
  searchTime: number; // in milliseconds
}

/**
 * Profile Recommendation Response DTO
 */
export interface ProfileRecommendationResponseDto {
  recommendedProfiles: UserProfileSummaryDto[];
  matchScore: number;
  matchReasons: string[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  refreshToken?: string; // For getting next batch
}

/**
 * Profile Activity Response DTO
 */
export interface ProfileActivityResponseDto {
  profileId: string;
  activities: {
    type: 'profile_view' | 'profile_update' | 'login' | 'verification';
    timestamp: string;
    metadata?: Record<string, any>;
  }[];
  summary: {
    totalActivities: number;
    lastActiveDate: string;
    profileViews: number;
    profileUpdates: number;
  };
}

/**
 * Profile Export Response DTO
 */
export interface ProfileExportResponseDto {
  exportId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  expiresAt?: string;
  format: 'json' | 'csv' | 'pdf';
  includedFields: string[];
  createdAt: string;
  estimatedSize?: number; // in bytes
}

/**
 * Profile Import Response DTO
 */
export interface ProfileImportResponseDto {
  importId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  totalRecords: number;
  processedRecords: number;
  successfulRecords: number;
  failedRecords: number;
  errors: {
    row: number;
    field?: string;
    error: string;
  }[];
  startedAt: string;
  completedAt?: string;
  estimatedTimeRemaining?: number; // in seconds
}

/**
 * Profile Backup Response DTO
 */
export interface ProfileBackupResponseDto {
  backupId: string;
  profileId: string;
  status: 'created' | 'restored';
  backupDate: string;
  restoreDate?: string;
  size: number; // in bytes
  checksum: string;
  metadata: {
    version: string;
    format: string;
    compression: boolean;
  };
}

/**
 * Standard API Response Wrapper
 */
export interface ApiResponseWrapper<T> {
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
    version: string;
    processingTime?: number; // in milliseconds
  };
}