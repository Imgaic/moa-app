// 아래에 버튼이나 탭 바 없이 화면 끝까지 닿는 스크롤의 아래 여백.
// 끝까지 내렸을 때 마지막 내용이 기기의 하단 바(안드로이드 3버튼, 아이폰 홈 인디케이터) 위에 오게 한다.
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 마지막 내용 아래의 여백. 아래에 버튼이 있는 스크롤의 `pb-[24px]`와 같은 값이다.
const END_GAP = 24;

export function useScrollEndPadding(): number {
  return useSafeAreaInsets().bottom + END_GAP;
}
