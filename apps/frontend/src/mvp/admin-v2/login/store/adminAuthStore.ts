// apps/frontend/src/mvp/admin-v2/store/adminAuthStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import adminAuthService from '../../../../service/adminAuthService';

/**
 * Admin user interface for store state
 */
interface AdminUser {
  id: number;
  email: string;
  permissionLevel: string;
  accountStatus: string;
  isActive: boolean;
  lastLoginAt: string;
  loginCount: number;
}

/**
 * Admin authentication store state interface
 */
interface AdminAuthState {
  // State
  isAuthenticated: boolean;
  admin: AdminUser | null;
  isLoading: boolean;
  error: string | null;
  sessionId: string | null;
  
  // Actions
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  checkAuthStatus: () => void;
  resetStore: () => void;
}

/**
 * Admin Authentication Store
 * Manages admin authentication state with Zustand
 * 
 * Features:
 * - Persistent authentication state
 * - Automatic session checking
 * - Error handling
 * - Loading states
 * - DevTools integration
 * 
 * @example
 * const { login, logout, isAuthenticated, admin } = useAdminAuthStore();
 * 
 * // Login
 * const success = await login('admin@datifyy.com', 'password', true);
 * 
 * // Check auth status
 * if (isAuthenticated && admin) {
 *   console.log('Admin logged in:', admin.email);
 * }
 */
export const useAdminAuthStore = create<AdminAuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // ===== INITIAL STATE =====
        isAuthenticated: false,
        admin: null,
        isLoading: false,
        error: null,
        sessionId: null,

        // ===== ACTIONS =====

        /**
         * Login admin user with credentials
         * 
         * @param {string} email - Admin email
         * @param {string} password - Admin password  
         * @param {boolean} rememberMe - Remember session
         * @returns {Promise<boolean>} Success status
         */
        login: async (email: string, password: string, rememberMe: boolean = false) => {
          console.log('🔐 Admin login initiated...', { email, rememberMe });
          
          set({ isLoading: true, error: null });
          
          try {
            const result = await adminAuthService.login(email, password, rememberMe);
            
            if (result.response && result.response.success) {
              const { admin, sessionId } = result.response.data;
              
              // Transform admin data for store
              const adminUser: AdminUser = {
                id: admin.id,
                email: admin.email,
                permissionLevel: admin.permissionLevel,
                accountStatus: admin.accountStatus,
                isActive: admin.isActive,
                lastLoginAt: admin.lastLoginAt,
                loginCount: admin.loginCount
              };
              
              set({
                isAuthenticated: true,
                admin: adminUser,
                sessionId,
                isLoading: false,
                error: null
              });
              
              console.log('✅ Admin login successful in store', { adminId: admin.id });
              return true;
              
            } else {
              const errorMessage = result.error?.message || 'Login failed';
              console.error('❌ Admin login failed in store:', errorMessage);
              
              set({
                isAuthenticated: false,
                admin: null,
                sessionId: null,
                isLoading: false,
                error: errorMessage
              });
              
              return false;
            }
            
          } catch (error: any) {
            const errorMessage = error?.message || 'An unexpected error occurred';
            console.error('❌ Admin login error in store:', error);
            
            set({
              isAuthenticated: false,
              admin: null,
              sessionId: null,
              isLoading: false,
              error: errorMessage
            });
            
            return false;
          }
        },

        /**
         * Logout admin user and clear state
         */
        logout: async () => {
          console.log('🚪 Admin logout initiated...');
          
          set({ isLoading: true });
          
          try {
            await adminAuthService.logout();
            
            // Clear all authentication state
            set({
              isAuthenticated: false,
              admin: null,
              sessionId: null,
              isLoading: false,
              error: null
            });
            
            console.log('✅ Admin logout successful');
            
          } catch (error: any) {
            console.error('❌ Admin logout error:', error);
            
            // Still clear state even if API call fails
            set({
              isAuthenticated: false,
              admin: null,
              sessionId: null,
              isLoading: false,
              error: null
            });
          }
        },

        /**
         * Clear current error state
         */
        clearError: () => {
          set({ error: null });
        },

        /**
         * Set loading state
         * 
         * @param {boolean} loading - Loading status
         */
        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },

        /**
         * Check current authentication status
         * Validates stored tokens and updates state accordingly
         */
        checkAuthStatus: () => {
          console.log('🔍 Checking admin auth status...');
          
          try {
            const isAuth = adminAuthService.isAuthenticated();
            const currentAdmin = adminAuthService.getCurrentAdmin();
            
            if (isAuth && currentAdmin) {
              // Update state with current admin
              const adminUser: AdminUser = {
                id: currentAdmin.id,
                email: currentAdmin.email,
                permissionLevel: currentAdmin.permissionLevel,
                accountStatus: currentAdmin.accountStatus,
                isActive: currentAdmin.isActive,
                lastLoginAt: currentAdmin.lastLoginAt,
                loginCount: currentAdmin.loginCount
              };
              
              set({
                isAuthenticated: true,
                admin: adminUser,
                error: null
              });
              
              console.log('✅ Admin auth status valid', { adminId: currentAdmin.id });
              
            } else {
              // Clear invalid state
              set({
                isAuthenticated: false,
                admin: null,
                sessionId: null,
                error: null
              });
              
              console.log('❌ Admin auth status invalid - cleared state');
            }
            
          } catch (error: any) {
            console.error('❌ Error checking admin auth status:', error);
            
            // Clear state on error
            set({
              isAuthenticated: false,
              admin: null,
              sessionId: null,
              error: 'Authentication check failed'
            });
          }
        },

        /**
         * Reset entire store to initial state
         */
        resetStore: () => {
          console.log('🔄 Resetting admin auth store...');
          
          set({
            isAuthenticated: false,
            admin: null,
            isLoading: false,
            error: null,
            sessionId: null
          });
        }
      }),
      {
        name: 'admin-auth-store',
        // Only persist authentication state, not loading/error states
        partialize: (state) => ({
          isAuthenticated: state.isAuthenticated,
          admin: state.admin,
          sessionId: state.sessionId
        }),
        // Custom storage methods to handle JSON serialization
        storage: {
          getItem: (name) => {
            const item = localStorage.getItem(name);
            return item ? JSON.parse(item) : null;
          },
          setItem: (name, value) => {
            localStorage.setItem(name, JSON.stringify(value));
          },
          removeItem: (name) => {
            localStorage.removeItem(name);
          }
        }
      }
    ),
    {
      name: 'admin-auth-store'
    }
  )
);

