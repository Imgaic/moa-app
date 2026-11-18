// 참여 화면 (피그마 04 Join). 단톡방의 초대 링크(/join/<코드>)로 온 사람이 약속을 보고 참여한다.
// 이 화면은 api로 초대와 "나"를 불러와 단계를 고르고, 참여하면 약속 허브로 바꿔 간다(뒤로 가기 기록에 남기지 않는다).
// 로그인돼 있으면 초대 단계만, 아니면 프로필(이름, 사진)을 먼저 받고 초대 단계로 간다. 이미 멤버면 묻지 않고 허브로 간다.
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
  type ScrollViewInstance,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getInvitation, joinPlan, type Invitation } from '@/api/invitations';
import { getSignedInMe, type GuestProfile } from '@/api/me';
import { InviteCard } from '@/components/join/InviteCard';
import { ProfileForm } from '@/components/join/ProfileForm';
import { Button } from '@/components/ui/Button';
import { PageTitle } from '@/components/ui/PageTitle';
import { TopBar } from '@/components/ui/TopBar';
import { notify } from '@/lib/dialogs';
import { invitedTitle } from '@/lib/joinText';
import { pickPhoto } from '@/lib/pickPhoto';
import { isNameValid } from '@/lib/profileName';

// 피그마 기준 위치(2026-11-18). 상단 바 아래 20에 제목. 제목 아래 본문(초대 카드 34, 프로필 61).
// 버튼은 좌우 23.5, 아래는 홈 인디케이터 위 3.
const TITLE_TOP = 20;
const INVITE_BODY_TOP = 34;
const PROFILE_BODY_TOP = 61;
const BUTTON_BOTTOM = 3;

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

type StepLayoutProps = {
  title: string;
  subtitle?: string;
  bodyTop: number;
  button: ReactNode;
  children: ReactNode;
};

// 위에 제목과 본문(스크롤), 맨 아래 버튼. 키보드가 올라오면 버튼이 키보드 위로 올라간다.
function StepLayout({ title, subtitle, bodyTop, button, children }: StepLayoutProps) {
  const { bottom } = useSafeAreaInsets();
  const scroll = useRef<ScrollViewInstance>(null);

  // 이름 칸이 본문 맨 아래라, 키보드가 올라와 본문이 줄어들면 끝까지 내려 칸이 버튼 뒤로 숨지 않게 한다.
  useEffect(() => {
    const subscription = Keyboard.addListener('keyboardDidShow', () => scroll.current?.scrollToEnd());
    return () => subscription.remove();
  }, []);

  return (
    <>
      <ScrollView
        ref={scroll}
        className="flex-1"
        contentContainerClassName="px-[32px] pb-[24px]"
        contentContainerStyle={{ paddingTop: TITLE_TOP }}
        keyboardShouldPersistTaps="handled">
        <PageTitle title={title} subtitle={subtitle} />
        <View style={{ marginTop: bodyTop }}>{children}</View>
      </ScrollView>
      <View className="px-[23.5px]" style={{ paddingBottom: bottom + BUTTON_BOTTOM }}>
        {button}
      </View>
    </>
  );
}
