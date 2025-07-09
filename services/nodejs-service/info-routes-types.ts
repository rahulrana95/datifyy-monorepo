/**
 * DATIFYY API CONTRACTS
 * 
 * Complete API specification for all endpoints including:
 * - Request/Response schemas
 * - Authentication requirements
 * - Error responses
 * - Example payloads
 * 
 * Base URL: /api/v1
 * Authentication: JWT Token (Header: Authorization: Bearer <token> OR Cookie: token=<token>)
 */

// ============================================================================
// COMMON TYPES & INTERFACES
// ============================================================================

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  requestId?: string;
  timestamp: string;
}

interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    statusCode: number;
    requestId?: string;
    timestamp: string;
    details?: any;
  };
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// ============================================================================
// AUTHENTICATION ROUTES
// ============================================================================

export namespace AuthAPI {
  
  // POST /auth/send-verification-code
  export interface SendVerificationCodeRequest {
    email: string; // Valid email format, max 255 chars
  }
  
  export interface SendVerificationCodeResponse extends ApiResponse {
    data: {
      email: string;
      expiresIn: string; // "5 minutes"
    };
  }
  
  // POST /auth/signup
  export interface SignupRequest {
    email: string; // Valid email, max 255 chars
    password: string; // Min 8 chars, must contain uppercase, lowercase, number, special char
    verificationCode: string; // Exactly 6 digits
  }
  
  export interface SignupResponse extends ApiResponse {
    data: {
      user: {
        id: number;
        email: string;
        isAdmin: boolean;
      };
      token: string;
      expiresAt: string; // ISO date string
    };
  }
  
  // POST /auth/login
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface LoginResponse extends ApiResponse {
    data: {
      user: {
        id: number;
        email: string;
        isAdmin: boolean;
      };
      token: string;
      expiresAt: string;
    };
  }
  
  // POST /auth/logout
  export interface LogoutRequest {} // No body required
  export interface LogoutResponse extends ApiResponse {} // Empty data
  
  // POST /auth/verify-email
  export interface VerifyEmailRequest {
    email: string;
    verificationCode: string; // 6 digits
  }
  
  export interface VerifyEmailResponse extends ApiResponse {} // Empty data
  
  // POST /auth/forgot-password
  export interface ForgotPasswordRequest {
    email: string;
  }
  
  export interface ForgotPasswordResponse extends ApiResponse {} // Security: Always success
  
  // POST /auth/reset-password
  export interface ResetPasswordRequest {
    email: string;
    resetCode: string; // 6 digits
    newPassword: string; // Same validation as signup
  }
  
  export interface ResetPasswordResponse extends ApiResponse {} // Empty data
  
  // POST /auth/validate-token
  export interface ValidateTokenRequest {} // Token in header/cookie
  export interface ValidateTokenResponse extends ApiResponse {
    data: {
      valid: boolean;
      user: {
        id: number;
        email: string;
        isAdmin: boolean;
      };
    };
  }
}

// ============================================================================
// USER PROFILE ROUTES (Requires Authentication)
// ============================================================================

export namespace UserProfileAPI {
  
  export interface UserProfile {
    id: string; // UUID
    firstName: string;
    lastName: string;
    email: string;
    gender: 'male' | 'female' | 'other' | null;
    bio: string | null;
    images: string[] | null; // Array of image URLs
    dob: string | null; // YYYY-MM-DD format
    age?: number; // Calculated field
    isOfficialEmailVerified: boolean;
    isAadharVerified: boolean;
    isPhoneVerified: boolean;
    height: number | null; // In centimeters
    currentCity: string | null;
    hometown: string | null;
    exercise: 'None' | 'Light' | 'Moderate' | 'Heavy' | null;
    educationLevel: 'High School' | 'Undergraduate' | 'Graduate' | 'Postgraduate' | null;
    drinking: 'Never' | 'Occasionally' | 'Regularly' | null;
    smoking: 'Never' | 'Occasionally' | 'Regularly' | null;
    lookingFor: 'Friendship' | 'Casual' | 'Relationship' | null;
    settleDownInMonths: '0-6' | '6-12' | '12-24' | '24+' | null;
    haveKids: boolean | null;
    wantsKids: boolean | null;
    starSign: 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces' | null;
    religion: string | null;
    pronoun: 'He/Him' | 'She/Her' | 'They/Them' | 'Other' | null;
    favInterest: string[] | null;
    causesYouSupport: string[] | null;
    qualityYouValue: string[] | null;
    prompts: object[] | null;
    education: object[] | null;
    profileCompletionPercentage: number; // 0-100
    lastUpdated: string; // ISO date
    createdAt: string; // ISO date
  }
  
