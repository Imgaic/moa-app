import { useState, type ComponentType } from 'react';
import { Pressable, Text, View } from 'react-native';

import { GrayBadge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { OriginRow } from '@/components/ui/OriginRow';
import { Toggle } from '@/components/ui/Toggle';
import type { GroupDraft } from '@/lib/availabilityGroups';
import { availableHoursText, datesSummaryText } from '@/lib/availabilityText';

import { TimeBarPicker } from './TimeBarPicker';
import { TimeWheelPicker, type TimeRangePickerProps } from './TimeWheelPicker';

// 피그마 Card/Time Input의 Editing Toggle(휠 안), Saved Toggle(막대 안) 상태 (2026-11-18 기준). 디자인이 완성 전이라 수치가 바뀔 수 있다.
// 위에 닫기, 날짜 요약, 확인. 그 아래 시간 선택, (막대 안이면 가능한 길이 배지,) 자차 이용 토글, 출발지 줄(휠 안이면 배지).
// 확인 원은 피그마에서 Input/Checkbox(Off)다. 확인할 수 있으면 파랗게 바꿨다(피그마에 없음).
const CARD = 'gap-[16px] rounded-[16px] bg-white p-[20px]';
const HEADER_BUTTON_SIZE = 34;
const HIT_SLOP = 8;
// 막대 안의 배지는 막대 아래 32에 있다(카드 간격 16 + 16).
const BADGE_EXTRA_TOP = 16;

// T11 비교용 임시, 결정되면 지운다(docs/open-questions.md T11). 고른 안만 남기고 이 표, 상태, 전환 글자 버튼을 지운다.
// 두 안은 시간 선택 부품과 배지 자리만 다르다. 휠 안은 출발지 줄 오른쪽, 막대 안은 막대 아래 가운데에 배지가 있다.
type PickerKind = 'wheel' | 'bar';
type PickerChoice = { switchLabel: string; Picker: ComponentType<TimeRangePickerProps>; badgeUnderPicker: boolean };
const PICKERS: Record<PickerKind, PickerChoice> = {
  wheel: { switchLabel: '막대로 바꿔 보기', Picker: TimeWheelPicker, badgeUnderPicker: false },
  bar: { switchLabel: '휠로 바꿔 보기', Picker: TimeBarPicker, badgeUnderPicker: true },
};
const FIRST_PICKER: PickerKind = 'bar';

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
  const [pickerKind, setPickerKind] = useState<PickerKind>(FIRST_PICKER);
  const { Picker, badgeUnderPicker } = PICKERS[pickerKind];
  const badge = availableHoursText(draft.startMinutes, draft.endMinutes);
  return (
    <View>
      <PickerSwitch kind={pickerKind} onSwitch={setPickerKind} />
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

        <Picker
          startMinutes={draft.startMinutes}
          endMinutes={draft.endMinutes}
          onChange={(startMinutes, endMinutes) => onChange({ startMinutes, endMinutes })}
        />
        {badgeUnderPicker && badge ? (
          <View className="items-center" style={{ marginTop: BADGE_EXTRA_TOP }}>
            <GrayBadge label={badge} />
          </View>
        ) : null}

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
          badge={badgeUnderPicker ? '' : badge}
          onPress={onPickOrigin}
        />

        {onDelete ? (
          <Pressable accessibilityRole="button" onPress={onDelete} className="items-center active:opacity-70">
            <Text className="font-pretendard text-caption-14 text-red">이 일정 지우기</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

// T11 비교용 임시, 결정되면 지운다. 디자인에 없는 장치라 카드 위 오른쪽에 작은 회색 글자로만 둔다.
// 바꿔도 시작·종료 시각은 draft에 있어 그대로 남는다.
function PickerSwitch({ kind, onSwitch }: { kind: PickerKind; onSwitch: (kind: PickerKind) => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      hitSlop={HIT_SLOP}
      onPress={() => onSwitch(kind === 'wheel' ? 'bar' : 'wheel')}
      className="mb-[6px] self-end active:opacity-70">
      <Text className="font-pretendard text-caption-12 text-gray-30">{PICKERS[kind].switchLabel}</Text>
    </Pressable>
  );
}
