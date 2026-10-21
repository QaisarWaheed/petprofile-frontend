import api from './api';

export type ChatHistoryItem = {
  role: 'user' | 'assistant';
  content: string;
};

export const aiService = {
  chat: (data: {
    petId: string;
    message: string;
    history: ChatHistoryItem[];
  }) =>
    api.post<string | { message?: string }>('/ai/chat', data).then((r) => r.data),

  talkAsPet: (petId: string, message: string) =>
    api.post<string>('/ai/talk-as-pet', { petId, message }).then((r) => r.data),

  transcribeVoice: (formData: FormData) =>
    api.post<string>('/ai/transcribe', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),

  /** Alias for voice logging hooks. */
  transcribe: (formData: FormData) =>
    api.post<string>('/ai/transcribe', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),

  /** Backend uses POST /ai/weekly-summary with body `{ petId }`. */
  getWeeklySummary: (petId: string) =>
    api.post<string>('/ai/weekly-summary', { petId }).then((r) => r.data),
};
