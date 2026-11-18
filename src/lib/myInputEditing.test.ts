import type { AvailabilityGroup } from '@/api/availability';

import { newGroupDraft } from './availabilityGroups';
import {
  changeDraft,
  changeMonth,
  closeStep,
  confirmCard,
  deleteCardGroup,
  groupsOutsideCard,
  openGroupCard,
  openNewCard,
  openOriginSearch,
  pickOrigin,
  startEditing,
  toggleDate,
  type MyInputEditing,
} from './myInputEditing';

const origin = { id: 'place-2', name: '중앙대학교 안성캠퍼스', address: '경기 안성시 대덕면 서동대로 4726' };
const group = (dates: string[]): AvailabilityGroup => ({
  dates,
  startMinutes: 600,
  endMinutes: 960,
  origin,
  mode: 'transit',
});
const range = { start: '2026-11-20', end: '2026-12-10' };
const december = group(['2026-12-03', '2026-12-04']);
const november = group(['2026-11-21']);

const editingWith = (patch: Partial<MyInputEditing>): MyInputEditing => ({
  ...startEditing([november, december], range),
  ...patch,
});

describe('startEditing', () => {
  it('저장한 묶음이 있으면 첫 묶음의 첫 날짜가 있는 달, 없으면 날짜 범위가 시작하는 달을 보인다', () => {
    expect(startEditing([december, november], range)).toEqual({
      month: { year: 2026, month: 12 },
      groups: [december, november],
      pickedDates: [],
      card: null,
    });
    expect(startEditing([], range).month).toEqual({ year: 2026, month: 11 });
  });
});

describe('changeMonth', () => {
  it('달을 앞뒤로 넘긴다', () => {
    expect(changeMonth(editingWith({}), 1).month).toEqual({ year: 2026, month: 12 });
  });
});

describe('toggleDate', () => {
  it('카드가 닫혀 있으면 큰 달력에서 고른 날짜를 바꾼다', () => {
    const picked = toggleDate(editingWith({}), '2026-11-25', range);
    expect(picked.pickedDates).toEqual(['2026-11-25']);
    expect(toggleDate(picked, '2026-11-25', range).pickedDates).toEqual([]);
  });

  it('카드가 열려 있으면 그 묶음의 날짜를 바꾸고 큰 달력에서 고른 날짜는 그대로 둔다', () => {
    const opened = openGroupCard(editingWith({}), 0);
    const toggled = toggleDate(opened, '2026-11-22', range);
    expect(toggled.card?.draft.dates).toEqual(['2026-11-21', '2026-11-22']);
    expect(toggled.pickedDates).toEqual([]);
  });

  it('날짜 범위 밖은 바꾸지 않는다', () => {
    expect(toggleDate(editingWith({}), '2026-11-19', range).pickedDates).toEqual([]);
  });
});

describe('openNewCard', () => {
  it('고른 날짜를 새 묶음의 카드로 옮긴다', () => {
    const opened = openNewCard(editingWith({ pickedDates: ['2026-11-25'] }));
    expect(opened.card).toEqual({ index: null, draft: newGroupDraft(['2026-11-25']), searchingOrigin: false });
    expect(opened.pickedDates).toEqual([]);
  });
});

describe('openGroupCard', () => {
  it('저장된 묶음을 카드로 열고 그 묶음의 첫 날짜가 있는 달로 간다', () => {
    const opened = openGroupCard(editingWith({}), 1);
    expect(opened.card).toEqual({ index: 1, draft: december, searchingOrigin: false });
    expect(opened.month).toEqual({ year: 2026, month: 12 });
  });
});

describe('changeDraft', () => {
  it('열린 카드의 값을 바꾼다', () => {
    const changed = changeDraft(openGroupCard(editingWith({}), 0), { mode: 'car', endMinutes: 1020 });
    expect(changed.card?.draft).toEqual({ ...november, mode: 'car', endMinutes: 1020 });
  });

  it('카드가 닫혀 있으면 그대로다', () => {
    const editing = editingWith({});
    expect(changeDraft(editing, { mode: 'car' })).toBe(editing);
  });
});

