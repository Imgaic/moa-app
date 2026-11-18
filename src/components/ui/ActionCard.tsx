import { Pressable, Text } from 'react-native';

import { Icon } from './Icon';

// 피그마 List/Action Card (2026-11-18 기준). 디자인이 완성 전이라 수치가 바뀔 수 있다.
// 누르는 동안의 모양은 피그마에 없어 살짝 흐리게만 한다.
const CARD = 'flex-row items-center justify-between rounded-[16px] bg-white px-[20px] py-[21px]';

type ActionCardProps = {
  label: string;
  onPress: () => void;
};

export function ActionCard({ label, onPress }: ActionCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className={`${CARD} active:opacity-70`}>
      <Text className="flex-1 font-pretendard text-h4 text-black">{label}</Text>
      <Icon name="chevron-right" className="text-gray-60" />
    </Pressable>
  );
}
