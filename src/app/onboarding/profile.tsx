// 프로필 화면 (피그마 01 Onboarding / Profile, Focused, Photo Added). 온보딩의 마지막 단계다.
// 이름과 사진을 api로 보낸 뒤 로그인 단계를 다시 읽으면, 루트 레이아웃이 온보딩을 닫고 홈으로 옮겨 간다.
// 본문은 참여 화면과 같은 ProfileForm이다.
import { useState } from 'react';
import { KeyboardAvoidingView } from 'react-native';

import { saveProfile, type Profile } from '@/api/auth';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { Button } from '@/components/ui/Button';
import { StepLayout } from '@/components/ui/StepLayout';
import { TopBar } from '@/components/ui/TopBar';
import { notify } from '@/lib/dialogs';
import { pickPhoto } from '@/lib/pickPhoto';
import { isNameValid } from '@/lib/profileName';
import { useAuthStage } from '@/stores/authStage';

// 피그마 기준 위치(2026-11-18). 제목 아래 61에 프로필 동그라미(참여 화면과 같다).
const BODY_TOP = 61;

export default function ProfileSetup() {
  const refreshAuthStage = useAuthStage((state) => state.refresh);
  const [profile, setProfile] = useState<Profile>({ name: '', photoUri: null });
  const [saving, setSaving] = useState(false);

  const choosePhoto = async () => {
    try {
      const photoUri = await pickPhoto();
      if (photoUri) setProfile((current) => ({ ...current, photoUri }));
    } catch {
      notify('사진을 불러오지 못했어요', '잠시 뒤에 다시 시도해 주세요.');
    }
  };

  const submit = async () => {
    setSaving(true);
    try {
      await saveProfile({ ...profile, name: profile.name.trim() });
      await refreshAuthStage();
    } catch {
      setSaving(false);
      notify('저장하지 못했어요', '잠시 뒤에 다시 시도해 주세요.');
    }
  };

  // 피그마 버튼 글자는 "다음"이지만 이 화면이 온보딩의 마지막이라 "시작하기"로 두었다(docs/open-questions.md).
  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1 bg-gray-10">
      <TopBar type="status" />
      <StepLayout
        title="프로필 설정"
        subtitle="지도와 채팅에 이름으로 표시돼요."
        bodyTop={BODY_TOP}
        button={<Button label="시작하기" disabled={!isNameValid(profile.name) || saving} onPress={submit} />}>
        <ProfileForm
          name={profile.name}
          onChangeName={(name) => setProfile((current) => ({ ...current, name }))}
          photoUri={profile.photoUri}
          onPickPhoto={choosePhoto}
        />
      </StepLayout>
    </KeyboardAvoidingView>
  );
}
