import { Image, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

type Props = { uri?: string; name?: string; size?: number };

export function Avatar({ uri, name, size = 44 }: Props) {
  const initial = name?.trim()?.charAt(0)?.toUpperCase() ?? '?';
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: 'hidden',
        backgroundColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {uri ? (
        <Image source={{ uri }} style={{ width: size, height: size }} />
      ) : (
        <Text style={{ color: colors.text.primary, fontWeight: '700' }}>
          {initial}
        </Text>
      )}
    </View>
  );
}
