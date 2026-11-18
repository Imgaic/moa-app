import { cssInterop } from 'nativewind';
import { useEffect, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

// placeholderClassName의 글자색(text-*)을 placeholderTextColor로 넘긴다.
cssInterop(TextInput, {
  className: { target: 'style', nativeStyleToProp: { textAlign: true } },
  placeholderClassName: { target: false, nativeStyleToProp: { color: 'placeholderTextColor' } },
});

// 피그마 Input/Text (2026-11-17 기준). 디자인이 완성 전이라 수치가 바뀔 수 있다.
const GAP = 'gap-[8px]';
const FIELD = 'h-[45px] flex-row items-center py-[2px]';
const LINE_DEFAULT = 'border-b border-gray-40';
// Android의 TextInput은 기본 세로 여백이 있어 칸(45) 안에서 큰 글자(28)의 윗부분이 잘린다. iOS와 웹은 원래 0이다.
// 웹의 브라우저 기본 포커스 테두리는 없앤다. 포커스 표시는 파란 밑줄이 맡는다.
const INPUT = 'flex-1 py-0 font-pretendard text-gray-50 web:outline-none';
// 포커스 밑줄(파랑, 1.5)은 회색 밑줄(1) 위에 겹쳐 두고 투명도로 나타낸다. 바깥 아래 끝을 회색 밑줄과 맞춘다.
const LINE_FOCUSED = { height: 1.5, bottom: -1 };
const CONFIRM_HIT_SLOP = 12;

// 포커스 밑줄 전환. 피그마에 값이 없어 구현에서 정했다. "동작 줄이기"가 켜져 있으면 바로 바뀐다.
const FOCUS_DURATION = 200;
const FOCUS_EASING = Easing.out(Easing.cubic);

type TextFieldProps = {
  value: string;
  onChangeText: (text: string) => void;
  maxLength: number;
  placeholder?: string;
  label?: string;
  helper?: string;
  confirmLabel?: string;
  onConfirm?: () => void;
};

// 상태: Empty(값이 없을 때) / Filled(값이 있을 때). 글자 크기는 값 유무로 정한다.
// 파란 밑줄은 포커스 표시다(피그마에는 포커스 상태가 따로 없다). 포커스가 없으면 값이 있어도 회색 밑줄이다.
export function TextField({
  value,
  onChangeText,
  maxLength,
  placeholder,
  label,
  helper,
  confirmLabel,
  onConfirm,
}: TextFieldProps) {
  const filled = value.length > 0;
  const [focused, setFocused] = useState(false);
  const focus = useSharedValue(0);

  useEffect(() => {
    focus.value = withTiming(focused ? 1 : 0, {
      duration: FOCUS_DURATION,
      easing: FOCUS_EASING,
      reduceMotion: ReduceMotion.System,
    });
  }, [focused, focus]);

  const focusLine = useAnimatedStyle(() => ({ opacity: focus.value }));

  return (
    <View className={GAP}>
      {label ? <Text className="font-pretendard text-body2 text-gray-50">{label}</Text> : null}

      <View className={`${FIELD} ${LINE_DEFAULT}`}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          maxLength={maxLength}
          placeholder={placeholder}
          accessibilityLabel={label ?? placeholder}
          className={`${INPUT} ${filled ? 'text-h2' : 'text-body2'}`}
          placeholderClassName="text-gray-30"
        />
        {confirmLabel ? (
          <Pressable
            accessibilityRole="button"
            hitSlop={CONFIRM_HIT_SLOP}
            onPress={onConfirm}>
            <Text className="font-pretendard text-caption-14 text-black">{confirmLabel}</Text>
          </Pressable>
        ) : null}
        <Animated.View
          pointerEvents="none"
          style={[{ position: 'absolute', left: 0, right: 0, ...LINE_FOCUSED }, focusLine]}>
          <View className="flex-1 bg-blue-50" />
        </Animated.View>
      </View>

      <View className="flex-row justify-between">
        <Text className="font-pretendard text-caption-14 text-gray-30">{helper}</Text>
        <Text className="font-pretendard text-caption-14 text-gray-30">
          {value.length}/{maxLength}
        </Text>
      </View>
    </View>
  );
}
