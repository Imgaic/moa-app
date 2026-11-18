import { isPickable, pickedShape, togglePickedDate } from './pickedDates';

const range = { start: '2026-04-03', end: '2026-05-02' };

describe('isPickable', () => {
  it('호스트가 정한 범위 안(양 끝 포함)만 고를 수 있다', () => {
    expect(isPickable('2026-04-03', range)).toBe(true);
    expect(isPickable('2026-05-02', range)).toBe(true);
    expect(isPickable('2026-04-02', range)).toBe(false);
    expect(isPickable('2026-05-03', range)).toBe(false);
  });
});

describe('togglePickedDate', () => {
  it('없으면 넣고 있으면 뺀다. 늘 날짜 순이다', () => {
    const picked = togglePickedDate(['2026-04-10'], '2026-04-05', range);
    expect(picked).toEqual(['2026-04-05', '2026-04-10']);
    expect(togglePickedDate(picked, '2026-04-10', range)).toEqual(['2026-04-05']);
  });

  it('범위 밖은 무시한다', () => {
    expect(togglePickedDate(['2026-04-10'], '2026-04-01', range)).toEqual(['2026-04-10']);
  });
});

describe('pickedShape', () => {
  const picked = ['2026-04-01', '2026-04-10', '2026-04-22', '2026-04-23', '2026-04-24'];

  it('고르지 않은 날은 none', () => {
    expect(pickedShape(picked, '2026-04-02')).toBe('none');
  });

  it('앞뒤 날을 안 골랐으면 single', () => {
    expect(pickedShape(picked, '2026-04-10')).toBe('single');
  });

  it('이어진 날은 start, middle, end', () => {
    expect(pickedShape(picked, '2026-04-22')).toBe('start');
    expect(pickedShape(picked, '2026-04-23')).toBe('middle');
    expect(pickedShape(picked, '2026-04-24')).toBe('end');
  });

  it('달을 넘어 이어져도 잇는다', () => {
    expect(pickedShape(['2026-04-30', '2026-05-01'], '2026-04-30')).toBe('start');
    expect(pickedShape(['2026-04-30', '2026-05-01'], '2026-05-01')).toBe('end');
  });
});
