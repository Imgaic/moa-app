// 내 정보 탭. 다음 단계 기능이라 지금은 임시 화면이다.
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileTab() {
  return (
    <SafeAreaView edges={['top']} className="flex-1 items-center justify-center bg-gray-10">
      <Text className="font-pretendard text-body2 text-gray-40">내 정보는 준비 중이에요</Text>
    </SafeAreaView>
  );
}
