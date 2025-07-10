# Datifyy Development Guide

## Quick Start

### Prerequisites
- **Node.js**: v18+ (LTS recommended)
- **Yarn**: v4.9.2+ (Package manager)
- **PostgreSQL**: v14+ (Database)
- **Redis**: v7+ (Caching & sessions)
- **Git**: For version control

### Environment Setup

#### 1. Clone Repository
```bash
git clone https://github.com/your-org/datifyy-monorepo.git
cd datifyy-monorepo
```

#### 2. Install Dependencies
```bash
# Install all workspace dependencies
yarn install

# Build shared libraries
yarn build:shared
```

#### 3. Environment Variables
Create environment files for each service:

```bash
# Backend environment
cp services/nodejs-service/.env.example services/nodejs-service/.env

# Frontend environment  
cp apps/frontend/.env.example apps/frontend/.env
```

**Required Environment Variables:**
```env
# Database
POSTGRES_DB_HOST=localhost
POSTGRES_DB_PORT=5432
POSTGRES_USERNAME=datifyy_user
POSTGRES_PASSWORD=your_password
POSTGRES_DB_NAME=datifyy_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# JWT
JWT_SECRET=your_super_secret_jwt_key

# Email Service
MAILER_SEND_KEY=your_mailersend_api_key
FROM_EMAIL=noreply@datifyy.com

# Storage (Cloudflare R2)
R2_ACCESS_KEY=your_r2_access_key
R2_SECRET_KEY=your_r2_secret_key
R2_BUCKET_NAME=datifyy-storage

# External APIs
GOOGLE_MEET_API_KEY=your_google_api_key
STRIPE_SECRET_KEY=your_stripe_key
```

#### 4. Database Setup
```bash
# Start PostgreSQL and Redis (using Docker)
docker-compose up -d postgres redis

# Run database migrations (if using migrations)
cd services/nodejs-service
yarn typeorm migration:run
```

#### 5. Start Development Servers
```bash
# Start backend API server
yarn start:backend

# Start frontend development server (in new terminal)
yarn start:frontend

# Watch shared libraries for changes (in new terminal)
yarn dev:shared
```

## Development Workflow

### 1. Project Structure Navigation

#### Backend Development
```bash
services/nodejs-service/src/
├── controllers/           # 🎯 Start here for new endpoints
├── services/             # 💼 Business logic implementation
├── repositories/         # 🗄️ Database operations
├── routes/               # 🛣️ API route definitions
├── modules/              # 📦 Feature-based organization
│   ├── auth/            # Authentication features
│   ├── userProfile/     # User profile management
│   ├── events/          # Event management
│   └── ...
├── infrastructure/      # 🔧 Cross-cutting concerns
│   ├── config/         # Configuration management
│   ├── database/       # Database setup
│   ├── logging/        # Logging configuration
│   └── middleware/     # Express middleware
└── models/entities/     # 📊 TypeORM database entities
```

#### Frontend Development
```bash
apps/frontend/src/
├── components/          # 🧩 Reusable UI components
├── pages/              # 📄 Next.js pages/routes
├── hooks/              # 🎣 Custom React hooks
├── services/           # 🌐 API client services
├── store/              # 🏪 State management
├── utils/              # 🛠️ Utility functions
└── styles/             # 🎨 CSS/styling files
```

### 2. Adding New Features

#### Step-by-Step Feature Development

**Example: Adding a "User Interests" Feature**

##### 1. Update Shared Types
```bash
# 1. Add types to shared library
cd libs/shared-types/src/interfaces

# Edit user.interfaces.ts
export interface UserInterests {
  id: string;
  userId: string;
  interests: string[];
  categories: InterestCategory[];
  createdAt: Date;
  updatedAt: Date;
}

# Build shared types
cd ../../../
yarn build:shared-types
```

##### 2. Create Database Entity
```typescript
// services/nodejs-service/src/models/entities/UserInterests.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { DatifyyUsersLogin } from './DatifyyUsersLogin';

@Entity('user_interests')
export class UserInterests {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { array: true })
  interests: string[];

  @Column('jsonb', { nullable: true })
  categories: object;

  @ManyToOne(() => DatifyyUsersLogin)
  @JoinColumn({ name: 'user_id' })
  user: DatifyyUsersLogin;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
```

##### 3. Create Module Structure
```bash
mkdir -p services/nodejs-service/src/modules/userInterests/{controllers,services,repositories,dtos,routes}
```

