import { ApiResponse } from '../../../../../proto-types/common/base';

export interface AdminUserProfile {
  // Basic Info
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  bio: string | null;
  images: string[] | null;
  dateOfBirth: string | null;
  age: number | null;
  gender: string | null;
  height: number | null;
  currentCity: string | null;
  hometown: string | null;

  // Preferences & Lifestyle
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

  // Arrays
  favInterest: string[] | null;
  causesYouSupport: string[] | null;
  qualityYouValue: string[] | null;
  prompts: object[] | null;
  education: object[] | null;

  // Account Status
  accountStatus: string;
  permissionLevel: string;
  isActive: boolean;
  isDeleted: boolean;

  // Verification Status
  isOfficialEmailVerified: boolean;
  isAadharVerified: boolean;
  isPhoneVerified: boolean;
  
  // Login Info
  createdAt: Date;
  updatedAt: Date;
  lastActiveAt: Date | null;
  lastLoginAt: Date | null;
  lastLoginIp: string | null;
  lastLoginUserAgent: string | null;
  loginCount: number;
  failedLoginAttempts: number;
  lockedAt: Date | null;
  lockExpiresAt: Date | null;
}

export interface AdminUserTrustScore {
  id: number;
  overallScore: number;
  attendanceScore: number;
  punctualityScore: number;
  feedbackScore: number;
  profileCompletenessScore: number;
  totalDatesAttended: number;
  totalDatesCancelled: number;
  totalDatesNoShow: number;
  lastMinuteCancellations: number;
  averageRating: number;
  consecutiveCancellations: number;
  lastCancellationDate: Date | null;
  warningLevel: number;
  isOnProbation: boolean;
  probationUntil: Date | null;
  secondDateRate: number;
  positiveFeedbackCount: number;
  complimentsReceived: number;
  canBookDates: boolean;
  maxDatesPerWeek: number;
  requiresAdminApproval: boolean;
  lastCalculatedAt: Date;
  calculationReason: string | null;
  adminOverrideReason: string | null;
  manualAdjustmentAt: Date | null;
}

export interface AdminUserDateHistory {
  totalDates: number;
  completedDates: number;
  cancelledDates: number;
  noShowDates: number;
  upcomingDates: number;
  lastDateAt: Date | null;
  nextDateAt: Date | null;
  averageDateRating: number;
  secondDateSuccessRate: number;
  recentDates: Array<{
    id: number;
    dateTime: Date;
    mode: string;
    status: string;
    partnerName: string;
    rating: number | null;
    feedback: string | null;
  }>;
}

export interface AdminUserPartnerPreferences {
  genderPreference: string | null;
  ageRange: { min: number | null; max: number | null };
  heightRange: { min: number | null; max: number | null };
  locationPreference: object | null;
  educationLevel: string[] | null;
  profession: string[] | null;
  incomeRange: { min: number | null; max: number | null; currency: string | null };
  smokingPreference: string | null;
  drinkingPreference: string | null;
  religionPreference: string | null;
  relationshipGoals: string | null;
  lifestyle: object | null;
}

export interface AdminUserActivityLogs {
  recentLogins: Array<{
    timestamp: Date;
    ipAddress: string;
    userAgent: string;
    success: boolean;
  }>;
  profileUpdates: Array<{
    timestamp: Date;
    field: string;
    oldValue: any;
    newValue: any;
  }>;
  adminActions: Array<{
    timestamp: Date;
    adminId: number;
    adminName: string;
    action: string;
    reason: string;
    details: object;
  }>;
}

export interface AdminUserDetailData {
  profile: AdminUserProfile;
  trustScore: AdminUserTrustScore;
  dateHistory: AdminUserDateHistory;
  partnerPreferences: AdminUserPartnerPreferences;
  activityLogs: AdminUserActivityLogs;
  riskAssessment: {
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    riskFactors: string[];
    recommendations: string[];
  };
  profileCompleteness: {
    score: number;
    missingFields: string[];
    recommendations: string[];
  };
}

export type AdminUserDetailResponseDto = ApiResponse<AdminUserDetailData>;