  // GET /user-profile
  export interface GetProfileRequest {} // No body, user from token
  export interface GetProfileResponse extends ApiResponse {
    data: UserProfile;
  }
  
  // PUT /user-profile
  export interface UpdateProfileRequest {
    firstName?: string; // Max 50 chars
    lastName?: string; // Max 50 chars
    gender?: 'male' | 'female' | 'other';
    bio?: string; // Max 500 chars
    images?: string[]; // Max 6 URLs
    dob?: string; // YYYY-MM-DD, must be 18+
    height?: number; // 100-250 cm
    currentCity?: string; // Max 100 chars
    hometown?: string; // Max 100 chars
    exercise?: 'None' | 'Light' | 'Moderate' | 'Heavy';
    educationLevel?: 'High School' | 'Undergraduate' | 'Graduate' | 'Postgraduate';
    drinking?: 'Never' | 'Occasionally' | 'Regularly';
    smoking?: 'Never' | 'Occasionally' | 'Regularly';
    lookingFor?: 'Friendship' | 'Casual' | 'Relationship';
    settleDownInMonths?: '0-6' | '6-12' | '12-24' | '24+';
    haveKids?: boolean;
    wantsKids?: boolean;
    starSign?: 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';
    religion?: string; // Max 50 chars
    pronoun?: 'He/Him' | 'She/Her' | 'They/Them' | 'Other';
    favInterest?: string[]; // Max 10 items
    causesYouSupport?: string[]; // Max 10 items
    qualityYouValue?: string[]; // Max 10 items
    prompts?: object[]; // Max 5 items
    education?: object[]; // Max 5 items
  }
  
  export interface UpdateProfileResponse extends ApiResponse {
    data: UserProfile;
  }
  
  // DELETE /user-profile
  export interface DeleteProfileRequest {} // No body
  export interface DeleteProfileResponse extends ApiResponse {} // Empty data
  
  // PATCH /user-profile/avatar
  export interface UpdateAvatarRequest {
    imageUrl: string; // Valid URL
    setAsPrimary?: boolean;
  }
  
  export interface UpdateAvatarResponse extends ApiResponse {
    data: {
      id: string;
      images: string[];
    };
  }
  
  // GET /user-profile/stats
  export interface GetProfileStatsRequest {} // No body
  export interface GetProfileStatsResponse extends ApiResponse {
    data: {
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
    };
  }
}

// ============================================================================
// EVENTS ROUTES
// ============================================================================

export namespace EventsAPI {
  
  export interface Event {
    id: number;
    eventdate: string; // ISO date
    totalmenstickets: number;
    totalfemaletickets: number;
    menticketprice: string; // Decimal string
    womenticketprice: string; // Decimal string
    currencycode: string; // 3 chars (USD, INR)
    mode: 'online' | 'offline';
    type: string; // Max 20 chars
    title: string; // Max 255 chars
    description: string | null;
    photos: string[] | null;
    status: string; // Max 20 chars
    location: string | null;
    duration: string; // Interval
    coverimageurl: string | null;
    maxcapacity: number;
    registrationdeadline: string | null; // ISO date
    refundpolicy: string | null;
    tags: string[] | null;
    socialmedialinks: string[] | null;
    isdeleted: boolean;
    createdat: string; // ISO date
    updatedat: string; // ISO date
    createdby: {
      id: number;
      email: string;
    };
  }
  
