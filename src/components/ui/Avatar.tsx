import { Image, type ImageProps } from 'expo-image';
import { Text, View } from 'react-native';

import { avatarText } from '@/lib/avatarText';

// 피그마 Avatar (2026-11-18 기준). 프로필 동그라미 하나만 맡는다. 겹치기, 이름표, 체크 같은 것은
// 이 Avatar를 쓰는 다른 컴포넌트가 맡는다.
// 사진이 없으면 이름의 뒤 두 글자를 보여준다(docs/open-questions.md T7).

// 글자 크기는 피그마 Avatar(지름 186)의 80을 기준으로 지름에 비례시킨다. 줄 높이는 글자 크기의 1.2배.
const TEXT_RATIO = 80 / 186;
const LINE_HEIGHT_RATIO = 1.2;

type AvatarProps = {
  name: string;
  photo?: ImageProps['source'];
  size: number;
  borderWidth?: number;
  // 테두리 색 같은 바깥 모양
  className?: string;
};

export function Avatar({ name, photo, size, borderWidth, className = '' }: AvatarProps) {
  const fontSize = Math.round(size * TEXT_RATIO);
  return (
    <View
      className={`items-center justify-center overflow-hidden rounded-full bg-gray-10 ${className}`}
      style={{ width: size, height: size, borderWidth }}>
      {photo ? (
        <Image source={photo} contentFit="cover" style={{ width: '100%', height: '100%' }} />
      ) : (
        <Text
          numberOfLines={1}
          className="font-pretendard text-gray-30"
          style={{ fontSize, lineHeight: Math.ceil(fontSize * LINE_HEIGHT_RATIO) }}>
          {avatarText(name)}
        </Text>
      )}
    </View>
  );
}
