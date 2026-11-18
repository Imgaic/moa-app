// 내 입력(가능한 일정, 출발지, 이동수단). 화면은 이 파일의 함수만 부른다.
// 백엔드 API가 나오기 전까지는 src/mocks/availability.ts의 가짜 저장소를 쓴다.
// 타입은 docs/user-flow.md 9장의 Submission 초안을 피그마에 맞춰 바꾼 것이다(차이는 docs/open-questions.md).
import type { DateKey } from '@/lib/monthGrid';
import { findMockAvailability, saveMockAvailability } from '@/mocks/availability';
import { markMockSubmitted } from '@/mocks/plans';

import { getMe } from './me';
import type { Place } from './places';

// transit: 대중교통, car: 자차
export type TravelMode = 'transit' | 'car';

// 묶음 하나: 날짜들, 그날들에 가능한 시간, 그때의 출발지와 이동수단.
// 시각은 자정부터 센 분이다(600 = 오전 10:00). 종료는 시작보다 늦다(자정을 넘지 않는다).
export type AvailabilityGroup = {
  dates: DateKey[];
  startMinutes: number;
  endMinutes: number;
  origin: Place;
  mode: TravelMode;
};

const MOCK_DELAY_MS = 300;

const wait = () => new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

// 내가 이 약속에 넣은 묶음들. 아직 넣지 않았으면 빈 목록이다.
export async function getMyAvailability(planId: string): Promise<AvailabilityGroup[]> {
  const me = await getMe();
  await wait();
  return findMockAvailability(planId, me.id);
}

// 내 입력 전체를 보낸다(앞의 것을 바꾼다). 묶음이 하나 이상이면 허브에서 "입력 완료"가 된다.
// 마감 전인지는 서버가 확인한다. 가짜 구현은 확인하지 않는다.
export async function submitMyAvailability(planId: string, groups: AvailabilityGroup[]): Promise<void> {
  const me = await getMe();
  await wait();
  saveMockAvailability(planId, me.id, groups);
  markMockSubmitted(planId, me.id, groups.length > 0);
}
