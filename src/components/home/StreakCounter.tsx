import { Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { colors } from '../../theme/colors';

export function StreakCounter({ streak }: { streak: number }) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (streak > 0) {
      scale.value = withSequence(
        withTiming(1.15, { duration: 180 }),
        withTiming(1, { duration: 180 }),
      );
    }
  }, [streak, scale]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          padding: 12,
          borderRadius: 14,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      <Text style={{ fontSize: 28 }}>🔥</Text>
      <View>
        <Text style={{ color: colors.text.secondary, fontSize: 13 }}>Streak</Text>
        <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text.primary }}>
          {streak} days
        </Text>
      </View>
    </Animated.View>
  );
}
