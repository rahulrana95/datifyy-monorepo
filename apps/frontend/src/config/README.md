# Feature Flags Configuration

This directory contains the feature flags configuration system for the Datifyy frontend application.

## Overview

The feature flags system allows you to:
- Toggle between mock data and real API endpoints
- Enable/disable specific features
- Configure debug options
- Override settings via environment variables or runtime UI

## Configuration Methods

### 1. Default Configuration
Edit `featureFlags.ts` to change default values:

```typescript
const defaultFlags: FeatureFlags = {
  useMockData: true, // Toggle this to false to use real API
  adminDashboard: true,
  // ... other flags
};
```

### 2. Environment Variables
Create a `.env` file based on `.env.example`:

```bash
REACT_APP_USE_MOCK_DATA=false
REACT_APP_ENABLE_ADMIN_DASHBOARD=true
REACT_APP_ENABLE_CURATE_DATES=true
```

### 3. Runtime Configuration (Development Only)
When `showDevTools` is enabled, a floating settings button appears in the bottom-right corner of the app. Click it to toggle features at runtime.

### 4. Programmatic Control
Use the utility functions to update flags programmatically:

```typescript
import { updateFeatureFlag, isFeatureEnabled } from './config/featureFlags';

// Update a flag
updateFeatureFlag('useMockData', false);

// Check if a feature is enabled
if (isFeatureEnabled('adminDashboard')) {
  // Feature-specific code
}
```

## Available Flags

| Flag | Description | Default |
|------|-------------|---------|
| `useMockData` | Use mock data instead of real API | `true` |
| `adminDashboard` | Enable admin dashboard feature | `true` |
| `curateDates` | Enable date curation feature | `true` |
| `curatedDatesManagement` | Enable dates management feature | `true` |
| `revenueTracking` | Enable revenue tracking feature | `true` |
| `realTimeNotifications` | Enable real-time notifications | `false` |
| `enableLogging` | Enable console logging | `true` (in development) |
| `showDevTools` | Show feature flags UI panel | `true` (in development) |

## Usage in Services

Services should extend the `BaseService` class to automatically handle mock/real API switching:

```typescript
import { BaseService } from '../services/baseService';

class MyService extends BaseService {
  async getData() {
    return this.getData(
      async () => {
        // Mock data implementation
        return { response: mockData, error: null };
      },
      '/api/endpoint', // Real API endpoint
      params
    );
  }
}
```

## Priority Order

Feature flags are loaded in the following priority order (highest to lowest):
1. localStorage (runtime UI changes)
2. Environment variables
3. Default configuration

Changes made via the runtime UI are stored in localStorage and will persist across page reloads until manually reset.