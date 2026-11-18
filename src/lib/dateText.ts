// 카드에 보이는 날짜와 시각 글자. 기기 시간대 기준이다.
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
