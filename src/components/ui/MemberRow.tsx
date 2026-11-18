import type { ImageProps } from 'expo-image';
import { Text, View } from 'react-native';

import { CheckedAvatar } from './CheckedAvatar';

// 피그마 List/Member Row (2026-11-18 기준). 디자인이 완성 전이라 수치가 바뀔 수 있다.
const AVATAR_SIZE = 50;

type MemberRowProps = {
  name: string;
  photo?: ImageProps['source'];
  // 이름 아래 회색 글자. 예: 입력 완료, 입력 중
  status: string;
  checked: boolean;
};

export function MemberRow({ name, photo, status, checked }: MemberRowProps) {
  return (
    <View accessible accessibilityLabel={`${name}, ${status}`} className="flex-row items-center gap-[16px]">
      <CheckedAvatar name={name} photo={photo} size={AVATAR_SIZE} checked={checked} />
      <View className="flex-1 gap-[4px]">
        <Text numberOfLines={1} className="font-pretendard text-body2 text-black">
          {name}
        </Text>
        <Text className="font-pretendard text-caption-12 text-gray-30">{status}</Text>
      </View>
    </View>
  );
}
