import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Candidate } from '@/api/candidates';
import type { PlanDetail, PlanMember } from '@/api/plans';
import { CandidateCard } from '@/components/ui/CandidateCard';
import { DoneIllustration } from '@/components/ui/Icon';
import { candidateCardText } from '@/lib/candidateText';
import { confirmedFirst } from '@/lib/confirmedNotice';

// 피그마 09 Confirm / Done (2026-11-18 기준). 확정 뒤 허브에 처음 들어올 때 허브 위에 덮이는 화면이다(T5).
// 가만히 두면 AUTO_CLOSE_MS 뒤에 닫히고, 화면 어디를 눌러도 닫힌다.
// 등장 애니메이션은 피그마에 없어 구현에서 정했다. Reanimated 레이아웃 애니메이션은 기본이 ReduceMotion.System이라
// 기기의 "동작 줄이기"가 켜져 있으면 움직이지 않고 바로 보인다.
// 피그마 기준 위치: 상태 표시줄 아래 100에 그림(140), 17 아래 제목, 40 아래 후보 묶음.
// 후보는 확정된 것이 맨 앞(그림자), 뒤로 갈수록 흐리게 17씩 겹친다. 피그마 아래쪽의 회색 그라데이션은 넣지 않았다.
const AUTO_CLOSE_MS = 2500;
const ILLUSTRATION_TOP = 100;
const TITLE_TOP = 17;
const LIST_TOP = 40;
const LIST_WIDTH = 338;
const CARD_OVERLAP = 17;
const CARD_OPACITIES = [1, 0.3, 0.2, 0.1];
const CARD_SHADOW = '0px 5px 7px rgba(0, 0, 0, 0.08)';
const ENTER_STEP_MS = 120;

type ConfirmedNoticeProps = {
  candidates: Candidate[];
  confirmed: NonNullable<PlanDetail['confirmed']>;
  members: PlanMember[];
  onClose: () => void;
};

export function ConfirmedNotice({ candidates, confirmed, members, onClose }: ConfirmedNoticeProps) {
  const { top } = useSafeAreaInsets();
  // 확정된 후보가 맨 앞. 같은 후보가 없으면 그림과 글자만 보인다.
  const stacked = confirmedFirst(candidates, confirmed).slice(0, CARD_OPACITIES.length);

  useEffect(() => {
    const timer = setTimeout(onClose, AUTO_CLOSE_MS);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} className="absolute inset-0 bg-gray-10">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="약속이 확정됐어요. 눌러서 닫기"
        onPress={onClose}
        className="flex-1 items-center"
        style={{ paddingTop: top + ILLUSTRATION_TOP }}>
        <Animated.View entering={ZoomIn.springify()}>
          <DoneIllustration />
        </Animated.View>
        <Animated.View
          entering={FadeInDown.delay(ENTER_STEP_MS)}
          className="items-center gap-[9px]"
          style={{ marginTop: TITLE_TOP }}>
          <Text className="font-pretendard text-h2 text-gray-50">약속이 확정됐어요</Text>
          <Text className="font-pretendard text-caption-14 text-gray-30">
            확정된 약속은 메인 화면에서 볼 수 있어요.
          </Text>
        </Animated.View>
        <Animated.View
          entering={FadeInDown.delay(ENTER_STEP_MS * 2)}
          // 카드를 눌러도 닫히도록 카드는 누르는 대상에서 뺀다.
          pointerEvents="none"
          style={{ marginTop: LIST_TOP, width: LIST_WIDTH }}>
          {stacked.map((candidate, index) => (
            <View
              key={candidate.id}
              className="rounded-[13px]"
              style={{
                marginTop: index === 0 ? 0 : -CARD_OVERLAP,
                zIndex: CARD_OPACITIES.length - index,
                opacity: CARD_OPACITIES[index],
                boxShadow: CARD_SHADOW,
              }}>
              <CandidateCard {...candidateCardText(candidate, candidates, members)} checked={index === 0} />
            </View>
          ))}
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}
