import { addMonths, isEarlierMonth, monthGrid, toDateKey, yearMonthOf } from './monthGrid';

describe('toDateKey', () => {
  it('기기 시간대의 날짜를 "YYYY-MM-DD"로', () => {
    expect(toDateKey(new Date(2026, 3, 1, 23, 59))).toBe('2026-04-01');
    expect(toDateKey(new Date(2026, 10, 18, 0, 0))).toBe('2026-11-18');
  });
});

describe('addMonths', () => {
  it('달을 넘기면 해가 바뀐다', () => {
    expect(addMonths({ year: 2026, month: 12 }, 1)).toEqual({ year: 2027, month: 1 });
    expect(addMonths({ year: 2026, month: 1 }, -1)).toEqual({ year: 2025, month: 12 });
    expect(addMonths({ year: 2026, month: 4 }, 0)).toEqual({ year: 2026, month: 4 });
  });
});

describe('yearMonthOf', () => {
  it('날짜 키가 속한 달', () => {
    expect(yearMonthOf('2026-04-30')).toEqual({ year: 2026, month: 4 });
  });
});

describe('isEarlierMonth', () => {
  it('앞의 달인지(같은 달은 아니다)', () => {
    expect(isEarlierMonth({ year: 2026, month: 3 }, { year: 2026, month: 4 })).toBe(true);
    expect(isEarlierMonth({ year: 2025, month: 12 }, { year: 2026, month: 1 })).toBe(true);
    expect(isEarlierMonth({ year: 2026, month: 4 }, { year: 2026, month: 4 })).toBe(false);
    expect(isEarlierMonth({ year: 2027, month: 1 }, { year: 2026, month: 12 })).toBe(false);
  });
});

describe('monthGrid', () => {
  // 2026년 4월: 1일이 수요일, 30일이 목요일 (피그마 Calendar/Range 예시)
  const april = monthGrid({ year: 2026, month: 4 });

  it('일요일부터 토요일까지 일곱 칸씩 주로 나눈다', () => {
    expect(april).toHaveLength(5);
    april.forEach((week) => expect(week).toHaveLength(7));
    expect(april[0].map((day) => day.weekday)).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  it('첫 주의 빈칸은 앞 달 날짜로 채운다', () => {
    expect(april[0].map((day) => day.day)).toEqual([29, 30, 31, 1, 2, 3, 4]);
    expect(april[0][0]).toEqual({ key: '2026-03-29', day: 29, weekday: 0, inMonth: false });
    expect(april[0][3]).toEqual({ key: '2026-04-01', day: 1, weekday: 3, inMonth: true });
  });

  it('마지막 주의 빈칸은 다음 달 날짜로 채운다', () => {
    expect(april[4].map((day) => day.day)).toEqual([26, 27, 28, 29, 30, 1, 2]);
    expect(april[4][6]).toEqual({ key: '2026-05-02', day: 2, weekday: 6, inMonth: false });
  });

  it('필요한 주만 만든다(4주에서 6주)', () => {
    // 2026년 2월: 1일이 일요일, 28일이 토요일 → 딱 4주
    expect(monthGrid({ year: 2026, month: 2 })).toHaveLength(4);
    // 2026년 8월: 1일이 토요일, 31일이 월요일 → 6주
    expect(monthGrid({ year: 2026, month: 8 })).toHaveLength(6);
  });

  it('해를 넘는 앞뒤 달도 날짜 키가 맞다', () => {
    const january = monthGrid({ year: 2027, month: 1 });
    expect(january[0][0].key).toBe('2026-12-27');
    const december = monthGrid({ year: 2026, month: 12 });
    expect(december.at(-1)?.at(-1)?.key).toBe('2027-01-02');
  });
});