  // POST /events
  export interface CreateEventRequest {
    eventdate: string; // ISO format
    totalmenstickets: number; // Min 0
    totalfemaletickets: number; // Min 0
    menticketprice: number; // Min 0
    womenticketprice: number; // Min 0
    currencycode: string; // Exactly 3 chars
    mode: 'online' | 'offline';
    type: string; // Max 20 chars
    title: string; // Max 255 chars, required
    description?: string;
    photos?: string[];
    status: string; // Max 20 chars
    location?: string; // Max 255 chars
    duration: string; // Interval format
    coverimageurl?: string;
    maxcapacity: number; // Min 0
    registrationdeadline?: string; // ISO format
    refundpolicy?: string;
    tags?: string[];
    socialmedialinks?: string[];
    createdby: number; // User ID
  }
  
  export interface CreateEventResponse extends ApiResponse {
    data: Event;
  }
  
  // GET /events
  export interface GetEventsRequest {
    // Query parameters
    createdby?: 'asc' | 'desc';
    updatedby?: 'asc' | 'desc';
  }
  
  export interface GetEventsResponse extends ApiResponse {
    data: Event[];
  }
  
  // GET /events/:eventId
  export interface GetEventRequest {} // eventId in URL params
  export interface GetEventResponse extends ApiResponse {
    data: Event;
  }
  
  // PUT /events/:eventId
  export interface UpdateEventRequest extends Partial<CreateEventRequest> {} // Same as create but all optional
  export interface UpdateEventResponse extends ApiResponse {
    data: Event;
  }
  
  // DELETE /events/:eventId
  export interface DeleteEventRequest {} // eventId in URL params
  export interface DeleteEventResponse extends ApiResponse {} // Empty data
}

// ============================================================================
// ROOMS ROUTES
// ============================================================================

export namespace RoomsAPI {
  
  export interface Room {
    id: number;
    roomId: string;
    userEmail: string;
    eventId: number;
    createdAt: string; // ISO date
    isActive: boolean;
    startsAt: string | null; // ISO date
    duration: number | null; // Minutes
    isCompleted: boolean;
    gender: 'male' | 'female' | null;
    event: {
      id: number;
      title: string;
    };
  }
  
  // POST /events/:eventId/updateRooms
  export interface UpdateRoomsRequest {
    roomAssignments: Array<{
      userEmail: string;
      roomId: string;
    }>;
  }
  
  export interface UpdateRoomsResponse extends ApiResponse {
    data: {
      results: Array<{
        userEmail: string;
        roomId: string;
        success?: boolean;
        error?: string;
        message?: string;
      }>;
    };
  }
  
  // GET /events/:eventId/rooms
  export interface GetRoomsRequest {} // eventId in URL params
  export interface GetRoomsResponse extends ApiResponse {
    data: {
      rooms: Room[];
    };
  }
  
  // POST /events/:eventId/rooms
  export interface CreateRoomRequest {
    roomId: string;
    userEmail: string;
    startsAt?: string; // ISO date
    duration?: number; // Minutes
  }
  
  export interface CreateRoomResponse extends ApiResponse {
    data: Room;
  }
  
  // GET /events/:eventId/rooms/:email
  export interface GetRoomByEmailRequest {} // eventId and email in URL params
  export interface GetRoomByEmailResponse extends ApiResponse {
    data: Room;
  }
  
  // PUT /rooms/:id/status
  export interface UpdateRoomStatusRequest {
    isActive?: boolean;
    isCompleted?: boolean;
  }
  
  export interface UpdateRoomStatusResponse extends ApiResponse {
    data: Room;
  }
  
  // DELETE /rooms/:id
  export interface DeleteRoomRequest {} // Room ID in URL params
  export interface DeleteRoomResponse extends ApiResponse {} // Empty data
}

// ============================================================================
// VIDEO CHAT ROUTES
// ============================================================================

export namespace VideoChatAPI {
  
  export interface VideoChatSession {
    sessionId: number;
    eventId: number;
    createdAt: string; // ISO date
    manEmail: string;
    womanEmail: string;
    status: 'available' | 'busy' | 'completed' | 'upcoming';
    event: {
      id: number;
      title: string;
    };
  }
  
