// 참여 화면에 보이는 글자와 얼굴 순서: 제목("OO님이 약속에 초대했어요"), 초대 카드의 겹친 얼굴.
import type { PlanMember } from '@/api/plans';

// 피그마 Card/Invite의 얼굴 수
const MAX_FACES = 3;

// 피그마처럼 "약속에" 뒤에서 줄을 바꾼다.
export function invitedTitle(hostName: string): string {
  return `${hostName}님이 약속에\n초대했어요`;
}

// 호스트를 맨 앞에, 나머지는 멤버 순서대로 최대 3명
export function inviteFaces<T extends Pick<PlanMember, 'id'>>(members: T[], hostId: string): T[] {
  const host = members.filter((member) => member.id === hostId);
  const others = members.filter((member) => member.id !== hostId);
  return [...host, ...others].slice(0, MAX_FACES);
}
