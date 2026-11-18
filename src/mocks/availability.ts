// 백엔드가 나오기 전까지 쓰는 가짜 내 입력. src/api/availability.ts만 이 파일을 쓴다.
// 저장한 입력은 앱이 켜져 있는 동안만 남는다.
import type { AvailabilityGroup } from '@/api/availability';
import { addDays, type DateKey } from '@/lib/monthGrid';

import { MOCK_PLACES } from './places';
import { STRESS_COLLECTING_ID } from './stressPlans';

const keyOf = (planId: string, memberId: string) => `${planId}/${memberId}`;

// 이미 입력한 것으로 되어 있는 약속에 나의 묶음을 넣어 둔다. 날짜는 처음 부를 때 약속 범위의 첫날부터 센다.
// 팀 스터디는 묶음 하나, 배치 확인용 약속은 날짜가 여러 조각이고 출발지 이름이 긴 묶음 넷이다.
const SEEDED_MEMBER_ID = 'm1';
const SEEDED: Record<string, (firstDate: DateKey) => AvailabilityGroup[]> = {
  'plan-guest': (firstDate) => [
    { dates: [firstDate], startMinutes: 600, endMinutes: 960, origin: MOCK_PLACES[1], mode: 'transit' },
  ],
  [STRESS_COLLECTING_ID]: (firstDate) => {
    const days = (...offsets: number[]) => offsets.map((offset) => addDays(firstDate, offset));
    return [
      { dates: days(0, 2, 3, 4, 9, 11, 12), startMinutes: 600, endMinutes: 960, origin: MOCK_PLACES[8], mode: 'transit' },
      { dates: days(0, 6, 13, 20), startMinutes: 1110, endMinutes: 1385, origin: MOCK_PLACES[9], mode: 'car' },
      { dates: days(0, 15, 16), startMinutes: 540, endMinutes: 720, origin: MOCK_PLACES[1], mode: 'transit' },
      { dates: days(0, 27, 28, 29, 31, 33), startMinutes: 780, endMinutes: 1080, origin: MOCK_PLACES[8], mode: 'car' },
    ];
  },
};

const store = new Map<string, AvailabilityGroup[]>();

export function findMockAvailability(planId: string, memberId: string): AvailabilityGroup[] {
  return store.get(keyOf(planId, memberId)) ?? [];
}

export function saveMockAvailability(planId: string, memberId: string, groups: AvailabilityGroup[]) {
  store.set(keyOf(planId, memberId), groups);
}

// 가짜 약속의 날짜 범위를 알아야 해서 src/mocks/plans.ts가 약속을 만들 때 부른다.
export function seedMockAvailability(planId: string, firstDate: DateKey) {
  const groupsFrom = SEEDED[planId];
  if (!groupsFrom || store.has(keyOf(planId, SEEDED_MEMBER_ID))) return;
  store.set(keyOf(planId, SEEDED_MEMBER_ID), groupsFrom(firstDate));
}
