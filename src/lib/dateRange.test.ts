import { dayCellState, EMPTY_RANGE, pickRangeDate, type DateRange } from './dateRange';

const range = (start: string | null, end: string | null): DateRange => ({ start, end });

describe('pickRangeDate', () => {
  it('아무것도 고르지 않았으면 누른 날이 시작일이 된다', () => {
    expect(pickRangeDate(EMPTY_RANGE, '2026-04-10')).toEqual(range('2026-04-10', null));
  });

  it('시작일만 있을 때 같거나 뒤의 날을 누르면 종료일이 된다', () => {
    expect(pickRangeDate(range('2026-04-10', null), '2026-04-20')).toEqual(
      range('2026-04-10', '2026-04-20'),
    );
    // 하루짜리 범위
    expect(pickRangeDate(range('2026-04-10', null), '2026-04-10')).toEqual(
      range('2026-04-10', '2026-04-10'),
    );
  });

  it('시작일만 있을 때 앞의 날을 누르면 시작일을 그 날로 바꾼다', () => {
    expect(pickRangeDate(range('2026-04-10', null), '2026-04-05')).toEqual(
      range('2026-04-05', null),
    );
  });

  it('시작과 끝이 다 있으면 누른 날부터 다시 고른다', () => {
    expect(pickRangeDate(range('2026-04-01', '2026-04-30'), '2026-04-15')).toEqual(
      range('2026-04-15', null),
    );
  });

  it('달을 넘는 범위도 고른다', () => {
    expect(pickRangeDate(range('2026-04-28', null), '2026-05-03')).toEqual(
      range('2026-04-28', '2026-05-03'),
    );
  });
});

describe('dayCellState', () => {
  const today = '2026-04-01';
  const april = range('2026-04-01', '2026-04-30');
  const inMonth = (key: string, r: DateRange = april) =>
    dayCellState(r, { key, inMonth: true }, today);

  it('범위의 시작, 사이, 끝', () => {
    expect(inMonth('2026-04-01')).toBe('start');
    expect(inMonth('2026-04-15')).toBe('inRange');
    expect(inMonth('2026-04-30')).toBe('end');
  });

  it('범위 밖이면 default', () => {
    expect(inMonth('2026-04-20', range('2026-04-01', '2026-04-10'))).toBe('default');
    expect(inMonth('2026-04-20', EMPTY_RANGE)).toBe('default');
  });

  it('시작일만 골랐거나 하루짜리 범위면 single(띠 없이 원만)', () => {
    expect(inMonth('2026-04-10', range('2026-04-10', null))).toBe('single');
    expect(inMonth('2026-04-10', range('2026-04-10', '2026-04-10'))).toBe('single');
  });

  it('오늘보다 앞의 날은 disabled', () => {
    expect(dayCellState(EMPTY_RANGE, { key: '2026-03-31', inMonth: true }, today)).toBe('disabled');
    expect(dayCellState(EMPTY_RANGE, { key: '2026-04-01', inMonth: true }, today)).toBe('default');
  });

  it('보이는 달 밖의 날은 범위 안이어도 disabled', () => {
    const acrossMonths = range('2026-04-28', '2026-05-03');
    expect(dayCellState(acrossMonths, { key: '2026-05-01', inMonth: false }, today)).toBe('disabled');
  });
});
