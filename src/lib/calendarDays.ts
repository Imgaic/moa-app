// 두 시각 사이의 달력 날짜 차이(기기 시간대 기준). 오늘 = 0, 내일 = 1.
// 시각 차이가 아니라 날짜로 센다: 오늘 23시에서 내일 0시 5분도 1이다.
const DAY_MS = 24 * 60 * 60 * 1000;

export function calendarDaysBetween(from: Date, to: Date): number {
  // 자정끼리의 차이를 반올림해 서머타임처럼 하루가 23·25시간인 날도 하루로 센다.
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const b = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((b.getTime() - a.getTime()) / DAY_MS);
}
