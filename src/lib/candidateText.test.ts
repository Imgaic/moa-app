import type { Candidate } from '@/api/candidates';

import { candidateCardText, dateTimeText } from './candidateText';

const members = [
  { id: 'm1', name: '나해진' },
  { id: 'm2', name: '김태혁' },
  { id: 'm3', name: '성예희' },
  { id: 'm4', name: '대동하' },
];
const everyone = members.map((member) => member.id);
const place = (name: string) => ({ id: name, name, address: '' });

// 2026-04-01은 수요일. 기기 시간대 기준으로 만든다.
const at = (day: number, hour: number, minute: number) => new Date(2026, 3, day, hour, minute).toISOString();

const candidate = (overrides: Partial<Candidate>): Candidate => ({
  id: 'c1',
  startsAt: at(1, 19, 0),
  place: place('사당역'),
  source: 'recommended',
  proposedBy: null,
  attendeeIds: everyone,
  voterIds: [],
  avgMinutes: 38,
  maxMinutes: 42,
  ...overrides,
});

describe('candidateCardText', () => {
  const first = candidate({ id: 'c1' });
  const second = candidate({
    id: 'c2',
    startsAt: at(22, 14, 0),
    place: place('강남역'),
    attendeeIds: ['m1', 'm2', 'm3'],
  });
  const proposed = candidate({ id: 'c3', source: 'proposed', proposedBy: 'm2', attendeeIds: ['m1', 'm2'] });
  const candidates = [first, second, proposed];

  it('첫 추천 후보: 검은 배지 "추천 1", 날짜·시각·장소, 모두 참석', () => {
    expect(candidateCardText(first, candidates, members)).toEqual({
      badge: '추천 1',
      best: true,
      title: '4월 1일 (수) 오후 7:00 사당역',
      attendance: '4명 모두',
      everyone: true,
      detail: '· 평균 38분 · 최대 42분',
    });
  });

  it('두 번째 추천 후보: 빠지는 사람 이름', () => {
    const text = candidateCardText(second, candidates, members);
    expect(text.badge).toBe('추천 2');
    expect(text.best).toBe(false);
    expect(text.title).toBe('4월 22일 (수) 오후 2:00 강남역');
    expect(text.attendance).toBe('3명 가능 · 동하 제외');
    expect(text.everyone).toBe(false);
  });

  it('제안된 장소의 후보: 제안한 사람, 빠지는 사람이 여럿', () => {
    const text = candidateCardText(proposed, candidates, members);
    expect(text.badge).toBe('태혁 제안');
    expect(text.best).toBe(false);
    expect(text.attendance).toBe('2명 가능 · 예희, 동하 제외');
  });

  it('이동시간이 한 시간을 넘으면 시간과 분', () => {
    const far = candidate({ avgMinutes: 50, maxMinutes: 75 });
    expect(candidateCardText(far, [far], members).detail).toBe('· 평균 50분 · 최대 1시간 15분');
  });
});

describe('dateTimeText', () => {
  it('날짜 (요일) 오전·오후 시각', () => {
    expect(dateTimeText(new Date(2026, 3, 25, 9, 5))).toBe('4월 25일 (토) 오전 9:05');
  });
});
