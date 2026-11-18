# moa-app (프론트엔드)

단톡방 약속 조율 앱 moa의 프론트엔드 레포다. 공통 빈 시간 찾기 → 공평한 중간 지점 추천 → 주변 장소 추천 → 사람별 이동 안내.
백엔드는 별도 레포(팀원 담당, Cloudflare Workers + D1 예정)다. 백엔드 API가 나오기 전까지는 가짜 데이터로 개발한다.

Expo 공통 규칙(문서 확인, `npx expo install`, 라우트 위치, CNG)은 아래 파일을 따른다.
@AGENTS.md

## 스택
- Expo SDK 58, React Native, TypeScript, Expo Router (`src/app/`)
- 스타일: NativeWind v4 (Tailwind CSS v3, `className`). 설정은 `tailwind.config.js`, `src/global.css`
- 상태 관리: Zustand
- 예정(아직 설치 안 함): `@mj-studio/react-native-naver-map`, `expo-calendar`
- 게스트용 무가입 웹 링크는 Expo Web으로 만든다
- 미결정: 길찾기 API, 실시간 반영 방식, 게스트 인증 방식. 결정된 것처럼 코드에 전제하지 말고 먼저 물어본다.

## 폴더 규칙
- `src/app/`: 화면(라우트)만. 컴포넌트, 훅, 유틸은 넣지 않는다.
- `src/components/`: 재사용 UI 컴포넌트. `src/components/ui/`: 버튼, 입력처럼 디자인 시스템 단위 컴포넌트
- `src/hooks/`: 커스텀 훅
- `src/constants/`: 테마, 상수
- `src/lib/`: 순수 로직(빈 시간 계산, 달력 칸 계산 등). UI와 분리해 테스트한다. 테스트 파일은 옆에 `*.test.ts`로 둔다.
- `src/stores/`: Zustand 스토어
- `src/api/`: 서버 호출. 백엔드가 나오기 전까지는 `src/mocks/`의 가짜 데이터를 돌려준다.
- `src/mocks/`: 가짜 데이터

## 작업 방식
- **브랜치:** 기능 하나에 브랜치 하나(`feat/time-grid`, `fix/...`)로 작업하고, 끝나면 PR로 `dev`에 합친다. `dev`가 릴리즈 전까지의 기준 브랜치다(2026-11-18). `main`에는 릴리즈할 때만 `dev`를 합친다. `dev`와 `main`에 직접 커밋하지 않는다. **git worktree는 쓰지 않는다**(Expo는 복사본마다 설치와 빌드를 다시 해야 해서 무겁다).
- **검증:** TDD는 로직(빈 시간 계산 등)에만 적용한다. UI는 iOS 시뮬레이터 스크린샷으로 확인한다.
- **계획 실행:** Superpowers 계획은 기본적으로 `executing-plans`(한 세션에서 이어서 실행)로 한다. 서브에이전트 방식은 요청할 때만.
- 사용자는 VS Code에서 코드를 직접 읽고 고친다. Claude는 코드 생성, 빌드, 개발 서버와 시뮬레이터 실행, 화면 검증을 맡는다.
- 끝났다고 말하기 전에 `npx expo lint`와 `npx tsc --noEmit`을 통과시킨다.

## 코딩 원칙
1. **코딩 전에 생각하기:** 가정을 밝힌다. 해석이 여럿이면 고르지 말고 물어본다. 모르면 멈춘다.
2. **단순하게:** 요청받지 않은 기능, 한 번만 쓰는 추상화, 불필요한 설정을 만들지 않는다.
3. **수술하듯 고치기:** 요청과 관계없는 코드, 주석, 포맷은 건드리지 않는다. 바뀐 줄은 모두 요청과 연결돼야 한다.
4. **목표 기반 실행:** 성공 기준(테스트, 스크린샷)을 먼저 정하고, 검증될 때까지 반복한다.
5. **컴포넌트는 세 층으로, 기준에 맞을 때만 나누기:**
   - `src/components/ui/`: 모양과 상태만 안다. 약속, 사람 같은 도메인을 모른다.
   - `src/components/<기능>/`: 도메인 값을 props로 받는다. 스토어와 API를 직접 읽지 않는다.
   - `src/app/`(화면): 스토어와 API를 읽어 컴포넌트에 연결한다. 계산 로직은 화면 밖 순수 함수로 둔다.
   - 새 컴포넌트로 나누는 것은 (1) 피그마에 컴포넌트로 등록돼 있거나 (2) 두 곳 이상에서 실제로 쓰이거나 (3) 따로 테스트할 상태나 계산이 있을 때다. 아니면 화면 파일 안에 두고, 두 번째로 쓰일 때 꺼낸다.
   - 하지 않는다: 모든 컴포넌트를 데이터 담당과 모양 담당 두 파일로 쪼개기, 컴포넌트마다 전용 훅, 피그마에 없는 변형용 props, 한 번만 쓰는 래퍼.