##### 4. Implement Repository
```typescript
// services/nodejs-service/src/modules/userInterests/repositories/IUserInterestsRepository.ts
export interface IUserInterestsRepository {
  findByUserId(userId: number): Promise<UserInterests | null>;
  save(interests: UserInterests): Promise<UserInterests>;
  update(id: string, data: Partial<UserInterests>): Promise<UserInterests>;
  delete(id: string): Promise<void>;
}

// services/nodejs-service/src/modules/userInterests/repositories/UserInterestsRepository.ts
export class UserInterestsRepository implements IUserInterestsRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findByUserId(userId: number): Promise<UserInterests | null> {
    const repository = this.dataSource.getRepository(UserInterests);
    return repository.findOne({ 
      where: { user: { id: userId } },
      relations: ['user']
    });
  }

  // ... implement other methods
}
```

##### 5. Implement Service
```typescript
// services/nodejs-service/src/modules/userInterests/services/UserInterestsService.ts
export class UserInterestsService {
  constructor(
    private readonly repository: IUserInterestsRepository,
    private readonly logger: Logger
  ) {}

  async getUserInterests(userId: number): Promise<UserInterestsDto> {
    this.logger.info('Getting user interests', { userId });
    
    const interests = await this.repository.findByUserId(userId);
    if (!interests) {
      throw new NotFoundError('User interests not found');
    }

    return this.mapToDto(interests);
  }

  async updateUserInterests(userId: number, data: UpdateInterestsDto): Promise<UserInterestsDto> {
    this.logger.info('Updating user interests', { userId, interestCount: data.interests.length });
    
    const interests = await this.repository.findByUserId(userId);
    if (!interests) {
      // Create new interests
      const newInterests = await this.repository.save({ 
        userId, 
        interests: data.interests,
        categories: data.categories 
      });
      return this.mapToDto(newInterests);
    }

    const updated = await this.repository.update(interests.id, data);
    return this.mapToDto(updated);
  }

  private mapToDto(interests: UserInterests): UserInterestsDto {
    return {
      id: interests.id,
      interests: interests.interests,
      categories: interests.categories,
      updatedAt: interests.updatedAt.toISOString()
    };
  }
}
```

##### 6. Create Controller
```typescript
// services/nodejs-service/src/modules/userInterests/controllers/UserInterestsController.ts
export class UserInterestsController {
  constructor(private readonly service: UserInterestsService) {}

  async getUserInterests(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const interests = await this.service.getUserInterests(req.user!.id);
      
      res.status(200).json({
        success: true,
        data: interests
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUserInterests(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const updateData = req.body as UpdateInterestsDto;
      const interests = await this.service.updateUserInterests(req.user!.id, updateData);
      
      res.status(200).json({
        success: true,
        data: interests,
        message: 'Interests updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}
```

##### 7. Create Routes
```typescript
// services/nodejs-service/src/modules/userInterests/routes/userInterestsRoutes.ts
export function createUserInterestsRoutes(dataSource: DataSource): Router {
  const router = Router();
  
  // Initialize dependencies
  const repository = new UserInterestsRepository(dataSource);
  const service = new UserInterestsService(repository, Logger.getInstance());
  const controller = new UserInterestsController(service);

  // Apply authentication
  router.use(authenticate());

  // Define routes
  router.get('/', asyncHandler(async (req, res, next) => {
    await controller.getUserInterests(req as AuthenticatedRequest, res, next);
  }));

  router.put('/', 
    validateUpdateInterests,
    asyncHandler(async (req, res, next) => {
      await controller.updateUserInterests(req as AuthenticatedRequest, res, next);
    })
  );

  return router;
}
```

##### 8. Register Routes
```typescript
// services/nodejs-service/src/routes/index.ts
export function createAppRoutes(dataSource: DataSource): Router {
  const router = Router();
  
  // ... existing routes
  
  // Add new user interests routes
  router.use('/user/interests', createUserInterestsRoutes(dataSource));
  
  return router;
}
```

### 3. Testing Strategy

