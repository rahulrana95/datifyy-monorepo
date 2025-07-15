// Auto-generated from proto/user/profile.proto
// Generated at: 2025-07-15T10:21:46.945Z

import { ApiResponse, PaginationRequest, PaginationResponse, LocationInfo } from '../common';
import {
  Gender, ExerciseLevel, EducationLevel, DrinkingHabit, SmokingHabit,
  LookingFor, StarSign, Pronoun, DateType, AvailabilityStatus,
  RecurrenceType, CancellationPolicy, BookingStatus
} from './enums';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  bio: string;
  age: number;
  gender: Gender;
  interests: string[];
  location: string;
  photos: string[];
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Additional profile fields
  exerciseLevel: ExerciseLevel;
  educationLevel: EducationLevel;
  drinkingHabit: DrinkingHabit;
  smokingHabit: SmokingHabit;
  lookingFor: LookingFor;
  starSign: StarSign;
  pronoun: Pronoun;
  jobTitle: string;
  company: string;
  school: string;
  height: number; // in cm
  languages: string[];
  instagramHandle: string;
  spotifyId: string;
  
  // Preferences
  partnerPreferences: PartnerPreferences;
  
  // Location details
  locationInfo: LocationInfo;
  
  // Privacy settings
  privacySettings: PrivacySettings;
}

export interface PartnerPreferences {
  minAge: number;
  maxAge: number;
  preferredGenders: Gender[];
  maxDistance: number; // in km
  lookingForOptions: LookingFor[];
  exercisePreferences: ExerciseLevel[];
  educationPreferences: EducationLevel[];
  drinkingPreferences: DrinkingHabit[];
  smokingPreferences: SmokingHabit[];
  showMeOnDatifyy: boolean;
  discoveryEnabled: boolean;
}

export interface PrivacySettings {
  showDistance: boolean;
  showLastActive: boolean;
  showAge: boolean;
  showOnlineStatus: boolean;
  allowMessagesFromMatchesOnly: boolean;
  showProfileInSearch: boolean;
}

export interface AvailabilitySlot {
  id: string;
  userId: string;
  dateType: DateType;
  startTime: string;
  endTime: string;
  status: AvailabilityStatus;
  recurrence: RecurrenceType;
  location: string;
  notes: string;
  cancellationPolicy: CancellationPolicy;
  price: number;
  currency: string;
  isPremium: boolean;
  tags: string[];
  maxParticipants: number;
  createdAt: string;
  updatedAt: string;
}

export interface AvailabilityBooking {
  id: string;
  slotId: string;
  bookerId: string;
  ownerId: string;
  status: BookingStatus;
  bookedAt: string;
  confirmedAt: string;
  cancelledAt: string;
  cancellationReason: string;
  notes: string;
  amountPaid: number;
  currency: string;
  paymentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserAvailabilityPreferences {
  userId: string;
  preferredDateTypes: DateType[];
  defaultDurationMinutes: number;
  defaultCancellationPolicy: CancellationPolicy;
  defaultTimezone: string;
  autoAcceptBookings: boolean;
  advanceNoticeHours: number;
  sendReminders: boolean;
  reminderMinutesBefore: number;
  blockedTimes: string[];
  defaultPrice: number;
  defaultCurrency: string;
  allowPremiumBookings: boolean;
  createdAt: string;
  updatedAt: string;
}

// Authentication types
export interface AuthModalState {
  isOpen: boolean;
  currentView: 'login' | 'signup' | 'forgot-password' | 'reset-password';
  email?: string;
  isLoading: boolean;
  error?: string;
}

export interface FormFieldErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  age?: string;
  gender?: string;
  interests?: string;
  location?: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: Gender;
  interests: string[];
  location: string;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface AuthStep {
  step: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
}

export interface ForgotPasswordStep {
  step: number;
  title: string;
  isCompleted: boolean;
  isActive: boolean;
}

export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  profileImage?: string;
  isVerified: boolean;
  subscriptionStatus: 'free' | 'premium' | 'expired';
  profileCompletionPercentage: number;
  lastSeen: string;
  preferences: PartnerPreferences;
  privacy: PrivacySettings;
}

// Dating specific types
export interface DatifyyUserProfile extends UserProfile {
  profileCompletionPercentage: number;
  lastSeen: string;
  isOnline: boolean;
  subscriptionStatus: 'free' | 'premium' | 'expired';
  verificationStatus: 'pending' | 'verified' | 'rejected';
  reportCount: number;
  isBanned: boolean;
  banReason?: string;
  banExpiresAt?: string;
}

