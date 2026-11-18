// 시험용(spike/naver-map): 웹에서는 네이버 지도 라이브러리를 import하지 않는다(네이티브 전용).
// 웹 지도는 네이버 지도 JavaScript API 등으로 따로 만들어야 한다. 지금은 자리만 표시한다.
import { Text, View } from 'react-native';

type Coordinate = { latitude: number; longitude: number };

export function SpikeMap({ center, caption }: { center: Coordinate; caption: string }) {
  return (
    <View className="flex-1 items-center justify-center bg-gray-100">
      <Text>웹에서는 지도를 아직 지원하지 않는다</Text>
      <Text>
        {caption} ({center.latitude}, {center.longitude})
      </Text>
    </View>
  );
}
