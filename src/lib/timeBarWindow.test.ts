import {
  clampWindow,
  DAY_MINUTES,
  edgePushMinutes,
  initialWindow,
  MIN_WINDOW_MINUTES,
  panWindow,
  windowSpan,
  zoomWindow,
} from './timeBarWindow';

const HOUR = 60;

describe('clampWindow', () => {
  it('하루 안이면 그대로', () => {
    expect(clampWindow(8 * HOUR, 10 * HOUR)).toEqual({ start: 8 * HOUR, end: 18 * HOUR });
  });

  it('하루 밖으로 나가면 안쪽으로 민다', () => {
    expect(clampWindow(-HOUR, 10 * HOUR)).toEqual({ start: 0, end: 10 * HOUR });
    expect(clampWindow(20 * HOUR, 10 * HOUR)).toEqual({ start: 14 * HOUR, end: DAY_MINUTES });
  });

  it('길이는 가장 좁은 창과 하루 사이로 줄인다', () => {
    expect(windowSpan(clampWindow(0, HOUR))).toBe(MIN_WINDOW_MINUTES);
    expect(clampWindow(-5, 30 * HOUR)).toEqual({ start: 0, end: DAY_MINUTES });
  });
});

describe('initialWindow', () => {
  it('고른 시간이 가운데 오도록, 10시간 창, 정시에서 시작', () => {
    // 오전 10시~오후 4시 → 가운데 13시 → 8시~18시
    expect(initialWindow(10 * HOUR, 16 * HOUR)).toEqual({ start: 8 * HOUR, end: 18 * HOUR });
  });

  it('고른 시간이 길면 앞뒤 한 시간씩 여유를 두고 넓힌다', () => {
    // 9시~21시(12시간) → 14시간 창, 가운데 15시 → 8시~22시
    expect(initialWindow(9 * HOUR, 21 * HOUR)).toEqual({ start: 8 * HOUR, end: 22 * HOUR });
  });

  it('하루 끝에 가까우면 하루 안으로 밀린다', () => {
    expect(initialWindow(22 * HOUR, 23 * HOUR)).toEqual({ start: 14 * HOUR, end: DAY_MINUTES });
    expect(initialWindow(0, HOUR)).toEqual({ start: 0, end: 10 * HOUR });
  });
});

describe('zoomWindow', () => {
  const window = { start: 8 * HOUR, end: 18 * HOUR };

  it('벌리면(scale > 1) 창이 좁아지고, 손가락 아래 시각은 그 자리에 남는다', () => {
    // 가운데(13시)를 두 배로 → 5시간 창 10:30~15:30
    expect(zoomWindow(window, 0.5, 2)).toEqual({ start: 10.5 * HOUR, end: 15.5 * HOUR });
    // 왼쪽 끝(8시)을 기준으로 → 8시~13시
    expect(zoomWindow(window, 0, 2)).toEqual({ start: 8 * HOUR, end: 13 * HOUR });
  });

  it('오므리면 넓어지고 하루를 넘지 않는다', () => {
    expect(zoomWindow(window, 0.5, 0.5)).toEqual({ start: 3 * HOUR, end: 23 * HOUR });
    expect(zoomWindow(window, 0.5, 0.1)).toEqual({ start: 0, end: DAY_MINUTES });
  });

  it('가장 좁은 창보다 좁아지지 않는다', () => {
    expect(windowSpan(zoomWindow(window, 0.5, 100))).toBe(MIN_WINDOW_MINUTES);
  });
});

describe('panWindow', () => {
  it('길이는 그대로 두고 옮긴다', () => {
    expect(panWindow({ start: 8 * HOUR, end: 18 * HOUR }, 2 * HOUR)).toEqual({ start: 10 * HOUR, end: 20 * HOUR });
  });

  it('하루 끝에서 멈춘다', () => {
    expect(panWindow({ start: 8 * HOUR, end: 18 * HOUR }, 10 * HOUR)).toEqual({ start: 14 * HOUR, end: DAY_MINUTES });
    expect(panWindow({ start: 2 * HOUR, end: 12 * HOUR }, -5 * HOUR)).toEqual({ start: 0, end: 10 * HOUR });
  });
});

describe('edgePushMinutes', () => {
  const width = 280;
  const edgeZone = 28;
  const span = 10 * HOUR;

  it('가운데에서는 밀지 않는다', () => {
    expect(edgePushMinutes(140, width, edgeZone, span, 100)).toBe(0);
    expect(edgePushMinutes(edgeZone, width, edgeZone, span, 100)).toBe(0);
  });

  it('끝 띠에 깊이 들어갈수록 빨리 민다(오른쪽 +, 왼쪽 -)', () => {
    // 끝에 닿으면 1초에 창 절반(5시간). 100ms면 30분.
    expect(edgePushMinutes(width, width, edgeZone, span, 100)).toBeCloseTo(30);
    expect(edgePushMinutes(width - edgeZone / 2, width, edgeZone, span, 100)).toBeCloseTo(15);
    expect(edgePushMinutes(0, width, edgeZone, span, 100)).toBeCloseTo(-30);
  });

  it('창 밖으로 손가락이 나가도 가장 빠른 속도를 넘지 않는다', () => {
    expect(edgePushMinutes(width + 100, width, edgeZone, span, 100)).toBeCloseTo(30);
    expect(edgePushMinutes(-100, width, edgeZone, span, 100)).toBeCloseTo(-30);
  });
});
