// apps/frontend/src/utils/appInitializer.ts
import apiService from '../service/apiService';
import cookieService from './cookieService';

/**
 * Initialize app authentication state on load
 * Checks for existing tokens in cookies and sets up API service
 */
export const initializeAuth = async (): Promise<void> => {
  try {
    console.log('🔐 Initializing authentication...');
    
    // Check for token in cookies
    const token = cookieService.getCookie('token');
    
    if (token) {
      // Set token in API service
      await apiService.setAuthToken(token);
      console.log('✅ Token loaded from cookies');
    }
    
    // Also check for legacy tokens in localStorage/sessionStorage
    const legacyAdminToken = localStorage.getItem('admin_access_token') || 
                            sessionStorage.getItem('admin_access_token');
    
    if (!token && legacyAdminToken) {
      // Migrate legacy token to cookies
      const rememberMe = localStorage.getItem('admin_remember_me') === 'true';
      cookieService.setCookie('token', legacyAdminToken, rememberMe);
      await apiService.setAuthToken(legacyAdminToken);
      console.log('✅ Legacy token migrated to cookies');
    }
    
    // Check for regular user token
    const userToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token && !legacyAdminToken && userToken) {
      // Set user token in cookies
      cookieService.setCookie('token', userToken, false);
      await apiService.setAuthToken(userToken);
      console.log('✅ User token migrated to cookies');
    }
    
  } catch (error) {
    console.error('❌ Error initializing authentication:', error);
  }
};

/**
 * Initialize the app on load
 * Performs all necessary initialization tasks
 */
export const initializeApp = async (): Promise<void> => {
  // Initialize authentication
  await initializeAuth();
  
  // Add other initialization tasks here in the future
  console.log('✅ App initialization complete');
};