  // GET /events/:eventId/live/:email/next-user-to-match
  export interface GetNextAvailableUserRequest {} // eventId and email in URL params
  export interface GetNextAvailableUserResponse extends ApiResponse {
    data: {
      nextUser: RoomsAPI.Room;
    };
  }
  
  // POST /events/:eventId/create-video-chat-session
  export interface CreateVideoChatSessionsRequest {} // eventId in URL params
  export interface CreateVideoChatSessionsResponse extends ApiResponse {
    data: {
      sessions: VideoChatSession[];
    };
  }
  
  // GET /events/:eventId/video-chat-sessions
  export interface GetVideoChatSessionsRequest {} // eventId in URL params
  export interface GetVideoChatSessionsResponse extends ApiResponse {
    data: {
      sessions: VideoChatSession[];
    };
  }
  
  // PUT /events/:eventId/video-chat-session
  export interface UpdateVideoChatSessionRequest {
    sessionId: number;
    status?: 'available' | 'busy' | 'completed';
    manEmail?: string;
    womanEmail?: string;
    eventId?: number;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface UpdateVideoChatSessionResponse extends ApiResponse {} // Empty data
}

// ============================================================================
// PARTNER PREFERENCES ROUTES (Requires Authentication)
// ============================================================================

export namespace PartnerPreferencesAPI {
  
  export interface PartnerPreferences {
    id: number;
    genderPreference: 'Both' | 'Male' | 'Female' | null;
    minAge: number | null;
    maxAge: number | null;
    minHeight: number | null; // cm
    maxHeight: number | null; // cm
    religion: string | null;
    educationLevel: string[] | null;
    profession: string[] | null;
    minIncome: string | null; // Decimal
    maxIncome: string | null; // Decimal
    currency: string | null; // 3 chars
    locationPreference: object | null;
    smokingPreference: 'No' | 'Yes' | 'Sometimes' | null;
    drinkingPreference: 'No' | 'Yes' | 'Sometimes' | null;
    maritalStatus: 'Single' | 'Divorced' | 'Widowed' | null;
    childrenPreference: 'Doesnt matter' | 'Yes' | 'No' | null;
    religionPreference: string | null;
    ethnicityPreference: string | null;
    castePreference: string | null;
    partnerDescription: string | null;
    hobbies: string[] | null;
    interests: string[] | null;
    booksReading: string[] | null;
    music: string[] | null;
    movies: string[] | null;
    travel: string[] | null;
    sports: string[] | null;
    personalityTraits: string[] | null;
    relationshipGoals: string | null;
    lifestylePreference: object | null;
    locationPreferenceRadius: number | null;
    whatOtherPersonShouldKnow: string | null;
    activityLevel: string | null;
    petPreference: string | null;
    // Compatibility scores
    religionCompatibilityScore: number | null;
    incomeCompatibilityScore: number | null;
    educationCompatibilityScore: number | null;
    appearanceCompatibilityScore: number | null;
    personalityCompatibilityScore: number | null;
    valuesCompatibilityScore: number | null;
    matchingScore: number | null;
    createdAt: string; // ISO date
    updatedAt: string; // ISO date
  }
  
  // GET /user/partner-preferences
  export interface GetPartnerPreferencesRequest {} // User from token
  export interface GetPartnerPreferencesResponse extends ApiResponse {
    data: PartnerPreferences | null;
  }
  
  // PUT /user/partner-preferences
  export interface UpdatePartnerPreferencesRequest extends Partial<Omit<PartnerPreferences, 'id' | 'createdAt' | 'updatedAt'>> {}
  export interface UpdatePartnerPreferencesResponse extends ApiResponse {
    data: PartnerPreferences;
  }
}

// ============================================================================
// WAITLIST ROUTES
// ============================================================================

export namespace WaitlistAPI {
  
  export interface WaitlistEntry {
    id: number;
    name: string;
    email: string;
    phoneNumber: string | null;
    status: 'waiting' | 'contacted' | 'converted' | null;
    preferredDate: string | null; // ISO date
    ipAddress: string | null;
    userAgent: string | null;
    source: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    createdAt: string; // Unix timestamp as string
    createdAtUnix: string | null;
  }
  
