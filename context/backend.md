# Datifyy Node.js Services Reference

## Overview
Node.js backend services for the Datifyy dating platform, organized using a feature-based modular architecture for scalability and maintainability.

## Project Structure

```
services/nodejs/
├── src/
│   ├── app.js                      # Express app configuration
│   ├── server.js                   # Server entry point
│   ├── config/                     # Configuration files
│   │   ├── index.js               # Main config export
│   │   ├── database.js            # Database configuration
│   │   ├── redis.js               # Redis configuration
│   │   ├── storage.js             # File storage configuration
│   │   ├── auth.js                # Authentication configuration
│   │   └── environment.js         # Environment-specific configs
│   ├── modules/                   # Feature-based modules
│   │   ├── auth/                  # Authentication module
│   │   ├── users/                 # User management module
│   │   ├── profiles/              # User profiles module
│   │   ├── matching/              # Dating algorithm module
│   │   ├── dates/                 # Date curation module
│   │   ├── availability/          # User availability module
│   │   ├── payments/              # Payment processing module
│   │   ├── notifications/         # Notification system module
│   │   ├── admin/                 # Admin panel module
│   │   ├── analytics/             # Analytics & reporting module
│   │   └── messaging/             # Chat/messaging module
│   ├── shared/                    # Shared utilities
│   │   ├── middleware/            # Express middleware
│   │   ├── services/              # Shared business services
│   │   ├── utils/                 # Utility functions
│   │   ├── validators/            # Input validation
│   │   ├── errors/                # Error handling
│   │   └── constants/             # Application constants
│   ├── database/                  # Database related files
│   │   ├── models/                # Database models (Sequelize/Mongoose)
│   │   ├── migrations/            # Database migrations
│   │   ├── seeders/               # Database seeders
│   │   └── connection.js          # Database connection setup
│   └── tests/                     # Test files
│       ├── unit/                  # Unit tests
│       ├── integration/           # Integration tests
│       ├── e2e/                   # End-to-end tests
│       └── fixtures/              # Test data fixtures
├── .env                           # Environment variables
├── .env.example                   # Environment variables template
├── .gitignore                     # Git ignore rules
├── .eslintrc.js                   # ESLint configuration
├── .prettierrc                    # Prettier configuration
├── package.json                   # NPM dependencies and scripts
├── package-lock.json              # NPM lock file
├── Dockerfile                     # Docker configuration
├── docker-compose.yml             # Docker Compose configuration
└── README.md                      # Project documentation
```

## Module Structure Pattern
Each module follows a consistent internal structure:

```
modules/[module-name]/
├── index.js                       # Module entry point & route registration
├── controller.js                  # HTTP request handlers
├── service.js                     # Business logic
├── model.js                       # Database model (if needed)
├── validation.js                  # Input validation schemas
├── routes.js                      # Route definitions
├── middleware.js                  # Module-specific middleware
├── constants.js                   # Module constants
├── utils.js                       # Module utilities
└── tests/                         # Module-specific tests
    ├── controller.test.js
    ├── service.test.js
    └── integration.test.js
```

## Core Modules

### 1. Authentication Module (`auth/`)
**Purpose**: User authentication, authorization, and session management

#### Key Files:
- **`controller.js`** - Login, logout, register, password reset endpoints
- **`service.js`** - JWT token management, password hashing, session handling
- **`middleware.js`** - Authentication middleware, role-based access control
- **`validation.js`** - Login/register input validation

#### Key Functions:
```javascript
// Controller functions
exports.register = async (req, res, next)
exports.login = async (req, res, next)
exports.logout = async (req, res, next)
exports.refreshToken = async (req, res, next)
exports.forgotPassword = async (req, res, next)
exports.resetPassword = async (req, res, next)
exports.verifyEmail = async (req, res, next)

// Service functions
exports.hashPassword = async (password)
exports.comparePassword = async (password, hashedPassword)
exports.generateTokens = (userId, permissions)
exports.verifyToken = (token)
exports.invalidateSession = (userId, sessionId)

// Middleware functions
exports.authenticate = async (req, res, next)
exports.authorize = (permissions) => (req, res, next)
exports.rateLimitAuth = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 })
```

