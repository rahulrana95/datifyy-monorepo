import { create } from "zustand";

export interface UserData {
    id: string;
    email: string;
    isAdmin: boolean;
    name: string
}

interface AuthState {
    user?: UserData | null,
    isLoginOpen: boolean;
    isSignupOpen: boolean;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isForgotPasswordOpen: boolean;
    setUserData: (user: UserData) => void;
    toggleLogin: (open: boolean) => void;
    toggleSignup: (open: boolean) => void;
    showHideLogin: (val: boolean) => void;
    showHideSignup: (val: boolean) => void;
    showHideForgotPassword: (val: boolean) => void;
    setIsAuthenticated: (val: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoginOpen: false,
    isSignupOpen: false,
    isAuthenticated: false,
    isAdmin: false,
    isForgotPasswordOpen: false,
    setUserData: (user: UserData) => set((state) => ({ user })),
    showHideLogin: (val: boolean) => set((state) => ({ isLoginOpen: val })),
    setIsAuthenticated: (val: boolean) => set((state) => ({ isAuthenticated: val })),
    showHideSignup: (val) => set((state) => ({ isSignupOpen: val })),
    showHideForgotPassword: (val) => set((state) => ({ isForgotPasswordOpen: val })),
    toggleLogin: (open) => set({ isLoginOpen: open, isSignupOpen: !open }),
    toggleSignup: (open) => set({ isSignupOpen: open, isLoginOpen: !open }),
}));