  // POST /waitlist
  export interface AddToWaitlistRequest {
    name: string;
    email: string; // Required, unique
    phoneNumber?: string;
    preferredDate?: string; // ISO date
  }
  
  export interface AddToWaitlistResponse extends ApiResponse {} // Empty data
  
  // GET /waitlist-count
  export interface GetWaitlistCountRequest {} // No auth required
  export interface GetWaitlistCountResponse extends ApiResponse {
    data: {
      totalCount: number;
    };
  }
  
  // GET /waitlist-data (Requires Admin Auth)
  export interface GetWaitlistDataRequest {} // Admin only
  export interface GetWaitlistDataResponse extends ApiResponse {
    data: {
      data: WaitlistEntry[];
      counts: {
        last15Min: number;
        last60Min: number;
        last6Hrs: number;
        last12Hrs: number;
        last24Hrs: number;
        last7Days: number;
        last30Days: number;
        last60Days: number;
        last3Months: number;
        last6Months: number;
        lastYear: number;
      };
      totalCount: number;
    };
  }
}

// ============================================================================
// ADMIN ROUTES (Requires Admin Authentication)
// ============================================================================

export namespace AdminAPI {
  
  // GET /admin/tables
  export interface GetTablesRequest {} // Admin auth required
  export interface GetTablesResponse extends ApiResponse {
    data: {
      tables: string[];
      count: number;
    };
  }
  
  // GET /admin/enums
  export interface GetEnumsRequest {} // Admin auth required
  export interface GetEnumsResponse extends ApiResponse {
    data: {
      enums: Array<{
        enumName: string;
        enumValues: string[];
      }>;
      count: number;
    };
  }
  
  // PUT /admin/enums
  export interface UpdateEnumsRequest {
    enums: Array<{
      name: string; // Valid identifier format
      values: string[]; // Max 255 chars each
    }>;
  }
  
  export interface UpdateEnumsResponse extends ApiResponse {
    data: {
      results: Array<{
        name: string;
        message?: string;
        updatedValues?: string[];
      }>;
      summary: {
        total: number;
        succeeded: number;
        failed: number;
      };
    };
  }
  
  // GET /admin/email-logs
  export interface GetEmailLogsRequest {} // Admin auth required
  export interface GetEmailLogsResponse extends ApiResponse {
    data: {
      emailStatuses: Array<{
        email: string;
        logs: Array<{
          id: number;
          email: string;
          status: string;
          sentAt: string; // ISO date
        }>;
      }>;
      count: number;
    };
  }
  
  // POST /admin/send-bulk-emails
  export interface SendBulkEmailsRequest {
    emails: string[]; // Array of email addresses
    emailType: 'forgotPassword' | 'verifyEmail' | 'inviteEmailToJoin';
  }
  
  export interface SendBulkEmailsResponse extends ApiResponse {
    data: {
      failedEmails: Array<{
        email: string;
        error: string;
      }>;
    };
  }
}

// ============================================================================
// EMAIL ROUTES
// ============================================================================

export namespace EmailAPI {
  
  // POST /send-emails
  export interface SendSingleEmailRequest {
    to: Array<{
      email: string;
      name: string;
    }>;
    subject?: string; // Optional if type is provided
    text?: string;
    html?: string;
    type: 'forgotPassword' | 'verifyEmail' | 'inviteEmailToJoin';
  }
  
  export interface SendSingleEmailResponse extends ApiResponse {
    data: {
      result: any; // MailerSend response
    };
  }
  
  // POST /verify-email-code
  export interface VerifyEmailCodeRequest {
    email: string;
    verificationCode: string; // 6 digits
  }
  
  export interface VerifyEmailCodeResponse extends ApiResponse {} // Empty data
  
  // POST /forgot-password/send-verification-code
  export interface SendForgotPasswordCodeRequest {
    email: string;
  }
  
  export interface SendForgotPasswordCodeResponse extends ApiResponse {} // Empty data
  
