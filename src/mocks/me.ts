// 백엔드가 나오기 전까지 쓰는 "지금 앱을 쓰는 나"와 로그인 단계. src/api/만 이 파일을 쓴다.
// 로그인과 게스트 인증 방식이 미정이라(docs/open-questions.md), 앱이 켜져 있는 동안만 기억한다.
import type { AuthStage, SocialProvider } from '@/api/auth';
import type { PlanMember } from '@/api/plans';

// 개발 중 처음 켠 상태(로그인 화면부터)나 링크로 처음 온 게스트의 화면을 보려면 false로 바꾼다.
// false면 앱을 켰을 때 "나"가 없다. 로그인 → 약관 → 프로필을 마치면 MOCK_ME 자리(m1)에 내가 넣은 이름과 사진이 들어간다.
// 바꾼 뒤에는 앱을 다시 켜야 반영된다(웹은 새로 고침).
export const MOCK_SIGNED_IN = true;

// 로그인한 나. 가짜 약속들의 멤버(m1)이기도 하다.
export const MOCK_ME: PlanMember = { id: 'm1', name: '나해진', avatarUrl: null };

// 로그인 화면의 "최근 로그인" 말풍선이 붙는 버튼. 무엇을 기준으로 정하는지 미정이라 고정값이다.
export const MOCK_RECENT_PROVIDER: SocialProvider = 'kakao';

let stage: AuthStage = MOCK_SIGNED_IN ? 'member' : 'signedOut';
let current: PlanMember | null = MOCK_SIGNED_IN ? MOCK_ME : null;

export function mockCurrentUser(): PlanMember | null {
  return current;
}

export function mockAuthStage(): AuthStage {
  return stage;
}

// 단계와 "나"를 함께 바꾼다. 약관과 프로필을 마치기 전처럼 "나"가 아직 없으면 null이다.
export function setMockSession(nextStage: AuthStage, member: PlanMember | null) {
  stage = nextStage;
  current = member;
}
