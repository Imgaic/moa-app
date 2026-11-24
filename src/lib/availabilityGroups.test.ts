import type { AvailabilityGroup } from '@/api/availability';

import {
  barTonesOn,
  canConfirmGroup,
  canSave,
  hasUnsavedChanges,
  newGroupDraft,
  removeGroup,
  toGroup,
  toGroupDraft,
  upsertGroup,
} from './availabilityGroups';

const origin = { id: 'place-2', name: '중앙대학교 안성캠퍼스', address: '경기 안성시 대덕면 서동대로 4726' };
const group = (dates: string[]): AvailabilityGroup => ({
  dates,
  startMinutes: 600,
  endMinutes: 960,
  origin,
  mode: 'transit',
});

describe('newGroupDraft', () => {
  it('고른 날짜와 처음 값(오전 10시 ~ 오후 4시, 대중교통, 출발지 없음)', () => {
    expect(newGroupDraft(['2026-04-01'])).toEqual({
      dates: ['2026-04-01'],
      startMinutes: 600,
      endMinutes: 960,
      origin: null,
      mode: 'transit',
    });
  });
});

describe('canConfirmGroup', () => {
  const ready = { ...newGroupDraft(['2026-04-01']), origin };

  it('날짜, 종료가 시작보다 늦은 시간, 출발지가 다 있어야 한다', () => {
    expect(canConfirmGroup(ready)).toBe(true);
    expect(canConfirmGroup({ ...ready, dates: [] })).toBe(false);
    expect(canConfirmGroup({ ...ready, origin: null })).toBe(false);
    expect(canConfirmGroup({ ...ready, endMinutes: 600 })).toBe(false);
  });
});

describe('toGroup, toGroupDraft', () => {
  it('확인할 수 없으면 null', () => {
    expect(toGroup(newGroupDraft(['2026-04-01']))).toBeNull();
  });

  it('묶음을 다시 열면 같은 값으로 돌아온다', () => {
    const saved = group(['2026-04-01']);
    expect(toGroup(toGroupDraft(saved))).toEqual(saved);
  });
});

describe('upsertGroup, removeGroup', () => {
  const groups = [group(['2026-04-01']), group(['2026-04-02'])];

  it('번호가 없으면 끝에 더한다', () => {
    expect(upsertGroup(groups, null, group(['2026-04-03']))).toHaveLength(3);
  });

  it('번호가 있으면 그 묶음을 바꾼다', () => {
    const changed = upsertGroup(groups, 1, group(['2026-04-09']));
    expect(changed[1].dates).toEqual(['2026-04-09']);
    expect(groups[1].dates).toEqual(['2026-04-02']);
  });

  it('지우면 뒤의 묶음이 앞으로 온다', () => {
    expect(removeGroup(groups, 0)).toEqual([group(['2026-04-02'])]);
  });
});

describe('barTonesOn', () => {
  it('그 날짜가 든 묶음마다 막대 색 하나(묶음 순서대로 1, 2, 3, 다시 1)', () => {
    const groups = [group(['2026-04-01']), group(['2026-04-01', '2026-04-02']), group(['2026-04-02']), group(['2026-04-01'])];
    expect(barTonesOn(groups, '2026-04-01')).toEqual([1, 2, 1]);
    expect(barTonesOn(groups, '2026-04-02')).toEqual([2, 3]);
    expect(barTonesOn(groups, '2026-04-03')).toEqual([]);
  });
});

describe('canSave', () => {
  const groups = [group(['2026-04-01'])];

  it('묶음이 하나 이상이고, 고르다 만 날짜와 열린 카드가 없어야 한다', () => {
    expect(canSave(groups, [], false)).toBe(true);
    expect(canSave([], [], false)).toBe(false);
    expect(canSave(groups, ['2026-04-05'], false)).toBe(false);
    expect(canSave(groups, [], true)).toBe(false);
  });
});

describe('hasUnsavedChanges', () => {
  const saved = [group(['2026-04-01'])];

  it('저장한 묶음과 다르거나 고르다 만 날짜가 있으면 true', () => {
    expect(hasUnsavedChanges(saved, [group(['2026-04-01'])], [])).toBe(false);
    expect(hasUnsavedChanges(saved, [], [])).toBe(true);
    expect(hasUnsavedChanges(saved, saved, ['2026-04-03'])).toBe(true);
  });
});
