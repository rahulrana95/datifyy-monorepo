# Datifyy Shared Libraries Reference

## Overview
Datifyy monorepo contains 4 shared libraries that provide type safety, validation, and utilities across frontend and backend applications.

## Library Structure

### 1. @datifyy/shared-constants
**Purpose**: Shared constants and configuration values  
**Location**: `libs/shared-constants/`  
**Status**: Currently empty (placeholder)

### 2. @datifyy/shared-types
**Purpose**: TypeScript interfaces, enums, and type definitions  
**Location**: `libs/shared-types/`

#### Key Exports

##### Core Enums
```typescript
// User Enums
export enum Gender { MALE = 'male', FEMALE = 'female', OTHER = 'other' }
export enum ExerciseLevel { NONE = 'None', LIGHT = 'Light', MODERATE = 'Moderate', HEAVY = 'Heavy' }
export enum EducationLevel { HIGH_SCHOOL = 'High School', UNDERGRADUATE = 'Undergraduate', GRADUATE = 'Graduate', POSTGRADUATE = 'Postgraduate' }
export enum DrinkingHabit { NEVER = 'Never', OCCASIONALLY = 'Occasionally', REGULARLY = 'Regularly' }
export enum SmokingHabit { NEVER = 'Never', OCCASIONALLY = 'Occasionally', REGULARLY = 'Regularly' }
export enum LookingFor { FRIENDSHIP = 'Friendship', CASUAL = 'Casual', RELATIONSHIP = 'Relationship' }
export enum StarSign { ARIES = 'Aries', TAURUS = 'Taurus', /* ... */ }
export enum Pronoun { HE_HIM = 'He/Him', SHE_HER = 'She/Her', THEY_THEM = 'They/Them', OTHER = 'Other' }

// Admin Enums
export enum AdminPermissionLevel { VIEWER = 'viewer', MODERATOR = 'moderator', ADMIN = 'admin', SUPER_ADMIN = 'super_admin', OWNER = 'owner' }
export enum AdminPermission { VIEW_USERS = 'view_users', EDIT_USERS = 'edit_users', /* ... 25+ permissions */ }
export enum AdminSessionStatus { ACTIVE = 'active', EXPIRED = 'expired', INVALIDATED = 'invalidated', LOCKED = 'locked', PENDING_2FA = 'pending_2fa' }

// Date Curation Enums
export enum DateMode { ONLINE = 'online', OFFLINE = 'offline' }
export enum CuratedDateStatus { PENDING = 'pending', CONFIRMED = 'confirmed', CANCELLED = 'cancelled', COMPLETED = 'completed', NO_SHOW = 'no_show' }
export enum RelationshipStage { GETTING_TO_KNOW = 'getting_to_know', BUILDING_CONNECTION = 'building_connection', /* ... */ }

// User Availability Enums
export enum AvailabilityStatus { ACTIVE = 'active', CANCELLED = 'cancelled', COMPLETED = 'completed', DELETED = 'deleted' }
export enum BookingStatus { PENDING = 'pending', CONFIRMED = 'confirmed', CANCELLED = 'cancelled', COMPLETED = 'completed' }
```

##### Core Interfaces
```typescript
// User Profile
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  bio: string | null;
  images: string[] | null;
  dob: string | null;
  gender: Gender | null;
  officialEmail: string;
  isOfficialEmailVerified: boolean | null;
  height: number | null; // in cm
  currentCity: string | null;
  // ... 20+ more fields
}

// API Response Wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: { code: string; message: string; details?: any };
  metadata?: { requestId: string; timestamp: string; version?: string; processingTime?: number };
}

// Pagination
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
```

