// 약속 만들기 (피그마 03 Create). 이름 → 시간 길이 → 날짜 범위 → 장소 → 요약과 공유.
// 피그마에서 단계마다 위의 제목과 아래 요약 줄은 그대로이고 가운데 본문만 바뀌어, 한 화면 안에서 단계 상태로 넘긴다.
// 이 파일은 입력값을 들고 단계 본문 컴포넌트에 연결하고, 마지막에 api로 약속을 만들어 공유한다.
// 단계의 순서와 조건은 src/lib/planDraft.ts가 정한다.
import { router, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, ScrollView, Share, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getMe } from '@/api/me';
import { createPlan, type PlanMember } from '@/api/plans';
import { searchPlaces, type Place } from '@/api/places';
import { CreateSummary } from '@/components/plan-create/CreateSummary';
import { DateRangePicker } from '@/components/plan-create/DateRangePicker';
import { DurationPicker } from '@/components/plan-create/DurationPicker';
import { PlaceOptions } from '@/components/plan-create/PlaceOptions';
import { PlaceSearch } from '@/components/plan-create/PlaceSearch';
import { PlanSummaryCard } from '@/components/plan-create/PlanSummaryCard';
import { Button } from '@/components/ui/Button';
import { PageTitle } from '@/components/ui/PageTitle';
import { TextField } from '@/components/ui/TextField';
import { TopBar } from '@/components/ui/TopBar';
import { pickRangeDate } from '@/lib/dateRange';
import { toDateKey } from '@/lib/monthGrid';
import {
  EMPTY_DRAFT,
  isStepComplete,
  nextStep,
  previousStep,
  summaryOf,
  TITLE_MAX_LENGTH,
  toNewPlan,
  type CreateStep,
  type PlanDraft,
} from '@/lib/planDraft';

// 피그마 기준 위치(2026-11-18). 상단 바 아래 20에 제목, 제목 아래 46에 본문(이름 칸만 31).
const TITLE_TOP = 20;
const BODY_TOP = 46;
const NAME_BODY_TOP = 31;
// 요약 줄과 버튼 사이 50, 버튼 아래는 홈 인디케이터 위 3
const BUTTON_TOP = 50;
const BUTTON_BOTTOM = 3;

const TEXT: Record<CreateStep, { title: string; subtitle: string; button?: string }> = {
  name: { title: '약속 만들기', subtitle: '약속 이름을 입력하세요', button: '다음' },
  duration: { title: '약속 만들기', subtitle: '모임에 필요한 시간을 입력하세요', button: '다음' },
  dateRange: { title: '약속 만들기', subtitle: '가능한 날짜 범위를 입력하세요', button: '다음' },
  place: { title: '약속 만들기', subtitle: '장소를 입력하세요', button: '다음' },
  // 피그마에 없는 화면이라 문구를 임시로 정했다.
  placeSearch: { title: '장소 찾기', subtitle: '약속 장소를 검색하세요' },
  share: { title: '약속 공유하기', subtitle: '친구들과 공유해 일정을 조율해요.', button: '공유하기' },
};

