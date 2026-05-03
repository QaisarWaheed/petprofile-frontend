import {
  ActivityIndicator,
  Pressable,
  Text,
  type PressableProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { colors } from '../../theme/colors';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';

type Props = PressableProps & {
  title: string;
  variant?: Variant;
  loading?: boolean;
};

const variantStyles: Record<
  Variant,
  { container: ViewStyle; label: TextStyle }
> = {
  primary: {
    container: { backgroundColor: colors.primary },
    label: { color: '#fff' },
  },
  secondary: {
    container: { backgroundColor: colors.secondary },
    label: { color: '#fff' },
  },
  outline: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.primary,
    },
    label: { color: colors.primary },
  },
  ghost: {
    container: { backgroundColor: 'transparent' },
    label: { color: colors.primary },
  },
};

export function Button({
  title,
  variant = 'primary',
  loading,
  disabled,
  style,
  ...rest
}: Props) {
  const v = variantStyles[variant];
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      style={(state) => {
        const pressed = state.pressed;
        const user =
          typeof style === 'function' ? style(state) : style ?? undefined;
        return [
          {
            paddingVertical: 14,
            paddingHorizontal: 20,
            borderRadius: 12,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
            opacity: pressed || disabled || loading ? 0.7 : 1,
          },
          v.container,
          user,
        ];
      }}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? colors.primary : '#fff'} />
      ) : (
        <Text style={[{ fontSize: 16, fontWeight: '600' }, v.label]}>{title}</Text>
      )}
    </Pressable>
  );
}