### 2. Users Module (`users/`)
**Purpose**: User account management and basic profile operations

#### Key Functions:
```javascript
// Controller functions
exports.getUserProfile = async (req, res, next)
exports.updateUserProfile = async (req, res, next)
exports.deleteUserAccount = async (req, res, next)
exports.getUsersByFilters = async (req, res, next)
exports.verifyUserIdentity = async (req, res, next)

// Service functions
exports.createUser = async (userData)
exports.findUserById = async (userId)
exports.findUserByEmail = async (email)
exports.updateUser = async (userId, updateData)
exports.softDeleteUser = async (userId)
exports.getUserStats = async (userId)
exports.checkUserAvailability = async (userId)
```

### 3. Profiles Module (`profiles/`)
**Purpose**: Detailed user profile management, preferences, and discovery

#### Key Functions:
```javascript
// Controller functions
exports.getDetailedProfile = async (req, res, next)
exports.updateProfileDetails = async (req, res, next)
exports.uploadProfileImages = async (req, res, next)
exports.updatePartnerPreferences = async (req, res, next)
exports.getDiscoveryProfiles = async (req, res, next)

// Service functions
exports.buildCompleteProfile = async (userId)
exports.calculateProfileCompleteness = (profileData)
exports.updateProfileImages = async (userId, imageUrls)
exports.validateProfileData = (profileData)
exports.getProfilesForDiscovery = async (userId, filters)
exports.calculateCompatibilityScore = (user1, user2)
```

### 4. Matching Module (`matching/`)
**Purpose**: Dating algorithm, compatibility scoring, and match suggestions

#### Key Functions:
```javascript
// Controller functions
exports.getMatches = async (req, res, next)
exports.likeProfile = async (req, res, next)
exports.passProfile = async (req, res, next)
exports.superLike = async (req, res, next)
exports.undoLastSwipe = async (req, res, next)

// Service functions
exports.findPotentialMatches = async (userId, preferences)
exports.calculateCompatibility = (userProfile, targetProfile)
exports.processSwipeAction = async (userId, targetId, action)
exports.checkMutualMatch = async (user1Id, user2Id)
exports.updateMatchingPreferences = async (userId, preferences)
exports.getMatchHistory = async (userId, pagination)

// Algorithm functions
exports.ageCompatibilityScore = (age1, age2, preferences)
exports.locationCompatibilityScore = (location1, location2, maxDistance)
exports.interestsCompatibilityScore = (interests1, interests2)
exports.lifestyleCompatibilityScore = (lifestyle1, lifestyle2)
```

### 5. Dates Module (`dates/`)
**Purpose**: Date curation, scheduling, and management system

#### Key Functions:
```javascript
// Controller functions
exports.createCuratedDate = async (req, res, next)
exports.getUserDates = async (req, res, next)
exports.confirmDateAttendance = async (req, res, next)
exports.cancelDate = async (req, res, next)
exports.submitDateFeedback = async (req, res, next)
exports.getDateDetails = async (req, res, next)

// Service functions
exports.curateDate = async (user1Id, user2Id, dateDetails)
exports.findOptimalDateTimes = async (user1Id, user2Id)
exports.sendDateReminders = async (dateId)
exports.processDateCancellation = async (dateId, userId, reason)
exports.calculateDateSuccess = async (dateId)
exports.updateTrustScores = async (dateId, feedbackData)

// Admin functions
exports.getAdminDates = async (filters, pagination)
exports.updateDateAsAdmin = async (dateId, updateData)
exports.generateDateAnalytics = async (timeRange)
```

### 6. Availability Module (`availability/`)
**Purpose**: User availability scheduling and booking system

#### Key Functions:
```javascript
// Controller functions
exports.createAvailabilitySlot = async (req, res, next)
exports.getUserAvailability = async (req, res, next)
exports.updateAvailabilitySlot = async (req, res, next)
exports.deleteAvailabilitySlot = async (req, res, next)
exports.bookAvailabilitySlot = async (req, res, next)
exports.searchAvailableUsers = async (req, res, next)

// Service functions
exports.createSlot = async (userId, slotData)
exports.findAvailableSlots = async (userId, dateRange)
exports.checkSlotConflicts = async (userId, newSlot)
exports.processBooking = async (slotId, bookedByUserId, activity)
exports.generateRecurringSlots = async (baseSlot, recurrencePattern)
exports.cancelSlot = async (slotId, reason)
```