export default function NewPlanScreen() {
  const { bottom } = useSafeAreaInsets();
  const [today] = useState(() => toDateKey(new Date()));
  const [step, setStep] = useState<CreateStep>('name');
  const [draft, setDraft] = useState<PlanDraft>(EMPTY_DRAFT);
  const [host, setHost] = useState<PlanMember | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    getMe().then(setHost).catch(() => setHost(null));
  }, []);

  const change = (patch: Partial<PlanDraft>) => setDraft((current) => ({ ...current, ...patch }));
  const text = TEXT[step];
  const goBack = () => {
    const previous = previousStep(step);
    if (previous) setStep(previous);
    else router.back();
  };

  const createAndShare = async () => {
    const newPlan = toNewPlan(draft);
    if (!newPlan) return;
    setCreating(true);
    try {
      const { plan, inviteLink } = await createPlan(newPlan);
      // 공유를 마쳤든 닫았든 약속 허브로 간다. 만들기 화면은 뒤로 가기 기록에서 뺀다.
      await Share.share({ message: inviteLink }).catch(() => undefined);
      router.replace({ pathname: '/plans/[planId]', params: { planId: plan.id } });
    } catch {
      setCreating(false);
      Alert.alert('약속을 만들지 못했어요', '잠시 뒤에 다시 시도해 주세요.');
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1 bg-gray-10">
      {/* 단계 중간에 스와이프로 나가면 입력이 사라지니, 첫 단계에서만 스와이프 뒤로 가기를 허용한다. */}
      <Stack.Screen options={{ gestureEnabled: step === 'name' }} />
      <TopBar type="back" onBack={goBack} />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[32px] pb-[24px]"
        contentContainerStyle={{ paddingTop: TITLE_TOP }}
        keyboardShouldPersistTaps="handled">
        <PageTitle title={text.title} subtitle={text.subtitle} />
        <View style={{ marginTop: step === 'name' ? NAME_BODY_TOP : BODY_TOP }}>
          <StepBody
            step={step}
            draft={draft}
            today={today}
            host={host}
            onChange={change}
            onStep={setStep}
          />
        </View>
      </ScrollView>

      <View className="px-[32px]">
        <CreateSummary {...summaryOf(step, draft)} />
      </View>
      {text.button ? (
        <View className="px-[23.5px]" style={{ paddingTop: BUTTON_TOP, paddingBottom: bottom + BUTTON_BOTTOM }}>
          <Button
            label={text.button}
            disabled={!isStepComplete(step, draft) || creating}
            onPress={step === 'share' ? createAndShare : () => setStep(nextStep(step))}
          />
        </View>
      ) : null}
    </KeyboardAvoidingView>
  );
}

type StepBodyProps = {
  step: CreateStep;
  draft: PlanDraft;
  today: string;
  host: PlanMember | null;
  onChange: (patch: Partial<PlanDraft>) => void;
  onStep: (step: CreateStep) => void;
};

// 단계마다 가운데 본문
function StepBody({ step, draft, today, host, onChange, onStep }: StepBodyProps) {
  switch (step) {
    case 'name':
      return (
        <TextField
          value={draft.title}
          onChangeText={(title) => onChange({ title })}
          maxLength={TITLE_MAX_LENGTH}
          placeholder="약속 이름"
          helper="2~10자로 입력해 주세요."
        />
      );
    case 'duration':
      return (
        <DurationPicker
          minutes={draft.durationMinutes}
          onChange={(durationMinutes) => onChange({ durationMinutes })}
        />
      );
    case 'dateRange':
      return (
        <DateRangePicker
          range={draft.dateRange}
          today={today}
          onChange={(key) => onChange({ dateRange: pickRangeDate(draft.dateRange, key) })}
        />
      );
    case 'place':
      return (
        <PlaceOptions
          mode={draft.placeMode}
          place={draft.fixedPlace}
          onChangeMode={(placeMode) => onChange({ placeMode })}
          onSearchPlace={() => onStep('placeSearch')}
        />
      );
    case 'placeSearch':
      return (
        <PlaceSearchStep
          onPick={(fixedPlace) => {
            onChange({ fixedPlace });
            onStep('place');
          }}
        />
      );
    case 'share': {
      const newPlan = toNewPlan(draft);
      return newPlan ? <PlanSummaryCard plan={newPlan} host={host} onEdit={() => onStep('name')} /> : null;
    }
  }
}

// 장소 찾기: 검색어가 바뀔 때마다 api에서 결과를 받아 온다.
function PlaceSearchStep({ onPick }: { onPick: (place: Place) => void }) {
  const [query, setQuery] = useState('');
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

  return <PlaceSearch query={query} onChangeQuery={changeQuery} places={places} onPick={onPick} />;
}
