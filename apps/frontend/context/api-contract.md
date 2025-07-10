# API Contract Documentation

## Base Configuration

### Base URLs
- **Development**: `http://localhost:3453/api/v1`
- **Production**: `https://datifyy-monorepo.onrender.com/api/v1`

### Authentication
- **Type**: Bearer Token
- **Header**: `Authorization: {token}`
- **Token Storage**: Cookies (`Authorization={token}; path=/;`)

### Response Format
All API responses follow this structure:
```typescript
interface ApiResponse<T> {
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
```

## Authentication Endpoints

### POST /auth/login
**Description**: User login with email and password

**Request Body**:
```typescript
interface LoginRequest {
  email: string;
  password: string;
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
  };
}
```

**Example**:
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
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
}
```

**Response**:
```typescript
interface SignupResponse {
  message: string;
  userId: string;
}
```

### POST /auth/send-verification-code
**Description**: Send email verification code

**Request Body**:
```typescript
{
  email: string;
}
```

**Response**:
```typescript
{
  success: boolean;
  message: string;
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
}
```

### POST /auth/logout
**Description**: Logout user and invalidate token

**Headers**: `Authorization: {token}`

## User Profile Endpoints

### GET /user-profile
**Description**: Get current user's profile information

**Headers**: `Authorization: {token}`

**Response**:
```typescript
{
  data: {
    id: string;
    firstName: string;
    lastName: string;
    officialEmail: string;
    bio?: string;
    images?: string[];
    dob?: string;           // ISO date string
    gender?: string;
    height?: number;        // in cm
    currentCity?: string;
    hometown?: string;
    isOfficialEmailVerified?: boolean;
    isAadharVerified?: boolean;
    isPhoneVerified?: boolean;
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
    prompts?: object[];
    education?: object[];
    // ... other profile fields
  }
}
```

### PUT /user-profile
**Description**: Update user profile information

**Headers**: `Authorization: {token}`

**Request Body**:
```typescript
interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  bio?: string;
  images?: string[];
  dob?: string;           // ISO date string
  gender?: string;
  height?: number;        // in cm
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
  prompts?: object[];
  education?: object[];
}
```

**Response**:
```typescript
{
  success: boolean;
  data: UpdatedUserProfile;
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
    createdAt?: string;     // ISO date string
    updatedAt?: string;     // ISO date string
  }
}
```

### PUT /user/partner-preferences
**Description**: Update partner preferences

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
}
```

**Response**:
```typescript
{
  success: boolean;
  data: UpdatedPartnerPreferences;
}
```

### POST /user/partner-preferences
**Description**: Create initial partner preferences

**Headers**: `Authorization: {token}`

**Request Body**: Same as PUT request

**Response**: Same as PUT response

### DELETE /user/partner-preferences
**Description**: Delete partner preferences

**Headers**: `Authorization: {token}`

**Response**:
```typescript
{
  success: boolean;
  message: string;
}
```

## Matching Endpoints

### GET /matches
**Description**: Get potential matches based on preferences

**Headers**: `Authorization: {token}`

**Query Parameters**:
- `page?: number` - Page number (default: 1)
- `limit?: number` - Items per page (default: 10)
- `minScore?: number` - Minimum compatibility score

**Response**:
```typescript
{
  success: boolean;
  data: {
    matches: Array<{
      userId: string;
      profile: UserProfileResponse;
      compatibilityScore: number;
      matchReasons: string[];
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrevious: boolean;
    };
  }
}
```

### GET /compatibility/{targetUserId}
**Description**: Get compatibility score with specific user

**Headers**: `Authorization: {token}`

**Response**:
```typescript
{
  success: boolean;
  data: {
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
}
```

## File Upload Endpoints

### POST /upload
**Description**: Upload profile images or documents

**Headers**: 
- `Authorization: {token}`
- `Content-Type: multipart/form-data`

**Request Body**: FormData with file(s)

**Response**:
```typescript
{
  success: boolean;
  data: {
    url: string;
    filename: string;
    size: number;
    mimetype: string;
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
}
```

### GET /waitlist-count
**Description**: Get current waitlist count

**Response**:
```typescript
{
  success: boolean;
  data: {
    count: number;
  }
}
```

### GET /waitlist-data
**Description**: Get waitlist data (Admin only)

**Headers**: `Authorization: {token}`

## Error Responses

### Standard Error Format
```typescript
{
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  metadata: {
    requestId: string;
    timestamp: string;
  }
}
```

### Common Error Codes
- **400**: Bad Request - Invalid input data
- **401**: Unauthorized - Invalid or missing token
- **403**: Forbidden - Insufficient permissions
- **404**: Not Found - Resource doesn't exist
- **409**: Conflict - Resource already exists
- **422**: Unprocessable Entity - Validation errors
- **429**: Too Many Requests - Rate limit exceeded
- **500**: Internal Server Error - Server error

### Validation Error Response
```typescript
{
  success: false;
  error: {
    code: "VALIDATION_ERROR";
    message: "Validation failed";
    details: {
      field: string;
      message: string;
    }[];
  }
}
```

## Request/Response Examples

### Complete Login Flow
```bash
# 1. Send verification code
POST /api/v1/auth/send-verification-code
{
  "email": "user@example.com"
}

# 2. Register user
POST /api/v1/auth/signup
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "verificationCode": "123456"
}

# 3. Login
POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

# Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user123",
      "email": "user@example.com",
      "name": "John Doe",
      "isAdmin": false
    }
  }
}
```

### Profile Update Example
```bash
PUT /api/v1/user-profile
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Love hiking and coffee ☕",
  "dob": "1990-05-15",
  "gender": "male",
  "height": 175,
  "currentCity": "San Francisco",
  "lookingFor": "Relationship",
  "favInterest": ["hiking", "coffee", "travel"]
}
```

### Partner Preferences Example
```bash
PUT /api/v1/user/partner-preferences
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "minAge": 25,
  "maxAge": 35,
  "interests": ["travel", "fitness", "cooking"],
  "educationLevel": ["Graduate", "Postgraduate"],
  "smoking": "Never",
  "drinking": "Occasionally",
  "locationPreferenceRadius": 50
}
```

## Rate Limiting

### Limits
- **Authentication**: 5 requests per minute per IP
- **Profile Updates**: 10 requests per minute per user
- **File Uploads**: 5 requests per minute per user
- **General API**: 100 requests per minute per user

### Headers
Response includes rate limit information:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Pagination

### Query Parameters
```typescript
interface PaginationRequest {
  page?: number;        // Default: 1
  limit?: number;       // Default: 10, Max: 100
  sortBy?: string;      // Field to sort by
  sortOrder?: 'ASC' | 'DESC'; // Default: 'ASC'
}
```

### Response Format
```typescript
interface PaginationResponse<T> {
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

## WebSocket Events (Future)

### Connection
```javascript
const socket = io('wss://api.datifyy.com', {
  auth: {
    token: userToken
  }
});
```

### Events
- `match_found` - New match notification
- `message_received` - New message
- `user_online` - User came online
- `user_offline` - User went offline
- `typing_start` - User started typing
- `typing_stop` - User stopped typing

## SDK Integration

### JavaScript/TypeScript
```typescript
import { ApiService } from '@datifyy/api-client';

const api = new ApiService({
  baseURL: 'https://api.datifyy.com/v1',
  apiKey: 'your-api-key'
});

// Login
const loginResult = await api.auth.login({
  email: 'user@example.com',
  password: 'password'
});

// Get profile
const profile = await api.profile.get();

// Update preferences
await api.preferences.update({
  minAge: 25,
  maxAge: 35
});
```