// 확정 완료 화면(피그마 09 Confirm / Done)을 보여줄지: 확정된 약속을 처음 열 때만(docs/open-questions.md T5).
// "이미 봤다"는 기록을 어디에 둘지(서버인지 기기인지)는 미정이라, 화면은 api에서 받은 값을 넘긴다.
import type { PlanStatus } from '@/api/plans';

export function shouldShowConfirmedNotice(status: PlanStatus, alreadySeen: boolean): boolean {
  return status === 'confirmed' && !alreadySeen;
}

type Confirmed = { startsAt: string; place: { name: string } };

// 확정 완료 화면에 겹쳐 보일 후보: 확정된 후보가 맨 앞, 나머지는 원래 순서.
// 약속에는 확정된 일시와 장소만 있어서, 그 둘이 같은 후보를 확정된 후보로 본다.
// 같은 후보가 없으면(나중에 생길 "장소 직접 정하기" 확정 등) 후보를 보이지 않는다.
export function confirmedFirst<T extends Confirmed>(candidates: T[], confirmed: Confirmed): T[] {
  const picked = candidates.find(
    (candidate) => candidate.startsAt === confirmed.startsAt && candidate.place.name === confirmed.place.name,
  );
  if (!picked) return [];
  return [picked, ...candidates.filter((candidate) => candidate !== picked)];
}
