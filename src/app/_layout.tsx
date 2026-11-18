import '@/global.css';

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

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
