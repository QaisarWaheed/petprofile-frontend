import { Pressable, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

type Props = { onPick: (type: 'meal' | 'walk' | 'mood') => void };

export function QuickLogBar({ onPick }: Props) {
  return (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      {(
        [
          { key: 'meal' as const, label: 'Meal' },
          { key: 'walk' as const, label: 'Walk' },
          { key: 'mood' as const, label: 'Mood' },
        ]
      ).map((item) => (
        <Pressable
          key={item.key}
          onPress={() => onPick(item.key)}
          style={{
            flex: 1,
            paddingVertical: 12,
            borderRadius: 12,
            backgroundColor: colors.primary,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '700' }}>{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}
