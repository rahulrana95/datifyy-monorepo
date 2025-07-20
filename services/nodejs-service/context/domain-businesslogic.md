# Domain Models & Business Logic - Datifyy Dating App

## Overview
Datifyy's domain model represents a comprehensive dating platform with sophisticated matching algorithms, event-based speed dating, and premium user experiences. The business logic is organized around core domains that reflect real-world dating and relationship-building processes.

## Core Business Domains

### 1. User Identity & Profile Domain

#### User Profile Model
Represents a complete user identity with comprehensive dating-relevant attributes.

```typescript
interface UserProfile {
  // Identity
  id: string;
  firstName: string;
  lastName: string;
  officialEmail: string;
  
  // Demographics
  gender: Gender;
  dob: string;
  age: number; // calculated
  height: number; // in cm
  currentCity: string;
  hometown: string;
  religion: string;
  
  // Lifestyle & Preferences
  exercise: ExerciseLevel;
  educationLevel: EducationLevel;
  drinking: DrinkingHabit;
  smoking: SmokingHabit;
  lookingFor: LookingFor;
  settleDownInMonths: TimeFrame;
  
  // Personal Attributes
  bio: string;
  images: string[];
  favInterest: string[];
  causesYouSupport: string[];
  qualityYouValue: string[];
  prompts: ProfilePrompt[];
  
  // Family & Astrology
  haveKids: boolean;
  wantsKids: boolean;
  starSign: StarSign;
  kundliBeliever: boolean;
  pronoun: Pronoun;
  
  // Verification Status
  isOfficialEmailVerified: boolean;
  isAadharVerified: boolean;
  isPhoneVerified: boolean;
  
  // Metadata
  profileCompletionPercentage: number;
  lastUpdated: Date;
  isDeleted: boolean;
}
```

#### Business Rules
1. **Age Validation**: Users must be 18+ years old
2. **Profile Completion**: Minimum 60% completion required for matching
3. **Image Policy**: Maximum 6 images, first image is primary
4. **Verification Tiers**: Email (basic) → Phone (standard) → Aadhar (premium)
5. **Soft Delete**: Profiles are never hard-deleted, only marked as deleted

### 2. Partner Preferences & Matching Domain

#### Partner Preferences Model
Sophisticated preference system for algorithmic matching.

```typescript
interface PartnerPreferences {
  // Basic Demographics
  genderPreference: string;
  minAge: number;
  maxAge: number;
  minHeight: number;
  maxHeight: number;
  
  // Economic Preferences
  minIncome: number;
  maxIncome: number;
  currency: string;
  
  // Lifestyle Preferences
  smokingPreference: string;
  drinkingPreference: string;
  religionPreference: string;
  educationLevel: string[];
  profession: string[];
  
  // Personal Interests
  hobbies: string[];
  interests: string[];
  music: string[];
  movies: string[];
  sports: string[];
  travel: string[];
  booksReading: string[];
  
  // Relationship Goals
  relationshipGoals: string;
  childrenPreference: string;
  maritalStatus: string;
  
  // Location & Activity
  locationPreference: LocationPreference;
  locationPreferenceRadius: number;
  activityLevel: string;
  petPreference: string;
  
  // Compatibility Scores (AI-calculated)
  religionCompatibilityScore: number;
  incomeCompatibilityScore: number;
  educationCompatibilityScore: number;
  appearanceCompatibilityScore: number;
  personalityCompatibilityScore: number;
  valuesCompatibilityScore: number;
  matchingScore: number;
  
  // Free Text
  partnerDescription: string;
  whatOtherPersonShouldKnow: string;
}
```

#### Matching Algorithm Business Logic
1. **Compatibility Scoring**: Multi-dimensional scoring across 6 categories
2. **Weighted Preferences**: Critical preferences (age, location) weighted higher
3. **Mutual Interest**: Both users must meet each other's criteria
4. **Progressive Matching**: Relaxed criteria if no matches found
5. **Diversity Injection**: 20% of matches intentionally diverse for discovery

