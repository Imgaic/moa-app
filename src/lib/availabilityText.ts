// 내 입력에 보이는 글자: 고른 날짜 요약("4월 1일 · 10일 · 22~27일"), 가능한 길이("6시간 가능").
import { addDays, type DateKey } from './monthGrid';
import { durationText } from './planCreateText';

const SEPARATOR = ' · ';

type Run = { first: DateKey; last: DateKey };

// 이어진 날짜는 범위로 묶는다. 달은 바뀔 때만 쓴다: "4월 1일 · 10일 · 22~27일", "4월 30일~5월 1일 · 7일".
export function datesSummaryText(dates: DateKey[]): string {
  let currentMonth = 0;
  const monthAware = (key: DateKey) => {
    const [, month, day] = key.split('-').map(Number);
    const text = month === currentMonth ? `${day}일` : `${month}월 ${day}일`;
    currentMonth = month;
    return text;
  };

  return runsOf(dates)
    .map(({ first, last }) => {
      if (first === last) return monthAware(first);
      const firstText = monthAware(first);
      const lastText = monthAware(last);
      // 같은 달 범위는 앞의 "일"을 뺀다: "22일~27일" → "22~27일"
      return lastText.includes('월') ? `${firstText}~${lastText}` : `${firstText.slice(0, -1)}~${lastText}`;
    })
    .join(SEPARATOR);
}

function runsOf(dates: DateKey[]): Run[] {
  const runs: Run[] = [];
  for (const key of [...dates].sort()) {
    const last = runs[runs.length - 1];
    if (last && addDays(last.last, 1) === key) last.last = key;
    else runs.push({ first: key, last: key });
  }
  return runs;
}

// 600, 960 → "6시간 가능". 종료가 시작보다 늦지 않으면 빈 글자다(자정을 넘는 시간은 받지 않는다).
export function availableHoursText(startMinutes: number, endMinutes: number): string {
  if (endMinutes <= startMinutes) return '';
  return `${durationText(endMinutes - startMinutes)} 가능`;
}
