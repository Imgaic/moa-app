// 백엔드가 나오기 전까지 쓰는 가짜 약속. src/api/plans.ts만 이 파일을 쓴다(화면은 직접 import하지 않는다).
// 날짜는 처음 부른 시각(now) 기준으로 한 번 계산해서, 앱을 켠 날 열면 "오늘의 약속"이 보인다.
// 약속 만들기, 마감처럼 바뀐 내용은 앱이 켜져 있는 동안만 남는다.
import type { Member, PlanDetail } from '@/api/plans';
import { toDateKey } from '@/lib/monthGrid';

import { seedMockAvailability } from './availability';
import { MOCK_ME } from './me';
import { MOCK_PLACES } from './places';

// 개발 중 빈 홈을 보려면 true로 바꾼다. 약속 목록이 빈 배열로 온다(새로 만든 약속은 보인다).
export const MOCK_EMPTY_PLANS = false;

// 가짜 초대 링크의 앞부분. 실제 형식은 미정이다(docs/open-questions.md).
// 경로(/join/<코드>)는 참여 화면 라우트 src/app/join/[code].tsx와 맞춘다. 가짜 코드는 약속 id 그대로다.
const MOCK_INVITE_BASE = 'https://example.com/join/';

const MEMBER_NAMES = [
  '김태혁',
  '성예희',
  '대동하',
  '김민수',
  '이서연',
  '박지훈',
  '정우성',
  '한소희',
  '오지은',
  '윤도현',
  '장하늘',
  '서지우',
  '임채원',
];

// m1은 나(MOCK_ME), m2부터 MEMBER_NAMES 순서
const PEOPLE = [MOCK_ME, ...MEMBER_NAMES.map((name, i) => ({ id: `m${i + 2}`, name, avatarUrl: null }))];
const ME = 0;
const TAEHYUK = 1;
const YEHEE = 2;
const DONGHA = 3;
const MINSU = 4;
const SEOYEON = 5;
const JIHOON = 6;
// 동아리 회식: 멤버 모달 안 스크롤을 보려고 모두 넣는다. 앞의 이만큼이 입력했다.
const CROWD_SUBMITTED = 6;

const person = (index: number, submitted: boolean): Member => ({ ...PEOPLE[index], submitted });

// now로부터 days일 뒤 hour:minute
function dayAt(now: Date, days: number, hour: number, minute: number): string {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + days, hour, minute).toISOString();
}

// now로부터 from일 뒤 ~ to일 뒤
function daysFrom(now: Date, from: number, to: number): PlanDetail['dateRange'] {
  const day = (days: number) => toDateKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() + days));
  return { start: day(from), end: day(to) };
}

// 오늘의 약속은 10분 뒤에 시작한다. 자정을 넘기면 오늘 23:59로 둔다.
function inTenMinutesToday(now: Date): string {
  const tenMinutesLater = new Date(now.getTime() + 10 * 60 * 1000);
  const lastMinuteToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59);
  return new Date(Math.min(tenMinutesLater.getTime(), lastMinuteToday.getTime())).toISOString();
}

const placeNamed = (id: string) => MOCK_PLACES.find((place) => place.id === id) ?? null;

let store: PlanDetail[] | null = null;

// 홈 목록. 처음 부를 때 한 번 만든다.
export function mockPlans(now: Date): PlanDetail[] {
  if (store === null) {
    store = MOCK_EMPTY_PLANS ? [] : createMockPlans(now);
    store.forEach((plan) => seedMockAvailability(plan.id, plan.dateRange.start));
  }
  return store;
}

export function findMockPlan(planId: string): PlanDetail | undefined {
  return mockPlans(new Date()).find((plan) => plan.id === planId);
}

// createPlan으로 만든 약속은 목록 맨 앞에 둔다.
export function addMockPlan(plan: PlanDetail) {
  mockPlans(new Date()).unshift(plan);
}

// 내 입력을 저장하거나 비웠을 때 멤버의 입력 여부를 바꾼다.
// 화면이 바뀐 것을 알도록(React Compiler는 같은 객체면 다시 그리지 않는다) 멤버 목록을 새로 만든다.
export function markMockSubmitted(planId: string, memberId: string, submitted: boolean) {
  const plan = findMockPlan(planId);
  if (!plan) return;
  plan.members = plan.members.map((member) => (member.id === memberId ? { ...member, submitted } : member));
}

