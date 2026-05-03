import api from './api';
import type { User } from '../types';
import { withMongoId } from '../utils/mongo';

export type AuthResponse = {
  access_token: string;
  user: User;
};

function normalizeUser(user: User & { _id?: string }): User {
  if (user.id != null && user.id !== '') {
    return user as User;
  }
  return withMongoId(user);
}

const unwrapAuth = (body: AuthResponse): AuthResponse => ({
  access_token: body.access_token,
  user: normalizeUser(body.user as User & { _id?: string }),
});

export const authService = {
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) =>
    api
      .post<AuthResponse>('/auth/register', data)
      .then((r) => unwrapAuth(r.data as AuthResponse)),

  login: (data: { email: string; password: string }) =>
    api
      .post<AuthResponse>('/auth/login', data)
      .then((r) => unwrapAuth(r.data as AuthResponse)),

  forgotPassword: (data: { email: string }) =>
    api
      .post<{ message: string }>('/auth/forgot-password', data)
      .then((r) => r.data as { message: string }),
};
