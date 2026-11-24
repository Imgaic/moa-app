import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

// 피그마 Input/Field, Input/Field Group (2026-11-18 기준). 디자인이 완성 전이라 수치가 바뀔 수 있다.
// 두 칸(예: 시작, 종료)을 회색 바탕에 나란히 두고, 지금 고르는 칸을 흰 바탕으로 띄운다.
const GROUP = 'flex-row gap-[7px] rounded-[14px] bg-gray-10 p-[4px]';
const FIELD = 'h-[50px] flex-1 items-center justify-center gap-[4px] rounded-[12px] p-[5px]';

export function InputFieldGroup({ children }: { children: ReactNode }) {
  return <View className={GROUP}>{children}</View>;
}

type InputFieldProps = {
  label: string;
  value: string;
  // 피그마 State: Selected(흰 바탕) / Default
  selected: boolean;
};

export function InputField({ label, value, selected }: InputFieldProps) {
  const color = selected ? 'text-gray-60' : 'text-gray-40';
  return (
    <View
      accessible
      accessibilityLabel={`${label} ${value}`}
      accessibilityState={{ selected }}
      className={`${FIELD} ${selected ? 'bg-white' : ''}`}>
      <Text className={`font-pretendard text-caption-12 ${color}`}>{label}</Text>
      <Text className={`font-pretendard text-h4 ${color}`}>{value}</Text>
    </View>
  );
}
