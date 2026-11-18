import type { Plan } from '@/api/plans';

import { calendarDaysBetween } from './calendarDays';

// 홈 카드의 상태 라벨(docs/user-flow.md 3장의 표).
// 모집 중 → "일정 모으는 중", 추천 나옴 → "확정 대기", 확정 → 남은 시간("10분 후", "3시간 후", "내일", "3일 뒤").
// 표에 없는 경우는 docs/open-questions.md 2장에 적은 가정을 따른다: 오늘 1시간 이상 남으면 "N시간 후", 시작 시각이 지났으면 "지금".
const MINUTE_MS = 60 * 1000;

export function planLabel(plan: Pick<Plan, 'status' | 'confirmed'>, now: Date): string {
  if (plan.status === 'collecting') return '일정 모으는 중';
  if (plan.status === 'recommended') return '확정 대기';
  if (!plan.confirmed) return '';

  const startsAt = new Date(plan.confirmed.startsAt);
  const days = calendarDaysBetween(now, startsAt);
  if (days === 1) return '내일';
  if (days > 1) return `${days}일 뒤`;

  const minutes = Math.ceil((startsAt.getTime() - now.getTime()) / MINUTE_MS);
  if (minutes <= 0) return '지금';
  if (minutes < 60) return `${minutes}분 후`;
  return `${Math.floor(minutes / 60)}시간 후`;
}
