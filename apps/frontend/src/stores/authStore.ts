import { create } from "zustand";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  setAuthenticated: (authStatus: boolean) => void;
  setAdmin: (adminStatus: boolean) => void;
  user?: User;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: true,
  isAdmin: true,
  setAuthenticated: (authStatus) => set({ isAuthenticated: authStatus }),
  setAdmin: (adminStatus) => set({ isAdmin: adminStatus }),
  setUser: (user: User) => set({ user }),
}));

export default useAuthStore;
