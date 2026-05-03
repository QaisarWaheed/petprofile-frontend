import { Text, View } from 'react-native';
import { colors } from '../../theme/colors';

type Props = { title: string; description?: string };

export function EmptyState({ title, description }: Props) {
  return (
    <View style={{ padding: 24, alignItems: 'center' }}>
      <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text.primary }}>
        {title}
      </Text>
      {description ? (
        <Text
          style={{
            marginTop: 8,
            textAlign: 'center',
            color: colors.text.secondary,
          }}
        >
          {description}
        </Text>
      ) : null}
    </View>
  );
}
