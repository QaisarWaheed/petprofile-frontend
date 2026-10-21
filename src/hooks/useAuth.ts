import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/auth.store';
import { authService } from '../services/auth.service';
import api from '../services/api';
import type { User } from '../types';
import { withMongoId } from '../utils/mongo';

export function useAuth() {
  const queryClient = useQueryClient();
  const { user, token, isAuthenticated, isLoading, login, logout } =
    useAuthStore();

  const meQuery = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await api.get<User>('/users/me');
      return normalizeMe(res.data as User & { _id?: string });
    },
    enabled: !!token && isAuthenticated,
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: async (data) => {
      await login(data.access_token, data.user);
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: async (data) => {
      await login(data.access_token, data.user);
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });

  return {
    user: meQuery.data ?? user,
    token,
    isAuthenticated,
    isLoading: isLoading || meQuery.isLoading,
    loginMutation,
    registerMutation,
    logout,
  };
}

function normalizeMe(u: User & { _id?: string }): User {
  if (u.id != null && u.id !== '') {
    return u as User;
  }
  return withMongoId(u);
}
