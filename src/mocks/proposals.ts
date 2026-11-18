// 백엔드가 나오기 전까지 쓰는 가짜 장소 제안. src/api/proposals.ts만 이 파일을 쓴다.
// 새로 제안한 것은 앱이 켜져 있는 동안만 남는다.
import type { PlaceProposal } from '@/api/proposals';

import { MOCK_PLACES } from './places';

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
]);

export function mockProposals(planId: string): PlaceProposal[] {
  return proposalsByPlan.get(planId) ?? [];
}

export function addMockProposal(planId: string, proposal: PlaceProposal) {
  proposalsByPlan.set(planId, [...mockProposals(planId), proposal]);
}
