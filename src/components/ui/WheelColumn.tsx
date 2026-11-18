import { useEffect, useRef } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollViewInstance,
} from 'react-native';

// 피그마 Input/Time Picker의 세로 휠 한 칸(오전·오후, 시, 분) (2026-11-18 기준). 디자인이 완성 전이라 수치가 바뀔 수 있다.
// 가운데 줄이 고른 값이고 위아래 한 줄씩 흐리게 보인다. 끌어서 돌리거나, 마우스 휠로 돌리거나, 위아래 줄을 눌러 고른다.
// 피그마는 글자 줄 19 + 간격 10이라 한 줄이 29다.
const ITEM_HEIGHT = 29;
const VISIBLE_ROWS = 3;
const DIMMED_OPACITY = 0.6;
// 웹은 스크롤이 멈췄다는 이벤트가 없어, 스크롤이 이만큼 조용하면 멈춘 것으로 본다.
const WEB_SCROLL_END_DELAY = 120;

type WheelColumnProps = {
  items: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
  width: number;
  accessibilityLabel: string;
};

export function WheelColumn({ items, selectedIndex, onChange, width, accessibilityLabel }: WheelColumnProps) {
  const scrollRef = useRef<ScrollViewInstance>(null);
  const webScrollEnd = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 밖에서 값이 바뀌면(시작 ↔ 종료 전환 등) 그 줄로 옮긴다.
  useEffect(() => {
    scrollRef.current?.scrollTo({ y: selectedIndex * ITEM_HEIGHT, animated: false });
  }, [selectedIndex]);

  const settle = (offsetY: number) => {
    const index = Math.min(items.length - 1, Math.max(0, Math.round(offsetY / ITEM_HEIGHT)));
    scrollRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated: true });
    if (index !== selectedIndex) onChange(index);
  };

  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => settle(event.nativeEvent.contentOffset.y);

  const onWebScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (webScrollEnd.current) clearTimeout(webScrollEnd.current);
    webScrollEnd.current = setTimeout(() => settle(offsetY), WEB_SCROLL_END_DELAY);
  };

  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ text: items[selectedIndex] }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={({ nativeEvent }) => {
        const step = nativeEvent.actionName === 'increment' ? 1 : -1;
        const next = selectedIndex + step;
        if (next >= 0 && next < items.length) onChange(next);
      }}
      style={{ width, height: ITEM_HEIGHT * VISIBLE_ROWS }}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        contentContainerStyle={{ paddingVertical: ITEM_HEIGHT }}
        contentOffset={{ x: 0, y: selectedIndex * ITEM_HEIGHT }}
        onMomentumScrollEnd={onScrollEnd}
        onScroll={Platform.OS === 'web' ? onWebScroll : undefined}
        scrollEventThrottle={16}>
        {items.map((item, index) => (
          <Pressable
            key={item}
            // 줄로 옮기는 것은 selectedIndex가 바뀐 뒤의 effect가 한다(여기서도 옮기면 iOS에서 한 줄 더 넘어갔다).
            onPress={() => index !== selectedIndex && onChange(index)}
            className="items-center justify-center"
            style={{ height: ITEM_HEIGHT }}>
            <Text
              className={`font-pretendard text-body2 ${index === selectedIndex ? 'text-gray-50' : 'text-gray-30'}`}
              style={{ opacity: index === selectedIndex ? 1 : DIMMED_OPACITY }}>
              {item}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