### 7. Payments Module (`payments/`)
**Purpose**: Payment processing, subscription management, and billing

#### Key Functions:
```javascript
// Controller functions
exports.createPaymentIntent = async (req, res, next)
exports.processPayment = async (req, res, next)
exports.handleWebhook = async (req, res, next)
exports.getPaymentHistory = async (req, res, next)
exports.processRefund = async (req, res, next)

// Service functions
exports.calculateDateCost = (dateType, duration, userTier)
exports.processTokenPurchase = async (userId, tokenAmount, paymentMethod)
exports.handleSubscription = async (userId, subscriptionTier)
exports.processRefund = async (transactionId, amount, reason)
exports.updateUserTokens = async (userId, tokenChange)
exports.generateInvoice = async (transactionId)
```

### 8. Notifications Module (`notifications/`)
**Purpose**: Multi-channel notification system (email, SMS, push, in-app)

#### Key Functions:
```javascript
// Controller functions
exports.sendNotification = async (req, res, next)
exports.getUserNotifications = async (req, res, next)
exports.markNotificationRead = async (req, res, next)
exports.updateNotificationPreferences = async (req, res, next)

// Service functions
exports.sendEmail = async (to, template, data)
exports.sendSMS = async (phoneNumber, message)
exports.sendPushNotification = async (userId, title, body, data)
exports.createInAppNotification = async (userId, notification)
exports.processNotificationQueue = async ()
exports.trackNotificationDelivery = async (notificationId, status)

// Template functions
exports.renderEmailTemplate = (templateName, data)
exports.getNotificationPreferences = async (userId)
exports.shouldSendNotification = (userId, notificationType)
```

### 9. Admin Module (`admin/`)
**Purpose**: Admin panel functionality, analytics, and management tools

#### Key Functions:
```javascript
// Dashboard Controller
exports.getDashboardOverview = async (req, res, next)
exports.getUserMetrics = async (req, res, next)
exports.getDateMetrics = async (req, res, next)
exports.getRevenueMetrics = async (req, res, next)

// User Management Controller
exports.getUsers = async (req, res, next)
exports.updateUserAsAdmin = async (req, res, next)
exports.banUser = async (req, res, next)
exports.verifyUser = async (req, res, next)

// Content Moderation Controller
exports.getReportedContent = async (req, res, next)
exports.moderateContent = async (req, res, next)
exports.reviewUserReports = async (req, res, next)

// Analytics Service
exports.generateUserGrowthReport = async (timeRange)
exports.calculateDateSuccessMetrics = async (timeRange)
exports.generateRevenueAnalytics = async (timeRange)
exports.getSystemHealthMetrics = async ()
```

### 10. Analytics Module (`analytics/`)
**Purpose**: Data analytics, reporting, and business intelligence

#### Key Functions:
```javascript
// Controller functions
exports.getAnalyticsData = async (req, res, next)
exports.generateReport = async (req, res, next)
exports.trackUserEvent = async (req, res, next)
exports.getConversionFunnels = async (req, res, next)

// Service functions
exports.trackEvent = async (userId, eventType, eventData)
exports.calculateConversionRates = async (timeRange)
exports.generateUserRetentionReport = async (cohortData)
exports.analyzeMatchingEffectiveness = async (timeRange)
exports.processRealTimeMetrics = async ()
exports.exportAnalyticsData = async (reportType, filters)
```

## Shared Components

### Middleware (`shared/middleware/`)
```javascript
// Authentication & Authorization
exports.authenticate = async (req, res, next)
exports.authorize = (permissions) => (req, res, next)
exports.validateAdmin = async (req, res, next)

// Request Processing
exports.validateRequest = (schema) => (req, res, next)
exports.sanitizeInput = (req, res, next)
exports.rateLimiter = (options) => (req, res, next)
exports.compression = compression()
exports.cors = cors(corsOptions)

// Logging & Monitoring
exports.requestLogger = morgan('combined')
exports.errorLogger = (err, req, res, next)
exports.performanceMonitor = (req, res, next)

// File Upload
exports.uploadSingle = (fieldName) => multer(uploadConfig).single(fieldName)
exports.uploadMultiple = (fieldName, maxCount) => multer(uploadConfig).array(fieldName, maxCount)
```

