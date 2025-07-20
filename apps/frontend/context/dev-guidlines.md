# Development Guidelines

## Overview

Datifyy development follows enterprise-grade practices focused on creating a premium dating experience. These guidelines ensure code quality, maintainability, and a consistent user experience across the platform.

## Tech Stack & Architecture

### Frontend Stack
- **Framework**: React 18 with TypeScript
- **UI Library**: Chakra UI with custom theme system
- **State Management**: Zustand + React Query
- **Routing**: React Router DOM v6
- **Build Tool**: Create React App (CRA)
- **Package Manager**: Yarn 4.9.2 (Berry)

### Backend Integration
- **API Client**: Axios with custom interceptors
- **Authentication**: JWT tokens with cookie storage
- **Error Handling**: Centralized error boundaries
- **Logging**: LogRocket + Sentry integration

### Monorepo Structure
- **Architecture**: Yarn workspaces
- **Shared Libraries**: Types, utilities, validation, constants
- **Type Safety**: End-to-end TypeScript

## Development Principles

### 1. Mobile-First Development
```typescript
// Always start with mobile design
const isMobile = useBreakpointValue({ base: true, md: false });

// Responsive design patterns
<Box
  display={{ base: 'none', md: 'block' }}
  fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}
  p={{ base: 4, md: 6, lg: 8 }}
/>
```

### 2. Touch-Friendly Design
- **Minimum Touch Target**: 44px for all interactive elements
- **Gesture Support**: Swipe, pinch, pan gestures for dating actions
- **Safe Areas**: Account for notches and home indicators

### 3. Performance First
- **Loading States**: Always provide loading feedback
- **Lazy Loading**: Route-based code splitting
- **Image Optimization**: Responsive images and lazy loading
- **60fps Animations**: Smooth, performant transitions

## Code Quality Standards

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Component Development Standards

#### Component Template
```typescript
import React from 'react';
import { Box, Button } from '@chakra-ui/react';
import { SomeType } from '@datifyy/shared-types';

interface ComponentProps {
  isLiked?: boolean;
  onLike?: () => void;
  user: UserProfile;
  variant?: 'standard' | 'premium' | 'verified';
}

const Component: React.FC<ComponentProps> = ({
  isLiked = false,
  onLike,
  user,
  variant = 'standard'
}) => {
  const size = useBreakpointValue({ base: 'sm', md: 'md' });
  
  return (
    <Box className="interactive" data-testid="component">
      {/* Component content */}
    </Box>
  );
};

export default Component;
```

#### File Structure Pattern
```
ComponentName/
├── index.ts              # Barrel export
├── ComponentName.tsx     # Main component
├── ComponentName.types.ts # TypeScript interfaces
├── ComponentName.test.tsx # Unit tests
└── components/           # Sub-components if needed
```

### State Management Patterns

#### Zustand Store Template
```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface StoreState {
  // State properties
  data: any[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchData: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useStore = create<StoreState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        data: [],
        isLoading: false,
        error: null,
        
        // Actions
        fetchData: async () => {
          set({ isLoading: true, error: null });
          try {
            // API call logic
            const data = await apiService.get('/endpoint');
            set({ data, isLoading: false });
          } catch (error) {
            set({ error: error.message, isLoading: false });
          }
        },
        
        setLoading: (loading) => set({ isLoading: loading }),
        setError: (error) => set({ error }),
        clearError: () => set({ error: null }),
      }),
      {
        name: 'store-name',
        partialize: (state) => ({ data: state.data }), // Only persist data
      }
    ),
    { name: 'store-name' }
  )
);
```

#### React Query Integration
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Query hooks
export const useUserProfile = () => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: () => userService.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
  });
};

// Mutation hooks
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
};
```

## Dating App Specific Guidelines

### User Experience Principles

#### 1. Emotional Design
```typescript
// Use heart animations for positive actions
<Button 
  variant="love" 
  className="heart-beat"
  onClick={handleLike}
>
  Like
</Button>

// Celebrate matches and connections
const showMatchCelebration = () => {
  toast({
    title: "It's a Match! 💕",
    status: "success",
    duration: 5000,
  });
};
```

#### 2. Trust & Safety
```typescript
// Always show verification status
<Badge variant={user.isVerified ? "verified" : "unverified"}>
  {user.isVerified ? "✓ Verified" : "Unverified"}
</Badge>

// Provide clear privacy controls
<PrivacyToggle 
  isVisible={profile.isPublic}
  onChange={handlePrivacyChange}
  label="Make profile visible to others"
/>
```

#### 3. Progressive Disclosure
```typescript
// Don't overwhelm users - reveal information gradually
const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

return (
  <>
    <BasicFilters />
    {showAdvancedFilters && <AdvancedFilters />}
    <Button onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
      {showAdvancedFilters ? 'Show Less' : 'More Filters'}
    </Button>
  </>
);
```

### Swipe Gesture Implementation
```typescript
import { useSwipeable } from 'react-swipeable';

