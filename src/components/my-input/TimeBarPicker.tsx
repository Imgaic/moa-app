import { Text, View } from 'react-native';

import { GrayBadge } from '@/components/ui/Badge';
import { TimeBar } from '@/components/ui/TimeBar';
import { availableHoursText } from '@/lib/availabilityText';
import { clockText } from '@/lib/clockTime';

import type { TimeRangePickerProps } from './TimeWheelPicker';

// 시간 선택(막대 안, 피그마 Card/Time Input의 Saved 상태). 위에 "오전 10:00 ~ 오후 4:00" 줄과 가능한 길이 배지, 아래에 시간 막대.
// props는 타임 휠 안(TimeWheelPicker)과 같다. 휠 안의 시작/종료 칸과 달리 상자 없이 글자만 있고 누르는 동작이 없다.
// 피그마 기준(2026-11-19): 시각 글자 20, 줄 좌우 여백 4, 줄과 막대 사이 16.
// 피그마의 글자 사이는 약 16으로 보이지만 실제 글꼴 폭이 시안보다 넓어, 402 너비에서 배지가 한 줄에 남도록 12로 줄였다.
// 피그마는 막대 아래에 빈 칸이 하나 더 있어 다음 줄(자차 이용)이 카드 간격 16의 두 배인 32 아래에 온다.
const SECTION_GAP = 'gap-[16px]';
const TEXT_GAP = 'gap-x-[12px]';
const EXTRA_BOTTOM = 16;

export function TimeBarPicker({ startMinutes, endMinutes, onChange }: TimeRangePickerProps) {
  const badge = availableHoursText(startMinutes, endMinutes);
  return (
    <View className={SECTION_GAP} style={{ marginBottom: EXTRA_BOTTOM }}>
      {/* 좁은 화면에서는 배지가 먼저 다음 줄로, 더 좁으면 "~ 종료"도 다음 줄로 내려간다. 시각 글자는 줄이지 않는다. */}
      <View className="flex-row flex-wrap items-center justify-between gap-[8px] px-[4px]">
        <View
          accessible
          accessibilityLabel={`시작 ${clockText(startMinutes)}, 종료 ${clockText(endMinutes)}`}
          className={`flex-row flex-wrap items-center py-[5px] ${TEXT_GAP}`}>
          <TimeText>{clockText(startMinutes)}</TimeText>
          <View className={`flex-row items-center ${TEXT_GAP}`}>
            <TimeText>~</TimeText>
            <TimeText>{clockText(endMinutes)}</TimeText>
          </View>
        </View>
        {badge ? <GrayBadge label={badge} /> : null}
      </View>
      <TimeBar startMinutes={startMinutes} endMinutes={endMinutes} onChange={onChange} />
    </View>
  );
}

function TimeText({ children }: { children: string }) {
  // 끄는 동안 숫자 폭이 바뀌어 줄이 흔들리지 않게 숫자 폭을 고정한다.
  return (
    <Text className="font-pretendard text-h4 text-gray-50" style={{ fontVariant: ['tabular-nums'] }}>
      {children}
    </Text>
  );
}
