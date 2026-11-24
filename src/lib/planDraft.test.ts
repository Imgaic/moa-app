import {
  EMPTY_DRAFT,
  isStepComplete,
  isTitleValid,
  nextStep,
  previousStep,
  summaryOf,
  toNewPlan,
  type PlanDraft,
} from './planDraft';

const place = { id: 'place-1', name: '마찌마찌중앙대점', address: '경기 안성시 대덕면 대학9길 12' };
const filled: PlanDraft = {
  title: '저녁 모임',
  durationMinutes: 120,
  dateRange: { start: '2026-04-01', end: '2026-04-30' },
  placeMode: 'recommend',
  fixedPlace: null,
};

describe('isTitleValid', () => {
  it('앞뒤 공백을 뺀 2~10자', () => {
    expect(isTitleValid('저녁')).toBe(true);
    expect(isTitleValid('열글자짜리약속이름임')).toBe(true);
    expect(isTitleValid('저')).toBe(false);
    expect(isTitleValid('  저  ')).toBe(false);
    expect(isTitleValid('')).toBe(false);
  });
});

describe('toNewPlan', () => {
  it('다 채웠으면 보낼 값을 만든다. 이름의 앞뒤 공백은 지운다', () => {
    expect(toNewPlan({ ...filled, title: ' 저녁 모임 ' })).toEqual({
      title: '저녁 모임',
      durationMinutes: 120,
      dateRange: { start: '2026-04-01', end: '2026-04-30' },
      placeMode: 'recommend',
      fixedPlace: null,
    });
  });

  it('추천받기면 골라 두었던 장소는 보내지 않는다', () => {
    expect(toNewPlan({ ...filled, fixedPlace: place })?.fixedPlace).toBeNull();
  });

  it('정해져 있음이면 장소가 있어야 한다', () => {
    expect(toNewPlan({ ...filled, placeMode: 'fixed' })).toBeNull();
    expect(toNewPlan({ ...filled, placeMode: 'fixed', fixedPlace: place })?.fixedPlace).toEqual(place);
  });

  it('빠진 값이 있으면 null', () => {
    expect(toNewPlan(EMPTY_DRAFT)).toBeNull();
    expect(toNewPlan({ ...filled, dateRange: { start: '2026-04-01', end: null } })).toBeNull();
    expect(toNewPlan({ ...filled, placeMode: null })).toBeNull();
  });
});

describe('단계', () => {
  it('이름 → 시간 길이 → 날짜 범위 → 장소 → 공유 순서로 간다', () => {
    expect(nextStep('name')).toBe('duration');
    expect(nextStep('duration')).toBe('dateRange');
    expect(nextStep('dateRange')).toBe('place');
    expect(nextStep('place')).toBe('share');
  });

  it('뒤로 가면 앞 단계로, 장소 찾기에서는 장소로, 이름에서는 나간다(null)', () => {
    expect(previousStep('share')).toBe('place');
    expect(previousStep('placeSearch')).toBe('place');
    expect(previousStep('duration')).toBe('name');
    expect(previousStep('name')).toBeNull();
  });

  it('단계마다 다음으로 갈 수 있는 조건', () => {
    expect(isStepComplete('name', EMPTY_DRAFT)).toBe(false);
    expect(isStepComplete('name', filled)).toBe(true);
    expect(isStepComplete('duration', EMPTY_DRAFT)).toBe(true);
    expect(isStepComplete('dateRange', { ...filled, dateRange: { start: '2026-04-01', end: null } })).toBe(false);
    expect(isStepComplete('dateRange', filled)).toBe(true);
    expect(isStepComplete('place', { ...filled, placeMode: 'fixed' })).toBe(false);
    expect(isStepComplete('place', filled)).toBe(true);
  });
});

describe('summaryOf', () => {
  it('지금 단계보다 앞에서 답한 값만 요약에 보인다', () => {
    expect(summaryOf('name', filled)).toEqual({});
    expect(summaryOf('duration', filled)).toEqual({ title: '저녁 모임' });
    expect(summaryOf('dateRange', filled)).toEqual({ title: '저녁 모임', durationMinutes: 120 });
    expect(summaryOf('place', filled)).toEqual({
      title: '저녁 모임',
      durationMinutes: 120,
      dateRange: { start: '2026-04-01', end: '2026-04-30' },
    });
  });

  it('장소 찾기와 공유에서는 요약 줄을 보이지 않는다', () => {
    expect(summaryOf('placeSearch', filled)).toEqual({});
    expect(summaryOf('share', filled)).toEqual({});
  });
});
