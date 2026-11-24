import { calendarDayLabel, longDateText, shortDateText, timeText } from './dateText';

// 2026-10-28은 수요일, 2026-10-25는 일요일
describe('dateText', () => {
  it('짧은 날짜는 "월.일 요일 한 글자"', () => {
    expect(shortDateText(new Date(2026, 9, 28, 18, 0))).toBe('10.28 수');
    expect(shortDateText(new Date(2026, 10, 2, 15, 0))).toBe('11.02 월');
  });

  it('긴 날짜는 "월.일 요일"', () => {
    expect(longDateText(new Date(2026, 9, 25, 14, 0))).toBe('10.25 일요일');
  });

  it('시각은 24시간제 "HH:MM"', () => {
    expect(timeText(new Date(2026, 9, 25, 14, 0))).toBe('14:00');
    expect(timeText(new Date(2026, 9, 25, 9, 5))).toBe('09:05');
  });

  // 2026-11-24는 화요일
  describe('달력 칸의 낭독기 이름', () => {
    it('월, 일, 요일을 읽는다', () => {
      expect(calendarDayLabel('2026-11-24', {})).toBe('11월 24일 화요일');
      expect(calendarDayLabel('2026-10-25', {})).toBe('10월 25일 일요일');
      expect(calendarDayLabel('2027-01-01', {})).toBe('1월 1일 금요일');
    });

    it('오늘이면 "오늘"을 붙인다', () => {
      expect(calendarDayLabel('2026-11-24', { today: true })).toBe('11월 24일 화요일, 오늘');
    });

    it('저장된 가능 시간이 있으면 개수를 붙인다', () => {
      expect(calendarDayLabel('2026-11-24', { savedCount: 2 })).toBe('11월 24일 화요일, 가능 시간 2개');
      expect(calendarDayLabel('2026-11-24', { savedCount: 0 })).toBe('11월 24일 화요일');
      expect(calendarDayLabel('2026-11-24', { today: true, savedCount: 1 })).toBe('11월 24일 화요일, 오늘, 가능 시간 1개');
    });
  });
});
