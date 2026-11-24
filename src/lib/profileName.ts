// 프로필 이름 규칙. 피그마 Input/Text의 안내 "2~10자로 입력해 주세요."를 따른다.
export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 10;

// 앞뒤 공백을 뺀 길이로 센다.
export function isNameValid(name: string): boolean {
  const length = name.trim().length;
  return length >= NAME_MIN_LENGTH && length <= NAME_MAX_LENGTH;
}
