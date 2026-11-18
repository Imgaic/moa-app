import { planLabel } from './planLabel';

// 2026-11-18(수) 14:00, 기기 시간대 기준
const now = new Date(2026, 10, 18, 14, 0);
const at = (...args: [number, number, number, number, number]) =>
  ({ startsAt: new Date(...args).toISOString(), place: { name: '사당역' } });

describe('planLabel', () => {
  it('모집 중이면 "일정 모으는 중"', () => {
    expect(planLabel({ status: 'collecting', confirmed: null }, now)).toBe('일정 모으는 중');
  });

  it('추천이 나왔으면 "확정 대기"', () => {
    expect(planLabel({ status: 'recommended', confirmed: null }, now)).toBe('확정 대기');
  });

  it('오늘 1시간 안이면 "N분 후"', () => {
    expect(planLabel({ status: 'confirmed', confirmed: at(2026, 10, 18, 14, 10) }, now)).toBe('10분 후');
    expect(planLabel({ status: 'confirmed', confirmed: at(2026, 10, 18, 14, 59) }, now)).toBe('59분 후');
  });

  it('1분이 안 남았으면 올려서 "1분 후"', () => {
    const soon = { startsAt: new Date(now.getTime() + 20_000).toISOString(), place: { name: '' } };
    expect(planLabel({ status: 'confirmed', confirmed: soon }, now)).toBe('1분 후');
  });

  it('오늘 1시간 이상 남았으면 "N시간 후"(내림)', () => {
    expect(planLabel({ status: 'confirmed', confirmed: at(2026, 10, 18, 15, 0) }, now)).toBe('1시간 후');
    expect(planLabel({ status: 'confirmed', confirmed: at(2026, 10, 18, 23, 59) }, now)).toBe('9시간 후');
  });

  it('시작 시각이 지났지만 오늘이면 "지금"', () => {
    expect(planLabel({ status: 'confirmed', confirmed: at(2026, 10, 18, 14, 0) }, now)).toBe('지금');
    expect(planLabel({ status: 'confirmed', confirmed: at(2026, 10, 18, 9, 0) }, now)).toBe('지금');
  });

  it('달력으로 다음 날이면 시간 차이와 관계없이 "내일"', () => {
    expect(planLabel({ status: 'confirmed', confirmed: at(2026, 10, 19, 0, 5) }, now)).toBe('내일');
    expect(planLabel({ status: 'confirmed', confirmed: at(2026, 10, 19, 23, 0) }, now)).toBe('내일');
  });

  it('이틀 이상 뒤면 "N일 뒤"', () => {
    expect(planLabel({ status: 'confirmed', confirmed: at(2026, 10, 21, 18, 0) }, now)).toBe('3일 뒤');
    expect(planLabel({ status: 'confirmed', confirmed: at(2026, 11, 1, 12, 0) }, now)).toBe('13일 뒤');
  });

  it('달이 바뀌어도 날짜 차이로 센다', () => {
    const lateNight = new Date(2026, 10, 30, 23, 0);
    expect(planLabel({ status: 'confirmed', confirmed: at(2026, 11, 1, 9, 0) }, lateNight)).toBe('내일');
  });
});
