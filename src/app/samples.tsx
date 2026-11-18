// 토큰과 UI 컴포넌트 견본을 보는 개발용 임시 화면이다. 주소(/samples)로만 연다. 실제 화면이 다 만들어지면 지운다.
import { useState, type ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionCard } from '@/components/ui/ActionCard';
import { Avatar } from '@/components/ui/Avatar';
import { ProgressBadge, Tooltip } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CheckedAvatar } from '@/components/ui/CheckedAvatar';
import { CandidateCard } from '@/components/ui/CandidateCard';
import { Checkbox } from '@/components/ui/Checkbox';
import { CompactDateCell } from '@/components/ui/CompactDateCell';
import { DoneIllustration, Icon, type IconName } from '@/components/ui/Icon';
import { InputField, InputFieldGroup } from '@/components/ui/InputField';
import { MemberRow } from '@/components/ui/MemberRow';
import { MonthDateCell, type DateCellProps } from '@/components/ui/MonthDateCell';
import { OptionCard } from '@/components/ui/OptionCard';
import { PageTitle } from '@/components/ui/PageTitle';
import { PlaceListCard } from '@/components/ui/PlaceListCard';
import { PlaceRow } from '@/components/ui/PlaceRow';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';
import { RangeCalendar } from '@/components/ui/RangeCalendar';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SocialButton } from '@/components/ui/SocialButton';
import { SummaryItem } from '@/components/ui/SummaryItem';
import { TabBar, TabItem, type TabIcon } from '@/components/ui/TabBar';
import { TermsItem } from '@/components/ui/TermsItem';
import { TextField } from '@/components/ui/TextField';
import { TimeBar } from '@/components/ui/TimeBar';
import { Toggle } from '@/components/ui/Toggle';
import { TopBar } from '@/components/ui/TopBar';
import { clockText } from '@/lib/clockTime';
import { EMPTY_RANGE, pickRangeDate } from '@/lib/dateRange';
import { toDateKey } from '@/lib/monthGrid';

const samplePhoto = require('@/assets/images/samples/avatar-photo.png');

const icons: IconName[] = [
  'bus',
  'car',
  'people',
  'pin',
  'camera',
  'back',
  'chevron-right',
  'close',
  'plus',
  'minus',
  'share',
  'check',
];
const tabIcons: IconName[] = ['home', 'home-fill', 'calendar', 'calendar-fill', 'user', 'user-fill'];
const tabs: { icon: TabIcon; label: string }[] = [
  { icon: 'home', label: '홈' },
  { icon: 'calendar', label: '달력' },
  { icon: 'user', label: '내 정보' },
];

// 날짜 칸 견본: 피그마 Date Cell, Date Cell2의 State 순서(기본, 선택, 시작, 중간, 끝, 비활성)와 그 밖의 상태
const noop = () => {};
const CANDIDATE_SAMPLES = [
  {
    badge: '추천 1',
    best: true,
    title: '4월 1일 (수) 오후 7:00 사당역',
    attendance: '4명 모두',
    everyone: true,
    detail: '· 평균 38분 · 최대 42분',
  },
  {
    badge: '추천 3',
    best: false,
    title: '4월 24일 (금) 오후 7:30 사당역',
    attendance: '3명 가능 · 동하 제외',
    everyone: false,
    detail: '· 평균 40분 · 최대 55분',
  },
  {
    badge: '태혁 제안',
    best: false,
    title: '4월 3일 (금) 오후 6:00 홍대입구역 2호선',
    attendance: '4명 모두',
    everyone: true,
    detail: '· 평균 45분 · 최대 58분',
  },
];
const cell = (patch: Partial<DateCellProps>): DateCellProps => ({
  day: 2,
  weekday: 3,
  disabled: false,
  shape: 'none',
  today: false,
  barTones: [],
  onPress: noop,
  ...patch,
});
const cellStates: DateCellProps[] = [
  cell({}),
  cell({ shape: 'single' }),
  cell({ shape: 'start' }),
  cell({ shape: 'middle' }),
  cell({ shape: 'end' }),
  cell({ disabled: true }),
];
const cellExtras: DateCellProps[] = [
  cell({ today: true }),
  cell({ weekday: 0, day: 5 }),
  cell({ weekday: 6, day: 11 }),
  cell({ day: 30, disabled: true, weekday: 1 }),
  cell({ barTones: [1] }),
  cell({ barTones: [1, 2, 3] }),
  cell({ barTones: [1, 2, 3, 1], shape: 'single' }),
];

