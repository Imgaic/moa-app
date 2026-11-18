import { View } from 'react-native';

import { monthGrid, type CalendarDay, type DateKey, type YearMonth } from '@/lib/monthGrid';

import { CompactDateCell } from './CompactDateCell';
import type { DayLook } from './MonthCalendar';
import { WeekdayRow } from './WeekdayRow';

// 피그마 Calendar/Compact (2026-11-18 기준). 디자인이 완성 전이라 수치가 바뀔 수 있다.
// 시간 카드가 열렸을 때의 작은 달력: 요일 줄과 작은 날짜 칸(높이 58). 달 이름은 상단 바 가운데에 있고 넘기는 화살표는 없다.
const GRID_TOP = 16;

type CompactCalendarProps = {
  month: YearMonth;
  lookOf: (day: CalendarDay) => DayLook;
  onPressDay: (key: DateKey) => void;
};

export function CompactCalendar({ month, lookOf, onPressDay }: CompactCalendarProps) {
  return (
    <View>
      <WeekdayRow />
      <View style={{ marginTop: GRID_TOP }}>
        {monthGrid(month).map((week) => (
          <View key={week[0].key} className="flex-row">
            {week.map((day) => (
              <CompactDateCell
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
