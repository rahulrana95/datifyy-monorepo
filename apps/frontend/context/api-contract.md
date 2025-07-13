# API Contract Documentation - Updated

## Base Configuration

### Base URLs
- **Development**: `http://localhost:3453/api/v1`
- **Production**: `https://datifyy-monorepo.onrender.com/api/v1`

### Authentication
- **Type**: Bearer Token (JWT)
- **Header**: `Authorization: {token}`
- **Token Storage**: Secure HTTP-only cookies (`Authorization={token}; path=/; secure; samesite=strict`)
- **Token Refresh**: Automatic refresh on 401 responses
- **Session Timeout**: 8 hours (configurable)

### Response Format
All API responses follow this standardized structure:
```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
    statusCode?: number;
  };
  metadata?: {
    requestId: string;
    timestamp: string;
    version?: string;
    processingTime?: number;
  };
}
```

## Authentication Endpoints

### POST /auth/login
**Description**: User login with email and password

**Request Body**:
```typescript
interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
  deviceInfo?: {
    userAgent: string;
    deviceType: 'desktop' | 'mobile' | 'tablet';
  };
}
```

**Response**:
```typescript
interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    isAdmin: boolean;
    profileCompletion?: number;
    isVerified?: boolean;
  };
  expiresIn: number;
  refreshToken?: string;
}
```