### 3. Events & Speed Dating Domain

#### Event Model
Represents speed dating events with comprehensive management.

```typescript
interface DatingEvent {
  // Basic Information
  id: number;
  title: string;
  description: string;
  type: EventType; // 'speed_dating', 'mixer', 'workshop'
  mode: EventMode; // 'online', 'offline', 'hybrid'
  status: EventStatus; // 'draft', 'published', 'active', 'completed', 'cancelled'
  
  // Scheduling
  eventDate: Date;
  duration: Duration;
  registrationDeadline: Date;
  
  // Capacity & Pricing
  totalMensTickets: number;
  totalFemaleTickets: number;
  maxCapacity: number;
  menTicketPrice: Money;
  womenTicketPrice: Money;
  
  // Location (for offline events)
  location: string;
  
  // Media & Marketing
  coverImageUrl: string;
  photos: string[];
  tags: string[];
  socialMediaLinks: string[];
  
  // Policies
  refundPolicy: string;
  
  // Audit
  createdBy: number;
  updatedBy: number;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Event Business Rules
1. **Gender Balance**: Maintains 1:1 male-to-female ratio for optimal matching
2. **Dynamic Pricing**: Ticket prices can be adjusted based on demand
3. **Registration Limits**: Hard caps on total capacity with waitlist overflow
4. **Refund Policy**: Tiered refund system based on cancellation timing
5. **Age Segmentation**: Events can target specific age ranges (20s, 30s, 40+)

### 4. Live Dating Session Domain

#### Video Chat Session Model
Real-time speed dating session management.

```typescript
interface VideoChatSession {
  sessionId: number;
  eventId: number;
  
  // Participants
  manEmail: string;
  womanEmail: string;
  
  // Session Management
  status: SessionStatus; // 'waiting', 'active', 'completed', 'skipped'
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  
  // Quality Metrics
  connectionQuality: ConnectionQuality;
  participantFeedback: SessionFeedback[];
  
  // Matching Outcome
  mutualInterest: boolean;
  nextMeeting: boolean;
  contactExchanged: boolean;
}

interface Room {
  id: number;
  roomId: string; // Google Meet or video platform room ID
  userEmail: string;
  eventId: number;
  gender: Gender;
  
  // Session Timing
  startsAt: Date;
  duration: number;
  
  // Status
  isActive: boolean;
  isCompleted: boolean;
}
```

#### Session Business Rules
1. **Round Robin**: Systematic rotation ensuring everyone meets everyone
2. **Time Management**: Strict 3-5 minute sessions with automated transitions
3. **Quality Control**: Automatic session restart on technical issues
4. **Feedback Collection**: Immediate post-session feedback for matching
5. **Privacy Protection**: No recording, temporary room IDs

### 5. Financial & Transaction Domain

#### Transaction Model
Comprehensive financial transaction tracking.

```typescript
interface Transaction {
  transactionId: number;
  userId: number;
  
  // Transaction Details
  transactionType: TransactionType; // 'ticket_purchase', 'refund', 'premium_upgrade'
  amount: Money;
  description: string;
  
  // Payment Processing
  paymentMethod: PaymentMethod;
  paymentGateway: PaymentGateway;
  gatewayTransactionId: string;
  paymentReference: string;
  
  // Status Tracking
  transactionStatus: TransactionStatus;
  gatewayStatus: GatewayStatus;
  paymentStatus: PaymentStatus;
  
  // Financial Breakdown
  transactionFee: Money;
  gatewayFee: Money;
  netAmount: Money;
  
  // Refund Management
  refundAmount: Money;
  refundStatus: RefundStatus;
  gatewayRefundId: string;
  
  // Audit Trail
  initiatedBy: number;
  authorizedBy: number;
  audited: boolean;
  auditReason: string;
  
