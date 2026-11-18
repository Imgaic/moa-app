import '@/global.css';

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useAuthStage } from '@/stores/authStage';

SplashScreen.preventAutoHideAsync();

// 초대 링크(/join/<코드>)나 허브 주소로 바로 열어도 그 아래에 홈을 깔아 둔다.
// 그래야 참여 뒤 허브에서 뒤로 가면 홈으로 간다(참여 화면은 허브로 바꿔 가서 기록에 없다).
export const unstable_settings = { anchor: '(tabs)' };

// 온보딩 안에서는 단계에 맞는 화면(로그인, 약관, 프로필)이 열린다(src/app/onboarding/_layout.tsx).
const ONBOARDING = '/onboarding/login';

export default function RootLayout() {
  const stage = useAuthStage((state) => state.stage);
  const refreshStage = useAuthStage((state) => state.refresh);
  const [loaded, error] = useFonts([
    {
      fontFamily: 'Pretendard',
      fontDefinitions: [
        // 가변 글꼴 하나. 굵기 범위는 웹의 @font-face에만 쓰이고 iOS, Android는 파일에서 읽는다.
        {
          path: require('@/assets/fonts/PretendardVariable.ttf'),
          weight: '100 900',
          style: 'normal',
        },
      ],
    },
  ]);

  useEffect(() => {
    refreshStage();
  }, [refreshStage]);

  const fontsDone = loaded || error;
  // 로그인 단계를 알기 전에는 어느 화면으로 갈지 모르니 스플래시를 그대로 둔다.
  useEffect(() => {
    if (fontsDone && stage !== null) {
      SplashScreen.hideAsync();
    }
  }, [fontsDone, stage]);

  if (!fontsDone || stage === null) {
    return null;
  }

  const member = stage === 'member';
  const onboarding = stage === 'signedOut' || stage === 'guest' || stage === 'terms' || stage === 'profile';

  // 시간 막대(react-native-gesture-handler)의 손가락 동작은 이 뿌리 아래에서만 받는다.
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Expo Router 보호된 라우트(SDK 58). guard가 거짓인 화면은 열 수 없고, 열려 있던 화면은 기록에서 지워진다.
          회원이 아니면 홈과 허브가 막혀 온보딩으로 간다(redirectTo. 없으면 견본 화면이 열렸다).
          온보딩을 마치면 온보딩이 막혀 홈(anchor)으로 간다. 참여 화면(join)과 견본(samples)은 여기에 없어 늘 열린다. */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={member} redirectTo={ONBOARDING}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="plans/new" />
        </Stack.Protected>
        <Stack.Protected guard={onboarding}>
          <Stack.Screen name="onboarding" />
        </Stack.Protected>
        {/* 허브와 그 안의 화면은 링크로 참여한 게스트도 연다 */}
        <Stack.Protected guard={member || stage === 'guest'} redirectTo={ONBOARDING}>
          <Stack.Screen name="plans/[planId]/index" />
          <Stack.Screen name="plans/[planId]/input" />
          <Stack.Screen name="plans/[planId]/place-search" />
        </Stack.Protected>
      </Stack>
    </GestureHandlerRootView>
  );
}
