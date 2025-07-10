# Folder Hierarchy Documentation

## Project Structure Overview

Datifyy follows a **monorepo architecture** using Yarn workspaces with clear separation between applications, services, and shared libraries.

```
datifyy-monorepo/
├── package.json                    # Root workspace configuration
├── yarn.lock                       # Dependency lock file
├── .yarn/                          # Yarn berry configuration
├── apps/                           # Frontend applications
├── services/                       # Backend services
├── libs/                           # Shared libraries
└── docs/                          # Documentation (if exists)
```

## Root Level Configuration

### Core Files
```
├── package.json                    # Workspace configuration & scripts
├── yarn.lock                       # Dependency versions
├── .yarn/                          # Yarn 4.9.2 configuration
│   ├── berry/                      # Yarn berry cache
│   └── releases/                   # Yarn releases
└── .gitignore                      # Git ignore rules
```

### Package.json Workspaces
```json
{
  "workspaces": [
    "apps/*",           # Frontend applications
    "services/*",       # Backend services  
    "libs/*"           # Shared libraries
  ]
}
```

## Apps Directory Structure

### Frontend Application (`apps/frontend/`)
```
apps/frontend/
├── package.json                    # React app dependencies
├── public/                         # Static assets
├── src/                           # Source code
│   ├── theme/                     # Chakra UI theme system
│   │   ├── foundations/           # Design tokens
│   │   │   ├── colors.ts         # Color system
│   │   │   ├── typography.ts     # Font system
│   │   │   ├── spacing.ts        # Spacing scale
│   │   │   ├── shadows.ts        # Shadow tokens
│   │   │   └── borders.ts        # Border & radius
│   │   ├── components/            # Component themes
│   │   │   ├── Button.ts         # Button variants
│   │   │   ├── Card.ts          # Card variants
│   │   │   ├── Input.ts         # Input variants
│   │   │   ├── Modal.ts         # Modal variants
│   │   │   └── Avatar.ts        # Avatar variants
│   │   ├── styles/               # Global styles
│   │   │   └── global.ts        # Global CSS
│   │   └── index.ts              # Theme export
│   ├── mvp/                      # Main application features
│   │   ├── home/                 # Landing & home pages
│   │   │   ├── components/       # Home page components
│   │   │   │   ├── HeroSection.tsx
│   │   │   │   ├── FeaturesSection.tsx
│   │   │   │   ├── HowItWorksSection.tsx
│   │   │   │   ├── TestimonialsSection.tsx
│   │   │   │   └── CTAAndFooter.tsx
│   │   │   ├── HomeContentArea.tsx
│   │   │   ├── LandingPage.tsx
│   │   │   └── home.tsx
│   │   ├── login-signup/         # Authentication module
│   │   │   ├── components/       # Auth components
│   │   │   │   ├── AuthModal.tsx
│   │   │   │   ├── AuthModalHeader.tsx
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── SignupForm.tsx
│   │   │   │   └── ForgotPasswordForm.tsx
│   │   │   ├── store/           # Auth state management
│   │   │   │   └── authStore.ts
│   │   │   ├── types/           # Auth TypeScript types
│   │   │   │   └── auth.types.ts
│   │   │   └── index.ts         # Module exports
│   │   ├── profile/             # User profile features
│   │   │   ├── HeaderWithTabs.tsx
│   │   │   └── types/
│   │   ├── partner-preferences/ # Partner preference module
│   │   │   ├── components/      # Preference components
│   │   │   │   ├── pages/       # Preference pages
│   │   │   │   │   ├── BasicsPage.tsx
│   │   │   │   │   ├── LifestylePage.tsx
│   │   │   │   │   ├── PhysicalPage.tsx
│   │   │   │   │   └── ValuesPage.tsx
│   │   │   │   ├── PreferencesHeader.tsx
│   │   │   │   ├── PreferencesNavigation.tsx
│   │   │   │   ├── PreferencesContent.tsx
│   │   │   │   └── LoadingSpinner.tsx
│   │   │   ├── types/           # Preference types
│   │   │   │   └── index.ts
│   │   │   ├── PartnerPreferencesContainer.tsx
│   │   │   └── index.ts
│   │   ├── common/              # Shared MVP components
│   │   │   ├── StatusWrapper/
│   │   │   └── utils/
│   │   ├── header/              # Header components
│   │   ├── AboutUs.tsx          # Static pages
│   │   ├── ContactUs.tsx
│   │   ├── PrivacyPolicy.tsx
│   │   ├── TNC.tsx
│   │   ├── Header.tsx           # Main header
│   │   ├── UserMenu.tsx         # User menu
│   │   └── PrivateRoute.tsx     # Route protection
│   ├── components/              # Reusable UI components
│   ├── hooks/                   # Custom React hooks
│   ├── service/                 # API services
│   │   ├── apiService.ts        # Base API client
│   │   ├── authService.ts       # Authentication service
│   │   ├── waitListService.ts   # Waitlist service
│   │   ├── userService/         # User-related services
│   │   │   ├── userProfileService.ts
│   │   │   └── UserProfileTypes.ts
│   │   └── ErrorTypes.ts        # Error type definitions
│   ├── providers/               # React context providers
│   │   └── QueryProvider.tsx    # React Query provider
│   ├── stores/                  # State management
│   │   ├── authStore.ts         # Legacy auth store
│   │   ├── userStore.ts         # User state
│   │   ├── useSnackbarStore.ts  # Snackbar state
│   │   └── videoRoomStore.ts    # Video call state
│   ├── utils/                   # Utility functions
│   │   ├── Logger.ts            # Logging utility
│   │   ├── axios.ts             # Axios configuration
│   │   └── snackbar.tsx         # Snackbar utilities
│   ├── App.tsx                  # Main app component
│   ├── App.css                  # App styles
│   ├── index.tsx                # React entry point
│   ├── index.css                # Global styles
│   └── reportWebVitals.ts       # Performance monitoring
├── build/                       # Build output (generated)
└── node_modules/               # Dependencies (generated)
```

