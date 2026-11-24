import type { AvailabilityGroup } from '@/api/availability';

import { dayCellLook } from './availabilityCalendar';

const origin = { id: 'place-2', name: '중앙대학교 안성캠퍼스', address: '경기 안성시' };
const groups: AvailabilityGroup[] = [
  { dates: ['2026-04-10'], startMinutes: 600, endMinutes: 960, origin, mode: 'transit' },
];
const context = {
  range: { start: '2026-04-03', end: '2026-04-30' },
  picked: ['2026-04-22', '2026-04-23'],
  groups,
  today: '2026-04-05',
};
const day = (key: string, inMonth = true) => ({ key, inMonth });

describe('dayCellLook', () => {
  it('범위 안의 고르지 않은 날', () => {
    expect(dayCellLook(day('2026-04-12'), context)).toEqual({
      disabled: false,
      shape: 'none',
      today: false,
      barTones: [],
    });
  });

  it('범위 밖이나 앞뒤 달 칸은 비활성이고 모양과 막대를 그리지 않는다', () => {
    expect(dayCellLook(day('2026-04-01'), context).disabled).toBe(true);
    expect(dayCellLook(day('2026-04-22', false), { ...context, groups: [] })).toEqual({
      disabled: true,
      shape: 'none',
      today: false,
      barTones: [],
    });
  });

  it('고른 날의 이어진 모양, 오늘, 저장된 묶음의 막대', () => {
    expect(dayCellLook(day('2026-04-22'), context).shape).toBe('start');
    expect(dayCellLook(day('2026-04-05'), context).today).toBe(true);
    expect(dayCellLook(day('2026-04-10'), context).barTones).toEqual([1]);
  });
});
