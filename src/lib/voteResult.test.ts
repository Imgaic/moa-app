import { pickConfirmedCandidate } from './voteResult';

const candidate = (id: string, voterIds: string[]) => ({ id, voterIds });

describe('pickConfirmedCandidate (임시 규칙 T2)', () => {
  it('가장 많은 표를 받은 후보', () => {
    const picked = pickConfirmedCandidate([
      candidate('c1', ['m1']),
      candidate('c2', ['m2', 'm3']),
      candidate('c3', []),
    ]);
    expect(picked?.id).toBe('c2');
  });

  it('동률이면 목록에서 앞에 있는 후보', () => {
    const picked = pickConfirmedCandidate([
      candidate('c1', ['m1']),
      candidate('c2', ['m2', 'm3']),
      candidate('c3', ['m4', 'm5']),
    ]);
    expect(picked?.id).toBe('c2');
  });

  it('아무도 투표하지 않았으면 맨 앞 후보', () => {
    expect(pickConfirmedCandidate([candidate('c1', []), candidate('c2', [])])?.id).toBe('c1');
  });

  it('후보가 없으면 null', () => {
    expect(pickConfirmedCandidate([])).toBeNull();
  });
});
