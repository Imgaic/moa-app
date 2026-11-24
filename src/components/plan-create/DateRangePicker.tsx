import { View } from 'react-native';

import { InputField, InputFieldGroup } from '@/components/ui/InputField';
import { RangeCalendar } from '@/components/ui/RangeCalendar';
import type { DateRange } from '@/lib/dateRange';
import type { DateKey } from '@/lib/monthGrid';
import { monthDayText } from '@/lib/planCreateText';

// 피그마 03 Create / Date Range의 본문: 시작과 종료 칸, 그 아래 달력.
// 흰 바탕으로 뜬 칸이 다음에 누를 날짜가 들어갈 자리다(시작일만 골랐으면 종료, 아니면 시작).
const GAP = 'gap-[14px]';
const EMPTY_VALUE = '-';

type DateRangePickerProps = {
  range: DateRange;
  today: DateKey;
  onChange: (key: DateKey) => void;
};

export function DateRangePicker({ range, today, onChange }: DateRangePickerProps) {
  const pickingEnd = range.start !== null && range.end === null;
  return (
    <View className={GAP}>
      <InputFieldGroup>
        <InputField label="시작" value={dateValue(range.start)} selected={!pickingEnd} />
        <InputField label="종료" value={dateValue(range.end)} selected={pickingEnd} />
      </InputFieldGroup>
      <RangeCalendar range={range} today={today} onPickDate={onChange} />
    </View>
  );
}

const dateValue = (key: DateKey | null) => (key ? monthDayText(key) : EMPTY_VALUE);
