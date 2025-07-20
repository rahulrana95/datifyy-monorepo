# Database Schema - Datifyy Dating App

## Overview
Datifyy uses a PostgreSQL database with TypeORM as the ORM. The schema is designed to support a comprehensive dating platform with user profiles, matching, events, and administrative features.

## Core Tables & Relationships

### 1. Authentication & User Management

#### `datifyy_users_login`
Primary authentication table for user accounts.

```sql
CREATE TABLE datifyy_users_login (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  lastlogin TIMESTAMP NULL,
  isactive BOOLEAN DEFAULT true,
  isadmin BOOLEAN DEFAULT false,
  gender VARCHAR(10) DEFAULT 'male'
);
```

**Relationships:**
- One-to-One with `datifyy_users_information`
- One-to-Many with `datifyy_events` (as creator/updater)
- One-to-Many with `datifyy_ticket_purchases`
- One-to-Many with `datifyy_transactions`
- One-to-Many with `datifyy_user_partner_preferences`

#### `datifyy_users_information`
Detailed user profile information.

```sql
CREATE TABLE datifyy_users_information (
  id UUID PRIMARY KEY,
  user_login_id INTEGER REFERENCES datifyy_users_login(id),
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  official_email VARCHAR(255) UNIQUE NOT NULL,
  bio TEXT,
  images TEXT[],
  dob DATE,
  gender VARCHAR(50),
  height INTEGER,
  current_city VARCHAR(255),
  hometown VARCHAR(255),
  
  -- Profile attributes
  exercise ENUM('Heavy', 'Light', 'Moderate', 'None') DEFAULT 'None',
  education_level ENUM('Graduate', 'High School', 'Postgraduate', 'Undergraduate'),
  drinking ENUM('Never', 'Occasionally', 'Regularly') DEFAULT 'Never',
  smoking ENUM('Never', 'Occasionally', 'Regularly') DEFAULT 'Never',
  looking_for ENUM('Casual', 'Friendship', 'Relationship') DEFAULT 'Friendship',
  settle_down_in_months ENUM('0-6', '12-24', '24+', '6-12') DEFAULT '0-6',
  star_sign ENUM('Aquarius', 'Aries', 'Cancer', 'Capricorn', 'Gemini', 'Leo', 'Libra', 'Pisces', 'Sagittarius', 'Scorpio', 'Taurus', 'Virgo'),
  pronoun ENUM('He/Him', 'Other', 'She/Her', 'They/Them') DEFAULT 'He/Him',
  
  -- Preferences & Interests
  fav_interest TEXT[],
  causes_you_support TEXT[],
  quality_you_value TEXT[],
  prompts JSONB[],
  education JSONB[],
  
  -- Status flags
  have_kids BOOLEAN DEFAULT false,
  wants_kids BOOLEAN DEFAULT false,
  kundli_believer BOOLEAN DEFAULT false,
  is_official_email_verified BOOLEAN DEFAULT false,
  is_aadhar_verified BOOLEAN DEFAULT false,
  is_phone_verified BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  
  -- Metadata
  birth_time INTEGER,
  religion VARCHAR(100),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Partner Preferences & Matching

#### `datifyy_user_partner_preferences`
User's partner matching criteria and preferences.

```sql
CREATE TABLE datifyy_user_partner_preferences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES datifyy_users_login(id) ON DELETE CASCADE,
  
  -- Basic preferences
  gender_preference VARCHAR(20) DEFAULT 'Both',
  min_age INTEGER,
  max_age INTEGER,
  min_height INTEGER,
  max_height INTEGER,
  
  -- Lifestyle preferences
  smoking_preference VARCHAR(20) DEFAULT 'No',
  drinking_preference VARCHAR(20) DEFAULT 'No',
  religion_preference VARCHAR(50),
  ethnicity_preference VARCHAR(50),
  caste_preference VARCHAR(50),
  
  -- Economic preferences
  min_income DECIMAL(10,2),
  max_income DECIMAL(10,2),
  currency VARCHAR(3),
  
  -- Arrays for multiple selections
  education_level TEXT[],
  profession TEXT[],
  hobbies TEXT[],
  interests TEXT[],
  books_reading TEXT[],
  music TEXT[],
  movies TEXT[],
  travel TEXT[],
  sports TEXT[],
  personality_traits TEXT[],
  
  -- Location & relationship goals
  location_preference JSONB,
  location_preference_radius INTEGER,
  relationship_goals VARCHAR(100),
  lifestyle_preference JSONB,
  marital_status VARCHAR(20) DEFAULT 'Single',
  children_preference VARCHAR(20) DEFAULT 'Doesnt matter',
  activity_level VARCHAR(20),
  pet_preference VARCHAR(20),
  
  -- Free text
  partner_description TEXT,
  what_other_person_should_know TEXT,
  
  -- Matching algorithm scores
  religion_compatibility_score INTEGER,
  income_compatibility_score INTEGER,
  education_compatibility_score INTEGER,
  appearance_compatibility_score INTEGER,
  personality_compatibility_score INTEGER,
  values_compatibility_score INTEGER,
  matching_score INTEGER,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Events & Dating System

