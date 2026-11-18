// 내 입력 (피그마 06 Input). 가능한 날짜와 시간, 그때의 출발지와 이동수단을 묶음으로 넣고 저장하면 허브로 돌아간다.
// 이 파일은 약속과 내 입력을 api로 가져와 단계(큰 달력 → 시간 카드 → 출발지 찾기)에 연결하고, 저장할 때 api로 보낸다.
// 입력 중인 값은 이 화면의 state에 둔다. 출발지 찾기를 다른 라우트가 아니라 화면 안 단계로 열어, 돌아와도 값이 그대로 남는다.
// 묶음 규칙은 src/lib/availabilityGroups.ts, 칸 모양은 src/lib/availabilityCalendar.ts가 정한다.
import { router, useLocalSearchParams, usePreventRemove } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getMyAvailability, submitMyAvailability, type AvailabilityGroup } from '@/api/availability';
import { getPlan, type PlanDetail } from '@/api/plans';
import { GroupSummaryList } from '@/components/my-input/GroupSummaryList';
import { TimeInputCard } from '@/components/my-input/TimeInputCard';
import { PlaceSearch } from '@/components/place/PlaceSearch';
import { Button } from '@/components/ui/Button';
import { CompactCalendar } from '@/components/ui/CompactCalendar';
import { MonthCalendar } from '@/components/ui/MonthCalendar';
import { PageTitle } from '@/components/ui/PageTitle';
import { TopBar } from '@/components/ui/TopBar';
import { usePlaceSearch } from '@/hooks/usePlaceSearch';
import { dayCellLook } from '@/lib/availabilityCalendar';
import {
  canConfirmGroup,
  canSave,
  hasUnsavedChanges,
  newGroupDraft,
  removeGroup,
  toGroup,
  toGroupDraft,
  upsertGroup,
  type GroupDraft,
} from '@/lib/availabilityGroups';
import { confirm, notify } from '@/lib/dialogs';
import { addMonths, isEarlierMonth, toDateKey, yearMonthOf, type YearMonth } from '@/lib/monthGrid';
import { togglePickedDate } from '@/lib/pickedDates';

// 피그마 기준 위치(2026-11-18). 상단 바 아래 20에 제목, 시간 카드 단계는 바 아래 22에 작은 달력, 그 아래 5에 카드.
const TITLE_TOP = 20;
const COMPACT_TOP = 22;
const CARD_TOP = 5;
const LIST_TOP = 10;
const BUTTON_BOTTOM = 3;
const BUTTON_TOP = 12;

type Loaded =
  | { state: 'loading' }
  | { state: 'error' }
  | { state: 'missing' }
  | { state: 'done'; plan: PlanDetail; saved: AvailabilityGroup[] };

// 시간 카드에서 고치는 묶음. index가 null이면 새 묶음이다.
type Editing = { index: number | null; draft: GroupDraft };

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
        {loaded.state === 'loading' ? (
          <ActivityIndicator className="mt-[40px]" />
        ) : (
          <Text className="mt-[40px] text-center font-pretendard text-body2 text-gray-40">
            {loaded.state === 'missing' ? '약속을 찾을 수 없어요' : '일정을 불러오지 못했어요'}
          </Text>
        )}
      </View>
    );
  }
  return <MyInputEditor plan={loaded.plan} saved={loaded.saved} />;
}

