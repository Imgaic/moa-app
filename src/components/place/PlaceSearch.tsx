import { Pressable, Text, View } from 'react-native';

import type { Place } from '@/api/places';
import { Icon } from '@/components/ui/Icon';
import { TextField } from '@/components/ui/TextField';

// 장소 찾기. 약속 만들기(정해진 장소)와 허브의 장소 제안이 같이 쓴다. 피그마에 검색 화면이 없어(docs/open-questions.md) 있는 컴포넌트로 가장 단순하게 만든 임시 모양이다:
// 검색어 칸(Input/Text) 아래에 결과를 장소 줄 모양(핀, 이름, 주소)으로 늘어놓는다. 줄을 누르면 고른다.
const QUERY_MAX_LENGTH = 30;
const LIST_TOP = 'mt-[8px]';
const RESULT_ROW = 'flex-row items-center gap-[8px] border-b border-gray-20 py-[14px]';

type PlaceSearchProps = {
  query: string;
  onChangeQuery: (query: string) => void;
  // 검색 중이면 null
  places: Place[] | null;
  onPick: (place: Place) => void;
};

export function PlaceSearch({ query, onChangeQuery, places, onPick }: PlaceSearchProps) {
  const noResult = places !== null && places.length === 0 && query.trim() !== '';
  return (
    <View>
      <TextField
        value={query}
        onChangeText={onChangeQuery}
        maxLength={QUERY_MAX_LENGTH}
        placeholder="장소 이름이나 주소"
      />
      <View className={LIST_TOP}>
        {noResult ? (
          <Text className="font-pretendard text-body2 text-gray-30">검색 결과가 없어요</Text>
        ) : null}
        {places?.map((place) => (
          <Pressable
            key={place.id}
            accessibilityRole="button"
            accessibilityLabel={`${place.name}, ${place.address}`}
            onPress={() => onPick(place)}
            className={RESULT_ROW}>
            <Icon name="pin" className="text-gray-60" />
            <View className="flex-1 gap-[4px]">
              <Text className="font-pretendard text-body2 text-black">{place.name}</Text>
              <Text className="font-pretendard text-caption-12 text-gray-30">{place.address}</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
