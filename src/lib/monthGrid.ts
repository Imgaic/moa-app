// 달력 한 달의 날짜 칸 만들기. 범위 선택과 관계없이 어떤 달력이든 쓸 수 있다.
// 날짜는 기기 시간대의 "YYYY-MM-DD" 문자열(DateKey)로 다룬다. 같은 길이라 문자열 비교가 곧 날짜 비교다.
const DAYS_IN_WEEK = 7;

export type DateKey = string;

// month는 1~12
export type YearMonth = { year: number; month: number };

export type CalendarDay = {
  key: DateKey;
  day: number;
  // 0 = 일요일 ... 6 = 토요일
  weekday: number;
  // 보이는 달의 날짜인지(앞뒤 달로 채운 칸이면 false)
  inMonth: boolean;
};

const pad = (n: number) => String(n).padStart(2, '0');

export function toDateKey(date: Date): DateKey {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// "2026-04-30"에서 1일 뒤 → "2026-05-01"
export function addDays(key: DateKey, count: number): DateKey {
  const [year, month, day] = key.split('-').map(Number);
  return toDateKey(new Date(year, month - 1, day + count));
}

export function addMonths({ year, month }: YearMonth, count: number): YearMonth {
  const shifted = new Date(year, month - 1 + count, 1);
  return { year: shifted.getFullYear(), month: shifted.getMonth() + 1 };
}

// "2026-04-30" → 2026년 4월
export function yearMonthOf(key: DateKey): YearMonth {
  const [year, month] = key.split('-').map(Number);
  return { year, month };
}

// a가 b보다 앞의 달인지(같은 달이면 false)
export function isEarlierMonth(a: YearMonth, b: YearMonth): boolean {
  return a.year < b.year || (a.year === b.year && a.month < b.month);
}

// 일요일에서 시작하는 주 단위 칸. 첫 주와 마지막 주의 빈칸은 앞뒤 달 날짜로 채운다.
// 그 달에 필요한 만큼만 주를 만든다(4~6주).
export function monthGrid({ year, month }: YearMonth): CalendarDay[][] {
  const first = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const leading = first.getDay();
  const weekCount = Math.ceil((leading + daysInMonth) / DAYS_IN_WEEK);

  const weeks: CalendarDay[][] = [];
  for (let week = 0; week < weekCount; week++) {
    const days: CalendarDay[] = [];
    for (let weekday = 0; weekday < DAYS_IN_WEEK; weekday++) {
      // Date가 0일, 32일 같은 값을 앞뒤 달 날짜로 넘겨 준다.
      const date = new Date(year, month - 1, 1 - leading + week * DAYS_IN_WEEK + weekday);
      days.push({
        key: toDateKey(date),
        day: date.getDate(),
        weekday,
        inMonth: date.getMonth() === month - 1,
      });
    }
    weeks.push(days);
  }
  return weeks;
}
