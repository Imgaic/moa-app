// 약속 홈 (피그마 02 Home / Home). 약속 목록을 가져와 카드에 연결만 한다.
// 어떤 약속을 어디에 둘지, 라벨과 날짜 글자는 src/lib/의 함수가 정한다.
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { getPlans, type Plan } from '@/api/plans';
import { PlanCard } from '@/components/home/PlanCard';
import { TodayCard } from '@/components/home/TodayCard';
import { LoadStatus } from '@/components/ui/LoadStatus';
import { TopBar } from '@/components/ui/TopBar';
import { splitHomePlans } from '@/lib/homePlans';

// 피그마 기준 위치(2026-11-18). 상단 바 아래 오늘의 약속, 그 아래 28에 "다음 약속", 다시 9 아래에 목록.
const CONTENT_TOP = 14.5;
const SECTION_TOP = 28;
const LIST_GAP = 11;

type Loaded =
  | { state: 'loading' }
  | { state: 'error' }
  // now: 라벨("10분 후")을 계산한 기준 시각. 불러온 시점으로 고정한다.
  | { state: 'done'; plans: Plan[]; now: Date };

export default function Home() {
  const [loaded, setLoaded] = useState<Loaded>({ state: 'loading' });

  // 화면에 돌아올 때마다 다시 불러온다(약속을 만들고 돌아오면 새 약속이 보이게). 불러오는 동안은 앞의 목록을 그대로 둔다.
  useFocusEffect(
    useCallback(() => {
      getPlans()
        .then((plans) => setLoaded({ state: 'done', plans, now: new Date() }))
        .catch(() => setLoaded({ state: 'error' }));
    }, []),
  );

  return (
    <View className="flex-1 bg-gray-10">
      <TopBar type="largeTitle" title="약속" onAction={() => router.push('/plans/new')} />
      {loaded.state !== 'done' ? (
        <LoadStatus state={loaded.state} errorText="약속을 불러오지 못했어요" />
      ) : loaded.plans.length === 0 ? (
        // 임시 빈 상태(docs/open-questions.md T1): 상단 바와 탭 바만 보인다. 빈 상태 디자인이 나오면 바꾼다.
        // 개발 중에는 src/mocks/plans.ts의 MOCK_EMPTY_PLANS를 true로 바꿔 본다.
        null
      ) : (
        <HomePlans plans={loaded.plans} now={loaded.now} />
      )}
    </View>
  );
}

function HomePlans({ plans, now }: { plans: Plan[]; now: Date }) {
  const { today, upcoming } = splitHomePlans(plans, now);
  const openPlan = (planId: string) =>
    router.push({ pathname: '/plans/[planId]', params: { planId } });

  return (
    <ScrollView contentContainerClassName="px-[16px] pb-[24px]" contentContainerStyle={{ paddingTop: CONTENT_TOP }}>
      {today ? <TodayCard plan={today} now={now} onPress={() => openPlan(today.id)} /> : null}

      {upcoming.length > 0 ? (
        <>
          <View
            className="ml-[13px] mb-[9px] flex-row gap-[7px]"
            style={{ marginTop: today ? SECTION_TOP : 0 }}>
            <Text className="font-pretendard text-body2 text-gray-50">다음 약속</Text>
            <Text className="font-pretendard text-body2 text-gray-30">{upcoming.length}</Text>
          </View>
          <View style={{ gap: LIST_GAP }}>
            {upcoming.map((plan) => (
              <PlanCard key={plan.id} plan={plan} now={now} onPress={() => openPlan(plan.id)} />
            ))}
          </View>
        </>
      ) : null}
    </ScrollView>
  );
}
