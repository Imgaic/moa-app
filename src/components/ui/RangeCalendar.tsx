import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { dayCellState, type DateRange, type DayCellState } from '@/lib/dateRange';
import {
  addMonths,
  isEarlierMonth,
  monthGrid,
  yearMonthOf,
  type CalendarDay,
  type DateKey,
} from '@/lib/monthGrid';

import { Icon } from './Icon';
import { WeekdayRow } from './WeekdayRow';

// 피그마 Calendar/Range, Date Cell/Range (2026-11-18 기준). 디자인이 완성 전이라 수치가 바뀔 수 있다.
// 피그마는 칸 너비 46 × 7 = 322를 카드(338) 가운데 둔다. 화면이 좁아도 넘치지 않게 칸을 같은 비율로 나눈다.
const CARD = 'gap-[14px] rounded-[13px] bg-white px-[8px]';
// 5주짜리 달에서 피그마 카드 높이(292)가 나오는 위아래 여백
const CARD_PADDING_Y = 7.5;
const ROW_GAP = 'gap-[4px]';
const CELL_HEIGHT = 40;
const CIRCLE_SIZE = 40;
const ARROW_SIZE = 18;
const HIT_SLOP = 12;

const SUNDAY = 0;
const SATURDAY = 6;

// 띠(blue-10)가 칸의 어느 쪽을 덮는지. 시작은 오른쪽 절반, 끝은 왼쪽 절반.
const BAND: Partial<Record<DayCellState, { left: string; right: string }>> = {
  start: { left: '50%', right: '0%' },
  inRange: { left: '0%', right: '0%' },
  end: { left: '0%', right: '50%' },
};

type RangeCalendarProps = {
  range: DateRange;
  // 이 날보다 앞은 고를 수 없고, 이 달보다 앞으로는 넘기지 않는다.
  today: DateKey;
  onPickDate: (key: DateKey) => void;
};

export function RangeCalendar({ range, today, onPickDate }: RangeCalendarProps) {
  const [visible, setVisible] = useState(() => yearMonthOf(range.start ?? today));
  const canGoBack = isEarlierMonth(yearMonthOf(today), visible);

  return (
    <View className={CARD} style={{ paddingVertical: CARD_PADDING_Y }}>
      <View className="flex-row items-center justify-center gap-[5px]">
        <ArrowButton
          icon="back"
          label="이전 달"
          disabled={!canGoBack}
          onPress={() => setVisible(addMonths(visible, -1))}
        />
        <Text className="font-pretendard text-body2 text-black">
          {visible.year}년 {visible.month}월
        </Text>
        <ArrowButton icon="chevron-right" label="다음 달" onPress={() => setVisible(addMonths(visible, 1))} />
      </View>

      <WeekdayRow />

      <View className={ROW_GAP}>
        {monthGrid(visible).map((week) => (
          <View key={week[0].key} className="flex-row">
            {week.map((day) => (
              <DateCell
                key={day.key}
                day={day}
                state={dayCellState(range, day, today)}
                onPress={() => onPickDate(day.key)}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

function DateCell({ day, state, onPress }: { day: CalendarDay; state: DayCellState; onPress: () => void }) {
  const band = BAND[state];
  const circled = state === 'start' || state === 'end' || state === 'single';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${day.day}일`}
      accessibilityState={{ disabled: state === 'disabled', selected: circled }}
      disabled={state === 'disabled'}
      onPress={onPress}
      className="flex-1 items-center justify-center"
      style={{ height: CELL_HEIGHT }}>
      {band ? <View className="absolute inset-y-0 bg-blue-10" style={band} /> : null}
      {circled ? (
        <View className="absolute rounded-full bg-blue-50" style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }} />
      ) : null}
      <Text className={`font-pretendard text-body2 ${dayColor(day, state, circled)}`}>{day.day}</Text>
    </Pressable>
  );
}

function ArrowButton({
  icon,
  label,
  disabled = false,
  onPress,
}: {
  icon: 'back' | 'chevron-right';
  label: string;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={HIT_SLOP}
      onPress={onPress}>
      <Icon name={icon} size={ARROW_SIZE} className={disabled ? 'text-gray-30' : 'text-gray-60'} />
    </Pressable>
  );
}

// 날짜 글자색: 원 안은 흰색, 고를 수 없으면 gray-30, 일요일 red, 토요일 gray-50 (피그마 Calendar/Range 예시)
function dayColor(day: CalendarDay, state: DayCellState, circled: boolean): string {
  if (circled) return 'text-white';
  if (state === 'disabled') return 'text-gray-30';
  if (day.weekday === SUNDAY) return 'text-red';
  if (day.weekday === SATURDAY) return 'text-gray-50';
  return 'text-gray-60';
}
