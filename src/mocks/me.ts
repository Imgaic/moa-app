// 백엔드가 나오기 전까지 쓰는 "지금 앱을 쓰는 나". src/api/만 이 파일을 쓴다.
// 로그인과 게스트 인증 방식이 미정이라(docs/open-questions.md), 앱이 켜져 있는 동안만 기억한다.
import type { PlanMember } from '@/api/plans';

// 개발 중 로그인하지 않은 사람(링크로 처음 온 게스트)의 화면을 보려면 false로 바꾼다.
// false면 앱을 켰을 때 "나"가 없고, 참여 화면에서 이름을 넣고 익명으로 들어오면 그 사람이 "나"가 된다.
export const MOCK_SIGNED_IN = true;

// 로그인한 나. 가짜 약속들의 멤버(m1)이기도 하다.
export const MOCK_ME: PlanMember = { id: 'm1', name: '나해진', avatarUrl: null };

let current: PlanMember | null = MOCK_SIGNED_IN ? MOCK_ME : null;

export function mockCurrentUser(): PlanMember | null {
  return current;
}

export function setMockCurrentUser(member: PlanMember) {
  current = member;
}
