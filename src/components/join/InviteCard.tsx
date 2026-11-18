import { View } from 'react-native';

import type { Invitation } from '@/api/invitations';
import { Avatar } from '@/components/ui/Avatar';
import { SummaryItem } from '@/components/ui/SummaryItem';
import { inviteFaces } from '@/lib/joinText';
import { dateRangeText, durationText, placeText } from '@/lib/planCreateText';

// 피그마 Card/Invite (2026-11-18 기준, 342:14297). 참여하기 전에 보는 약속 요약.
// 약속 만들기의 Card/Summary(PlanSummaryCard)와 달리 이름 줄과 수정 버튼이 없고, 겹친 얼굴과 "약속 이름" 줄이 있다.
// 디자인이 완성 전이라 수치가 바뀔 수 있다.
const CARD = 'gap-[14px] rounded-[14px] bg-white p-[16px]';
const AVATAR_SIZE = 64;
const AVATAR_BORDER = 1.92;
const AVATAR_OVERLAP = 25;

type InviteCardProps = {
  invitation: Invitation;
};

export function InviteCard({ invitation }: InviteCardProps) {
  const faces = inviteFaces(invitation.members, invitation.hostId);
  return (
    <View className={CARD}>
      <View className="flex-row">
        {faces.map((member, index) => (
          // 앞사람(호스트)이 뒷사람 위에 온다.
          <View
            key={member.id}
            style={{ marginLeft: index === 0 ? 0 : -AVATAR_OVERLAP, zIndex: faces.length - index }}>
            <Avatar
              name={member.name}
              photo={member.avatarUrl ? { uri: member.avatarUrl } : undefined}
              size={AVATAR_SIZE}
              borderWidth={AVATAR_BORDER}
              className="border-gray-20"
            />
          </View>
        ))}
      </View>
      {/* 줄 순서는 피그마 화면에 보이는 순서다. */}
      <SummaryItem label="장소" value={placeText(invitation)} />
      <SummaryItem label="필요한 시간" value={durationText(invitation.durationMinutes)} />
      <SummaryItem label="날짜 범위" value={dateRangeText(invitation.dateRange)} />
      <SummaryItem label="약속 이름" value={invitation.title} />
    </View>
  );
}
