// src/stores/useSnackbarStore.ts
import {create} from 'zustand';

type SnackbarState = {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
  show: (severity: 'success' | 'error' | 'info' | 'warning', message: string) => void;
  close: () => void;
};

export const useSnackbarStore = create<SnackbarState>((set) => ({
  open: false,
  message: '',
  severity: 'info',
  show: (severity, message) => set({ open: true, severity, message }),
  close: () => set({ open: false, message: '', severity: 'info' }),
}));