## Libraries Directory Structure (`libs/`)

### Shared Types (`libs/shared-types/`)
```
libs/shared-types/
├── package.json                    # Package configuration
├── tsconfig.json                   # TypeScript config
├── src/
│   ├── enums/                     # Shared enumerations
│   │   ├── user.enums.ts         # User-related enums
│   │   └── index.ts              # Enum exports
│   ├── interfaces/               # TypeScript interfaces
│   │   ├── api.interfaces.ts     # API types
│   │   ├── dating.interfaces.ts  # Dating app types
│   │   ├── user.interfaces.ts    # User types
│   │   ├── storage.interfaces.ts # Storage types
│   │   └── index.ts             # Interface exports
│   └── index.ts                  # Main exports
├── dist/                         # Compiled output
└── tsconfig.tsbuildinfo          # TypeScript build info
```

### Shared Utilities (`libs/shared-utils/`)
```
libs/shared-utils/
├── package.json                    # Package configuration
├── tsconfig.json                   # TypeScript config
├── src/
│   ├── validation/                # Validation utilities
│   │   ├── validationUtils.ts    # General validation
│   │   └── fileValidationUtils.ts # File validation
│   ├── format/                   # Formatting utilities
│   │   └── formatUtils.ts        # Text/number formatting
│   └── index.ts                  # Main exports
├── dist/                         # Compiled output
└── tsconfig.tsbuildinfo          # TypeScript build info
```

### Shared Validation (`libs/shared-validation/`)
```
libs/shared-validation/
├── package.json                    # Package configuration (Zod schemas)
├── tsconfig.json                   # TypeScript config
├── src/
│   └── index.ts                   # Validation schemas
├── dist/                         # Compiled output
└── tsconfig.tsbuildinfo          # TypeScript build info
```