  // POST /forgot-password/verify-code
  export interface VerifyForgotPasswordCodeRequest {
    email: string;
    verificationCode: string; // 6 digits
  }
  
  export interface VerifyForgotPasswordCodeResponse extends ApiResponse {} // Empty data
  
  // POST /forgot-password/reset-password
  export interface ResetForgotPasswordRequest {
    email: string;
    password: string; // New password with validation
  }
  
  export interface ResetForgotPasswordResponse extends ApiResponse {} // Empty data
}

// ============================================================================
// UTILITY ROUTES
// ============================================================================

export namespace UtilityAPI {
  
  // GET /enums
  export interface GetEnumValuesRequest {} // No auth required
  export interface GetEnumValuesResponse extends ApiResponse {
    data: {
      [fieldName: string]: Array<{
        label: string;
        id: string;
      }>;
    };
  }
  
  // GET /health
  export interface HealthCheckRequest {} // No auth required
  export interface HealthCheckResponse {
    status: 'ok' | 'error';
    timestamp: string;
    uptime: number;
    environment: string;
    version: string;
    database: string;
    memory: {
      used: string;
      total: string;
    };
  }
  
  // GET /routes
  export interface GetRoutesRequest {} // No auth required
  export interface GetRoutesResponse extends ApiResponse {
    data: {
      [category: string]: {
        [endpoint: string]: string; // Description
      };
    };
    totalEndpoints: number;
  }
  
  // DELETE /user/delete
  export interface DeleteUserRequest {} // User from token
  export interface DeleteUserResponse extends ApiResponse {} // Empty data
}

// ============================================================================
// ERROR CODES REFERENCE
// ============================================================================

export enum ErrorCodes {
  // Authentication
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS', // 401
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS', // 409
  USER_NOT_FOUND = 'USER_NOT_FOUND', // 404
  WEAK_PASSWORD = 'WEAK_PASSWORD', // 400
  INVALID_EMAIL = 'INVALID_EMAIL', // 400
  VERIFICATION_CODE_EXPIRED = 'VERIFICATION_CODE_EXPIRED', // 400
  INVALID_VERIFICATION_CODE = 'INVALID_VERIFICATION_CODE', // 400
  TOKEN_ERROR = 'TOKEN_ERROR', // 401
  
  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR', // 400
  
  // System
  INTERNAL_ERROR = 'INTERNAL_SERVER_ERROR', // 500
  DATABASE_ERROR = 'DATABASE_ERROR', // 500
  ROUTE_NOT_FOUND = 'ROUTE_NOT_FOUND', // 404
  
  // Authorization
  AUTH_REQUIRED = 'AUTH_REQUIRED', // 401
  ADMIN_REQUIRED = 'ADMIN_REQUIRED', // 403
  INSUFFICIENT_ROLE = 'INSUFFICIENT_ROLE', // 403
  
  // Rate Limiting
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS', // 429
  
  // Resources
  DUPLICATE_RESOURCE = 'DUPLICATE_RESOURCE', // 409
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND', // 404
}

// ============================================================================
// EXAMPLE USAGE
// ============================================================================

/*
// Example Frontend Usage:

// Authentication
const signupData: AuthAPI.SignupRequest = {
  email: 'user@example.com',
  password: 'SecurePass123!',
  verificationCode: '123456'
};

const signupResponse: AuthAPI.SignupResponse = await api.post('/auth/signup', signupData);

// Profile Update
const profileUpdate: UserProfileAPI.UpdateProfileRequest = {
  firstName: 'John',
  lastName: 'Doe',
  bio: 'Looking for meaningful connections',
  currentCity: 'Mumbai',
  lookingFor: 'Relationship'
};

const profileResponse: UserProfileAPI.UpdateProfileResponse = await api.put('/user-profile', profileUpdate);

// Error Handling
try {
  await api.post('/auth/login', loginData);
} catch (error) {
  if (error.response?.data?.error?.code === ErrorCodes.INVALID_CREDENTIALS) {
    showError('Invalid email or password');
  }
}
*/