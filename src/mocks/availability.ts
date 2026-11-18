// 백엔드가 나오기 전까지 쓰는 가짜 내 입력. src/api/availability.ts만 이 파일을 쓴다.
// 저장한 입력은 앱이 켜져 있는 동안만 남는다.
import type { AvailabilityGroup } from '@/api/availability';

import { MOCK_PLACES } from './places';

const keyOf = (planId: string, memberId: string) => `${planId}/${memberId}`;

// 이미 입력한 것으로 되어 있는 약속(팀 스터디)에 나의 묶음 하나를 넣어 둔다. 날짜는 처음 부를 때 약속 범위의 첫날로 정한다.
const SEEDED_PLAN_ID = 'plan-guest';
const SEEDED_MEMBER_ID = 'm1';

const store = new Map<string, AvailabilityGroup[]>();

export function findMockAvailability(planId: string, memberId: string): AvailabilityGroup[] {
  return store.get(keyOf(planId, memberId)) ?? [];
}

export function saveMockAvailability(planId: string, memberId: string, groups: AvailabilityGroup[]) {
  store.set(keyOf(planId, memberId), groups);
}

// 가짜 약속의 날짜 범위를 알아야 해서 src/mocks/plans.ts가 약속을 만들 때 부른다.
export function seedMockAvailability(planId: string, firstDate: string) {
  if (planId !== SEEDED_PLAN_ID || store.has(keyOf(planId, SEEDED_MEMBER_ID))) return;
  store.set(keyOf(planId, SEEDED_MEMBER_ID), [
    { dates: [firstDate], startMinutes: 600, endMinutes: 960, origin: MOCK_PLACES[1], mode: 'transit' },
  ]);
}
