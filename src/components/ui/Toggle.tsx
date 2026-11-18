import { Pressable, View } from 'react-native';

// 피그마 Input/Toggle (2026-11-17 기준). 디자인이 완성 전이라 수치가 바뀔 수 있다.
// 피그마에서 손잡이 크기가 Off 14, On 16으로 다르다.
const TRACK = 'h-[20px] w-[45px] justify-center rounded-full';
const KNOB_OFF = 'ml-[3px] h-[14px] w-[14px]';
const KNOB_ON = 'ml-[27px] h-[16px] w-[16px]';
const HIT_SLOP = 12;

type ToggleProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  accessibilityLabel?: string;
};

// 상태: Off / On
export function Toggle({ value, onValueChange, accessibilityLabel }: ToggleProps) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value }}
      hitSlop={HIT_SLOP}
      onPress={() => onValueChange(!value)}
      className={`${TRACK} ${value ? 'bg-blue-50' : 'bg-gray-20'}`}>
      <View className={`rounded-full bg-white ${value ? KNOB_ON : KNOB_OFF}`} />
    </Pressable>
  );
}
