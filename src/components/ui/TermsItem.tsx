import { Pressable, Text, View } from 'react-native';

import { Icon } from './Icon';

// 피그마 List/Terms Item (2026-11-18 기준). 디자인이 완성 전이라 수치가 바뀔 수 있다.
// 왼쪽 체크(동의 전 gray-30, 동의 black), 제목과 설명 한 줄(있을 때), 오른쪽 화살표(showArrow).
// 줄 어디를 눌러도 체크가 바뀐다. 화살표는 약관 내용 화면이 없어 누를 수 없는 표시다.
const CHECK_GAP = 'gap-[10px]';
const TEXT_GAP = 'gap-[7px]';
const HIT_SLOP = 6;

type TermsItemProps = {
  title: string;
  description?: string;
  checked: boolean;
  onPress: () => void;
  showArrow?: boolean;
};

export function TermsItem({ title, description, checked, onPress, showArrow = true }: TermsItemProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={title}
      accessibilityState={{ checked }}
      hitSlop={HIT_SLOP}
      onPress={onPress}
      className="flex-row items-center justify-between">
      <View className={`flex-1 flex-row items-center ${CHECK_GAP}`}>
        <Icon name="check" className={checked ? 'text-black' : 'text-gray-30'} />
        <View className={`flex-1 ${TEXT_GAP}`}>
          <Text className="font-pretendard text-body2 text-gray-50">{title}</Text>
          {description ? (
            <Text className="font-pretendard text-caption-14 text-gray-30">{description}</Text>
          ) : null}
        </View>
      </View>
      {showArrow ? <Icon name="chevron-right" className="text-gray-30" /> : null}
    </Pressable>
  );
}
