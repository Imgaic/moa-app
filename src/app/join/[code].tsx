// 참여 화면 (피그마 04 Join). 단톡방의 초대 링크(/join/<코드>)로 온 사람이 약속을 보고 참여한다.
// 이 화면은 api로 초대와 "나"를 불러와 단계를 고르고, 참여하면 약속 허브로 바꿔 간다(뒤로 가기 기록에 남기지 않는다).
// 로그인돼 있으면 초대 단계만, 아니면 프로필(이름, 사진)을 먼저 받고 초대 단계로 간다. 이미 멤버면 묻지 않고 허브로 간다.
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Text } from 'react-native';

import { getInvitation, joinPlan, type Invitation } from '@/api/invitations';
import { getSignedInMe, type GuestProfile } from '@/api/me';
import { InviteCard } from '@/components/join/InviteCard';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { Button } from '@/components/ui/Button';
import { StepLayout } from '@/components/ui/StepLayout';
import { TopBar } from '@/components/ui/TopBar';
import { notify } from '@/lib/dialogs';
import { invitedTitle } from '@/lib/joinText';
import { pickPhoto } from '@/lib/pickPhoto';
import { isNameValid } from '@/lib/profileName';
import { useAuthStage } from '@/stores/authStage';

// 피그마 기준 위치(2026-11-18). 제목 아래 본문(초대 카드 34, 프로필 61).
const INVITE_BODY_TOP = 34;
const PROFILE_BODY_TOP = 61;

type Loaded =
  | { state: 'loading' }
  | { state: 'error' }
  | { state: 'missing' }
  // signedIn: 로그인했거나 이번 실행에서 익명으로 들어온 사람인지
  | { state: 'ready'; invitation: Invitation; signedIn: boolean };

type Step = 'profile' | 'invite';

const openHub = (planId: string) => router.replace({ pathname: '/plans/[planId]', params: { planId } });

export default function Join() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const [loaded, setLoaded] = useState<Loaded>({ state: 'loading' });
  const [step, setStep] = useState<Step>('invite');

  useEffect(() => {
    Promise.all([getInvitation(code), getSignedInMe()])
      .then(([invitation, me]) => {
        if (!invitation) return setLoaded({ state: 'missing' });
        // 이미 참여한 사람이 링크를 다시 열면 묻지 않고 허브로 보낸다.
        if (me && invitation.members.some((member) => member.id === me.id)) return openHub(invitation.id);
        setStep(me ? 'invite' : 'profile');
        setLoaded({ state: 'ready', invitation, signedIn: me !== null });
      })
      .catch(() => setLoaded({ state: 'error' }));
  }, [code]);

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1 bg-gray-10">
      <TopBar type="status" />
      {loaded.state === 'loading' ? (
        <ActivityIndicator className="mt-[40px]" />
      ) : loaded.state !== 'ready' ? (
        <Text className="mt-[40px] text-center font-pretendard text-body2 text-gray-40">
          {loaded.state === 'missing' ? '초대를 찾을 수 없어요' : '초대를 불러오지 못했어요'}
        </Text>
      ) : (
        <JoinSteps
          invitation={loaded.invitation}
          signedIn={loaded.signedIn}
          step={step}
          onNext={() => setStep('invite')}
        />
      )}
    </KeyboardAvoidingView>
  );
}

type JoinStepsProps = {
  invitation: Invitation;
  signedIn: boolean;
  step: Step;
  onNext: () => void;
};

// 프로필 단계(로그인하지 않은 사람만)와 초대 단계. 프로필 값은 참여할 때까지 여기서 들고 있는다.
function JoinSteps({ invitation, signedIn, step, onNext }: JoinStepsProps) {
  const [profile, setProfile] = useState<GuestProfile>({ name: '', photoUri: null });
  const [joining, setJoining] = useState(false);
  const refreshAuthStage = useAuthStage((state) => state.refresh);
  const host = invitation.members.find((member) => member.id === invitation.hostId);

  const choosePhoto = async () => {
    try {
      const photoUri = await pickPhoto();
      if (photoUri) setProfile((current) => ({ ...current, photoUri }));
    } catch {
      notify('사진을 불러오지 못했어요', '잠시 뒤에 다시 시도해 주세요.');
    }
  };

  const join = async () => {
    setJoining(true);
    try {
      await joinPlan(invitation.id, signedIn ? undefined : { ...profile, name: profile.name.trim() });
      // 익명 게스트가 됐으면 허브가 열리도록 로그인 단계를 다시 읽는다(src/app/_layout.tsx).
      await refreshAuthStage();
      openHub(invitation.id);
    } catch {
      setJoining(false);
      notify('참여하지 못했어요', '잠시 뒤에 다시 시도해 주세요.');
    }
  };

  if (step === 'profile') {
    return (
      <StepLayout
        title="프로필 설정"
        subtitle="지도와 채팅에 이름으로 표시돼요."
        bodyTop={PROFILE_BODY_TOP}
        button={<Button label="다음" disabled={!isNameValid(profile.name)} onPress={onNext} />}>
        <ProfileForm
          name={profile.name}
          onChangeName={(name) => setProfile((current) => ({ ...current, name }))}
          photoUri={profile.photoUri}
          onPickPhoto={choosePhoto}
        />
      </StepLayout>
    );
  }
  return (
    <StepLayout
      title={invitedTitle(host?.name ?? '')}
      bodyTop={INVITE_BODY_TOP}
      button={<Button label="참여하기" disabled={joining} onPress={join} />}>
      <InviteCard invitation={invitation} />
    </StepLayout>
  );
}
