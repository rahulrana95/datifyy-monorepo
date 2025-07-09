// apps/frontend/src/mvp/login-signup/store/authStore.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface UserData {
  id: string;
  email: string;
  isAdmin: boolean;
  name: string;
  avatar?: string;
  isVerified?: boolean;
  profileCompletion?: number;
}

export interface AuthModalState {
  isLoginOpen: boolean;
  isSignupOpen: boolean;
  isForgotPasswordOpen: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthState extends AuthModalState {
  // User state
  user: UserData | null;
  isAuthenticated: boolean;
  
  // Modal actions
  showLogin: () => void;
  showSignup: () => void;
  showForgotPassword: () => void;
  hideAllModals: () => void;
  
  // Legacy support for existing code
  showHideLogin: (val: boolean) => void;
  showHideSignup: (val: boolean) => void;
  showHideForgotPassword: (val: boolean) => void;
  toggleLogin: (open: boolean) => void;
  toggleSignup: (open: boolean) => void;
  
  // User actions
  setUserData: (user: UserData) => void;
  setIsAuthenticated: (val: boolean) => void;
  clearUser: () => void;
  
  // UI state actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        isAuthenticated: false,
        isLoginOpen: false,
        isSignupOpen: false,
        isForgotPasswordOpen: false,
        isLoading: false,
        error: null,

        // Modal actions
        showLogin: () => set({ 
          isLoginOpen: true, 
          isSignupOpen: false, 
          isForgotPasswordOpen: false,
          error: null 
        }),
        
        showSignup: () => set({ 
          isSignupOpen: true, 
          isLoginOpen: false, 
          isForgotPasswordOpen: false,
          error: null 
        }),
        
        showForgotPassword: () => set({ 
          isForgotPasswordOpen: true, 
          isLoginOpen: false, 
          isSignupOpen: false,
          error: null 
        }),
        
        hideAllModals: () => set({ 
          isLoginOpen: false, 
          isSignupOpen: false, 
          isForgotPasswordOpen: false,
          error: null 
        }),

        // Legacy support for existing code
        showHideLogin: (val: boolean) => set({ 
          isLoginOpen: val,
          ...(val ? { isSignupOpen: false, isForgotPasswordOpen: false } : {})
        }),
        
        showHideSignup: (val: boolean) => set({ 
          isSignupOpen: val,
          ...(val ? { isLoginOpen: false, isForgotPasswordOpen: false } : {})
        }),
        
        showHideForgotPassword: (val: boolean) => set({ 
          isForgotPasswordOpen: val,
          ...(val ? { isLoginOpen: false, isSignupOpen: false } : {})
        }),
        
        toggleLogin: (open: boolean) => set({ 
          isLoginOpen: open, 
          isSignupOpen: !open && get().isSignupOpen 
        }),
        
        toggleSignup: (open: boolean) => set({ 
          isSignupOpen: open, 
          isLoginOpen: !open && get().isLoginOpen 
        }),

        // User actions
        setUserData: (user: UserData) => set({ user }),
        
        setIsAuthenticated: (val: boolean) => set({ 
          isAuthenticated: val,
          ...(val ? {} : { user: null })
        }),
        
        clearUser: () => set({ 
          user: null, 
          isAuthenticated: false 
        }),

        // UI state actions
        setLoading: (loading: boolean) => set({ isLoading: loading }),
        
        setError: (error: string | null) => set({ error }),
        
        clearError: () => set({ error: null }),
      }),
      {
        name: 'datifyy-auth',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
);