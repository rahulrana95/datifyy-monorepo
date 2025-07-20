# Architecture Overview & Design Patterns - Datifyy Dating App

## System Architecture Overview

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                   Frontend Layer                                   │
│  React/Next.js App + Admin Dashboard + Mobile App (Future)                        │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                          │ HTTP/HTTPS
                                          ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                               API Gateway / Load Balancer                          │
│  Rate Limiting + CORS + Security Headers + Request Routing                        │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                Application Server                                   │
│                            Node.js + Express + TypeScript                          │
├─────────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Auth Module   │  │  Profile Module │  │  Events Module  │  │  Payment Module │ │
│  │                 │  │                 │  │                 │  │                 │ │
│  │ • JWT Auth      │  │ • User Profiles │  │ • Speed Dating  │  │ • Stripe/Razorpay│ │
│  │ • Email Verify  │  │ • Partner Prefs │  │ • Live Sessions │  │ • Transactions  │ │
│  │ • Session Mgmt  │  │ • Photo Upload  │  │ • Video Rooms   │  │ • Refunds       │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ Matching Engine │  │ Notification    │  │  Admin Panel    │  │  Analytics      │ │
│  │                 │  │                 │  │                 │  │                 │ │
│  │ • Compatibility │  │ • Email Campaigns│ │ • User Mgmt     │  │ • User Behavior │ │
│  │ • AI Algorithm  │  │ • Push Notifs   │  │ • Content Mod   │  │ • Event Metrics │ │
│  │ • Preferences   │  │ • SMS Alerts    │  │ • Event Mgmt    │  │ • Revenue Track │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                               Infrastructure Layer                                 │
├─────────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   PostgreSQL    │  │      Redis      │  │  Cloudflare R2  │  │  External APIs  │ │
│  │                 │  │                 │  │                 │  │                 │ │
│  │ • User Data     │  │ • Sessions      │  │ • Images/Media  │  │ • MailerSend    │ │
│  │ • Events        │  │ • Caching       │  │ • File Storage  │  │ • Google Meet   │ │
│  │ • Transactions  │  │ • Verification  │  │ • CDN           │  │ • Payment Gateways│ │
│  │ • Analytics     │  │ • Rate Limiting │  │ • Backups       │  │ • SMS Services  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

## Directory Structure & Organization

### Current Monorepo Structure
```
datifyy-monorepo/
├── apps/
│   └── frontend/                    # React/Next.js frontend application
│       ├── src/
│       │   ├── components/         # Reusable UI components
│       │   ├── pages/             # Next.js pages/routes
│       │   ├── hooks/             # Custom React hooks
│       │   ├── store/             # State management (Redux/Zustand)
│       │   ├── services/          # API client services
│       │   └── utils/             # Frontend utilities
│       ├── public/                # Static assets
│       └── package.json
│
├── services/
│   └── nodejs-service/            # Main backend API service
│       ├── src/
│       │   ├── controllers/       # HTTP request handlers
│       │   ├── services/          # Business logic layer
│       │   ├── repositories/      # Data access layer
│       │   ├── models/            # TypeORM entities
│       │   │   └── entities/      # Database entity definitions
│       │   ├── routes/            # API route definitions
│       │   ├── middleware/        # Express middleware
│       │   ├── infrastructure/    # Cross-cutting concerns
│       │   │   ├── config/        # Configuration management
│       │   │   ├── database/      # Database connection
│       │   │   ├── logging/       # Logging service
│       │   │   ├── storage/       # File storage providers
│       │   │   ├── email/         # Email service providers
│       │   │   ├── middleware/    # Infrastructure middleware
│       │   │   └── utils/         # Infrastructure utilities
│       │   ├── modules/           # Feature-based modules
│       │   │   ├── auth/          # Authentication module
│       │   │   ├── userProfile/   # User profile management
│       │   │   ├── partnerPreferences/ # Partner matching preferences
│       │   │   ├── events/        # Event management
│       │   │   ├── liveSessions/  # Real-time dating sessions
│       │   │   ├── payments/      # Payment processing
│       │   │   ├── notifications/ # Email/SMS/Push notifications
│       │   │   └── admin/         # Admin panel functionality
│       │   ├── domain/            # Domain models and business rules
│       │   │   ├── entities/      # Domain entities
│       │   │   ├── errors/        # Custom error types
│       │   │   └── events/        # Domain events
│       │   └── types/             # TypeScript type definitions
│       └── package.json
│
├── libs/                          # Shared libraries across services
│   ├── shared-types/              # Common TypeScript interfaces
│   │   ├── src/
│   │   │   ├── enums/             # Shared enums (Gender, Education, etc.)
│   │   │   ├── interfaces/        # API interfaces and DTOs
│   │   │   │   ├── api.interfaces.ts
│   │   │   │   ├── dating.interfaces.ts
│   │   │   │   ├── storage.interfaces.ts
│   │   │   │   └── user.interfaces.ts
│   │   │   └── index.ts           # Exports all types
│   │   └── package.json
│   │
│   ├── shared-utils/              # Common utility functions
│   │   ├── src/
│   │   │   ├── validation/        # Input validation utilities
│   │   │   ├── format/            # Data formatting utilities
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── shared-validation/         # Zod validation schemas
│   │   ├── src/
│   │   └── package.json
│   │
│   └── shared-constants/          # Application constants
│       ├── src/
│       └── package.json
│
├── package.json                   # Root package.json for monorepo
├── yarn.lock                      # Yarn lock file
├── tsconfig.json                  # Root TypeScript configuration
└── README.md
```

