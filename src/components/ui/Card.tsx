import { View, type ViewProps } from 'react-native';
import { colors } from '../../theme/colors';

export function Card({ style, ...rest }: ViewProps) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: 16,
          padding: 16,
          borderWidth: 1,
          borderColor: colors.border,
        },
        style,
      ]}
      {...rest}
    />
  );
}