#### `datifyy_events`
Speed dating and social events management.

```sql
CREATE TABLE datifyy_events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  eventdate TIMESTAMP NOT NULL,
  duration INTERVAL NOT NULL,
  mode VARCHAR(10) NOT NULL, -- 'online' or 'offline'
  type VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL,
  location VARCHAR(255),
  
  -- Ticket configuration
  totalmenstickets INTEGER NOT NULL,
  totalfemaletickets INTEGER NOT NULL,
  menticketprice DECIMAL(10,2) NOT NULL,
  womenticketprice DECIMAL(10,2) NOT NULL,
  currencycode CHAR(3) NOT NULL,
  maxcapacity INTEGER NOT NULL,
  
  -- Media & metadata
  photos VARCHAR[],
  coverimageurl VARCHAR(255),
  tags VARCHAR[],
  socialmedialinks VARCHAR[],
  
  -- Policies & deadlines
  registrationdeadline TIMESTAMP,
  refundpolicy TEXT,
  
  -- Audit fields
  createdby INTEGER REFERENCES datifyy_users_login(id) ON DELETE SET NULL,
  updatedby INTEGER REFERENCES datifyy_users_login(id) ON DELETE SET NULL,
  createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  isdeleted BOOLEAN DEFAULT false
);
```

#### `datifyy_ticket_purchases`
Event ticket purchasing system.

