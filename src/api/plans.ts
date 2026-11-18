// 약속 데이터를 가져오는 곳. 화면은 이 파일의 함수만 부른다.
// 백엔드 API가 나오기 전까지는 src/mocks/의 가짜 데이터를 돌려준다. 백엔드가 오면 함수 안만 바꾼다.
// 타입은 홈 카드가 실제로 쓰는 필드만 담은 초안이다(전체 초안은 docs/user-flow.md 9장). 필드 이름은 백엔드와 맞춰야 한다.
import { createMockPlans } from '@/mocks/plans';

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

// 내가 참여한 약속 목록
export async function getPlans(): Promise<Plan[]> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
  return createMockPlans(new Date());
}
