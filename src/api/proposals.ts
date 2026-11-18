// 약속에 제안된 장소. 화면은 이 파일의 함수만 부른다.
// 백엔드 API가 나오기 전까지는 src/mocks/proposals.ts의 가짜 데이터를 돌려준다.
import { addMockProposal, mockProposals } from '@/mocks/proposals';

import { getMe } from './me';
import type { Place } from './places';

// memberId: 제안한 사람. 한 사람이 여러 개 제안할 수 있다.
export type PlaceProposal = { id: string; memberId: string; place: Place };

const MOCK_DELAY_MS = 200;

const wait = () => new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

// 제안된 순서대로
export async function getProposals(planId: string): Promise<PlaceProposal[]> {
  await wait();
  return [...mockProposals(planId)];
}

// 내가 장소를 제안한다. 제안할 수 있는 상태(모집 중, 추천 나옴)인지는 서버가 확인한다. 가짜 구현은 확인하지 않는다.
export async function proposePlace(planId: string, place: Place): Promise<PlaceProposal> {
  const me = await getMe();
  await wait();
  const proposal: PlaceProposal = { id: `proposal-${Date.now()}`, memberId: me.id, place };
  addMockProposal(planId, proposal);
  return proposal;
}
