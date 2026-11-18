import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from './Icon';

// 피그마 Navigation/Top Bar (2026-11-18 기준). 디자인이 완성 전이라 수치가 바뀔 수 있다.
// 피그마의 시계와 배터리는 OS 상태 표시줄이라 그리지 않고, 그 높이는 safe area 위쪽 여백으로 대신한다.
// 피그마 높이 95 = 상태 표시줄 62 + 아래 33. 한 줄(24)은 상태 표시줄 3 아래에서 시작한다.
const CONTENT_HEIGHT = 33;
const ROW = 'h-[24px] flex-row items-center justify-between px-[24px]';
const ROW_TOP = 3;
// Large Title은 피그마에서 글자 중심이 상태 표시줄 24 아래다. 글자(h1, 줄 높이 39)가 33을 넘어서 바가 그만큼 길어진다.
const LARGE_TITLE_TOP = 4.5;
const HIT_SLOP = 12;

export type TopBarType = 'status' | 'step' | 'back' | 'share' | 'largeTitle' | 'stepTitle';

type TopBarProps = {
  // 피그마 Type: Status / Step / Back / Share / Large Title / Step Title
  type: TopBarType;
  // largeTitle, stepTitle의 제목
  title?: string;
  // back의 오른쪽 글자 버튼(예: 확인)
  actionLabel?: string;
  onBack?: () => void;
  // back의 글자 버튼, share의 공유, largeTitle의 더하기
  onAction?: () => void;
};

export function TopBar({ type, title, actionLabel, onBack, onAction }: TopBarProps) {
  const { top } = useSafeAreaInsets();
  return (
    <View className="bg-gray-10" style={{ paddingTop: top, minHeight: top + CONTENT_HEIGHT }}>
      {type === 'largeTitle' ? (
        <View
          className="flex-row items-center justify-between px-[24px]"
          style={{ paddingTop: LARGE_TITLE_TOP }}>
          <Text accessibilityRole="header" className="font-pretendard text-h1 text-gray-50">
            {title}
          </Text>
          <IconButton icon="plus" label="추가" onPress={onAction} />
        </View>
      ) : type !== 'status' ? (
        <View className={ROW} style={{ marginTop: ROW_TOP }}>
          <IconButton icon="back" label="뒤로" onPress={onBack} />
          {type === 'stepTitle' ? (
            // 가운데 제목은 양옆 버튼과 관계없이 바 가운데에 둔다.
            <View pointerEvents="none" className="absolute inset-x-0 items-center">
              <Text accessibilityRole="header" className="font-pretendard text-body2 text-black">
                {title}
              </Text>
            </View>
          ) : null}
          {type === 'back' && actionLabel ? (
            <Pressable accessibilityRole="button" hitSlop={HIT_SLOP} onPress={onAction}>
              <Text className="font-pretendard text-h4 text-gray-40">{actionLabel}</Text>
            </Pressable>
          ) : null}
          {type === 'share' ? <IconButton icon="share" label="공유" onPress={onAction} /> : null}
        </View>
      ) : null}
    </View>
  );
}

function IconButton({
  icon,
  label,
  onPress,
}: {
  icon: IconName;
  label: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={HIT_SLOP}
      onPress={onPress}>
      <Icon name={icon} className={icon === 'share' ? 'text-gray-60' : 'text-gray-50'} />
    </Pressable>
  );
}
