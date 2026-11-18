import '@/global.css';

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

// 초대 링크(/join/<코드>)나 허브 주소로 바로 열어도 그 아래에 홈을 깔아 둔다.
// 그래야 참여 뒤 허브에서 뒤로 가면 홈으로 간다(참여 화면은 허브로 바꿔 가서 기록에 없다).
export const unstable_settings = { anchor: '(tabs)' };

export default function RootLayout() {
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
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  // 시간 막대(react-native-gesture-handler)의 손가락 동작은 이 뿌리 아래에서만 받는다.
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
    </GestureHandlerRootView>
  );
}
