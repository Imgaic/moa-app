// 약속 홈 (피그마 02 Home / Home, 약속이 없으면 Home - Empty). 약속 목록을 가져와 카드에 연결만 한다.
// 어떤 약속을 어디에 둘지, 라벨과 날짜 글자는 src/lib/의 함수가 정한다.
import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

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

// 빈 홈(피그마 Home - Empty, 2026-11-19). 그림은 화면보다 넓다(402 화면에 538). 그림자가 화면 가장자리까지 번지게
// 너비를 화면 너비에 비례시키고, 넓은 화면(웹)에서 끝없이 커지지 않게 시안 크기에서 멈춘다.
// 그림은 임시일 수 있다. 바꿀 때는 파일과 비율(MASCOT_ASPECT)만 바꾼다.
const MASCOT = require('@/assets/images/home/empty-mascot.png');
const MASCOT_WIDTH = '134%';
const MASCOT_MAX_WIDTH = 538;
const MASCOT_ASPECT = 538 / 222;
const MASCOT_TO_TITLE = 83;
const TITLE_GAP = 9;
const TITLE_TO_BUTTON = 24;
const BUTTON_SHADOW = '0px 0px 4.5px 0px rgba(0, 0, 0, 0.15)';

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
        // 개발 중에는 src/mocks/plans.ts의 MOCK_EMPTY_PLANS를 true로 바꿔 본다.
        <EmptyHome onCreate={() => router.push('/plans/new')} />
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

// 가운데 정렬이지만 화면 높이가 모자라면(작은 폰) 스크롤된다. 그림 너비(%)가 화면 너비 기준이 되게 바깥에는 좌우 여백을 두지 않는다.
function EmptyHome({ onCreate }: { onCreate: () => void }) {
  return (
    <ScrollView contentContainerClassName="flex-grow items-center justify-center py-[24px]">
      <Image
        source={MASCOT}
        contentFit="contain"
        accessible={false}
        style={{ width: MASCOT_WIDTH, maxWidth: MASCOT_MAX_WIDTH, aspectRatio: MASCOT_ASPECT }}
      />
      <View className="items-center px-[24px]" style={{ marginTop: MASCOT_TO_TITLE, gap: TITLE_GAP }}>
        <Text accessibilityRole="header" className="font-pretendard text-h2 text-gray-50 text-center">
          아직 약속이 없어요
        </Text>
        <Text className="font-pretendard text-caption-14 text-gray-30 text-center">
          약속을 만들고 여러 사람과의 약속을 조율해요
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="약속 만들기"
        onPress={onCreate}
        className="rounded-full bg-white px-[16px] py-[10px] active:opacity-70"
        style={{ marginTop: TITLE_TO_BUTTON, boxShadow: BUTTON_SHADOW }}>
        <Text className="font-pretendard text-body2 font-bold text-gray-50">약속 만들기</Text>
      </Pressable>
    </ScrollView>
  );
}
