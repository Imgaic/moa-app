import { Pressable, Text, View } from 'react-native';

import { Icon } from './Icon';

// 피그마 Section/Header (2026-11-18 기준). 디자인이 완성 전이라 수치가 바뀔 수 있다.
// 왼쪽 제목, 오른쪽 흰 알약 버튼(더하기 + 글자). 버튼은 피그마 showAction처럼 없을 수 있다(추천 후보 머리).
const ACTION = 'flex-row items-center gap-[9px] rounded-full bg-white px-[16px] py-[7px]';
const PLUS_SIZE = 15;

type SectionHeaderProps = {
  title: string;
  action?: { label: string; onPress: () => void };
};

export function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between">
      <Text accessibilityRole="header" className="font-pretendard text-h4 text-gray-50">
        {title}
      </Text>
      {action ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={action.label}
          onPress={action.onPress}
          className={`${ACTION} active:opacity-70`}>
          <Icon name="plus" size={PLUS_SIZE} className="text-gray-60" />
          <Text className="font-pretendard text-body1 text-gray-60">{action.label}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
