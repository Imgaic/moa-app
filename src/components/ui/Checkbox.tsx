import { Pressable } from 'react-native';
import { Path } from 'react-native-svg';

import { Svg } from './Svg';

// 피그마 Input/Checkbox (2026-11-17 기준). 디자인이 완성 전이라 수치가 바뀔 수 있다.
// 피그마의 Empty 변형(테두리만 있는 빈 원)은 용도가 확인되지 않아 만들지 않았다.
const SIZE = 30;
const CHECK_STROKE_WIDTH = 1.5;
const HIT_SLOP = 8;

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  accessibilityLabel?: string;
};

// 상태: Off(회색, 선택 안 함) / On(파랑, 선택함)
export function Checkbox({ checked, onChange, accessibilityLabel }: CheckboxProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked }}
      hitSlop={HIT_SLOP}
      onPress={() => onChange(!checked)}
      className={`items-center justify-center rounded-full ${checked ? 'bg-blue-50' : 'bg-gray-20'}`}
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
