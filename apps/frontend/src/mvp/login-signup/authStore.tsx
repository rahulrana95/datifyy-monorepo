import { create } from "zustand";

interface AuthState {
    isLoginOpen: boolean;
    isSignupOpen: boolean;
    isAuthenticated: boolean;
    isAdmin: boolean;
    toggleLogin: (open: boolean) => void;
    toggleSignup: (open: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isLoginOpen: false,
    isSignupOpen: false,
    isAuthenticated: true,
    isAdmin: true,
    toggleLogin: (open) => set({ isLoginOpen: open, isSignupOpen: !open }),
    toggleSignup: (open) => set({ isSignupOpen: open, isLoginOpen: !open }),
}));