##### Admin Dashboard Interfaces
```typescript
// Dashboard Overview
export interface AdminDashboardOverviewResponse {
  userMetrics: UserMetrics;
  dateMetrics: DateMetrics;
  revenueMetrics: RevenueMetrics;
  activityMetrics: ActivityMetrics;
  alerts: DashboardAlert[];
  trends: MetricTrends;
  lastUpdated: string;
}

// Revenue Analytics
export interface RevenueAnalyticsOverview {
  summary: RevenueSummary;
  trends: RevenueTrends;
  breakdowns: RevenueBreakdowns;
  comparisons: RevenueComparisons;
  forecasts: RevenueForecast;
  alerts: RevenueAlert[];
  lastUpdated: string;
}

// Notifications
export interface BaseNotification {
  id: string;
  triggerEvent: NotificationTriggerEvent;
  channel: NotificationChannel;
  priority: NotificationPriority;
  title: string;
  message: string;
  metadata: NotificationMetadata;
  status: NotificationStatus;
  // ... more fields
}

// Match Suggestions
export interface MatchSuggestion {
  id: string;
  targetUserId: number;
  suggestedUserId: number;
  algorithm: MatchAlgorithm;
  compatibilityScore: number; // 0-100
  confidenceLevel: MatchConfidenceLevel;
  detailedAnalysis: CompatibilityAnalysis;
  successPrediction: DateSuccessPrediction;
  // ... more fields
}
```

##### Date Curation System
```typescript
// Core Date Interface
export interface CuratedDate {
  id: number;
  user1Id: number;
  user2Id: number;
  dateTime: string; // ISO timestamp
  durationMinutes: number;
  mode: DateMode;
  locationName?: string;
  meetingLink?: string;
  status: CuratedDateStatus;
  adminNotes?: string;
  compatibilityScore?: number;
  tokensCostUser1: number;
  tokensCostUser2: number;
  // ... 30+ more fields
}

// Request/Response DTOs
export interface CreateCuratedDateRequest { /* ... */ }
export interface UpdateCuratedDateRequest { /* ... */ }
export interface SubmitDateFeedbackRequest { /* ... */ }
export interface SearchPotentialMatchesRequest { /* ... */ }
```

##### User Availability System
```typescript
export interface AvailabilitySlot {
  id?: number;
  userId: number;
  availabilityDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  timezone: string;
  dateType: DateType;
  status: AvailabilityStatus;
  isRecurring: boolean;
  bufferTimeMinutes: number;
  cancellationPolicy: CancellationPolicy;
  // ... more fields
}

export interface AvailabilityBooking {
  id: number;
  availabilityId: number;
  bookedByUserId: number;
  bookingStatus: BookingStatus;
  selectedActivity: SelectedActivity;
  bookingNotes?: string;
  // ... more fields
}
```

##### Storage Interfaces
```typescript
export interface StorageUploadOptions {
  fileName: string;
  contentType: string;
  folder?: string;
  tags?: Record<string, string>;
  isPublic?: boolean;
  expiresIn?: number;
}

export interface StorageUploadResult {
  id: string;
  key: string;
  url: string;
  cdnUrl?: string;
  thumbnailUrl?: string;
  size: number;
  contentType: string;
  uploadedAt: string;
}
```

### 3. @datifyy/shared-utils
**Purpose**: Utility functions for formatting, validation, and file handling  
**Location**: `libs/shared-utils/`

#### Key Exports

##### Format Utilities
```typescript
// Currency & Numbers
export const formatCurrency = (amount: number, currency = 'USD', locale = 'en-US'): string
export const formatNumber = (number: number, locale = 'en-US'): string
export const formatPercentage = (value: number, decimals = 0): string

// Physical Attributes
export const formatHeight = (heightCm: number): string // "175cm (5'9")"
export const formatHeightImperial = (heightCm: number): string // "5'9""
export const formatHeightMetric = (heightCm: number): string // "175cm"

// Personal Info
export const formatName = (name: string): string // Proper case
export const formatPhoneNumber = (phone: string): string // (555) 123-4567
export const formatInterests = (interests: string[]): string // "A, B, and C"
export const formatEducation = (education: string): string
export const formatOccupation = (occupation: string): string

// Text Processing
export const truncateText = (text: string, maxLength: number): string
export const formatBio = (bio: string): string // Preserves line breaks
export const formatList = (items: string[], conjunction = 'and'): string
export const formatFileSize = (bytes: number): string // "1.5 MB"

// Verification & Status
export const formatVerificationStatus = (isEmailVerified: boolean, isPhoneVerified: boolean, isIdVerified: boolean): string
export const formatPriceRange = (min: number, max: number, currency = 'USD'): string
```

