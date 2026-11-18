// 약속 데이터를 가져오는 곳. 화면은 이 파일의 함수만 부른다.
// 백엔드 API가 나오기 전까지는 src/mocks/의 가짜 데이터를 돌려준다. 백엔드가 오면 함수 안만 바꾼다.
// 타입은 화면이 실제로 쓰는 필드만 담은 초안이다(전체 초안은 docs/user-flow.md 9장). 필드 이름은 백엔드와 맞춰야 한다.
import type { DateKey } from '@/lib/monthGrid';
import { addMockPlan, findMockPlan, mockInviteLink, mockPlans } from '@/mocks/plans';

import { getMe } from './me';
import type { Place } from './places';

export type PlanStatus = 'collecting' | 'recommended' | 'confirmed' | 'past';

export type PlanMember = {
  id: string;
  name: string;
  avatarUrl: string | null;
};

// 홈 카드가 쓰는 약속
export type Plan = {
  id: string;
  title: string;
  status: PlanStatus;
  // 확정된 약속의 시작 시각과 장소. 확정 전에는 null이다.
  confirmed: { startsAt: string; place: { name: string } } | null;
  members: PlanMember[];
};

// 약속에 들어온 사람과 가능한 일정 입력 여부
export type Member = PlanMember & { submitted: boolean };

// 장소 방식: 추천받기 / 정해져 있음
export type PlaceMode = 'recommend' | 'fixed';

// 약속 허브가 쓰는 약속
export type PlanDetail = Omit<Plan, 'members'> & {
  hostId: string;
  dateRange: { start: DateKey; end: DateKey };
  durationMinutes: number;
  placeMode: PlaceMode;
  // placeMode가 'fixed'일 때만 있다.
  fixedPlace: Place | null;
  members: Member[];
};

// 가짜 데이터에서도 불러오는 중 상태가 잠깐 보이게 늦춘다.
const MOCK_DELAY_MS = 300;

// 호스트가 약속을 만들 때 보내는 값
export type NewPlan = Pick<PlanDetail, 'title' | 'durationMinutes' | 'dateRange' | 'placeMode' | 'fixedPlace'>;

// 링크 형식은 게스트 인증과 함께 미정이다(docs/open-questions.md). 화면은 받은 문자열을 그대로 공유한다.
export type CreatedPlan = { plan: PlanDetail; inviteLink: string };

const wait = () => new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

// 내가 참여한 약속 목록
export async function getPlans(): Promise<Plan[]> {
  await wait();
  return mockPlans(new Date());
}

// 약속 하나. 없는 약속이면 null이다.
export async function getPlan(planId: string): Promise<PlanDetail | null> {
  await wait();
  const plan = findMockPlan(planId);
  // 가짜 저장소의 객체를 그대로 주면 바뀌어도 같은 객체라 화면이 다시 그리지 않는다. 서버 응답처럼 새 객체로 준다.
  return plan ? { ...plan } : null;
}

// 약속에 초대하는 링크. 참가자 누구나 공유할 수 있다.
export async function getInviteLink(planId: string): Promise<string> {
  return mockInviteLink(planId);
}

// 약속 만들기. 만든 사람이 호스트이고 첫 멤버다. 가짜 구현은 앱이 켜져 있는 동안만 남는다.
export async function createPlan(newPlan: NewPlan): Promise<CreatedPlan> {
  const host = await getMe();
  await wait();
  const plan: PlanDetail = {
    ...newPlan,
    id: `plan-${Date.now()}`,
    status: 'collecting',
    confirmed: null,
    hostId: host.id,
    members: [{ ...host, submitted: false }],
  };
  addMockPlan(plan);
  return { plan, inviteLink: mockInviteLink(plan.id) };
}

// 호스트가 입력을 마감하고 추천을 받는다. 약속이 추천 나옴 상태가 된다.
// 호스트인지 확인하는 일은 서버가 한다(게스트 인증과 함께 미정). 가짜 구현은 확인하지 않는다.
export async function closeAndRecommend(planId: string): Promise<void> {
  await wait();
  const plan = findMockPlan(planId);
  if (!plan) throw new Error(`없는 약속: ${planId}`);
  plan.status = 'recommended';
}
