import { Text, View } from 'react-native';

// 달력 위의 요일 줄(일~토). 피그마 Calendar/Range, Calendar/Month, Calendar/Compact가 같은 모양이다(2026-11-18 기준).
// 요일 글자는 피그마에서 Noto Sans KR 11이다. 토큰에 없는 크기라 style로 넣고 글꼴은 Pretendard로 맞췄다.
const FONT_SIZE = 11;
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const SUNDAY = 0;
const SATURDAY = 6;

export function WeekdayRow() {
  return (
    <View className="flex-row">
      {WEEKDAYS.map((weekday, index) => (
        <Text
          key={weekday}
          className={`flex-1 text-center font-pretendard ${weekdayColor(index)}`}
          style={{ fontSize: FONT_SIZE }}>
          {weekday}
        </Text>
      ))}
    </View>
  );
}

function weekdayColor(weekday: number): string {
  if (weekday === SUNDAY) return 'text-red';
  if (weekday === SATURDAY) return 'text-blue-50';
  return 'text-gray-30';
}
