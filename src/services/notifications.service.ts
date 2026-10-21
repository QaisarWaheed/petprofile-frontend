import api from './api';

export const notificationsService = {
  getPreferences: () => api.get('/notifications/preferences'),

  updatePreferences: (data: Record<string, boolean>) =>
    api.patch('/notifications/preferences', data),

  /** Optional endpoint — register when backend adds push token route. */
  registerPushToken: (token: string) =>
    api.post('/notifications/push-token', { token }),
};
