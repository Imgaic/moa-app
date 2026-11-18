import { Pressable, Text, View } from 'react-native';

import { SocialLogo, type SocialProvider } from './SocialLogo';

// 피그마 Button/Social (2026-11-17 기준). 디자인이 완성 전이라 수치가 바뀔 수 있다.
const BOX = 'h-[60px] w-full items-center justify-center rounded-[10px]';
const ICON_LEFT = { kakao: 16, naver: 16, google: 15, apple: 15 } as const;

const LOOK: Record<SocialProvider, { label: string; box: string; text: string }> = {
  kakao: { label: '카카오로 로그인', box: 'bg-kakao', text: 'text-gray-60' },
  google: { label: '구글로 로그인', box: 'bg-google border border-gray-10', text: 'text-gray-60' },
  naver: { label: '네이버로 로그인', box: 'bg-naver', text: 'text-white' },
  apple: { label: '애플로 로그인', box: 'bg-black border border-gray-10', text: 'text-white' },
};

type SocialButtonProps = {
  provider: SocialProvider;
  onPress?: () => void;
};

export function SocialButton({ provider, onPress }: SocialButtonProps) {
  const look = LOOK[provider];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={look.label}
      onPress={onPress}
      className={`${BOX} ${look.box}`}>
      <View
        className="absolute inset-y-0 justify-center"
        style={{ left: ICON_LEFT[provider] }}>
        <SocialLogo provider={provider} />
      </View>
      <Text className={`font-pretendard text-body1 font-bold ${look.text}`}>{look.label}</Text>
    </Pressable>
  );
}
