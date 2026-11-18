// 시험용(spike/naver-map) 화면이다. 네이버 지도 SDK가 설치·빌드·실행되는지만 본다. dev에 합치지 않는다.
// 주소(/map-spike)로만 연다. 지도는 SpikeMap(웹은 SpikeMap.web)이 그린다.
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SpikeMap } from '@/components/map-spike/SpikeMap';

// 서울시청
const CITY_HALL = { latitude: 37.5665, longitude: 126.978 };

export default function MapSpikeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Text className="p-4 text-lg font-bold">지도 시험(spike)</Text>
      <SpikeMap center={CITY_HALL} caption="서울시청" />
    </SafeAreaView>
  );
}
