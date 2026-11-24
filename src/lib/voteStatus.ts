// 투표 현황: 내가 어느 후보에 투표했는지, 누가 투표했는지, 맨 아래 버튼이 무엇을 할지.
import type { Candidate } from '@/api/candidates';
import type { PlanMember } from '@/api/plans';

type Votes = Pick<Candidate, 'id' | 'voterIds'>[];

export type VoteAction = {
  // vote: 고른 후보에 투표(이미 투표했으면 그 후보로 바꾼다), close: 호스트의 투표 마감, wait: 누를 수 없는 안내
  kind: 'vote' | 'close' | 'wait';
  label: string;
  disabled: boolean;
};

// 내가 투표한 후보의 id. 투표하지 않았으면 null이다.
export function myVoteOf(candidates: Votes, myId: string): string | null {
  return candidates.find((candidate) => candidate.voterIds.includes(myId))?.id ?? null;
}

// 멤버마다 어느 후보에든 투표했으면 checked. 멤버 영역의 얼굴 체크와 "N/M명 투표 완료"에 쓴다.
export function votedMembers<T extends Pick<PlanMember, 'id'>>(
  members: T[],
  candidates: Votes,
): (T & { checked: boolean })[] {
  const voterIds = new Set(candidates.flatMap((candidate) => candidate.voterIds));
  return members.map((member) => ({
    ...member,
    checked: voterIds.has(member.id),
  }));
}

// 맨 아래 버튼. 투표 전이면 "투표하기"(고른 후보가 있어야 누를 수 있다).
// 투표한 뒤에도 마감 전까지는 바꿀 수 있어(T13), 내가 투표한 것과 다른 후보를 고르면 "투표 바꾸기"다.
// 호스트는 이 자리가 "투표 마감하기"와 겹친다. 다른 후보를 고른 동안만 "투표 바꾸기"이고, 아니면 "투표 마감하기"다.
// 호스트는 자기 투표를 한 뒤에만 마감할 수 있다(docs/user-flow.md 1장 6). 다른 사람이 모두 투표했는지는 따지지 않는다.
export function voteActionOf({
  isHost,
  myVote,
  selectedId,
}: {
  isHost: boolean;
  myVote: string | null;
  selectedId: string | null;
}): VoteAction {
  if (myVote === null) return { kind: 'vote', label: '투표하기', disabled: selectedId === null };
  if (selectedId !== null && selectedId !== myVote) return { kind: 'vote', label: '투표 바꾸기', disabled: false };
  if (isHost) return { kind: 'close', label: '투표 마감하기', disabled: false };
  return { kind: 'wait', label: '호스트가 마감하면 확정돼요', disabled: true };
}