describe('confirmCard', () => {
  it('새 묶음은 끝에 더하고 카드를 닫는다', () => {
    const opened = pickOrigin(openNewCard(editingWith({ pickedDates: ['2026-11-25'] })), origin);
    const confirmed = confirmCard(opened);
    expect(confirmed.groups).toEqual([november, december, group(['2026-11-25'])]);
    expect(confirmed.card).toBeNull();
  });

  it('저장된 묶음은 그 자리에서 바꾼다', () => {
    const confirmed = confirmCard(changeDraft(openGroupCard(editingWith({}), 0), { mode: 'car' }));
    expect(confirmed.groups).toEqual([{ ...november, mode: 'car' }, december]);
    expect(confirmed.card).toBeNull();
  });

  it('확인할 수 없으면(출발지 없음) 그대로다', () => {
    const opened = openNewCard(editingWith({ pickedDates: ['2026-11-25'] }));
    expect(confirmCard(opened)).toBe(opened);
  });
});

describe('deleteCardGroup', () => {
  it('열린 묶음을 지우고 카드를 닫는다', () => {
    const deleted = deleteCardGroup(openGroupCard(editingWith({}), 0));
    expect(deleted.groups).toEqual([december]);
    expect(deleted.card).toBeNull();
  });

  it('새 묶음의 카드면 그대로다', () => {
    const opened = openNewCard(editingWith({ pickedDates: ['2026-11-25'] }));
    expect(deleteCardGroup(opened)).toBe(opened);
  });
});

describe('openOriginSearch, pickOrigin', () => {
  it('출발지를 고르면 카드에 넣고 출발지 찾기를 닫는다', () => {
    const searching = openOriginSearch(openNewCard(editingWith({ pickedDates: ['2026-11-25'] })));
    expect(searching.card?.searchingOrigin).toBe(true);
    const picked = pickOrigin(searching, origin);
    expect(picked.card).toEqual({
      index: null,
      draft: { ...newGroupDraft(['2026-11-25']), origin },
      searchingOrigin: false,
    });
  });
});

describe('closeStep', () => {
  it('출발지 찾기가 열려 있으면 그것만 닫는다', () => {
    const opened = openGroupCard(editingWith({}), 0);
    expect(closeStep(openOriginSearch(opened))).toEqual(opened);
  });

  it('새 묶음의 카드를 닫으면 카드에서 고친 날짜가 큰 달력에 고른 날짜로 남는다', () => {
    const opened = toggleDate(openNewCard(editingWith({ pickedDates: ['2026-11-25'] })), '2026-11-26', range);
    const closed = closeStep(opened);
    expect(closed.card).toBeNull();
    expect(closed.pickedDates).toEqual(['2026-11-25', '2026-11-26']);
  });

  it('저장된 묶음의 카드를 닫으면 고친 값을 버린다', () => {
    const editing = editingWith({ pickedDates: ['2026-11-25'] });
    const closed = closeStep(changeDraft(openGroupCard(editing, 0), { mode: 'car' }));
    expect(closed.card).toBeNull();
    expect(closed.groups).toEqual([november, december]);
    expect(closed.pickedDates).toEqual(['2026-11-25']);
  });

  it('열린 단계가 없으면 그대로다', () => {
    const editing = editingWith({});
    expect(closeStep(editing)).toBe(editing);
  });
});

describe('groupsOutsideCard', () => {
  it('고치는 묶음을 뺀 나머지. 새 묶음의 카드면 전부다', () => {
    expect(groupsOutsideCard(openGroupCard(editingWith({}), 0))).toEqual([december]);
    expect(groupsOutsideCard(openNewCard(editingWith({})))).toEqual([november, december]);
  });
});
