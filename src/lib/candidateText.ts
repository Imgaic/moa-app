// 후보 카드(피그마 Card/Candidate)에 보이는 글자: 배지, 날짜·시각·장소, 참석 인원, 이동시간.
// 날짜·시각 글자(dateTimeText)는 확정 허브도 쓴다.
import type { Candidate } from '@/api/candidates';
import type { PlanMember } from '@/api/plans';

import { avatarText } from './avatarText';
import { clockText } from './clockTime';
import { proposedByText } from './hubText';
import { toDateKey } from './monthGrid';
import { durationText, monthDayText } from './planCreateText';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const MINUTES_IN_HOUR = 60;
const NAME_SEPARATOR = ', ';

type Member = Pick<PlanMember, 'id' | 'name'>;

export type CandidateCardText = {
  // "추천 1" 또는 "태혁 제안"
  badge: string;
  // 첫 번째 추천 후보. 배지가 검은색이다(피그마 Type=Best).
  best: boolean;
  // "4월 1일 (수) 오후 7:00 사당역"
  title: string;
  // "4명 모두" 또는 "3명 가능 · 동하 제외"
  attendance: string;
  // 모두 올 수 있으면 참석 글자가 파란색이다(피그마 Attendance=All).
  everyone: boolean;
  // "· 평균 38분 · 최대 42분"
  detail: string;
};

export function candidateCardText(
  candidate: Candidate,
  candidates: Pick<Candidate, 'id' | 'source'>[],
  members: Member[],
): CandidateCardText {
  const rank =
    candidates.filter((other) => other.source === 'recommended').findIndex((other) => other.id === candidate.id) + 1;
  const absent = members.filter((member) => !candidate.attendeeIds.includes(member.id));
  return {
    badge: candidate.source === 'recommended' ? `추천 ${rank}` : proposedByText(candidate.proposedBy ?? '', members),
    best: candidate.source === 'recommended' && rank === 1,
    title: `${dateTimeText(new Date(candidate.startsAt))} ${candidate.place.name}`,
    attendance: attendanceText(candidate.attendeeIds.length, absent),
    everyone: absent.length === 0,
    detail: `· 평균 ${durationText(candidate.avgMinutes)} · 최대 ${durationText(candidate.maxMinutes)}`,
  };
}

// "4월 1일 (수) 오후 7:00". 기기 시간대 기준이다. 확정 허브의 일시에도 쓴다.
export function dateTimeText(startsAt: Date): string {
  const minutes = startsAt.getHours() * MINUTES_IN_HOUR + startsAt.getMinutes();
  return `${monthDayText(toDateKey(startsAt))} (${WEEKDAYS[startsAt.getDay()]}) ${clockText(minutes)}`;
}

function attendanceText(count: number, absent: Member[]): string {
  if (absent.length === 0) return `${count}명 모두`;
  return `${count}명 가능 · ${absent.map((member) => avatarText(member.name)).join(NAME_SEPARATOR)} 제외`;
}
