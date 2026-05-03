import { create } from 'zustand';
import type { Pet } from '../types';

type PetState = {
  pets: Pet[];
  activePet: Pet | null;
  isLoading: boolean;
  setPets: (pets: Pet[]) => void;
  setActivePet: (pet: Pet | null) => void;
  addPet: (pet: Pet) => void;
  updatePet: (pet: Pet) => void;
};

export const usePetStore = create<PetState>((set, get) => ({
  pets: [],
  activePet: null,
  isLoading: false,

  setPets: (pets) => {
    const activeId = get().activePet?.id;
    const nextActive =
      pets.find((p) => p.id === activeId) ?? pets[0] ?? null;
    set({ pets, activePet: nextActive });
  },

  setActivePet: (pet) => set({ activePet: pet }),

  addPet: (pet) =>
    set((s) => ({
      pets: [...s.pets, pet],
      activePet: s.activePet ?? pet,
    })),

  updatePet: (pet) =>
    set((s) => ({
      pets: s.pets.map((p) => (p.id === pet.id ? pet : p)),
      activePet: s.activePet?.id === pet.id ? pet : s.activePet,
    })),
}));
