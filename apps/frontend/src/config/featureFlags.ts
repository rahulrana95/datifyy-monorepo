/**
 * Feature Flags Configuration
 * Centralized configuration for feature toggles
 */

export interface FeatureFlags {
  // Data source flags
  useMockData: boolean;
  
  // Feature toggles
  adminDashboard: boolean;
  curateDates: boolean;
  curatedDatesManagement: boolean;
  revenueTracking: boolean;
  realTimeNotifications: boolean;
  
  // API endpoints (when not using mock data)
  apiBaseUrl?: string;
  
  // Debug options
  enableLogging: boolean;
  showDevTools: boolean;
}

// Default feature flags
const defaultFlags: FeatureFlags = {
  // Data source
  useMockData: true, // Toggle this to false to use real API
  
  // Features
  adminDashboard: true,
  curateDates: true,
  curatedDatesManagement: true,
  revenueTracking: true,
  realTimeNotifications: false, // Not implemented yet
  
  // API configuration
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api',
  
  // Debug
  enableLogging: process.env.NODE_ENV === 'development',
  showDevTools: process.env.NODE_ENV === 'development',
};

// Override flags from environment variables
const getEnvironmentFlags = (): Partial<FeatureFlags> => {
  const envFlags: Partial<FeatureFlags> = {};
  
  // Check for environment variable overrides
  if (process.env.REACT_APP_USE_MOCK_DATA !== undefined) {
    envFlags.useMockData = process.env.REACT_APP_USE_MOCK_DATA === 'true';
  }
  
  if (process.env.REACT_APP_ENABLE_ADMIN_DASHBOARD !== undefined) {
    envFlags.adminDashboard = process.env.REACT_APP_ENABLE_ADMIN_DASHBOARD === 'true';
  }
  
  if (process.env.REACT_APP_ENABLE_CURATE_DATES !== undefined) {
    envFlags.curateDates = process.env.REACT_APP_ENABLE_CURATE_DATES === 'true';
  }
  
  if (process.env.REACT_APP_ENABLE_REVENUE_TRACKING !== undefined) {
    envFlags.revenueTracking = process.env.REACT_APP_ENABLE_REVENUE_TRACKING === 'true';
  }
  
  return envFlags;
};

// Override flags from localStorage (for runtime configuration)
const getLocalStorageFlags = (): Partial<FeatureFlags> => {
  try {
    const storedFlags = localStorage.getItem('datifyy_feature_flags');
    if (storedFlags) {
      return JSON.parse(storedFlags);
    }
  } catch (error) {
    console.error('Error reading feature flags from localStorage:', error);
  }
  return {};
};

// Merge all flag sources
export const featureFlags: FeatureFlags = {
  ...defaultFlags,
  ...getEnvironmentFlags(),
  ...getLocalStorageFlags(),
};

// Utility functions to manage feature flags
export const updateFeatureFlag = <K extends keyof FeatureFlags>(
  flag: K,
  value: FeatureFlags[K]
): void => {
  const currentFlags = getLocalStorageFlags();
  const updatedFlags = { ...currentFlags, [flag]: value };
  
  try {
    localStorage.setItem('datifyy_feature_flags', JSON.stringify(updatedFlags));
    // Reload the page to apply changes
    window.location.reload();
  } catch (error) {
    console.error('Error updating feature flags:', error);
  }
};

export const resetFeatureFlags = (): void => {
  try {
    localStorage.removeItem('datifyy_feature_flags');
    window.location.reload();
  } catch (error) {
    console.error('Error resetting feature flags:', error);
  }
};

export const isFeatureEnabled = (feature: keyof FeatureFlags): boolean => {
  return !!featureFlags[feature];
};

// Log current feature flags in development
if (featureFlags.enableLogging) {
  console.log('Current feature flags:', featureFlags);
}