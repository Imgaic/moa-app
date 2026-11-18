import { Text, View } from 'react-native';

import { TimeBar } from '@/components/ui/TimeBar';
import { clockText } from '@/lib/clockTime';

import type { TimeRangePickerProps } from './TimeWheelPicker';

// 시간 선택(막대 안, 피그마 Card/Time Input의 Saved 상태). 위에 시작·종료 시각 글자 줄, 아래에 시간 막대.
// props는 타임 휠 안(TimeWheelPicker)과 같다. 휠 안의 시작/종료 칸과 달리 상자 없이 글자만 있고 누르는 동작이 없다.
// 피그마 기준(2026-11-18): 시작·종료 사이 24, 라벨과 시각 사이 7, 글자 줄과 막대 사이 16.
const SECTION_GAP = 'gap-[16px]';
const EDGES_GAP = 'gap-[24px]';
const LABEL_GAP = 'gap-[7px]';

export function TimeBarPicker({ startMinutes, endMinutes, onChange }: TimeRangePickerProps) {
  return (
    <View className={SECTION_GAP}>
      <View className={`flex-row justify-center ${EDGES_GAP}`}>
        <EdgeTime label="시작" minutes={startMinutes} />
        <EdgeTime label="종료" minutes={endMinutes} />
      </View>
      <TimeBar startMinutes={startMinutes} endMinutes={endMinutes} onChange={onChange} />
    </View>
  );
}

function EdgeTime({ label, minutes }: { label: string; minutes: number }) {
  return (
    <View accessible accessibilityLabel={`${label} ${clockText(minutes)}`} className={`flex-row items-end p-[5px] ${LABEL_GAP}`}>
      <Text className="font-pretendard text-caption-12 text-gray-60">{label}</Text>
      {/* 끄는 동안 숫자 폭이 바뀌어 줄이 흔들리지 않게 숫자 폭을 고정한다. */}
      <Text className="font-pretendard text-h4 text-gray-50" style={{ fontVariant: ['tabular-nums'] }}>
        {clockText(minutes)}
      </Text>
    </View>
  );
}
