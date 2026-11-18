// 임시 화면(docs/open-questions.md T4): 확정 상태의 허브(약속 상세)는 디자인이 없어, 있는 컴포넌트로 단순하게 보여준다.
// 디자인이 나오면 이 파일을 통째로 바꾼다. 지도, 내 이동 안내, 멤버별 진척도, 캘린더에 추가, 확정 취소는 넣지 않았다.
import { ScrollView, Text, View } from 'react-native';

import type { Member, PlanDetail } from '@/api/plans';
import { MemberRow } from '@/components/ui/MemberRow';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SummaryItem } from '@/components/ui/SummaryItem';
import { dateTimeText } from '@/lib/candidateText';
import { durationText } from '@/lib/planCreateText';

// 모집 중·추천 나옴 내용과 같은 간격(제목 아래 20, 구역 사이 32, 머리 아래 16)
const SUMMARY_TOP = 20;
const SECTION_TOP = 32;
const LIST_TOP = 16;
const NOTE_TOP = 32;

type ConfirmedContentProps = {
  confirmed: NonNullable<PlanDetail['confirmed']>;
  durationMinutes: number;
  members: Member[];
  hostId: string;
};

export function ConfirmedContent({ confirmed, durationMinutes, members, hostId }: ConfirmedContentProps) {
  return (
    <ScrollView className="flex-1" contentContainerClassName="px-[32px] pb-[24px]">
      <View className="gap-[14px]" style={{ marginTop: SUMMARY_TOP }}>
        <SummaryItem label="일시" value={dateTimeText(new Date(confirmed.startsAt))} />
        <SummaryItem label="시간" value={durationText(durationMinutes)} />
        <SummaryItem label="장소" value={confirmed.place.name} />
      </View>
      <View style={{ marginTop: SECTION_TOP }}>
        <SectionHeader title="참가자" />
      </View>
      <View className="gap-[8px]" style={{ marginTop: LIST_TOP }}>
        {members.map((member) => (
          <MemberRow
            key={member.id}
            name={member.name}
            photo={member.avatarUrl ? { uri: member.avatarUrl } : undefined}
            status={member.id === hostId ? '호스트' : '참가자'}
            checked={false}
          />
        ))}
      </View>
      {/* 임시 화면 표시. 눈에 덜 띄게 맨 아래 작은 회색 글자로 둔다. */}
      <Text className="text-center font-pretendard text-caption-12 text-gray-30" style={{ marginTop: NOTE_TOP }}>
        임시 화면 · 확정된 약속의 디자인이 나오면 바뀌어요
      </Text>
    </ScrollView>
  );
}