const colors = [
  ['gray-10', 'bg-gray-10', '#F1F1F1'],
  ['gray-20', 'bg-gray-20', '#DEDEDE'],
  ['gray-30', 'bg-gray-30', '#ADADAD'],
  ['gray-40', 'bg-gray-40', '#6B6B6B'],
  ['gray-50', 'bg-gray-50', '#303030'],
  ['gray-60', 'bg-gray-60', '#1C1C1C'],
  ['blue-10', 'bg-blue-10', '#E6EFFF'],
  ['blue-30', 'bg-blue-30', '#8DB9FF'],
  ['blue-40', 'bg-blue-40', '#4E93FF'],
  ['blue-50', 'bg-blue-50', '#0063FF'],
  ['white', 'bg-white', '#FFFFFF'],
  ['black', 'bg-black', '#000000'],
  ['red', 'bg-red', '#AF2E36'],
  ['yellow', 'bg-yellow', '#EDC112'],
  ['kakao', 'bg-kakao', '#FEE500'],
  ['kakao-logo', 'bg-kakao-logo', '#191919'],
  ['naver', 'bg-naver', '#03A94D'],
  ['google', 'bg-google', '#FFFFFF'],
] as const;

const sizes = [
  ['h1', 'text-h1'],
  ['h2', 'text-h2'],
  ['h3', 'text-h3'],
  ['h4', 'text-h4'],
  ['body1', 'text-body1'],
  ['body2', 'text-body2'],
  ['caption-14', 'text-caption-14'],
  ['caption-12', 'text-caption-12'],
  ['caption-9', 'text-caption-9'],
] as const;

