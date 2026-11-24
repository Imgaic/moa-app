import { myVoteOf, voteActionOf, votedMembers } from './voteStatus';

const candidates = [
  { id: 'c1', voterIds: ['m2'] },
  { id: 'c2', voterIds: ['m1', 'm3'] },
];

describe('myVoteOf', () => {
  it('내가 투표한 후보의 id', () => {
    expect(myVoteOf(candidates, 'm1')).toBe('c2');
    expect(myVoteOf(candidates, 'm2')).toBe('c1');
  });

  it('투표하지 않았으면 null', () => {
    expect(myVoteOf(candidates, 'm4')).toBeNull();
  });
});

describe('votedMembers', () => {
  it('어느 후보에든 투표한 사람이 checked', () => {
    const members = [
      { id: 'm1', name: '나해진' },
      { id: 'm4', name: '김민수' },
    ];
    expect(votedMembers(members, candidates)).toEqual([
      { id: 'm1', name: '나해진', checked: true },
      { id: 'm4', name: '김민수', checked: false },
    ]);
  });
});

describe('voteActionOf', () => {
  it('투표 전에는 고른 후보가 있어야 투표하기를 누를 수 있다', () => {
    expect(voteActionOf({ isHost: false, myVote: null, selectedId: null })).toEqual({
      kind: 'vote',
      label: '투표하기',
      disabled: true,
    });
    expect(voteActionOf({ isHost: false, myVote: null, selectedId: 'c1' }).disabled).toBe(false);
  });

  it('호스트도 자기 투표 전에는 마감할 수 없다', () => {
    expect(voteActionOf({ isHost: true, myVote: null, selectedId: 'c1' }).kind).toBe('vote');
  });

  it('호스트가 투표했으면 투표 마감하기', () => {
    expect(voteActionOf({ isHost: true, myVote: 'c1', selectedId: null })).toEqual({
      kind: 'close',
      label: '투표 마감하기',
      disabled: false,
    });
  });

  it('투표한 뒤 다른 후보를 고르면 호스트와 참가자 모두 투표 바꾸기', () => {
    const change = { kind: 'vote', label: '투표 바꾸기', disabled: false };
    expect(voteActionOf({ isHost: true, myVote: 'c1', selectedId: 'c2' })).toEqual(change);
    expect(voteActionOf({ isHost: false, myVote: 'c1', selectedId: 'c2' })).toEqual(change);
  });

  it('내가 투표한 후보를 다시 고르면 바꾸기가 아니다', () => {
    expect(voteActionOf({ isHost: true, myVote: 'c1', selectedId: 'c1' }).kind).toBe('close');
    expect(voteActionOf({ isHost: false, myVote: 'c1', selectedId: 'c1' }).kind).toBe('wait');
  });

  it('참가자가 투표했으면 누를 수 없는 안내', () => {
    expect(voteActionOf({ isHost: false, myVote: 'c1', selectedId: null })).toEqual({
      kind: 'wait',
      label: '호스트가 마감하면 확정돼요',
      disabled: true,
    });
  });
});
