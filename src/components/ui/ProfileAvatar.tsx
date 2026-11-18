import type { ImageProps } from 'expo-image';
import { Pressable, View } from 'react-native';

import { Avatar } from './Avatar';
import { Icon } from './Icon';

// 피그마 Avatar (2026-11-18 기준, 342:14010). 큰 프로필 동그라미 + 오른쪽 아래 카메라 버튼(Button/Camera).
// 상태: Empty(이름 없음) / Filled(이름 뒤 두 글자, 사진을 고르면 사진).
// 동그라미는 Avatar를 그대로 쓰고, 안쪽 그림자와 카메라 버튼만 얹는다. 디자인이 완성 전이라 수치가 바뀔 수 있다.
const BOX = { width: 194, height: 189 };
const SIZE = 186;
const INNER_SHADOW = 'inset 1px 2px 6px 0px rgba(0, 0, 0, 0.25)';
const CAMERA = { size: 50, right: 8, bottom: 3 };
const CAMERA_ICON_SIZE = 37;
// 카메라 버튼의 흰 테두리(2.5)는 피그마에서 원의 경계에 걸쳐 그려져 절반이 바깥으로 나온다.
const CAMERA_RING = 2.5;
const HIT_SLOP = 8;
// 피그마 Avatar의 State=Empty: 이름이 비어 있으면 동그라미에 "이름"을 쓴다.
const EMPTY_NAME = '이름';

type ProfileAvatarProps = {
  name: string;
  // 없으면 이름 뒤 두 글자(Avatar와 같다).
  photo?: ImageProps['source'];
  onPressCamera: () => void;
};

export function ProfileAvatar({ name, photo, onPressCamera }: ProfileAvatarProps) {
  const cameraOuter = CAMERA.size + CAMERA_RING;
  const ringShift = CAMERA_RING / 2;
  return (
    <View style={BOX}>
      <Avatar name={name.trim() === '' ? EMPTY_NAME : name} photo={photo} size={SIZE} />
      <View
        pointerEvents="none"
        className="absolute left-0 top-0 rounded-full"
        style={{ width: SIZE, height: SIZE, boxShadow: INNER_SHADOW }}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="사진 고르기"
        hitSlop={HIT_SLOP}
        onPress={onPressCamera}
        className="absolute items-center justify-center rounded-full border-white bg-gray-60 active:opacity-70"
        style={{
          width: cameraOuter,
          height: cameraOuter,
          borderWidth: CAMERA_RING,
          right: CAMERA.right - ringShift,
          bottom: CAMERA.bottom - ringShift,
        }}>
        <Icon name="camera" size={CAMERA_ICON_SIZE} className="text-gray-10" />
      </Pressable>
    </View>
  );
}
