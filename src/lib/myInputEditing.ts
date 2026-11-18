// 내 입력 화면에서 고치는 중인 값과 그 값이 바뀌는 규칙: 날짜 고르기, 시간 카드 열기·확인·지우기, 출발지 찾기, 단계 닫기.
// 묶음 하나의 규칙(처음 값, 확인 조건, 더하기·지우기)은 availabilityGroups.ts에 있다.
import type { AvailabilityGroup } from '@/api/availability';
import type { Place } from '@/api/places';

import {
  newGroupDraft,
  removeGroup,
  toGroup,
  toGroupDraft,
  upsertGroup,
  type GroupDraft,
} from './availabilityGroups';
import { addMonths, yearMonthOf, type DateKey, type YearMonth } from './monthGrid';
import { togglePickedDate } from './pickedDates';

type DateRange = { start: DateKey; end: DateKey };

// 열린 시간 카드. index가 null이면 새 묶음이다. searchingOrigin이면 카드 위에 출발지 찾기가 열려 있다.
export type OpenCard = { index: number | null; draft: GroupDraft; searchingOrigin: boolean };

export type MyInputEditing = {
  month: YearMonth;
  groups: AvailabilityGroup[];
  // 큰 달력에서 고르고 아직 묶음으로 만들지 않은 날짜
  pickedDates: DateKey[];
  card: OpenCard | null;
};

// 화면이 setState에 그대로 넘기는 모양
export type EditingChange = (editing: MyInputEditing) => MyInputEditing;

export function startEditing(saved: AvailabilityGroup[], range: DateRange): MyInputEditing {
  return {
    month: yearMonthOf(saved[0]?.dates[0] ?? range.start),
    groups: saved,
    pickedDates: [],
    card: null,
  };
}

export function changeMonth(editing: MyInputEditing, step: number): MyInputEditing {
  return { ...editing, month: addMonths(editing.month, step) };
}

// 카드가 열려 있으면 그 묶음의 날짜를, 아니면 큰 달력에서 고른 날짜를 바꾼다.
export function toggleDate(editing: MyInputEditing, key: DateKey, range: DateRange): MyInputEditing {
  if (editing.card) return changeDraft(editing, { dates: togglePickedDate(editing.card.draft.dates, key, range) });
  return { ...editing, pickedDates: togglePickedDate(editing.pickedDates, key, range) };
}

export function openNewCard(editing: MyInputEditing): MyInputEditing {
  const card = { index: null, draft: newGroupDraft(editing.pickedDates), searchingOrigin: false };
  return { ...editing, pickedDates: [], card };
}

export function openGroupCard(editing: MyInputEditing, index: number): MyInputEditing {
  const group = editing.groups[index];
  return {
    ...editing,
    month: yearMonthOf(group.dates[0]),
    card: { index, draft: toGroupDraft(group), searchingOrigin: false },
  };
}

export function changeDraft(editing: MyInputEditing, patch: Partial<GroupDraft>): MyInputEditing {
  if (!editing.card) return editing;
  return { ...editing, card: { ...editing.card, draft: { ...editing.card.draft, ...patch } } };
}

export function confirmCard(editing: MyInputEditing): MyInputEditing {
  const group = editing.card && toGroup(editing.card.draft);
  if (!editing.card || !group) return editing;
  return { ...editing, groups: upsertGroup(editing.groups, editing.card.index, group), card: null };
}

export function deleteCardGroup(editing: MyInputEditing): MyInputEditing {
  if (!editing.card || editing.card.index === null) return editing;
  return { ...editing, groups: removeGroup(editing.groups, editing.card.index), card: null };
}

export function openOriginSearch(editing: MyInputEditing): MyInputEditing {
  if (!editing.card) return editing;
  return { ...editing, card: { ...editing.card, searchingOrigin: true } };
}

export function pickOrigin(editing: MyInputEditing, origin: Place): MyInputEditing {
  if (!editing.card) return editing;
  return { ...editing, card: { ...editing.card, draft: { ...editing.card.draft, origin }, searchingOrigin: false } };
}

// 뒤로 가기와 닫기(X)는 열린 단계를 하나씩 닫는다: 출발지 찾기 → 시간 카드.
export function closeStep(editing: MyInputEditing): MyInputEditing {
  if (!editing.card) return editing;
  if (editing.card.searchingOrigin) return { ...editing, card: { ...editing.card, searchingOrigin: false } };
  // 새 묶음의 카드를 닫으면 고른 날짜는 큰 달력에 남겨 둔다.
  if (editing.card.index === null) return { ...editing, pickedDates: editing.card.draft.dates, card: null };
  return { ...editing, card: null };
}

// 작은 달력에 막대로 보일 묶음. 고치는 묶음의 날짜는 고른 모양으로 보이므로 뺀다.
export function groupsOutsideCard(editing: MyInputEditing): AvailabilityGroup[] {
  if (!editing.card || editing.card.index === null) return editing.groups;
  return removeGroup(editing.groups, editing.card.index);
}
