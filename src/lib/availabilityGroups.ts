// 내 입력의 묶음 규칙: 새 묶음의 처음 값, 확인할 수 있는 조건, 묶음 더하기·바꾸기·지우기, 저장할 수 있는 조건.
import type { AvailabilityGroup, TravelMode } from '@/api/availability';
import type { Place } from '@/api/places';

import type { DateKey } from './monthGrid';

// 피그마 예시(오전 10:00 ~ 오후 4:00)를 처음 값으로 두었다.
const DEFAULT_START_MINUTES = 10 * 60;
const DEFAULT_END_MINUTES = 16 * 60;
const DEFAULT_MODE: TravelMode = 'transit';
// 피그마 Date Cell/Bar의 Available1~3. 묶음이 셋을 넘으면 색을 처음부터 다시 쓴다.
const BAR_TONE_COUNT = 3;

export type BarTone = 1 | 2 | 3;

// 시간 카드에서 고치는 중인 묶음. 출발지는 고르기 전이면 null이다.
export type GroupDraft = Omit<AvailabilityGroup, 'origin'> & { origin: Place | null };

export function newGroupDraft(dates: DateKey[]): GroupDraft {
  return {
    dates,
    startMinutes: DEFAULT_START_MINUTES,
    endMinutes: DEFAULT_END_MINUTES,
    origin: null,
    mode: DEFAULT_MODE,
  };
}

export const toGroupDraft = (group: AvailabilityGroup): GroupDraft => ({ ...group });

// 날짜, 종료가 시작보다 늦은 시간(자정을 넘지 않는다), 출발지가 다 있어야 확인(✓)할 수 있다.
export function canConfirmGroup(draft: GroupDraft): boolean {
  return draft.dates.length > 0 && draft.endMinutes > draft.startMinutes && draft.origin !== null;
}

export function toGroup(draft: GroupDraft): AvailabilityGroup | null {
  if (!canConfirmGroup(draft) || draft.origin === null) return null;
  return { ...draft, origin: draft.origin };
}

// index가 null이면 새 묶음으로 끝에 더하고, 아니면 그 묶음을 바꾼다.
export function upsertGroup(
  groups: AvailabilityGroup[],
  index: number | null,
  group: AvailabilityGroup,
): AvailabilityGroup[] {
  if (index === null) return [...groups, group];
  return groups.map((current, i) => (i === index ? group : current));
}

export function removeGroup(groups: AvailabilityGroup[], index: number): AvailabilityGroup[] {
  return groups.filter((_, i) => i !== index);
}

export function barToneOf(index: number): BarTone {
  return ((index % BAR_TONE_COUNT) + 1) as BarTone;
}

// 그 날짜가 든 묶음마다 막대 색 하나. 묶음 사이에 날짜가 겹칠 수 있다(docs/open-questions.md).
export function barTonesOn(groups: AvailabilityGroup[], key: DateKey): BarTone[] {
  return groups.flatMap((group, index) => (group.dates.includes(key) ? [barToneOf(index)] : []));
}

// 피그마에서 날짜를 고르는 중이거나 시간 카드가 열려 있으면 아래 버튼이 회색이다.
export function canSave(groups: AvailabilityGroup[], pickedDates: DateKey[], editing: boolean): boolean {
  return groups.length > 0 && pickedDates.length === 0 && !editing;
}

// 뒤로 나갈 때 확인 창을 띄울지
export function hasUnsavedChanges(
  saved: AvailabilityGroup[],
  groups: AvailabilityGroup[],
  pickedDates: DateKey[],
): boolean {
  return pickedDates.length > 0 || JSON.stringify(saved) !== JSON.stringify(groups);
}
