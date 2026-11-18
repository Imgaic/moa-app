import { Pressable, Text, View } from 'react-native';

import { Icon } from './Icon';

// 피그마 List/Origin Row (2026-11-18 기준). 디자인이 완성 전이라 수치가 바뀔 수 있다.
// 핀, 밑줄 그은 출발지 이름, 오른쪽 아래 회색 배지(예: 6시간 가능). 줄을 누르면 출발지를 고르러 간다.
// 이름 13, 배지 10은 토큰에 없는 크기라 style로 넣었다. 밑줄 #DDDDDD는 가까운 gray-20으로 썼다.
const NAME_FONT_SIZE = 13;
const BADGE_FONT_SIZE = 10;
const UNDERLINE_WIDTH = 144;
const UNDERLINE_GAP = 6;
// 피그마 Saved 상태의 빈 출발지 글자
const EMPTY_NAME = '출발 장소';

type OriginRowProps = {
  // 고르기 전이면 null
  name: string | null;
  // 빈 글자면 배지를 그리지 않는다.
  badge: string;
  onPress: () => void;
};

export function OriginRow({ name, badge, onPress }: OriginRowProps) {
  return (
    <View className="flex-row items-end justify-between">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`출발지 ${name ?? '고르기'}`}
        onPress={onPress}
        className="shrink flex-row items-center gap-[6px] active:opacity-70">
        <Icon name="pin" className="text-gray-60" />
        <View className="shrink" style={{ minWidth: UNDERLINE_WIDTH, paddingBottom: UNDERLINE_GAP }}>
          <Text
            numberOfLines={1}
            className={`font-pretendard ${name ? 'text-gray-50' : 'text-gray-30'}`}
            style={{ fontSize: NAME_FONT_SIZE }}>
            {name ?? EMPTY_NAME}
          </Text>
          <View className="absolute bottom-0 left-0 h-px bg-gray-20" style={{ width: UNDERLINE_WIDTH }} />
        </View>
      </Pressable>
      {badge ? (
        <View className="rounded-full bg-gray-10 px-[10px] py-[5px]">
          <Text className="font-pretendard text-gray-60" style={{ fontSize: BADGE_FONT_SIZE }}>
            {badge}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
