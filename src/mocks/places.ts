// 백엔드(또는 장소 검색 API)가 나오기 전까지 쓰는 가짜 장소. src/api/places.ts만 이 파일을 쓴다.
import type { Place } from '@/api/places';

import { LONG_PLACE_NAME } from './stressPlans';

export const MOCK_PLACES: Place[] = [
  { id: 'place-1', name: '마찌마찌중앙대점', address: '경기 안성시 대덕면 대학9길 12' },
  { id: 'place-2', name: '중앙대학교 안성캠퍼스', address: '경기 안성시 대덕면 서동대로 4726' },
  { id: 'place-3', name: '사당역 2호선', address: '서울 동작구 남부순환로 지하 2089' },
  { id: 'place-4', name: '사당역 스타벅스', address: '서울 동작구 동작대로 3' },
  { id: 'place-5', name: '강남역 2호선', address: '서울 강남구 강남대로 지하 396' },
  { id: 'place-6', name: '강남역 교보문고', address: '서울 서초구 강남대로 465' },
  { id: 'place-7', name: '홍대입구역 2호선', address: '서울 마포구 양화로 지하 160' },
  { id: 'place-8', name: '흑석역 9호선', address: '서울 동작구 현충로 지하 92' },
  // 배치 확인용: 이름과 주소가 긴 장소
  { id: 'place-9', name: LONG_PLACE_NAME, address: '서울특별시 마포구 양화로 지하 160 홍대입구역 9번 출구 앞 광장' },
  {
    id: 'place-10',
    name: '스타벅스 더종로R점 리저브 바 2층 창가 자리',
    address: '서울특별시 종로구 종로 51 종로타워 1~2층',
  },
];