### Module-Based Architecture
Each major feature is organized as a self-contained module following Domain-Driven Design principles:

```
src/modules/userProfile/
├── controllers/                   # HTTP layer
│   └── UserProfileController.ts   # Request/response handling
├── services/                      # Business logic
│   ├── IUserProfileService.ts     # Service interface
│   └── UserProfileService.ts      # Service implementation
├── repositories/                  # Data access
│   ├── IUserProfileRepository.ts  # Repository interface
│   └── UserProfileRepository.ts   # Repository implementation
├── dtos/                         # Data transfer objects
│   ├── UserProfileDtos.ts        # Request DTOs with validation
│   └── UserProfileResponseDtos.ts # Response DTOs
├── mappers/                      # Entity <-> DTO mapping
│   └── UserProfileMapper.ts      # Transformation logic
└── routes/                       # Route definitions
    └── userProfileRoutes.ts      # Express route setup
```

## Design Patterns & Principles

### 1. Layered Architecture Pattern

#### Clean Architecture Implementation
```typescript
// Domain Layer (Core Business Logic)
export class UserProfile {
  constructor(
    private readonly id: ProfileId,
    private readonly email: Email,
    private readonly personalInfo: PersonalInfo,
    private readonly preferences: UserPreferences
  ) {}
  
  updateProfile(updates: ProfileUpdates): DomainEvent[] {
    // Business rules validation
    if (!this.canUpdateProfile()) {
      throw new ProfileUpdateNotAllowedError();
    }
    
    // Apply changes and return domain events
    const events: DomainEvent[] = [];
    
    if (updates.personalInfo) {
      this.personalInfo.update(updates.personalInfo);
      events.push(new ProfileUpdatedEvent(this.id, updates));
    }
    
    return events;
  }
}

// Application Layer (Use Cases)
export class UserProfileService {
  async updateUserProfile(
    userId: UserId, 
    updates: UpdateProfileRequest
  ): Promise<ProfileResponse> {
    // Orchestrate domain objects and infrastructure
    const profile = await this.repository.findById(userId);
    const events = profile.updateProfile(updates);
    
    await this.repository.save(profile);
    await this.eventBus.publishAll(events);
    
    return this.mapper.toResponse(profile);
  }
}

// Infrastructure Layer (Technical Details)
export class TypeORMUserProfileRepository implements IUserProfileRepository {
  async findById(userId: UserId): Promise<UserProfile> {
    const entity = await this.repository.findOne({ where: { id: userId.value } });
    return this.mapper.toDomain(entity);
  }
}
```