  // Metadata
  paymentDetails: PaymentDetails;
  billingAddress: Address;
  transactionDate: Date;
}
```

#### Financial Business Rules
1. **Double-Entry Accounting**: Every transaction has corresponding entries
2. **Refund Policies**: Tiered refund system (100% → 50% → 0% based on timing)
3. **Fee Structure**: Platform takes 3-5% + payment gateway fees
4. **Fraud Detection**: Automated suspicious transaction flagging
5. **Audit Trail**: Complete transaction history for compliance

### 6. Communication & Notification Domain

#### Email Campaign System
Sophisticated email marketing and notification system.

```typescript
interface EmailCampaign {
  // Campaign Details
  campaignId: string;
  name: string;
  type: EmailType; // 'welcome', 'verification', 'marketing', 'event_reminder'
  
  // Targeting
  targetAudience: UserSegment;
  recipientCount: number;
  
  // Content
  subject: string;
  template: EmailTemplate;
  personalizedContent: PersonalizationRules;
  
  // Scheduling
  scheduledTime: Date;
  timezone: string;
  
  // Performance
  deliveryStatus: DeliveryStatus;
  openRate: number;
  clickRate: number;
  unsubscribeRate: number;
  
  // Tracking
  deliveredCount: number;
  failedCount: number;
  failureReasons: string[];
}

interface EmailLog {
  id: string;
  userId: number;
  email: string;
  emailType: string;
  status: EmailStatus; // 'sent', 'delivered', 'opened', 'clicked', 'failed'
  failureReason: string;
  metadata: EmailMetadata;
  sentAt: Date;
}
```

#### Communication Business Rules
1. **Opt-in Required**: GDPR-compliant consent for marketing emails
2. **Rate Limiting**: Maximum email frequency to prevent spam
3. **Personalization**: Dynamic content based on user profile and behavior
4. **A/B Testing**: Template and subject line testing for optimization
5. **Delivery Optimization**: Send time optimization based on user activity

## Business Logic Implementation Patterns

### 1. Domain Services
Each domain has dedicated service classes that encapsulate business logic:
- `UserProfileService`: Profile management and validation
- `PartnerPreferencesService`: Matching criteria and algorithm
- `EventService`: Event lifecycle management
- `SessionService`: Live dating session orchestration
- `TransactionService`: Payment processing and financial operations

### 2. Business Rules Engine
Configurable rules for:
- Profile completion requirements
- Matching algorithm weights
- Event capacity management
- Pricing and refund policies
- Communication preferences

### 3. Event-Driven Architecture
Domain events for:
- User registration → Welcome email sequence
- Profile completion → Matching algorithm activation
- Event participation → Session scheduling
- Successful matches → Follow-up communication
- Payment completion → Service activation

### 4. Data Validation & Integrity
- **Input Validation**: DTO-based validation with class-validator
- **Business Rule Validation**: Domain-specific validation in service layers
- **Data Consistency**: Database constraints and transaction management
- **Audit Trails**: Complete change tracking for sensitive operations

### 5. Performance & Scalability
- **Caching Strategy**: Redis for session data and frequently accessed profiles
- **Database Optimization**: Proper indexing and query optimization
- **Async Processing**: Background jobs for matching algorithms and email campaigns
- **Rate Limiting**: API and feature usage limits to prevent abuse

## Integration Points

### External Services
1. **Payment Gateways**: Stripe, Razorpay integration
2. **Video Platforms**: Google Meet, Zoom API integration
3. **Email Services**: MailerSend, SendGrid for transactional emails
4. **SMS Services**: Twilio for phone verification
5. **Cloud Storage**: Cloudflare R2 for image and media storage
6. **Analytics**: Custom analytics for user behavior and matching success

### Internal APIs
1. **Matching Algorithm**: ML-based compatibility scoring
2. **Recommendation Engine**: Event and user suggestions
3. **Fraud Detection**: Transaction and profile analysis
4. **Content Moderation**: Automated image and text filtering
5. **Analytics Dashboard**: Real-time metrics and reporting