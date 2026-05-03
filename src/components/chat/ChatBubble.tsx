import { Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import type { ChatMessage } from '../../types';

export function ChatBubble({ message }: { message: ChatMessage }) {
  const mine = message.role === 'user';
  return (
    <View
      style={{
        alignSelf: mine ? 'flex-end' : 'flex-start',
        maxWidth: '85%',
        marginVertical: 4,
        padding: 12,
        borderRadius: 14,
        backgroundColor: mine ? colors.primary : colors.border,
      }}
    >
      <Text style={{ color: mine ? '#fff' : colors.text.primary }}>{message.content}</Text>
    </View>
  );
}
