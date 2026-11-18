import { Pressable, View } from 'react-native';

import type { Member } from '@/api/plans';
import { CheckedAvatar } from '@/components/ui/CheckedAvatar';
import { progressText } from '@/lib/hubText';

import { MemberProgress } from './MemberProgress';

// 피그마 Hub/Members, State=Collapsed (2026-11-18 기준). 디자인이 완성 전이라 수치가 바뀔 수 있다.
// 겹친 얼굴과 입력 현황. 영역 전체를 누르면 멤버 모달이 열린다(docs/open-questions.md T6).
const AVATAR_SIZE = 48;
const AVATAR_OVERLAP = 20;
// 피그마 영역 너비(338)에 얼굴이 넘치지 않는 개수. 그 뒤의 사람은 모달에서 본다.
const MAX_FACES = 10;

type HubMembersProps = {
  members: Member[];
  onPress: () => void;
};

export function HubMembers({ members, onPress }: HubMembersProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`멤버 보기, ${progressText(members)} 입력 완료`}
      onPress={onPress}
      className="gap-[16px] active:opacity-70">
      <View className="flex-row">
        {members.slice(0, MAX_FACES).map((member, index) => (
          // 앞사람이 뒷사람 위에 온다.
          <View
            key={member.id}
            style={{ marginLeft: index === 0 ? 0 : -AVATAR_OVERLAP, zIndex: MAX_FACES - index }}>
            <CheckedAvatar
              name={member.name}
              photo={member.avatarUrl ? { uri: member.avatarUrl } : undefined}
              size={AVATAR_SIZE}
              checked={member.submitted}
            />
          </View>
        ))}
      </View>
      <MemberProgress members={members} />
    </Pressable>
  );
}
