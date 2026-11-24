import { dateRangeText, durationText, placeText } from './planCreateText';

describe('durationText', () => {
  it('시간과 분을 함께', () => {
    expect(durationText(90)).toBe('1시간 30분');
    expect(durationText(150)).toBe('2시간 30분');
  });

  it('딱 떨어지면 시간만, 1시간이 안 되면 분만', () => {
    expect(durationText(120)).toBe('2시간');
    expect(durationText(30)).toBe('30분');
  });
});

describe('dateRangeText', () => {
  it('"M월 D일 ~ M월 D일"', () => {
    expect(dateRangeText({ start: '2026-04-01', end: '2026-04-30' })).toBe('4월 1일 ~ 4월 30일');
    expect(dateRangeText({ start: '2026-12-28', end: '2027-01-03' })).toBe('12월 28일 ~ 1월 3일');
  });

  it('하루짜리 범위는 날짜 하나', () => {
    expect(dateRangeText({ start: '2026-04-10', end: '2026-04-10' })).toBe('4월 10일');
  });
});

describe('placeText', () => {
  const place = { id: 'place-1', name: '마찌마찌중앙대점', address: '경기 안성시' };

  it('정해진 장소면 장소 이름', () => {
    expect(placeText({ placeMode: 'fixed', fixedPlace: place })).toBe('마찌마찌중앙대점');
  });

  it('추천받기면 "장소 추천"', () => {
    expect(placeText({ placeMode: 'recommend', fixedPlace: null })).toBe('장소 추천');
    expect(placeText({ placeMode: 'recommend', fixedPlace: place })).toBe('장소 추천');
  });
});
