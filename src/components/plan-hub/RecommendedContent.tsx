import { useState } from 'react';
import { View } from 'react-native';

import type { Candidate } from '@/api/candidates';
import type { PlanMember } from '@/api/plans';
import { Button } from '@/components/ui/Button';
import { CandidateCard } from '@/components/ui/CandidateCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StepLayout } from '@/components/ui/StepLayout';
import { candidateCardText } from '@/lib/candidateText';
import { myVoteOf, voteActionOf, votedMembers } from '@/lib/voteStatus';

import { HubMembers } from './HubMembers';
import { MembersModal } from './MembersModal';

// 약속 허브의 추천 나옴 내용 (피그마 05 Hub / Host - Recommended - Empty·Voting·Voted, 2026-11-18 기준).
// 머리(약속 이름과 조건 줄), 멤버 영역(투표 현황), 추천 후보 목록, 맨 아래 버튼(투표하기 / 투표 바꾸기 / 호스트의 투표 마감하기).
// 머리부터 통째로 스크롤되고 버튼만 고정이다(틀은 StepLayout).
// 참가자 화면은 피그마에 없어, 호스트 화면에서 마감만 뺀 모양이다(docs/open-questions.md 2장).
// 피그마 기준 위치: 제목 아래 20에 멤버, 32에 후보 머리, 16에 목록(카드 사이 16).
const MEMBERS_TOP = 20;
const SECTION_TOP = 32;
const LIST_TOP = 16;
const CHECK_TEXTS = { done: '투표 완료', pending: '투표 전' };

type RecommendedContentProps = {
  // 허브의 머리: 약속 이름과 조건 줄. 내용과 함께 스크롤된다.
  title: string;
  conditions: string;
  candidates: Candidate[];
  members: PlanMember[];
  myId: string;
  isHost: boolean;
  onVote: (candidateId: string) => void;
  onCloseVote: () => void;
};

export function RecommendedContent({
  title,
  conditions,
  candidates,
  members,
  myId,
  isHost,
  onVote,
  onCloseVote,
}: RecommendedContentProps) {
  const [membersOpen, setMembersOpen] = useState(false);
  // 투표하거나 투표를 바꾸려고 고른 후보. 마감 전까지는 투표한 뒤에도 고를 수 있다(T13).
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const myVote = myVoteOf(candidates, myId);
  const action = voteActionOf({ isHost, myVote, selectedId });
  const checkedMembers = votedMembers(members, candidates);
  const pressAction = () => {
    if (action.kind === 'vote' && selectedId) onVote(selectedId);
    if (action.kind === 'close') onCloseVote();
  };

  return (
    <>
      <StepLayout
        title={title}
        subtitle={conditions}
        bodyTop={MEMBERS_TOP}
        button={<Button label={action.label} disabled={action.disabled} onPress={pressAction} />}>
        <HubMembers members={checkedMembers} doneText={CHECK_TEXTS.done} onPress={() => setMembersOpen(true)} />
        <View style={{ marginTop: SECTION_TOP }}>
          <SectionHeader title="추천 후보" />
        </View>
        <View className="gap-[16px]" style={{ marginTop: LIST_TOP }}>
          {candidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              {...candidateCardText(candidate, candidates, members)}
              checked={(selectedId ?? myVote) === candidate.id}
              onPress={() => setSelectedId(candidate.id)}
            />
          ))}
        </View>
      </StepLayout>

      <MembersModal
        visible={membersOpen}
        members={checkedMembers}
        texts={CHECK_TEXTS}
        onClose={() => setMembersOpen(false)}
      />
    </>
  );
}
