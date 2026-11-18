// 백엔드가 나오기 전까지 쓰는 가짜 장소 제안. src/api/proposals.ts만 이 파일을 쓴다.
// 새로 제안한 것은 앱이 켜져 있는 동안만 남는다.
import type { PlaceProposal } from '@/api/proposals';

import { MOCK_PLACES } from './places';
import { STRESS_COLLECTING_ID, STRESS_VOTE_ID } from './stressPlans';

const place = (id: string) => MOCK_PLACES.find((candidate) => candidate.id === id)!;

// 약속 id → 제안 목록(제안한 순서). 멤버 id는 src/mocks/plans.ts의 사람 순서를 따른다.
const proposalsByPlan = new Map<string, PlaceProposal[]>([
  [
    'plan-collecting',
    [
      { id: 'proposal-1', memberId: 'm2', place: place('place-7') },
      { id: 'proposal-2', memberId: 'm3', place: place('place-3') },
    ],
  ],
  [
    'plan-guest',
    [
      { id: 'proposal-3', memberId: 'm5', place: place('place-7') },
      { id: 'proposal-4', memberId: 'm7', place: place('place-3') },
      { id: 'proposal-5', memberId: 'm6', place: place('place-5') },
    ],
  ],
  // 추천 나옴 약속에 제안된 장소의 후보가 같이 보이게 한다.
  ['plan-voted', [{ id: 'proposal-6', memberId: 'm3', place: place('place-7') }]],
  ['plan-guest-vote', [{ id: 'proposal-7', memberId: 'm7', place: place('place-8') }]],
  // 배치 확인용: 제안이 많고, 장소 이름과 제안한 사람 이름이 길다.
  [
    STRESS_COLLECTING_ID,
    [
      { id: 'proposal-s1', memberId: 's1', place: place('place-9') },
      { id: 'proposal-s2', memberId: 's2', place: place('place-10') },
      { id: 'proposal-s3', memberId: 's3', place: place('place-2') },
      { id: 'proposal-s4', memberId: 'm2', place: place('place-7') },
      { id: 'proposal-s5', memberId: 'm3', place: place('place-3') },
      { id: 'proposal-s6', memberId: 'm4', place: place('place-5') },
      { id: 'proposal-s7', memberId: 'm5', place: place('place-8') },
    ],
  ],
  [
    STRESS_VOTE_ID,
    [
      { id: 'proposal-s8', memberId: 's1', place: place('place-9') },
      { id: 'proposal-s9', memberId: 's2', place: place('place-10') },
    ],
  ],
]);

export function mockProposals(planId: string): PlaceProposal[] {
  return proposalsByPlan.get(planId) ?? [];
}

export function addMockProposal(planId: string, proposal: PlaceProposal) {
  proposalsByPlan.set(planId, [...mockProposals(planId), proposal]);
}
