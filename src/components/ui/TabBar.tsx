import { useEffect, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from './Icon';

// 피그마 Navigation/Tab Bar, Navigation/Tab Item (2026-11-18 기준). 디자인이 완성 전이라 수치가 바뀔 수 있다.
// 피그마 높이 84 = 아이콘 줄 50 + 홈 인디케이터 34. 아이콘 중심은 위에서 31이다.
const BAR = 'flex-row justify-center gap-[64px] rounded-t-[20px] bg-white';
const ROW_HEIGHT = 50;
const ITEM_TOP = 7;
const ITEM_SIZE = 48;
const TAB_ICON_SIZE = 30.24;

// 선택 전환: 빈 아이콘과 채운 아이콘을 겹쳐 두고 투명도를 바꾼다.
// iOS의 "동작 줄이기"가 켜져 있으면 ReduceMotion.System이 애니메이션 없이 바로 바꾼다.
const SELECT_DURATION = 180;
const SELECT_EASING = Easing.out(Easing.quad);

export type TabIcon = 'home' | 'calendar' | 'user';

export function TabBar({ children }: { children: ReactNode }) {
  const { bottom } = useSafeAreaInsets();
  return (
    <View
      accessibilityRole="tablist"
      className={BAR}
      style={{ height: ROW_HEIGHT + bottom, paddingTop: ITEM_TOP }}>
      {children}
    </View>
  );
}

type TabItemProps = {
  icon: TabIcon;
  selected: boolean;
  onPress?: () => void;
  accessibilityLabel: string;
};

// 피그마 Stat: Active = selected true(검정 채운 아이콘), Inactive = selected false(회색 빈 아이콘)
export function TabItem({ icon, selected, onPress, accessibilityLabel }: TabItemProps) {
  const progress = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(selected ? 1 : 0, {
      duration: SELECT_DURATION,
      easing: SELECT_EASING,
      reduceMotion: ReduceMotion.System,
    });
  }, [selected, progress]);

  const onStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
  const offStyle = useAnimatedStyle(() => ({ opacity: 1 - progress.value }));

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected }}
      onPress={onPress}
      className="items-center justify-center"
      style={{ width: ITEM_SIZE, height: ITEM_SIZE }}>
      <Animated.View style={[styles.layer, offStyle]}>
        <Icon name={icon} size={TAB_ICON_SIZE} className="text-gray-30" />
      </Animated.View>
      <Animated.View style={[styles.layer, onStyle]}>
        <Icon name={`${icon}-fill`} size={TAB_ICON_SIZE} className="text-black" />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  layer: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
});
