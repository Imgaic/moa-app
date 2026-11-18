// 백엔드가 나오기 전까지 쓰는 가짜 약속. src/api/plans.ts만 이 파일을 쓴다(화면은 직접 import하지 않는다).
// 날짜는 부르는 시각(now) 기준으로 계산해서, 언제 열어도 "오늘의 약속"이 보인다.
import type { Plan, PlanMember } from '@/api/plans';

import { MOCK_ME } from './me';

// 개발 중 빈 홈을 보려면 true로 바꾼다. 약속 목록이 빈 배열로 온다.
export const MOCK_EMPTY_PLANS = false;

const member = (id: string, name: string): PlanMember => ({ id, name, avatarUrl: null });

// 가짜 초대 링크의 앞부분. 실제 형식은 미정이다(docs/open-questions.md).
const MOCK_INVITE_BASE = 'https://example.com/moa/join/';

const MEMBERS = [
  MOCK_ME,
  member('m2', '김민수'),
  member('m3', '이서연'),
  member('m4', '박지훈'),
  member('m5', '최예희'),
  member('m6', '정우성'),
  member('m7', '한소희'),
];

// now로부터 days일 뒤 hour:minute
function dayAt(now: Date, days: number, hour: number, minute: number): string {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + days, hour, minute).toISOString();
}

// 오늘의 약속은 10분 뒤에 시작한다. 자정을 넘기면 오늘 23:59로 둔다.
function inTenMinutesToday(now: Date): string {
  const tenMinutesLater = new Date(now.getTime() + 10 * 60 * 1000);
  const lastMinuteToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59);
  return new Date(Math.min(tenMinutesLater.getTime(), lastMinuteToday.getTime())).toISOString();
}

// createPlan으로 만든 약속. 앱을 다시 켜면 사라진다.
const createdPlans: Plan[] = [];

export function addMockPlan(plan: Plan) {
  createdPlans.unshift(plan);
}

export function mockInviteLink(planId: string): string {
  return `${MOCK_INVITE_BASE}${planId}`;
}

export function createMockPlans(now: Date): Plan[] {
  if (MOCK_EMPTY_PLANS) return [...createdPlans];
  return [
    ...createdPlans,
    {
      id: 'plan-today',
      title: '캡스톤 회의',
      status: 'confirmed',
      confirmed: { startsAt: inTenMinutesToday(now), place: { name: '중앙대' } },
      members: MEMBERS,
    },
    {
      id: 'plan-tomorrow',
      title: '저녁 약속',
      status: 'confirmed',
      confirmed: { startsAt: dayAt(now, 1, 18, 0), place: { name: '사당역' } },
      members: [MEMBERS[0], MEMBERS[4]],
    },
    {
      id: 'plan-collecting',
      title: '팀 스터디',
      status: 'collecting',
      confirmed: null,
      members: [MEMBERS[0], MEMBERS[1], MEMBERS[3]],
    },
    {
      id: 'plan-recommended',
      title: '가족 모임',
      status: 'recommended',
      confirmed: null,
      members: [MEMBERS[0], MEMBERS[6]],
    },
    {
      id: 'plan-later',
      title: '친구 모임',
      status: 'confirmed',
      confirmed: { startsAt: dayAt(now, 13, 12, 30), place: { name: '강남역' } },
      members: [MEMBERS[2], MEMBERS[5]],
    },
  ];
}
