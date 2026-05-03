import { useEffect } from 'react';
import { usePetStore } from '../stores/pet.store';
import { petsService } from '../services/pets.service';

export function usePet() {
  const { pets, activePet, setPets, isLoading } = usePetStore();

  const fetchPets = async () => {
    try {
      const data = await petsService.getMyPets();
      setPets(data);
    } catch (e) {
      console.error('Failed to fetch pets', e);
    }
  };

  useEffect(() => {
    void fetchPets();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initial load only
  }, []);

  return { pets, activePet, fetchPets, isLoading };
}