function MyInputEditor({ plan, saved }: { plan: PlanDetail; saved: AvailabilityGroup[] }) {
  const { bottom } = useSafeAreaInsets();
  const [today] = useState(() => toDateKey(new Date()));
  const [month, setMonth] = useState<YearMonth>(() => yearMonthOf(saved[0]?.dates[0] ?? plan.dateRange.start));
  const [groups, setGroups] = useState(saved);
  const [picked, setPicked] = useState<string[]>([]);
  const [editing, setEditing] = useState<Editing | null>(null);
  const [searchingOrigin, setSearchingOrigin] = useState(false);
  const [saving, setSaving] = useState(false);
  // 저장했거나 버리기로 한 뒤에는 나가는 것을 막지 않는다.
  const [leaving, setLeaving] = useState(false);

  const range = plan.dateRange;
  const unsaved = hasUnsavedChanges(saved, groups, picked) || editing !== null;

  const closeCard = useCallback(() => {
    // 새 묶음의 카드를 닫으면 고른 날짜는 큰 달력에 남겨 둔다.
    if (editing?.index === null) setPicked(editing.draft.dates);
    setEditing(null);
  }, [editing]);

  // 뒤로 가기(버튼, 스와이프, Android 뒤로)는 열린 단계를 먼저 닫고, 저장 안 한 입력이 있으면 확인 창을 띄운다.
  usePreventRemove(!leaving && (unsaved || searchingOrigin), ({ repeat }) => {
    if (searchingOrigin) return setSearchingOrigin(false);
    if (editing) return closeCard();
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

  const changeDraft = (patch: Partial<GroupDraft>) =>
    setEditing((current) => current && { ...current, draft: { ...current.draft, ...patch } });

  const openNew = () => {
    setEditing({ index: null, draft: newGroupDraft(picked) });
    setPicked([]);
  };

  const openGroup = (index: number) => {
    setMonth(yearMonthOf(groups[index].dates[0]));
    setEditing({ index, draft: toGroupDraft(groups[index]) });
  };

  const confirmGroup = () => {
    const group = editing && toGroup(editing.draft);
    if (!editing || !group) return;
    setGroups(upsertGroup(groups, editing.index, group));
    setEditing(null);
  };

  const deleteGroup = async (index: number) => {
    const ok = await confirm({ title: '이 일정을 지울까요?', message: '저장하면 반영돼요.', confirmLabel: '지우기' });
    if (!ok) return;
    setGroups(removeGroup(groups, index));
    setEditing(null);
  };

  const save = async () => {
    setSaving(true);
    try {
      await submitMyAvailability(plan.id, groups);
      // leaving이 반영되어 나가기를 막지 않게 된 뒤에 허브로 돌아간다.
      setLeaving(true);
      setTimeout(() => router.back(), 0);
    } catch {
      setSaving(false);
      notify('저장하지 못했어요', '잠시 뒤에 다시 시도해 주세요.');
    }
  };

  const saveButton = (
    <View className="px-[23.5px]" style={{ paddingTop: BUTTON_TOP, paddingBottom: bottom + BUTTON_BOTTOM }}>
      <Button label="저장" disabled={!canSave(groups, picked, editing !== null) || saving} onPress={save} />
    </View>
  );

  if (searchingOrigin && editing) {
    return (
      <OriginSearch
        onBack={() => setSearchingOrigin(false)}
        onPick={(origin) => {
          changeDraft({ origin });
          setSearchingOrigin(false);
        }}
      />
    );
  }

  if (editing) {
    // 고치는 묶음의 날짜는 고른 모양으로, 나머지 묶음은 막대로 보인다.
    const others = editing.index === null ? groups : removeGroup(groups, editing.index);
    return (
      <View className="flex-1 bg-gray-10">
        <TopBar type="stepTitle" title={`${month.year}년 ${month.month}월`} onBack={closeCard} />
        <ScrollView className="flex-1" contentContainerClassName="px-[32px] pb-[24px]">
          <View style={{ marginTop: COMPACT_TOP }}>
            <CompactCalendar
              month={month}
              lookOf={(day) => dayCellLook(day, { range, picked: editing.draft.dates, groups: others, today })}
              onPressDay={(key) =>
                setEditing(
                  (current) =>
                    current && {
                      ...current,
                      draft: { ...current.draft, dates: togglePickedDate(current.draft.dates, key, range) },
                    },
                )
              }
            />
          </View>
          <View style={{ marginTop: CARD_TOP }}>
            <TimeInputCard
              draft={editing.draft}
              canConfirm={canConfirmGroup(editing.draft)}
              onChange={changeDraft}
              onClose={closeCard}
              onConfirm={confirmGroup}
              onPickOrigin={() => setSearchingOrigin(true)}
              onDelete={editing.index === null ? undefined : () => deleteGroup(editing.index!)}
            />
          </View>
        </ScrollView>
        {saveButton}
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-10">
      <TopBar type="back" onBack={() => router.back()} />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[32px] pb-[24px]"
        contentContainerStyle={{ paddingTop: TITLE_TOP }}>
        <PageTitle title="가능한 일정 선택" subtitle="본인 외 다른 사람은 볼 수 없어요." />
        <MonthCalendar
          month={month}
          canGoBack={isEarlierMonth(yearMonthOf(range.start), month)}
          canGoForward={isEarlierMonth(month, yearMonthOf(range.end))}
          onChangeMonth={(step) => setMonth(addMonths(month, step))}
          lookOf={(day) => dayCellLook(day, { range, picked, groups, today })}
          onPressDay={(key) => setPicked((current) => togglePickedDate(current, key, range))}
        />
        <View style={{ marginTop: LIST_TOP }}>
          <GroupSummaryList groups={groups} pickedDates={picked} onOpenNew={openNew} onOpenGroup={openGroup} />
        </View>
      </ScrollView>
      {saveButton}
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
