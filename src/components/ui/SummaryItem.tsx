import { Text, View } from 'react-native';

// 피그마 List/Summary Item (2026-11-18 기준). 디자인이 완성 전이라 수치가 바뀔 수 있다.
// 위에 구분선, 아래에 "이름 ... 값" 한 줄. 피그마 Summary/Create, Card/Summary 안에서 모두 구분선이 보인다.
const GAP = 'gap-[14px]';

type SummaryItemProps = {
  label: string;
  value: string;
};

export function SummaryItem({ label, value }: SummaryItemProps) {
  return (
    <View className={GAP}>
      <View className="h-px bg-gray-20" />
      <View className="flex-row items-center justify-between gap-[12px]">
        <Text className="font-pretendard text-body2 text-gray-40">{label}</Text>
        <Text numberOfLines={1} className="shrink font-pretendard text-body2 text-black">
          {value}
        </Text>
      </View>
    </View>
  );
}
