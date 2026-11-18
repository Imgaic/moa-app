import { Text, View } from 'react-native';
import { Path } from 'react-native-svg';

import { Icon } from './Icon';
import { Svg } from './Svg';

// 피그마 Badge 묶음 (2026-11-18 기준). 디자인이 완성 전이라 수치가 바뀔 수 있다.

// 피그마 Tooltip/Recent. 피그마는 너비 92 고정에 "최근 로그인"이 들어 있다.
// 글자를 props로 받으니 너비는 글자에 맞추고, 같은 너비가 나오게 좌우 여백을 11로 두었다.
const BUBBLE = 'h-[29px] items-center justify-center rounded-full bg-gray-50 px-[11px]';
const TOOLTIP_OPACITY = 0.7;
const TAIL = { width: 7, height: 6.505, right: 19 };

export function Tooltip({ label }: { label: string }) {
  return (
    <View accessibilityRole="text" style={{ opacity: TOOLTIP_OPACITY }}>
      <View className={BUBBLE}>
        <Text className="font-pretendard text-caption-14 text-white">{label}</Text>
      </View>
      <Svg
        width={TAIL.width}
        height={TAIL.height}
        viewBox="0 0 7 6.50511"
        className="self-end text-gray-50"
        style={{ marginRight: TAIL.right, transform: [{ rotate: '180deg' }] }}>
        <Path
          fill="currentColor"
          d="M2.58384 0.599181C2.93337 -0.199727 4.06664 -0.199727 4.41616 0.599181L7 6.50511H0L2.58384 0.599181Z"
        />
      </Svg>
    </View>
  );
}

// 피그마 Badge/Progress
const PILL = 'h-[30px] flex-row items-center gap-[8px] rounded-full bg-white px-[10px]';
const PILL_SHADOW = '0px 2px 8px 0px rgba(0, 0, 0, 0.1)';

type ProgressBadgeProps = {
  // 파란 글자. 예: 3/4명
  count: string;
  // 회색 글자. 예: 입력 완료
  label: string;
};

export function ProgressBadge({ count, label }: ProgressBadgeProps) {
  return (
    <View
      accessible
      accessibilityLabel={`${count} ${label}`}
      className={PILL}
      style={{ boxShadow: PILL_SHADOW }}>
      <Icon name="people" className="text-gray-30" />
      <View className="flex-row gap-[5px]">
        <Text className="font-pretendard text-caption-14 text-blue-40">{count}</Text>
        <Text className="font-pretendard text-caption-14 text-gray-50">{label}</Text>
      </View>
    </View>
  );
}

// 피그마 badge(회색 알약, 예: 6시간 가능). 출발지 줄 오른쪽(휠 안)과 시간 막대 아래(막대 안)에 쓴다.
// 글자 10은 토큰에 없는 크기라 style로 넣었다.
const GRAY_BADGE_FONT_SIZE = 10;

export function GrayBadge({ label }: { label: string }) {
  return (
    <View className="rounded-full bg-gray-10 px-[10px] py-[5px]">
      <Text className="font-pretendard text-gray-60" style={{ fontSize: GRAY_BADGE_FONT_SIZE }}>
        {label}
      </Text>
    </View>
  );
}
