import { Pressable, Text, View } from 'react-native';

import type { Plan } from '@/api/plans';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { shortDateText, timeText } from '@/lib/dateText';
import { planLabel } from '@/lib/planLabel';

// 피그마 Card/Plan (2026-11-18 기준). 디자인이 완성 전이라 수치가 바뀔 수 있다.
// 줄 두 개가 흐른다: 머리(제목과 라벨) → 본문(시각·날짜 | 핀과 장소, 오른쪽 끝에 얼굴). 수치는 피그마 370 × 110에서 잰 값이다.
// 자리가 모자랄 때(docs/open-questions.md 2장): 라벨, 시각, 날짜, 얼굴 둘은 줄지 않는다. 제목과 장소 이름은 "…"로 준다.
// 카드가 좁아지면 구분선 양옆의 틈이 먼저 줄고, 장소 이름은 세 글자쯤의 자리(PLACE.minWidth)를 늘 갖는다.
// 피그마의 장소 아래 작은 글자("장소 확정", "장소 조율 중")는 docs/user-flow.md 3장에 따라 쓰지 않고,
// 오른쪽 위 라벨 하나(planLabel)가 상태를 보여준다.
const CARD = { minHeight: 110, opacity: 0.9, paddingTop: 15, paddingBottom: 14, paddingLeft: 22, paddingRight: 17 };
const HEAD = { gap: 12 };
// 라벨은 제목보다 2 아래에서 시작하고 얼굴보다 1 안쪽에서 끝난다.
const LABEL = { top: 2, right: 1 };
const BODY = { top: 15 };
// minWidth: "23:59"가 들어가는 너비. 시각이 짧아도("미정") 구분선이 카드마다 같은 자리에 온다.
const TIME = { fontSize: 22, lineHeight: 27, minWidth: 60 };
const DATE = { top: 2, left: 1 };
const DIVIDER = { top: 6, height: 37 };
// 구분선 양옆의 틈. 피그마 너비에서는 max이고, 카드가 좁아 장소 자리가 모자라면 min까지 준다.
const GAP_BEFORE_DIVIDER = { min: 12, max: 34 };
const GAP_AFTER_DIVIDER = { min: 10, max: 18 };
const PIN = { top: 2 };
const PLACE = { top: 4, left: 3, minWidth: 44 };
// 얼굴 두 개(지름 50)를 25씩 겹친다. 왼쪽 얼굴이 위에 온다. top: 본문 줄보다 6 위에서 시작한다.
const AVATAR = { size: 50, border: 1.5, overlap: 25, top: -6, left: 16, max: 2 };
// 확정 전 약속은 시각과 장소가 없다(docs/open-questions.md 2장 가정).
const UNDECIDED = '미정';

type PlanCardProps = {
  plan: Plan;
  // 라벨("내일", "3일 뒤")을 계산하는 기준 시각
  now: Date;
  onPress: () => void;
};

export function PlanCard({ plan, now, onPress }: PlanCardProps) {
  const startsAt = plan.confirmed ? new Date(plan.confirmed.startsAt) : null;
  const label = planLabel(plan, now);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={[
        plan.title,
        label,
        startsAt ? `${shortDateText(startsAt)} ${timeText(startsAt)}` : null,
        plan.confirmed?.place.name,
      ]
        .filter(Boolean)
        .join(', ')}
      onPress={onPress}
      className="overflow-hidden rounded-[12px] bg-white"
      style={CARD}>
      <View className="flex-row items-start" style={{ gap: HEAD.gap }}>
        <Text numberOfLines={1} className="flex-1 font-pretendard text-body1 text-black">
          {plan.title}
        </Text>
        <Text
          className="font-pretendard text-caption-14 text-gray-30"
          style={{ marginTop: LABEL.top, marginRight: LABEL.right }}>
          {label}
        </Text>
      </View>

      <View className="flex-row items-start" style={{ marginTop: BODY.top }}>
        <View style={{ minWidth: TIME.minWidth }}>
          <Text
            className="font-pretendard text-black"
            style={{ fontSize: TIME.fontSize, lineHeight: TIME.lineHeight }}>
            {startsAt ? timeText(startsAt) : UNDECIDED}
          </Text>
          {startsAt ? (
            <Text
              className="font-pretendard text-caption-12 text-gray-30"
              style={{ marginTop: DATE.top, marginLeft: DATE.left }}>
              {shortDateText(startsAt)}
            </Text>
          ) : null}
        </View>
        <BodyGap {...GAP_BEFORE_DIVIDER} />
        <View className="w-px bg-gray-30" style={{ marginTop: DIVIDER.top, height: DIVIDER.height }} />
        <BodyGap {...GAP_AFTER_DIVIDER} />

        <View style={{ marginTop: PIN.top }}>
          <Icon name="pin-fill" className="text-gray-30" />
        </View>
        <Text
          numberOfLines={1}
          className="flex-1 font-pretendard text-body2 text-black"
          style={{ marginTop: PLACE.top, marginLeft: PLACE.left, minWidth: PLACE.minWidth }}>
          {plan.confirmed?.place.name ?? UNDECIDED}
        </Text>

        <Faces members={plan.members.slice(0, AVATAR.max)} />
      </View>
    </Pressable>
  );
}

// 구분선 옆의 틈. 카드가 좁으면 max에서 min까지 준다.
function BodyGap({ min, max }: { min: number; max: number }) {
  return <View className="shrink" style={{ flexBasis: max, minWidth: min }} />;
}

// 본문 줄의 오른쪽 끝에 놓이는 겹친 얼굴. 뒤집어 그려서(오른쪽 얼굴 먼저) 첫 사람이 왼쪽 위에 온다.
function Faces({ members }: { members: Plan['members'] }) {
  return (
    <View className="flex-row-reverse" style={{ marginTop: AVATAR.top, paddingLeft: AVATAR.left }}>
      {[...members].reverse().map((member, index) => (
        <View key={member.id} style={{ marginRight: index === 0 ? 0 : -AVATAR.overlap }}>
          <Avatar
            name={member.name}
            photo={member.avatarUrl ? { uri: member.avatarUrl } : undefined}
            size={AVATAR.size}
            borderWidth={AVATAR.border}
            className="border-gray-20"
          />
        </View>
      ))}
    </View>
  );
}
