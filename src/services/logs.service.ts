import api from './api';
import type { Log, LogType } from '../types';
import { withMongoId } from '../utils/mongo';

const mapLog = (raw: unknown): Log =>
  withMongoId(raw as Log & { _id?: unknown }) as unknown as Log;

export const logsService = {
  createLog: (data: {
    petId: string;
    type: LogType | string;
    data: Record<string, unknown>;
    voiceTranscript?: string;
    loggedAt?: string;
    attachments?: string[];
  }) => api.post<unknown>('/logs', data).then((r) => mapLog(r.data)),

  getLogsByPet: (petId: string, params?: { limit?: number; type?: string }) =>
    api.get<unknown[]>(`/logs/pet/${petId}`, { params }).then((r) => {
      const raw = r.data ?? [];
      return Array.isArray(raw) ? raw.map(mapLog) : [];
    }),

  getLogById: (id: string) =>
    api.get<unknown>(`/logs/${id}`).then((r) => mapLog(r.data)),

  deleteLog: (id: string) => api.delete(`/logs/${id}`),
};
