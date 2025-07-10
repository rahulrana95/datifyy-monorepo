# Services Architecture & Boundaries - Datifyy Dating App

## Overview
Datifyy follows a modular service-oriented architecture with clear domain boundaries, dependency injection, and separation of concerns. The architecture supports both current monolithic deployment and future microservices migration.

## Service Architecture Patterns

### 1. Layered Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     HTTP Layer                              │
│  Controllers (Request/Response handling)                    │
├─────────────────────────────────────────────────────────────┤
│                   Application Layer                         │
│  Services (Business Logic Orchestration)                   │
├─────────────────────────────────────────────────────────────┤
│                    Domain Layer                             │
│  Models, DTOs, Mappers (Business Rules)                    │
├─────────────────────────────────────────────────────────────┤
│                 Infrastructure Layer                        │
│  Repositories, External APIs, Storage                      │
└─────────────────────────────────────────────────────────────┘
```

### 2. Service Boundaries & Responsibilities

#### Core Domain Services

##### Authentication Service
```typescript
// src/domain/auth/AuthService.ts
interface IAuthService {
  // User Registration
  sendVerificationCode(email: string): Promise<void>;
  signup(signupData: SignupRequest): Promise<AuthResponse>;
  verifyEmail(email: string, code: string): Promise<void>;
  
  // Authentication
  login(credentials: LoginRequest): Promise<AuthResponse>;
  logout(sessionId: string): Promise<void>;
  refreshToken(token: string): Promise<AuthResponse>;
  validateToken(token: string): Promise<TokenValidationResponse>;
  
  // Password Management
  forgotPassword(email: string): Promise<void>;
  resetPassword(resetData: ResetPasswordRequest): Promise<void>;
  changePassword(userId: number, oldPassword: string, newPassword: string): Promise<void>;
}
```

**Responsibilities:**
- User registration and email verification
- Login/logout functionality
- JWT token management
- Password reset workflows
- Session management

**Dependencies:**
- `IUserRepository` (data access)
- `IVerificationCodeService` (Redis-based verification)
- `IEmailService` (email notifications)
- `IPasswordService` (hashing and validation)

##### User Profile Service
```typescript
// src/modules/userProfile/services/IUserProfileService.ts
interface IUserProfileService {
  // Profile Management
  getUserProfile(userId: number): Promise<UserProfileResponseDto>;
  updateUserProfile(userId: number, updateData: UpdateUserProfileRequestDto): Promise<UserProfileResponseDto>;
  deleteUserProfile(userId: number): Promise<void>;
  
  // Profile Enhancement
  updateUserAvatar(userId: number, imageUrl: string): Promise<UserProfileResponseDto>;
  getUserProfileStats(userId: number): Promise<UserProfileStatsDto>;
  validateProfileCompleteness(userId: number): Promise<ProfileCompletenessDto>;
  
  // Admin Operations
  updateVerificationStatus(userId: number, type: VerificationType, status: boolean): Promise<UserProfileResponseDto>;
}
```

**Responsibilities:**
- Complete user profile management
- Profile completion tracking
- Image and media handling
- Profile verification status
- Profile analytics and recommendations

**Dependencies:**
- `IUserProfileRepository`
- `UserProfileMapper`
- `IStorageService` (image upload)
- `IValidationService`

##### Partner Preferences Service
```typescript
// src/modules/partnerPreferences/services/IPartnerPreferencesService.ts
interface IPartnerPreferencesService {
  // Preference Management
  getPartnerPreferences(userId: number): Promise<PartnerPreferencesResponseDto>;
  updatePartnerPreferences(userId: number, preferences: UpdatePartnerPreferencesRequestDto): Promise<PartnerPreferencesResponseDto>;
  
  // Matching Integration
  calculateCompatibilityScore(user1Id: number, user2Id: number): Promise<CompatibilityScore>;
  findPotentialMatches(userId: number, criteria: MatchingCriteria): Promise<MatchResponse>;
  
  // Preference Analytics
  getPreferenceInsights(userId: number): Promise<PreferenceInsightsDto>;
  getMarketAnalysis(preferences: PartnerPreferences): Promise<MarketAnalysisDto>;
}
```

**Responsibilities:**
- Partner preference management
- Compatibility scoring algorithms
- Match finding and ranking
- Preference-based analytics
- Market insights for users

**Dependencies:**
- `IPartnerPreferencesRepository`
- `IMatchingAlgorithmService`
- `IUserProfileService`
- `IAnalyticsService`

##### Event Management Service
```typescript
// src/modules/events/services/IEventService.ts
interface IEventService {
  // Event Lifecycle
  createEvent(eventData: CreateEventRequest): Promise<EventResponseDto>;
  updateEvent(eventId: number, updateData: UpdateEventRequest): Promise<EventResponseDto>;
  deleteEvent(eventId: number): Promise<void>;
  