#### Unit Testing
```typescript
// services/nodejs-service/src/modules/userInterests/__tests__/UserInterestsService.test.ts
describe('UserInterestsService', () => {
  let service: UserInterestsService;
  let mockRepository: jest.Mocked<IUserInterestsRepository>;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(() => {
    mockRepository = {
      findByUserId: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };
    
    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn()
    };

    service = new UserInterestsService(mockRepository, mockLogger);
  });

  describe('getUserInterests', () => {
    it('should return user interests when found', async () => {
      const mockInterests = {
        id: 'test-id',
        interests: ['sports', 'music'],
        categories: { primary: 'entertainment' },
        updatedAt: new Date()
      };

      mockRepository.findByUserId.mockResolvedValue(mockInterests);

      const result = await service.getUserInterests(1);

      expect(result).toEqual({
        id: 'test-id',
        interests: ['sports', 'music'],
        categories: { primary: 'entertainment' },
        updatedAt: mockInterests.updatedAt.toISOString()
      });
    });

    it('should throw NotFoundError when interests not found', async () => {
      mockRepository.findByUserId.mockResolvedValue(null);

      await expect(service.getUserInterests(1)).rejects.toThrow('User interests not found');
    });
  });
});
```

#### Integration Testing
```typescript
// services/nodejs-service/src/modules/userInterests/__tests__/userInterests.integration.test.ts
describe('User Interests Integration', () => {
  let app: Express;
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = await createTestDatabase();
    app = createTestApp(dataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it('should create and retrieve user interests', async () => {
    // Create test user
    const user = await createTestUser(dataSource);
    const token = generateTestToken(user);

    // Create interests
    const createResponse = await request(app)
      .put('/api/v1/user/interests')
      .set('Authorization', `Bearer ${token}`)
      .send({
        interests: ['coding', 'hiking', 'photography'],
        categories: { primary: 'technology', secondary: 'outdoor' }
      })
      .expect(200);

    expect(createResponse.body.success).toBe(true);
    expect(createResponse.body.data.interests).toHaveLength(3);

    // Retrieve interests
    const getResponse = await request(app)
      .get('/api/v1/user/interests')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(getResponse.body.data.interests).toEqual(['coding', 'hiking', 'photography']);
  });
});
```

### 4. Code Style & Best Practices

#### TypeScript Guidelines
```typescript
// ✅ Good: Use descriptive interfaces
interface UserProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  bio?: string;
  interests?: string[];
}

// ✅ Good: Use enums for constants
enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

// ✅ Good: Use proper error handling
async function updateUserProfile(userId: string, updates: UserProfileUpdateRequest): Promise<UserProfile> {
  try {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(`User not found: ${userId}`);
    }

    return await userRepository.update(userId, updates);
  } catch (error) {
    logger.error('Failed to update user profile', { userId, error });
    throw error;
  }
}

// ❌ Avoid: Any types
function processData(data: any): any {
  return data.someProperty;
}

// ✅ Good: Specific types
function processUserData(data: UserData): ProcessedUserData {
  return {
    id: data.id,
    displayName: `${data.firstName} ${data.lastName}`
  };
}
```

#### API Design Guidelines
```typescript
// ✅ Good: Consistent response format
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    requestId: string;
    timestamp: string;
  };
}

// ✅ Good: RESTful route naming
GET    /api/v1/users                    # List users
GET    /api/v1/users/:id                # Get specific user
POST   /api/v1/users                    # Create user
PUT    /api/v1/users/:id                # Update user
DELETE /api/v1/users/:id                # Delete user
GET    /api/v1/users/:id/interests      # Get user interests
PUT    /api/v1/users/:id/interests      # Update user interests

// ✅ Good: Proper HTTP status codes
res.status(200).json({ success: true, data: user });           // OK
res.status(201).json({ success: true, data: newUser });        // Created
res.status(400).json({ success: false, error: validation });   // Bad Request
res.status(401).json({ success: false, error: auth });         // Unauthorized
res.status(404).json({ success: false, error: notFound });     // Not Found
res.status(500).json({ success: false, error: internal });     // Internal Error
```

#### Database Patterns
```typescript
// ✅ Good: Use transactions for multi-step operations
async function transferCredits(fromUserId: number, toUserId: number, amount: number): Promise<void> {
  const queryRunner = dataSource.createQueryRunner();
  
  await queryRunner.connect();
  await queryRunner.startTransaction();
  
  try {
    await queryRunner.manager.decrement(UserAccount, { userId: fromUserId }, 'credits', amount);
    await queryRunner.manager.increment(UserAccount, { userId: toUserId }, 'credits', amount);
    
    await queryRunner.manager.save(Transaction, {
      fromUserId,
      toUserId,
      amount,
      type: 'credit_transfer'
    });
    
    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}

// ✅ Good: Use proper indexes and relations
@Entity('user_profiles')
@Index(['userId', 'isDeleted'])  // Composite index for common queries
export class UserProfile {
  @ManyToOne(() => User, user => user.profile, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;
  
  @Column({ type: 'boolean', default: false })
  @Index()  // Simple index for filtering
  isDeleted: boolean;
}
```

