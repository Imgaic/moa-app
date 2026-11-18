import { unbreakableText } from './unbreakableText';

const WORD_JOINER = '⁠';

describe('unbreakableText', () => {
  it('글자 사이마다 줄바꿈 금지 문자를 넣는다(띄어쓰기 앞뒤도)', () => {
    expect(unbreakableText('사당역 2')).toBe(['사', '당', '역', ' ', '2'].join(WORD_JOINER));
  });

  it('금지 문자를 빼면 원래 글자와 같다', () => {
    expect(unbreakableText('사당역 2호선').replaceAll(WORD_JOINER, '')).toBe('사당역 2호선');
  });

  it('한 글자와 빈 글자는 그대로', () => {
    expect(unbreakableText('역')).toBe('역');
    expect(unbreakableText('')).toBe('');
  });
});
