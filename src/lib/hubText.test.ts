import { conditionText, progressText, proposedByText } from './hubText';

const place = { id: 'place-3', name: '사당역 2호선', address: '서울 동작구' };

describe('conditionText', () => {
  it('날짜 범위 · 시간 길이 · 장소 추천받기', () => {
    expect(
      conditionText({
        dateRange: { start: '2026-04-01', end: '2026-04-30' },
        durationMinutes: 120,
        placeMode: 'recommend',
        fixedPlace: null,
      }),
    ).toBe('4월 1일 ~ 30일 · 2시간 · 장소 추천받기');
  });

  it('장소가 정해져 있으면 장소 이름', () => {
    expect(
      conditionText({
        dateRange: { start: '2026-04-01', end: '2026-04-30' },
        durationMinutes: 90,
        placeMode: 'fixed',
        fixedPlace: place,
      }),
    ).toBe('4월 1일 ~ 30일 · 1시간 30분 · 사당역 2호선');
  });

  it('달이나 해가 바뀌면 끝 날짜에도 달을 쓴다', () => {
    const text = (start: string, end: string) =>
      conditionText({ dateRange: { start, end }, durationMinutes: 60, placeMode: 'recommend', fixedPlace: null });
    expect(text('2026-04-28', '2026-05-03')).toBe('4월 28일 ~ 5월 3일 · 1시간 · 장소 추천받기');
    expect(text('2026-12-28', '2027-12-03')).toBe('12월 28일 ~ 12월 3일 · 1시간 · 장소 추천받기');
  });

  it('하루짜리 범위는 날짜 하나', () => {
    expect(
      conditionText({
        dateRange: { start: '2026-04-10', end: '2026-04-10' },
        durationMinutes: 30,
        placeMode: 'recommend',
        fixedPlace: null,
      }),
    ).toBe('4월 10일 · 30분 · 장소 추천받기');
  });
});

describe('progressText', () => {
  it('입력한 사람 수 / 전체 인원', () => {
    expect(progressText([{ submitted: true }, { submitted: false }, { submitted: true }])).toBe('2/3명');
    expect(progressText([{ submitted: false }])).toBe('0/1명');
  });
});

describe('proposedByText', () => {
  const members = [
    { id: 'm1', name: '나해진' },
    { id: 'm2', name: '김태혁' },
  ];

  it('제안한 사람 이름의 뒤 두 글자', () => {
    expect(proposedByText('m2', members)).toBe('태혁 제안');
    expect(proposedByText('m1', members)).toBe('해진 제안');
  });

  it('멤버 목록에 없는 사람이면 빈 글자', () => {
    expect(proposedByText('m9', members)).toBe('');
  });
});
