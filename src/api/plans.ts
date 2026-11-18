// 약속 데이터를 가져오는 곳. 화면은 이 파일의 함수만 부른다.
// 백엔드 API가 나오기 전까지는 src/mocks/의 가짜 데이터를 돌려준다. 백엔드가 오면 함수 안만 바꾼다.
// 타입은 홈 카드가 실제로 쓰는 필드만 담은 초안이다(전체 초안은 docs/user-flow.md 9장). 필드 이름은 백엔드와 맞춰야 한다.
import type { DateKey } from '@/lib/monthGrid';
import { addMockPlan, createMockPlans, mockInviteLink } from '@/mocks/plans';

import { getMe } from './me';
import type { Place } from './places';

export type PlanStatus = 'collecting' | 'recommended' | 'confirmed' | 'past';

export type PlanMember = {
  id: string;
  name: string;
  avatarUrl: string | null;
};

export type Plan = {
  id: string;
  title: string;
  status: PlanStatus;
  // 확정된 약속의 시작 시각과 장소. 확정 전에는 null이다.
  confirmed: { startsAt: string; place: { name: string } } | null;
  members: PlanMember[];
};

// 가짜 데이터에서도 불러오는 중 상태가 잠깐 보이게 늦춘다.
const MOCK_DELAY_MS = 300;

// 장소 방식: 추천받기 / 정해져 있음
export type PlaceMode = 'recommend' | 'fixed';

// 호스트가 약속을 만들 때 보내는 값
export type NewPlan = {
  title: string;
  durationMinutes: number;
  dateRange: { start: DateKey; end: DateKey };
  placeMode: PlaceMode;
  // placeMode가 'fixed'일 때만 있다.
  fixedPlace: Place | null;
};

// 링크 형식은 게스트 인증과 함께 미정이다(docs/open-questions.md). 화면은 받은 문자열을 그대로 공유한다.
export type CreatedPlan = { plan: Plan; inviteLink: string };

const wait = () => new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

// 내가 참여한 약속 목록
export async function getPlans(): Promise<Plan[]> {
  await wait();
  return createMockPlans(new Date());
}

// 약속 만들기. 가짜 구현은 앱이 켜져 있는 동안만 getPlans 목록에 새 약속을 더한다.
export async function createPlan(newPlan: NewPlan): Promise<CreatedPlan> {
  const host = await getMe();
  await wait();
  const plan: Plan = {
    id: `plan-${Date.now()}`,
    title: newPlan.title,
    status: 'collecting',
    confirmed: null,
    members: [host],
  };
  addMockPlan(plan);
  return { plan, inviteLink: mockInviteLink(plan.id) };
}
