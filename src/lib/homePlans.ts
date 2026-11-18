import type { Plan } from '@/api/plans';

import { calendarDaysBetween } from './calendarDays';

export type ConfirmedPlan = Plan & { confirmed: NonNullable<Plan['confirmed']> };

const isConfirmed = (plan: Plan): plan is ConfirmedPlan =>
  plan.status === 'confirmed' && plan.confirmed !== null;

const startsAt = (plan: ConfirmedPlan) => new Date(plan.confirmed.startsAt).getTime();

// 홈에 보일 약속을 "오늘의 약속" 하나와 "다음 약속" 목록으로 나눈다.
// - 오늘의 약속: 오늘 날짜에 확정된 약속 중 가장 이른 것
// - 다음 약속: 나머지 확정 약속을 시각 순으로, 그 뒤에 확정 전 약속을 받은 순서대로
// - 지난 약속은 뺀다
export function splitHomePlans(
  plans: Plan[],
  now: Date,
): { today: ConfirmedPlan | null; upcoming: Plan[] } {
  const confirmed = plans.filter(isConfirmed).sort((a, b) => startsAt(a) - startsAt(b));
  const pending = plans.filter((p) => p.status === 'collecting' || p.status === 'recommended');

  const today =
    confirmed.find((p) => calendarDaysBetween(now, new Date(p.confirmed.startsAt)) === 0) ?? null;
  const upcoming = [...confirmed.filter((p) => p !== today), ...pending];
  return { today, upcoming };
}
