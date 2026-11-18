// 글자가 줄 중간에서 끊기지 않게 한다(예: 장소 이름 "사당역 2호선"이 "사당역 2" / "호선"으로 나뉘지 않게).
// 보이지 않는 줄바꿈 금지 문자(U+2060)를 글자 사이마다 넣는다. iOS, Android, 웹의 줄바꿈 규칙이 달라도
// 이 문자 앞뒤에서는 모두 줄을 바꾸지 않는다. 한 줄보다 긴 글자는 플랫폼이 알아서 끊는다.
// 화면에 보일 글자에만 쓴다. 낭독기 이름이나 저장하는 값에는 넣지 않는다.
const WORD_JOINER = '⁠';

export function unbreakableText(text: string): string {
  return Array.from(text).join(WORD_JOINER);
}
