import { longDateText, shortDateText, timeText } from './dateText';

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
});
