// 추천 후보와 투표. 화면은 이 파일의 함수만 부른다.
// 백엔드 API가 나오기 전까지는 src/mocks/candidates.ts의 가짜 데이터를 돌려준다. 백엔드가 오면 함수 안만 바꾼다.
// 타입은 화면이 실제로 쓰는 필드만 담은 초안이다(전체 초안은 docs/user-flow.md 9장의 Candidate).
import { mockCandidates, mockConfirmedCandidate, voteMock } from '@/mocks/candidates';
import { confirmMockPlan, findMockPlan } from '@/mocks/plans';

import { getMe } from './me';
import type { Place } from './places';

// 후보 하나는 시간 + 장소 묶음이다. 추천 후보, 또는 참가자가 제안한 장소로 만든 후보.
export type Candidate = {
  id: string;
  startsAt: string;
  place: Place;
  source: 'recommended' | 'proposed';
  // 제안한 사람의 멤버 id. 추천 후보면 null이다.
  proposedBy: string | null;
  // 이 시간에 올 수 있는 사람
  attendeeIds: string[];
  // 이 후보에 투표한 사람
  voterIds: string[];
  // 이동시간(분). 길찾기 API가 미정이라 가짜 값이다.
  avgMinutes: number;
  maxMinutes: number;
};

const MOCK_DELAY_MS = 200;

const wait = () => new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

// 서버가 정한 순서(추천 후보가 순위대로, 그 뒤에 제안된 장소의 후보). 추천이 나오기 전이면 빈 목록이다.
export async function getCandidates(planId: string): Promise<Candidate[]> {
  await wait();
  // 가짜 후보는 가짜 약속을 처음 만들 때 함께 넣는다. 허브가 약속보다 후보를 먼저 받아도(웹에서 바로 연 경우) 비지 않게,
  // 없는 약속이면 빈 목록을 준다.
  if (!findMockPlan(planId)) return [];
  // 가짜 저장소의 객체를 그대로 주면 바뀌어도 같은 객체라 화면이 다시 그리지 않는다. 서버 응답처럼 새 객체로 준다.
  return mockCandidates(planId).map((candidate) => ({ ...candidate }));
}

// 내가 후보 하나에 투표한다. 한 사람은 한 후보에만 투표하고, 마감 전에 다시 부르면 표가 그 후보로 옮겨 간다(T13).
export async function vote(planId: string, candidateId: string): Promise<void> {
  const me = await getMe();
  await wait();
  voteMock(planId, candidateId, me.id);
}

// 호스트가 투표를 마감한다. 가장 많은 표를 받은 후보로 약속이 확정된다(임시 규칙 T2).
// 호스트인지, 호스트가 투표했는지 확인하는 일은 서버가 한다. 가짜 구현은 확인하지 않는다.
export async function closeVote(planId: string): Promise<void> {
  await wait();
  const picked = mockConfirmedCandidate(planId);
  if (!picked) throw new Error(`후보가 없는 약속: ${planId}`);
  confirmMockPlan(planId, { startsAt: picked.startsAt, place: { name: picked.place.name } });
}
