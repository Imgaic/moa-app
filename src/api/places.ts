// 장소 검색. 화면은 이 파일의 함수만 부른다.
// 검색에 쓸 API가 미정이라(카카오 로컬 API가 후보) 지금은 가짜 목록을 검색어로 거른다.
import { MOCK_PLACES } from '@/mocks/places';

// 화면이 쓰는 필드만 담은 초안이다. 좌표(lat, lng)는 추천과 길찾기를 붙일 때 백엔드와 맞춰 더한다.
export type Place = {
  id: string;
  name: string;
  address: string;
};

const MOCK_DELAY_MS = 200;

// 이름이나 주소에 검색어가 들어간 장소. 검색어가 비어 있으면 빈 목록이다.
export async function searchPlaces(query: string): Promise<Place[]> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
  const words = query.trim();
  if (words === '') return [];
  return MOCK_PLACES.filter((place) => place.name.includes(words) || place.address.includes(words));
}