6. **사람이 읽는 코드:** 사용자가 VS Code에서 코드를 직접 읽고 고친다. 돌아가는 것만으로는 부족하고, 사람이 한 번에 머리에 담을 수 있어야 한다.
   - 한 파일의 책임은 한 줄로 말할 수 있어야 한다. 설명이 "그리고"로 이어지면 파일을 나눈다.
   - 컴포넌트의 단위는 작게 잡는다. 예: `Avatar`는 프로필 동그라미 하나다. 여러 개를 겹친 묶음이나 이름표가 붙은 것은 `Avatar`를 쓰는 다른 컴포넌트로 만든다.
   - 파일은 150줄 안팎이 보통이다. 250줄을 넘으면 책임이 섞였는지 따진다. 함수와 컴포넌트는 한 화면(40~50줄)에 들어오게 한다. 줄 수는 규칙이 아니라 신호다. 줄 수를 맞추려고 한 번만 쓰는 조각으로 쪼개지 않는다(5번).
   - 지금 쓰는 화면이 없는 컴포넌트는 만들지 않는다. 피그마에 있어도 쓰일 때 만든다.
   - 이름은 줄임말 없이, 읽으면 뜻이 나오게 짓는다. 들여쓰기는 3단계까지. 숫자는 이름 붙은 상수로 둔다.
   - 주석은 "왜"만 적는다. 코드가 하는 일을 다시 적지 않는다.
   - 파일은 위에서 아래로 읽힌다: 상수 → 타입 → 주 컴포넌트 → 보조.
   - PR 본문에 새 파일마다 책임 한 줄과 줄 수를 적는다.

## 피그마 ↔ 코드 컴포넌트 대응표
피그마 컴포넌트를 구현하면 여기에 한 줄 추가한다. 이미 있는 컴포넌트는 새로 만들지 말고 재사용한다.

