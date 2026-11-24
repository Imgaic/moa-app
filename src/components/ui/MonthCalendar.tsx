import { Pressable, Text, View } from 'react-native';

import { monthGrid, type CalendarDay, type DateKey, type YearMonth } from '@/lib/monthGrid';

import { Icon } from './Icon';
import { MonthDateCell, type DateCellProps } from './MonthDateCell';
import { WeekdayRow } from './WeekdayRow';

// 피그마 Calendar/Month (2026-11-18 기준). 디자인이 완성 전이라 수치가 바뀔 수 있다.
// 왼쪽 위 달 넘기기, 요일 줄, 큰 날짜 칸(높이 89). 오른쪽 위 "내 일정" 토글은 이번 범위가 아니라 그리지 않는다.
// 칸 너비는 피그마처럼 달력 너비를 7로 나눈다(338 → 48.3).
const HEADER_TOP = 20;
const WEEKDAY_TOP = 10;
const GRID_TOP = 10;
const ARROW_SIZE = 18;
const HIT_SLOP = 12;

export type DayLook = Omit<DateCellProps, 'dateKey' | 'day' | 'weekday' | 'onPress'>;

type MonthCalendarProps = {
  month: YearMonth;
  canGoBack: boolean;
  canGoForward: boolean;
  onChangeMonth: (step: -1 | 1) => void;
  lookOf: (day: CalendarDay) => DayLook;
  onPressDay: (key: DateKey) => void;
};

export function MonthCalendar({
  month,
  canGoBack,
  canGoForward,
  onChangeMonth,
  lookOf,
  onPressDay,
}: MonthCalendarProps) {
  return (
    <View>
      <View className="flex-row items-center gap-[1px]" style={{ marginTop: HEADER_TOP }}>
        <ArrowButton icon="back" label="이전 달" disabled={!canGoBack} onPress={() => onChangeMonth(-1)} />
        <Text className="font-pretendard text-caption-14 text-black">
          {month.year}년 {month.month}월
        </Text>
        <ArrowButton
          icon="chevron-right"
          label="다음 달"
          disabled={!canGoForward}
          onPress={() => onChangeMonth(1)}
        />
      </View>
      <View style={{ marginTop: WEEKDAY_TOP }}>
        <WeekdayRow />
      </View>
      <View style={{ marginTop: GRID_TOP }}>
        {monthGrid(month).map((week) => (
          <View key={week[0].key} className="flex-row">
            {week.map((day) => (
              <MonthDateCell
                key={day.key}
                dateKey={day.key}
                day={day.day}
                weekday={day.weekday}
                {...lookOf(day)}
                onPress={() => onPressDay(day.key)}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

type ArrowButtonProps = {
  icon: 'back' | 'chevron-right';
  label: string;
  disabled: boolean;
  onPress: () => void;
};

function ArrowButton({ icon, label, disabled, onPress }: ArrowButtonProps) {
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
