import { fittingCount } from './fittingCount';

// 오늘의 약속 카드의 얼굴 줄: 지름 50, 간격 12, 최대 4명
const FACES = { size: 50, gap: 12, max: 4 };

describe('fittingCount', () => {
  it('자리가 넉넉하면 최대 개수만큼', () => {
    expect(fittingCount({ width: 300, ...FACES })).toBe(4);
  });

  it('딱 맞는 너비면 모두 들어간다(4개 = 50 × 4 + 12 × 3 = 236)', () => {
    expect(fittingCount({ width: 236, ...FACES })).toBe(4);
  });

  it('조금이라도 모자라면 하나 줄인다', () => {
    expect(fittingCount({ width: 235, ...FACES })).toBe(3);
    expect(fittingCount({ width: 174, ...FACES })).toBe(3);
    expect(fittingCount({ width: 173, ...FACES })).toBe(2);
  });

  it('하나도 못 넣는 너비면 0', () => {
    expect(fittingCount({ width: 49, ...FACES })).toBe(0);
    expect(fittingCount({ width: 0, ...FACES })).toBe(0);
  });

  it('소수점 너비의 오차(235.999…)로 하나가 빠지지 않는다', () => {
    expect(fittingCount({ width: 235.9996, ...FACES })).toBe(4);
  });

  // 허브의 겹친 얼굴 줄: 지름 48을 20씩 겹친다(한 명이 늘 때마다 28). 8명 = 48 + 28 × 7 = 244
  it('겹쳐 놓는 줄(간격이 음수)도 센다', () => {
    const overlapped = { size: 48, gap: -20, max: 10 };
    expect(fittingCount({ width: 338, ...overlapped })).toBe(10);
    expect(fittingCount({ width: 256, ...overlapped })).toBe(8);
    expect(fittingCount({ width: 244, ...overlapped })).toBe(8);
    expect(fittingCount({ width: 243, ...overlapped })).toBe(7);
  });
});
