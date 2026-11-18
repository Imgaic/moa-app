import { Pressable, Text, View } from 'react-native';

import { unbreakableText } from '@/lib/unbreakableText';

import { Checkbox } from './Checkbox';

// 피그마 Card/Candidate (2026-11-18 기준). 디자인이 완성 전이라 수치가 바뀔 수 있다.
// 피그마 대응: Type=Best = best, Attendance=All = everyone(참석 글자가 파란색). 오른쪽 체크는 Input/Checkbox.
// 배지는 피그마에서 너비 48 고정이지만 "태혁 제안"처럼 긴 글자가 들어가도록 최소 너비로 했다.
// 누르는 동안의 모양은 피그마에 없어 살짝 흐리게만 한다.
const CARD = 'flex-row items-center gap-[8px] rounded-[13px] bg-white py-[16px] pl-[20px] pr-[16px]';
const BADGE = 'items-center justify-center rounded-[7px] px-[8px] py-[4px]';
const BADGE_MIN_WIDTH = 48;
const META_HEIGHT = 30;
// 피그마는 한 줄이지만 장소 이름이 길면 잘려 장소를 알 수 없어 두 줄까지 보인다.
// 줄이 바뀔 때는 날짜·시각과 장소 사이에서 바뀐다(장소 이름은 통째로 다음 줄로).
const TITLE_LINES = 2;

type CandidateCardProps = {
  // "추천 1" 또는 "태혁 제안"
  badge: string;
  best: boolean;
  // "4월 1일 (수) 오후 7:00"
  dateTime: string;
  // "사당역"
  place: string;
  // "4명 모두" 또는 "3명 가능 · 동하 제외"
  attendance: string;
  everyone: boolean;
  // "· 평균 38분 · 최대 42분"
  detail: string;
  checked: boolean;
  // 없으면 누를 수 없다(이미 투표했거나 확정 뒤).
  onPress?: () => void;
};

export function CandidateCard({
  badge,
  best,
  dateTime,
  place,
  attendance,
  everyone,
  detail,
  checked,
  onPress,
}: CandidateCardProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={`${badge}, ${dateTime} ${place}, ${attendance} ${detail}`}
      accessibilityState={{ checked, disabled: !onPress }}
      disabled={!onPress}
      onPress={onPress}
      className={`${CARD} active:opacity-70`}>
      <View className="flex-1 gap-[6px]">
        <View className="flex-row items-center gap-[6px]">
          <View className={`${BADGE} ${best ? 'bg-gray-60' : 'bg-gray-20'}`} style={{ minWidth: BADGE_MIN_WIDTH }}>
            <Text className={`font-pretendard text-caption-12 ${best ? 'font-bold text-white' : 'text-gray-50'}`}>
              {badge}
            </Text>
          </View>
          <Text numberOfLines={TITLE_LINES} className="shrink font-pretendard text-body2 text-black">
            {dateTime} {unbreakableText(place)}
          </Text>
        </View>
        <View className="flex-row items-center gap-[5px]" style={{ height: META_HEIGHT }}>
          <Text className={`font-pretendard text-caption-14 ${everyone ? 'text-blue-50' : 'text-gray-60'}`}>
            {attendance}
          </Text>
          <Text numberOfLines={1} className="shrink font-pretendard text-caption-14 text-black">
            {detail}
          </Text>
        </View>
      </View>
      {/* 카드 전체가 누르는 곳이라 체크는 읽기 도구에서 숨긴다. 체크를 눌러도 카드를 누른 것과 같다. */}
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <Checkbox checked={checked} onChange={() => onPress?.()} />
      </View>
    </Pressable>
  );
}
