import {create} from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  setAuthenticated: (authStatus: boolean) => void;
  setAdmin: (adminStatus: boolean) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: true,
  isAdmin: true,
  setAuthenticated: (authStatus) => set({ isAuthenticated: authStatus }),
  setAdmin: (adminStatus) => set({ isAdmin: adminStatus }),
}));

export default useAuthStore;