### 2. Dependency Injection Pattern

#### IoC Container Implementation
```typescript
// src/infrastructure/di/Container.ts
export class Container {
  private static instance: Container;
  private services: Map<string, any> = new Map();
  private factories: Map<string, ServiceFactory<any>> = new Map();

  register<T>(token: string, factory: ServiceFactory<T>): void {
    this.factories.set(token, factory);
  }

  async resolve<T>(token: string): Promise<T> {
    if (this.services.has(token)) {
      return this.services.get(token);
    }

    const factory = this.factories.get(token);
    if (!factory) {
      throw new Error(`Service ${token} not registered`);
    }

    const instance = await factory();
    this.services.set(token, instance);
    return instance;
  }
}

// Service Registration
container.register('UserRepository', () => 
  new TypeORMUserRepository(dataSource.getRepository(User))
);

container.register('UserService', async () => {
  const repo = await container.resolve<IUserRepository>('UserRepository');
  const mapper = await container.resolve<UserMapper>('UserMapper');
  return new UserService(repo, mapper);
});
```

### 3. Repository Pattern

#### Data Access Abstraction
```typescript
// Domain Interface
export interface IUserProfileRepository {
  findById(id: string): Promise<UserProfile | null>;
  save(profile: UserProfile): Promise<void>;
  findByEmail(email: string): Promise<UserProfile | null>;
  findWithPagination(options: QueryOptions): Promise<PaginatedResult<UserProfile>>;
}

// Infrastructure Implementation
export class TypeORMUserProfileRepository implements IUserProfileRepository {
  constructor(
    private readonly repository: Repository<UserProfileEntity>,
    private readonly mapper: UserProfileMapper
  ) {}

  async findById(id: string): Promise<UserProfile | null> {
    const entity = await this.repository.findOne({ 
      where: { id },
      relations: ['userLogin', 'partnerPreferences']
    });
    
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async save(profile: UserProfile): Promise<void> {
    const entity = this.mapper.toEntity(profile);
    await this.repository.save(entity);
  }
}
```

### 4. Factory Pattern

#### Service Factory Implementation
```typescript
// Abstract Factory for Storage Providers
export abstract class StorageProviderFactory {
  abstract createProvider(config: StorageConfig): IStorageProvider;
}

export class CloudStorageFactory extends StorageProviderFactory {
  createProvider(config: StorageConfig): IStorageProvider {
    switch (config.provider) {
      case 'cloudflare-r2':
        return new CloudflareR2Provider(config);
      case 'aws-s3':
        return new AWSS3Provider(config);
      case 'google-cloud':
        return new GoogleCloudProvider(config);
      default:
        throw new Error(`Unsupported storage provider: ${config.provider}`);
    }
  }
}

// Usage
const factory = new CloudStorageFactory();
const storageProvider = factory.createProvider(storageConfig);
```

### 5. Strategy Pattern

#### Configurable Business Logic
```typescript
// Matching Algorithm Strategy
export interface IMatchingStrategy {
  calculateCompatibility(user1: UserProfile, user2: UserProfile): CompatibilityScore;
  rankMatches(user: UserProfile, candidates: UserProfile[]): RankedMatch[];
}

export class PersonalityBasedMatching implements IMatchingStrategy {
  calculateCompatibility(user1: UserProfile, user2: UserProfile): CompatibilityScore {
    // Personality-based matching algorithm
    return new CompatibilityScore(score, factors);
  }
}

export class PreferenceBasedMatching implements IMatchingStrategy {
  calculateCompatibility(user1: UserProfile, user2: UserProfile): CompatibilityScore {
    // Preference-based matching algorithm
    return new CompatibilityScore(score, factors);
  }
}

// Context
export class MatchingService {
  constructor(private strategy: IMatchingStrategy) {}

  setStrategy(strategy: IMatchingStrategy): void {
    this.strategy = strategy;
  }

  findMatches(user: UserProfile): Promise<Match[]> {
    const candidates = await this.getCandidates(user);
    return this.strategy.rankMatches(user, candidates);
  }
}
```