##### Validation Utilities
```typescript
// Basic Validation
export const validateEmail = (email: string): ValidationResult
export const validatePassword = (password: string): ValidationResult
export const validateName = (name: string, fieldName = 'Name'): ValidationResult
export const validatePhoneNumber = (phone: string): ValidationResult
export const validateUrl = (url: string): ValidationResult
export const validateVerificationCode = (code: string): ValidationResult

// Dating App Specific
export const validateAge = (age: number): ValidationResult // 18+ required
export const validateHeight = (height: number): ValidationResult // 100-250 cm
export const validateBio = (bio: string): ValidationResult // max 500 chars
export const validateInterests = (interests: string[]): ValidationResult // max 10
export const validateAgeRange = (minAge: number, maxAge: number): ValidationResult
export const validateIncomeRange = (minIncome: number, maxIncome: number): ValidationResult

// Utility
export const combineValidationResults = (...results: ValidationResult[]): ValidationResult

// ValidationResult interface
interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
```

##### File Validation Utilities
```typescript
// File Validation
export const validateFile = (fileInfo: FileInfo, config: FileValidationConfig): FileValidationResult
export const validateFiles = (files: FileInfo[], config: FileValidationConfig, options?: {...}): {...}
export const validateFileName = (fileName: string): { isValid: boolean; errors: string[] }

// File Type Detection
export const isImageFile = (mimeType: string): boolean
export const isVideoFile = (mimeType: string): boolean
export const isDocumentFile = (mimeType: string): boolean
export const getFileExtension = (fileName: string): string

// File Processing
export const generateSafeFileName = (originalName: string, prefix?: string): string
export const estimateUploadTime = (fileSize: number, connectionSpeedMbps = 10): { estimatedSeconds: number; estimatedText: string }

// Predefined Configs
export const FILE_VALIDATION_CONFIGS = {
  PROFILE_IMAGE: { maxSize: 10MB, allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'], minImageDimensions: {width: 200, height: 200} },
  GALLERY_IMAGE: { maxSize: 15MB, allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'], minImageDimensions: {width: 300, height: 300} },
  DOCUMENT: { maxSize: 25MB, allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'] }
}

export const createValidationConfig = (category: keyof typeof FILE_VALIDATION_CONFIGS, overrides?: Partial<FileValidationConfig>): FileValidationConfig
```

### 4. @datifyy/shared-validation
**Purpose**: Zod validation schemas  
**Location**: `libs/shared-validation/`  
**Status**: Currently empty (placeholder for Zod schemas)

## Usage Examples

### Basic Type Usage
```typescript
import { UserProfile, Gender, ApiResponse } from '@datifyy/shared-types';
import { formatHeight, validateEmail } from '@datifyy/shared-utils';

// Type-safe user profile
const user: UserProfile = {
  id: '123',
  firstName: 'John',
  lastName: 'Doe',
  gender: Gender.MALE,
  height: 175,
  // ... other fields
};

// Format height for display
const heightText = formatHeight(user.height!); // "175cm (5'9")"

// Validate email
const emailValidation = validateEmail('user@example.com');
if (!emailValidation.isValid) {
  console.log(emailValidation.errors);
}

// API response typing
const response: ApiResponse<UserProfile> = {
  success: true,
  message: 'User retrieved successfully',
  data: user
};
```

### Admin Dashboard Usage
```typescript
import { 
  AdminDashboardOverviewResponse, 
  RevenueAnalyticsOverview,
  NotificationTriggerEvent,
  AdminPermission 
} from '@datifyy/shared-types';

// Dashboard data
const dashboardData: AdminDashboardOverviewResponse = {
  userMetrics: { totalUsers: 1500, activeUsersToday: 250, /* ... */ },
  dateMetrics: { totalDatesSetup: 450, datesCompletedThisWeek: 32, /* ... */ },
  revenueMetrics: { totalRevenue: 125000, revenueToday: 2300, /* ... */ },
  // ... other sections
};

// Check admin permissions
const hasUserManagementAccess = userPermissions.includes(AdminPermission.EDIT_USERS);
```

