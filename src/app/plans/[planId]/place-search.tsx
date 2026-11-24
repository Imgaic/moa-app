// 장소 제안 (허브의 "+ 장소 제안"). 장소를 찾아 고르면 제안을 등록하고 허브로 돌아간다.
// 피그마에 화면이 없어 약속 만들기의 임시 장소 찾기와 같은 모양이다. 제목과 부제는 임시 문구다.
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, View } from 'react-native';

import type { Place } from '@/api/places';
import { proposePlace } from '@/api/proposals';
import { PlaceSearch } from '@/components/place/PlaceSearch';
import { PageTitle } from '@/components/ui/PageTitle';
import { TopBar } from '@/components/ui/TopBar';
import { usePlaceSearch } from '@/hooks/usePlaceSearch';
import { useScrollEndPadding } from '@/hooks/useScrollEndPadding';
import { notify } from '@/lib/dialogs';

// 약속 만들기와 같은 위치(2026-11-18). 상단 바 아래 20에 제목, 제목 아래 46에 검색 칸.
const TITLE_TOP = 20;
const BODY_TOP = 46;

export default function ProposePlace() {
  const { planId } = useLocalSearchParams<{ planId: string }>();
  const { query, changeQuery, places } = usePlaceSearch();
  const scrollEndPadding = useScrollEndPadding();
  const [sending, setSending] = useState(false);

  const propose = async (place: Place) => {
    // 등록하는 동안 다른 장소를 또 누르면 두 번 제안되지 않게 한다.
    if (sending) return;
    setSending(true);
    try {
      await proposePlace(planId, place);
      router.back();
    } catch {
      setSending(false);
      notify('제안하지 못했어요', '잠시 뒤에 다시 시도해 주세요.');
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1 bg-gray-10">
      <TopBar type="back" onBack={() => router.back()} />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[32px]"
        contentContainerStyle={{ paddingTop: TITLE_TOP, paddingBottom: scrollEndPadding }}
        keyboardShouldPersistTaps="handled">
        <PageTitle title="장소 제안" subtitle="함께 갈 만한 장소를 검색하세요" />
        <View style={{ marginTop: BODY_TOP }}>
          <PlaceSearch query={query} onChangeQuery={changeQuery} places={places} onPick={propose} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
