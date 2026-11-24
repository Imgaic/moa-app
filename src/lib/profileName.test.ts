import { isNameValid, NAME_MAX_LENGTH } from './profileName';

describe('isNameValid', () => {
  it('앞뒤 공백을 뺀 2~10자', () => {
    expect(isNameValid('예희')).toBe(true);
    expect(isNameValid('성예희')).toBe(true);
    expect(isNameValid('열글자짜리이름입니다')).toBe(true);
    expect(isNameValid('  성예희  ')).toBe(true);
  });

  it('한 글자, 공백뿐, 빈 칸은 안 된다', () => {
    expect(isNameValid('희')).toBe(false);
    expect(isNameValid('  희  ')).toBe(false);
    expect(isNameValid('   ')).toBe(false);
    expect(isNameValid('')).toBe(false);
  });

  it('10자를 넘으면 안 된다', () => {
    expect(isNameValid('열한글자짜리이름입니다')).toBe(false);
    expect(NAME_MAX_LENGTH).toBe(10);
  });
});
