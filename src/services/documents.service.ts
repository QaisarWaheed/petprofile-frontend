import { api } from './api';
import type { Document } from '../types';

export const documentsService = {
  upload: (petId: string, formData: FormData) =>
    api
      .post<Document>(`/documents/upload/${petId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data),

  listByPet: (petId: string) =>
    api.get<Document[]>(`/documents/pet/${petId}`).then((r) => r.data),

  remove: (id: string) => api.delete(`/documents/${id}`).then((r) => r.data),
};
