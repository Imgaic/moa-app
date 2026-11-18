import { Pressable, Text, View } from 'react-native';

import type { BarTone } from '@/lib/availabilityGroups';
import { calendarDayLabel } from '@/lib/dateText';
import type { PickedShape } from '@/lib/pickedDates';

import type { DateCellProps } from './MonthDateCell';

// 피그마 Date Cell2(작은 달력 Calendar/Compact의 칸)와 Date Cell/Bar Compact (2026-11-18 기준). 디자인이 완성 전이라 수치가 바뀔 수 있다.
// 고른 날은 파란 원에 흰 글자, 이어진 날은 같은 높이의 파란 띠로 잇는다(가운데 날은 원 없이 띠만). 아래에 저장된 가능 시간 막대.
const CELL_HEIGHT = 58;
const ROW_HEIGHT = 24;
const CIRCLE_SIZE = 26;
const ROW_GAP = 3;
const BARS_HEIGHT = 29;
const BAR = 'h-[5px] rounded-[3px]';
const BARS_GAP = 'gap-[3px]';
const BAR_INSET = 2;
const MAX_BARS = 3;
// 피그마 "+" 글자는 6, 칸 높이 5
const PLUS_FONT_SIZE = 6;
const PLUS_HEIGHT = 5;
const SUNDAY = 0;

// 피그마 Bar Compact의 Available 색(#0018A2, #57679B, #98A0BB)은 팔레트에 없어 큰 달력과 같은 파란 토큰을 썼다.
const BAR_COLOR: Record<BarTone, string> = { 1: 'bg-blue-50', 2: 'bg-blue-40', 3: 'bg-blue-30' };

// 띠가 칸의 어느 쪽을 덮는지. 시작은 오른쪽 절반, 끝은 왼쪽 절반.
const BAND: Partial<Record<PickedShape, { left: string; right: string }>> = {
  start: { left: '50%', right: '0%' },
  middle: { left: '0%', right: '0%' },
  end: { left: '0%', right: '50%' },
};

// 큰 달력 칸과 같은 값을 받는다. today는 피그마 Date Cell2에 없어 그리지 않고 화면 낭독기 이름에만 쓴다.
export function CompactDateCell({ dateKey, day, weekday, disabled, shape, today, barTones, onPress }: DateCellProps) {
  const band = BAND[shape];
  const picked = shape !== 'none';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={calendarDayLabel(dateKey, { today, savedCount: barTones.length })}
      accessibilityState={{ disabled, selected: picked }}
      disabled={disabled}
      onPress={onPress}
      className="flex-1 items-center justify-center"
      style={{ height: CELL_HEIGHT, gap: ROW_GAP }}>
      <View className="items-center justify-center self-stretch" style={{ height: ROW_HEIGHT }}>
        {band ? <View className="absolute inset-y-0 bg-blue-50" style={band} /> : null}
        {picked && shape !== 'middle' ? (
          <View className="absolute rounded-full bg-blue-50" style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }} />
        ) : null}
        <Text className={`font-pretendard text-body2 ${numberColor(weekday, disabled, picked)}`}>{day}</Text>
      </View>
      <View className={`self-stretch ${BARS_GAP}`} style={{ height: BARS_HEIGHT, paddingHorizontal: BAR_INSET }}>
        {barTones.slice(0, MAX_BARS).map((tone, index) => (
          <View key={index} className={`${BAR} ${BAR_COLOR[tone]}`} />
        ))}
        {barTones.length > MAX_BARS ? (
          <Text
            className="text-center font-pretendard text-gray-40"
            style={{ fontSize: PLUS_FONT_SIZE, lineHeight: PLUS_HEIGHT }}>
            +
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

function numberColor(weekday: number, disabled: boolean, picked: boolean): string {
  if (picked) return 'text-white';
  if (disabled) return 'text-gray-30';
  if (weekday === SUNDAY) return 'text-red';
  return 'text-black';
}
