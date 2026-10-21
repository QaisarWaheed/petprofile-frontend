import { Avatar } from '../ui/Avatar';
import type { Pet } from '../../types';

export function PetAvatar({ pet, size = 48 }: { pet: Pet; size?: number }) {
  return <Avatar uri={pet.profilePhoto} name={pet.name} size={size} />;
}