export interface DatifyyUserPartnerPreferences extends PartnerPreferences {
  dealBreakers: string[];
  importanceScore: number;
  lastUpdated: string;
}

export interface SwipeData {
  targetUserId: string;
  action: 'like' | 'pass' | 'super_like';
  timestamp: string;
  location?: LocationInfo;
}

export interface MatchData {
  id: string;
  userId1: string;
  userId2: string;
  matchedAt: string;
  isActive: boolean;
  lastMessageAt?: string;
  messageCount: number;
  user1Profile: UserProfile;
  user2Profile: UserProfile;
}

export interface ProfileCardData {
  user: UserProfile;
  distance: number;
  commonInterests: string[];
  mutualFriends: number;
  compatibilityScore: number;
  lastActive: string;
  isOnline: boolean;
  verificationBadges: string[];
}

export interface ProfileCardProps {
  profile: ProfileCardData;
  onSwipe: (action: 'like' | 'pass' | 'super_like') => void;
  showDistance: boolean;
  showLastActive: boolean;
  showMutualFriends: boolean;
  showCompatibilityScore: boolean;
}

// Request interfaces
export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  age: number;
  location: string;
  interests: string[];
}

export interface UpdateUserRequest {
  userId: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  bio?: string;
  age?: number;
  gender?: Gender;
  interests?: string[];
  location?: string;
  photos?: string[];
  exerciseLevel?: ExerciseLevel;
  educationLevel?: EducationLevel;
  drinkingHabit?: DrinkingHabit;
  smokingHabit?: SmokingHabit;
  lookingFor?: LookingFor;
  starSign?: StarSign;
  pronoun?: Pronoun;
  jobTitle?: string;
  company?: string;
  school?: string;
  height?: number;
  languages?: string[];
  instagramHandle?: string;
  spotifyId?: string;
  partnerPreferences?: PartnerPreferences;
  locationInfo?: LocationInfo;
  privacySettings?: PrivacySettings;
}

export interface GetUserRequest {
  userId: string;
}

export interface GetUsersRequest {
  pagination?: PaginationRequest;
  search?: string;
  gender?: Gender;
  minAge?: number;
  maxAge?: number;
  location?: string;
  interests?: string[];
  isVerified?: boolean;
  sortBy?: string;
  sortOrder?: string;
}

export interface CreateAvailabilityRequest {
  userId: string;
  dateType: DateType;
  startTime: string;
  endTime: string;
  recurrence: RecurrenceType;
  location?: string;
  notes?: string;
  cancellationPolicy?: CancellationPolicy;
  price?: number;
  currency?: string;
  isPremium?: boolean;
  tags?: string[];
  maxParticipants?: number;
}

export interface UpdateAvailabilityRequest {
  slotId: string;
  dateType?: DateType;
  startTime?: string;
  endTime?: string;
  status?: AvailabilityStatus;
  recurrence?: RecurrenceType;
  location?: string;
  notes?: string;
  cancellationPolicy?: CancellationPolicy;
  price?: number;
  currency?: string;
  isPremium?: boolean;
  tags?: string[];
  maxParticipants?: number;
}

export interface GetAvailabilityRequest {
  userId: string;
  startDate?: string;
  endDate?: string;
  dateTypes?: DateType[];
  statuses?: AvailabilityStatus[];
  pagination?: PaginationRequest;
}

export interface SearchAvailableUsersRequest {
  dateType: DateType;
  startTime: string;
  endTime: string;
  location?: string;
  maxDistance?: number;
  maxPrice?: number;
  tags?: string[];
  pagination?: PaginationRequest;
}

// Response interfaces
export interface UserResponse extends ApiResponse<UserProfile> {}
export interface UsersListResponse extends ApiResponse<{
  users: UserProfile[];
  pagination: PaginationResponse;
}> {}
export interface AvailabilityResponse extends ApiResponse<AvailabilitySlot> {}
export interface AvailabilityListResponse extends ApiResponse<{
  slots: AvailabilitySlot[];
  pagination: PaginationResponse;
}> {}
export interface AuthResponse extends ApiResponse<{
  user: UserData;
  token: string;
  refreshToken: string;
}> {}
export interface MatchResponse extends ApiResponse<MatchData> {}
export interface MatchesListResponse extends ApiResponse<{
  matches: MatchData[];
  pagination: PaginationResponse;
}> {}
