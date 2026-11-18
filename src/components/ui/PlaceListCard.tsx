import { Fragment } from 'react';
import { Text, View } from 'react-native';

import { Icon } from './Icon';

// 피그마 Card/Place List (2026-11-18 기준). 디자인이 완성 전이라 수치가 바뀔 수 있다.
// 줄마다 핀, 장소 이름, 오른쪽 회색 글자. 줄 사이에 구분선.
const CARD = 'gap-[20px] rounded-[16px] bg-white px-[16px] py-[21px]';

export type PlaceListItem = {
  id: string;
  name: string;
  // 오른쪽 회색 글자. 예: 태혁 제안
  detail: string;
};

export function PlaceListCard({ items }: { items: PlaceListItem[] }) {
  return (
    <View className={CARD}>
      {items.map((item, index) => (
        <Fragment key={item.id}>
          {index > 0 ? <View className="h-px bg-gray-20" /> : null}
          <View
            accessible
            accessibilityLabel={`${item.name}, ${item.detail}`}
            className="flex-row items-center gap-[8px]">
            <Icon name="pin" className="text-gray-60" />
            <Text numberOfLines={1} className="flex-1 font-pretendard text-h4 text-black">
              {item.name}
            </Text>
            <Text className="font-pretendard text-body1 text-gray-40">{item.detail}</Text>
          </View>
        </Fragment>
      ))}
    </View>
  );
}
