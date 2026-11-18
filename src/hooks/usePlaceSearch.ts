// 장소 찾기의 검색어와 결과. 검색어가 바뀔 때마다 api에서 결과를 받아 온다.
// 약속 만들기(정해진 장소)와 허브의 장소 제안이 같이 쓴다.
import { useEffect, useState } from 'react';

import { searchPlaces, type Place } from '@/api/places';

export function usePlaceSearch() {
  const [query, setQuery] = useState('');
  // 검색 중이면 null
  const [places, setPlaces] = useState<Place[] | null>([]);

  useEffect(() => {
    // 늦게 온 앞 검색어의 결과가 새 결과를 덮지 않게 한다.
    let current = true;
    searchPlaces(query)
      .then((found) => current && setPlaces(found))
      .catch(() => current && setPlaces([]));
    return () => {
      current = false;
    };
  }, [query]);

  const changeQuery = (next: string) => {
    setQuery(next);
    setPlaces(null);
  };

  return { query, changeQuery, places };
}
