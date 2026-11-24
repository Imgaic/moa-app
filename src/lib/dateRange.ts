// 달력에서 날짜 범위(시작일 ~ 종료일)를 고르는 규칙과, 각 날짜 칸이 어떻게 보일지.
import type { CalendarDay, DateKey } from './monthGrid';

export type DateRange = { start: DateKey | null; end: DateKey | null };

export const EMPTY_RANGE: DateRange = { start: null, end: null };

// 피그마 Date Cell/Range의 State. single은 피그마에 없다: 시작일만 골랐거나 하루짜리 범위일 때 띠 없이 원만 그린다.
export type DayCellState = 'default' | 'disabled' | 'start' | 'end' | 'inRange' | 'single';

// 날짜 하나를 눌렀을 때의 새 범위
// - 비어 있거나 시작과 끝이 다 있으면: 누른 날부터 다시 고른다
// - 시작일만 있으면: 같거나 뒤의 날은 종료일, 앞의 날은 새 시작일
export function pickRangeDate(range: DateRange, key: DateKey): DateRange {
  if (range.start === null || range.end !== null || key < range.start) {
    return { start: key, end: null };
  }
  return { start: range.start, end: key };
}

// 오늘보다 앞의 날과 보이는 달 밖의 날은 고를 수 없다(disabled).
export function dayCellState(
  range: DateRange,
  day: Pick<CalendarDay, 'key' | 'inMonth'>,
  today: DateKey,
): DayCellState {
  const { key } = day;
  if (!day.inMonth || key < today) return 'disabled';
  if (range.start === null) return 'default';

  const end = range.end ?? range.start;
  if (key === range.start && key === end) return 'single';
  if (key === range.start) return 'start';
  if (key === end) return 'end';
  if (key > range.start && key < end) return 'inRange';
  return 'default';
}
