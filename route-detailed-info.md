# Datifyy Backend Routes - Detailed Documentation

## Table of Contents
1. [Overview](#overview)
2. [Authentication & Middleware](#authentication--middleware)
3. [Route Categories](#route-categories)
   - [Authentication Routes](#authentication-routes)
   - [Admin Authentication Routes](#admin-authentication-routes)
   - [User Profile Routes](#user-profile-routes)
   - [User Availability Routes](#user-availability-routes)
   - [Partner Preferences Routes](#partner-preferences-routes)
   - [Date Curation Routes](#date-curation-routes)
   - [Admin Dashboard Routes](#admin-dashboard-routes)
   - [Admin Notification Routes](#admin-notification-routes)
   - [Admin User Management Routes](#admin-user-management-routes)
   - [Admin Date Curation Routes](#admin-date-curation-routes)
   - [Admin Revenue Analytics Routes](#admin-revenue-analytics-routes)
   - [Admin Match Suggestions Routes](#admin-match-suggestions-routes)
   - [Image Upload Routes](#image-upload-routes)
   - [Legacy Routes](#legacy-routes)
4. [Common Response Formats](#common-response-formats)
5. [Error Handling](#error-handling)

## Overview

The Datifyy backend API is built using Express.js with TypeScript and follows RESTful principles. The API uses JWT-based authentication and includes comprehensive middleware for validation, rate limiting, and logging.

**Base URL**: `http://localhost:8000/api`

**Global Headers**:
- `Content-Type: application/json`
- `Authorization: Bearer {{login_token}}` (for authenticated routes)

## Authentication & Middleware

### Middleware Stack

1. **Request ID Middleware** (`requestId`)
   - Adds unique request ID to each request for tracking
   - Used for distributed tracing and logging

2. **Rate Limiter** (`authRateLimiter`)
   - Protects against brute force attacks
   - Different limits for different route types

3. **Authentication Middleware** (`authenticate`)
   - Validates JWT tokens
   - Extracts user information from token
   - Adds `req.user` object with user details

4. **Admin Authentication Middleware** (`adminAuthMiddleware`)
   - Enhanced authentication for admin routes
   - Supports role-based access control
   - Validates admin permissions and session

5. **Validation Middleware**
   - DTOs validation using class-validator
   - Request body, query, and params validation

### Authentication Flow

```typescript
// User Authentication
interface AuthenticatedUser {
  id: number;
  email: string;
  isAdmin: boolean;
  profile?: any;
}

// Admin Authentication
interface AuthenticatedAdmin {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  permissionLevel: AdminPermissionLevel;
  permissions: AdminPermission[];
  accountStatus: AdminAccountStatus;
  sessionId: string;
  isActive: boolean;
  lastActiveAt: Date;
  hasPermission: (permission: AdminPermission) => boolean;
  hasAnyPermission: (permissions: AdminPermission[]) => boolean;
  hasAllPermissions: (permissions: AdminPermission[]) => boolean;
  hasRoleLevel: (level: AdminPermissionLevel) => boolean;
}
```

## Route Categories

### Authentication Routes

Base path: `/auth`

#### 1. POST `/auth/send-verification-code`
**Description**: Send email verification code for signup process

**Middleware**:
- `requestId()`
- `authRateLimiter`
- `validateSendVerificationCode`

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Verification code sent successfully",
  "data": {
    "email": "user@example.com",
    "expiresIn": 600
  }
}
```

**Error Cases**:
- 400: Invalid email format
- 409: Email already exists
- 429: Too many requests

---

#### 2. POST `/auth/signup`
**Description**: Register new user account with email verification

**Middleware**:
- `requestId()`
- `authRateLimiter`
- `validateSignup`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "verificationCode": "123456",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-01",
  "gender": "male"
}
```

**Response**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "isActive": true,
      "isEmailVerified": true
    },
    "token": "jwt_token_here",
    "expiresIn": 86400
  }
}
```

**Error Cases**:
- 400: Invalid input data
- 401: Invalid verification code
- 409: Email already exists

---

#### 3. POST `/auth/login`
**Description**: Authenticate user and get JWT token

**Middleware**:
- `requestId()`
- `authRateLimiter`
- `validateLogin`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "isAdmin": false,
      "profile": {
        "profilePicture": "url_to_image",
        "bio": "User bio",
        "city": "Mumbai"
      }
    },
    "token": "jwt_token_here",
    "expiresIn": 86400
  }
}
```

**Error Cases**:
- 401: Invalid credentials
- 403: Account suspended/inactive
- 404: User not found

---

#### 4. POST `/auth/logout`
**Description**: Clear authentication session

**Middleware**:
- `requestId()`

**Response**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

#### 5. POST `/auth/verify-email`
**Description**: Verify user email with code

**Middleware**:
- `requestId()`
- `authRateLimiter`
- `validateVerifyEmail`

**Request Body**:
```json
{
  "email": "user@example.com",
  "verificationCode": "123456"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "email": "user@example.com",
    "isEmailVerified": true
  }
}
```

---

#### 6. POST `/auth/forgot-password`
**Description**: Send password reset code

**Middleware**:
- `requestId()`
- `authRateLimiter`
- `validateForgotPassword`

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Password reset code sent",
  "data": {
    "email": "user@example.com",
    "expiresIn": 600
  }
}
```

---

#### 7. POST `/auth/reset-password`
**Description**: Reset password with verification code

**Middleware**:
- `requestId()`
- `authRateLimiter`
- `validateResetPassword`

**Request Body**:
```json
{
  "email": "user@example.com",
  "verificationCode": "123456",
  "newPassword": "NewSecurePassword123!"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

#### 8. POST `/auth/validate-token`
**Description**: Validate JWT token and get user info

**Middleware**:
- `requestId()`
- `asyncHandler`

**Request Headers**:
```
Authorization: Bearer {{login_token}}
```

**Response**:
```json
{
  "success": true,
  "message": "Token is valid",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "isAdmin": false
    },
    "tokenExpiresIn": 3600
  }
}
```

---

### Admin Authentication Routes

Base path: `/admin/auth`

#### 1. POST `/admin/auth/login`
**Description**: Admin login with 2FA support

**Middleware**:
- `requestId()`
- `validateAdminLogin`

**Request Body**:
```json
{
  "email": "admin@datifyy.com",
  "password": "AdminSecurePassword123!",
  "twoFactorCode": "123456" // Optional if 2FA enabled
}
```

**Response**:
```json
{
  "success": true,
  "message": "Admin login successful",
  "data": {
    "admin": {
      "id": 1,
      "email": "admin@datifyy.com",
      "firstName": "Admin",
      "lastName": "User",
      "permissionLevel": "SUPER_ADMIN",
      "permissions": ["USER_MANAGEMENT", "DATE_CURATION", "REVENUE_VIEW"]
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token",
    "expiresIn": 3600,
    "requires2FA": false
  }
}
```

---

#### 2. POST `/admin/auth/2fa`
**Description**: Complete 2FA verification

**Middleware**:
- `requestId()`
- `validate2FA`

**Request Body**:
```json
{
  "tempToken": "temp_2fa_token",
  "twoFactorCode": "123456"
}
```

**Response**:
```json
{
  "success": true,
  "message": "2FA verification successful",
  "data": {
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token",
    "expiresIn": 3600
  }
}
```

---

### User Profile Routes

Base path: `/user-profile`

#### 1. GET `/user-profile`
**Description**: Get authenticated user's profile

**Middleware**:
- `authenticate()`
- `asyncHandler`

**Response**:
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "profile": {
      "id": 1,
      "userId": 1,
      "firstName": "John",
      "lastName": "Doe",
      "bio": "Software engineer who loves coffee",
      "dateOfBirth": "1990-01-01",
      "gender": "male",
      "profilePicture": "https://storage.datifyy.com/profiles/1.jpg",
      "city": "Mumbai",
      "occupation": "Software Engineer",
      "education": "B.Tech Computer Science",
      "height": 175,
      "religion": "Hindu",
      "motherTongue": "Hindi",
      "maritalStatus": "single",
      "drinking": "occasionally",
      "smoking": "never",
      "diet": "vegetarian",
      "hobbies": ["reading", "traveling", "cooking"],
      "interests": ["technology", "music", "sports"],
      "profileCompletionScore": 85,
      "isVerified": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T00:00:00Z"
    }
  }
}
```

---

#### 2. PUT `/user-profile`
**Description**: Update user profile

**Middleware**:
- `authenticate()`
- `validateUpdateProfile`
- `asyncHandler`

**Request Body**:
```json
{
  "bio": "Updated bio",
  "city": "Delhi",
  "occupation": "Senior Software Engineer",
  "hobbies": ["reading", "traveling", "cooking", "photography"],
  "interests": ["technology", "music", "sports", "art"]
}
```

**Response**:
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "profile": {
      // Updated profile object
    },
    "updatedFields": ["bio", "city", "occupation", "hobbies", "interests"]
  }
}
```

---

### User Availability Routes

Base path: `/availability`

#### 1. POST `/availability`
**Description**: Create availability slot

**Middleware**:
- `authenticate()`
- `validateCreateAvailability`
- `asyncHandler`

**Request Body**:
```json
{
  "date": "2024-02-01",
  "startTime": "18:00",
  "endTime": "20:00",
  "type": "online",
  "isRecurring": false,
  "recurringDays": [],
  "notes": "Available for video dates"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Availability created successfully",
  "data": {
    "availability": {
      "id": 1,
      "userId": 1,
      "date": "2024-02-01",
      "startTime": "18:00:00",
      "endTime": "20:00:00",
      "type": "online",
      "status": "available",
      "isRecurring": false,
      "notes": "Available for video dates"
    }
  }
}
```

---

#### 2. POST `/availability/bulk`
**Description**: Create multiple availability slots

**Middleware**:
- `authenticate()`
- `validateBulkAvailability`
- `asyncHandler`

**Request Body**:
```json
{
  "slots": [
    {
      "date": "2024-02-01",
      "startTime": "18:00",
      "endTime": "20:00",
      "type": "online"
    },
    {
      "date": "2024-02-02",
      "startTime": "19:00",
      "endTime": "21:00",
      "type": "offline"
    }
  ],
  "recurringOptions": {
    "enabled": true,
    "endDate": "2024-03-01",
    "days": ["monday", "wednesday", "friday"]
  }
}
```

**Response**:
```json
{
  "success": true,
  "message": "Bulk availability created",
  "data": {
    "created": 15,
    "failed": 0,
    "slots": [
      // Array of created availability objects
    ]
  }
}
```

---

### Partner Preferences Routes

Base path: `/user/partner-preferences`

#### 1. GET `/user/partner-preferences`
**Description**: Get user's partner preferences

**Middleware**:
- `authenticate()`
- `asyncHandler`

**Response**:
```json
{
  "success": true,
  "message": "Partner preferences retrieved",
  "data": {
    "preferences": {
      "id": 1,
      "userId": 1,
      "ageRange": {
        "min": 25,
        "max": 35
      },
      "heightRange": {
        "min": 160,
        "max": 180
      },
      "education": ["bachelors", "masters", "phd"],
      "occupation": ["any"],
      "religion": ["hindu", "sikh", "jain"],
      "motherTongue": ["hindi", "english", "punjabi"],
      "maritalStatus": ["single", "divorced"],
      "diet": ["vegetarian", "vegan"],
      "drinking": ["never", "occasionally"],
      "smoking": ["never"],
      "location": {
        "cities": ["Mumbai", "Delhi", "Bangalore"],
        "maxDistance": 50
      },
      "interests": ["reading", "traveling", "music"],
      "personalityTraits": ["honest", "caring", "ambitious"],
      "dealBreakers": ["smoking", "non-vegetarian"],
      "importanceWeights": {
        "age": 8,
        "education": 7,
        "religion": 9,
        "lifestyle": 6,
        "location": 5
      }
    }
  }
}
```

---

#### 2. PUT `/user/partner-preferences`
**Description**: Update partner preferences

**Middleware**:
- `authenticate()`
- `validateUpdatePreferences`
- `asyncHandler`

**Request Body**:
```json
{
  "ageRange": {
    "min": 26,
    "max": 36
  },
  "education": ["bachelors", "masters"],
  "location": {
    "cities": ["Mumbai", "Pune"],
    "maxDistance": 100
  },
  "importanceWeights": {
    "age": 7,
    "education": 8,
    "religion": 9,
    "lifestyle": 7,
    "location": 6
  }
}
```

**Response**:
```json
{
  "success": true,
  "message": "Preferences updated successfully",
  "data": {
    "preferences": {
      // Updated preferences object
    },
    "matchingUsersCount": 234
  }
}
```

---

### Date Curation Routes

Base path: `/date-curation`

#### User Routes

#### 1. GET `/date-curation/my-dates`
**Description**: Get user's curated dates

**Middleware**:
- `authenticate()`
- `asyncHandler`

**Query Parameters**:
- `status`: upcoming | past | pending | all
- `page`: number (default: 1)
- `limit`: number (default: 10)

**Response**:
```json
{
  "success": true,
  "message": "Dates retrieved successfully",
  "data": {
    "dates": [
      {
        "id": 1,
        "dateId": "DT-2024-001",
        "user1": {
          "id": 1,
          "firstName": "John",
          "lastName": "Doe",
          "profilePicture": "url"
        },
        "user2": {
          "id": 2,
          "firstName": "Jane",
          "lastName": "Smith",
          "profilePicture": "url"
        },
        "scheduledDate": "2024-02-14",
        "scheduledTime": "19:00",
        "type": "offline",
        "venue": {
          "name": "Café Coffee Day",
          "address": "Bandra West, Mumbai",
          "mapUrl": "https://maps.google.com/..."
        },
        "status": "confirmed",
        "isUser1": true,
        "matchScore": 85,
        "commonInterests": ["traveling", "reading", "music"],
        "createdAt": "2024-01-20T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 5,
      "page": 1,
      "limit": 10,
      "pages": 1
    }
  }
}
```

---

#### 2. POST `/date-curation/my-dates/:dateId/confirm`
**Description**: Confirm attendance for a curated date

**Middleware**:
- `authenticate()`
- `validateDateAction`
- `asyncHandler`

**Request Body**:
```json
{
  "confirmationNote": "Looking forward to meeting!"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Date confirmed successfully",
  "data": {
    "dateId": "DT-2024-001",
    "status": "confirmed",
    "confirmedAt": "2024-02-01T15:30:00Z",
    "partnerNotified": true
  }
}
```

---

#### 3. POST `/date-curation/my-dates/:dateId/feedback`
**Description**: Submit feedback after date completion

**Middleware**:
- `authenticate()`
- `validateDateFeedback`
- `asyncHandler`

**Request Body**:
```json
{
  "overallRating": 4,
  "showedUp": true,
  "wasInterested": true,
  "wouldMeetAgain": true,
  "connectionQuality": 5,
  "conversationFlow": 4,
  "punctuality": 5,
  "appearance": 4,
  "personality": 5,
  "comments": "Had a great time! Very interesting person.",
  "privateNotes": "Definitely interested in second date",
  "reportIssue": false,
  "issueType": null,
  "issueDescription": null
}
```

**Response**:
```json
{
  "success": true,
  "message": "Feedback submitted successfully",
  "data": {
    "feedbackId": 1,
    "dateId": "DT-2024-001",
    "trustScoreImpact": +5,
    "newTrustScore": 85,
    "matchResult": "mutual_interest",
    "secondDateSuggested": true
  }
}
```

---

#### Admin Routes

#### 1. POST `/date-curation/admin/curated-dates`
**Description**: Admin creates curated date between users

**Middleware**:
- `authenticate()`
- `requireAdmin()`
- `validateCreateCuratedDate`
- `asyncHandler`

**Request Body**:
```json
{
  "user1Id": 1,
  "user2Id": 2,
  "scheduledDate": "2024-02-14",
  "scheduledTime": "19:00",
  "type": "offline",
  "venue": {
    "name": "Café Coffee Day",
    "address": "Bandra West, Mumbai",
    "mapUrl": "https://maps.google.com/..."
  },
  "adminNotes": "High compatibility score, similar interests",
  "notifyUsers": true,
  "requireConfirmation": true
}
```

**Response**:
```json
{
  "success": true,
  "message": "Curated date created successfully",
  "data": {
    "curatedDate": {
      "id": 1,
      "dateId": "DT-2024-001",
      "user1": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "user2": {
        "id": 2,
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      "scheduledDate": "2024-02-14",
      "scheduledTime": "19:00",
      "type": "offline",
      "venue": {
        "name": "Café Coffee Day",
        "address": "Bandra West, Mumbai"
      },
      "status": "pending_confirmation",
      "matchScore": 85,
      "createdBy": "admin@datifyy.com",
      "createdAt": "2024-01-20T10:00:00Z"
    },
    "notificationsSent": {
      "user1": {
        "email": true,
        "sms": true,
        "push": true
      },
      "user2": {
        "email": true,
        "sms": true,
        "push": true
      }
    }
  }
}
```

---

#### 2. POST `/date-curation/admin/search-potential-matches`
**Description**: Search potential matches for a user

**Middleware**:
- `authenticate()`
- `requireAdmin()`
- `validateSearchMatches`
- `asyncHandler`

**Request Body**:
```json
{
  "userId": 1,
  "filters": {
    "ageRange": {
      "min": 25,
      "max": 35
    },
    "location": {
      "cities": ["Mumbai", "Pune"],
      "maxDistance": 50
    },
    "minMatchScore": 70,
    "excludeUsers": [5, 10, 15],
    "onlyVerified": true,
    "hasAvailability": true
  },
  "sortBy": "matchScore",
  "limit": 20
}
```

**Response**:
```json
{
  "success": true,
  "message": "Potential matches found",
  "data": {
    "matches": [
      {
        "user": {
          "id": 2,
          "firstName": "Jane",
          "lastName": "Smith",
          "age": 28,
          "city": "Mumbai",
          "profilePicture": "url",
          "bio": "Short bio...",
          "isVerified": true
        },
        "matchScore": 88,
        "compatibilityBreakdown": {
          "interests": 90,
          "lifestyle": 85,
          "values": 88,
          "personality": 87
        },
        "commonInterests": ["reading", "traveling", "yoga"],
        "availability": {
          "hasUpcomingSlots": true,
          "nextAvailable": "2024-02-10"
        },
        "previousInteraction": null,
        "trustScore": 82
      }
    ],
    "totalMatches": 15,
    "filters": {
      // Applied filters
    }
  }
}
```

---

### Admin Dashboard Routes

Base path: `/admin/dashboard`

#### 1. GET `/admin/dashboard/overview`
**Description**: Get comprehensive dashboard overview

**Middleware**:
- `authenticateToken`
- `checkIsAdmin`
- `validateGetDashboardOverview`

**Query Parameters**:
- `dateRange`: today | week | month | year | custom
- `startDate`: ISO date string (for custom range)
- `endDate`: ISO date string (for custom range)

**Response**:
```json
{
  "success": true,
  "message": "Dashboard overview retrieved",
  "data": {
    "summary": {
      "totalUsers": 5234,
      "activeUsers": 1823,
      "totalDates": 892,
      "successfulDates": 645,
      "revenue": {
        "total": 2345000,
        "monthly": 450000,
        "growth": 12.5
      }
    },
    "metrics": {
      "users": {
        "new": 234,
        "verified": 4890,
        "premium": 1234,
        "growth": 8.3
      },
      "dates": {
        "scheduled": 45,
        "completed": 178,
        "successRate": 72.4,
        "averageRating": 4.2
      },
      "engagement": {
        "dailyActiveUsers": 1523,
        "averageSessionTime": 1234,
        "messagesExchanged": 45678
      }
    },
    "charts": {
      "userGrowth": [
        {
          "date": "2024-01-01",
          "users": 4800,
          "active": 1600
        }
      ],
      "revenueGrowth": [
        {
          "date": "2024-01-01",
          "revenue": 380000
        }
      ],
      "dateSuccess": [
        {
          "date": "2024-01-01",
          "total": 28,
          "successful": 20
        }
      ]
    },
    "alerts": [
      {
        "id": 1,
        "type": "warning",
        "message": "5 users pending verification for over 48 hours",
        "timestamp": "2024-01-20T10:00:00Z"
      }
    ],
    "recentActivity": [
      {
        "id": 1,
        "type": "user_signup",
        "description": "New user registered: john@example.com",
        "timestamp": "2024-01-20T10:00:00Z"
      }
    ]
  }
}
```

---

#### 2. GET `/admin/dashboard/metrics/real-time`
**Description**: Get real-time metrics for live dashboard

**Middleware**:
- `authenticateToken`
- `checkIsAdmin`

**Response**:
```json
{
  "success": true,
  "message": "Real-time metrics retrieved",
  "data": {
    "timestamp": "2024-01-20T10:00:00Z",
    "metrics": {
      "activeUsers": 523,
      "ongoingDates": 12,
      "pendingVerifications": 8,
      "todaySignups": 45,
      "todayRevenue": 85000,
      "systemLoad": {
        "cpu": 45.2,
        "memory": 62.8,
        "apiResponseTime": 125
      }
    },
    "liveEvents": [
      {
        "id": 1,
        "type": "date_started",
        "description": "Date DT-2024-123 started",
        "timestamp": "2024-01-20T09:58:00Z"
      }
    ]
  }
}
```

---

### Admin Notification Routes

Base path: `/admin/notifications`

#### 1. POST `/admin/notifications`
**Description**: Create and send notification

**Middleware**:
- `authenticateToken`
- `checkIsAdmin`
- `validateCreateNotification`

**Request Body**:
```json
{
  "type": "user_notification",
  "recipients": {
    "userIds": [1, 2, 3],
    "segments": ["premium_users"],
    "filters": {
      "city": ["Mumbai", "Delhi"],
      "isVerified": true
    }
  },
  "channels": ["email", "push", "sms"],
  "content": {
    "subject": "Special Valentine's Day Offer!",
    "message": "Get 20% off on premium membership",
    "emailTemplate": "valentine_offer",
    "pushData": {
      "title": "Special Offer!",
      "body": "20% off on premium",
      "action": "VIEW_OFFER"
    },
    "smsText": "Datifyy: Get 20% off on premium membership this Valentine's Day!"
  },
  "scheduling": {
    "sendImmediately": false,
    "scheduledTime": "2024-02-10T10:00:00Z",
    "timezone": "Asia/Kolkata"
  },
  "tracking": {
    "trackOpens": true,
    "trackClicks": true,
    "utmParams": {
      "source": "admin",
      "medium": "email",
      "campaign": "valentine_2024"
    }
  }
}
```

**Response**:
```json
{
  "success": true,
  "message": "Notification created and queued",
  "data": {
    "notificationId": "NOT-2024-001",
    "status": "queued",
    "recipients": {
      "total": 234,
      "byChannel": {
        "email": 234,
        "push": 189,
        "sms": 156
      }
    },
    "scheduledTime": "2024-02-10T10:00:00Z",
    "estimatedDeliveryTime": 300
  }
}
```

---

### Admin User Management Routes

Base path: `/admin/users`

#### 1. GET `/admin/users`
**Description**: Get all users with advanced filtering

**Middleware**:
- `authenticateToken`
- `checkIsAdmin`
- `validateGetUsers`

**Query Parameters**:
- `page`: number (default: 1)
- `limit`: number (default: 20)
- `search`: string (search in name, email)
- `status`: active | inactive | suspended | all
- `verified`: true | false | all
- `gender`: male | female | other | all
- `city`: string
- `ageMin`: number
- `ageMax`: number
- `joinedAfter`: ISO date
- `joinedBefore`: ISO date
- `hasSubscription`: true | false | all
- `sortBy`: createdAt | lastActive | trustScore
- `sortOrder`: asc | desc

**Response**:
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "id": 1,
        "email": "john@example.com",
        "profile": {
          "firstName": "John",
          "lastName": "Doe",
          "age": 28,
          "gender": "male",
          "city": "Mumbai",
          "profilePicture": "url",
          "bio": "Short bio..."
        },
        "status": {
          "isActive": true,
          "isVerified": true,
          "emailVerified": true,
          "phoneVerified": false,
          "isSuspended": false
        },
        "subscription": {
          "type": "premium",
          "validUntil": "2024-12-31",
          "autoRenew": true
        },
        "stats": {
          "trustScore": 85,
          "completedDates": 12,
          "successfulDates": 9,
          "profileCompleteness": 90
        },
        "dates": {
          "joined": "2023-06-15T10:00:00Z",
          "lastActive": "2024-01-19T15:30:00Z",
          "lastProfileUpdate": "2024-01-10T12:00:00Z"
        },
        "flags": {
          "hasReports": false,
          "isVIP": false,
          "requiresModeration": false
        }
      }
    ],
    "pagination": {
      "total": 5234,
      "page": 1,
      "limit": 20,
      "pages": 262
    },
    "filters": {
      // Applied filters
    },
    "summary": {
      "totalActive": 4890,
      "totalVerified": 4567,
      "totalPremium": 1234
    }
  }
}
```

---

#### 2. POST `/admin/users/:userId/ban`
**Description**: Ban/suspend a user

**Middleware**:
- `authenticateToken`
- `checkIsAdmin`
- `requireAdminPermission('USER_BAN')`
- `validateBanUser`

**Request Body**:
```json
{
  "reason": "Inappropriate behavior reported multiple times",
  "duration": "permanent", // or number of days
  "notifyUser": true,
  "internalNotes": "Multiple reports of harassment",
  "evidenceUrls": [
    "https://storage.datifyy.com/reports/123.pdf"
  ]
}
```

**Response**:
```json
{
  "success": true,
  "message": "User banned successfully",
  "data": {
    "userId": 123,
    "banId": "BAN-2024-001",
    "status": "banned",
    "bannedUntil": null, // null for permanent
    "reason": "Inappropriate behavior reported multiple times",
    "bannedBy": "admin@datifyy.com",
    "bannedAt": "2024-01-20T10:00:00Z",
    "userNotified": true,
    "affectedServices": [
      "dating",
      "messaging",
      "events"
    ]
  }
}
```

---

### Admin Revenue Analytics Routes

Base path: `/admin/revenue`

#### 1. GET `/admin/revenue/overview`
**Description**: Get comprehensive revenue analytics

**Middleware**:
- `authenticateToken`
- `checkIsAdmin`
- `requireAdminPermission('REVENUE_VIEW')`

**Query Parameters**:
- `period`: today | week | month | quarter | year | custom
- `startDate`: ISO date (for custom)
- `endDate`: ISO date (for custom)
- `groupBy`: day | week | month
- `currency`: INR (default)

**Response**:
```json
{
  "success": true,
  "message": "Revenue overview retrieved",
  "data": {
    "summary": {
      "totalRevenue": 2345000,
      "periodRevenue": 450000,
      "growth": {
        "amount": 45000,
        "percentage": 11.1
      },
      "transactions": {
        "total": 1234,
        "successful": 1189,
        "failed": 45,
        "refunded": 23
      },
      "averageOrderValue": 1900,
      "conversionRate": 3.4
    },
    "breakdown": {
      "byType": {
        "subscriptions": {
          "amount": 1800000,
          "percentage": 76.8,
          "count": 900
        },
        "oneTime": {
          "amount": 345000,
          "percentage": 14.7,
          "count": 234
        },
        "addOns": {
          "amount": 200000,
          "percentage": 8.5,
          "count": 100
        }
      },
      "byPlan": {
        "basic": {
          "amount": 500000,
          "users": 500,
          "arpu": 1000
        },
        "premium": {
          "amount": 1300000,
          "users": 400,
          "arpu": 3250
        },
        "elite": {
          "amount": 545000,
          "users": 100,
          "arpu": 5450
        }
      }
    },
    "trends": [
      {
        "date": "2024-01-01",
        "revenue": 380000,
        "transactions": 189,
        "newSubscriptions": 45,
        "churn": 12
      }
    ],
    "projections": {
      "nextMonth": 495000,
      "nextQuarter": 1485000,
      "confidence": 0.85
    },
    "topMetrics": {
      "topCities": [
        {
          "city": "Mumbai",
          "revenue": 780000,
          "users": 234
        }
      ],
      "topUsers": [
        {
          "userId": 123,
          "totalSpent": 25000,
          "subscriptionType": "elite"
        }
      ]
    }
  }
}
```

---

#### 2. POST `/admin/revenue/refunds`
**Description**: Process refund for a transaction

**Middleware**:
- `authenticateToken`
- `checkIsAdmin`
- `requireAdminPermission('REVENUE_REFUND')`
- `validateProcessRefund`

**Request Body**:
```json
{
  "transactionId": "TXN-2024-001234",
  "amount": 1999,
  "reason": "Service not delivered",
  "type": "full", // full or partial
  "notifyUser": true,
  "internalNotes": "User reported technical issues during date",
  "approvedBy": "supervisor@datifyy.com"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Refund processed successfully",
  "data": {
    "refundId": "REF-2024-001",
    "transactionId": "TXN-2024-001234",
    "originalAmount": 1999,
    "refundAmount": 1999,
    "status": "completed",
    "processedAt": "2024-01-20T10:00:00Z",
    "processedBy": "admin@datifyy.com",
    "paymentGatewayRef": "pg_ref_123456",
    "userNotified": true,
    "estimatedCredit": "3-5 business days"
  }
}
```

---

### Image Upload Routes

Base path: `/images`

#### 1. POST `/images/upload`
**Description**: Upload profile images

**Middleware**:
- `authenticate()`
- `multerUpload.array('images', 5)`
- `validateImageUpload`

**Request**: Multipart form data
- `images`: Array of image files (max 5)
- `type`: profile | verification | date_feedback
- `metadata`: JSON string with additional info

**Response**:
```json
{
  "success": true,
  "message": "Images uploaded successfully",
  "data": {
    "uploaded": [
      {
        "id": "img_123456",
        "url": "https://storage.datifyy.com/images/img_123456.jpg",
        "thumbnailUrl": "https://storage.datifyy.com/images/img_123456_thumb.jpg",
        "type": "profile",
        "size": 245678,
        "dimensions": {
          "width": 1200,
          "height": 800
        },
        "uploadedAt": "2024-01-20T10:00:00Z"
      }
    ],
    "failed": []
  }
}
```

---

## Common Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  },
  "metadata": {
    "timestamp": "2024-01-20T10:00:00Z",
    "requestId": "req_123456",
    "version": "1.0.0"
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "code": "ERROR_CODE",
    "details": "Detailed error message",
    "field": "fieldName" // For validation errors
  },
  "metadata": {
    "timestamp": "2024-01-20T10:00:00Z",
    "requestId": "req_123456"
  }
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Data retrieved",
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

## Error Handling

### HTTP Status Codes
- **200**: Success
- **201**: Created
- **204**: No Content
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (authentication required)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **409**: Conflict (duplicate resource)
- **422**: Unprocessable Entity
- **429**: Too Many Requests (rate limit)
- **500**: Internal Server Error
- **502**: Bad Gateway
- **503**: Service Unavailable

### Error Codes
- `VALIDATION_ERROR`: Input validation failed
- `AUTH_REQUIRED`: Authentication required
- `INVALID_TOKEN`: Invalid or expired token
- `INSUFFICIENT_PERMISSIONS`: User lacks required permissions
- `RESOURCE_NOT_FOUND`: Requested resource not found
- `DUPLICATE_RESOURCE`: Resource already exists
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_ERROR`: Server error
- `SERVICE_UNAVAILABLE`: Service temporarily unavailable

### Rate Limiting
- Auth endpoints: 5 requests per minute
- API endpoints: 60 requests per minute
- Admin endpoints: 120 requests per minute
- File uploads: 10 requests per hour

### Validation Rules
- Email: Valid email format
- Password: Min 8 chars, 1 uppercase, 1 number, 1 special char
- Phone: Valid Indian mobile number
- Age: Between 18 and 100
- Names: 2-50 characters, letters only
- Bio: Max 500 characters
- Date formats: ISO 8601