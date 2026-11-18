import { Pressable, Text, View } from 'react-native';

import type { NewPlan, PlanMember } from '@/api/plans';
import { AvatarCircle } from '@/components/ui/Avatar';
import { SummaryItem } from '@/components/ui/SummaryItem';
import { dateRangeText, durationText } from '@/lib/planCreateText';

// 피그마 Card/Summary (2026-11-18 기준). 공유하기 전에 보는 약속 요약. 디자인이 완성 전이라 수치가 바뀔 수 있다.
const CARD = 'gap-[14px] rounded-[14px] bg-white p-[16px]';
const AVATAR_SIZE = 50;
const AVATAR_BORDER = 1.5;
const HIT_SLOP = 12;
const RECOMMEND_PLACE_TEXT = '장소 추천';

type PlanSummaryCardProps = {
  plan: NewPlan;
  // 불러오기 전에는 null. 얼굴과 "OO님의 약속"을 비워 둔다.
  host: PlanMember | null;
  onEdit: () => void;
};

export function PlanSummaryCard({ plan, host, onEdit }: PlanSummaryCardProps) {
  const placeText = plan.fixedPlace?.name ?? RECOMMEND_PLACE_TEXT;
  return (
    <View className={CARD}>
      <View className="flex-row items-center gap-[14px]">
        <AvatarCircle
          name={host?.name ?? ''}
          photo={host?.avatarUrl ? { uri: host.avatarUrl } : undefined}
          size={AVATAR_SIZE}
          borderWidth={AVATAR_BORDER}
          className="border-gray-20"
        />
        <View className="flex-1 gap-[4px]">
          <Text className="font-pretendard text-body2 text-black">{plan.title}</Text>
          <Text className="font-pretendard text-caption-12 text-gray-30">
            {host ? `${host.name}님의 약속` : ' '}
          </Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="약속 수정" hitSlop={HIT_SLOP} onPress={onEdit}>
          <Text className="font-pretendard text-caption-14 text-blue-50">수정</Text>
        </Pressable>
      </View>
      <SummaryItem label="장소" value={placeText} />
      <SummaryItem label="날짜 범위" value={dateRangeText(plan.dateRange)} />
      <SummaryItem label="필요한 시간" value={durationText(plan.durationMinutes)} />
    </View>
  );
}
