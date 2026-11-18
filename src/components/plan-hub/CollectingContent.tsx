import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Member } from '@/api/plans';
import { ActionCard } from '@/components/ui/ActionCard';
import { Button } from '@/components/ui/Button';
import { PlaceListCard, type PlaceListItem } from '@/components/ui/PlaceListCard';
import { SectionHeader } from '@/components/ui/SectionHeader';

import { HubMembers } from './HubMembers';
import { MembersModal } from './MembersModal';

// 약속 허브의 모집 중 내용 (피그마 05 Hub / Host·Guest - Collecting, 2026-11-18 기준).
// 머리(제목과 조건 줄) 아래의 멤버 영역, 일정 입력 카드, 제안된 장소, 맨 아래 버튼.
// 피그마 기준 위치: 제목 아래 20에 멤버, 16에 카드, 32에 제안 머리, 16에 목록. 버튼은 홈 인디케이터 위 3.
const MEMBERS_TOP = 20;
const CARD_TOP = 16;
const SECTION_TOP = 32;
const LIST_TOP = 16;
const BUTTON_BOTTOM = 3;
const CHECK_TEXTS = { done: '입력 완료', pending: '입력 중' };

type CollectingContentProps = {
  members: Member[];
  // 제안된 장소를 줄 모양으로 바꾼 것(이름과 "태혁 제안")
  proposals: PlaceListItem[];
  isHost: boolean;
  // 내가 가능한 일정을 입력했는지. 카드 문구가 바뀐다.
  submitted: boolean;
  onInput: () => void;
  onPropose: () => void;
  // 호스트의 마감하고 추천받기
  onClose: () => void;
};

export function CollectingContent({
  members,
  proposals,
  isHost,
  submitted,
  onInput,
  onPropose,
  onClose,
}: CollectingContentProps) {
  const { bottom } = useSafeAreaInsets();
  const [membersOpen, setMembersOpen] = useState(false);
  const checkedMembers = members.map((member) => ({ ...member, checked: member.submitted }));

  return (
    <View className="flex-1">
      <ScrollView className="flex-1" contentContainerClassName="px-[32px] pb-[24px]">
        <View style={{ marginTop: MEMBERS_TOP }}>
          <HubMembers members={checkedMembers} doneText={CHECK_TEXTS.done} onPress={() => setMembersOpen(true)} />
        </View>
        <View style={{ marginTop: CARD_TOP }}>
          <ActionCard
            label={submitted ? '가능한 일정 수정하러 가기' : '가능한 일정 입력하러 가기'}
            onPress={onInput}
          />
        </View>
        <View style={{ marginTop: SECTION_TOP }}>
          <SectionHeader title="제안된 장소" action={{ label: '장소 제안', onPress: onPropose }} />
        </View>
        {proposals.length > 0 ? (
          <View style={{ marginTop: LIST_TOP }}>
            <PlaceListCard items={proposals} />
          </View>
        ) : null}
      </ScrollView>

      <View className="px-[23.5px]" style={{ paddingBottom: bottom + BUTTON_BOTTOM }}>
        {isHost ? (
          <Button label="마감하고 추천받기" onPress={onClose} />
        ) : (
          // 피그마 Guest - Collecting - Proposals: 누를 수 없는 회색 버튼에 안내 문구
          <Button label="호스트가 마감하면 추천이 나와요" disabled />
        )}
      </View>

      <MembersModal
        visible={membersOpen}
        members={checkedMembers}
        texts={CHECK_TEXTS}
        onClose={() => setMembersOpen(false)}
      />
    </View>
  );
}
