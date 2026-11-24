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
- `src/stores/`: Zustand 스토어. 여러 화면이 같은 값을 보고 바뀐 것을 알아야 할 때만 만든다. `authStage.ts`: 로그인 단계(루트 레이아웃의 보호된 라우트가 읽는다. 원본은 `src/api/auth.ts`)
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
7. **어느 폰에서도 깨지지 않는 배치:** 피그마 시안은 너비 하나(402)와 짧은 예시 글자만 그린 것이다. 실제 폰은 더 좁고(320, 360), 이름과 장소는 더 길다(2026-11-18, 실제 폰에서 겹침과 잘림이 나와서 추가).
   - 배치는 흐르게 짠다: 한 줄에 나란히 놓고, 남는 공간은 늘어나는 쪽이 가져간다. 피그마가 좌표만 주어도 "왼쪽 묶음, 오른쪽 묶음" 같은 의도를 읽어 옮긴다.
   - 고정 좌표(absolute)는 겹쳐 그리는 요소에만 쓴다(체크 표시, 티켓의 파인 곳, 화면 덮개). 글자와 글자, 글자와 얼굴을 고정 좌표로 나란히 놓지 않는다.
   - 사용자나 서버가 주는 글자(이름, 제목, 장소)는 길 수 있다. 자리가 모자랄 때 무엇이 줄고("…") 무엇이 그대로 남는지 정해 둔다. 정해진 것이 없으면 가장 단순하게 정하고 `docs/open-questions.md`에 적는다.
   - 화면은 기준 너비(402)와 함께 좁은 너비(320, 360), 긴 글자, 많은 인원으로도 확인한다. 시안과 1픽셀까지 같은 것보다 모든 너비에서 깨지지 않는 것이 먼저다.
   - 화면 맨 아래까지 닿는 내용은 기기의 아래 여백(safe area)만큼 띄운다. 안드로이드 3버튼 내비게이션과 아이폰 홈 인디케이터에 가려지지 않게.

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
| Card/Plan | `src/components/home/PlanCard.tsx` | 2026-11-18 | `plan`, `now`, `onPress`. 라벨은 `src/lib/planLabel.ts`. 확정 전이면 시각·장소 "미정". 얼굴은 앞의 2명. 줄 두 개(머리, 본문)가 흐르는 배치다. 좁으면 구분선 양옆의 틈이 먼저 줄고, 제목과 장소 이름이 "…"로 준다(라벨, 시각, 날짜, 얼굴은 그대로) |
| Card/Today | `src/components/home/TodayCard.tsx` | 2026-11-18 | 확정된 오늘 약속(`ConfirmedPlan`)만 받는다. 얼굴 4명 + "외 N명". 좁은 화면에서는 들어가는 만큼만 그리고 나머지는 "외 N명"에(`src/lib/fittingCount.ts`). 얼굴 링(진척도)은 그리지 않음. 줄 네 개(머리, 시각·장소, 점선, 얼굴)가 흐르는 배치이고 고정 좌표는 티켓의 파인 곳뿐이다. 좁으면 시각과 장소 사이의 틈이 먼저 줄고, 제목과 장소 이름이 "…"로 준다 |
| Title/Page | `src/components/ui/PageTitle.tsx` | 2026-11-18 | 제목 + 부제 |
| List/Summary Item | `src/components/ui/SummaryItem.tsx` | 2026-11-18 | 위 구분선 + "이름 ... 값" |
| Input/Field, Input/Field Group | `src/components/ui/InputField.tsx` | 2026-11-18 | `InputFieldGroup`(children) + `InputField`(selected). 누르는 동작 없음 |
| Card/Option | `src/components/ui/OptionCard.tsx` | 2026-11-18 | 고르기 카드. 체크는 `Checkbox`. 아래 칸(Show Place)은 children |
| List/Place Row | `src/components/ui/PlaceRow.tsx` | 2026-11-18 | Selected / Search. Proposal은 아직 만들지 않음 |
| Calendar/Range, Date Cell/Range | `src/components/ui/RangeCalendar.tsx` | 2026-11-18 | 달 넘기기 포함. 계산은 `src/lib/monthGrid.ts`(달 칸), `src/lib/dateRange.ts`(범위). 칸 상태에 single(원만) 추가. 칸의 낭독기 이름은 `calendarDayLabel`(월, 일, 요일, 오늘) |
| Summary/Create | `src/components/plan-create/CreateSummary.tsx` | 2026-11-18 | 답한 값만 넘긴다. 어떤 값을 보일지는 `src/lib/planDraft.ts`의 `summaryOf` |
| Card/Summary | `src/components/plan-create/PlanSummaryCard.tsx` | 2026-11-18 | `NewPlan`, host, onEdit |
| Character + 입력 완료 체크 | `src/components/ui/CheckedAvatar.tsx` | 2026-11-18 | `Avatar`를 쓰고 체크 원(지름의 28%)만 얹는다. Hub/Members와 List/Member Row 안의 얼굴 |
| List/Member Row | `src/components/ui/MemberRow.tsx` | 2026-11-18 | name, photo, status(회색 글자), checked |
| List/Action Card | `src/components/ui/ActionCard.tsx` | 2026-11-18 | label, onPress. 누르는 동안 살짝 흐려짐(피그마에 없음) |
| Section/Header | `src/components/ui/SectionHeader.tsx` | 2026-11-18 | 제목 + 오른쪽 알약 버튼(더하기 + 글자). 버튼은 `action`이 없으면 없다(피그마 showAction, 추천 후보 머리) |
| Card/Place List | `src/components/ui/PlaceListCard.tsx` | 2026-11-18 | 줄마다 핀, 이름, 오른쪽 회색 글자(예: "태혁 제안"). 줄 사이 구분선 |
| Hub/Members (Collapsed) | `src/components/plan-hub/HubMembers.tsx` | 2026-11-18 | 겹친 얼굴(최대 10, 좁은 화면에서는 들어가는 만큼만. `src/lib/fittingCount.ts`) + 현황. 체크는 `checked`(모집 중 입력, 추천 나옴 투표), 글자는 `doneText`. 누르면 멤버 모달. 현황 줄은 `plan-hub/MemberProgress.tsx` |
| Hub/Members (Expanded, 모달) | `src/components/plan-hub/MembersModal.tsx` | 2026-11-18 | React Native `Modal`. 최대 높이 화면의 70%, 넘치면 안에서 스크롤. 상태 글자는 `texts`(입력 완료/입력 중, 투표 완료/투표 전) |
| Date Cell, Date Cell/Bar | `src/components/ui/MonthDateCell.tsx` | 2026-11-18 | 큰 달력 칸. 고른 모양(single/start/middle/end)은 테두리, 오늘은 날짜 테두리 원, 막대는 Available1~3 최대 3개 + "+". Event(내 일정) 막대는 없음. 낭독기 이름은 `dateKey`로 `src/lib/dateText.ts`의 `calendarDayLabel`("11월 24일 화요일, 오늘, 가능 시간 2개") |
| Date Cell2, Date Cell/Bar Compact | `src/components/ui/CompactDateCell.tsx` | 2026-11-19 | 작은 달력 칸. 원 + 띠(가운데 날은 띠만). 주를 넘는 띠(토 → 일)는 칸 끝, 곧 달력 영역 끝까지 이어진다(2026-11-19 시안 확인). props는 `MonthDateCell`과 같음(낭독기 이름도 같다) |
| Calendar/Month | `src/components/ui/MonthCalendar.tsx` | 2026-11-18 | 왼쪽 위 달 넘기기 + 요일 + 큰 칸. 칸 모양은 `lookOf`로 받음. "내 일정" 토글 없음 |
| Calendar/Compact | `src/components/ui/CompactCalendar.tsx` | 2026-11-18 | 요일 + 작은 칸. 달 이름은 상단 바(stepTitle) |
| (달력 요일 줄) | `src/components/ui/WeekdayRow.tsx` | 2026-11-18 | Calendar/Range, Month, Compact 공용 |
| Card/Date Summary | `src/components/ui/DateSummaryCard.tsx` | 2026-11-18 | caption, label. `tone`을 주면 더하기 대신 막대 색 세로줄(저장된 묶음 줄, 피그마에 없음) |
| Card/Time Input (Editing Toggle) | `src/components/my-input/TimeInputCard.tsx` | 2026-11-18 | 닫기, 날짜 요약, 확인, 시간 선택, 자차 토글, 출발지 줄. Saved 상태(막대 안)는 다음 작업 |
| Card/Time Input 안 time-range | `src/components/ui/TimeRangeTabs.tsx` | 2026-11-18 | 시작/종료 두 칸, 흰 칸이 고치는 쪽 |
| Input/Time Picker | `src/components/my-input/TimeWheelPicker.tsx`, 칸 하나는 `src/components/ui/WheelColumn.tsx` | 2026-11-18 | props는 startMinutes, endMinutes, onChange뿐(막대 안과 바꿔 끼움). 오전·오후 / 시 / 분(5분) |
| List/Origin Row | `src/components/ui/OriginRow.tsx` | 2026-11-18 | name(null이면 "출발 장소"), badge(`GrayBadge`), onPress |
| Input/Time Bar | `src/components/ui/TimeBar.tsx` | 2026-11-19 | 트랙 + 파란 구간 + 손잡이 둘, 그 아래 6에 눈금 글자. props는 `TimeWheelPicker`와 같다. 하루 중 "창"만 보이고 끌기·두 손가락 확대(웹은 휠)로 창이 바뀐다. 동작은 `src/hooks/useTimeBarGestures.ts`, 계산은 `src/lib/timeBarWindow.ts`(창), `timeBarScale.ts`(위치·눈금·스냅), `timeBarDrag.ts`(잡을 대상·손잡이 시각). 낭독기와 키보드는 막대 왼쪽·오른쪽 절반의 보이지 않는 자리(`EdgeAdjuster`, "시작 시각" / "종료 시각")에서 올리기·내리기(웹은 화살표 키)로 한 스냅 간격씩 바꾼다 |
| Card/Time Input (Saved Toggle, 막대 안) | `src/components/my-input/TimeBarPicker.tsx` | 2026-11-19 | 라벨 없는 "오전 10:00 ~ 오후 4:00" 한 줄 + 오른쪽 끝 `GrayBadge` + `TimeBar`. 좁으면 배지가 다음 줄로 내려가고 시각 글자는 줄지 않는다. 배지를 막대 안이 그리는지는 `TimeInputCard`의 `PICKERS`(`badgeInPicker`, T11 비교용 임시 전환 장치와 함께) |
| badge (회색 알약) | `src/components/ui/Badge.tsx`의 `GrayBadge` | 2026-11-19 | label. 출발지 줄 오른쪽(휠 안), 시각 줄 오른쪽(막대 안) |
| Avatar (카메라 버튼이 붙은 큰 프로필) | `src/components/ui/ProfileAvatar.tsx` | 2026-11-18 | `Avatar`(186) + 안쪽 그림자 + Button/Camera. Empty면 "이름". name, photo, onPressCamera |
| Card/Invite | `src/components/join/InviteCard.tsx` | 2026-11-18 | `Invitation`을 받는다. 얼굴 3명(호스트 먼저) + 줄 4개. Card/Summary(`PlanSummaryCard`)와 다른 카드 |
| (참여·온보딩 화면의 프로필 입력) | `src/components/profile/ProfileForm.tsx` | 2026-11-18 | `ProfileAvatar` + 이름 `TextField`. 참여 화면과 온보딩 프로필 화면이 같이 쓴다. 값은 props로 |
| Card/Candidate | `src/components/ui/CandidateCard.tsx` | 2026-11-18 | badge, best(Type=Best), dateTime, place(제목. 자리가 모자라면 줄은 둘 사이에서 바뀌고, 장소 이름은 그 줄에서 "…"로 준다), attendance, everyone(Attendance=All), detail, checked, onPress(없으면 못 누름). 글자는 `src/lib/candidateText.ts`. 제목 두 줄까지, 배지 최소 너비 48. 아랫줄(참석, 이동시간)도 자리가 모자라면 둘 사이에서 줄이 바뀐다 |
| (허브 추천 나옴 내용) | `src/components/plan-hub/RecommendedContent.tsx` | 2026-11-18 | 05 Hub / Host - Recommended - Empty·Voting·Voted. 버튼 규칙은 `src/lib/voteStatus.ts`, 확정 규칙(T2)은 `src/lib/voteResult.ts` |
| 09 Confirm / Done (Illustration/Done 포함) | `src/components/plan-hub/ConfirmedNotice.tsx` | 2026-11-18 | 허브 위에 덮는 화면. 2.5초 뒤 또는 누르면 닫힘. 보일지는 `src/lib/confirmedNotice.ts` |
| (확정 허브, 임시 T4) | `src/components/plan-hub/ConfirmedContent.tsx` | 2026-11-18 | 디자인 없음. List/Summary Item + List/Member Row로 일시, 시간, 장소, 참가자 |
| List/Terms Item | `src/components/ui/TermsItem.tsx` | 2026-11-18 | title, description, checked, onPress, showArrow. 줄 전체를 누르면 체크. 화살표는 누를 수 없는 표시(약관 내용 화면 없음). 규칙은 `src/lib/termsAgreement.ts`, 항목은 `src/constants/terms.ts` |
| (제목 + 본문 + 아래 버튼 화면 틀) | `src/components/ui/StepLayout.tsx` | 2026-11-18 | 피그마 컴포넌트 아님. 참여, 약관, 프로필 화면과 약속 허브의 세 내용이 같이 쓴다. title, subtitle, bodyTop, button(없으면 본문이 화면 끝까지, 아래 여백은 `src/hooks/useScrollEndPadding.ts`), children. 제목도 함께 스크롤된다 |
| (불러오는 중 스피너, 못 불러옴 문구) | `src/components/ui/LoadStatus.tsx` | 2026-11-18 | 피그마 컴포넌트 아님(임시 모양). state(loading/error/missing), errorText, missingText. 홈, 허브, 내 입력, 참여 화면이 같이 쓴다. 불러오기 자체는 화면마다 따로 |
| (내 입력의 단계 내용) | `src/components/my-input/DatePickStep.tsx`(큰 달력), `src/components/my-input/TimeCardStep.tsx`(작은 달력 + 시간 카드) | 2026-11-18 | 상단 바, 스크롤, 저장 버튼은 화면이 두른다. 값이 바뀌는 규칙은 `src/lib/myInputEditing.ts` |
| 02 Home / Home - Empty (빈 홈) | `src/app/(tabs)/index.tsx`의 `EmptyHome` | 2026-11-19 | 홈에서만 쓰여 화면 파일 안에 둔다. 캐릭터 그림은 `assets/images/home/empty-mascot.png` 한 장(바꿀 때 파일과 `MASCOT_ASPECT`만). 그림 너비는 화면의 134%(최대 538), 넘치면 양옆이 잘린다. "약속 만들기" 알약 버튼은 `SectionHeader`의 버튼과 모양이 달라(더하기 없음, 굵은 16, 그림자) 따로 둔다. 확인은 `src/mocks/plans.ts`의 `MOCK_EMPTY_PLANS` |
