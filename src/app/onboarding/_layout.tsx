// 온보딩 세 화면. 로그인 단계에 맞는 화면 하나만 열려 있어서, 단계가 바뀌면(api 호출 뒤 스토어 refresh) 다음 화면으로 저절로 옮겨 간다.
// 그래서 지나온 화면으로 뒤로 갈 수 없다(약관에서 로그인으로, 프로필에서 약관으로도). 게스트도 로그인 화면에서 회원이 될 수 있다.
import { Stack } from 'expo-router';

import { useAuthStage } from '@/stores/authStage';

export default function OnboardingLayout() {
  const stage = useAuthStage((state) => state.stage);
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={stage === 'signedOut' || stage === 'guest'}>
        <Stack.Screen name="login" />
      </Stack.Protected>
      <Stack.Protected guard={stage === 'terms'}>
        <Stack.Screen name="terms" />
      </Stack.Protected>
      <Stack.Protected guard={stage === 'profile'}>
        <Stack.Screen name="profile" />
      </Stack.Protected>
    </Stack>
  );
}
