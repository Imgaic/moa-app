// 약속 허브 (피그마 05 Hub). 링크와 홈 카드가 항상 여기로 온다.
// 이 화면은 약속과 제안을 api로 가져와, 위의 머리(이름과 조건 줄)를 그리고, 상태에 맞는 내용 컴포넌트를 고른다.
// 상태별 내용은 src/components/plan-hub/에 있다. 지금은 모집 중만 있고, 추천 나옴과 확정은 다음 작업에서 만든다.
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { getMe } from '@/api/me';
import { closeAndRecommend, getInviteLink, getPlan, type PlanDetail } from '@/api/plans';
import { getProposals, type PlaceProposal } from '@/api/proposals';
import { CollectingContent } from '@/components/plan-hub/CollectingContent';
import { PageTitle } from '@/components/ui/PageTitle';
import { TopBar } from '@/components/ui/TopBar';
import { confirm, notify, shareLink } from '@/lib/dialogs';
import { conditionText, proposedByText } from '@/lib/hubText';

// 피그마 기준 위치(2026-11-18). 상단 바 아래 20에 제목.
const TITLE_TOP = 20;

type Loaded =
  | { state: 'loading' }
  | { state: 'error' }
  | { state: 'missing' }
  | { state: 'done'; plan: PlanDetail; proposals: PlaceProposal[]; myId: string };

export default function PlanHub() {
  const { planId } = useLocalSearchParams<{ planId: string }>();
  const [loaded, setLoaded] = useState<Loaded>({ state: 'loading' });

  // 실시간 반영 방식이 미정이라, 화면에 들어올 때와 내 동작 뒤에만 다시 불러온다.
  // 다시 불러오는 동안은 앞의 내용을 그대로 둔다.
  const load = useCallback(async () => {
    try {
      const [plan, proposals, me] = await Promise.all([getPlan(planId), getProposals(planId), getMe()]);
      setLoaded(plan ? { state: 'done', plan, proposals, myId: me.id } : { state: 'missing' });
    } catch {
      setLoaded({ state: 'error' });
    }
  }, [planId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const share = async () => {
    try {
      await shareLink(await getInviteLink(planId));
    } catch {
      notify('링크를 만들지 못했어요', '잠시 뒤에 다시 시도해 주세요.');
    }
  };

  return (
    <View className="flex-1 bg-gray-10">
      <TopBar type="share" onBack={() => router.back()} onAction={share} />
      {loaded.state === 'loading' ? (
        <ActivityIndicator className="mt-[40px]" />
      ) : loaded.state !== 'done' ? (
        <Text className="mt-[40px] text-center font-pretendard text-body2 text-gray-40">
          {loaded.state === 'missing' ? '약속을 찾을 수 없어요' : '약속을 불러오지 못했어요'}
        </Text>
      ) : (
        <>
          <View className="px-[32px]" style={{ paddingTop: TITLE_TOP }}>
            <PageTitle title={loaded.plan.title} subtitle={conditionText(loaded.plan)} />
          </View>
          <HubContent {...loaded} onChanged={load} />
        </>
      )}
    </View>
  );
}

type HubContentProps = {
  plan: PlanDetail;
  proposals: PlaceProposal[];
  myId: string;
  onChanged: () => void;
};

// 약속의 상태에 맞는 내용을 고른다.
function HubContent({ plan, proposals, myId, onChanged }: HubContentProps) {
  if (plan.status !== 'collecting') {
    return (
      <Text className="mt-[40px] text-center font-pretendard text-body2 text-gray-40">
        이 상태의 허브는 다음 작업에서 만든다
      </Text>
    );
  }

  const closeAndRefresh = async () => {
    const confirmed = await confirm({
      title: '마감하고 추천받을까요?',
      message: '지금까지 입력한 일정으로 시간과 장소를 추천받아요.',
      confirmLabel: '마감하기',
    });
    if (!confirmed) return;
    try {
      await closeAndRecommend(plan.id);
      onChanged();
    } catch {
      notify('마감하지 못했어요', '잠시 뒤에 다시 시도해 주세요.');
    }
  };

  const params = { planId: plan.id };
  return (
    <CollectingContent
      members={plan.members}
      proposals={proposals.map((proposal) => ({
        id: proposal.id,
        name: proposal.place.name,
        detail: proposedByText(proposal.memberId, plan.members),
      }))}
      isHost={plan.hostId === myId}
      submitted={plan.members.some((member) => member.id === myId && member.submitted)}
      onInput={() => router.push({ pathname: '/plans/[planId]/input', params })}
      onPropose={() => router.push({ pathname: '/plans/[planId]/place-search', params })}
      onClose={closeAndRefresh}
    />
  );
}
