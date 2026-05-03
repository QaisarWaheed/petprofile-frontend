import { Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import type { Pet } from '../../types';
import { Card } from '../ui/Card';
import { PetAvatar } from './PetAvatar';

export function PetCard({ pet }: { pet: Pet }) {
  return (
    <Card style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
      <PetAvatar pet={pet} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text.primary }}>
          {pet.name}
        </Text>
        <Text style={{ color: colors.text.secondary }}>
          {pet.species} · {pet.gender}
        </Text>
      </View>
    </Card>
  );
}
