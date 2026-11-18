// 백엔드가 나오기 전까지 쓰는 가짜 추천 후보와 투표. src/api/만 이 파일을 쓴다.
// 후보를 고르는 실제 알고리즘과 이동시간 계산은 백엔드와 함께 설계할 부분이라(docs/user-flow.md Q3, Q4),
// 여기서는 날짜 범위 안의 그럴듯한 시각과 가짜 이동시간으로 후보를 만든다. 바뀐 내용은 앱이 켜져 있는 동안만 남는다.
import type { Candidate } from '@/api/candidates';
import type { PlanDetail } from '@/api/plans';
import { pickConfirmedCandidate } from '@/lib/voteResult';

import { MOCK_PLACES } from './places';
import { mockProposals } from './proposals';

// 추천 후보 세 개(docs/user-flow.md 6.5: 추천은 최대 3개). day는 날짜 범위 첫날부터 며칠 뒤인지,
// absent는 빠지는 사람 수(호스트가 아닌 사람을 뒤에서부터 뺀다).
const RECOMMENDED = [
  { day: 0, hour: 19, minute: 0, placeId: 'place-3', absent: 0, avgMinutes: 38, maxMinutes: 42 },
  { day: 1, hour: 14, minute: 0, placeId: 'place-5', absent: 0, avgMinutes: 48, maxMinutes: 50 },
  { day: 3, hour: 19, minute: 30, placeId: 'place-3', absent: 1, avgMinutes: 40, maxMinutes: 55 },
];
// 제안된 장소의 후보는 그 장소에 가장 좋은 시간 하나와 묶인다. 가짜는 날짜 범위 셋째 날 저녁으로 둔다.
const PROPOSED = { day: 2, hour: 18, minute: 0, avgMinutes: 45, maxMinutes: 58 };

// 다른 사람의 투표가 들어 있는 추천 나옴 약속(src/mocks/plans.ts). 멤버 id → 몇 번째 후보에 투표했는지.
const SEEDED_VOTES: Record<string, Record<string, number>> = {
  // 피그마 Host - Recommended - Voting: 두 사람이 투표했고 나(m1)는 아직
  'plan-recommended': { m2: 0, m3: 1 },
  // 피그마 Host - Recommended - Voted: 나를 포함해 모두 투표했다
  'plan-voted': { m1: 0, m2: 0, m3: 1, m4: 3 },
  // 내가 참가자인 약속: 호스트(m5)와 한 사람이 투표했고 나는 아직
  'plan-guest-vote': { m5: 1, m7: 0 },
};

const store = new Map<string, Candidate[]>();

export function mockCandidates(planId: string): Candidate[] {
  return store.get(planId) ?? [];
}

// 호스트가 마감하면 후보를 만든다. 추천 후보가 먼저, 그 뒤에 제안된 장소의 후보가 제안 순서대로 온다.
export function addMockCandidates(plan: PlanDetail) {
  const memberIds = plan.members.map((member) => member.id);
  const guests = memberIds.filter((id) => id !== plan.hostId);
  const startAt = (day: number, hour: number, minute: number) => {
    const [year, month, date] = plan.dateRange.start.split('-').map(Number);
    return new Date(year, month - 1, date + day, hour, minute).toISOString();
  };
  const recommended = RECOMMENDED.map((spec, index): Candidate => {
    const absentIds = spec.absent === 0 ? [] : guests.slice(-spec.absent);
    return {
      id: `${plan.id}-recommended-${index + 1}`,
      startsAt: startAt(spec.day, spec.hour, spec.minute),
      place: plan.fixedPlace ?? MOCK_PLACES.find((place) => place.id === spec.placeId)!,
      source: 'recommended',
      proposedBy: null,
      attendeeIds: memberIds.filter((id) => !absentIds.includes(id)),
      voterIds: [],
      avgMinutes: spec.avgMinutes,
      maxMinutes: spec.maxMinutes,
    };
  });
  const proposed = mockProposals(plan.id).map((proposal): Candidate => ({
    id: `${plan.id}-${proposal.id}`,
    startsAt: startAt(PROPOSED.day, PROPOSED.hour, PROPOSED.minute),
    place: proposal.place,
    source: 'proposed',
    proposedBy: proposal.memberId,
    attendeeIds: memberIds,
    voterIds: [],
    avgMinutes: PROPOSED.avgMinutes,
    maxMinutes: PROPOSED.maxMinutes,
  }));
  store.set(plan.id, [...recommended, ...proposed]);
}

// 가짜 약속을 처음 만들 때, 추천 나옴 상태인 약속에 후보와 미리 들어온 투표를 넣는다.
export function seedMockCandidates(plan: PlanDetail) {
  if (plan.status !== 'recommended') return;
  addMockCandidates(plan);
  Object.entries(SEEDED_VOTES[plan.id] ?? {}).forEach(([memberId, index]) => {
    const candidate = mockCandidates(plan.id)[index];
    if (candidate) voteMock(plan.id, candidate.id, memberId);
  });
}

// 한 사람은 한 후보에만 투표한다. 이미 투표했으면 이전 표를 빼고 옮긴다(T13). 화면이 바뀐 것을 알도록 후보 목록을 새로 만든다.
export function voteMock(planId: string, candidateId: string, memberId: string) {
  const updated = mockCandidates(planId).map((candidate) => {
    const others = candidate.voterIds.filter((id) => id !== memberId);
    return { ...candidate, voterIds: candidate.id === candidateId ? [...others, memberId] : others };
  });
  store.set(planId, updated);
}

// 투표 마감 때 확정할 후보. 실제 서버와 같은 규칙을 쓰도록 lib의 임시 규칙(T2) 함수를 그대로 부른다.
export function mockConfirmedCandidate(planId: string): Candidate | null {
  return pickConfirmedCandidate(mockCandidates(planId));
}
