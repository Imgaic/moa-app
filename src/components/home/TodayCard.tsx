import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Line, Path } from 'react-native-svg';

import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { Svg } from '@/components/ui/Svg';
import { longDateText, timeText } from '@/lib/dateText';
import { fittingCount } from '@/lib/fittingCount';
import type { ConfirmedPlan } from '@/lib/homePlans';
import { planLabel } from '@/lib/planLabel';

// 피그마 Card/Today (2026-11-18 기준). 디자인이 완성 전이라 수치가 바뀔 수 있다.
// 피그마의 티켓 모양(양옆이 파인 검은 카드)은 SVG 한 장(370 × 238)이다. 화면 너비에 따라 카드 너비가 바뀌어도
// 파인 곳이 찌그러지지 않게, 둥근 사각형 위에 바탕색(gray-10) 원 두 개를 얹어 그렸다.
// 피그마의 얼굴 테두리 링(파란 호)은 멤버별 이동 진척도로 보이는데 범위가 미정이라(Q8) 그리지 않았다.
const CARD = { height: 238, radius: 16 };
const NOTCH = { radius: 16, centerY: 143 };
// right: 제목이 길어도 오른쪽 위 라벨(가장 긴 "23시간 후")과 겹치지 않게 비워 두는 너비
const HEAD = { left: 32, top: 17, right: 96 };
const BADGE = { right: 19, top: 24, fontSize: 10, lineHeight: 12 };
// right: 장소 이름이 길면 카드 안쪽 여백에서 "…"로 줄도록 오른쪽 끝을 정한다(점선의 안쪽 여백과 같다).
const WHEN = { left: 32, top: 86, right: 28, gap: 30 };
const DIVIDER_HEIGHT = 30;
const PIN_SIZE = 20;
const DASH = { inset: 28, top: 150, dash: 4.0256, opacity: 0.6 };
// 얼굴 줄과 "외 N명"이 양 끝에 놓이는 맨 아래 줄
const FOOT = { left: 28, right: 19, top: 168 };
const FACES = { gap: 12, size: 50, max: 4 };
// left: 얼굴과 붙지 않게 두는 틈. bottom: 피그마에서 글자가 얼굴 줄의 바닥보다 8 위에 있다.
const MORE = { left: 12, bottom: 8, fontSize: 13, lineHeight: 16 };
const SUB_OPACITY = 0.8;

type TodayCardProps = {
  plan: ConfirmedPlan;
  // 라벨("10분 후")을 계산하는 기준 시각
  now: Date;
  onPress: () => void;
};

export function TodayCard({ plan, now, onPress }: TodayCardProps) {
  const startsAt = new Date(plan.confirmed.startsAt);
  const label = planLabel(plan, now);
  // 화면이 좁으면 얼굴이 "외 N명"과 겹치므로, 얼굴 줄의 너비에 들어가는 만큼만 그리고 나머지는 "외 N명"에 더한다.
  // 너비를 재기 전(null)에는 피그마 너비 기준으로 최대 수를 그린다.
  const [facesWidth, setFacesWidth] = useState<number | null>(null);
  const faceCount = facesWidth === null ? FACES.max : fittingCount({ width: facesWidth, ...FACES });
  const faces = plan.members.slice(0, faceCount);
  const others = plan.members.length - faces.length;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`오늘의 약속, ${plan.title}, ${label}, ${timeText(startsAt)}, ${plan.confirmed.place.name}`}
      onPress={onPress}
      className="overflow-hidden bg-gray-60"
      style={{ height: CARD.height, borderRadius: CARD.radius }}>
      {/* 티켓의 양옆 파인 곳 */}
      <View
        className="absolute rounded-full bg-gray-10"
        style={{
          width: NOTCH.radius * 2,
          height: NOTCH.radius * 2,
          left: -NOTCH.radius,
          top: NOTCH.centerY - NOTCH.radius,
        }}
      />
      <View
        className="absolute rounded-full bg-gray-10"
        style={{
          width: NOTCH.radius * 2,
          height: NOTCH.radius * 2,
          right: -NOTCH.radius,
          top: NOTCH.centerY - NOTCH.radius,
        }}
      />

      <View className="absolute gap-[3px]" style={HEAD}>
        <Text
          className="font-pretendard text-caption-14 text-white"
          style={{ opacity: SUB_OPACITY }}>
          오늘의 약속
        </Text>
        <Text numberOfLines={1} className="font-pretendard text-h2 text-white">
          {plan.title}
        </Text>
      </View>

      <View
        className="absolute rounded-full border border-white bg-red px-[12px] py-[6px]"
        style={{ right: BADGE.right, top: BADGE.top }}>
        <Text
          className="font-pretendard text-white"
          style={{ fontSize: BADGE.fontSize, lineHeight: BADGE.lineHeight }}>
          {label}
        </Text>
      </View>

      <View
        className="absolute flex-row items-end"
        style={WHEN}>
        <View className="gap-[4px]">
          <Text
            className="font-pretendard text-caption-14 text-white"
            style={{ opacity: SUB_OPACITY }}>
            {longDateText(startsAt)}
          </Text>
          <Text className="font-pretendard text-h2 text-white">{timeText(startsAt)}</Text>
        </View>
        <View className="mb-[2px] w-px bg-gray-20" style={{ height: DIVIDER_HEIGHT }} />
        <View className="shrink flex-row items-center gap-[8px]">
          <Icon name="pin-fill" size={PIN_SIZE} className="shrink-0 text-gray-10" />
          <Text numberOfLines={1} className="shrink font-pretendard text-h2 text-white">
            {plan.confirmed.place.name}
          </Text>
        </View>
      </View>

      {/* 점선. 피그마는 길이 4.03의 선과 같은 길이의 틈이 반복된다. */}
      <Svg
        height={1}
        className="absolute text-gray-20"
        style={{ left: DASH.inset, right: DASH.inset, top: DASH.top }}>
        <Line
          x1="0"
          y1="0.5"
          x2="100%"
          y2="0.5"
          stroke="currentColor"
          strokeOpacity={DASH.opacity}
          strokeDasharray={[DASH.dash, DASH.dash]}
        />
      </Svg>

      <View className="absolute flex-row items-end" style={FOOT}>
        <View
          className="flex-1 flex-row"
          style={{ gap: FACES.gap }}
          onLayout={(event) => setFacesWidth(event.nativeEvent.layout.width)}>
          {faces.map((m) => (
            <Avatar
              key={m.id}
              name={m.name}
              photo={m.avatarUrl ? { uri: m.avatarUrl } : undefined}
              size={FACES.size}
            />
          ))}
        </View>

        {others > 0 ? (
          <View
            className="flex-row items-center gap-[8px]"
            style={{ marginLeft: MORE.left, marginBottom: MORE.bottom }}>
            <Text
              className="font-pretendard text-white"
              style={{ fontSize: MORE.fontSize, lineHeight: MORE.lineHeight }}>
              외 {others}명
            </Text>
            {/* 피그마의 작은 꺾쇠(5 × 8). 아이콘 묶음의 chevron-right보다 작고 선이 굵어 그대로 옮겼다. */}
            <Svg width={5.65} height={9.25} viewBox="0 0 5.64924 9.25005" className="text-white">
              <Path
                d="M0.625023 0.625023L4.64894 3.84415C5.14934 4.24448 5.14934 5.00557 4.64894 5.40589L0.625023 8.62502"
                stroke="currentColor"
                strokeWidth={1.25}
                strokeLinecap="round"
                fill="none"
              />
            </Svg>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}
