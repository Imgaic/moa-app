import { Text, View } from 'react-native';

import type { Member } from '@/api/plans';
import { Icon } from '@/components/ui/Icon';
import { progressText } from '@/lib/hubText';

// 피그마 Hub/Members의 status 줄 (2026-11-18 기준): 사람 아이콘, 파란 "3/4명", "입력 완료".
// 멤버 영역과 멤버 모달 머리에 같이 쓴다.
export function MemberProgress({ members }: { members: Member[] }) {
  return (
    <View className="flex-row items-center gap-[6px]">
      <Icon name="people" className="text-gray-30" />
      <View className="flex-row gap-[7px]">
        <Text className="font-pretendard text-caption-14 text-blue-40">{progressText(members)}</Text>
        <Text className="font-pretendard text-caption-14 text-gray-50">입력 완료</Text>
      </View>
    </View>
  );
}
