import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Checkbox } from './Checkbox';

// 피그마 Card/Option (2026-11-18 기준). 디자인이 완성 전이라 수치가 바뀔 수 있다.
// 여럿 중 하나를 고르는 카드. 카드 어디를 눌러도 고른다. 아래 칸(children)은 피그마의 Show Place 자리다.
const CARD = 'gap-[24px] rounded-[14px] bg-white p-[16px]';

type OptionCardProps = {
  title: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
  children?: ReactNode;
};

export function OptionCard({ title, description, selected, onSelect, children }: OptionCardProps) {
  return (
    <View className={CARD}>
      <Pressable
        accessibilityRole="radio"
        accessibilityLabel={title}
        accessibilityState={{ selected }}
        onPress={onSelect}
        className="flex-row items-center justify-between">
        <View className="gap-[4px]">
          <Text className="font-pretendard text-body2 text-black">{title}</Text>
          <Text className="font-pretendard text-caption-12 text-gray-30">{description}</Text>
        </View>
        <Checkbox checked={selected} onChange={onSelect} />
      </Pressable>
      {children}
    </View>
  );
}
