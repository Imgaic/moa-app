import { Image, type ImageProps } from 'expo-image';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, ReduceMotion } from 'react-native-reanimated';

import { avatarText } from '@/lib/avatarText';

import { Icon } from './Icon';

// 피그마 Avatar 묶음 (2026-11-18 기준). 디자인이 완성 전이라 수치가 바뀔 수 있다.
// 사진이 없으면 이름의 뒤 두 글자를 보여준다(docs/open-questions.md T7). 캐릭터 아바타 세트는 아직 만들지 않는다.

// 글자 크기는 피그마 Avatar(지름 186)의 80을 기준으로 지름에 비례시킨다. 줄 높이는 글자 크기의 1.2배.
const TEXT_RATIO = 80 / 186;
const LINE_HEIGHT_RATIO = 1.2;
const INNER_SHADOW = 'inset 1px 2px 6px 0px rgba(0, 0, 0, 0.25)';

// 피그마 Avatar (State: Empty / Filled)
const PROFILE = { box: { width: 194, height: 189 }, size: 186, camera: 50, right: 8, bottom: 3 };
// 피그마 Avatar/Member
const MEMBER = { size: 64, border: 1.92, check: 17.92, checkBorder: 0.896, checkOffset: 46.08 };
// 피그마 Avatar/Group: 지름 128 두 개를 (64, 56)만큼 비껴 겹친다.
const GROUP = {
  box: { width: 198, height: 186 },
  size: 128,
  border: 3,
  front: { left: 64, top: 56 },
  camera: { size: 54, left: 149.5, top: 137.5 },
};
// 피그마 Avatar/Map Pin
const MAP_PIN = {
  box: { width: 67, height: 80 },
  size: 44,
  border: 2,
  check: { size: 14, left: 32, border: 0.7 },
  dot: { size: 8, left: 18, top: 48 },
  label: { left: 30, top: 48 },
  labelShadow: '0px 2px 6px 0px rgba(0, 0, 0, 0.15)',
};
const CAMERA_ICON_SIZE = 37;
// 카메라 버튼의 흰 테두리(2.5)는 피그마에서 원의 경계에 걸쳐 그려져 절반(1.25)이 바깥으로 나온다.
const CAMERA_RING = 2.5;
const HIT_SLOP = 8;

// 입력 완료 표시가 붙고 떨어질 때의 짧은 페이드. "동작 줄이기"가 켜져 있으면 바로 바뀐다.
const CHECK_FADE_MS = 180;
const CHECK_IN = FadeIn.duration(CHECK_FADE_MS).reduceMotion(ReduceMotion.System);
const CHECK_OUT = FadeOut.duration(CHECK_FADE_MS).reduceMotion(ReduceMotion.System);

type Photo = ImageProps['source'];

type CircleProps = {
  name: string;
  photo?: Photo;
  size: number;
  className?: string;
  borderWidth?: number;
  innerShadow?: boolean;
};

