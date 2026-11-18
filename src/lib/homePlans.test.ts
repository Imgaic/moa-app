import type { Plan } from '@/api/plans';

import { splitHomePlans } from './homePlans';

const now = new Date(2026, 10, 18, 14, 0);

function plan(id: string, status: Plan['status'], startsAt?: Date): Plan {
  return {
    id,
    title: id,
    status,
    confirmed: startsAt ? { startsAt: startsAt.toISOString(), place: { name: '사당역' } } : null,
    members: [],
  };
}

describe('splitHomePlans', () => {
  it('오늘 확정된 약속 중 가장 이른 것이 오늘의 약속이고, 나머지는 다음 약속이다', () => {
    const later = plan('later', 'confirmed', new Date(2026, 10, 18, 19, 0));
    const first = plan('first', 'confirmed', new Date(2026, 10, 18, 14, 10));
    const { today, upcoming } = splitHomePlans([later, first], now);
    expect(today?.id).toBe('first');
    expect(upcoming.map((p) => p.id)).toEqual(['later']);
  });

  it('오늘 확정된 약속이 없으면 오늘의 약속은 null', () => {
    const { today } = splitHomePlans([plan('tomorrow', 'confirmed', new Date(2026, 10, 19, 9, 0))], now);
    expect(today).toBeNull();
  });

  it('다음 약속은 확정된 것을 시각 순으로, 확정 전인 것을 그 뒤에 받은 순서대로 둔다', () => {
    const plans = [
      plan('collecting', 'collecting'),
      plan('far', 'confirmed', new Date(2026, 11, 1, 12, 0)),
      plan('recommended', 'recommended'),
      plan('near', 'confirmed', new Date(2026, 10, 19, 18, 0)),
    ];
    expect(splitHomePlans(plans, now).upcoming.map((p) => p.id)).toEqual([
      'near',
      'far',
      'collecting',
      'recommended',
    ]);
  });

  it('지난 약속은 홈에서 뺀다', () => {
    const { today, upcoming } = splitHomePlans([plan('past', 'past', new Date(2026, 10, 10, 12, 0))], now);
    expect(today).toBeNull();
    expect(upcoming).toEqual([]);
  });
});