const ProfileCard: React.FC<ProfileCardProps> = ({ onSwipe, profile }) => {
  const handlers = useSwipeable({
    onSwipedLeft: () => onSwipe(profile.id, 'pass'),
    onSwipedRight: () => onSwipe(profile.id, 'like'),
    onSwipedUp: () => onSwipe(profile.id, 'superlike'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true, // Enable mouse support for desktop testing
  });

  return (
    <Box
      {...handlers}
      className="swipe-card"
      touchAction="pan-y pinch-zoom"
      userSelect="none"
    >
      {/* Profile content */}
    </Box>
  );
};
```

## API Integration Patterns

### Service Layer Structure
```typescript
// Base API service
class ApiService {
  private axiosInstance: AxiosInstance;
  
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_API_URL,
      headers: { 'Content-Type': 'application/json' },
    });
    
    this.setupInterceptors();
  }
  
  private setupInterceptors() {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = this.getTokenFromCookies();
        if (token) {
          config.headers.Authorization = token;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.handleUnauthorized();
        }
        return Promise.reject(error);
      }
    );
  }
  
  async get<T>(path: string): Promise<ServiceResponse<T>> {
    try {
      const { data } = await this.axiosInstance.get<ApiResponse<T>>(path);
      return { response: data.data };
    } catch (error) {
      return { error: this.handleError(error) };
    }
  }
  
  // ... other HTTP methods
}
```

### Error Handling Strategy
```typescript
// Centralized error handling
export const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ChakraErrorBoundary
      fallback={(error, resetError) => (
        <Box textAlign="center" p={8}>
          <Text fontSize="xl" mb={4}>Something went wrong 😕</Text>
          <Button onClick={resetError} variant="love">
            Try Again
          </Button>
        </Box>
      )}
    >
      {children}
    </ChakraErrorBoundary>
  );
};

// Toast notifications for API errors
const handleApiError = (error: any) => {
  const message = error?.response?.data?.message || 'Something went wrong';
  
  toast({
    title: 'Error',
    description: message,
    status: 'error',
    duration: 5000,
    isClosable: true,
  });
};
```

## Testing Guidelines

### Testing Strategy
1. **Unit Tests**: Individual components and utilities
2. **Integration Tests**: Component interactions and API calls
3. **E2E Tests**: Critical user journeys (signup, profile creation, matching)

### Testing Patterns
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProfileCard from './ProfileCard';

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  });
  
  return render(
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        {component}
      </ChakraProvider>
    </QueryClientProvider>
  );
};

describe('ProfileCard', () => {
  const mockProfile = {
    id: '1',
    name: 'John Doe',
    age: 28,
    bio: 'Love hiking and coffee',
    images: ['image1.jpg'],
  };
  
  it('should render profile information', () => {
    renderWithProviders(<ProfileCard profile={mockProfile} />);
    
    expect(screen.getByText('John Doe, 28')).toBeInTheDocument();
    expect(screen.getByText('Love hiking and coffee')).toBeInTheDocument();
  });
  
  it('should handle like action', async () => {
    const onSwipe = jest.fn();
    renderWithProviders(
      <ProfileCard profile={mockProfile} onSwipe={onSwipe} />
    );
    
    const likeButton = screen.getByTestId('like-button');
    fireEvent.click(likeButton);
    
    await waitFor(() => {
      expect(onSwipe).toHaveBeenCalledWith('1', 'like');
    });
  });
});
```

## Performance Optimization

### Code Splitting
```typescript
// Route-based code splitting
const ProfilePage = lazy(() => import('./mvp/profile/ProfilePage'));
const MatchesPage = lazy(() => import('./mvp/matches/MatchesPage'));

// Component-based splitting for large features
const ChatComponent = lazy(() => import('./mvp/chat/ChatComponent'));
```

### Memoization Patterns
```typescript
// Expensive calculations
const compatibilityScore = useMemo(() => {
  return calculateCompatibility(user, preferences);
}, [user, preferences]);

// Component memoization
const ProfileCard = memo(({ profile, onSwipe }: ProfileCardProps) => {
  // Component logic
}, (prevProps, nextProps) => {
  return prevProps.profile.id === nextProps.profile.id;
});

// Callback memoization
const handleLike = useCallback((profileId: string) => {
  onSwipe(profileId, 'like');
}, [onSwipe]);
```

### Image Optimization
```typescript
// Lazy loading with intersection observer
const LazyImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <Box ref={imgRef} position="relative">
      {isInView && (
        <Image
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          opacity={isLoaded ? 1 : 0}
          transition="opacity 0.3s"
        />
      )}
      {!isLoaded && <Skeleton height="200px" />}
    </Box>
  );
};
```

## Security Guidelines

### Input Validation
```typescript
// Always validate user input
import { validateEmail, validateAge } from '@datifyy/shared-utils';

const validateProfileForm = (data: ProfileFormData) => {
  const errors: string[] = [];
  
  if (!validateEmail(data.email).isValid) {
    errors.push('Invalid email address');
  }
  
  if (!validateAge(data.age).isValid) {
    errors.push('Age must be between 18 and 100');
  }
  
  return errors;
};
```

