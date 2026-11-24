import { Pressable, Text, View } from 'react-native';

import { Icon } from './Icon';

// 피그마 List/Place Row (2026-11-18 기준). 디자인이 완성 전이라 수치가 바뀔 수 있다.
// Type: Selected(고른 장소와 "변경") / Search(장소 찾기로 가는 줄). Proposal(장소 제안)은 쓰는 화면이 없어 아직 만들지 않았다.
const ROW = 'flex-row items-center gap-[8px]';
const HIT_SLOP = 12;

type PlaceRowProps =
  | { type: 'selected'; name: string; address: string; onChange: () => void }
  | { type: 'search'; label: string; onPress: () => void };

export function PlaceRow(props: PlaceRowProps) {
  if (props.type === 'search') {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={props.label}
        onPress={props.onPress}
        className={ROW}>
        <Icon name="pin" className="text-gray-60" />
        <Text className="flex-1 font-pretendard text-body2 text-black">{props.label}</Text>
        <Icon name="chevron-right" className="text-gray-60" />
      </Pressable>
    );
  }

  return (
    <View className={ROW}>
      <Icon name="pin" className="text-gray-60" />
      <View className="flex-1 gap-[4px]">
        <Text className="font-pretendard text-body2 text-black">{props.name}</Text>
        <Text className="font-pretendard text-caption-12 text-gray-30">{props.address}</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="장소 변경"
        hitSlop={HIT_SLOP}
        onPress={props.onChange}>
        <Text className="font-pretendard text-caption-14 text-blue-50">변경</Text>
      </Pressable>
    </View>
  );
}