export function mockInviteLink(planId: string): string {
  return `${MOCK_INVITE_BASE}${planId}`;
}

// 초대 링크의 코드로 약속을 찾는다. 가짜 코드는 약속 id와 같다.
export function findMockPlanByCode(code: string): PlanDetail | undefined {
  return findMockPlan(code);
}

// 참여한 사람을 멤버 맨 뒤에 더한다. 이미 멤버면 그대로 둔다.
// markMockSubmitted처럼 화면이 바뀐 것을 알도록 멤버 목록을 새로 만든다.
export function addMockMember(planId: string, member: Member) {
  const plan = findMockPlan(planId);
  if (!plan || plan.members.some((current) => current.id === member.id)) return;
  plan.members = [...plan.members, member];
}

function createMockPlans(now: Date): PlanDetail[] {
  const decided = { hostId: MOCK_ME.id, dateRange: daysFrom(now, 0, 14), durationMinutes: 120 };
  const recommendPlace = { placeMode: 'recommend', fixedPlace: null } as const;
  return [
    {
      ...decided,
      ...recommendPlace,
      id: 'plan-today',
      title: '캡스톤 회의',
      status: 'confirmed',
      confirmed: { startsAt: inTenMinutesToday(now), place: { name: '중앙대' } },
      members: PEOPLE.slice(0, 7).map((_, i) => person(i, true)),
    },
    {
      ...decided,
      ...recommendPlace,
      id: 'plan-tomorrow',
      title: '저녁 약속',
      status: 'confirmed',
      confirmed: { startsAt: dayAt(now, 1, 18, 0), place: { name: '사당역' } },
      members: [person(ME, true), person(MINSU, true)],
    },
    {
      // 내가 호스트인 모집 중 약속(피그마 05 Hub / Host - Collecting)
      ...recommendPlace,
      id: 'plan-collecting',
      title: '저녁 모임',
      status: 'collecting',
      confirmed: null,
      hostId: MOCK_ME.id,
      dateRange: daysFrom(now, 3, 30),
      durationMinutes: 120,
      members: [person(TAEHYUK, true), person(YEHEE, false), person(DONGHA, false), person(ME, false)],
    },
    {
      // 내가 참가자인 모집 중 약속(피그마 05 Hub / Guest - Collecting - Proposals)
      ...recommendPlace,
      id: 'plan-guest',
      title: '팀 스터디',
      status: 'collecting',
      confirmed: null,
      hostId: PEOPLE[MINSU].id,
      dateRange: daysFrom(now, 1, 10),
      durationMinutes: 90,
      members: [person(MINSU, true), person(ME, true), person(JIHOON, true), person(SEOYEON, false)],
    },
    {
      // 장소가 정해져 있고 멤버가 많은 모집 중 약속
      id: 'plan-crowd',
      title: '동아리 회식',
      status: 'collecting',
      confirmed: null,
      hostId: MOCK_ME.id,
      dateRange: daysFrom(now, 7, 7),
      durationMinutes: 180,
      placeMode: 'fixed',
      fixedPlace: placeNamed('place-6'),
      members: PEOPLE.map((_, i) => person(i, i < CROWD_SUBMITTED)),
    },
    {
      ...decided,
      ...recommendPlace,
      id: 'plan-recommended',
      title: '가족 모임',
      status: 'recommended',
      confirmed: null,
      members: [person(ME, true), person(PEOPLE.length - 1, true)],
    },
    {
      // 내가 아직 멤버가 아닌 모집 중 약속. 참여 화면을 열어 보는 용도다(/join/plan-invite).
      ...recommendPlace,
      id: 'plan-invite',
      title: '주말 등산',
      status: 'collecting',
      confirmed: null,
      hostId: PEOPLE[TAEHYUK].id,
      dateRange: daysFrom(now, 5, 20),
      durationMinutes: 240,
      members: [person(TAEHYUK, true), person(YEHEE, false), person(DONGHA, true)],
    },
    {
      ...decided,
      ...recommendPlace,
      id: 'plan-later',
      title: '친구 모임',
      status: 'confirmed',
      confirmed: { startsAt: dayAt(now, 13, 12, 30), place: { name: '강남역' } },
      hostId: PEOPLE[SEOYEON].id,
      members: [person(SEOYEON, true), person(JIHOON, true)],
    },
  ];
}
