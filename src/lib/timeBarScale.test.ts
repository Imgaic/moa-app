import { minutesAtX, snapStepOf, tickMinutes, tickText, xOfMinutes } from './timeBarScale';

const HOUR = 60;
const window = { start: 8 * HOUR, end: 18 * HOUR };
const width = 300;

describe('xOfMinutes, minutesAtX', () => {
  it('창의 왼쪽 끝이 0, 오른쪽 끝이 폭이다', () => {
    expect(xOfMinutes(8 * HOUR, window, width)).toBe(0);
    expect(xOfMinutes(13 * HOUR, window, width)).toBe(150);
    expect(xOfMinutes(18 * HOUR, window, width)).toBe(300);
  });

  it('창 밖의 시각은 폭 밖의 위치다', () => {
    expect(xOfMinutes(6 * HOUR, window, width)).toBe(-60);
  });

  it('위치 → 시각은 되돌리기이고, 폭 밖은 창 끝으로 붙인다', () => {
    expect(minutesAtX(150, window, width)).toBe(13 * HOUR);
    expect(minutesAtX(-20, window, width)).toBe(8 * HOUR);
    expect(minutesAtX(500, window, width)).toBe(18 * HOUR);
  });
});

describe('snapStepOf', () => {
  it('넓은 창은 30분, 중간은 10분, 좁은 창은 5분', () => {
    expect(snapStepOf(24 * HOUR)).toBe(30);
    expect(snapStepOf(8 * HOUR)).toBe(30);
    expect(snapStepOf(7 * HOUR)).toBe(10);
    expect(snapStepOf(4 * HOUR)).toBe(10);
    expect(snapStepOf(3 * HOUR)).toBe(5);
  });
});

describe('tickMinutes', () => {
  it('10시간 창, 폭 300이면 2시간 간격(1시간이면 30점이라 글자가 붙는다)', () => {
    expect(tickMinutes(window, width, 0)).toEqual([8, 10, 12, 14, 16, 18].map((hour) => hour * HOUR));
  });

  it('글자가 넘치는 창 끝 눈금은 뺀다', () => {
    // 끝에서 5점(=10분) 안쪽 눈금만
    expect(tickMinutes(window, width, 5)).toEqual([10, 12, 14, 16].map((hour) => hour * HOUR));
  });

  it('창이 좁아지면 간격도 좁아지고, 넓어지면 넓어진다', () => {
    expect(tickMinutes({ start: 0, end: 24 * HOUR }, 280, 0)).toEqual([0, 4, 8, 12, 16, 20, 24].map((hour) => hour * HOUR));
    expect(tickMinutes({ start: 10 * HOUR, end: 15 * HOUR }, 280, 0)).toEqual([10, 11, 12, 13, 14, 15].map((hour) => hour * HOUR));
    expect(tickMinutes({ start: 10 * HOUR, end: 12 * HOUR }, 280, 0)).toEqual([600, 630, 660, 690, 720]);
  });

  it('창이 정시에서 시작하지 않아도 간격의 배수에 눈금을 둔다', () => {
    expect(tickMinutes({ start: 8.5 * HOUR, end: 18.5 * HOUR }, width, 0)).toEqual([10, 12, 14, 16, 18].map((hour) => hour * HOUR));
  });
});

describe('tickText', () => {
  it('24시간제 "10:00", "9:30", 하루 끝은 "24:00"', () => {
    expect(tickText(600)).toBe('10:00');
    expect(tickText(570)).toBe('9:30');
    expect(tickText(0)).toBe('0:00');
    expect(tickText(24 * HOUR)).toBe('24:00');
  });
});
