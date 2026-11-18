// 로그인한 나의 정보. 화면은 이 파일의 함수만 부른다.
// 로그인과 게스트 인증 방식이 미정이라 지금은 가짜 사용자를 돌려준다.
import { MOCK_ME } from '@/mocks/me';

import type { PlanMember } from './plans';

export async function getMe(): Promise<PlanMember> {
  return MOCK_ME;
}
