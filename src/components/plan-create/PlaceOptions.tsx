import { View } from 'react-native';

import type { PlaceMode } from '@/api/plans';
import type { Place } from '@/api/places';
import { OptionCard } from '@/components/ui/OptionCard';
import { PlaceRow } from '@/components/ui/PlaceRow';

// 피그마 03 Create / Place의 본문: 장소 방식 카드 두 장.
// "정해져 있어요"를 고르면 카드 안에 장소 찾기 줄이, 장소를 고른 뒤에는 그 장소와 "변경"이 보인다.
const GAP = 'gap-[16px]';

type PlaceOptionsProps = {
  mode: PlaceMode | null;
  place: Place | null;
  onChangeMode: (mode: PlaceMode) => void;
  onSearchPlace: () => void;
};

export function PlaceOptions({ mode, place, onChangeMode, onSearchPlace }: PlaceOptionsProps) {
  return (
    <View className={GAP}>
      <OptionCard
        title="추천 받을래요"
        description="모두의 출발지로 중간 지점을 찾아요"
        selected={mode === 'recommend'}
        onSelect={() => onChangeMode('recommend')}
      />
      <OptionCard
        title="정해져 있어요"
        description="장소를 직접 골라요"
        selected={mode === 'fixed'}
        onSelect={() => onChangeMode('fixed')}>
        {mode !== 'fixed' ? null : place ? (
          <PlaceRow type="selected" name={place.name} address={place.address} onChange={onSearchPlace} />
        ) : (
          <PlaceRow type="search" label="장소 찾기" onPress={onSearchPlace} />
        )}
      </OptionCard>
    </View>
  );
}
