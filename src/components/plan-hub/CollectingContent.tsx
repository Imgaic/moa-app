import { useState } from 'react';
import { View } from 'react-native';

import type { Member } from '@/api/plans';
import { ActionCard } from '@/components/ui/ActionCard';
import { Button } from '@/components/ui/Button';
import { PlaceListCard, type PlaceListItem } from '@/components/ui/PlaceListCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StepLayout } from '@/components/ui/StepLayout';

import { HubMembers } from './HubMembers';
import { MembersModal } from './MembersModal';

// 약속 허브의 모집 중 내용 (피그마 05 Hub / Host·Guest - Collecting, 2026-11-18 기준).
// 머리(약속 이름과 조건 줄), 멤버 영역, 일정 입력 카드, 제안된 장소, 맨 아래 버튼.
// 머리부터 통째로 스크롤되고 버튼만 고정이다(틀은 StepLayout).
// 피그마 기준 위치: 제목 아래 20에 멤버, 16에 카드, 32에 제안 머리, 16에 목록.
const MEMBERS_TOP = 20;
const CARD_TOP = 16;
const SECTION_TOP = 32;
const LIST_TOP = 16;
const CHECK_TEXTS = { done: '입력 완료', pending: '입력 중' };

type CollectingContentProps = {
  // 허브의 머리: 약속 이름과 조건 줄. 내용과 함께 스크롤된다.
  title: string;
  conditions: string;
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
  title,
  conditions,
  members,
  proposals,
  isHost,
  submitted,
  onInput,
  onPropose,
  onClose,
}: CollectingContentProps) {
  const [membersOpen, setMembersOpen] = useState(false);
  const checkedMembers = members.map((member) => ({ ...member, checked: member.submitted }));

  return (
    <>
      <StepLayout
        title={title}
        subtitle={conditions}
        bodyTop={MEMBERS_TOP}
        button={
          isHost ? (
            <Button label="마감하고 추천받기" onPress={onClose} />
          ) : (
            // 피그마 Guest - Collecting - Proposals: 누를 수 없는 회색 버튼에 안내 문구
            <Button label="호스트가 마감하면 추천이 나와요" disabled />
          )
        }>
        <HubMembers members={checkedMembers} doneText={CHECK_TEXTS.done} onPress={() => setMembersOpen(true)} />
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
      </StepLayout>

      <MembersModal
        visible={membersOpen}
        members={checkedMembers}
        texts={CHECK_TEXTS}
        onClose={() => setMembersOpen(false)}
      />
    </>
  );
}