### Date Curation Usage
```typescript
import { 
  CuratedDate, 
  CreateCuratedDateRequest,
  DateMode,
  CuratedDateStatus 
} from '@datifyy/shared-types';

// Create a curated date
const createDateRequest: CreateCuratedDateRequest = {
  user1Id: 123,
  user2Id: 456,
  dateTime: '2024-03-15T19:00:00Z',
  durationMinutes: 90,
  mode: DateMode.OFFLINE,
  locationName: 'Central Perk Cafe',
  adminNotes: 'Both users enjoy coffee and books'
};

// Handle date status
const isDateActive = (date: CuratedDate) => 
  [CuratedDateStatus.PENDING, CuratedDateStatus.CONFIRMED].includes(date.status);
```

### File Validation Usage
```typescript
import { 
  validateFile, 
  FILE_VALIDATION_CONFIGS,
  isImageFile 
} from '@datifyy/shared-utils';

// Validate profile image
const fileInfo = {
  name: 'profile.jpg',
  size: 2048000, // 2MB
  type: 'image/jpeg'
};

const validation = validateFile(fileInfo, FILE_VALIDATION_CONFIGS.PROFILE_IMAGE);
if (!validation.isValid) {
  console.log('Validation errors:', validation.errors);
}

// Check if file is an image
if (isImageFile(fileInfo.type)) {
  // Process as image
}
```

## Key Constants & Validation Rules

### Admin Security
```typescript
export const ADMIN_SECURITY_CONSTANTS = {
  MAX_LOGIN_ATTEMPTS: 5,
  ACCOUNT_LOCK_DURATION: 30, // minutes
  SESSION_TIMEOUT_HOURS: 8,
  PASSWORD_MIN_LENGTH: 12,
  PASSWORD_EXPIRY_DAYS: 90
};
```

### Date Curation Rules
```typescript
export const DateCurationValidationRules = {
  MAX_FUTURE_DAYS: 30,
  MIN_FUTURE_HOURS: 2,
  MAX_DURATION_MINUTES: 180,
  MIN_DURATION_MINUTES: 30,
  MAX_DATES_PER_USER_PER_WEEK: 3,
  CANCELLATION_GRACE_PERIOD_HOURS: 24
};
```

### File Upload Limits
```typescript
export const REVENUE_ANALYTICS_CONSTANTS = {
  DEFAULT_CURRENCY: 'INR',
  MIN_TRANSACTION_AMOUNT: 1,
  MAX_EXPORT_RECORDS: 50000,
  CACHE_DURATION_MINUTES: 15
};
```

## Helper Functions Available

### Enum Value Getters
```typescript
// Get enum values as arrays for dropdowns/selects
getGenderValues() // ['male', 'female', 'other']
getExerciseLevelValues()
getDateModeValues()
getCuratedDateStatusValues()
getNotificationChannelValues()
getRevenueTimePeriodValues()
// ... many more
```

### Calculation Helpers
```typescript
// Revenue Analytics
formatCurrency(amount, currency)
calculatePercentageChange(current, previous)

// Match Suggestions  
calculateOverallCompatibilityScore(factorScores)
determineMatchConfidenceLevel(score)
predictDateSuccess(compatibilityScore, trustScores)

// Notifications
formatNotificationMessage(template, variables)
```

## Dependencies
- **shared-types**: No external dependencies (pure TypeScript)
- **shared-utils**: Depends on @datifyy/shared-types, date-fns
- **shared-constants**: No dependencies
- **shared-validation**: Depends on zod, @datifyy/shared-types

## Notes
- All libraries are compiled to CommonJS for compatibility
- TypeScript composite project references for fast incremental builds
- Strict TypeScript configuration for type safety
- File validation works in both browser and Node.js environments
- Admin interfaces support comprehensive role-based access control
- Date curation system supports both online and offline dates with full workflow tracking