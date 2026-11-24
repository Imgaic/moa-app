// 초대 링크로 온 사람이 약속을 보고 참여하는 곳. 참여 화면은 이 파일과 me.ts의 함수만 부른다.
// 링크의 코드 형식과 만료, 게스트 인증 방식이 미정이라(docs/open-questions.md) 지금은 가짜 저장소를 쓴다.
import { addMockMember, findMockPlanByCode } from '@/mocks/plans';

import { getSignedInMe, signInAsGuest, type GuestProfile } from './me';
import type { PlanDetail, PlanMember } from './plans';

// 참여하기 전에 보는 약속 요약. 멤버는 얼굴과 "이미 참여했는지"에만 쓴다.
export type Invitation = Pick<
  PlanDetail,
  'id' | 'title' | 'hostId' | 'dateRange' | 'durationMinutes' | 'placeMode' | 'fixedPlace'
> & { members: PlanMember[] };

const MOCK_DELAY_MS = 300;

const wait = () => new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

// 링크의 코드로 찾은 약속. 없는 코드면 null이다.
export async function getInvitation(code: string): Promise<Invitation | null> {
  await wait();
  const plan = findMockPlanByCode(code);
  if (!plan) return null;
  const { id, title, hostId, dateRange, durationMinutes, placeMode, fixedPlace, members } = plan;
  return {
    id,
    title,
    hostId,
    dateRange,
    durationMinutes,
    placeMode,
    fixedPlace,
    members: members.map(({ id: memberId, name, avatarUrl }) => ({ id: memberId, name, avatarUrl })),
  };
}

// 약속에 참여한다. 로그인돼 있지 않으면 guest 프로필로 익명 게스트가 된 뒤 참여한다.
// 앞에서 익명으로 들어온 뒤 참여만 실패했다면, 다시 부를 때 게스트를 또 만들지 않는다.
export async function joinPlan(planId: string, guest?: GuestProfile): Promise<void> {
  let me = await getSignedInMe();
  if (!me) {
    if (!guest) throw new Error('로그인하지 않았고 게스트 프로필도 없다');
    me = await signInAsGuest(guest);
  }
  await wait();
  addMockMember(planId, { ...me, submitted: false });
}