  // Event Discovery
  getEvents(filters: EventFilters, pagination: PaginationRequest): Promise<PaginatedEventResponse>;
  getEventById(eventId: number): Promise<EventResponseDto>;
  getUserEvents(userId: number): Promise<EventResponseDto[]>;
  
  // Registration Management
  registerForEvent(userId: number, eventId: number, ticketType: TicketType): Promise<RegistrationResponse>;
  cancelRegistration(userId: number, eventId: number): Promise<void>;
  
  // Event Operations
  startEvent(eventId: number): Promise<void>;
  endEvent(eventId: number): Promise<EventSummaryDto>;
}
```

**Responsibilities:**
- Event creation and management
- Event discovery and filtering
- Registration and ticketing
- Event lifecycle orchestration
- Capacity and waitlist management

**Dependencies:**
- `IEventRepository`
- `ITicketPurchaseRepository`
- `IPaymentService`
- `INotificationService`

##### Live Session Service
```typescript
// src/modules/liveSessions/services/ILiveSessionService.ts
interface ILiveSessionService {
  // Session Management
  createSessionRooms(eventId: number): Promise<SessionRoomsResponse>;
  joinSession(userId: number, eventId: number): Promise<SessionJoinResponse>;
  leaveSession(userId: number, sessionId: string): Promise<void>;
  
  // Session Orchestration
  startSpeedDatingRounds(eventId: number): Promise<void>;
  rotatePartners(eventId: number): Promise<RotationResponse>;
  endSession(eventId: number): Promise<SessionSummaryDto>;
  
  // Real-time Features
  getNextAvailableUser(eventId: number, currentUserEmail: string): Promise<UserMatchResponse>;
  submitSessionFeedback(sessionId: string, feedback: SessionFeedback): Promise<void>;
  
  // Session Analytics
  getSessionMetrics(eventId: number): Promise<SessionMetricsDto>;
}
```

**Responsibilities:**
- Video chat room management
- Speed dating orchestration
- Real-time partner matching
- Session quality monitoring
- Participant feedback collection

**Dependencies:**
- `IRoomRepository`
- `IVideoChatSessionRepository`
- `IVideoServiceProvider`
- `IEventService`

#### Infrastructure Services

##### Storage Service
```typescript
// src/infrastructure/storage/IStorageService.ts
interface IStorageService {
  // File Operations
  upload(file: Buffer, options: StorageUploadOptions): Promise<StorageUploadResult>;
  download(key: string): Promise<Buffer>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  
  // Batch Operations
  uploadBatch(files: BatchUploadRequest[]): Promise<BatchUploadResult>;
  deleteBatch(keys: string[]): Promise<BatchDeleteResult>;
  
  // URL Generation
  generateUploadUrl(fileName: string, contentType: string): Promise<PresignedUploadResult>;
  generateDownloadUrl(key: string, expiresIn?: number): Promise<string>;
  
  // Management
  listFiles(options: StorageListOptions): Promise<StorageListResult>;
  getFileInfo(key: string): Promise<StorageFileInfo>;
  healthCheck(): Promise<StorageHealthCheck>;
}
```

**Implementation:** Cloudflare R2 with automatic failover to AWS S3

##### Email Service
```typescript
// src/infrastructure/email/IEmailService.ts
interface IEmailService {
  // Transactional Emails
  sendVerificationEmail(to: string, code: string): Promise<EmailResponse>;
  sendWelcomeEmail(to: string, userName: string): Promise<EmailResponse>;
  sendPasswordResetEmail(to: string, code: string): Promise<EmailResponse>;
  
  // Event Notifications
  sendEventReminder(to: string, eventDetails: EventDetails): Promise<EmailResponse>;
  sendMatchNotification(to: string, matchDetails: MatchDetails): Promise<EmailResponse>;
  
  // Marketing Campaigns
  sendBulkEmail(campaign: EmailCampaign): Promise<BulkEmailResponse>;
  
  // Email Management
  trackEmailStatus(emailId: string): Promise<EmailStatus>;
  getEmailAnalytics(timeRange: TimeRange): Promise<EmailAnalytics>;
}
```

**Implementation:** MailerSend with fallback to Brevo/SendGrid

##### Notification Service
```typescript
// src/infrastructure/notifications/INotificationService.ts
interface INotificationService {
  // Push Notifications
  sendPushNotification(userId: number, notification: PushNotification): Promise<void>;
  sendBulkPushNotification(userIds: number[], notification: PushNotification): Promise<BulkNotificationResult>;
  
