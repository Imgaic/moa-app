// 투표 마감 때 확정할 후보를 고른다.
// 임시 규칙(docs/open-questions.md T2): 마감 시점에 가장 많은 표를 받은 후보.
// 동률이면 목록에서 앞에 있는 후보다. 목록은 서버가 정한 순서(추천 순위, 그 뒤에 제안)라 순위가 높은 쪽이 이긴다.
// 규칙이 바뀌면 이 함수와 테스트만 고친다. 가짜 저장소의 투표 마감도 이 함수를 쓴다.
import type { Candidate } from '@/api/candidates';

export function pickConfirmedCandidate<T extends Pick<Candidate, 'voterIds'>>(candidates: T[]): T | null {
  let picked: T | null = null;
  for (const candidate of candidates) {
    // 앞의 후보와 같은 표 수면 바꾸지 않아서 앞 후보가 남는다.
    if (picked === null || candidate.voterIds.length > picked.voterIds.length) picked = candidate;
  }
  return picked;
}