### Shared Constants (`libs/shared-constants/`)
```
libs/shared-constants/
├── package.json                    # Package configuration
├── tsconfig.json                   # TypeScript config
├── src/
│   └── index.ts                   # Application constants
├── dist/                         # Compiled output
└── tsconfig.tsbuildinfo          # TypeScript build info
```

## Architecture Patterns

### Monorepo Benefits
1. **Code Sharing**: Shared types, utilities, and constants
2. **Consistent Dependencies**: Centralized dependency management
3. **Type Safety**: End-to-end TypeScript across frontend/backend
4. **Build Optimization**: Incremental builds with TypeScript project references

### Module Organization

#### Feature-Based Structure
```
mvp/
├── feature-name/                   # Self-contained feature
│   ├── components/                # Feature components
│   ├── hooks/                     # Feature-specific hooks
│   ├── types/                     # Feature TypeScript types
│   ├── store/                     # Feature state management
│   ├── utils/                     # Feature utilities
│   └── index.ts                   # Feature exports
```

#### Component Structure
```
ComponentName/
├── index.ts                       # Barrel export
├── ComponentName.tsx              # Main component
├── ComponentName.types.ts         # TypeScript interfaces
├── ComponentName.test.tsx         # Unit tests
└── components/                    # Sub-components (if needed)
```

### Dependency Flow
```
apps/frontend
├── depends on → libs/shared-types
├── depends on → libs/shared-utils
├── depends on → libs/shared-validation
└── depends on → libs/shared-constants

libs/shared-utils
└── depends on → libs/shared-types

libs/shared-validation
└── depends on → libs/shared-types
```

## File Naming Conventions

### TypeScript Files
- **Components**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase with `use` prefix (`useAuthStore.ts`)
- **Utilities**: camelCase (`apiService.ts`)
- **Types**: PascalCase with `.types` suffix (`auth.types.ts`)
- **Constants**: UPPER_SNAKE_CASE or camelCase (`API_ENDPOINTS.ts`)

### Directories
- **Feature Directories**: kebab-case (`partner-preferences/`)
- **Component Directories**: PascalCase (`StatusWrapper/`)
- **Utility Directories**: camelCase (`userService/`)

### Barrel Exports
Each feature directory includes an `index.ts` file for clean imports:
```typescript
// libs/shared-types/src/index.ts
export * from './enums';
export * from './interfaces';
export { AuthView, type UserData } from './interfaces/dating.interfaces';
```

## Build Configuration

### TypeScript Project References
```json
{
  "references": [
    { "path": "../shared-types" },
    { "path": "../shared-utils" }
  ]
}
```

### Workspace Scripts
```json
{
  "build:shared": "yarn build:shared-types && yarn build:shared-utils",
  "build:all": "yarn build:shared && yarn workspace frontend build",
  "dev:shared": "yarn workspace @datifyy/shared-types dev"
}
```

## Import Patterns

### Absolute Imports (Frontend)
```typescript
// Theme imports
import { colors, typography } from '@/theme';

// Component imports  
import { AuthModal } from '@/mvp/login-signup';

// Service imports
import apiService from '@/service/apiService';
```

### Shared Library Imports
```typescript
// Type imports
import { UserData, ApiResponse } from '@datifyy/shared-types';

// Utility imports
import { validateEmail } from '@datifyy/shared-utils';

// Validation imports
import { userSchema } from '@datifyy/shared-validation';
```

## Code Organization Best Practices

### 1. Feature Modularity
- Each feature is self-contained with its own components, types, and logic
- Clear boundaries between features
- Minimal cross-feature dependencies

### 2. Type Safety
- Comprehensive TypeScript coverage
- Shared types across frontend/backend
- Strict type checking enabled

### 3. Reusability
- Shared utilities for common operations
- Theme system for consistent styling
- Component composition over inheritance

### 4. Performance
- Lazy loading for route components
- Tree-shaking friendly exports
- Optimized bundle splitting

### 5. Maintainability
- Clear naming conventions
- Consistent file structure
- Documentation through code