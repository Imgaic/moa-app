import { useEffect, useRef, type ReactNode } from 'react';
import { Keyboard, ScrollView, View, type ScrollViewInstance } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useScrollEndPadding } from '@/hooks/useScrollEndPadding';

import { PageTitle } from './PageTitle';

// 위에 제목(Title/Page)과 본문(스크롤), 맨 아래 버튼인 화면의 틀. 참여, 약관, 프로필 화면과 약속 허브가 같이 쓴다.
// 제목도 본문과 함께 스크롤되고, 버튼만 화면 아래에 고정된다.
// 피그마 기준 위치(2026-11-18): 상단 바 아래 20에 제목, 본문은 좌우 32. 버튼은 좌우 23.5, 아래는 홈 인디케이터 위 3.
// 키보드가 올라오면 버튼이 키보드 위로 올라가도록 화면이 KeyboardAvoidingView 안에 둔다.
const TITLE_TOP = 20;
const BUTTON_BOTTOM = 3;

type StepLayoutProps = {
  title: string;
  subtitle?: string;
  // 제목 아래에서 본문까지
  bodyTop: number;
  // 없으면 본문이 화면 끝까지 닿는다(확정된 약속의 허브).
  button?: ReactNode;
  children: ReactNode;
};

export function StepLayout({ title, subtitle, bodyTop, button, children }: StepLayoutProps) {
  const { bottom } = useSafeAreaInsets();
  const scrollEndPadding = useScrollEndPadding();
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
        contentContainerStyle={[{ paddingTop: TITLE_TOP }, !button && { paddingBottom: scrollEndPadding }]}
        keyboardShouldPersistTaps="handled">
        <PageTitle title={title} subtitle={subtitle} />
        <View style={{ marginTop: bodyTop }}>{children}</View>
      </ScrollView>
      {button ? (
        <View className="px-[23.5px]" style={{ paddingBottom: bottom + BUTTON_BOTTOM }}>
          {button}
        </View>
      ) : null}
    </>
  );
}
