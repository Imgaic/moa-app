// 지금 앱을 쓰는 나(로그인한 사람 또는 링크로 들어온 익명 게스트). 화면은 이 파일의 함수만 부른다.
// 로그인과 게스트 인증 방식이 미정이라 지금은 src/mocks/me.ts의 가짜 사용자를 돌려준다.
import { mockCurrentUser, setMockCurrentUser } from '@/mocks/me';

import type { PlanMember } from './plans';

// 익명 게스트가 참여할 때 넣는 프로필. photoUri는 기기에서 고른 사진(없으면 null)이다.
export type GuestProfile = { name: string; photoUri: string | null };

const MOCK_DELAY_MS = 200;

// 로그인했거나 익명으로 들어온 나. 아직 아무것도 아니면 null이다.
export async function getSignedInMe(): Promise<PlanMember | null> {
  return mockCurrentUser();
}

// 나를 알아야 하는 화면(허브, 내 입력, 약속 만들기)이 부른다. 로그인 전이면 실패한다.
export async function getMe(): Promise<PlanMember> {
  const me = await getSignedInMe();
  if (!me) throw new Error('로그인하지 않았다');
  return me;
}

// 가입 없이 이름(과 사진)만으로 익명 게스트가 된다. 이후 getMe가 이 사람을 돌려준다.
// 실제 구현(익명 로그인, 사진 올리기, 다시 왔을 때 알아보기)은 게스트 인증과 함께 미정이다.
// 가짜 구현은 앱이 켜져 있는 동안만 기억하고, 사진은 기기 안 주소를 그대로 쓴다.
export async function signInAsGuest(profile: GuestProfile): Promise<PlanMember> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
  const guest: PlanMember = { id: `guest-${Date.now()}`, name: profile.name, avatarUrl: profile.photoUri };
  setMockCurrentUser(guest);
  return guest;
}