**Example**:
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "rememberMe": true
}
```

### POST /auth/signup
**Description**: User registration with email verification

**Request Body**:
```typescript
interface SignupRequest {
  email: string;
  password: string;
  verificationCode: string;
  firstName?: string;
  lastName?: string;
}
```

**Response**:
```typescript
interface SignupResponse {
  success: boolean;
  message: string;
  userId: string;
  requiresProfileCompletion: boolean;
}
```

### POST /auth/send-verification-code
**Description**: Send email verification code

**Request Body**:
```typescript
{
  email: string;
  type: 'signup' | 'forgotPassword' | 'emailChange';
}
```

**Response**:
```typescript
{
  success: boolean;
  message: string;
  expiresIn: number; // seconds
  rateLimitRemaining: number;
}
```

### POST /auth/forgot-password
**Description**: Initiate password reset process

**Request Body**:
```typescript
interface ForgotPasswordRequest {
  email: string;
}
```

### POST /auth/reset-password
**Description**: Reset password with verification code

**Request Body**:
```typescript
interface ResetPasswordRequest {
  email: string;
  newPassword: string;
  resetCode: string;
  confirmPassword: string;
}
```

### POST /auth/validate-token
**Description**: Validate current auth token

**Headers**: `Authorization: {token}`

**Response**:
```typescript
interface TokenValidationResponse {
  id: string;
  firstName: string;
  officialEmail: string;
  isadmin: boolean;
  profileCompletion: number;
  sessionInfo: {
    lastActivity: string;
    expiresAt: string;
  };
}
```

### POST /auth/logout
**Description**: Logout user and invalidate token

**Headers**: `Authorization: {token}`

**Request Body**:
```typescript
{
  logoutAllSessions?: boolean;
}
```

## User Profile Endpoints

### GET /user-profile
**Description**: Get current user's complete profile information

**Headers**: `Authorization: {token}`

**Response**:
```typescript
{
  data: {
    // Basic Information
    id: string;
    firstName: string;
    lastName: string;
    officialEmail: string;
    bio?: string;
    images?: string[];
    
    // Demographics
    dob?: string;           // ISO date string
    gender?: 'male' | 'female' | 'other';
    height?: number;        // in cm
    currentCity?: string;
    hometown?: string;
    
    // Verification Status
    isOfficialEmailVerified?: boolean;
    isAadharVerified?: boolean;
    isPhoneVerified?: boolean;
    
    // Lifestyle & Preferences
    exercise?: 'None' | 'Light' | 'Moderate' | 'Heavy';
    educationLevel?: 'High School' | 'Undergraduate' | 'Graduate' | 'Postgraduate';
    drinking?: 'Never' | 'Occasionally' | 'Regularly';
    smoking?: 'Never' | 'Occasionally' | 'Regularly';
    lookingFor?: 'Friendship' | 'Casual' | 'Relationship';
    
    // Personal Details
    settleDownInMonths?: string;
    haveKids?: boolean;
    wantsKids?: boolean;
    starSign?: string;
    religion?: string;
    pronoun?: 'He/Him' | 'She/Her' | 'They/Them' | 'Other';
    
    // Interests & Values
    favInterest?: string[];
    causesYouSupport?: string[];
    qualityYouValue?: string[];
    prompts?: Array<{
      id: string;
      question: string;
      answer: string;
    }>;
    education?: Array<{
      institution: string;
      degree: string;
      year?: number;
    }>;
    
    // Profile Analytics
    profileCompletion: number;
    lastUpdated: string;
    viewCount?: number;
    likeCount?: number;
  }
}
```

### PUT /user-profile
**Description**: Update user profile information with validation

**Headers**: `Authorization: {token}`

**Request Body**: All fields optional for partial updates
```typescript
interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  bio?: string;
  images?: string[];
  dob?: string;
  gender?: 'male' | 'female' | 'other';
  height?: number;
  currentCity?: string;
  hometown?: string;
  exercise?: 'None' | 'Light' | 'Moderate' | 'Heavy';
  educationLevel?: 'High School' | 'Undergraduate' | 'Graduate' | 'Postgraduate';
  drinking?: 'Never' | 'Occasionally' | 'Regularly';
  smoking?: 'Never' | 'Occasionally' | 'Regularly';
  lookingFor?: 'Friendship' | 'Casual' | 'Relationship';
  settleDownInMonths?: string;
  haveKids?: boolean;
  wantsKids?: boolean;
  starSign?: string;
  religion?: string;
  pronoun?: 'He/Him' | 'She/Her' | 'They/Them' | 'Other';
  favInterest?: string[];
  causesYouSupport?: string[];
  qualityYouValue?: string[];
  prompts?: Array<{
    id?: string;
    question: string;
    answer: string;
  }>;
  education?: Array<{
    institution: string;
    degree: string;
    year?: number;
  }>;
}
```

**Response**:
```typescript
{
  success: boolean;
  data: UpdatedUserProfile;
  profileCompletion: number;
  updatedFields: string[];
}
```

## Partner Preferences Endpoints

### GET /user/partner-preferences
**Description**: Get current user's partner preferences

**Headers**: `Authorization: {token}`

**Response**:
```typescript
{
  success: boolean;
  data: {
    id?: string;
    
    // Basic Preferences
    minAge?: number;
    maxAge?: number;
    locationPreferenceRadius?: number; // km
    
    // Lifestyle Preferences
    interests?: string[];
    hobbies?: string[];
    educationLevel?: string[];
    profession?: string[];
    
    // Physical Preferences
    minHeight?: number;
    maxHeight?: number;
    
    // Financial Preferences
    minIncome?: number;
    maxIncome?: number;
    
    // Values & Lifestyle
    religion?: string[];
    smoking?: 'Never' | 'Occasionally' | 'Regularly' | 'Any';
    drinking?: 'Never' | 'Occasionally' | 'Regularly' | 'Any';
    
    // Family Preferences
    hasKids?: 'Yes' | 'No' | 'Any';
    wantsKids?: 'Yes' | 'No' | 'Maybe' | 'Any';
    
    // Additional Info
    whatOtherPersonShouldKnow?: string;
    dealBreakers?: string[];
    
    // Metadata
    createdAt?: string;
    updatedAt?: string;
  }
}
```

### PUT /user/partner-preferences
**Description**: Update partner preferences with validation

**Headers**: `Authorization: {token}`

**Request Body**:
```typescript
interface UpdatePartnerPreferencesRequest {
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
  dealBreakers?: string[];
}
```

**Validation Rules**:
- `minAge` >= 18, `maxAge` <= 100
- `minAge` <= `maxAge`
- `minHeight` <= `maxHeight`
- `minIncome` <= `maxIncome`
- `locationPreferenceRadius` 1-1000 km
- Arrays max 10 items each

### POST /user/partner-preferences
**Description**: Create initial partner preferences

### DELETE /user/partner-preferences
**Description**: Delete partner preferences

## User Availability Endpoints (NEW)

### POST /user/availability
**Description**: Create availability slot for dates

**Headers**: `Authorization: {token}`

**Request Body**:
```typescript
interface CreateAvailabilityRequest {
  availabilityDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  timezone?: string; // Default: user's timezone
  dateType: 'online' | 'offline';
  title?: string;
  notes?: string;
  locationPreference?: string; // For offline dates
  bufferTimeMinutes?: number; // Default: 15
  preparationTimeMinutes?: number; // Default: 30
  cancellationPolicy?: 'flexible' | '24_hours' | '48_hours' | 'strict';
  
