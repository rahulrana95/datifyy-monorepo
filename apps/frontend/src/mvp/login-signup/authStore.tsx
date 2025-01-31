import { create } from "zustand";

interface AuthState {
    isLoginOpen: boolean;
    isSignupOpen: boolean;
    toggleLogin: (open: boolean) => void;
    toggleSignup: (open: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isLoginOpen: false,
    isSignupOpen: false,
    toggleLogin: (open) => set({ isLoginOpen: open, isSignupOpen: !open }),
    toggleSignup: (open) => set({ isSignupOpen: open, isLoginOpen: !open }),
}));
