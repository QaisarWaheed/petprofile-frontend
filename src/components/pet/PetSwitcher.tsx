import { Pressable, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import type { Pet } from '../../types';
import { PetAvatar } from './PetAvatar';

type Props = {
  pets: Pet[];
  activePet: Pet | null;
  onSelect: (pet: Pet) => void;
};

export function PetSwitcher({ pets, activePet, onSelect }: Props) {
  return (
    <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
      {pets.map((pet) => {
        const active = activePet?.id === pet.id;
        return (
          <Pressable
            key={pet.id}
            onPress={() => onSelect(pet)}
            style={{
              padding: 8,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: active ? colors.primary : colors.border,
              alignItems: 'center',
            }}
          >
            <PetAvatar pet={pet} size={40} />
            <Text style={{ marginTop: 4, color: colors.text.primary }}>
              {pet.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