  // Recurring Options
  isRecurring?: boolean;
  recurrenceType?: 'weekly' | 'custom';
  recurrenceEndDate?: string; // YYYY-MM-DD
}
```

**Response**:
```typescript
{
  success: boolean;
  data: {
    id: number;
    availabilityDate: string;
    startTime: string;
    endTime: string;
    dateType: 'online' | 'offline';
    status: 'active' | 'booked' | 'cancelled';
    isBooked: boolean;
    formattedDateTime: string;
    durationMinutes: number;
    canCancel: boolean;
    canModify: boolean;
  }
}
```

### GET /user/availability
**Description**: Get user's availability slots with filtering

**Query Parameters**:
```typescript
{
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  status?: ('active' | 'booked' | 'cancelled')[];
  dateType?: ('online' | 'offline')[];
  includeBookings?: boolean;
  page?: number;
  limit?: number;
}
```

### PUT /user/availability/{id}
**Description**: Update availability slot

### DELETE /user/availability/{id}
**Description**: Cancel availability slot

### GET /search/available-users
**Description**: Search for available users for dating

**Query Parameters**:
```typescript
{
  availabilityDate: string; // YYYY-MM-DD
  startTime?: string; // HH:MM
  endTime?: string; // HH:MM
  dateType?: 'online' | 'offline';
  locationRadius?: number; // km for offline dates
  preferredActivities?: ('coffee' | 'lunch' | 'dinner' | 'drinks' | 'movie' | 'walk')[];
  ageRange?: {
    min: number;
    max: number;
  };
  page?: number;
  limit?: number;
}
```

**Response**:
```typescript
{
  success: boolean;
  data: {
    matches: Array<{
      availability: AvailabilitySlot;
      user: {
        id: string;
        firstName: string;
        profileImage?: string;
        age: number;
        location: string;
        bio?: string;
        verificationStatus: {
          email: boolean;
          phone: boolean;
          identity: boolean;
        };
      };
      compatibilityScore?: number;
      distance?: number; // km for offline dates
      commonInterests?: string[];
    }>;
    pagination: PaginationInfo;
  }
}
```

### POST /user/availability/{id}/book
**Description**: Book someone's availability slot

**Request Body**:
```typescript
{
  selectedActivity: 'coffee' | 'lunch' | 'dinner' | 'drinks' | 'movie' | 'walk' | 'activity' | 'casual';
  bookingNotes?: string;
}
```

## Matching Endpoints

### GET /matches
**Description**: Get potential matches based on preferences

**Headers**: `Authorization: {token}`

**Query Parameters**:
```typescript
{
  page?: number;
  limit?: number;
  minCompatibilityScore?: number; // 0-100
  maxDistance?: number; // km
  ageRange?: {
    min: number;
    max: number;
  };
  lastSeen?: string; // Get matches after this ID
}
```

**Response**:
```typescript
{
  success: boolean;
  data: {
    matches: Array<{
      userId: string;
      profile: {
        id: string;
        firstName: string;
        age: number;
        images: string[];
        bio?: string;
        location: string;
        distance?: number;
        occupation?: string;
        education?: string;
        interests?: string[];
        isVerified: boolean;
        isPremium: boolean;
        lastSeen?: string;
      };
      compatibilityScore: number;
      matchReasons: string[];
      compatibilityBreakdown: {
        interests: number;
        lifestyle: number;
        values: number;
        demographics: number;
      };
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrevious: boolean;
    };
    summary: {
      averageCompatibility: number;
      totalPotentialMatches: number;
      newMatchesThisWeek: number;
    };
  }
}
```

### GET /compatibility/{targetUserId}
**Description**: Get detailed compatibility analysis with specific user

**Response**:
```typescript
{
  success: boolean;
  data: {
    compatibilityScore: number; // 0-100
    breakdown: {
      demographics: number; // Age, location compatibility
      interests: number; // Shared interests score
      lifestyle: number; // Exercise, drinking, smoking compatibility
      values: number; // Religion, family plans, causes
      education: number; // Education level compatibility
      dealBreakers: string[]; // Any deal breaker conflicts
    };
    sharedInterests: string[];
    sharedValues: string[];
    recommendations: string[];
    potentialConcerns: string[];
  }
}
```

### POST /matches/{userId}/action
**Description**: Perform swipe action (like, pass, super like)

**Request Body**:
```typescript
{
  action: 'like' | 'pass' | 'superlike';
  context?: {
    viewTime: number; // seconds spent viewing profile
    imageViewed: number; // which image they were viewing
    source: 'discovery' | 'search' | 'recommendation';
  };
}
```

**Response**:
```typescript
{
  success: boolean;
  data: {
    action: string;
    isMatch: boolean; // true if both users liked each other
    matchData?: {
      matchId: string;
      matchedAt: string;
      celebrationMessage: string;
    };
    remainingLikes?: number; // for free users
    premiumUpgradePrompt?: boolean;
  }
}
```

## File Upload Endpoints

### POST /upload/profile-image
**Description**: Upload profile images with validation and processing

**Headers**: 
- `Authorization: {token}`
- `Content-Type: multipart/form-data`

**Request Body**: FormData with files

**Validation**:
- Max size: 10MB per image
- Formats: JPEG, PNG, WebP
- Min dimensions: 300x300px
- Max dimensions: 4096x4096px
- Max images: 6 per profile

**Response**:
```typescript
{
  success: boolean;
  data: {
    images: Array<{
      id: string;
      url: string;
      cdnUrl: string;
      thumbnailUrl: string;
      filename: string;
      size: number;
      dimensions: {
        width: number;
        height: number;
      };
      uploadedAt: string;
    }>;
    profileCompletion: number;
  }
}
```

### DELETE /upload/profile-image/{imageId}
**Description**: Remove profile image

## Admin Endpoints

### POST /admin/auth/login
**Description**: Admin authentication with enhanced security

**Request Body**:
```typescript
interface AdminLoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
  deviceInfo?: {
    userAgent: string;
    ipAddress: string;
    deviceType: 'desktop' | 'mobile' | 'tablet';
    browser?: string;
    os?: string;
  };
}
```

**Response**:
```typescript
{
  success: boolean;
  data: {
    accessToken: string;
    expiresIn: number;
    admin: {
      id: number;
      email: string;
      permissionLevel: 'viewer' | 'moderator' | 'admin' | 'super_admin' | 'owner';
      accountStatus: 'active' | 'suspended' | 'locked';
      permissions: string[];
      lastLoginAt: string;
      twoFactorEnabled: boolean;
    };
    sessionId: string;
    requires2FA: boolean;
  }
}
```

### GET /admin/users
**Description**: Get users list with filtering (Admin only)

**Query Parameters**:
```typescript
{
  page?: number;
  limit?: number;
  search?: string; // Search by name or email
  status?: 'active' | 'suspended' | 'banned';
  verified?: boolean;
  registeredAfter?: string; // ISO date
  registeredBefore?: string; // ISO date
  sortBy?: 'registrationDate' | 'lastActivity' | 'profileCompletion';
  sortOrder?: 'asc' | 'desc';
}
```

### GET /admin/analytics/overview
**Description**: Admin dashboard analytics

**Response**:
```typescript
{
  success: boolean;
  data: {
    userStats: {
      totalUsers: number;
      activeUsers: number;
      newUsersThisWeek: number;
      verifiedUsers: number;
      premiumUsers: number;
    };
    activityStats: {
      totalMatches: number;
      matchesThisWeek: number;
      messagesThisWeek: number;
      profileViewsThisWeek: number;
    };
    revenueStats: {
      monthlyRevenue: number;
      yearlyRevenue: number;
      averageRevenuePerUser: number;
    };
    trends: Array<{
      date: string;
      newUsers: number;
      activeUsers: number;
      matches: number;
      revenue: number;
    }>;
  }
}
```

## Waitlist Endpoints

### POST /waitlist
**Description**: Join the waitlist

**Request Body**:
```typescript
{
  name: string;
  email: string;
  source?: string; // Marketing source tracking
  interests?: string[];
}
```

### GET /waitlist-count
**Description**: Get current waitlist count (public)

**Response**:
```typescript
{
  success: boolean;
  data: {
    count: number;
    milestone?: {
      next: number;
      message: string;
    };
  }
}
```

## Error Responses & Rate Limiting

### Standard Error Format
```typescript
{
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    statusCode: number;
  };
  metadata: {
    requestId: string;
    timestamp: string;
  }
}
```

### Common Error Codes
- **400 BAD_REQUEST**: Invalid input data
- **401 UNAUTHORIZED**: Invalid or missing token
- **403 FORBIDDEN**: Insufficient permissions
- **404 NOT_FOUND**: Resource doesn't exist
- **409 CONFLICT**: Resource already exists
- **422 VALIDATION_ERROR**: Input validation failed
- **429 RATE_LIMITED**: Too many requests
- **500 INTERNAL_ERROR**: Server error

### Rate Limiting
- **Authentication**: 5 requests/minute per IP
- **Profile Updates**: 10 requests/minute per user
- **File Uploads**: 5 requests/minute per user
- **Matching**: 100 requests/hour per user
- **General API**: 1000 requests/hour per user

**Rate Limit Headers**:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## WebSocket Events (Future Implementation)

### Connection
```javascript
const socket = io('wss://api.datifyy.com', {
  auth: { token: userToken }
});
```

### Real-time Events
- `match_found` - New match notification
- `message_received` - New message in chat
- `profile_viewed` - Someone viewed your profile  
- `availability_booked` - Your availability was booked
- `user_online` / `user_offline` - User status changes

## SDK Integration Example

### TypeScript/JavaScript
```typescript
import { ApiService } from '@datifyy/api-client';

const api = new ApiService({
  baseURL: 'https://api.datifyy.com/v1',
  token: localStorage.getItem('authToken')
});

// Authentication
const { user, token } = await api.auth.login({
  email: 'user@example.com',
  password: 'password'
});

// Profile Management
const profile = await api.profile.get();
await api.profile.update({ bio: 'Updated bio' });

// Matching
const matches = await api.matches.discover({
  minCompatibilityScore: 70,
  maxDistance: 50
});

// Availability
await api.availability.create({
  date: '2024-01-15',
  startTime: '19:00',
  endTime: '21:00',
  dateType: 'offline'
});
```

This comprehensive API contract provides complete documentation for all current and planned endpoints, with proper TypeScript interfaces, validation rules, and usage examples.