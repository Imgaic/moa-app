// 하루 안의 시각을 "자정부터 센 분"(0~1439)으로 다루고, 휠과 글자에 쓰는 오전·오후 12시간제로 바꾼다.
const MINUTES_IN_HOUR = 60;
const HOURS_IN_HALF_DAY = 12;
const MINUTES_IN_HALF_DAY = HOURS_IN_HALF_DAY * MINUTES_IN_HOUR;

export type Meridiem = '오전' | '오후';

// hour는 1~12. 자정은 오전 12시, 정오는 오후 12시다.
export type ClockParts = { meridiem: Meridiem; hour: number; minute: number };

export function toClockParts(minutes: number): ClockParts {
  const meridiem: Meridiem = minutes < MINUTES_IN_HALF_DAY ? '오전' : '오후';
  const hourOfHalfDay = Math.floor(minutes / MINUTES_IN_HOUR) % HOURS_IN_HALF_DAY;
  return { meridiem, hour: hourOfHalfDay === 0 ? HOURS_IN_HALF_DAY : hourOfHalfDay, minute: minutes % MINUTES_IN_HOUR };
}

export function fromClockParts({ meridiem, hour, minute }: ClockParts): number {
  const halfDayStart = meridiem === '오전' ? 0 : MINUTES_IN_HALF_DAY;
  return halfDayStart + (hour % HOURS_IN_HALF_DAY) * MINUTES_IN_HOUR + minute;
}

// 600 → "오전 10:00"
export function clockText(minutes: number): string {
  const { meridiem, hour, minute } = toClockParts(minutes);
  return `${meridiem} ${hour}:${String(minute).padStart(2, '0')}`;
}