  // SMS Notifications
  sendSMSVerification(phoneNumber: string, code: string): Promise<SMSResponse>;
  sendSMSNotification(phoneNumber: string, message: string): Promise<SMSResponse>;
  
  // In-App Notifications
  createInAppNotification(userId: number, notification: InAppNotification): Promise<void>;
  markNotificationAsRead(userId: number, notificationId: string): Promise<void>;
  getUserNotifications(userId: number, pagination: PaginationRequest): Promise<NotificationResponse>;
}
```

##### Payment Service
```typescript
// src/infrastructure/payments/IPaymentService.ts
interface IPaymentService {
  // Payment Processing
  createPaymentIntent(amount: Money, metadata: PaymentMetadata): Promise<PaymentIntent>;
  confirmPayment(paymentIntentId: string, paymentMethod: PaymentMethod): Promise<PaymentResult>;
  capturePayment(paymentIntentId: string): Promise<PaymentResult>;
  
  // Refund Management
  createRefund(transactionId: string, amount?: Money, reason?: string): Promise<RefundResult>;
  getRefundStatus(refundId: string): Promise<RefundStatus>;
  
  // Subscription Management (Future)
  createSubscription(userId: number, planId: string): Promise<SubscriptionResult>;
  cancelSubscription(subscriptionId: string): Promise<void>;
  
  // Analytics
  getTransactionHistory(userId: number, pagination: PaginationRequest): Promise<TransactionHistoryResponse>;
  getPaymentAnalytics(timeRange: TimeRange): Promise<PaymentAnalytics>;
}
```

### 3. Dependency Injection System

#### Container Configuration
```typescript
// src/infrastructure/di/Container.ts
export class Container {
  private services: Map<string, any> = new Map();
  private factories: Map<string, ServiceFactory<any>> = new Map();

  register<T>(name: string, factory: ServiceFactory<T>): void {
    this.factories.set(name, factory);
  }

  async resolve<T>(name: string): Promise<T> {
    if (this.services.has(name)) {
      return this.services.get(name);
    }

    const factory = this.factories.get(name);
    if (!factory) {
      throw new Error(`Service ${name} not registered`);
    }

    const instance = await factory();
    this.services.set(name, instance);
    return instance;
  }

  private registerServices(): void {
    // Infrastructure services
    this.register("Config", () => Config.getInstance());
    this.register("Logger", () => Logger.getInstance());
    this.register("DatabaseConnection", async () => {
      const config = await this.resolve<Config>("Config");
      return new DatabaseConnection(config, this.logger);
    });

    // Domain services
    this.register("AuthService", async () => {
      const userRepo = await this.resolve<IUserRepository>("UserRepository");
      const emailService = await this.resolve<IEmailService>("EmailService");
      const verificationService = await this.resolve<IVerificationCodeService>("VerificationCodeService");
      return new AuthService(userRepo, emailService, verificationService);
    });

    this.register("UserProfileService", async () => {
      const userProfileRepo = await this.resolve<IUserProfileRepository>("UserProfileRepository");
      const mapper = await this.resolve<UserProfileMapper>("UserProfileMapper");
      return new UserProfileService(userProfileRepo, mapper);
    });

    // Infrastructure services
    this.register("StorageService", () => {
      const config = Config.getInstance().get('storage');
      return new CloudflareR2Provider(config);
    });
  }
}
```

### 4. Service Communication Patterns

#### Synchronous Communication
```typescript
// Service-to-service communication within the same process
export class EventService {
  constructor(
    private readonly eventRepository: IEventRepository,
    private readonly userProfileService: IUserProfileService, // Direct dependency
    private readonly paymentService: IPaymentService,
    private readonly notificationService: INotificationService
  ) {}

  async registerForEvent(userId: number, eventId: number): Promise<RegistrationResponse> {
    // 1. Validate user profile completeness
    const profileCompletion = await this.userProfileService.validateProfileCompleteness(userId);
    if (!profileCompletion.isComplete) {
      throw new ProfileIncompleteError('Profile must be complete to register for events');
    }

    // 2. Process payment
    const paymentResult = await this.paymentService.createPaymentIntent(amount, metadata);
    
    // 3. Send confirmation
    await this.notificationService.sendEventConfirmation(userId, eventId);
    
    return registrationResponse;
  }
}
```

#### Asynchronous Communication (Event-Driven)
```typescript
// Domain events for loose coupling
export class UserProfileService {
  async updateUserProfile(userId: number, updateData: UpdateProfileRequest): Promise<UserProfileResponseDto> {
    const updatedProfile = await this.userProfileRepository.update(profileId, updateData);
    
    // Emit domain event for other services to react
    await this.eventBus.publish(new ProfileUpdatedEvent({
      userId,
      profileId: updatedProfile.id,
      changedFields: Object.keys(updateData),
      completionPercentage: updatedProfile.completionPercentage,
      timestamp: new Date()
    }));
    
    return this.mapper.toResponseDto(updatedProfile);
  }
}

