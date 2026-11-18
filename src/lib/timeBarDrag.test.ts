import { dragHandle, dragTargetAt, LAST_MINUTE, MIN_DURATION_MINUTES } from './timeBarDrag';

const HOUR = 60;

describe('dragTargetAt', () => {
  const width = 280;
  const hitRadius = 22;

  it('손잡이 가까이를 누르면 그 손잡이, 멀면 축', () => {
    expect(dragTargetAt(50, { startX: 40, endX: 200 }, width, hitRadius)).toBe('start');
    expect(dragTargetAt(210, { startX: 40, endX: 200 }, width, hitRadius)).toBe('end');
    expect(dragTargetAt(120, { startX: 40, endX: 200 }, width, hitRadius)).toBe('axis');
  });

  it('두 손잡이가 붙어 있으면 왼쪽을 누를 때 시작, 오른쪽이면 종료', () => {
    expect(dragTargetAt(101, { startX: 100, endX: 104 }, width, hitRadius)).toBe('start');
    expect(dragTargetAt(98, { startX: 100, endX: 104 }, width, hitRadius)).toBe('start');
    expect(dragTargetAt(102, { startX: 100, endX: 104 }, width, hitRadius)).toBe('end');
  });

  it('창 밖에 있어 그리지 않은 손잡이는 잡지 않는다', () => {
    expect(dragTargetAt(5, { startX: -10, endX: 200 }, width, hitRadius)).toBe('axis');
    expect(dragTargetAt(275, { startX: 40, endX: 290 }, width, hitRadius)).toBe('axis');
  });
});

describe('dragHandle', () => {
  const range = { start: 10 * HOUR, end: 16 * HOUR };

  it('끈 시각을 스냅 단위에 붙인다', () => {
    expect(dragHandle(range, 'start', 9 * HOUR + 14, 30)).toEqual({ start: 9 * HOUR, end: 16 * HOUR });
    expect(dragHandle(range, 'start', 9 * HOUR + 16, 30)).toEqual({ start: 9.5 * HOUR, end: 16 * HOUR });
    expect(dragHandle(range, 'end', 17 * HOUR + 7, 5)).toEqual({ start: 10 * HOUR, end: 17 * HOUR + 5 });
  });

  it('시작은 종료보다 최소 길이만큼 앞에서 멈춘다', () => {
    expect(dragHandle(range, 'start', 20 * HOUR, 30)).toEqual({ start: 16 * HOUR - MIN_DURATION_MINUTES, end: 16 * HOUR });
  });

  it('종료는 시작보다 최소 길이만큼 뒤에서 멈춘다', () => {
    expect(dragHandle(range, 'end', 8 * HOUR, 10)).toEqual({ start: 10 * HOUR, end: 10 * HOUR + MIN_DURATION_MINUTES });
  });

  it('최소 길이를 지키려 할 때도 스냅 단위에 맞춘다', () => {
    // 종료 16:10, 30분 단위면 시작은 15:30까지(15:40은 단위에 안 맞는다)
    expect(dragHandle({ start: 10 * HOUR, end: 16 * HOUR + 10 }, 'start', 20 * HOUR, 30).start).toBe(15.5 * HOUR);
  });

  it('하루 밖으로 나가지 않는다(종료는 오후 11:55까지)', () => {
    expect(dragHandle(range, 'start', -30, 30).start).toBe(0);
    expect(dragHandle(range, 'end', 24 * HOUR, 5).end).toBe(LAST_MINUTE);
    expect(dragHandle(range, 'end', 24 * HOUR, 30).end).toBe(23.5 * HOUR);
  });
});
