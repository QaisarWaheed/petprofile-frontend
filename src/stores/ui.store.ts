import { create } from 'zustand';

export type Toast = { id: string; message: string; type?: 'info' | 'error' };

type UiState = {
  loading: boolean;
  toasts: Toast[];
  setLoading: (v: boolean) => void;
  pushToast: (message: string, type?: Toast['type']) => void;
  dismissToast: (id: string) => void;
};

export const useUiStore = create<UiState>((set) => ({
  loading: false,
  toasts: [],
  setLoading: (loading) => set({ loading }),
  pushToast: (message, type = 'info') =>
    set((s) => ({
      toasts: [...s.toasts, { id: `${Date.now()}`, message, type }],
    })),
  dismissToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
