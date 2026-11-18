import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { CheckedAvatar } from '@/components/ui/CheckedAvatar';
import { fittingCount } from '@/lib/fittingCount';
import { progressText } from '@/lib/hubText';

import type { CheckedMember } from './MembersModal';
import { MemberProgress } from './MemberProgress';

// 피그마 Hub/Members, State=Collapsed (2026-11-18 기준). 디자인이 완성 전이라 수치가 바뀔 수 있다.
// 겹친 얼굴과 현황(모집 중에는 입력, 추천 나옴에는 투표). 영역 전체를 누르면 멤버 모달이 열린다(docs/open-questions.md T6).
const AVATAR_SIZE = 48;
const AVATAR_OVERLAP = 20;
// 피그마 영역 너비(338)에 얼굴이 넘치지 않는 개수. 화면이 좁으면 들어가는 만큼만 그린다. 그 뒤의 사람은 모달에서 본다.
const MAX_FACES = 10;

type HubMembersProps = {
  members: CheckedMember[];
  // "입력 완료" 또는 "투표 완료"
  doneText: string;
  onPress: () => void;
};

export function HubMembers({ members, doneText, onPress }: HubMembersProps) {
  // 너비를 재기 전(null)에는 피그마 너비 기준으로 최대 수를 그린다.
  const [rowWidth, setRowWidth] = useState<number | null>(null);
  const faceCount =
    rowWidth === null
      ? MAX_FACES
      : fittingCount({ width: rowWidth, size: AVATAR_SIZE, gap: -AVATAR_OVERLAP, max: MAX_FACES });
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`멤버 보기, ${progressText(members)} ${doneText}`}
      onPress={onPress}
      className="gap-[16px] active:opacity-70">
      <View className="flex-row" onLayout={(event) => setRowWidth(event.nativeEvent.layout.width)}>
        {members.slice(0, faceCount).map((member, index) => (
          // 앞사람이 뒷사람 위에 온다.
          <View
            key={member.id}
            style={{ marginLeft: index === 0 ? 0 : -AVATAR_OVERLAP, zIndex: MAX_FACES - index }}>
            <CheckedAvatar
              name={member.name}
              photo={member.avatarUrl ? { uri: member.avatarUrl } : undefined}
              size={AVATAR_SIZE}
              checked={member.checked}
            />
          </View>
        ))}
      </View>
      <MemberProgress members={members} doneText={doneText} />
    </Pressable>
  );
}
