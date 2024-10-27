// src/stores/userStore.ts

import {create} from "zustand";

interface UserState {
  isAuthenticated: boolean;
  userEmail: string | null;
  setUser: (email: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  isAuthenticated: false,
  userEmail: null,
  setUser: (email: string) => set({ isAuthenticated: true, userEmail: email }),
  logout: () => set({ isAuthenticated: false, userEmail: null }),
}));
