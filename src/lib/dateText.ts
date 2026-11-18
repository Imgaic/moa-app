// 카드에 보이는 날짜와 시각 글자, 달력 칸을 화면 낭독기가 읽는 이름. 기기 시간대 기준이다.
import type { DateKey } from './monthGrid';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const pad = (n: number) => String(n).padStart(2, '0');

const monthDay = (d: Date) => `${d.getMonth() + 1}.${pad(d.getDate())}`;

// "10.28 수" (피그마 Card/Plan)
export function shortDateText(d: Date): string {
  return `${monthDay(d)} ${WEEKDAYS[d.getDay()]}`;
}

// "10.25 일요일" (피그마 Card/Today)
export function longDateText(d: Date): string {
  return `${monthDay(d)} ${WEEKDAYS[d.getDay()]}요일`;
}

// "14:00"
export function timeText(d: Date): string {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// 달력 칸을 화면 낭독기가 읽는 이름. 눈에는 날짜 숫자만 보여 달, 요일, 오늘 표시, 막대를 글자로 알려 준다.
// "11월 24일 화요일, 오늘, 가능 시간 2개". savedCount는 그 날에 저장된 가능 시간(막대)의 수다.
export function calendarDayLabel(key: DateKey, marks: { today?: boolean; savedCount?: number }): string {
  const [year, month, day] = key.split('-').map(Number);
  const weekday = WEEKDAYS[new Date(year, month - 1, day).getDay()];
  const parts = [`${month}월 ${day}일 ${weekday}요일`];
  if (marks.today) parts.push('오늘');
  if (marks.savedCount) parts.push(`가능 시간 ${marks.savedCount}개`);
  return parts.join(', ');
}
