import { Text, View } from 'react-native';
import { colors } from '../../theme/colors';

export function TypingIndicator() {
  return (
    <View
      style={{
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: colors.border,
      }}
    >
      <Text style={{ color: colors.text.secondary }}>Pet assistant is typing…</Text>
    </View>
  );
}
