import { avatarText } from './avatarText';

describe('avatarText', () => {
  it('세 글자 이름은 뒤 두 글자', () => {
    expect(avatarText('나해진')).toBe('해진');
  });

  it('두 글자 이름은 그대로', () => {
    expect(avatarText('해진')).toBe('해진');
  });

  it('한 글자 이름은 한 글자', () => {
    expect(avatarText('진')).toBe('진');
  });

  it('비어 있거나 공백뿐이면 빈 문자열', () => {
    expect(avatarText('')).toBe('');
    expect(avatarText('   ')).toBe('');
  });

  it('앞뒤 공백은 지운다', () => {
    expect(avatarText(' 나해진 ')).toBe('해진');
  });

  it('이모지를 반으로 자르지 않는다', () => {
    expect(avatarText('해진😀')).toBe('진😀');
  });
});
