import { Pressable } from 'react-native';
import { Path } from 'react-native-svg';

import { Svg } from './Svg';

// 피그마 Input/Checkbox (2026-11-18 기준). 디자인이 완성 전이라 수치가 바뀔 수 있다.
// 피그마 State 대응: Off = checked false(두 톤 공통), On = tone blue, On-black = tone black.
// Empty(테두리만 있는 빈 원)는 만들지 않기로 했다.
const SIZE = 30;
const CHECK_STROKE_WIDTH = 1.5;
const HIT_SLOP = 8;

const ON_BG = { blue: 'bg-blue-50', black: 'bg-black' } as const;

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  tone?: keyof typeof ON_BG;
  accessibilityLabel?: string;
};

export function Checkbox({
  checked,
  onChange,
  tone = 'blue',
  accessibilityLabel,
}: CheckboxProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked }}
      hitSlop={HIT_SLOP}
      onPress={() => onChange(!checked)}
      className={`items-center justify-center rounded-full ${checked ? ON_BG[tone] : 'bg-gray-20'}`}
      style={{ width: SIZE, height: SIZE }}>
      <Svg width={SIZE} height={SIZE} viewBox="0 0 30 30" className="text-white">
        <Path
          d="M8.96875 14.5312L12.911 18.7009C13.3266 19.1405 14.0343 19.1133 14.4149 18.6431L21.0312 10.4688"
          stroke="currentColor"
          strokeWidth={CHECK_STROKE_WIDTH}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    </Pressable>
  );
}
