// 시간 막대에서 누른 곳으로 무엇을 끌지(시작 손잡이, 종료 손잡이, 축) 정하고, 손잡이를 끈 뒤의 시작·종료를 계산한다.
// 한 손가락 동작은 누르는 순간 하나로 정해지고 손을 뗄 때까지 바뀌지 않는다. 그래서 손잡이 끌기와 축 끌기가 다투지 않는다.
import { DAY_MINUTES } from './timeBarWindow';

// 고를 수 있는 가장 짧은 시간
export const MIN_DURATION_MINUTES = 30;
// 종료는 오후 11:55까지다. 자정(24:00)은 시각 글자와 휠이 다루지 않는다(자정을 넘는 시간은 받지 않는다).
const FINEST_STEP_MINUTES = 5;
export const LAST_MINUTE = DAY_MINUTES - FINEST_STEP_MINUTES;

export type DragTarget = 'start' | 'end' | 'axis';
export type TimeRange = { start: number; end: number };

// 손잡이 중심에서 hitRadius 안을 누르면 그 손잡이를 잡는다. 창 밖(0~width 밖)에 있어 그리지 않은 손잡이는 잡지 않는다.
// 두 손잡이가 겹치면 시작 손잡이 왼쪽은 시작, 나머지는 종료다(겹친 채로 둘 다 움직일 수 있게).
export function dragTargetAt(
  x: number,
  handles: { startX: number; endX: number },
  width: number,
  hitRadius: number,
): DragTarget {
  const distanceTo = (handleX: number) =>
    handleX >= 0 && handleX <= width ? Math.abs(x - handleX) : Number.POSITIVE_INFINITY;
  const toStart = distanceTo(handles.startX);
  const toEnd = distanceTo(handles.endX);
  if (Math.min(toStart, toEnd) > hitRadius) return 'axis';
  if (toStart === toEnd) return x < handles.startX ? 'start' : 'end';
  return toStart < toEnd ? 'start' : 'end';
}

// 끈 손잡이의 새 시각을 스냅 단위에 붙인다. 시작과 종료 사이는 최소 길이를 지키고, 하루 밖으로 나가지 않는다.
export function dragHandle(range: TimeRange, edge: 'start' | 'end', minutes: number, step: number): TimeRange {
  const snapped = Math.round(minutes / step) * step;
  if (edge === 'start') {
    const latest = Math.floor((range.end - MIN_DURATION_MINUTES) / step) * step;
    return { start: Math.max(0, Math.min(snapped, latest)), end: range.end };
  }
  const earliest = Math.ceil((range.start + MIN_DURATION_MINUTES) / step) * step;
  const last = Math.floor(LAST_MINUTE / step) * step;
  return { start: range.start, end: Math.min(LAST_MINUTE, Math.max(earliest, Math.min(snapped, last))) };
}