### 6. Observer Pattern (Event-Driven Architecture)

#### Domain Events Implementation
```typescript
// Domain Event
export abstract class DomainEvent {
  constructor(
    public readonly aggregateId: string,
    public readonly occurredOn: Date = new Date()
  ) {}
}

export class ProfileCompletedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly completionPercentage: number
  ) {
    super(userId);
  }
}

// Event Bus
export interface IEventBus {
  publish(event: DomainEvent): Promise<void>;
  subscribe<T extends DomainEvent>(
    eventType: new (...args: any[]) => T, 
    handler: (event: T) => Promise<void>
  ): void;
}

// Event Handlers
export class MatchingEventHandler {
  @EventHandler(ProfileCompletedEvent)
  async handleProfileCompleted(event: ProfileCompletedEvent): Promise<void> {
    if (event.completionPercentage >= 80) {
      await this.matchingService.triggerMatchCalculation(event.userId);
    }
  }
}
```

### 7. Command Query Responsibility Segregation (CQRS)

#### Read/Write Model Separation
```typescript
// Command Side (Write Model)
export class CreateUserProfileCommand {
  constructor(
    public readonly userId: string,
    public readonly profileData: ProfileCreationData
  ) {}
}

export class CreateUserProfileHandler {
  async handle(command: CreateUserProfileCommand): Promise<void> {
    const profile = UserProfile.create(command.userId, command.profileData);
    await this.repository.save(profile);
    
    // Publish event for read model update
    await this.eventBus.publish(new ProfileCreatedEvent(profile.id, profile.data));
  }
}

// Query Side (Read Model)
export class UserProfileQuery {
  constructor(
    public readonly userId: string,
    public readonly includePreferences: boolean = false
  ) {}
}

export class UserProfileQueryHandler {
  async handle(query: UserProfileQuery): Promise<UserProfileDto> {
    return await this.readRepository.findProfileDto(query.userId, {
      includePreferences: query.includePreferences
    });
  }
}
```

### 8. Circuit Breaker Pattern

#### Resilience for External Services
```typescript
export class CircuitBreaker {
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private failures = 0;
  private nextAttempt = 0;

  constructor(
    private readonly failureThreshold: number = 5,
    private readonly recoveryTimeout: number = 60000
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new CircuitBreakerOpenError();
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

// Usage in Email Service
export class EmailService {
  constructor(
    private readonly emailProvider: IEmailProvider,
    private readonly circuitBreaker: CircuitBreaker
  ) {}

  async sendEmail(email: EmailMessage): Promise<void> {
    return this.circuitBreaker.execute(async () => {
      return this.emailProvider.send(email);
    });
  }
}
```

### 9. Decorator Pattern

#### Cross-Cutting Concerns
```typescript
// Logging Decorator
export function LogExecution(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    const logger = Logger.getInstance();
    const start = Date.now();
    
    logger.info(`Starting ${target.constructor.name}.${propertyName}`, { args });
    
    try {
      const result = await method.apply(this, args);
      logger.info(`Completed ${target.constructor.name}.${propertyName}`, { 
        duration: Date.now() - start 
      });
      return result;
    } catch (error) {
      logger.error(`Failed ${target.constructor.name}.${propertyName}`, { error });
      throw error;
    }
  };
}

// Caching Decorator
export function Cacheable(ttl: number, keyGenerator?: (...args: any[]) => string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = keyGenerator ? keyGenerator(...args) : `${target.constructor.name}.${propertyName}:${JSON.stringify(args)}`;
      
      const cachedResult = await this.cacheService.get(cacheKey);
      if (cachedResult) {
        return cachedResult;
      }

      const result = await method.apply(this, args);
      await this.cacheService.set(cacheKey, result, ttl);
      
      return result;
    };
  };
}

// Usage
export class UserProfileService {
  @LogExecution
  @Cacheable(900, (userId: string) => `user:profile:${userId}`)
  async getUserProfile(userId: string): Promise<UserProfileDto> {
    return this.repository.findById(userId);
  }
}
```

