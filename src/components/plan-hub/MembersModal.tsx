import { Modal, Pressable, ScrollView, useWindowDimensions, View } from 'react-native';

import type { PlanMember } from '@/api/plans';
import { Icon } from '@/components/ui/Icon';
import { MemberRow } from '@/components/ui/MemberRow';

import { MemberProgress } from './MemberProgress';

// 피그마 05 Hub / Host - Collecting Expanded의 멤버 모달 (Hub/Members, State=Expanded, 2026-11-18 기준).
// 디자인이 완성 전이라 수치가 바뀔 수 있다.
// 바깥(어두운 바탕)을 누르거나, 닫기 버튼, Android 뒤로 가기, 웹 Esc로 닫힌다.
const CARD = 'gap-[16px] rounded-[10px] bg-white p-[20px]';
const SIDE_MARGIN = 32;
// 멤버가 많으면 이 높이를 넘지 않고 안에서 스크롤한다. 화면 위아래가 보여야 "모달"로 읽힌다.
const MAX_HEIGHT_RATIO = 0.7;
const HIT_SLOP = 12;

// 모집 중에는 입력했는지, 추천 나옴에는 투표했는지가 체크다.
export type CheckedMember = PlanMember & { checked: boolean };

// 체크된 사람과 아닌 사람의 상태 글자. 예: 입력 완료 / 입력 중
export type CheckTexts = { done: string; pending: string };

type MembersModalProps = {
  visible: boolean;
  members: CheckedMember[];
  texts: CheckTexts;
  onClose: () => void;
};

export function MembersModal({ visible, members, texts, onClose }: MembersModalProps) {
  const { height } = useWindowDimensions();
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <View className="flex-1 justify-center" style={{ paddingHorizontal: SIDE_MARGIN }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="멤버 목록 닫기"
          onPress={onClose}
          className="absolute inset-0 bg-gray-60/60"
        />
        <View className={CARD} style={{ maxHeight: height * MAX_HEIGHT_RATIO }}>
          <View className="flex-row items-center justify-between">
            <MemberProgress members={members} doneText={texts.done} />
            <Pressable accessibilityRole="button" accessibilityLabel="닫기" hitSlop={HIT_SLOP} onPress={onClose}>
              <Icon name="close" className="text-gray-60" />
            </Pressable>
          </View>
          <ScrollView className="grow-0" contentContainerClassName="gap-[8px]">
            {members.map((member) => (
              <MemberRow
                key={member.id}
                name={member.name}
                photo={member.avatarUrl ? { uri: member.avatarUrl } : undefined}
                status={member.checked ? texts.done : texts.pending}
                checked={member.checked}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
