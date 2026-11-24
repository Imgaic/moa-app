import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

// 피그마 Input/Toggle (2026-11-17 기준). 디자인이 완성 전이라 수치가 바뀔 수 있다.
// 피그마에서 손잡이 크기가 Off 14, On 16으로 다르다.
const TRACK = 'h-[20px] w-[45px] justify-center overflow-hidden rounded-full bg-gray-20';
const KNOB_OFF = { left: 3, size: 14 };
const KNOB_ON = { left: 27, size: 16 };
const HIT_SLOP = 12;

// 전환 애니메이션: 손잡이가 미끄러지며 커지고, 파란 바탕이 서서히 나타난다.
// 피그마에 값이 없어 구현에서 정했다. "동작 줄이기"가 켜져 있으면 ReduceMotion.System이 바로 바꾼다.
const DURATION = 200;
const EASING = Easing.out(Easing.cubic);

// 손잡이는 On 크기(16)로 On 자리에 두고, Off일 때 왼쪽으로 옮겨 줄인다.
const OFF_SHIFT = KNOB_OFF.left + KNOB_OFF.size / 2 - (KNOB_ON.left + KNOB_ON.size / 2);
const OFF_SCALE = KNOB_OFF.size / KNOB_ON.size;

type ToggleProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  accessibilityLabel?: string;
};

// 상태: Off / On
export function Toggle({ value, onValueChange, accessibilityLabel }: ToggleProps) {
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, {
      duration: DURATION,
      easing: EASING,
      reduceMotion: ReduceMotion.System,
    });
  }, [value, progress]);

  const onBackground = useAnimatedStyle(() => ({ opacity: progress.value }));
  const knob = useAnimatedStyle(() => ({
    transform: [
      { translateX: OFF_SHIFT * (1 - progress.value) },
      { scale: OFF_SCALE + (1 - OFF_SCALE) * progress.value },
    ],
  }));

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value }}
      hitSlop={HIT_SLOP}
      onPress={() => onValueChange(!value)}
      className={TRACK}>
      <Animated.View style={[StyleSheet.absoluteFill, onBackground]}>
        <View className="flex-1 bg-blue-50" />
      </Animated.View>
      <Animated.View
        style={[{ marginLeft: KNOB_ON.left, width: KNOB_ON.size, height: KNOB_ON.size }, knob]}>
        <View className="flex-1 rounded-full bg-white" />
      </Animated.View>
    </Pressable>
  );
}
