import type { ImageProps } from 'expo-image';
import { View } from 'react-native';

import { Avatar } from './Avatar';
import { Icon } from './Icon';

// 피그마 Character에 입력 완료 체크가 붙은 모양 (2026-11-18 기준, Hub/Members와 List/Member Row 안).
// 디자인이 완성 전이라 수치가 바뀔 수 있다.
const BORDER = 1.5;
// 체크 원은 지름의 28%이고 오른쪽 아래 끝에 붙는다(피그마 inset 72%).
const CHECK_RATIO = 0.28;
const CHECK_BORDER = 0.7;

type CheckedAvatarProps = {
  name: string;
  photo?: ImageProps['source'];
  size: number;
  checked: boolean;
};

export function CheckedAvatar({ name, photo, size, checked }: CheckedAvatarProps) {
  const checkSize = size * CHECK_RATIO;
  return (
    <View style={{ width: size, height: size }}>
      <Avatar name={name} photo={photo} size={size} borderWidth={BORDER} className="border-gray-20" />
      {checked ? (
        <View
          className="absolute bottom-0 right-0 items-center justify-center rounded-full border-white bg-blue-50"
          style={{ width: checkSize, height: checkSize, borderWidth: CHECK_BORDER }}>
          <Icon name="check" size={checkSize} className="text-white" />
        </View>
      ) : null}
    </View>
  );
}
