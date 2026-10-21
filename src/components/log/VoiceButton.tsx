import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

type Props = {
  isRecording: boolean;
  onPressIn: () => void;
  onPressOut: () => void;
};

export function VoiceButton({ isRecording, onPressIn, onPressOut }: Props) {
  const pulse = useSharedValue(1);
  const b1 = useSharedValue(6);
  const b2 = useSharedValue(10);
  const b3 = useSharedValue(8);

  useEffect(() => {
    if (isRecording) {
      pulse.value = withRepeat(withTiming(1.12, { duration: 450 }), -1, true);
      b1.value = withRepeat(withTiming(22, { duration: 320 }), -1, true);
      b2.value = withRepeat(withTiming(26, { duration: 410 }), -1, true);
      b3.value = withRepeat(withTiming(20, { duration: 360 }), -1, true);
    } else {
      pulse.value = withTiming(1, { duration: 200 });
      b1.value = withTiming(4, { duration: 200 });
      b2.value = withTiming(4, { duration: 200 });
      b3.value = withTiming(4, { duration: 200 });
    }
  }, [isRecording, b1, b2, b3, pulse]);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const s1 = useAnimatedStyle(() => ({ height: b1.value }));
  const s2 = useAnimatedStyle(() => ({ height: b2.value }));
  const s3 = useAnimatedStyle(() => ({ height: b3.value }));

  return (
    <Pressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={{ alignItems: 'center' }}
    >
      <Animated.View
        style={[
          {
            width: 96,
            height: 96,
            borderRadius: 48,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
          },
          circleStyle,
        ]}
      >
        <MaterialIcons name="mic" size={40} color="#fff" />
      </Animated.View>
      {isRecording ? (
        <View
          style={{
            marginTop: 14,
            flexDirection: 'row',
            alignItems: 'flex-end',
            gap: 6,
            height: 32,
          }}
        >
          <Animated.View
            style={[
              { width: 6, borderRadius: 3, backgroundColor: colors.primaryDark },
              s1,
            ]}
          />
          <Animated.View
            style={[
              { width: 6, borderRadius: 3, backgroundColor: colors.primary },
              s2,
            ]}
          />
          <Animated.View
            style={[
              { width: 6, borderRadius: 3, backgroundColor: colors.primaryDark },
              s3,
            ]}
          />
        </View>
      ) : null}
    </Pressable>
  );
}
