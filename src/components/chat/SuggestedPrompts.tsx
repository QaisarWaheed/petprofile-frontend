import { Pressable, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

type Props = { prompts: string[]; onSelect: (text: string) => void };

export function SuggestedPrompts({ prompts, onSelect }: Props) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {prompts.map((p) => (
        <Pressable
          key={p}
          onPress={() => onSelect(p)}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.surface,
          }}
        >
          <Text style={{ color: colors.text.primary }}>{p}</Text>
        </Pressable>
      ))}
    </View>
  );
}