### Services (`shared/services/`)
```javascript
// Database Service
exports.connectDatabase = async ()
exports.closeDatabase = async ()
exports.executeTransaction = async (operations)
exports.createBackup = async ()

// Cache Service (Redis)
exports.set = async (key, value, ttl)
exports.get = async (key)
exports.delete = async (key)
exports.flushAll = async ()

// Email Service
exports.sendTransactionalEmail = async (to, template, data)
exports.sendBulkEmail = async (recipients, template, data)
exports.verifyEmailDelivery = async (messageId)

// Storage Service
exports.uploadFile = async (file, folder)
exports.deleteFile = async (fileKey)
exports.generateSignedUrl = async (fileKey, expiresIn)
exports.resizeImage = async (fileKey, dimensions)

// Queue Service
exports.addJob = async (queueName, jobData, options)
exports.processJob = async (job)
exports.getJobStatus = async (jobId)
```

### Utilities (`shared/utils/`)
```javascript
// Date & Time
exports.formatDate = (date, format)
exports.addDays = (date, days)
exports.isWithinBusinessHours = (datetime)
exports.convertTimezone = (datetime, fromTz, toTz)

// Validation
exports.isValidEmail = (email)
exports.isValidPhoneNumber = (phone)
exports.isValidUrl = (url)
exports.sanitizeHtml = (html)

// Encryption & Security
exports.encrypt = (text, key)
exports.decrypt = (encryptedText, key)
exports.generateSecureToken = (length)
exports.hashData = (data, algorithm)

// API Helpers
exports.sendSuccess = (res, data, message, statusCode)
exports.sendError = (res, error, statusCode)
exports.paginate = (query, page, limit)
exports.buildFilterQuery = (filters)
```

### Error Handling (`shared/errors/`)
```javascript
// Custom Error Classes
class ValidationError extends Error
class AuthenticationError extends Error
class AuthorizationError extends Error
class NotFoundError extends Error
class ConflictError extends Error
class PaymentError extends Error

// Error Handler
exports.globalErrorHandler = (err, req, res, next)
exports.notFoundHandler = (req, res, next)
exports.validationErrorHandler = (err, req, res, next)

// Error Utilities
exports.createError = (message, statusCode, errorCode)
exports.logError = (error, context)
exports.sanitizeError = (error) // Remove sensitive data
```

## Database Models (Example with Sequelize)

### User Model
```javascript
const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  dateOfBirth: { type: DataTypes.DATEONLY },
  gender: { type: DataTypes.ENUM('male', 'female', 'other') },
  isEmailVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  lastActiveAt: { type: DataTypes.DATE },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});
```

### CuratedDate Model
```javascript
const CuratedDate = sequelize.define('CuratedDate', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user1Id: { type: DataTypes.UUID, allowNull: false },
  user2Id: { type: DataTypes.UUID, allowNull: false },
  dateTime: { type: DataTypes.DATE, allowNull: false },
  durationMinutes: { type: DataTypes.INTEGER, defaultValue: 60 },
  mode: { type: DataTypes.ENUM('online', 'offline'), allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'), defaultValue: 'pending' },
  locationName: { type: DataTypes.STRING },
  meetingLink: { type: DataTypes.STRING },
  adminNotes: { type: DataTypes.TEXT },
  tokensCostUser1: { type: DataTypes.INTEGER, defaultValue: 0 },
  tokensCostUser2: { type: DataTypes.INTEGER, defaultValue: 0 }
});
```

## API Endpoints Structure

