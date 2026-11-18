import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Candidate } from '@/api/candidates';
import type { PlanMember } from '@/api/plans';
import { Button } from '@/components/ui/Button';
import { CandidateCard } from '@/components/ui/CandidateCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { candidateCardText } from '@/lib/candidateText';
import { myVoteOf, voteActionOf, votedMembers } from '@/lib/voteStatus';

import { HubMembers } from './HubMembers';
import { MembersModal } from './MembersModal';

// 약속 허브의 추천 나옴 내용 (피그마 05 Hub / Host - Recommended - Empty·Voting·Voted, 2026-11-18 기준).
// 멤버 영역(투표 현황), 추천 후보 목록, 맨 아래 버튼(투표하기 / 호스트의 투표 마감하기).
// 참가자 화면은 피그마에 없어, 호스트 화면에서 마감만 뺀 모양이다(docs/open-questions.md 2장).
// 피그마 기준 위치: 제목 아래 20에 멤버, 32에 후보 머리, 16에 목록(카드 사이 16). 버튼은 홈 인디케이터 위 3.
const MEMBERS_TOP = 20;
const SECTION_TOP = 32;
const LIST_TOP = 16;
const BUTTON_BOTTOM = 3;
const CHECK_TEXTS = { done: '투표 완료', pending: '투표 전' };

type RecommendedContentProps = {
  candidates: Candidate[];
  members: PlanMember[];
  myId: string;
  isHost: boolean;
  onVote: (candidateId: string) => void;
  onCloseVote: () => void;
};

export function RecommendedContent({
  candidates,
  members,
  myId,
  isHost,
  onVote,
  onCloseVote,
}: RecommendedContentProps) {
  const { bottom } = useSafeAreaInsets();
  const [membersOpen, setMembersOpen] = useState(false);
  // 투표하기 전에 고른 후보. 투표한 뒤에는 바꿀 수 없다(docs/open-questions.md 2장).
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const myVote = myVoteOf(candidates, myId);
  const action = voteActionOf({ isHost, myVote, selectedId });
  const checkedMembers = votedMembers(members, candidates);
  const pressAction = () => {
    if (action.kind === 'vote' && selectedId) onVote(selectedId);
    if (action.kind === 'close') onCloseVote();
  };

  return (
    <View className="flex-1">
      <ScrollView className="flex-1" contentContainerClassName="px-[32px] pb-[24px]">
        <View style={{ marginTop: MEMBERS_TOP }}>
          <HubMembers members={checkedMembers} doneText={CHECK_TEXTS.done} onPress={() => setMembersOpen(true)} />
        </View>
        <View style={{ marginTop: SECTION_TOP }}>
          <SectionHeader title="추천 후보" />
        </View>
        <View className="gap-[16px]" style={{ marginTop: LIST_TOP }}>
          {candidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              {...candidateCardText(candidate, candidates, members)}
              checked={(myVote ?? selectedId) === candidate.id}
              onPress={myVote === null ? () => setSelectedId(candidate.id) : undefined}
            />
          ))}
        </View>
      </ScrollView>

      <View className="px-[23.5px]" style={{ paddingBottom: bottom + BUTTON_BOTTOM }}>
        <Button label={action.label} disabled={action.disabled} onPress={pressAction} />
      </View>

      <MembersModal
        visible={membersOpen}
        members={checkedMembers}
        texts={CHECK_TEXTS}
        onClose={() => setMembersOpen(false)}
      />
    </View>
  );
}
