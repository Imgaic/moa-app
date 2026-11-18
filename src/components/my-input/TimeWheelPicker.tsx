import { useState } from 'react';
import { Text, View } from 'react-native';

import { TimeRangeTabs, type TimeEdge } from '@/components/ui/TimeRangeTabs';
import { WheelColumn } from '@/components/ui/WheelColumn';
import { clockText, fromClockParts, toClockParts, type ClockParts, type Meridiem } from '@/lib/clockTime';

// 시간 선택(타임 휠 안, 피그마 Input/Time Picker). 시작/종료 칸에서 고칠 쪽을 고르고, 오전·오후 / 시 / 분 휠로 바꾼다.
// 밖에서는 시작과 종료 시각만 주고받는다. 다음 작업의 막대 안이 같은 props로 이 자리에 들어온다.
// 피그마 기준(2026-11-18): 칸 사이 42, 칸 너비 30 / 18 / 18 / 22. 글자가 잘리지 않게 칸 너비는 조금 넓혔다.
// 칸을 양 끝에 맞춰 놓고 줄의 최대 너비만 정해, 카드가 좁으면 칸 사이가 42보다 준다.
const COLUMN_GAP = 42;
const TABS_GAP = 'gap-[16px]';
const MERIDIEM_WIDTH = 36;
const HOUR_WIDTH = 28;
const COLON_WIDTH = 18;
const MINUTE_WIDTH = 28;
const ROW_MAX_WIDTH = MERIDIEM_WIDTH + HOUR_WIDTH + COLON_WIDTH + MINUTE_WIDTH + COLUMN_GAP * 3;
// 분은 5분 단위다(피그마 예시 55, 00, 05). 단위는 미정이라 가장 단순하게 두었다(docs/open-questions.md).
const MINUTE_STEP = 5;

const MERIDIEMS: Meridiem[] = ['오전', '오후'];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 60 / MINUTE_STEP }, (_, i) => i * MINUTE_STEP);

export type TimeRangePickerProps = {
  // 자정부터 센 분(600 = 오전 10:00)
  startMinutes: number;
  endMinutes: number;
  onChange: (startMinutes: number, endMinutes: number) => void;
};

export function TimeWheelPicker({ startMinutes, endMinutes, onChange }: TimeRangePickerProps) {
  const [editing, setEditing] = useState<TimeEdge>('start');
  const parts = toClockParts(editing === 'start' ? startMinutes : endMinutes);

  const change = (patch: Partial<ClockParts>) => {
    const minutes = fromClockParts({ ...parts, ...patch });
    if (editing === 'start') onChange(minutes, endMinutes);
    else onChange(startMinutes, minutes);
  };

  return (
    <View className={TABS_GAP}>
      <TimeRangeTabs
        startText={clockText(startMinutes)}
        endText={clockText(endMinutes)}
        selected={editing}
        onSelect={setEditing}
      />
      {/* 시작과 종료가 휠을 같이 쓰니, 바꿀 때 휠을 새로 그려 그쪽 값에서 시작하게 한다. */}
      <View
        key={editing}
        className="w-full flex-row items-center justify-between self-center"
        style={{ maxWidth: ROW_MAX_WIDTH }}>
        <WheelColumn
          items={MERIDIEMS}
          selectedIndex={MERIDIEMS.indexOf(parts.meridiem)}
          onChange={(index) => change({ meridiem: MERIDIEMS[index] })}
          width={MERIDIEM_WIDTH}
          accessibilityLabel="오전 오후"
        />
        <WheelColumn
          items={HOURS.map(String)}
          selectedIndex={HOURS.indexOf(parts.hour)}
          onChange={(index) => change({ hour: HOURS[index] })}
          width={HOUR_WIDTH}
          accessibilityLabel="시"
        />
        <Text className="text-center font-pretendard text-body2 text-gray-50" style={{ width: COLON_WIDTH }}>
          :
        </Text>
        <WheelColumn
          items={MINUTES.map((minute) => String(minute).padStart(2, '0'))}
          selectedIndex={MINUTES.indexOf(parts.minute - (parts.minute % MINUTE_STEP))}
          onChange={(index) => change({ minute: MINUTES[index] })}
          width={MINUTE_WIDTH}
          accessibilityLabel="분"
        />
      </View>
    </View>
  );
}
