import api from './api';
import type { Pet } from '../types';
import { withMongoId } from '../utils/mongo';

const mapPet = (raw: unknown): Pet =>
  withMongoId(raw as Pet & { _id?: unknown }) as unknown as Pet;

export const petsService = {
  createPet: (data: Partial<Pet>) =>
    api.post<unknown>('/pets', data).then((r) => mapPet(r.data)),

  getMyPets: () =>
    api.get<unknown[]>('/pets').then((r) => {
      const raw = r.data ?? [];
      return Array.isArray(raw) ? raw.map(mapPet) : [];
    }),

  getPetById: (id: string) =>
    api.get<unknown>(`/pets/${id}`).then((r) => mapPet(r.data)),

  updatePet: (id: string, data: Partial<Pet>) =>
    api.patch<unknown>(`/pets/${id}`, data).then((r) => mapPet(r.data)),

  deletePet: (id: string) => api.delete(`/pets/${id}`),
};
