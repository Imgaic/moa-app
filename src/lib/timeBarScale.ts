// 시간 막대의 창 안에서 시각 ↔ 가로 위치를 바꾸고, 창 폭에 맞는 스냅 단위와 눈금을 정한다.
// 위치(x)는 손잡이 중심이 다닐 수 있는 폭(width) 안에서 센다. 창 왼쪽 끝이 0, 오른쪽 끝이 width다.
import { windowSpan, type TimeWindow } from './timeBarWindow';

const HOUR = 60;

// 창이 넓을수록 손잡이가 붙는 단위가 굵어진다. [이 폭 이상이면, 이 단위]를 넓은 것부터.
const SNAP_STEPS: [minSpan: number, step: number][] = [
  [8 * HOUR, 30],
  [4 * HOUR, 10],
  [0, 5],
];

// 눈금 간격 후보. 눈금 사이가 MIN_TICK_SPACING 이상 벌어지는 가장 촘촘한 간격을 쓴다.
const TICK_STEPS = [30, HOUR, 2 * HOUR, 4 * HOUR, 6 * HOUR];
// 눈금 글자 폭(38) + 여유. 이보다 가까우면 글자가 붙어 읽기 어렵다.
const MIN_TICK_SPACING = 44;

export function xOfMinutes(minutes: number, window: TimeWindow, width: number): number {
  return ((minutes - window.start) / windowSpan(window)) * width;
}

// 폭 밖의 위치는 창 끝 시각이 된다(손가락이 막대 밖으로 나가도 손잡이는 끝에 머문다).
export function minutesAtX(x: number, window: TimeWindow, width: number): number {
  const clampedX = Math.min(width, Math.max(0, x));
  return window.start + (clampedX / width) * windowSpan(window);
}

export const snapStepOf = (span: number) => (SNAP_STEPS.find(([minSpan]) => span >= minSpan) ?? SNAP_STEPS[SNAP_STEPS.length - 1])[1];

// 창 안의 눈금 시각. 창 끝에서 edgeMargin(위치 단위) 안쪽에 있는 눈금만 준다(글자가 막대 밖으로 넘치지 않게).
export function tickMinutes(window: TimeWindow, width: number, edgeMargin: number): number[] {
  const span = windowSpan(window);
  const step = TICK_STEPS.find((candidate) => (candidate / span) * width >= MIN_TICK_SPACING) ?? TICK_STEPS[TICK_STEPS.length - 1];
  const marginMinutes = (edgeMargin / width) * span;
  const first = Math.ceil((window.start + marginMinutes) / step) * step;
  const ticks: number[] = [];
  for (let minutes = first; minutes <= window.end - marginMinutes; minutes += step) ticks.push(minutes);
  return ticks;
}

// 600 → "10:00". 피그마 눈금처럼 24시간제다.
export function tickText(minutes: number): string {
  return `${Math.floor(minutes / HOUR)}:${String(minutes % HOUR).padStart(2, '0')}`;
}
