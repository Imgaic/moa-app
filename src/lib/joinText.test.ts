import { inviteFaces, invitedTitle } from './joinText';

const member = (id: string) => ({ id, name: id, avatarUrl: null });

describe('invitedTitle', () => {
  it('"OO님이 약속에" 다음 줄 "초대했어요"', () => {
    expect(invitedTitle('나해진')).toBe('나해진님이 약속에\n초대했어요');
  });
});

describe('inviteFaces', () => {
  it('호스트가 맨 앞, 나머지는 멤버 순서', () => {
    const faces = inviteFaces([member('a'), member('host'), member('b')], 'host');
    expect(faces.map((face) => face.id)).toEqual(['host', 'a', 'b']);
  });

  it('최대 3명', () => {
    const members = ['a', 'b', 'host', 'c', 'd'].map(member);
    expect(inviteFaces(members, 'host').map((face) => face.id)).toEqual(['host', 'a', 'b']);
  });

  it('호스트가 멤버 목록에 없으면 멤버 순서대로', () => {
    expect(inviteFaces([member('a')], 'host').map((face) => face.id)).toEqual(['a']);
  });
});
