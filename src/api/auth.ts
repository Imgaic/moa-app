// 로그인과 온보딩(소셜 로그인 → 약관 동의 → 프로필). 로그인·약관·프로필 화면과 진입 규칙은 이 파일의 함수만 부른다.
// 실제 소셜 로그인 연동과 서버 인증은 정해지지 않아(docs/open-questions.md) src/mocks/me.ts의 가짜 저장소가 처리한다.
import { MOCK_ME, MOCK_RECENT_PROVIDER, mockAuthStage, setMockSession } from '@/mocks/me';
import { updateMockPerson } from '@/mocks/plans';

import type { GuestProfile } from './me';

// signedOut: 아무것도 아님 / guest: 링크로 들어온 익명 게스트 / terms: 소셜 로그인 뒤 약관 동의 전
// profile: 약관 동의 뒤 프로필 전 / member: 온보딩을 마친 회원
export type AuthStage = 'signedOut' | 'guest' | 'terms' | 'profile' | 'member';

// 화면의 SocialButton과 같은 값이다(src/components/ui/SocialLogo.tsx). api가 ui를 가져다 쓰지 않으려고 따로 둔다.
export type SocialProvider = 'kakao' | 'google' | 'naver' | 'apple';

// 프로필 화면에서 넣는 값. 참여 화면의 게스트 프로필과 같은 모양(이름, 기기에서 고른 사진 주소 또는 null)이다.
export type Profile = GuestProfile;

const MOCK_DELAY_MS = 300;

const wait = () => new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

export async function getAuthStage(): Promise<AuthStage> {
  return mockAuthStage();
}

// "최근 로그인" 말풍선을 붙일 버튼. 없으면 null이다.
export async function getRecentSignInProvider(): Promise<SocialProvider | null> {
  return MOCK_RECENT_PROVIDER;
}

// 가짜 로그인은 누구든 늘 처음 가입하는 사람이라 약관부터 시작한다(이미 가입한 사람의 구분은 피그마와 docs에 없다).
// 게스트였다면 게스트는 잊는다(게스트 기록을 계정으로 옮길지는 미정).
export async function signInWithSocial(_provider: SocialProvider): Promise<void> {
  await wait();
  setMockSession('terms', null);
}

// 동의한 약관의 id 목록을 보낸다. 필수를 모두 동의했는지는 화면이 확인하고 부른다.
export async function agreeToTerms(_agreedTermIds: string[]): Promise<void> {
  await wait();
  setMockSession('profile', null);
}

// 온보딩의 마지막. 가짜 구현은 가짜 약속들의 나(m1) 자리에 이 이름과 사진을 넣어, 홈과 허브에 내가 이 모습으로 보이게 한다.
// 사진은 기기 안 주소를 그대로 쓴다(올리는 방법은 미정).
export async function saveProfile(profile: Profile): Promise<void> {
  await wait();
  const me = { id: MOCK_ME.id, name: profile.name, avatarUrl: profile.photoUri };
  updateMockPerson(me);
  setMockSession('member', me);
}
