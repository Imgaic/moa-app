import { View } from 'react-native';

import { CompactCalendar } from '@/components/ui/CompactCalendar';
import { dayCellLook } from '@/lib/availabilityCalendar';
import { canConfirmGroup } from '@/lib/availabilityGroups';
import type { DateKey } from '@/lib/monthGrid';
import {
  changeDraft,
  closeStep,
  confirmCard,
  groupsOutsideCard,
  openOriginSearch,
  toggleDate,
  type EditingChange,
  type MyInputEditing,
  type OpenCard,
} from '@/lib/myInputEditing';

import { TimeInputCard } from './TimeInputCard';

// 내 입력의 시간 카드 단계 내용: 작은 달력에서 이 묶음의 날짜를 고치고, 아래 카드에서 시간, 이동수단, 출발지를 넣는다.
// 상단 바, 스크롤, 저장 버튼은 화면(src/app/plans/[planId]/input.tsx)이 두 단계에 같이 두른다.
// 피그마 기준 위치(2026-11-18). 상단 바 아래 22에 작은 달력, 그 아래 5에 카드.
const COMPACT_TOP = 22;
const CARD_TOP = 5;

type TimeCardStepProps = {
  range: { start: DateKey; end: DateKey };
  today: DateKey;
  editing: MyInputEditing;
  // editing.card와 같은 값. 화면이 카드가 열려 있음을 확인하고 넘긴다.
  card: OpenCard;
  onChange: (change: EditingChange) => void;
  // 지우기 전에 확인 창을 띄우는 것은 화면이 한다.
  onDelete: () => void;
};

export function TimeCardStep({ range, today, editing, card, onChange, onDelete }: TimeCardStepProps) {
  // 고치는 묶음의 날짜는 고른 모양으로, 나머지 묶음은 막대로 보인다.
  const others = groupsOutsideCard(editing);
  return (
    <>
      <View style={{ marginTop: COMPACT_TOP }}>
        <CompactCalendar
          month={editing.month}
          lookOf={(day) => dayCellLook(day, { range, picked: card.draft.dates, groups: others, today })}
          onPressDay={(key) => onChange((current) => toggleDate(current, key, range))}
        />
      </View>
      <View style={{ marginTop: CARD_TOP }}>
        <TimeInputCard
          draft={card.draft}
          canConfirm={canConfirmGroup(card.draft)}
          onChange={(patch) => onChange((current) => changeDraft(current, patch))}
          onClose={() => onChange(closeStep)}
          onConfirm={() => onChange(confirmCard)}
          onPickOrigin={() => onChange(openOriginSearch)}
          onDelete={card.index === null ? undefined : onDelete}
        />
      </View>
    </>
  );
}
