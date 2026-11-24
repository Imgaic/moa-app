import { availableHoursText, datesSummaryText } from './availabilityText';

describe('datesSummaryText', () => {
  it('피그마 예시: 4월 1일 · 10일 · 22~27일', () => {
    const dates = ['2026-04-01', '2026-04-10', '2026-04-22', '2026-04-23', '2026-04-24', '2026-04-25', '2026-04-26', '2026-04-27'];
    expect(datesSummaryText(dates)).toBe('4월 1일 · 10일 · 22~27일');
  });

  it('순서가 섞여 있어도 날짜 순으로 쓴다', () => {
    expect(datesSummaryText(['2026-04-10', '2026-04-01'])).toBe('4월 1일 · 10일');
  });

  it('달이 바뀌면 달을 다시 쓴다', () => {
    expect(datesSummaryText(['2026-04-29', '2026-05-03', '2026-05-04'])).toBe('4월 29일 · 5월 3~4일');
  });

  it('달을 넘어 이어지면 끝에도 달을 쓰고, 그 뒤는 끝의 달 기준이다', () => {
    expect(datesSummaryText(['2026-04-30', '2026-05-01', '2026-05-07'])).toBe('4월 30일~5월 1일 · 7일');
  });

  it('하루, 빈 목록', () => {
    expect(datesSummaryText(['2026-04-01'])).toBe('4월 1일');
    expect(datesSummaryText([])).toBe('');
  });
});

describe('availableHoursText', () => {
  it('시작부터 종료까지의 길이', () => {
    expect(availableHoursText(600, 960)).toBe('6시간 가능');
    expect(availableHoursText(600, 690)).toBe('1시간 30분 가능');
    expect(availableHoursText(600, 630)).toBe('30분 가능');
  });

  it('종료가 시작보다 늦지 않으면 빈 글자', () => {
    expect(availableHoursText(600, 600)).toBe('');
    expect(availableHoursText(960, 600)).toBe('');
  });
});
