import { Pressable, Text, View } from 'react-native';

// 피그마 Button/Primary (2026-11-17 기준). 디자인이 완성 전이라 수치가 바뀔 수 있다.
const BOX = 'h-[60px] w-full items-center justify-center rounded-[10px]';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
};

// 상태: Default / Pressed(누르는 동안) / Disabled
export function Button({ label, onPress, disabled = false }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}>
      {({ pressed }) => {
        const bg = disabled ? 'bg-gray-30' : pressed ? 'bg-black' : 'bg-gray-60';
        const color = !disabled && pressed ? 'text-gray-30' : 'text-white';
        return (
          <View className={`${BOX} ${bg}`}>
            <Text className={`font-pretendard text-body1 ${color}`}>{label}</Text>
          </View>
        );
      }}
    </Pressable>
  );
}