### 5. Debugging & Troubleshooting

#### Common Issues & Solutions

##### Database Connection Issues
```bash
# Check database connection
psql -h localhost -U datifyy_user -d datifyy_db

# Check Redis connection
redis-cli ping

# View database logs
docker logs datifyy_postgres

# Reset database (development only)
yarn db:reset
```

##### TypeORM Issues
```typescript
// Enable query logging for debugging
const dataSource = new DataSource({
  // ... other config
  logging: ['query', 'error'],
  logger: 'advanced-console'
});

// Check generated SQL queries
const users = await userRepository
  .createQueryBuilder('user')
  .leftJoinAndSelect('user.profile', 'profile')
  .getMany();
// This will log the actual SQL query
```

##### Environment Variable Issues
```bash
# Check loaded environment variables
node -e "console.log(process.env)" | grep POSTGRES

# Validate .env file
cat services/nodejs-service/.env

# Test configuration loading
node -e "
  require('dotenv').config({ path: 'services/nodejs-service/.env' });
  console.log('DB Host:', process.env.POSTGRES_DB_HOST);
"
```

#### Debugging Techniques

##### Server-Side Debugging
```typescript
// Add debugging to services
export class UserProfileService {
  async getUserProfile(userId: number): Promise<UserProfileDto> {
    this.logger.debug('Getting user profile', { userId });
    
    const profile = await this.repository.findByUserId(userId);
    
    this.logger.debug('Profile found', { 
      userId, 
      profileId: profile?.id,
      hasProfile: !!profile 
    });
    
    if (!profile) {
      this.logger.warn('Profile not found', { userId });
      throw new NotFoundError('User profile not found');
    }
    
    return this.mapper.toDto(profile);
  }
}
```

##### Client-Side Debugging
```typescript
// Add API debugging
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Add request/response interceptors
apiClient.interceptors.request.use(request => {
  console.log('API Request:', request.method?.toUpperCase(), request.url);
  return request;
});

apiClient.interceptors.response.use(
  response => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  error => {
    console.error('API Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);
```

### 6. Performance Optimization

#### Database Optimization
```typescript
// ✅ Use select specific fields
const users = await userRepository
  .createQueryBuilder('user')
  .select(['user.id', 'user.firstName', 'user.lastName'])
  .getMany();

// ✅ Use pagination for large datasets
const users = await userRepository
  .createQueryBuilder('user')
  .take(20)
  .skip((page - 1) * 20)
  .getMany();

// ✅ Use indexes for filtering
@Entity('users')
@Index(['email'])
@Index(['createdAt', 'isActive'])
export class User {
  @Column({ unique: true })
  email: string;
  
  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
```

#### Caching Strategy
```typescript
// Redis caching service
export class CacheService {
  constructor(private redis: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    const cached = await this.redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  async set(key: string, value: any, ttlSeconds: number = 3600): Promise<void> {
    await this.redis.setex(key, ttlSeconds, JSON.stringify(value));
  }

  async invalidate(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}

// Usage in service
export class UserProfileService {
  async getUserProfile(userId: number): Promise<UserProfileDto> {
    const cacheKey = `user:profile:${userId}`;
    
    // Try cache first
    const cached = await this.cacheService.get<UserProfileDto>(cacheKey);
    if (cached) {
      return cached;
    }

    // Fetch from database
    const profile = await this.repository.findByUserId(userId);
    const dto = this.mapper.toDto(profile);

    // Cache for 15 minutes
    await this.cacheService.set(cacheKey, dto, 900);
    
    return dto;
  }
}
```

### 7. Deployment

#### Development Deployment
```bash
# Build all services
yarn build:all

# Run database migrations
cd services/nodejs-service
yarn typeorm migration:run

# Start production server
yarn start
```

#### Environment-Specific Configuration
```typescript
// config/environment.ts
export const config = {
  development: {
    database: {
      logging: true,
      synchronize: true  // Only in development
    },
    cors: {
      origin: ['http://localhost:3000']
    }
  },
  
  production: {
    database: {
      logging: false,
      synchronize: false,
      ssl: { rejectUnauthorized: false }
    },
    cors: {
      origin: ['https://datifyy.com']
    }
  }
};
```

This development guide provides a comprehensive overview of working with the Datifyy codebase. Follow these patterns and guidelines to maintain consistency and quality across the application.