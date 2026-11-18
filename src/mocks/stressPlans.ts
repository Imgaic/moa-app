// 배치가 깨지는지 보려고 넣은 "극단 값" 가짜 약속 셋(긴 약속 이름, 긴 장소 이름, 긴 사람 이름, 12명).
// 기존 가짜 약속은 그대로 두고 뒤에 더한다(docs/open-questions.md 2장, fix/layout-stress).
// 제안된 장소는 src/mocks/proposals.ts, 못 오는 사람 수는 src/mocks/candidates.ts, 내 입력 묶음은 src/mocks/availability.ts.
import type { Member, PlanDetail, PlanMember } from '@/api/plans';
import { toDateKey } from '@/lib/monthGrid';

import { MOCK_ME } from './me';

// true로 바꾸면 극단 값 약속이 5분 뒤에 시작해 홈의 "오늘의 약속" 자리를 차지한다(기존 캡스톤 회의는 다음 약속으로 내려간다).
// false면 오늘 23:59에 시작해 다음 약속 목록에 보인다. 바꾼 뒤에는 앱을 다시 켠다(웹은 새로 고침).
export const MOCK_STRESS_AS_TODAY = false;

export const STRESS_TODAY_ID = 'plan-stress-today';
export const STRESS_COLLECTING_ID = 'plan-stress-collecting';
export const STRESS_VOTE_ID = 'plan-stress-vote';

export const LONG_PLACE_NAME = '홍대입구역 2호선 9번 출구 앞';

const START_SOON_MINUTES = 5;
const SUBMITTED_COUNT = 7;

// 이름이 긴 사람 셋(영문 포함)과 보통 이름 여덟. 나까지 12명이다.
const LONG_NAMED: PlanMember[] = [
  { id: 's1', name: 'Alexander Christopher Kim', avatarUrl: null },
  { id: 's2', name: '남궁 막시밀리아노 서진', avatarUrl: null },
  { id: 's3', name: '선우예서린 Catherine', avatarUrl: null },
];

export function createStressPlans(now: Date, others: PlanMember[]): PlanDetail[] {
  const people = [MOCK_ME, ...LONG_NAMED, ...others.slice(0, 8)];
  const members = (submittedCount: number): Member[] =>
    people.map((person, index) => ({ ...person, submitted: index < submittedCount }));
  const day = (days: number) => toDateKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() + days));
  const base = { hostId: MOCK_ME.id, durationMinutes: 150, placeMode: 'recommend', fixedPlace: null } as const;

  return [
    {
      ...base,
      id: STRESS_TODAY_ID,
      title: '2026 캡스톤디자인 최종 발표 준비 회의 겸 뒤풀이',
      status: 'confirmed',
      confirmed: { startsAt: stressTodayStart(now), place: { name: LONG_PLACE_NAME } },
      dateRange: { start: day(0), end: day(14) },
      members: members(people.length),
    },
    {
      ...base,
      id: STRESS_COLLECTING_ID,
      title: '소프트웨어학부 21학번 동기 송년회 날짜 정하기',
      status: 'collecting',
      confirmed: null,
      dateRange: { start: day(2), end: day(40) },
      members: members(SUBMITTED_COUNT),
    },
    {
      ...base,
      id: STRESS_VOTE_ID,
      title: 'Graduation Trip 겨울 제주도 여행 계획 모임',
      status: 'recommended',
      confirmed: null,
      dateRange: { start: day(0), end: day(14) },
      members: members(people.length),
    },
  ];
}

function stressTodayStart(now: Date): string {
  const lastMinuteToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59);
  if (!MOCK_STRESS_AS_TODAY) return lastMinuteToday.toISOString();
  const soon = now.getTime() + START_SOON_MINUTES * 60 * 1000;
  return new Date(Math.min(soon, lastMinuteToday.getTime())).toISOString();
}
