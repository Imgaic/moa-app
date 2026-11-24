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
// 위에서 아래로 줄 네 개가 흐른다: 머리(제목과 남은 시간) → 시각·장소 → 점선 → 얼굴. 수치는 피그마 370 × 238에서 잰 값이다.
// 고정 좌표는 티켓의 양옆 파인 곳에만 쓴다(둥근 사각형 위에 바탕색 원 두 개를 얹어, 카드 너비가 바뀌어도 찌그러지지 않는다).
// 자리가 모자랄 때(docs/open-questions.md 2장): 남은 시간 알약, 날짜, 시각은 줄지 않는다. 제목과 장소 이름은 "…"로 준다.
// 카드가 좁아지면 시각과 장소 사이의 틈이 30에서 12까지 먼저 줄고, 장소 이름은 세 글자쯤의 자리(PLACE_MIN_WIDTH)를 늘 갖는다. 얼굴은 들어가는 만큼만 그리고 나머지는 "외 N명"에 더한다.
// 피그마의 얼굴 테두리 링(파란 호)은 멤버별 이동 진척도로 보이는데 범위가 미정이라(Q8) 그리지 않았다.
const CARD = { minHeight: 238, radius: 16, paddingTop: 17, paddingBottom: 20 };
const HEAD = { left: 32, right: 19, gap: 12 };
const BADGE = { top: 7, fontSize: 10, lineHeight: 12 };
const WHEN = { top: 15, left: 32, right: 28 };
// 구분선 양옆의 틈. 피그마 너비에서는 max이고, 카드가 좁아 장소 자리가 모자라면 min까지 준다.
const WHEN_GAP = { min: 12, max: 30 };
// 핀(20) + 틈(8) + 세 글자("중앙대")가 들어가는 너비
const PLACE_MIN_WIDTH = 104;
const DIVIDER_HEIGHT = 30;
const PIN_SIZE = 20;
// 파인 곳의 가운데는 시각·장소 줄 아래 2, 점선은 거기서 7 아래다.
const NOTCH = { radius: 16, top: 2 };
const DASH = { top: 7, inset: 28, dash: 4.0256, opacity: 0.6 };
// 얼굴 줄과 "외 N명"이 양 끝에 놓이는 맨 아래 줄
const FOOT = { top: 17, left: 28, right: 19 };
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
      style={{
        minHeight: CARD.minHeight,
        borderRadius: CARD.radius,
        paddingTop: CARD.paddingTop,
        paddingBottom: CARD.paddingBottom,
      }}>
      <View
        className="flex-row items-start"
        style={{ paddingLeft: HEAD.left, paddingRight: HEAD.right, gap: HEAD.gap }}>
        <View className="flex-1 gap-[3px]">
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
          className="rounded-full border border-white bg-red px-[12px] py-[6px]"
          style={{ marginTop: BADGE.top }}>
          <Text
            className="font-pretendard text-white"
            style={{ fontSize: BADGE.fontSize, lineHeight: BADGE.lineHeight }}>
            {label}
          </Text>
        </View>
      </View>

      <View
        className="flex-row items-end"
        style={{ marginTop: WHEN.top, paddingLeft: WHEN.left, paddingRight: WHEN.right }}>
        <View className="gap-[4px]">
          <Text
            className="font-pretendard text-caption-14 text-white"
            style={{ opacity: SUB_OPACITY }}>
            {longDateText(startsAt)}
          </Text>
          <Text className="font-pretendard text-h2 text-white">{timeText(startsAt)}</Text>
        </View>
        <WhenGap />
        <View className="mb-[2px] w-px bg-gray-20" style={{ height: DIVIDER_HEIGHT }} />
        <WhenGap />
        <View className="flex-1 flex-row items-center gap-[8px]" style={{ minWidth: PLACE_MIN_WIDTH }}>
          <Icon name="pin-fill" size={PIN_SIZE} className="shrink-0 text-gray-10" />
          <Text numberOfLines={1} className="shrink font-pretendard text-h2 text-white">
            {plan.confirmed.place.name}
          </Text>
        </View>
      </View>

      {/* 티켓의 양옆 파인 곳. 높이가 없는 줄에 원을 얹어, 글자가 커져 줄이 내려가도 점선과 같이 내려간다. */}
      <View style={{ marginTop: NOTCH.top }}>
        <Notch side="left" />
        <Notch side="right" />
      </View>

      {/* 점선. 피그마는 길이 4.03의 선과 같은 길이의 틈이 반복된다. */}
      <Svg
        height={1}
        className="text-gray-20"
        style={{ marginTop: DASH.top, marginHorizontal: DASH.inset }}>
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

      <View
        className="flex-row items-end"
        style={{ marginTop: FOOT.top, paddingLeft: FOOT.left, paddingRight: FOOT.right }}>
        <View
          className="flex-1 flex-row"
          style={{ gap: FACES.gap }}
          onLayout={(event) => setFacesWidth(event.nativeEvent.layout.width)}>
          {faces.map((member) => (
            <Avatar
              key={member.id}
              name={member.name}
              photo={member.avatarUrl ? { uri: member.avatarUrl } : undefined}
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

// 시각과 장소 사이의 틈. 카드가 좁으면 max에서 min까지 준다.
function WhenGap() {
  return <View className="shrink" style={{ flexBasis: WHEN_GAP.max, minWidth: WHEN_GAP.min }} />;
}

function Notch({ side }: { side: 'left' | 'right' }) {
  return (
    <View
      className="absolute rounded-full bg-gray-10"
      style={{ width: NOTCH.radius * 2, height: NOTCH.radius * 2, top: -NOTCH.radius, [side]: -NOTCH.radius }}
    />
  );
}