export default function TokenSamples() {
  const [pressCount, setPressCount] = useState(0);
  const [candidatePick, setCandidatePick] = useState('추천 1');
  const [toggleOff, setToggleOff] = useState(false);
  const [toggleOn, setToggleOn] = useState(true);
  const [checkOff, setCheckOff] = useState(false);
  const [checkOn, setCheckOn] = useState(true);
  const [blackOff, setBlackOff] = useState(false);
  const [blackOn, setBlackOn] = useState(true);
  const [termOff, setTermOff] = useState(false);
  const [termOn, setTermOn] = useState(true);
  const [termNoArrow, setTermNoArrow] = useState(false);
  const [name, setName] = useState('나해진');
  const [groupName, setGroupName] = useState('');
  const [labeled, setLabeled] = useState('');
  const [tab, setTab] = useState<TabIcon>('home');
  const [option, setOption] = useState<'recommend' | 'fixed'>('fixed');
  const [range, setRange] = useState(EMPTY_RANGE);
  const [barTime, setBarTime] = useState({ start: 10 * 60, end: 16 * 60 });

  return (
    <SafeAreaView className="flex-1 bg-gray-10">
      <ScrollView contentContainerClassName="gap-6 p-6">
        <View className="flex-row flex-wrap gap-3">
          {colors.map(([name, bg, hex]) => (
            <View key={name} className="w-20 gap-1">
              <View className={`h-12 rounded border border-gray-20 ${bg}`} />
              <Text className="font-pretendard text-caption-12 text-gray-50">{name}</Text>
              <Text className="font-pretendard text-caption-9 text-gray-40">{hex}</Text>
            </View>
          ))}
        </View>

        <View className="gap-3">
          {sizes.map(([name, size]) => (
            <View key={name}>
              <Text className="font-pretendard text-caption-9 text-gray-40">{name}</Text>
              <Text className={`font-pretendard text-gray-50 ${size}`}>약속 모아 Regular</Text>
              <Text className={`font-pretendard font-bold text-gray-50 ${size}`}>
                약속 모아 Bold
              </Text>
            </View>
          ))}
        </View>

        <Section title={`Button (Default, Disabled) · 누른 횟수 ${pressCount}`}>
          <Button label="동의하고 시작하기" onPress={() => setPressCount((n) => n + 1)} />
          <Button label="동의하고 시작하기" disabled />
        </Section>

        <Section title="SocialButton (Kakao, Google, Naver, Apple)">
          <SocialButton provider="kakao" />
          <SocialButton provider="google" />
          <SocialButton provider="naver" />
          <SocialButton provider="apple" />
        </Section>

        <Section title="Toggle (Off, On)">
          <View className="flex-row gap-6">
            <Toggle value={toggleOff} onValueChange={setToggleOff} accessibilityLabel="견본 1" />
            <Toggle value={toggleOn} onValueChange={setToggleOn} accessibilityLabel="견본 2" />
          </View>
        </Section>

        <Section title="Checkbox (Off, On / tone black: Off, On-black)">
          <View className="flex-row gap-6">
            <Checkbox checked={checkOff} onChange={setCheckOff} accessibilityLabel="견본 1" />
            <Checkbox checked={checkOn} onChange={setCheckOn} accessibilityLabel="견본 2" />
            <Checkbox
              checked={blackOff}
              onChange={setBlackOff}
              tone="black"
              accessibilityLabel="견본 3"
            />
            <Checkbox checked={blackOn} onChange={setBlackOn} tone="black" accessibilityLabel="견본 4" />
          </View>
        </Section>

        <Section title="TermsItem (동의 전, 동의 + 설명, 화살표 없음)">
          <TermsItem title="[필수] 서비스 이용약관" checked={termOff} onPress={() => setTermOff(!termOff)} />
          <TermsItem
            title="[선택] 내 캘린더 일정 불러오기"
            description="시간 고를 때 내 일정을 같이 보여줘요"
            checked={termOn}
            onPress={() => setTermOn(!termOn)}
          />
          <TermsItem
            title="[필수] 만 14세 이상이에요"
            checked={termNoArrow}
            showArrow={false}
            onPress={() => setTermNoArrow(!termNoArrow)}
          />
        </Section>

        <Section title="TextField (Filled, Empty)">
          <TextField
            value={name}
            onChangeText={setName}
            maxLength={50}
            placeholder="이름"
            helper="2~10자로 입력해 주세요."
            confirmLabel="확인"
          />
          <TextField
            value={groupName}
            onChangeText={setGroupName}
            maxLength={50}
            placeholder="모임 이름"
            helper="2~10자로 입력해 주세요."
            confirmLabel="확인"
          />
          <TextField
            value={labeled}
            onChangeText={setLabeled}
            maxLength={50}
            label="이름"
            placeholder="모임 이름"
            helper="라벨이 있는 경우"
          />
        </Section>

        <Section title="Icon (24, gray-50) · 탭 아이콘 (24, Fill False/True)">
          <View className="flex-row flex-wrap gap-[5px]">
            {icons.map((name) => (
              <Icon key={name} name={name} />
            ))}
          </View>
          <View className="flex-row gap-[5px]">
            {tabIcons.map((name) => (
              <Icon key={name} name={name} />
            ))}
          </View>
          <View className="flex-row gap-[5px]">
            {icons.map((name) => (
              <Icon key={name} name={name} className="text-blue-50" />
            ))}
          </View>
          <DoneIllustration />
        </Section>

        <Section title="TopBar (Status, Step, Back, Share, Large Title, Step Title)">
          <View className="-mx-6 gap-3 bg-white py-3">
            <TopBar type="status" />
            <TopBar type="step" />
            <TopBar type="back" actionLabel="확인" />
            <TopBar type="share" />
            <TopBar type="largeTitle" title="약속" />
            <TopBar type="stepTitle" title="예상 중간 지점" />
          </View>
        </Section>

        <Section title={`TabBar · 누르면 선택이 바뀐다 (지금: ${tab})`}>
          <View className="-mx-6">
            <TabBar>
              {tabs.map(({ icon, label }) => (
                <TabItem
                  key={icon}
                  icon={icon}
                  selected={tab === icon}
                  onPress={() => setTab(icon)}
                  accessibilityLabel={label}
                />
              ))}
            </TabBar>
          </View>
        </Section>

        <Section title="TabItem (Active, Inactive × Home, Calendar, User)">
          <View className="flex-row gap-5 bg-white">
            {tabs.map(({ icon, label }) => (
              <View key={icon} className="flex-row">
                <TabItem icon={icon} selected accessibilityLabel={label} />
                <TabItem icon={icon} selected={false} accessibilityLabel={label} />
              </View>
            ))}
          </View>
        </Section>

        <Section title="Avatar (이름 뒤 두 글자, 사진, 빈 이름 · 지름 50, 128 · 테두리)">
          <View className="flex-row flex-wrap items-center gap-3">
            <Avatar name="나해진" size={50} />
            <Avatar name="나해진" photo={samplePhoto} size={50} />
            <Avatar name="" size={50} />
            <Avatar name="나해진" size={50} borderWidth={1.5} className="border-gray-20" />
            <Avatar name="나해진" size={128} />
            <Avatar name="나해진" photo={samplePhoto} size={128} />
          </View>
        </Section>

        <Section title="Avatar + 카메라 버튼 (ProfileAvatar: Empty, Filled, 사진)">
          <View className="flex-row flex-wrap items-center gap-3">
            <ProfileAvatar name="" onPressCamera={() => setPressCount((count) => count + 1)} />
            <ProfileAvatar name="성예희" onPressCamera={() => setPressCount((count) => count + 1)} />
            <ProfileAvatar name="성예희" photo={samplePhoto} onPressCamera={() => setPressCount((count) => count + 1)} />
          </View>
        </Section>

        <Section title="Tooltip/Recent, Badge/Progress">
          <View className="items-center gap-[17px] bg-white p-3">
            <Tooltip label="최근 로그인" />
            <ProgressBadge count="3/4명" label="입력 완료" />
          </View>
        </Section>

        <Section title="Title/Page">
          <PageTitle title="약속 만들기" subtitle="약속 이름을 입력하세요" />
        </Section>

        <Section title="List/Summary Item">
          <View className="gap-[14px]">
            <SummaryItem label="필요한 시간" value="2시간" />
            <SummaryItem label="약속 이름" value="저녁 모임" />
          </View>
        </Section>

        <Section title="Input/Field Group (Selected, Default)">
          <View className="bg-white p-3">
            <InputFieldGroup>
              <InputField label="시작" value="4월 1일" selected />
              <InputField label="종료" value="4월 30일" selected={false} />
            </InputFieldGroup>
          </View>
        </Section>

        <Section title="Card/Option · 누르면 고른 카드가 바뀐다">
          <OptionCard
            title="추천 받을래요"
            description="모두의 출발지로 중간 지점을 찾아요"
            selected={option === 'recommend'}
            onSelect={() => setOption('recommend')}
          />
          <OptionCard
            title="정해져 있어요"
            description="장소를 직접 골라요"
            selected={option === 'fixed'}
            onSelect={() => setOption('fixed')}>
            <PlaceRow type="search" label="장소 찾기" onPress={() => undefined} />
          </OptionCard>
        </Section>

        <Section title="List/Place Row (Selected, Search)">
          <View className="gap-4 bg-white p-4">
            <PlaceRow
              type="selected"
              name="마찌마찌중앙대점"
              address="경기 안성시 대덕면 대학9길 12"
              onChange={() => undefined}
            />
            <PlaceRow type="search" label="장소 찾기" onPress={() => undefined} />
          </View>
        </Section>

        <Section title="Character + 체크 (Checked, Unchecked, 사진 · 지름 48, 50)">
          <View className="flex-row items-center gap-3">
            <CheckedAvatar name="김태혁" size={48} checked />
            <CheckedAvatar name="성예희" size={48} checked={false} />
            <CheckedAvatar name="나해진" photo={samplePhoto} size={50} checked />
          </View>
        </Section>

        <Section title="List/Member Row (입력 완료, 입력 중)">
          <View className="gap-[8px] bg-white p-4">
            <MemberRow name="김태혁" status="입력 완료" checked />
            <MemberRow name="성예희" status="입력 중" checked={false} />
          </View>
        </Section>

        <Section title={`List/Action Card · Section/Header · 누른 횟수 ${pressCount}`}>
          <ActionCard label="가능한 일정 입력하러 가기" onPress={() => setPressCount((n) => n + 1)} />
          <SectionHeader title="제안된 장소" action={{ label: '장소 제안', onPress: () => setPressCount((n) => n + 1) }} />
          <SectionHeader title="추천 후보" />
        </Section>

        <Section title={`Card/Candidate (Best·All, Default·Partial, 제안, 누를 수 없음) · 고른 카드: ${candidatePick}`}>
          {CANDIDATE_SAMPLES.map((sample) => (
            <CandidateCard
              key={sample.badge}
              {...sample}
              checked={candidatePick === sample.badge}
              onPress={() => setCandidatePick(sample.badge)}
            />
          ))}
          <CandidateCard {...CANDIDATE_SAMPLES[0]} checked />
        </Section>

        <Section title="Card/Place List (한 줄, 여러 줄)">
          <PlaceListCard items={[{ id: '1', name: '홍대역', detail: '태혁 제안' }]} />
          <PlaceListCard
            items={[
              { id: '1', name: '홍대역', detail: '태혁 제안' },
              { id: '2', name: '사당역', detail: '예희 제안' },
              { id: '3', name: '아주 긴 장소 이름이 들어가면 줄이 어떻게 되는지', detail: '해진 제안' },
            ]}
          />
        </Section>

        <Section title="Date Cell (기본, 선택, 시작, 중간, 끝, 비활성) / 오늘, 일, 토, 앞뒤 달, 막대 1·3·4개">
          <View className="w-[300px] flex-row">
            {cellStates.map((props, index) => (
              <MonthDateCell key={index} {...props} />
            ))}
          </View>
          <View className="w-[338px] flex-row">
            {cellExtras.map((props, index) => (
              <MonthDateCell key={index} {...props} />
            ))}
          </View>
        </Section>

        <Section title="Date Cell2 (같은 순서)">
          <View className="w-[300px] flex-row">
            {cellStates.map((props, index) => (
              <CompactDateCell key={index} {...props} />
            ))}
          </View>
          <View className="w-[338px] flex-row">
            {cellExtras.map((props, index) => (
              <CompactDateCell key={index} {...props} />
            ))}
          </View>
        </Section>

        <Section title="Calendar/Range · 시작, 끝, 다시 누르기, 달 넘기기">
          <RangeCalendar
            range={range}
            today={toDateKey(new Date())}
            onPickDate={(key) => setRange(pickRangeDate(range, key))}
          />
        </Section>

        <Section
          title={`Input/Time Bar · 손잡이 끌기, 끝에서 밀림, 두 손가락 확대(웹은 휠) · ${clockText(barTime.start)} ~ ${clockText(barTime.end)}`}>
          <View className="rounded-[16px] bg-white p-[20px]">
            <TimeBar
              startMinutes={barTime.start}
              endMinutes={barTime.end}
              onChange={(start, end) => setBarTime({ start, end })}
            />
          </View>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="gap-3">
      <Text className="font-pretendard text-caption-12 text-gray-40">{title}</Text>
      {children}
    </View>
  );
}
