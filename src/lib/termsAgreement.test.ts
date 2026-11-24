import type { Term } from '@/constants/terms';

import { isAllRequiredAgreed, termTitle, toggleAllRequired, toggleTerm } from './termsAgreement';

const term = (id: string, required: boolean): Term => ({ id, name: id, required, hasDocument: true });
const TERMS = [term('a', true), term('b', true), term('x', false), term('y', false)];

describe('isAllRequiredAgreed', () => {
  it('필수를 모두 동의해야 참이다(선택은 보지 않는다)', () => {
    expect(isAllRequiredAgreed(TERMS, ['a', 'b'])).toBe(true);
    expect(isAllRequiredAgreed(TERMS, ['a', 'b', 'x'])).toBe(true);
    expect(isAllRequiredAgreed(TERMS, ['a', 'x', 'y'])).toBe(false);
    expect(isAllRequiredAgreed(TERMS, [])).toBe(false);
  });
});

describe('toggleAllRequired', () => {
  it('필수가 하나라도 빠졌으면 필수를 모두 동의한다. 선택은 그대로 둔다', () => {
    expect(toggleAllRequired(TERMS, []).sort()).toEqual(['a', 'b']);
    expect(toggleAllRequired(TERMS, ['a', 'y']).sort()).toEqual(['a', 'b', 'y']);
  });

  it('필수를 모두 동의한 상태면 필수만 모두 푼다. 선택은 그대로 둔다', () => {
    expect(toggleAllRequired(TERMS, ['a', 'b'])).toEqual([]);
    expect(toggleAllRequired(TERMS, ['a', 'b', 'x'])).toEqual(['x']);
  });
});

describe('toggleTerm', () => {
  it('없으면 더하고 있으면 뺀다', () => {
    expect(toggleTerm(['a'], 'x')).toEqual(['a', 'x']);
    expect(toggleTerm(['a', 'x'], 'a')).toEqual(['x']);
  });

  it('필수 하나를 풀면 전체 동의도 풀린다', () => {
    const agreed = toggleTerm(['a', 'b'], 'b');
    expect(isAllRequiredAgreed(TERMS, agreed)).toBe(false);
  });
});

describe('termTitle', () => {
  it('필수와 선택을 앞에 붙인다', () => {
    expect(termTitle({ ...term('a', true), name: '서비스 이용약관' })).toBe('[필수] 서비스 이용약관');
    expect(termTitle({ ...term('x', false), name: '혜택 알림' })).toBe('[선택] 혜택 알림');
  });
});