## Cross-Cutting Concerns

### 1. Error Handling Strategy

#### Hierarchical Error System
```typescript
// Base Error Classes
export abstract class BaseError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code: string,
    public readonly context?: any
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

// Domain-Specific Errors
export class AuthenticationError extends BaseError {
  constructor(message = 'Authentication failed', context?: any) {
    super(message, 401, 'AUTHENTICATION_ERROR', context);
  }
}

export class ValidationError extends BaseError {
  constructor(message = 'Validation failed', details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

// Global Error Handler
export function createGlobalErrorHandler(logger: Logger) {
  return (error: Error, req: Request, res: Response, next: NextFunction): void => {
    logger.error('Request error', {
      error: error.message,
      stack: error.stack,
      path: req.path,
      method: req.method
    });

    if (error instanceof BaseError) {
      res.status(error.statusCode).json({
        success: false,
        error: {
          message: error.message,
          code: error.code,
          ...(error.context && { details: error.context })
        }
      });
    } else {
      res.status(500).json({
        success: false,
        error: {
          message: 'Internal server error',
          code: 'INTERNAL_ERROR'
        }
      });
    }
  };
}
```

### 2. Configuration Management

#### Environment-Based Configuration
```typescript
export class ConfigurationManager {
  private static instance: ConfigurationManager;
  private config: Map<string, any> = new Map();

  static getInstance(): ConfigurationManager {
    if (!ConfigurationManager.instance) {
      ConfigurationManager.instance = new ConfigurationManager();
    }
    return ConfigurationManager.instance;
  }

  get<T>(key: string, defaultValue?: T): T {
    const value = this.config.get(key) ?? process.env[key] ?? defaultValue;
    return value as T;
  }

  private loadConfiguration(): void {
    this.config.set('database', {
      host: process.env.POSTGRES_DB_HOST,
      port: parseInt(process.env.POSTGRES_DB_PORT || '5432'),
      database: process.env.POSTGRES_DB_NAME,
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      ssl: process.env.NODE_ENV === 'production'
    });

    this.config.set('redis', {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD
    });

    this.config.set('jwt', {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || '48h'
    });
  }
}
```

### 3. Monitoring & Observability

#### Application Performance Monitoring
```typescript
export class MetricsCollector {
  private static instance: MetricsCollector;
  private metrics: Map<string, Metric> = new Map();

  incrementCounter(name: string, tags?: Record<string, string>): void {
    const key = this.createKey(name, tags);
    const metric = this.metrics.get(key) || { type: 'counter', value: 0 };
    metric.value++;
    this.metrics.set(key, metric);
  }

  recordTimer(name: string, duration: number, tags?: Record<string, string>): void {
    const key = this.createKey(name, tags);
    this.metrics.set(key, { type: 'timer', value: duration, timestamp: Date.now() });
  }

  getMetrics(): Record<string, any> {
    const result: Record<string, any> = {};
    this.metrics.forEach((metric, key) => {
      result[key] = metric;
    });
    return result;
  }
}

// Performance Monitoring Middleware
export function performanceMonitoring() {
  return (req: Request, res: Response, next: NextFunction): void => {
    const start = Date.now();
    const metrics = MetricsCollector.getInstance();

    metrics.incrementCounter('http_requests_total', {
      method: req.method,
      route: req.route?.path || req.path
    });

    res.on('finish', () => {
      const duration = Date.now() - start;
      
      metrics.recordTimer('http_request_duration', duration, {
        method: req.method,
        status: res.statusCode.toString(),
        route: req.route?.path || req.path
      });

      metrics.incrementCounter('http_responses_total', {
        method: req.method,
        status: res.statusCode.toString(),
        route: req.route?.path || req.path
      });
    });

    next();
  };
}
```

This architecture provides a solid foundation for Datifyy's current requirements while maintaining flexibility for future enhancements and scaling. The modular design, clear separation of concerns, and comprehensive error handling ensure the system remains maintainable and robust as it grows.