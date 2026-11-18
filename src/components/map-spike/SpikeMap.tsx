// 시험용(spike/naver-map): 네이버 지도와 핀 하나. 웹은 SpikeMap.web.tsx가 대신한다.
// 이 라이브러리는 import만 해도 네이티브 모듈을 찾아서(TurboModuleRegistry.getEnforcing) 웹에서는 죽는다.
import {
  addNaverMapAuthFailureListener,
  NaverMapMarkerOverlay,
  NaverMapView,
  type NaverMapAuthFailure,
} from '@mj-studio/react-native-naver-map';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

const REGION_SPAN = 0.01;

type Coordinate = { latitude: number; longitude: number };

export function SpikeMap({ center, caption }: { center: Coordinate; caption: string }) {
  const [failure, setFailure] = useState<NaverMapAuthFailure | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  // 실패는 다시 알려 주지 않으므로 지도보다 먼저 듣는다.
  useEffect(() => {
    const subscription = addNaverMapAuthFailureListener((next) => {
      console.log('[map-spike] auth failure', next);
      setFailure(next);
    });
    return () => subscription.remove();
  }, []);

  return (
    <View className="flex-1">
      <View className="p-4">
        <Text>initialized: {String(initialized)} / mapLoaded: {String(mapLoaded)}</Text>
        <Text>auth: {failure ? `${failure.code} ${failure.message}` : '실패 없음'}</Text>
      </View>
      <NaverMapView
        style={{ flex: 1 }}
        initialRegion={{ ...center, latitudeDelta: REGION_SPAN, longitudeDelta: REGION_SPAN }}
        onInitialized={() => {
          console.log('[map-spike] initialized');
          setInitialized(true);
        }}
        onMapLoaded={() => {
          console.log('[map-spike] map loaded');
          setMapLoaded(true);
        }}
      >
        <NaverMapMarkerOverlay {...center} caption={{ text: caption }} />
      </NaverMapView>
    </View>
  );
}
