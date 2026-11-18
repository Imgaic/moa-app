// 약속 만들기의 요약 줄에 보이는 글자: 필요한 시간, 날짜 범위, 장소. 참여 화면의 초대 카드도 쓴다.
import type { PlanDetail } from '@/api/plans';

import type { DateKey } from './monthGrid';

const MINUTES_IN_HOUR = 60;
const RECOMMEND_PLACE_TEXT = '장소 추천';

// 90 → "1시간 30분", 120 → "2시간", 30 → "30분"
export function durationText(minutes: number): string {
  const hours = Math.floor(minutes / MINUTES_IN_HOUR);
  const rest = minutes % MINUTES_IN_HOUR;
  if (hours === 0) return `${rest}분`;
  if (rest === 0) return `${hours}시간`;
  return `${hours}시간 ${rest}분`;
}

// "2026-04-01" → "4월 1일"
export function monthDayText(key: DateKey): string {
  const [, month, day] = key.split('-').map(Number);
  return `${month}월 ${day}일`;
}

// "4월 1일 ~ 4월 30일". 하루짜리면 "4월 10일"
export function dateRangeText({ start, end }: { start: DateKey; end: DateKey }): string {
  if (start === end) return monthDayText(start);
  return `${monthDayText(start)} ~ ${monthDayText(end)}`;
}

// 정해진 장소면 장소 이름, 추천받기면 "장소 추천"
export function placeText(plan: Pick<PlanDetail, 'placeMode' | 'fixedPlace'>): string {
  return plan.placeMode === 'fixed' && plan.fixedPlace ? plan.fixedPlace.name : RECOMMEND_PLACE_TEXT;
}
