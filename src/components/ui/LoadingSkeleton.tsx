import { View } from 'react-native';
import { colors } from '../../theme/colors';

export function LoadingSkeleton({ height = 16, width = '100%' as const }) {
  return (
    <View
      style={{
        height,
        width,
        borderRadius: 8,
        backgroundColor: colors.border,
        opacity: 0.6,
      }}
    />
  );
}