// 사진이 있으면 사진, 없으면 회색 원에 이름 뒤 두 글자.
// 홈 카드의 겹친 얼굴(피그마 Character 자리)에도 쓴다.
export function AvatarCircle({ name, photo, size, className = '', borderWidth, innerShadow }: CircleProps) {
  const fontSize = Math.round(size * TEXT_RATIO);
  return (
    <View
      className={`items-center justify-center overflow-hidden rounded-full bg-gray-10 ${className}`}
      style={{
        width: size,
        height: size,
        borderWidth,
        boxShadow: innerShadow ? INNER_SHADOW : undefined,
      }}>
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

function CameraButton({
  size,
  style,
  onPress,
}: {
  size: number;
  style: { left?: number; top?: number; right?: number; bottom?: number };
  onPress?: () => void;
}) {
  const outer = size + CAMERA_RING;
  const shift = CAMERA_RING / 2;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="사진 바꾸기"
      hitSlop={HIT_SLOP}
      onPress={onPress}
      className="absolute items-center justify-center rounded-full border-white bg-gray-60"
      style={{
        width: outer,
        height: outer,
        borderWidth: CAMERA_RING,
        left: style.left === undefined ? undefined : style.left - shift,
        top: style.top === undefined ? undefined : style.top - shift,
        right: style.right === undefined ? undefined : style.right - shift,
        bottom: style.bottom === undefined ? undefined : style.bottom - shift,
      }}>
      <Icon name="camera" size={CAMERA_ICON_SIZE} className="text-gray-10" />
    </Pressable>
  );
}

function CheckBadge({
  size,
  borderWidth,
  className,
  style,
}: {
  size: number;
  borderWidth: number;
  className: string;
  style: { left: number; top: number };
}) {
  return (
    <Animated.View
      entering={CHECK_IN}
      exiting={CHECK_OUT}
      style={{ position: 'absolute', ...style }}>
      <View
        className={`items-center justify-center rounded-full border-white ${className}`}
        style={{ width: size, height: size, borderWidth }}>
        <Icon name="check" size={size} className="text-white" />
      </View>
    </Animated.View>
  );
}

type ProfileAvatarProps = {
  name: string;
  photo?: Photo;
  onPressCamera?: () => void;
};

// 피그마 Avatar. State: Empty = photo 없음(이름 글자), Filled = photo 있음
export function ProfileAvatar({ name, photo, onPressCamera }: ProfileAvatarProps) {
  return (
    <View style={PROFILE.box}>
      <View accessible accessibilityRole="image" accessibilityLabel={`${name} 프로필 사진`}>
        <AvatarCircle name={name} photo={photo} size={PROFILE.size} innerShadow />
      </View>
      <CameraButton
        size={PROFILE.camera}
        style={{ right: PROFILE.right, bottom: PROFILE.bottom }}
        onPress={onPressCamera}
      />
    </View>
  );
}

type MemberAvatarProps = {
  name: string;
  photo?: Photo;
  // 입력 완료 표시(파란 체크)
  checked?: boolean;
  showName?: boolean;
  // 이름 아래 작은 글자(예: 입력 중)
  status?: string;
};

// 피그마 Avatar/Member
export function MemberAvatar({
  name,
  photo,
  checked = false,
  showName = true,
  status,
}: MemberAvatarProps) {
  return (
    <View
      accessible
      accessibilityLabel={[name, status, checked ? '입력 완료' : null].filter(Boolean).join(', ')}
      className="items-center gap-[4px]">
      <View style={{ width: MEMBER.size, height: MEMBER.size }}>
        <AvatarCircle
          name={name}
          photo={photo}
          size={MEMBER.size}
          borderWidth={MEMBER.border}
          className="border-gray-20"
        />
        {checked ? (
          <CheckBadge
            size={MEMBER.check}
            borderWidth={MEMBER.checkBorder}
            className="bg-blue-50"
            style={{ left: MEMBER.checkOffset, top: MEMBER.checkOffset }}
          />
        ) : null}
      </View>
      {showName ? (
        <Text className="font-pretendard text-caption-12 text-gray-50">{name}</Text>
      ) : null}
      {status ? <Text className="font-pretendard text-caption-9 text-gray-30">{status}</Text> : null}
    </View>
  );
}

type GroupAvatarProps = {
  // 뒤, 앞 순서의 두 사람
  members: readonly [{ name: string; photo?: Photo }, { name: string; photo?: Photo }];
  onPressCamera?: () => void;
};

// 피그마 Avatar/Group
export function GroupAvatar({ members, onPressCamera }: GroupAvatarProps) {
  const [back, front] = members;
  return (
    <View style={GROUP.box}>
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel={`${back.name}, ${front.name}`}
        style={GROUP.box}>
        <AvatarCircle
          name={back.name}
          photo={back.photo}
          size={GROUP.size}
          borderWidth={GROUP.border}
          className="absolute border-gray-20"
        />
        <View className="absolute" style={GROUP.front}>
          <AvatarCircle
            name={front.name}
            photo={front.photo}
            size={GROUP.size}
            borderWidth={GROUP.border}
            className="border-gray-20"
          />
        </View>
      </View>
      <CameraButton
        size={GROUP.camera.size}
        style={{ left: GROUP.camera.left, top: GROUP.camera.top }}
        onPress={onPressCamera}
      />
    </View>
  );
}

type MapPinAvatarProps = {
  name: string;
  photo?: Photo;
  // 지도 위 위치 이름(예: 수원역)
  label: string;
  checked?: boolean;
};

// 피그마 Avatar/Map Pin. 지도 위에 사람의 출발지를 표시한다. 지도 연결은 이번 범위가 아니다.
// 피그마의 사진에는 짙은 테두리가 이미지로 들어 있어, 여기서는 gray-60 테두리로 그린다.
export function MapPinAvatar({ name, photo, label, checked = false }: MapPinAvatarProps) {
  return (
    <View
      accessible
      accessibilityLabel={[name, label, checked ? '입력 완료' : null].filter(Boolean).join(', ')}
      style={MAP_PIN.box}>
      <View className="absolute" style={{ top: 1 }}>
        <AvatarCircle
          name={name}
          photo={photo}
          size={MAP_PIN.size}
          borderWidth={MAP_PIN.border}
          className="border-gray-60"
        />
      </View>
      <View
        className="absolute rounded-full border border-white bg-gray-60"
        style={{
          width: MAP_PIN.dot.size,
          height: MAP_PIN.dot.size,
          left: MAP_PIN.dot.left,
          top: MAP_PIN.dot.top,
        }}
      />
      <View
        className="absolute rounded-full bg-white px-[6px] py-[3px]"
        style={{ ...MAP_PIN.label, boxShadow: MAP_PIN.labelShadow }}>
        <Text className="font-pretendard text-caption-9 text-gray-50">{label}</Text>
      </View>
      {checked ? (
        <CheckBadge
          size={MAP_PIN.check.size}
          borderWidth={MAP_PIN.check.border}
          className="bg-gray-60"
          style={{ left: MAP_PIN.check.left, top: 0 }}
        />
      ) : null}
    </View>
  );
}
