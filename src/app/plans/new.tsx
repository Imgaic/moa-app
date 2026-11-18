// 약속 만들기. 다음 작업에서 만든다. 지금은 홈의 더하기 버튼이 여기로 오는지 확인하는 임시 화면이다.
import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { TopBar } from '@/components/ui/TopBar';

export default function NewPlan() {
  return (
    <View className="flex-1 bg-gray-10">
      <TopBar type="back" onBack={() => router.back()} />
      <View className="flex-1 items-center justify-center">
        <Text className="font-pretendard text-body2 text-gray-40">
          약속 만들기는 다음 작업에서 만든다
        </Text>
      </View>
    </View>
  );
}
