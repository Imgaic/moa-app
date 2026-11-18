// 약관 동의 규칙. 동의한 항목은 id 목록으로 들고 다닌다.
// 피그마 Terms - Checked(2026-11-18 기준)에서 "[필수] 전체 동의하기"는 필수 네 개만 동의하고 선택은 비운 상태에서 켜져 있다.
// 그래서 전체 동의는 "필수 전체"로 읽었다: 누르면 필수만 모두 켜거나 끄고, 선택은 건드리지 않는다.
// 전체 동의 체크와 "동의하고 시작하기" 버튼은 둘 다 isAllRequiredAgreed를 따른다(필수 하나를 풀면 둘 다 꺼진다).
import type { Term } from '@/constants/terms';

export function isAllRequiredAgreed(terms: Term[], agreed: readonly string[]): boolean {
  return terms.filter((term) => term.required).every((term) => agreed.includes(term.id));
}

export function toggleAllRequired(terms: Term[], agreed: readonly string[]): string[] {
  const requiredIds = terms.filter((term) => term.required).map((term) => term.id);
  const others = agreed.filter((id) => !requiredIds.includes(id));
  return isAllRequiredAgreed(terms, agreed) ? others : [...others, ...requiredIds];
}

export function toggleTerm(agreed: readonly string[], id: string): string[] {
  return agreed.includes(id) ? agreed.filter((current) => current !== id) : [...agreed, id];
}

export function termTitle(term: Term): string {
  return `[${term.required ? '필수' : '선택'}] ${term.name}`;
}