| 피그마 컴포넌트 | 코드 경로 | 기준일 | 비고 |
|---|---|---|---|
| Button/Primary | `src/components/ui/Button.tsx` | 2026-11-17 | Default / Pressed / Disabled, 라벨은 props |
| Button/Social | `src/components/ui/SocialButton.tsx` | 2026-11-17 | Kakao / Google / Naver / Apple. 로고 그림은 `src/components/ui/SocialLogo.tsx` |
| Input/Toggle | `src/components/ui/Toggle.tsx` | 2026-11-17 | Off / On. 전환은 200ms(손잡이 이동 + 바탕 페이드) |
| Input/Checkbox | `src/components/ui/Checkbox.tsx` | 2026-11-18 | 피그마 State의 Off = checked false, On = tone blue, On-black = tone black. Empty는 만들지 않기로 함 |
| Input/Text | `src/components/ui/TextField.tsx` | 2026-11-18 | Empty / Filled(글자 크기는 값 유무로), 라벨, 도움말, 글자 수, 확인 버튼. 파란 밑줄은 포커스 표시(피그마에 포커스 상태 없음), 200ms 페이드 |
| Icon (icon/*, Illustration/Done) | `src/components/ui/Icon.tsx` | 2026-11-18 | `Icon` name 하나로 전부. 색은 className 글자색 토큰. 탭 아이콘은 home/calendar/user와 `-fill`. `DoneIllustration`은 140 고정. 홈 카드 안의 채운 핀은 `pin-fill` |
| Navigation/Top Bar | `src/components/ui/TopBar.tsx` | 2026-11-18 | Type 6개(status/step/back/share/largeTitle/stepTitle). 상태 표시줄은 safe area로 대신 |
| Navigation/Tab Bar, Navigation/Tab Item | `src/components/ui/TabBar.tsx` | 2026-11-18 | `TabBar`(children) + `TabItem`(icon, selected). 선택 전환은 180ms 페이드. 라우터 연결 없음 |
| Avatar | `src/components/ui/Avatar.tsx` | 2026-11-18 | 프로필 동그라미 하나(`Avatar`: name, photo, size, 테두리). 사진이 없으면 이름 뒤 두 글자(`src/lib/avatarText.ts`). 카메라 버튼, Avatar/Member, Avatar/Group, Avatar/Map Pin은 쓰는 화면이 없어 지움(쓰일 때 `Avatar`를 쓰는 별도 컴포넌트로). Character 세트는 만들지 않음 |
| Tooltip/Recent, Badge/Progress | `src/components/ui/Badge.tsx` | 2026-11-18 | `Tooltip`(label), `ProgressBadge`(count, label) |
| Card/Plan | `src/components/home/PlanCard.tsx` | 2026-11-18 | `plan`, `now`, `onPress`. 라벨은 `src/lib/planLabel.ts`. 확정 전이면 시각·장소 "미정". 얼굴은 앞의 2명 |
| Card/Today | `src/components/home/TodayCard.tsx` | 2026-11-18 | 확정된 오늘 약속(`ConfirmedPlan`)만 받는다. 얼굴 4명 + "외 N명". 얼굴 링(진척도)은 그리지 않음 |
| Title/Page | `src/components/ui/PageTitle.tsx` | 2026-11-18 | 제목 + 부제 |
| List/Summary Item | `src/components/ui/SummaryItem.tsx` | 2026-11-18 | 위 구분선 + "이름 ... 값" |
| Input/Field, Input/Field Group | `src/components/ui/InputField.tsx` | 2026-11-18 | `InputFieldGroup`(children) + `InputField`(selected). 누르는 동작 없음 |
| Card/Option | `src/components/ui/OptionCard.tsx` | 2026-11-18 | 고르기 카드. 체크는 `Checkbox`. 아래 칸(Show Place)은 children |
| List/Place Row | `src/components/ui/PlaceRow.tsx` | 2026-11-18 | Selected / Search. Proposal은 아직 만들지 않음 |
| Calendar/Range, Date Cell/Range | `src/components/ui/RangeCalendar.tsx` | 2026-11-18 | 달 넘기기 포함. 계산은 `src/lib/monthGrid.ts`(달 칸), `src/lib/dateRange.ts`(범위). 칸 상태에 single(원만) 추가 |
| Summary/Create | `src/components/plan-create/CreateSummary.tsx` | 2026-11-18 | 답한 값만 넘긴다. 어떤 값을 보일지는 `src/lib/planDraft.ts`의 `summaryOf` |
| Card/Summary | `src/components/plan-create/PlanSummaryCard.tsx` | 2026-11-18 | `NewPlan`, host, onEdit |
| Character + 입력 완료 체크 | `src/components/ui/CheckedAvatar.tsx` | 2026-11-18 | `Avatar`를 쓰고 체크 원(지름의 28%)만 얹는다. Hub/Members와 List/Member Row 안의 얼굴 |
| List/Member Row | `src/components/ui/MemberRow.tsx` | 2026-11-18 | name, photo, status(회색 글자), checked |
| List/Action Card | `src/components/ui/ActionCard.tsx` | 2026-11-18 | label, onPress. 누르는 동안 살짝 흐려짐(피그마에 없음) |
| Section/Header | `src/components/ui/SectionHeader.tsx` | 2026-11-18 | 제목 + 오른쪽 알약 버튼(더하기 + 글자) |
| Card/Place List | `src/components/ui/PlaceListCard.tsx` | 2026-11-18 | 줄마다 핀, 이름, 오른쪽 회색 글자(예: "태혁 제안"). 줄 사이 구분선 |
| Hub/Members (Collapsed) | `src/components/plan-hub/HubMembers.tsx` | 2026-11-18 | 겹친 얼굴(최대 10) + 입력 현황. 누르면 멤버 모달. 현황 줄은 `plan-hub/MemberProgress.tsx` |
| Hub/Members (Expanded, 모달) | `src/components/plan-hub/MembersModal.tsx` | 2026-11-18 | React Native `Modal`. 최대 높이 화면의 70%, 넘치면 안에서 스크롤 |
