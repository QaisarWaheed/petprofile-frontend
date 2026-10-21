import axios from 'axios';
import { router } from 'expo-router';
import { useAuthStore } from '../stores/auth.store';

const baseURL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

export const api = axios.create({
  baseURL,
  timeout: 30000,
});

export default api;

api.interceptors.request.use(async (config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    const body = response.data as { success?: boolean; data?: unknown };
    if (body && typeof body === 'object' && 'data' in body) {
      response.data = body.data;
    }
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      await useAuthStore.getState().logout();
      router.replace('/(auth)/login');
    }
    return Promise.reject(error);
  },
);
