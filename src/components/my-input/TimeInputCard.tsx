import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { OriginRow } from '@/components/ui/OriginRow';
import { Toggle } from '@/components/ui/Toggle';
import type { GroupDraft } from '@/lib/availabilityGroups';
import { availableHoursText, datesSummaryText } from '@/lib/availabilityText';

// 시간 선택 부품. 다음 작업에서 막대 안을 만들면 이 줄만 바꿔 끼운다(같은 props).
import { TimeWheelPicker as TimeRangePicker } from './TimeWheelPicker';

// 피그마 Card/Time Input의 Editing Toggle 상태 (2026-11-18 기준). 디자인이 완성 전이라 수치가 바뀔 수 있다.
// 위에 닫기, 날짜 요약, 확인. 그 아래 시간 선택, 자차 이용 토글, 출발지 줄(가능한 길이 배지).
// 확인 원은 피그마에서 Input/Checkbox(Off)다. 확인할 수 있으면 파랗게 바꿨다(피그마에 없음).
const CARD = 'gap-[16px] rounded-[16px] bg-white p-[20px]';
const HEADER_BUTTON_SIZE = 34;
const HIT_SLOP = 8;

type TimeInputCardProps = {
  draft: GroupDraft;
  canConfirm: boolean;
  onChange: (patch: Partial<GroupDraft>) => void;
  onClose: () => void;
  onConfirm: () => void;
  onPickOrigin: () => void;
  // 저장된 묶음을 고칠 때만 준다. 카드 아래에 지우기 글자 버튼이 생긴다(피그마에 없음).
  onDelete?: () => void;
};

export function TimeInputCard({
  draft,
  canConfirm,
  onChange,
  onClose,
  onConfirm,
  onPickOrigin,
  onDelete,
}: TimeInputCardProps) {
  const car = draft.mode === 'car';
  return (
    <View className={CARD}>
      <View className="flex-row items-center justify-between gap-[8px]">
        <Pressable accessibilityRole="button" accessibilityLabel="닫기" hitSlop={HIT_SLOP} onPress={onClose}>
          <Icon name="close" size={HEADER_BUTTON_SIZE} className="text-gray-30" />
        </Pressable>
        <Text numberOfLines={1} className="shrink text-center font-pretendard text-body2 text-gray-60">
          {datesSummaryText(draft.dates)}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="확인"
          accessibilityState={{ disabled: !canConfirm }}
          disabled={!canConfirm}
          hitSlop={HIT_SLOP}
          onPress={onConfirm}
          className={`items-center justify-center rounded-full ${canConfirm ? 'bg-blue-50' : 'bg-gray-20'}`}
          style={{ width: HEADER_BUTTON_SIZE, height: HEADER_BUTTON_SIZE }}>
          <Icon name="check" className="text-white" />
        </Pressable>
      </View>

      <TimeRangePicker
        startMinutes={draft.startMinutes}
        endMinutes={draft.endMinutes}
        onChange={(startMinutes, endMinutes) => onChange({ startMinutes, endMinutes })}
      />

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-[6px]">
          <Icon name="car" className={car ? 'text-gray-60' : 'text-gray-20'} />
          <Text className={`font-pretendard text-caption-14 ${car ? 'text-gray-60' : 'text-gray-20'}`}>
            자차 이용
          </Text>
        </View>
        <Toggle
          value={car}
          onValueChange={(on) => onChange({ mode: on ? 'car' : 'transit' })}
          accessibilityLabel="자차 이용"
        />
      </View>

      <OriginRow
        name={draft.origin?.name ?? null}
        badge={availableHoursText(draft.startMinutes, draft.endMinutes)}
        onPress={onPickOrigin}
      />

      {onDelete ? (
        <Pressable accessibilityRole="button" onPress={onDelete} className="items-center active:opacity-70">
          <Text className="font-pretendard text-caption-14 text-red">이 일정 지우기</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
