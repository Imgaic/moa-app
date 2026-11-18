// 약관 화면 (피그마 01 Onboarding / Terms - Empty, Terms - Checked). 동의한 약관을 api로 보낸 뒤 로그인 단계를 다시 읽는다.
// 단계가 바뀌면 온보딩 레이아웃이 프로필 화면으로 옮겨 간다. 동의 규칙은 src/lib/termsAgreement.ts에 있다.
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { agreeToTerms } from '@/api/auth';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { StepLayout } from '@/components/ui/StepLayout';
import { TermsItem } from '@/components/ui/TermsItem';
import { TopBar } from '@/components/ui/TopBar';
import { TERMS } from '@/constants/terms';
import { notify } from '@/lib/dialogs';
import { isAllRequiredAgreed, termTitle, toggleAllRequired, toggleTerm } from '@/lib/termsAgreement';
import { useAuthStage } from '@/stores/authStage';

// 피그마 기준 위치(2026-11-18). 제목 아래 40에 전체 동의 줄(높이 57), 그 아래 18에 구분선.
// 구분선과 묶음 사이 24, 묶음 안의 줄 사이 19. 구분선은 화면 끝에서 끝까지다(본문 좌우 여백 32를 넘는다).
const BODY_TOP = 40;
const ALL_ROW = 'h-[57px] flex-row items-center gap-[13px]';
const DIVIDER = '-mx-[32px] h-px bg-gray-20';
const DIVIDER_TOP = 18;
const GROUP_GAP = 24;
const ROW_GAP = 'gap-[19px]';
const REQUIRED = TERMS.filter((term) => term.required);
const OPTIONAL = TERMS.filter((term) => !term.required);

export default function Terms() {
  const refreshAuthStage = useAuthStage((state) => state.refresh);
  const [agreed, setAgreed] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const allRequired = isAllRequiredAgreed(TERMS, agreed);
  const toggleAll = () => setAgreed((current) => toggleAllRequired(TERMS, current));

  const submit = async () => {
    setSending(true);
    try {
      await agreeToTerms(agreed);
      await refreshAuthStage();
    } catch {
      setSending(false);
      notify('저장하지 못했어요', '잠시 뒤에 다시 시도해 주세요.');
    }
  };

  const rows = (terms: typeof TERMS) => (
    <View className={ROW_GAP}>
      {terms.map((term) => (
        <TermsItem
          key={term.id}
          title={termTitle(term)}
          description={term.description}
          checked={agreed.includes(term.id)}
          showArrow={term.hasDocument}
          onPress={() => setAgreed((current) => toggleTerm(current, term.id))}
        />
      ))}
    </View>
  );

  return (
    <View className="flex-1 bg-gray-10">
      <TopBar type="status" />
      <StepLayout
        title={'모아 이용을 위해\n약관을 확인해 주세요.'}
        bodyTop={BODY_TOP}
        button={<Button label="동의하고 시작하기" disabled={!allRequired || sending} onPress={submit} />}>
        <Pressable accessible={false} onPress={toggleAll} className={ALL_ROW}>
          <Checkbox tone="black" checked={allRequired} onChange={toggleAll} accessibilityLabel="[필수] 전체 동의하기" />
          <Text className="font-pretendard text-body1 text-gray-50">[필수] 전체 동의하기</Text>
        </Pressable>
        <View className={DIVIDER} style={{ marginTop: DIVIDER_TOP }} />
        <View style={{ marginVertical: GROUP_GAP }}>{rows(REQUIRED)}</View>
        <View className={DIVIDER} />
        <View style={{ marginTop: GROUP_GAP }}>{rows(OPTIONAL)}</View>
      </StepLayout>
    </View>
  );
}
