import { Pressable, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import type { LogType } from '../../types';

const types: { type: LogType; label: string }[] = [
  { type: 'meal', label: 'Meal' },
  { type: 'walk', label: 'Walk' },
  { type: 'mood', label: 'Mood' },
  { type: 'behaviour', label: 'Behaviour' },
  { type: 'symptom', label: 'Symptom' },
  { type: 'medication', label: 'Meds' },
  { type: 'vet_visit', label: 'Vet' },
  { type: 'grooming', label: 'Groom' },
  { type: 'expense', label: 'Expense' },
  { type: 'weight', label: 'Weight' },
];

type Props = { onSelect: (type: LogType) => void };

export function LogTypeGrid({ onSelect }: Props) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
      {types.map((item) => (
        <Pressable
          key={item.type}
          onPress={() => onSelect(item.type)}
          style={{
            width: '30%',
            paddingVertical: 14,
            borderRadius: 12,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: colors.text.primary, fontWeight: '600' }}>
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
