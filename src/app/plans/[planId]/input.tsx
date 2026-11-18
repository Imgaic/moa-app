// 내 입력 (피그마 06 Input). 가능한 날짜와 시간, 그때의 출발지와 이동수단을 묶음으로 넣고 저장하면 허브로 돌아간다.
// 이 파일은 약속과 내 입력을 api로 가져와 단계(큰 달력 → 시간 카드 → 출발지 찾기)에 연결하고, 저장할 때 api로 보낸다.
// 입력 중인 값은 이 화면의 state에 둔다. 출발지 찾기를 다른 라우트가 아니라 화면 안 단계로 열어, 돌아와도 값이 그대로 남는다.
// 입력 값이 바뀌는 규칙은 src/lib/myInputEditing.ts, 묶음 규칙은 src/lib/availabilityGroups.ts, 칸 모양은 src/lib/availabilityCalendar.ts가 정한다.
// 단계별 화면은 src/components/my-input/의 DatePickStep, TimeCardStep이 그린다.
import { router, useLocalSearchParams, usePreventRemove } from 'expo-router';
import { useEffect, useState, type ReactNode } from 'react';
import { KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getMyAvailability, submitMyAvailability, type AvailabilityGroup } from '@/api/availability';
import { getPlan, type PlanDetail } from '@/api/plans';
import { DatePickStep } from '@/components/my-input/DatePickStep';
import { TimeCardStep } from '@/components/my-input/TimeCardStep';
import { PlaceSearch } from '@/components/place/PlaceSearch';
import { Button } from '@/components/ui/Button';
import { LoadStatus } from '@/components/ui/LoadStatus';
import { PageTitle } from '@/components/ui/PageTitle';
import { TopBar } from '@/components/ui/TopBar';
import { usePlaceSearch } from '@/hooks/usePlaceSearch';
import { canSave, hasUnsavedChanges } from '@/lib/availabilityGroups';
import { confirm, notify } from '@/lib/dialogs';
import { toDateKey } from '@/lib/monthGrid';
import {
  closeStep,
  deleteCardGroup,
  pickOrigin,
  startEditing,
  type EditingChange,
  type MyInputEditing,
} from '@/lib/myInputEditing';

// 피그마 기준 위치(2026-11-18). 출발지 찾기는 상단 바 아래 20에 제목. 저장 버튼은 위 12, 아래는 홈 인디케이터 위 3.
const TITLE_TOP = 20;
const BUTTON_BOTTOM = 3;
const BUTTON_TOP = 12;

type Loaded =
  | { state: 'loading' }
  | { state: 'error' }
  | { state: 'missing' }
  | { state: 'done'; plan: PlanDetail; saved: AvailabilityGroup[] };

export default function MyInput() {
  const { planId } = useLocalSearchParams<{ planId: string }>();
  const [loaded, setLoaded] = useState<Loaded>({ state: 'loading' });

  useEffect(() => {
    Promise.all([getPlan(planId), getMyAvailability(planId)])
      .then(([plan, saved]) => setLoaded(plan ? { state: 'done', plan, saved } : { state: 'missing' }))
      .catch(() => setLoaded({ state: 'error' }));
  }, [planId]);

  if (loaded.state !== 'done') {
    return (
      <View className="flex-1 bg-gray-10">
        <TopBar type="back" onBack={() => router.back()} />
        <LoadStatus state={loaded.state} errorText="일정을 불러오지 못했어요" missingText="약속을 찾을 수 없어요" />
      </View>
    );
  }
  return <MyInputEditor plan={loaded.plan} saved={loaded.saved} />;
}