### Authentication Endpoints
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh-token
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
POST   /api/v1/auth/verify-email
```

### User Management Endpoints
```
GET    /api/v1/users/profile
PUT    /api/v1/users/profile
DELETE /api/v1/users/account
GET    /api/v1/users/search
POST   /api/v1/users/upload-images
PUT    /api/v1/users/preferences
```

### Dating & Matching Endpoints
```
GET    /api/v1/matching/discover
POST   /api/v1/matching/swipe
GET    /api/v1/matching/matches
POST   /api/v1/matching/like
POST   /api/v1/matching/pass
POST   /api/v1/matching/super-like
```

### Date Curation Endpoints
```
GET    /api/v1/dates
POST   /api/v1/dates
GET    /api/v1/dates/:id
PUT    /api/v1/dates/:id
DELETE /api/v1/dates/:id
POST   /api/v1/dates/:id/confirm
POST   /api/v1/dates/:id/cancel
POST   /api/v1/dates/:id/feedback
```

### Admin Endpoints
```
GET    /api/v1/admin/dashboard
GET    /api/v1/admin/users
PUT    /api/v1/admin/users/:id
GET    /api/v1/admin/dates
GET    /api/v1/admin/analytics
GET    /api/v1/admin/reports
```

## Environment Configuration

### Development Environment
```javascript
// config/environment.js
const development = {
  port: process.env.PORT || 3000,
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'datifyy_dev',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    dialect: 'postgresql'
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '24h',
    refreshExpiresIn: '7d'
  },
  email: {
    provider: 'sendgrid',
    apiKey: process.env.SENDGRID_API_KEY,
    fromEmail: process.env.FROM_EMAIL
  },
  storage: {
    provider: 'cloudflare-r2',
    bucket: process.env.STORAGE_BUCKET,
    region: process.env.STORAGE_REGION,
    accessKey: process.env.STORAGE_ACCESS_KEY,
    secretKey: process.env.STORAGE_SECRET_KEY
  }
};
```

## Common Utilities & Helpers

### Response Helpers
```javascript
// shared/utils/response.js
exports.success = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

exports.error = (res, message = 'Internal Server Error', statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString()
  });
};

exports.paginated = (res, data, pagination, message = 'Success') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination,
    timestamp: new Date().toISOString()
  });
};
```

### Validation Schemas (with Joi)
```javascript
// shared/validators/auth.js
const Joi = require('joi');

exports.registerSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).required(),
  dateOfBirth: Joi.date().max('now').required(),
  gender: Joi.string().valid('male', 'female', 'other').required()
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});
```

## Testing Structure

### Unit Tests Example
```javascript
// tests/unit/modules/auth/service.test.js
const authService = require('../../../../src/modules/auth/service');

describe('Auth Service', () => {
  describe('hashPassword', () => {
    it('should hash password correctly', async () => {
      const password = 'TestPassword123!';
      const hash = await authService.hashPassword(password);
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
    });
  });

  describe('generateTokens', () => {
    it('should generate valid JWT tokens', () => {
      const userId = 'test-user-id';
      const permissions = ['user'];
      const tokens = authService.generateTokens(userId, permissions);
      
      expect(tokens).toHaveProperty('accessToken');
      expect(tokens).toHaveProperty('refreshToken');
    });
  });
});
```

### Integration Tests Example
```javascript
// tests/integration/auth.test.js
const request = require('supertest');
const app = require('../../src/app');

describe('Authentication Endpoints', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'SecurePass123!',
        dateOfBirth: '1990-01-01',
        gender: 'male'
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('userId');
    });
  });
});
```

## Key NPM Scripts
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "migrate": "sequelize-cli db:migrate",
    "migrate:undo": "sequelize-cli db:migrate:undo",
    "seed": "sequelize-cli db:seed:all",
    "build": "babel src -d dist",
    "docker:build": "docker build -t datifyy-api .",
    "docker:run": "docker run -p 3000:3000 datifyy-api"
  }
}
```

## Security Best Practices

### Input Validation & Sanitization
- All inputs validated using Joi schemas
- SQL injection prevention with parameterized queries
- XSS protection with input sanitization
- Rate limiting on authentication endpoints

### Authentication & Authorization
- JWT tokens with short expiration times
- Refresh token rotation
- Role-based access control (RBAC)
- Password hashing with bcrypt

### Data Protection
- Environment variables for sensitive data
- Database connection encryption
- File upload validation and scanning
- API response data sanitization

This Node.js services reference provides a comprehensive overview of a scalable, maintainable backend architecture for the Datifyy dating platform. The modular structure promotes code reusability, separation of concerns, and easy testing while following industry best practices.