// 약속 허브에 보이는 글자: 조건 한 줄, 입력·투표 현황("3/4명"), 제안한 사람("태혁 제안").
import type { Member, PlanDetail } from '@/api/plans';

import { avatarText } from './avatarText';
import { durationText, monthDayText } from './planCreateText';

const SEPARATOR = ' · ';
const RECOMMEND_PLACE_TEXT = '장소 추천받기';

// "4월 1일 ~ 30일 · 2시간 · 장소 추천받기". 장소가 정해져 있으면 마지막이 장소 이름이다.
export function conditionText(
  plan: Pick<PlanDetail, 'dateRange' | 'durationMinutes' | 'placeMode' | 'fixedPlace'>,
): string {
  const placeText = plan.placeMode === 'fixed' && plan.fixedPlace ? plan.fixedPlace.name : RECOMMEND_PLACE_TEXT;
  return [rangeText(plan.dateRange), durationText(plan.durationMinutes), placeText].join(SEPARATOR);
}

// 피그마 허브는 같은 달이면 끝 날짜의 달을 뺀다("4월 1일 ~ 30일"). 약속 만들기의 dateRangeText와 다르다.
function rangeText({ start, end }: PlanDetail['dateRange']): string {
  if (start === end) return monthDayText(start);
  const sameMonth = start.slice(0, 7) === end.slice(0, 7);
  const endText = sameMonth ? `${Number(end.slice(8))}일` : monthDayText(end);
  return `${monthDayText(start)} ~ ${endText}`;
}

// "체크된 사람 / 전체 인원". 모집 중에는 입력한 사람, 추천 나옴에는 투표한 사람이 체크된다.
export function progressText(members: { checked: boolean }[]): string {
  const checked = members.filter((member) => member.checked).length;
  return `${checked}/${members.length}명`;
}

// 피그마 예시(김태혁 → "태혁 제안")가 아바타 글자와 같은 규칙(이름 뒤 두 글자)이라 avatarText를 다시 쓴다.
// 제안한 사람이 멤버 목록에 없으면 빈 글자다.
export function proposedByText(memberId: string, members: Pick<Member, 'id' | 'name'>[]): string {
  const proposer = members.find((member) => member.id === memberId);
  return proposer ? `${avatarText(proposer.name)} 제안` : '';
}
