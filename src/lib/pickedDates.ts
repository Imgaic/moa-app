// 내 입력의 달력에서 날짜를 띄엄띄엄 고르는 규칙과, 고른 날짜가 이어지는 모양.
// 약속 만들기의 범위 고르기(dateRange.ts)와 규칙이 달라 따로 둔다.
import { addDays, type DateKey } from './monthGrid';

// 피그마 Date Cell의 State 중 고른 날의 모양. 이어진 날은 띠(작은 달력)나 테두리(큰 달력)로 잇는다.
export type PickedShape = 'none' | 'single' | 'start' | 'middle' | 'end';

// 호스트가 정한 날짜 범위(양 끝 포함) 안이어야 고를 수 있다.
export function isPickable(key: DateKey, range: { start: DateKey; end: DateKey }): boolean {
  return key >= range.start && key <= range.end;
}

// 고른 날을 누르면 빼고, 아니면 넣는다. 범위 밖은 바꾸지 않는다. 결과는 날짜 순이다.
export function togglePickedDate(
  picked: DateKey[],
  key: DateKey,
  range: { start: DateKey; end: DateKey },
): DateKey[] {
  if (!isPickable(key, range)) return picked;
  if (picked.includes(key)) return picked.filter((date) => date !== key);
  return [...picked, key].sort();
}

// 앞뒤 날짜를 골랐는지로 정한다. 주가 바뀌어도(토요일 → 일요일), 달이 바뀌어도 잇는다.
export function pickedShape(picked: DateKey[], key: DateKey): PickedShape {
  if (!picked.includes(key)) return 'none';
  const before = picked.includes(addDays(key, -1));
  const after = picked.includes(addDays(key, 1));
  if (before && after) return 'middle';
  if (after) return 'start';
  if (before) return 'end';
  return 'single';
}
