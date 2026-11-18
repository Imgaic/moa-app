import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { durationText } from '@/lib/planCreateText';

// 피그마 03 Create / Duration의 Duration Picker (2026-11-18 기준). 디자인이 완성 전이라 수치가 바뀔 수 있다.
// 30분 단위로 늘리고 줄인다. 최대값은 미정이라(Q1) 가장 단순한 값으로 두었다(docs/open-questions.md).
const DURATION_STEP_MINUTES = 30;
const MIN_DURATION_MINUTES = 30;
const MAX_DURATION_MINUTES = 12 * 60;
const BUTTON_SIZE = 24;
const HIT_SLOP = 12;

type DurationPickerProps = {
  minutes: number;
  onChange: (minutes: number) => void;
};

export function DurationPicker({ minutes, onChange }: DurationPickerProps) {
  return (
    <View className="flex-row items-center gap-[14px]">
      <StepButton
        icon="minus"
        label="30분 줄이기"
        disabled={minutes <= MIN_DURATION_MINUTES}
        onPress={() => onChange(minutes - DURATION_STEP_MINUTES)}
      />
      <Text accessibilityLiveRegion="polite" className="font-pretendard text-h1 text-black">
        {durationText(minutes)}
      </Text>
      <StepButton
        icon="plus"
        label="30분 늘리기"
        disabled={minutes >= MAX_DURATION_MINUTES}
        onPress={() => onChange(minutes + DURATION_STEP_MINUTES)}
      />
    </View>
  );
}

// 피그마 Button/minus, Button/Add: gray-10 원 안의 아이콘
function StepButton({
  icon,
  label,
  disabled,
  onPress,
}: {
  icon: 'minus' | 'plus';
  label: string;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={HIT_SLOP}
      onPress={onPress}
      className="items-center justify-center rounded-full bg-gray-10"
      style={{ width: BUTTON_SIZE, height: BUTTON_SIZE }}>
      <Icon name={icon} className={disabled ? 'text-gray-30' : 'text-gray-60'} />
    </Pressable>
  );
}
