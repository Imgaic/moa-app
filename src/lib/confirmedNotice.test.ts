import { confirmedFirst, shouldShowConfirmedNotice } from './confirmedNotice';

describe('shouldShowConfirmedNotice', () => {
  it('확정된 약속을 처음 열 때만 보인다', () => {
    expect(shouldShowConfirmedNotice('confirmed', false)).toBe(true);
    expect(shouldShowConfirmedNotice('confirmed', true)).toBe(false);
  });

  it('확정 전이나 지난 약속에는 보이지 않는다', () => {
    expect(shouldShowConfirmedNotice('recommended', false)).toBe(false);
    expect(shouldShowConfirmedNotice('collecting', false)).toBe(false);
    expect(shouldShowConfirmedNotice('past', false)).toBe(false);
  });
});

describe('confirmedFirst', () => {
  const candidate = (id: string, startsAt: string, name: string) => ({ id, startsAt, place: { name } });
  const candidates = [
    candidate('c1', '2026-04-01T10:00:00.000Z', '사당역'),
    candidate('c2', '2026-04-22T05:00:00.000Z', '강남역'),
    candidate('c3', '2026-04-24T10:30:00.000Z', '사당역'),
  ];

  it('확정된 일시와 장소가 같은 후보를 맨 앞에, 나머지는 원래 순서로', () => {
    const confirmed = { startsAt: '2026-04-22T05:00:00.000Z', place: { name: '강남역' } };
    expect(confirmedFirst(candidates, confirmed).map((c) => c.id)).toEqual(['c2', 'c1', 'c3']);
  });

  it('같은 후보가 없으면(장소를 직접 정한 확정 등) 빈 목록', () => {
    const confirmed = { startsAt: '2026-04-22T05:00:00.000Z', place: { name: '홍대입구역' } };
    expect(confirmedFirst(candidates, confirmed)).toEqual([]);
  });
});
