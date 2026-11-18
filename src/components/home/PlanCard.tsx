import { Pressable, Text, View } from 'react-native';

import type { Plan } from '@/api/plans';
import { AvatarCircle } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { shortDateText, timeText } from '@/lib/dateText';
import { planLabel } from '@/lib/planLabel';

// 피그마 Card/Plan (2026-11-18 기준). 디자인이 완성 전이라 수치가 바뀔 수 있다.
// 피그마 카드는 370 × 110이고 안의 요소가 절대 위치로 놓여 있어, 같은 위치값을 왼쪽·오른쪽 기준으로 옮겼다.
// 피그마의 장소 아래 작은 글자("장소 확정", "장소 조율 중")는 docs/user-flow.md 3장에 따라 쓰지 않고,
// 오른쪽 위 라벨 하나(planLabel)가 상태를 보여준다.
const CARD = { height: 110, opacity: 0.9 };
const TITLE = { left: 22, top: 15, right: 90 };
const LABEL = { right: 18, top: 17 };
const TIME = { left: 22, top: 52, fontSize: 22, lineHeight: 27 };
const DATE = { left: 23, top: 81 };
const DIVIDER = { left: 116, top: 58, height: 37 };
const PIN = { left: 135, top: 54 };
const PLACE = { left: 162, top: 56, right: 108 };
// 얼굴 두 개(지름 50)를 25씩 겹친다. 왼쪽 얼굴이 위에 온다.
const AVATAR = { size: 50, border: 1.5, overlap: 25, right: 17, top: 46, max: 2 };
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
  // 첫 사람이 왼쪽 위에 오도록, 오른쪽 얼굴부터 그린다(i = 0이 맨 오른쪽).
  const faces = plan.members.slice(0, AVATAR.max).reverse();

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
      style={{ height: CARD.height, opacity: CARD.opacity }}>
      <Text
        numberOfLines={1}
        className="absolute font-pretendard text-body1 text-black"
        style={TITLE}>
        {plan.title}
      </Text>
      <Text className="absolute font-pretendard text-caption-14 text-gray-30" style={LABEL}>
        {label}
      </Text>

      <Text
        className="absolute font-pretendard text-black"
        style={{
          left: TIME.left,
          top: TIME.top,
          fontSize: TIME.fontSize,
          lineHeight: TIME.lineHeight,
        }}>
        {startsAt ? timeText(startsAt) : UNDECIDED}
      </Text>
      {startsAt ? (
        <Text className="absolute font-pretendard text-caption-12 text-gray-30" style={DATE}>
          {shortDateText(startsAt)}
        </Text>
      ) : null}
      <View className="absolute w-px bg-gray-30" style={DIVIDER} />

      <View className="absolute" style={PIN}>
        <Icon name="pin-fill" className="text-gray-30" />
      </View>
      <Text
        numberOfLines={1}
        className="absolute font-pretendard text-body2 text-black"
        style={PLACE}>
        {plan.confirmed?.place.name ?? UNDECIDED}
      </Text>

      {faces.map((m, i) => (
        <View
          key={m.id}
          className="absolute"
          style={{ top: AVATAR.top, right: AVATAR.right + i * AVATAR.overlap }}>
          <AvatarCircle
            name={m.name}
            photo={m.avatarUrl ? { uri: m.avatarUrl } : undefined}
            size={AVATAR.size}
            borderWidth={AVATAR.border}
            className="border-gray-20"
          />
        </View>
      ))}
    </Pressable>
  );
}
