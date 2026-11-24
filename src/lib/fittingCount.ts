// 한 줄에 같은 크기의 것을 일정한 간격으로 놓을 때, 주어진 너비에 몇 개가 들어가는지.
// 오늘의 약속 카드와 허브의 멤버 영역이 좁은 화면에서 보이는 얼굴 수를 줄이는 데 쓴다.
// 겹쳐 놓는 줄은 간격을 음수로 준다(20씩 겹치면 gap: -20).

// 화면이 재 준 너비는 소수점 오차가 있어(235.9996), 이만큼 모자란 것은 들어간 것으로 본다.
const TOLERANCE = 0.01;

type Row = {
  width: number;
  size: number;
  gap: number;
  max: number;
};

export function fittingCount({ width, size, gap, max }: Row): number {
  // n개의 너비는 size × n + gap × (n − 1)이다. 양쪽에 gap을 더하면 (size + gap) × n이 된다.
  const count = Math.floor((width + gap + TOLERANCE) / (size + gap));
  return Math.max(0, Math.min(count, max));
}
