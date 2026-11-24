import { View } from 'react-native';

import type { NewPlan } from '@/api/plans';
import { SummaryItem } from '@/components/ui/SummaryItem';
import { dateRangeText, durationText } from '@/lib/planCreateText';

// 피그마 Summary/Create (2026-11-18 기준). 앞 단계에서 답한 값이 화면 아래에 한 줄씩 쌓인다.
// 가장 최근에 답한 것이 위로 온다: 날짜 범위, 필요한 시간, 약속 이름 순서. 답하지 않은 값은 넘기지 않는다.
const GAP = 'gap-[14px]';

type CreateSummaryProps = {
  title?: string;
  durationMinutes?: number;
  dateRange?: NewPlan['dateRange'];
};

export function CreateSummary({ title, durationMinutes, dateRange }: CreateSummaryProps) {
  return (
    <View className={GAP}>
      {dateRange ? <SummaryItem label="날짜 범위" value={dateRangeText(dateRange)} /> : null}
      {durationMinutes !== undefined ? (
        <SummaryItem label="필요한 시간" value={durationText(durationMinutes)} />
      ) : null}
      {title !== undefined ? <SummaryItem label="약속 이름" value={title} /> : null}
    </View>
  );
}
