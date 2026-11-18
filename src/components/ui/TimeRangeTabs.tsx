import { Pressable, Text, View } from 'react-native';

// 피그마 Card/Time Input 안의 시작/종료 칸(time-range) (2026-11-18 기준). 디자인이 완성 전이라 수치가 바뀔 수 있다.
// 회색 바탕 위에 두 칸. 흰 칸이 지금 고치는 쪽이고, 누르면 그쪽으로 바뀐다.
// 시각 글자(20)는 토큰 h4(20)와 같은 크기다.
const TRACK = 'flex-row gap-[7px] rounded-[14px] bg-gray-10 p-[4px]';
const TAB = 'flex-1 items-center justify-center gap-[4px] rounded-[12px] p-[5px]';

export type TimeEdge = 'start' | 'end';

type TimeRangeTabsProps = {
  startText: string;
  endText: string;
  selected: TimeEdge;
  onSelect: (edge: TimeEdge) => void;
};

export function TimeRangeTabs({ startText, endText, selected, onSelect }: TimeRangeTabsProps) {
  return (
    <View className={TRACK}>
      <Tab label="시작" value={startText} selected={selected === 'start'} onPress={() => onSelect('start')} />
      <Tab label="종료" value={endText} selected={selected === 'end'} onPress={() => onSelect('end')} />
    </View>
  );
}

type TabProps = { label: string; value: string; selected: boolean; onPress: () => void };

function Tab({ label, value, selected, onPress }: TabProps) {
  const color = selected ? 'text-gray-60' : 'text-gray-40';
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={`${label} ${value}`}
      accessibilityState={{ selected }}
      onPress={onPress}
      className={`${TAB} ${selected ? 'bg-white' : ''}`}>
      <Text className={`font-pretendard text-caption-12 ${color}`}>{label}</Text>
      <Text className={`font-pretendard text-h4 ${color}`}>{value}</Text>
    </Pressable>
  );
}
