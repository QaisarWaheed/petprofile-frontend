import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import type { User } from '../types';

const AUTH_TOKEN_KEY = 'auth_token';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  setLoading: (val: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (token, user) => {
    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
    set({
      token,
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  updateUser: (partial) => {
    const prev = get().user;
    if (!prev) {
      return;
    }
    const next = { ...prev, ...partial } as User;
    set({ user: next });
  },

  setLoading: (val) => set({ isLoading: val }),
}));
