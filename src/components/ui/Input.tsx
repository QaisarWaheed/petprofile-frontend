import { useState, type ReactNode } from 'react';
import {
  Text,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { colors } from '../../theme/colors';

type Props = TextInputProps & {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerStyle?: ViewStyle;
};

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  style,
  secureTextEntry,
  ...rest
}: Props) {
  const [hidden, setHidden] = useState(!!secureTextEntry);
  return (
    <View style={[{ marginBottom: 12 }, containerStyle]}>
      {label ? (
        <Text
          style={{
            marginBottom: 6,
            color: colors.text.secondary,
            fontWeight: '600',
          }}
        >
          {label}
        </Text>
      ) : null}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: error ? colors.error : colors.border,
          borderRadius: 12,
          backgroundColor: colors.surface,
          paddingHorizontal: 12,
        }}
      >
        {leftIcon}
        <TextInput
          placeholderTextColor={colors.text.muted}
          secureTextEntry={hidden}
          style={[
            {
              flex: 1,
              paddingVertical: 12,
              fontSize: 16,
              color: colors.text.primary,
            },
            style,
          ]}
          {...rest}
        />
        {secureTextEntry ? (
          <Text
            onPress={() => setHidden(!hidden)}
            style={{ color: colors.primary, fontWeight: '600' }}
          >
            {hidden ? 'Show' : 'Hide'}
          </Text>
        ) : null}
        {rightIcon}
      </View>
      {error ? (
        <Text style={{ color: colors.error, marginTop: 4, fontSize: 13 }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