// Event handlers in other services
export class MatchingService {
  @EventHandler(ProfileUpdatedEvent)
  async handleProfileUpdated(event: ProfileUpdatedEvent): Promise<void> {
    // Recalculate matches if profile significantly changed
    if (event.completionPercentage > 80) {
      await this.recalculateMatches(event.userId);
    }
  }
}
```

### 5. Error Handling & Resilience

#### Service-Level Error Handling
```typescript
export abstract class BaseService {
  protected readonly logger: Logger;
  
  constructor(logger?: Logger) {
    this.logger = logger || Logger.getInstance();
  }
  
  protected async executeWithRetry<T>(
    operation: () => Promise<T>,
    operationName: string,
    maxRetries: number = 3
  ): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        this.logger.warn(`${operationName} failed on attempt ${attempt}`, {
          error: error instanceof Error ? error.message : 'Unknown error',
          attempt,
          maxRetries
        });
        
        if (attempt === maxRetries) {
          this.logger.error(`${operationName} failed after ${maxRetries} attempts`, { error });
          throw error;
        }
        
        // Exponential backoff
        await this.sleep(Math.pow(2, attempt) * 1000);
      }
    }
    
    throw new Error(`Unreachable code in ${operationName}`);
  }
  
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

#### Circuit Breaker Pattern
```typescript
export class CircuitBreaker {
  private failures = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private nextAttempt = Date.now();
  
  constructor(
    private readonly failureThreshold: number = 5,
    private readonly recoveryTimeout: number = 60000 // 1 minute
  ) {}
  
  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new ServiceUnavailableError('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
    }
    
    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private onSuccess(): void {
    this.failures = 0;
    this.state = 'CLOSED';
  }
  
  private onFailure(): void {
    this.failures++;
    if (this.failures >= this.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.recoveryTimeout;
    }
  }
}
```

### 6. Performance & Caching

#### Service-Level Caching
```typescript
export class UserProfileService extends BaseService {
  constructor(
    private readonly userProfileRepository: IUserProfileRepository,
    private readonly cacheService: ICacheService,
    private readonly mapper: UserProfileMapper
  ) {
    super();
  }
  
  async getUserProfile(userId: number): Promise<UserProfileResponseDto> {
    const cacheKey = `user:profile:${userId}`;
    
    // Try cache first
    const cached = await this.cacheService.get<UserProfileResponseDto>(cacheKey);
    if (cached) {
      this.logger.debug('Profile served from cache', { userId });
      return cached;
    }
    
    // Fetch from database
    const profile = await this.userProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new UserNotFoundError('User profile not found');
    }
    
    const responseDto = await this.mapper.toResponseDto(profile);
    
    // Cache for 15 minutes
    await this.cacheService.set(cacheKey, responseDto, 15 * 60);
    
    return responseDto;
  }
  
  async updateUserProfile(userId: number, updateData: UpdateUserProfileRequestDto): Promise<UserProfileResponseDto> {
    const result = await this.userProfileRepository.update(profileId, updateData);
    
    // Invalidate cache
    await this.cacheService.delete(`user:profile:${userId}`);
    
    return this.mapper.toResponseDto(result);
  }
}
```

### 7. Service Health & Monitoring

#### Health Check Service
```typescript
export class HealthCheckService {
  constructor(
    private readonly databaseConnection: DatabaseConnection,
    private readonly redisConnection: RedisConnection,
    private readonly storageService: IStorageService,
    private readonly emailService: IEmailService
  ) {}
  
  async getHealthStatus(): Promise<HealthStatus> {
    const checks = await Promise.allSettled([
      this.checkDatabase(),
      this.checkRedis(),
      this.checkStorage(),
      this.checkEmail()
    ]);
    
    return {
      status: checks.every(check => check.status === 'fulfilled') ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      checks: {
        database: this.getCheckResult(checks[0]),
        redis: this.getCheckResult(checks[1]),
        storage: this.getCheckResult(checks[2]),
        email: this.getCheckResult(checks[3])
      }
    };
  }
  
  private async checkDatabase(): Promise<ServiceHealth> {
    const start = Date.now();
    try {
      await this.databaseConnection.query('SELECT 1');
      return {
        status: 'healthy',
        responseTime: Date.now() - start,
        message: 'Database connection active'
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        responseTime: Date.now() - start,
        message: error instanceof Error ? error.message : 'Database connection failed'
      };
    }
  }
}
```

### 8. Future Migration Strategy

#### Microservices Preparation
The current service architecture is designed to support