```sql
CREATE TABLE datifyy_ticket_purchases (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES datifyy_events(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES datifyy_users_login(id) ON DELETE CASCADE,
  
  ticket_type VARCHAR(10) NOT NULL, -- 'male' or 'female'
  quantity INTEGER NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  currency_code CHAR(3) NOT NULL,
  
  payment_status VARCHAR(20) NOT NULL,
  transaction_id VARCHAR(255),
  purchase_source VARCHAR(50),
  
  -- Feedback system
  user_feedback TEXT,
  rating INTEGER,
  
  purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Live Dating Sessions

#### `rooms`
Individual user rooms for video dating sessions.

```sql
CREATE TABLE rooms (
  id SERIAL PRIMARY KEY,
  room_id VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) UNIQUE NOT NULL,
  event_id INTEGER UNIQUE REFERENCES datifyy_events(id) ON DELETE CASCADE,
  gender VARCHAR(10) DEFAULT 'male',
  
  -- Session timing
  starts_at TIMESTAMP,
  duration INTEGER, -- in minutes
  
  -- Status tracking
  is_active BOOLEAN DEFAULT true,
  is_completed BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(event_id, user_email)
);
```

#### `video_chat_sessions`
Paired video chat sessions between users.

```sql
CREATE TABLE video_chat_sessions (
  session_id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES datifyy_events(id) ON DELETE CASCADE,
  man_email VARCHAR(255),
  woman_email VARCHAR(255),
  status VARCHAR(20) DEFAULT 'available',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(event_id, man_email, woman_email)
);
```

#### `user_events_passcodes`
Access codes for event participation.

```sql
CREATE TABLE user_events_passcodes (
  id SERIAL PRIMARY KEY,
  event_id INTEGER UNIQUE REFERENCES datifyy_events(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  passcode VARCHAR(10) NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(email, event_id)
);
```

### 5. Financial System

#### `datifyy_transactions`
Comprehensive transaction tracking system.

```sql
CREATE TABLE datifyy_transactions (
  transaction_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES datifyy_users_login(id) ON DELETE CASCADE,
  
  -- Transaction details
  transaction_type VARCHAR(50) NOT NULL,
  transaction_status VARCHAR(20) DEFAULT 'Pending',
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  description TEXT,
  
  -- Payment gateway integration
  payment_method VARCHAR(50),
  payment_gateway VARCHAR(50) NOT NULL,
  gateway_transaction_id VARCHAR(255),
  gateway_status VARCHAR(20) DEFAULT 'Pending',
  payment_reference VARCHAR(255),
  payment_details JSONB,
  billing_address JSONB,
  
  -- Fees and calculations
  transaction_fee DECIMAL(10,2),
  gateway_fee DECIMAL(10,2),
  net_amount DECIMAL(10,2),
  
  -- Refund handling
  gateway_refund_id VARCHAR(255),
  refund_status VARCHAR(20) DEFAULT 'Pending',
  payment_status VARCHAR(20) DEFAULT 'Pending',
  refund_amount DECIMAL(10,2),
  
  -- Audit and approval
  initiated_by INTEGER REFERENCES datifyy_users_login(id) ON DELETE SET NULL,
  authorized_by INTEGER REFERENCES datifyy_users_login(id) ON DELETE SET NULL,
  audited BOOLEAN DEFAULT false,
  audit_reason TEXT,
  audit_details JSONB,
  
  transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6. Communication & Notifications

#### `datifyy_email_logs`
Email delivery tracking and logging.

```sql
CREATE TABLE datifyy_email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id INTEGER,
  email VARCHAR(255) DEFAULT '',
  email_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  failure_reason TEXT,
  metadata JSONB,
  
  sent_at TIMESTAMP DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_email_logs_sent_at ON datifyy_email_logs(sent_at);
CREATE INDEX idx_email_logs_status ON datifyy_email_logs(status);
CREATE INDEX idx_email_logs_user_id ON datifyy_email_logs(user_id);
```

### 7. User Engagement

#### `waitlist`
Pre-launch user interest tracking.

```sql
CREATE TABLE waitlist (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(20),
  status VARCHAR(50) DEFAULT 'waiting',
  preferred_date TIMESTAMP,
  
  -- Analytics data
  ip_address VARCHAR(255),
  user_agent VARCHAR(255),
  source VARCHAR(255),
  city VARCHAR(255),
  state VARCHAR(255),
  country VARCHAR(255),
  
  created_at BIGINT DEFAULT EXTRACT(epoch FROM now()),
  created_at_unix BIGINT
);
```

## Key Relationships & Constraints

### Primary Relationships
1. **User Identity**: `datifyy_users_login` ↔ `datifyy_users_information` (1:1)
2. **User Preferences**: `datifyy_users_login` → `datifyy_user_partner_preferences` (1:1)
3. **Event Participation**: `datifyy_users_login` → `datifyy_ticket_purchases` → `datifyy_events` (M:N)
4. **Video Sessions**: `rooms` → `video_chat_sessions` (via event and email matching)
5. **Financial Flow**: `datifyy_users_login` → `datifyy_transactions` → `datifyy_ticket_purchases`

### Data Integrity Features
- **Soft Deletes**: Most user data uses `is_deleted` flags
- **Audit Trails**: Created/updated timestamps and user tracking
- **Referential Integrity**: Proper foreign key constraints with CASCADE/SET NULL
- **Unique Constraints**: Email uniqueness across authentication and profile tables
- **Enum Validation**: Controlled vocabulary for categorical data

### Performance Optimizations
- **Indexes**: On frequently queried fields (email, dates, status)
- **JSONB**: For flexible schema fields (preferences, metadata)
- **Array Types**: For multi-value attributes (interests, images)
- **Partitioning Ready**: Transaction and log tables designed for future partitioning

## Schema Evolution Strategy

### Version Control
- Database migrations managed through TypeORM
- Enum values managed via admin interface
- Schema changes tracked in `_prisma_migrations` table

### Scalability Considerations
- UUID primary keys for user profiles (distributed-ready)
- JSONB for flexible schema evolution
- Separate tables for high-volume data (logs, transactions)
- Event-driven architecture support through clear boundaries