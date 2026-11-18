// 시간 막대의 "창"(지금 보이는 구간)을 정하고 옮긴다. 실제 축은 하루 전체(0시~24시)이고 창은 그 일부다.
// 처음 창, 두 손가락 확대·축소, 축 끌기, 손잡이가 끝에 닿았을 때 밀기, 창 밖으로 나간 시각 따라가기. 어느 경우에도 창은 하루를 벗어나지 않는다.
// 시각은 자정부터 센 분이다. 창의 끝은 분 단위로 떨어지지 않아도 된다(손가락을 따라 부드럽게 움직이게).
const HOUR = 60;
export const DAY_MINUTES = 24 * HOUR;
// 가장 좁은 창. 이보다 좁으면 5분 단위 눈금이 너무 벌어져 쓸모가 없다.
export const MIN_WINDOW_MINUTES = 2 * HOUR;
// 피그마 Input/Time Bar는 10:00~18:00 눈금이 보이는 약 10시간 폭이다.
const DEFAULT_WINDOW_MINUTES = 10 * HOUR;
// 고른 시간이 길 때 창 양 끝에 두는 여유
const INITIAL_MARGIN_MINUTES = HOUR;
// 손가락이 끝 띠의 맨 끝에 있을 때 1초에 창 폭의 몇 배를 미는지
const EDGE_PUSH_WINDOWS_PER_SECOND = 0.5;
const MS_PER_SECOND = 1000;

export type TimeWindow = { start: number; end: number };

export const windowSpan = (window: TimeWindow) => window.end - window.start;

// 폭을 가장 좁은 창과 하루 사이로 줄이고, 하루 밖으로 나가면 안쪽으로 민다.
export function clampWindow(start: number, span: number): TimeWindow {
  const clampedSpan = clamp(span, MIN_WINDOW_MINUTES, DAY_MINUTES);
  const clampedStart = clamp(start, 0, DAY_MINUTES - clampedSpan);
  return { start: clampedStart, end: clampedStart + clampedSpan };
}

// 고른 시간이 가운데 오는 정시 시작 창. 고른 시간이 길면 앞뒤 여유를 두고 넓힌다.
export function initialWindow(startMinutes: number, endMinutes: number): TimeWindow {
  const needed = Math.ceil((endMinutes - startMinutes + 2 * INITIAL_MARGIN_MINUTES) / HOUR) * HOUR;
  const span = Math.max(DEFAULT_WINDOW_MINUTES, needed);
  const center = (startMinutes + endMinutes) / 2;
  return clampWindow(Math.round((center - span / 2) / HOUR) * HOUR, span);
}

// anchorRatio는 손가락이 놓인 곳(창 왼쪽 0 ~ 오른쪽 1). 그 아래 시각이 자리를 지키도록 늘이거나 줄인다.
// scale은 두 손가락 사이가 처음보다 몇 배인지다(벌리면 1보다 크다 → 창이 좁아진다).
export function zoomWindow(window: TimeWindow, anchorRatio: number, scale: number): TimeWindow {
  const anchor = window.start + anchorRatio * windowSpan(window);
  const span = clamp(windowSpan(window) / scale, MIN_WINDOW_MINUTES, DAY_MINUTES);
  return clampWindow(anchor - anchorRatio * span, span);
}

export function panWindow(window: TimeWindow, deltaMinutes: number): TimeWindow {
  return clampWindow(window.start + deltaMinutes, windowSpan(window));
}

// 손가락 없이 시각이 바뀌었을 때(화면 낭독기의 올리기·내리기) 그 시각이 창 밖이면 창 끝에 오도록 옮긴다.
export function revealMinutes(window: TimeWindow, minutes: number): TimeWindow {
  if (minutes < window.start) return panWindow(window, minutes - window.start);
  if (minutes > window.end) return panWindow(window, minutes - window.end);
  return window;
}

// 손가락이 창 양 끝의 띠(edgeZone, 화면 점) 안에 있으면 들어간 깊이에 비례해 창을 민다.
// 지난 시간(elapsedMs) 동안 옮길 분을 돌려준다. 오른쪽이 +, 왼쪽이 -.
export function edgePushMinutes(
  fingerX: number,
  width: number,
  edgeZone: number,
  span: number,
  elapsedMs: number,
): number {
  let depth = 0;
  if (fingerX < edgeZone) depth = (fingerX - edgeZone) / edgeZone;
  else if (fingerX > width - edgeZone) depth = (fingerX - (width - edgeZone)) / edgeZone;
  const speed = clamp(depth, -1, 1) * span * EDGE_PUSH_WINDOWS_PER_SECOND;
  return (speed * elapsedMs) / MS_PER_SECOND;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
