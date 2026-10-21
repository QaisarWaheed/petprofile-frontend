import { Text, View } from 'react-native';
import { colors } from '../../theme/colors';

type Props = { label: string; tone?: 'neutral' | 'success' | 'warning' };

export function Badge({ label, tone = 'neutral' }: Props) {
  const bg =
    tone === 'success'
      ? colors.success
      : tone === 'warning'
        ? colors.warning
        : colors.border;
  return (
    <View
      style={{
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: bg,
      }}
    >
      <Text style={{ color: colors.text.primary, fontSize: 12, fontWeight: '600' }}>
        {label}
      </Text>
    </View>
  );
}