/**
 * Selectors for common store operations
 */
export const adminAuthSelectors = {
  /**
   * Get current admin user
   */
  getAdmin: () => useAdminAuthStore.getState().admin,
  
  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => useAdminAuthStore.getState().isAuthenticated,
  
  /**
   * Check if admin has specific permission level
   * 
   * @param {string} requiredLevel - Required permission level
   * @returns {boolean} Has permission
   */
  hasPermissionLevel: (requiredLevel: string) => {
    const admin = useAdminAuthStore.getState().admin;
    if (!admin) return false;
    
    // Define permission hierarchy
    const permissionLevels = ['viewer', 'moderator', 'admin', 'super_admin', 'owner'];
    const currentIndex = permissionLevels.indexOf(admin.permissionLevel);
    const requiredIndex = permissionLevels.indexOf(requiredLevel);
    
    return currentIndex >= requiredIndex;
  },
  
  /**
   * Check if admin account is active
   */
  isActiveAdmin: () => {
    const admin = useAdminAuthStore.getState().admin;
    return admin?.isActive && admin?.accountStatus === 'active';
  }
};

/**
 * Hook for admin authentication actions only
 * Useful when you only need actions, not state
 */
export const useAdminAuthActions = () => {
  const { login, logout, clearError, setLoading, checkAuthStatus, resetStore } = useAdminAuthStore();
  
  return {
    login,
    logout, 
    clearError,
    setLoading,
    checkAuthStatus,
    resetStore
  };
};

/**
 * Hook for admin authentication state only  
 * Useful when you only need state, not actions
 */
export const useAdminAuthState = () => {
  const { isAuthenticated, admin, isLoading, error, sessionId } = useAdminAuthStore();
  
  return {
    isAuthenticated,
    admin,
    isLoading, 
    error,
    sessionId
  };
};