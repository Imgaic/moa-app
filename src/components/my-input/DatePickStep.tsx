import { View } from 'react-native';

import { MonthCalendar } from '@/components/ui/MonthCalendar';
import { PageTitle } from '@/components/ui/PageTitle';
import { dayCellLook } from '@/lib/availabilityCalendar';
import { isEarlierMonth, yearMonthOf, type DateKey } from '@/lib/monthGrid';
import {
  changeMonth,
  openGroupCard,
  openNewCard,
  toggleDate,
  type EditingChange,
  type MyInputEditing,
} from '@/lib/myInputEditing';

import { GroupSummaryList } from './GroupSummaryList';

// 내 입력의 첫 단계 내용: 큰 달력에서 날짜를 고르고, 아래 카드를 눌러 시간 카드를 연다.
// 상단 바, 스크롤, 저장 버튼은 화면(src/app/plans/[planId]/input.tsx)이 두 단계에 같이 두른다.
// 피그마 기준 위치(2026-11-18). 상단 바 아래 20에 제목, 달력 아래 10에 카드 목록.
const TITLE_TOP = 20;
const LIST_TOP = 10;

type DatePickStepProps = {
  range: { start: DateKey; end: DateKey };
  today: DateKey;
  editing: MyInputEditing;
  onChange: (change: EditingChange) => void;
};

export function DatePickStep({ range, today, editing, onChange }: DatePickStepProps) {
  const { month, groups, pickedDates } = editing;
  return (
    <View style={{ paddingTop: TITLE_TOP }}>
      <PageTitle title="가능한 일정 선택" subtitle="본인 외 다른 사람은 볼 수 없어요." />
      <MonthCalendar
        month={month}
        canGoBack={isEarlierMonth(yearMonthOf(range.start), month)}
        canGoForward={isEarlierMonth(month, yearMonthOf(range.end))}
        onChangeMonth={(step) => onChange((current) => changeMonth(current, step))}
        lookOf={(day) => dayCellLook(day, { range, picked: pickedDates, groups, today })}
        onPressDay={(key) => onChange((current) => toggleDate(current, key, range))}
      />
      <View style={{ marginTop: LIST_TOP }}>
        <GroupSummaryList
          groups={groups}
          pickedDates={pickedDates}
          onOpenNew={() => onChange(openNewCard)}
          onOpenGroup={(index) => onChange((current) => openGroupCard(current, index))}
        />
      </View>
    </View>
  );
}
