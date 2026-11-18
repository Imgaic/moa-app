import { View } from 'react-native';

import type { AvailabilityGroup } from '@/api/availability';
import { DateSummaryCard } from '@/components/ui/DateSummaryCard';
import { barToneOf } from '@/lib/availabilityGroups';
import { datesSummaryText } from '@/lib/availabilityText';
import { clockText } from '@/lib/clockTime';
import type { DateKey } from '@/lib/monthGrid';

// 큰 달력 아래의 카드들: 고른 날짜가 있으면 "가능한 시간 입력하기"(피그마 Calendar - Selected),
// 그 아래에 저장된 묶음마다 한 장(누르면 그 묶음을 다시 연다). 저장된 묶음 목록은 피그마에 없어 같은 카드로 만들었다.
const GAP = 'gap-[12px]';

type GroupSummaryListProps = {
  groups: AvailabilityGroup[];
  pickedDates: DateKey[];
  onOpenNew: () => void;
  onOpenGroup: (index: number) => void;
};

export function GroupSummaryList({ groups, pickedDates, onOpenNew, onOpenGroup }: GroupSummaryListProps) {
  return (
    <View className={GAP}>
      {pickedDates.length > 0 ? (
        <DateSummaryCard caption={datesSummaryText(pickedDates)} label="가능한 시간 입력하기" onPress={onOpenNew} />
      ) : null}
      {groups.map((group, index) => (
        <DateSummaryCard
          key={index}
          caption={datesSummaryText(group.dates)}
          label={`${clockText(group.startMinutes)} ~ ${clockText(group.endMinutes)} · ${group.origin.name}`}
          tone={barToneOf(index)}
          onPress={() => onOpenGroup(index)}
        />
      ))}
    </View>
  );
}
