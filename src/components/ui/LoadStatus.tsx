import { ActivityIndicator, Text } from 'react-native';

// 화면이 내용을 아직 보일 수 없을 때 상단 바 아래에 두는 표시: 불러오는 중이면 스피너, 아니면 회색 안내 문구.
// 피그마에 없는 임시 모양이다. 무엇을 어떻게 불러오는지는 화면이 정하고, 여기는 그 결과만 받는다.
type LoadStatusProps = {
  state: 'loading' | 'error' | 'missing';
  errorText: string;
  // 찾는 것이 없을 수 있는 화면만 준다.
  missingText?: string;
};

export function LoadStatus({ state, errorText, missingText }: LoadStatusProps) {
  if (state === 'loading') return <ActivityIndicator className="mt-[40px]" />;
  return (
    <Text className="mt-[40px] text-center font-pretendard text-body2 text-gray-40">
      {state === 'missing' && missingText ? missingText : errorText}
    </Text>
  );
}
