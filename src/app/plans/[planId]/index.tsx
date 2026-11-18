// 약속 허브. 다음 작업에서 만든다. 지금은 홈의 카드가 여기로 오는지 확인하는 임시 화면이다.
import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { TopBar } from '@/components/ui/TopBar';

export default function PlanHub() {
  const { planId } = useLocalSearchParams<{ planId: string }>();
  return (
    <View className="flex-1 bg-gray-10">
      <TopBar type="back" onBack={() => router.back()} />
      <View className="flex-1 items-center justify-center gap-[8px]">
        <Text className="font-pretendard text-body2 text-gray-40">
          약속 허브는 다음 작업에서 만든다
        </Text>
        <Text className="font-pretendard text-caption-12 text-gray-30">planId: {planId}</Text>
      </View>
    </View>
  );
}