// 고치는 중인 값을 들고, 저장 안 한 채 나가는 것을 막고, 저장한다.
function MyInputEditor({ plan, saved }: { plan: PlanDetail; saved: AvailabilityGroup[] }) {
  const { bottom } = useSafeAreaInsets();
  const [editing, setEditing] = useState(() => startEditing(saved, plan.dateRange));
  const [saving, setSaving] = useState(false);
  // 저장했거나 버리기로 한 뒤에는 나가는 것을 막지 않는다.
  const [leaving, setLeaving] = useState(false);

  const { groups, pickedDates, card } = editing;
  const unsaved = hasUnsavedChanges(saved, groups, pickedDates) || card !== null;

  // 뒤로 가기(버튼, 스와이프, Android 뒤로)는 열린 단계를 먼저 닫고, 저장 안 한 입력이 있으면 확인 창을 띄운다.
  const stopPreventing = usePreventRemove(!leaving && unsaved, ({ repeat }) => {
    if (card) return setEditing(closeStep);
    confirm({
      title: '저장하지 않고 나갈까요?',
      message: '입력한 일정이 저장되지 않아요.',
      confirmLabel: '나가기',
    }).then((discard) => {
      if (!discard) return;
      setLeaving(true);
      repeat();
    });
  });

  const save = async () => {
    setSaving(true);
    try {
      await submitMyAvailability(plan.id, groups);
      setLeaving(true);
      // leaving은 다음에 그릴 때 반영되므로, 바로 돌아갈 수 있게 막기를 지금 푼다(usePreventRemove 문서의 방법).
      stopPreventing();
      router.back();
    } catch {
      setSaving(false);
      notify('저장하지 못했어요', '잠시 뒤에 다시 시도해 주세요.');
    }
  };

  const saveButton = (
    <View className="px-[23.5px]" style={{ paddingTop: BUTTON_TOP, paddingBottom: bottom + BUTTON_BOTTOM }}>
      <Button label="저장" disabled={!canSave(groups, pickedDates, card !== null) || saving} onPress={save} />
    </View>
  );

  return (
    <InputStep
      range={plan.dateRange}
      editing={editing}
      onChange={setEditing}
      onBack={() => router.back()}
      footer={saveButton}
    />
  );
}

type InputStepProps = {
  range: PlanDetail['dateRange'];
  editing: MyInputEditing;
  onChange: (change: EditingChange) => void;
  onBack: () => void;
  footer: ReactNode;
};

// 열린 단계에 맞는 화면을 고른다: 출발지 찾기, 아니면 상단 바와 저장 버튼 사이에 시간 카드나 큰 달력.
function InputStep({ range, editing, onChange, onBack, footer }: InputStepProps) {
  const [today] = useState(() => toDateKey(new Date()));
  const { card, month } = editing;

  const deleteGroup = async () => {
    const ok = await confirm({ title: '이 일정을 지울까요?', message: '저장하면 반영돼요.', confirmLabel: '지우기' });
    if (ok) onChange(deleteCardGroup);
  };

  if (card?.searchingOrigin) {
    return (
      <OriginSearch
        onBack={() => onChange(closeStep)}
        onPick={(origin) => onChange((current) => pickOrigin(current, origin))}
      />
    );
  }
  const step = { range, today, editing, onChange };
  return (
    <View className="flex-1 bg-gray-10">
      {card ? (
        <TopBar type="stepTitle" title={`${month.year}년 ${month.month}월`} onBack={() => onChange(closeStep)} />
      ) : (
        <TopBar type="back" onBack={onBack} />
      )}
      <ScrollView className="flex-1" contentContainerClassName="px-[32px] pb-[24px]">
        {card ? <TimeCardStep {...step} card={card} onDelete={deleteGroup} /> : <DatePickStep {...step} />}
      </ScrollView>
      {footer}
    </View>
  );
}

// 출발지 찾기. 피그마에 화면이 없어 장소 제안과 같은 임시 모양이고 제목과 부제는 임시 문구다.
function OriginSearch({ onBack, onPick }: { onBack: () => void; onPick: Parameters<typeof PlaceSearch>[0]['onPick'] }) {
  const { query, changeQuery, places } = usePlaceSearch();
  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1 bg-gray-10">
      <TopBar type="back" onBack={onBack} />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[32px] pb-[24px] gap-[46px]"
        contentContainerStyle={{ paddingTop: TITLE_TOP }}
        keyboardShouldPersistTaps="handled">
        <PageTitle title="출발지 찾기" subtitle="이 날짜에 출발할 곳을 검색하세요" />
        <PlaceSearch query={query} onChangeQuery={changeQuery} places={places} onPick={onPick} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
