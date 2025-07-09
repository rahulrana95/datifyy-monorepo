 // libs/shared-types/src/interfaces/dating.interfaces.ts
/**
 * Dating App Specific Types
 * Shared between frontend and backend
 */

import { Gender, ExerciseLevel, EducationLevel, DrinkingHabit, SmokingHabit, LookingFor, StarSign, Pronoun } from '../enums/user.enums';

// Authentication Store Types - moved up for better organization
export interface UserData {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  avatar?: string;
  isVerified?: boolean;
  profileCompletion?: number;
}

export interface AuthModalState {
  isLoginOpen: boolean;
  isSignupOpen: boolean;
  isForgotPasswordOpen: boolean;
  isLoading: boolean;
  error: string | null;
}

// Form Types
export interface FormFieldErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  verificationCode?: string;
  terms?: string;
  code?: string;
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

// UI Component Types
export enum AuthView {
  LOGIN = "login",
  SIGNUP = "signup",
  FORGOT_PASSWORD = "forgotPassword"
}

export type AuthStep = 'details' | 'verification' | 'password';
export type ForgotPasswordStep = 'email' | 'code' | 'password';

// Profile & User Types
export interface DatifyyUserProfile {
  id: string;
  firstName: string;
  lastName: string;
  updatedAt: Date | null;
  bio: string | null;
  images: string[] | null;
  dob: string | null;
  gender: Gender | null;
  officialEmail: string;
  isOfficialEmailVerified: boolean | null;
  isAadharVerified: boolean | null;
  isPhoneVerified: boolean | null;
  height: number | null;
  favInterest: string[] | null;
  causesYouSupport: string[] | null;
  qualityYouValue: string[] | null;
  prompts: object[] | null;
  education: object[] | null;
  currentCity: string | null;
  hometown: string | null;
  exercise: ExerciseLevel | null;
  educationLevel: EducationLevel | null;
  drinking: DrinkingHabit | null;
  smoking: SmokingHabit | null;
  lookingFor: LookingFor | null;
  settleDownInMonths: string | null;
  haveKids: boolean | null;
  wantsKids: boolean | null;
  starSign: StarSign | null;
  birthTime: number | null;
  kundliBeliever: boolean | null;
  religion: string | null;
  pronoun: Pronoun | null;
  isDeleted: boolean | null;
  userLoginId: string | null;
}

// Partner Preferences
export interface DatifyyUserPartnerPreferences {
  id?: string;
  userId?: string;
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
  createdAt?: Date;
  updatedAt?: Date;
}

// Partner Preferences Component Types
export interface PartnerPreferences {
  id?: string;
  minAge?: number;
  maxAge?: number;
  maxDistance?: number;
  interests?: string[];
  dealBreakers?: string[];
  education?: string[];
  lifestyle?: string[];
  bodyType?: string[];
  ethnicity?: string[];
  religion?: string[];
  smoking?: string;
  drinking?: string;
  hasKids?: string;
  wantsKids?: string;
  height?: {
    min?: number;
    max?: number;
  };
  income?: {
    min?: number;
    max?: number;
  };
  whatOtherPersonShouldKnow?: string;
}

export type PreferencePage = 'basics' | 'lifestyle' | 'physical' | 'values';

export interface PreferenceCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
  options: string[];
}

// Swipe & Match Types
export type SwipeAction = 'like' | 'pass' | 'superlike';

export interface SwipeData {
  targetUserId: string;
  action: SwipeAction;
  timestamp: Date;
}

export interface MatchData {
  id: string;
  user1Id: string;
  user2Id: string;
  matchedAt: Date;
  isActive: boolean;
  lastMessageAt?: Date;
}

// Location Types
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationInfo {
  city: string;
  state?: string;
  country: string;
  coordinates?: Coordinates;
}

export interface DistanceInfo {
  kilometers: number;
  miles: number;
  displayText: string;
}

// Profile Card Types
export interface ProfileCardData {
  id: string;
  name: string;
  age: number;
  images: string[];
  bio?: string;
  location?: string;
  distance?: number;
  occupation?: string;
  education?: string;
  interests?: string[];
  isVerified: boolean;
  isPremium: boolean;
  lastSeen?: Date;
  dateOfBirth: string;
}

export interface ProfileCardProps {
  profile: ProfileCardData;
  onSwipe?: (profileId: string, action: SwipeAction) => void;
  onImageChange?: (imageIndex: number) => void;
  isLoading?: boolean;
  showActions?: boolean;
  variant?: 'swipeable' | 'preview' | 'detailed';
  size?: 'small' | 'default' | 'large';
  userLocation?: Coordinates;
}

// Status Types
export interface LastSeenInfo {
  text: string;
  color: 'green.500' | 'yellow.500' | 'gray.500';
  isOnline: boolean;
}

export interface AgeInfo {
  years: number;
  isLegal: boolean;
  displayAge: string;
}

// Validation Types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Service Types
export interface ProfileCompletionStats {
  completionPercentage: number;
  missingFields: string[];
  recommendations: string[];
}