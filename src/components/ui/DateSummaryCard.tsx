import { Pressable, Text, View } from 'react-native';

import type { BarTone } from '@/lib/availabilityGroups';

import { Icon } from './Icon';

// 피그마 Card/Date Summary (2026-11-18 기준). 디자인이 완성 전이라 수치가 바뀔 수 있다.
// 왼쪽 더하기, 위에 작은 날짜 요약, 아래에 안내("가능한 시간 입력하기"). 누르면 시간 카드를 연다.
// 저장된 묶음 줄에도 같은 카드를 쓴다: tone을 주면 더하기 대신 달력 막대와 같은 색의 세로 막대를 그린다(피그마에 없음).
// 더하기 색 #D3D6E1은 팔레트에 없어 gray-20으로 썼다.
const CARD = 'h-[60px] flex-row items-center gap-[16px] rounded-[10px] bg-white px-[16px]';
const ICON_SIZE = 34;
const TONE_BAR = 'h-[34px] w-[6px] rounded-full';
const TONE_COLOR: Record<BarTone, string> = { 1: 'bg-blue-50', 2: 'bg-blue-40', 3: 'bg-blue-30' };

type DateSummaryCardProps = {
  caption: string;
  label: string;
  tone?: BarTone;
  onPress: () => void;
};

export function DateSummaryCard({ caption, label, tone, onPress }: DateSummaryCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${caption}, ${label}`}
      onPress={onPress}
      className={`${CARD} active:opacity-70`}>
      {tone ? (
        <View className="items-center" style={{ width: ICON_SIZE }}>
          <View className={`${TONE_BAR} ${TONE_COLOR[tone]}`} />
        </View>
      ) : (
        <Icon name="plus" size={ICON_SIZE} className="text-gray-20" />
      )}
      <View className="flex-1 gap-[8px]">
        <Text numberOfLines={1} className="font-pretendard text-caption-9 text-gray-60">
          {caption}
        </Text>
        <Text numberOfLines={1} className="font-pretendard text-caption-14 text-gray-60">
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
