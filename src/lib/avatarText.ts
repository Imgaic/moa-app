// 사진이 없는 아바타에 보여줄 글자: 이름의 뒤 두 글자(아이폰 전화 앱의 연락처처럼).
// 앞뒤 공백은 지운다. 한 글자면 그 한 글자, 비어 있으면 빈 문자열이다.
// 이모지처럼 두 칸을 쓰는 글자가 잘리지 않게 코드 포인트 단위로 자른다.
export function avatarText(name: string): string {
  return Array.from(name.trim()).slice(-2).join('');
}
