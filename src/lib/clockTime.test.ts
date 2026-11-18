import { clockText, fromClockParts, toClockParts } from './clockTime';

describe('toClockParts', () => {
  it('자정부터 센 분을 오전·오후, 시(1~12), 분으로', () => {
    expect(toClockParts(600)).toEqual({ meridiem: '오전', hour: 10, minute: 0 });
    expect(toClockParts(960)).toEqual({ meridiem: '오후', hour: 4, minute: 0 });
    expect(toClockParts(0)).toEqual({ meridiem: '오전', hour: 12, minute: 0 });
    expect(toClockParts(720)).toEqual({ meridiem: '오후', hour: 12, minute: 0 });
    expect(toClockParts(1435)).toEqual({ meridiem: '오후', hour: 11, minute: 55 });
  });
});

describe('fromClockParts', () => {
  it('toClockParts를 되돌린다', () => {
    for (const minutes of [0, 5, 600, 715, 720, 725, 960, 1435]) {
      expect(fromClockParts(toClockParts(minutes))).toBe(minutes);
    }
  });
});

describe('clockText', () => {
  it('"오전 10:00", "오후 4:00"', () => {
    expect(clockText(600)).toBe('오전 10:00');
    expect(clockText(960)).toBe('오후 4:00');
    expect(clockText(0)).toBe('오전 12:00');
    expect(clockText(725)).toBe('오후 12:05');
  });
});
