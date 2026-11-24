// 약관 화면(피그마 01 Onboarding / Terms, 2026-11-18 기준)의 항목. 화면에 보이는 순서다.
// 약관 문서의 내용과 링크는 아직 없다(docs/open-questions.md). 항목과 문구가 서버에서 올지도 미정이다.
export type Term = {
  id: string;
  // 앞의 [필수] / [선택]은 required로 붙인다(src/lib/termsAgreement.ts의 termTitle).
  name: string;
  description?: string;
  required: boolean;
  // 오른쪽 화살표. 따로 읽을 문서가 있는 항목만 있다(만 14세 확인은 없다).
  hasDocument: boolean;
};

export const TERMS: Term[] = [
  { id: 'service', name: '서비스 이용약관', required: true, hasDocument: true },
  { id: 'privacy', name: '개인정보 수집·이용 동의', required: true, hasDocument: true },
  { id: 'location', name: '위치기반 서비스 이용약관', required: true, hasDocument: true },
  { id: 'age', name: '만 14세 이상이에요', required: true, hasDocument: false },
  {
    id: 'calendar',
    name: '내 캘린더 일정 불러오기',
    description: '시간 고를 때 내 일정을 같이 보여줘요',
    required: false,
    hasDocument: true,
  },
  {
    id: 'place-recommendation',
    name: '맞춤 장소 추천 받기',
    description: '제휴 장소가 먼저 추천될 수 있어요',
    required: false,
    hasDocument: true,
  },
  { id: 'marketing', name: '혜택 · 이벤트 알림 받기', required: false, hasDocument: true },
];
