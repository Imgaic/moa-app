import '@/global.css';

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

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

  return <Stack screenOptions={{ headerShown: false }} />;
}
