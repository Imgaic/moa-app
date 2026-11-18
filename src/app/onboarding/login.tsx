// 로그인 화면 (피그마 01 Onboarding / Login). 소셜 버튼을 누르면 api로 (가짜) 로그인한 뒤 로그인 단계를 다시 읽는다.
// 단계가 바뀌면 온보딩 레이아웃이 다음 화면(약관)으로 옮겨 간다(src/app/onboarding/_layout.tsx).
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getRecentSignInProvider, signInWithSocial, type SocialProvider } from '@/api/auth';
import { Tooltip } from '@/components/ui/Badge';
import { SocialButton } from '@/components/ui/SocialButton';
import { notify } from '@/lib/dialogs';
import { useAuthStage } from '@/stores/authStage';

// 피그마 기준 위치(2026-11-18). 화면 아래쪽에 붙은 묶음이라 아래에서 위로 잰다.
// 제목 → 버튼 39, 버튼 사이 16, 버튼 → 아래 글자 45, 아래 글자는 화면 끝에서 24(홈 인디케이터와 겹친다).
const PROVIDERS: SocialProvider[] = ['kakao', 'google', 'naver', 'apple'];
const BUTTONS_SIDE = 23.5;
const TITLE_SIDE = 33;
const TITLE_GAP = 'gap-[16px]';
const BUTTONS_TOP = 39;
const BUTTON_GAP = 'gap-[16px]';
const FOOTER_TOP = 45;
const FOOTER_GAP = 'gap-[18px]';
const FOOTER_BOTTOM = 24;
// "최근 로그인" 말풍선은 버튼 오른쪽 끝에서 6 안쪽, 꼬리가 버튼 위에 걸친다.
const TOOLTIP = { right: 6, top: -26 };

export default function Login() {
  const { bottom } = useSafeAreaInsets();
  const refreshAuthStage = useAuthStage((state) => state.refresh);
  const [recent, setRecent] = useState<SocialProvider | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    getRecentSignInProvider()
      .then(setRecent)
      .catch(() => setRecent(null));
  }, []);

  const signIn = async (provider: SocialProvider) => {
    if (signingIn) return;
    setSigningIn(true);
    try {
      await signInWithSocial(provider);
      await refreshAuthStage();
    } catch {
      setSigningIn(false);
      notify('로그인하지 못했어요', '잠시 뒤에 다시 시도해 주세요.');
    }
  };

  return (
    <View className="flex-1 justify-end bg-gray-10" style={{ paddingBottom: Math.max(bottom, FOOTER_BOTTOM) }}>
      <View className={TITLE_GAP} style={{ paddingHorizontal: TITLE_SIDE }}>
        <Text accessibilityRole="header" className="font-pretendard text-h1 text-gray-50">
          모두의 일정을 모아
        </Text>
        <Text className="font-pretendard text-body1 text-gray-40">언제, 어디서 만날지 한 번에 정해요</Text>
      </View>
      <View className={BUTTON_GAP} style={{ marginTop: BUTTONS_TOP, paddingHorizontal: BUTTONS_SIDE }}>
        {PROVIDERS.map((provider) => (
          <View key={provider}>
            <SocialButton provider={provider} onPress={() => signIn(provider)} />
            {provider === recent ? (
              <View pointerEvents="none" className="absolute" style={TOOLTIP}>
                <Tooltip label="최근 로그인" />
              </View>
            ) : null}
          </View>
        ))}
      </View>
      {/* 약관 문서가 아직 없어 누를 수 없는 글자로 둔다(docs/open-questions.md) */}
      <View className={`flex-row justify-center ${FOOTER_GAP}`} style={{ marginTop: FOOTER_TOP }}>
        <Text className="font-pretendard text-caption-14 text-gray-40">이용약관</Text>
        <Text className="font-pretendard text-caption-14 text-gray-40">개인정보 처리방침</Text>
      </View>
    </View>
  );
}
