// 약속 허브 (피그마 05 Hub). 링크와 홈 카드가 항상 여기로 온다.
// 이 화면은 약속, 제안, 후보를 api로 가져와, 위의 머리(이름과 조건 줄)를 그리고, 상태에 맞는 내용 컴포넌트를 고른다.
// 상태별 내용은 src/components/plan-hub/에 있다: 모집 중, 추천 나옴(투표), 확정(임시 화면, T4).
// 확정 뒤 처음 들어오면 확정 완료 화면(ConfirmedNotice)을 허브 위에 덮는다(T5). 라우트가 아니라 덮개로 한 이유:
// "처음 한 번만"을 허브가 약속을 불러오는 자리 한 곳에서 판단하고 기록할 수 있고, 뒤로 가기 기록에 남지 않는다.
// 지난 약속은 홈에서 내려가 이 화면에 올 일이 거의 없어 확정과 같은 내용을 보여준다.
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { View } from 'react-native';

import { closeVote, getCandidates, vote, type Candidate } from '@/api/candidates';
import { getMe } from '@/api/me';
import {
  closeAndRecommend,
  getInviteLink,
  getPlan,
  hasSeenConfirmedNotice,
  markConfirmedNoticeSeen,
  type PlanDetail,
} from '@/api/plans';
import { getProposals, type PlaceProposal } from '@/api/proposals';
import { CollectingContent } from '@/components/plan-hub/CollectingContent';
import { ConfirmedContent } from '@/components/plan-hub/ConfirmedContent';
import { ConfirmedNotice } from '@/components/plan-hub/ConfirmedNotice';
import { RecommendedContent } from '@/components/plan-hub/RecommendedContent';
import { LoadStatus } from '@/components/ui/LoadStatus';
import { PageTitle } from '@/components/ui/PageTitle';
import { TopBar } from '@/components/ui/TopBar';
import { confirm, notify, shareLink } from '@/lib/dialogs';
import { shouldShowConfirmedNotice } from '@/lib/confirmedNotice';
import { conditionText, proposedByText } from '@/lib/hubText';

// 피그마 기준 위치(2026-11-18). 상단 바 아래 20에 제목.
const TITLE_TOP = 20;

type Loaded =
  | { state: 'loading' }
  | { state: 'error' }
  | { state: 'missing' }
  | { state: 'done'; plan: PlanDetail; proposals: PlaceProposal[]; candidates: Candidate[]; myId: string };

export default function PlanHub() {
  const { planId } = useLocalSearchParams<{ planId: string }>();
  const [loaded, setLoaded] = useState<Loaded>({ state: 'loading' });
  const [noticeOpen, setNoticeOpen] = useState(false);

  // 실시간 반영 방식이 미정이라, 화면에 들어올 때와 내 동작 뒤에만 다시 불러온다.
  // 다시 불러오는 동안은 앞의 내용을 그대로 둔다.
  const load = useCallback(async () => {
    try {
      const [plan, proposals, candidates, me, seen] = await Promise.all([
        getPlan(planId),
        getProposals(planId),
        getCandidates(planId),
        getMe(),
        hasSeenConfirmedNotice(planId),
      ]);
      setLoaded(plan ? { state: 'done', plan, proposals, candidates, myId: me.id } : { state: 'missing' });
      // 보여주는 순간 본 것으로 기록한다. 닫기 전에 앱이 꺼져도 다시 뜨지 않는다.
      if (plan && shouldShowConfirmedNotice(plan.status, seen)) {
        setNoticeOpen(true);
        markConfirmedNoticeSeen(planId);
      }
    } catch {
      setLoaded({ state: 'error' });
    }
  }, [planId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  // 확정 완료 화면의 타이머가 다시 그릴 때마다 새로 시작하지 않도록 같은 함수를 넘긴다.
  const closeNotice = useCallback(() => setNoticeOpen(false), []);

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
      {loaded.state !== 'done' ? (
        <LoadStatus state={loaded.state} errorText="약속을 불러오지 못했어요" missingText="약속을 찾을 수 없어요" />
      ) : (
        <>
          <View className="px-[32px]" style={{ paddingTop: TITLE_TOP }}>
            <PageTitle title={loaded.plan.title} subtitle={conditionText(loaded.plan)} />
          </View>
          <HubContent {...loaded} onChanged={load} />
        </>
      )}
      {noticeOpen && loaded.state === 'done' && loaded.plan.confirmed ? (
        <ConfirmedNotice
          candidates={loaded.candidates}
          confirmed={loaded.plan.confirmed}
          members={loaded.plan.members}
          onClose={closeNotice}
        />
      ) : null}
    </View>
  );
}

type HubContentProps = {
  plan: PlanDetail;
  proposals: PlaceProposal[];
  candidates: Candidate[];
  myId: string;
  onChanged: () => void;
};

// 약속의 상태에 맞는 내용을 고른다.
function HubContent({ plan, proposals, candidates, myId, onChanged }: HubContentProps) {
  const isHost = plan.hostId === myId;
  if (plan.status === 'recommended') {
    return (
      <RecommendedContent
        candidates={candidates}
        members={plan.members}
        myId={myId}
        isHost={isHost}
        onVote={(candidateId) => voteAndRefresh(plan.id, candidateId, onChanged)}
        onCloseVote={() => closeVoteAndRefresh(plan.id, onChanged)}
      />
    );
  }
  // 확정과 지남은 확정된 일시와 장소가 있다.
  if (plan.confirmed) {
    return (
      <ConfirmedContent
        confirmed={plan.confirmed}
        durationMinutes={plan.durationMinutes}
        members={plan.members}
        hostId={plan.hostId}
      />
    );
  }

  const params = { planId: plan.id };
  return (
    <CollectingContent
      members={plan.members}
      proposals={proposals.map((proposal) => ({
        id: proposal.id,
        name: proposal.place.name,
        detail: proposedByText(proposal.memberId, plan.members),
      }))}
      isHost={isHost}
      submitted={plan.members.some((member) => member.id === myId && member.submitted)}
      onInput={() => router.push({ pathname: '/plans/[planId]/input', params })}
      onPropose={() => router.push({ pathname: '/plans/[planId]/place-search', params })}
      onClose={() => recommendAndRefresh(plan.id, onChanged)}
    />
  );
}

async function recommendAndRefresh(planId: string, onChanged: () => void) {
  const confirmed = await confirm({
    title: '마감하고 추천받을까요?',
    message: '지금까지 입력한 일정으로 시간과 장소를 추천받아요.',
    confirmLabel: '마감하기',
  });
  if (!confirmed) return;
  try {
    await closeAndRecommend(planId);
    onChanged();
  } catch {
    notify('마감하지 못했어요', '잠시 뒤에 다시 시도해 주세요.');
  }
}

async function voteAndRefresh(planId: string, candidateId: string, onChanged: () => void) {
  try {
    await vote(planId, candidateId);
    onChanged();
  } catch {
    notify('투표하지 못했어요', '잠시 뒤에 다시 시도해 주세요.');
  }
}

// 확정되면 다시 불러온 허브가 확정 완료 화면을 띄운다. 마감한 호스트도 이 화면을 본다.
async function closeVoteAndRefresh(planId: string, onChanged: () => void) {
  const confirmed = await confirm({
    title: '투표를 마감할까요?',
    message: '가장 많은 표를 받은 후보로 약속이 확정돼요.',
    confirmLabel: '마감하기',
  });
  if (!confirmed) return;
  try {
    await closeVote(planId);
    onChanged();
  } catch {
    notify('마감하지 못했어요', '잠시 뒤에 다시 시도해 주세요.');
  }
}
