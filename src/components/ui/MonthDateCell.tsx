import { Pressable, Text, View } from 'react-native';

import type { BarTone } from '@/lib/availabilityGroups';
import { calendarDayLabel } from '@/lib/dateText';
import type { DateKey } from '@/lib/monthGrid';
import type { PickedShape } from '@/lib/pickedDates';

// 피그마 Date Cell(큰 달력 Calendar/Month의 칸)과 Date Cell/Bar (2026-11-18 기준). 디자인이 완성 전이라 수치가 바뀔 수 있다.
// 위에 날짜, 아래에 저장된 가능 시간 막대. 고른 날은 파란 테두리로, 이어진 날은 테두리를 이어 하나의 상자로 보인다.
const CELL_HEIGHT = 89;
const NUMBER_SIZE = 26;
const NUMBER_GAP = 5;
// 막대 세 개와 "+" 자리. 막대 수가 달라도 날짜 줄이 맞도록 높이를 고정한다.
const BARS_HEIGHT = 54;
const BAR = 'h-[10px] rounded-[3px]';
const BAR_INSET = 1;
const BARS_GAP = 'gap-[2px]';
const MAX_BARS = 3;
// 피그마 "+" 글자는 Inter 8, 막대 칸 높이 12
const PLUS_FONT_SIZE = 8;
const PLUS_HEIGHT = 12;
const SUNDAY = 0;

const BAR_COLOR: Record<BarTone, string> = { 1: 'bg-blue-50', 2: 'bg-blue-40', 3: 'bg-blue-30' };

// 테두리를 어느 쪽에 그릴지. 이어진 쪽은 테두리와 모서리를 뺀다.
const OUTLINE: Record<Exclude<PickedShape, 'none'>, string> = {
  single: 'border rounded-[4px]',
  start: 'border-y border-l rounded-l-[4px]',
  middle: 'border-y',
  end: 'border-y border-r rounded-r-[4px]',
};

export type DateCellProps = {
  // 화면 낭독기가 읽을 이름(몇 월, 무슨 요일)을 만드는 데 쓴다.
  dateKey: DateKey;
  day: number;
  // 0 = 일요일 ... 6 = 토요일. 일요일은 빨간 글자다.
  weekday: number;
  // 고를 수 없는 날(범위 밖, 앞뒤 달 칸). 회색이고 눌리지 않는다.
  disabled: boolean;
  shape: PickedShape;
  today: boolean;
  // 이 날짜가 든 저장된 묶음마다 막대 하나(색은 묶음 순서)
  barTones: BarTone[];
  onPress: () => void;
};

export function MonthDateCell({ dateKey, day, weekday, disabled, shape, today, barTones, onPress }: DateCellProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={calendarDayLabel(dateKey, { today, savedCount: barTones.length })}
      accessibilityState={{ disabled, selected: shape !== 'none' }}
      disabled={disabled}
      onPress={onPress}
      className={`flex-1 items-center justify-center border-blue-50 ${shape === 'none' ? '' : OUTLINE[shape]}`}
      style={{ height: CELL_HEIGHT, gap: NUMBER_GAP }}>
      <View
        className={`items-center justify-center rounded-full ${today ? 'border border-blue-50' : ''}`}
        style={{ width: NUMBER_SIZE, height: NUMBER_SIZE }}>
        <Text className={`font-pretendard text-body2 ${numberColor(weekday, disabled)}`}>{day}</Text>
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

function numberColor(weekday: number, disabled: boolean): string {
  if (disabled) return 'text-gray-30';
  if (weekday === SUNDAY) return 'text-red';
  return 'text-black';
}