### XSS Prevention
```typescript
// Sanitize user-generated content
import DOMPurify from 'dompurify';

const SafeBio: React.FC<{ bio: string }> = ({ bio }) => {
  const sanitizedBio = useMemo(() => {
    return DOMPurify.sanitize(bio, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong'],
      ALLOWED_ATTR: []
    });
  }, [bio]);
  
  return (
    <Text dangerouslySetInnerHTML={{ __html: sanitizedBio }} />
  );
};
```

### Token Management
```typescript
// Secure token handling
class AuthService {
  private static TOKEN_KEY = 'Authorization';
  
  setToken(token: string) {
    // Use secure cookies for production
    document.cookie = `${this.TOKEN_KEY}=${token}; path=/; secure; samesite=strict`;
  }
  
  getToken(): string | null {
    const match = document.cookie.match(new RegExp(`(^| )${this.TOKEN_KEY}=([^;]+)`));
    return match ? match[2] : null;
  }
  
  clearToken() {
    document.cookie = `${this.TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}
```

## Accessibility Guidelines

### WCAG 2.1 AA Compliance
```typescript
// Proper ARIA labels and roles
<Button
  aria-label="Like this profile"
  role="button"
  onClick={handleLike}
>
  <HeartIcon aria-hidden="true" />
</Button>

// Keyboard navigation
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handleLike();
  }
};

// Screen reader support
<VisuallyHidden>
  Profile of {user.name}, age {user.age}, from {user.location}
</VisuallyHidden>
```

### Focus Management
```typescript
// Proper focus management for modals
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const initialFocusRef = useRef<HTMLButtonElement>(null);
  
  return (
    <ChakraModal
      isOpen={isOpen}
      onClose={onClose}
      initialFocusRef={initialFocusRef}
    >
      <ModalContent>
        {children}
        <Button ref={initialFocusRef} onClick={onClose}>
          Close
        </Button>
      </ModalContent>
    </ChakraModal>
  );
};
```

## Deployment & CI/CD

### Build Scripts
```json
{
  "scripts": {
    "build:shared": "yarn build:shared-types && yarn build:shared-utils",
    "build:all": "yarn build:shared && yarn workspace frontend build",
    "start:dev": "yarn dev:shared & yarn workspace frontend start",
    "type-check": "yarn workspaces run type-check",
    "test": "yarn workspaces run test",
    "lint": "yarn workspaces run lint"
  }
}
```

### Environment Variables
```typescript
// Environment configuration
interface EnvConfig {
  API_URL: string;
  SENTRY_DSN: string;
  GA_ID: string;
  IS_COUNTDOWN_ENABLED: boolean;
}

const getEnvConfig = (): EnvConfig => ({
  API_URL: process.env.REACT_APP_ENV === 'prod' 
    ? process.env.REACT_APP_BACKENDEND_URL_PROD!
    : process.env.REACT_APP_BACKENDEND_URL_DEV!,
  SENTRY_DSN: process.env.REACT_APP_SENTRY_DSN!,
  GA_ID: process.env.REACT_APP_GA_ID!,
  IS_COUNTDOWN_ENABLED: process.env.REACT_APP_IS_COUNTDOWN_ENABLED === 'true',
});
```

## Documentation Standards

### Code Documentation
```typescript
/**
 * ProfileCard component for displaying user profiles in dating context
 * 
 * Features:
 * - Swipe gesture support for like/pass actions
 * - Responsive image gallery
 * - Verification status indicators
 * - Accessibility compliant
 * 
 * @param profile - User profile data
 * @param onSwipe - Callback for swipe actions
 * @param variant - Visual variant (standard, premium, verified)
 * 
 * @example
 * <ProfileCard
 *   profile={userProfile}
 *   onSwipe={(id, action) => handleSwipe(id, action)}
 *   variant="premium"
 * />
 */
```

### README Requirements
Each feature module should include:
1. **Purpose**: What the feature does
2. **Usage**: How to use the components
3. **Props**: TypeScript interface documentation
4. **Examples**: Code examples
5. **Testing**: How to test the feature

## Maintenance & Monitoring

### Performance Monitoring
```typescript
// Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

const reportWebVitals = (onPerfEntry?: (metric: any) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    getCLS(onPerfEntry);
    getFID(onPerfEntry);
    getFCP(onPerfEntry);
    getLCP(onPerfEntry);
    getTTFB(onPerfEntry);
  }
};

// Google Analytics integration
reportWebVitals((metric) => {
  ReactGA.event({
    category: 'Web Vitals',
    action: metric.name,
    value: Math.round(metric.value),
    nonInteraction: true,
  });
});
```

### Error Monitoring
```typescript
// Sentry integration
Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  beforeSend(event, hint) {
    // Filter out development errors
    if (process.env.NODE_ENV === 'development') {
      return null;
    }
    return event;
  },
});

// LogRocket integration
LogRocket.init('app-id', {
  shouldCaptureIP: false, // Privacy compliance
  console: {
    shouldAggregateConsoleErrors: true,
  },
});
```

This comprehensive development guide ensures consistent, high-quality code that creates an exceptional dating experience while maintaining enterprise-grade standards.