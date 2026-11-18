// 토큰과 UI 컴포넌트 견본을 보는 개발용 임시 화면이다. 주소(/samples)로만 연다. 실제 화면이 다 만들어지면 지운다.
import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GroupAvatar, MapPinAvatar, MemberAvatar, ProfileAvatar } from '@/components/ui/Avatar';
import { ProgressBadge, Tooltip } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { DoneIllustration, Icon, type IconName } from '@/components/ui/Icon';
import { SocialButton } from '@/components/ui/SocialButton';
import { TabBar, TabItem, type TabIcon } from '@/components/ui/TabBar';
import { TextField } from '@/components/ui/TextField';
import { Toggle } from '@/components/ui/Toggle';
import { TopBar } from '@/components/ui/TopBar';

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
  const [toggleOff, setToggleOff] = useState(false);
  const [toggleOn, setToggleOn] = useState(true);
  const [checkOff, setCheckOff] = useState(false);
  const [checkOn, setCheckOn] = useState(true);
  const [blackOff, setBlackOff] = useState(false);
  const [blackOn, setBlackOn] = useState(true);
  const [name, setName] = useState('나해진');
  const [groupName, setGroupName] = useState('');
  const [labeled, setLabeled] = useState('');
  const [tab, setTab] = useState<TabIcon>('home');
  const [memberDone, setMemberDone] = useState(true);

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

        <Section title="Avatar (Empty: 이름 뒤 두 글자, Filled: 사진)">
          <View className="flex-row flex-wrap">
            <ProfileAvatar name="나해진" />
            <ProfileAvatar name="나해진" photo={samplePhoto} />
          </View>
        </Section>

        <Section title="Avatar/Member · 첫 번째를 누르면 입력 완료 표시가 바뀐다">
          <View className="flex-row flex-wrap items-start gap-5">
            <Pressable onPress={() => setMemberDone((v) => !v)}>
              <MemberAvatar name="해진" photo={samplePhoto} checked={memberDone} />
            </Pressable>
            <MemberAvatar name="나해진" status="입력 중" />
            <MemberAvatar name="진" checked />
            <MemberAvatar name="" />
            <MemberAvatar name="나해진" showName={false} />
          </View>
        </Section>

        <Section title="Avatar/Group (사진, 이름 글자)">
          <View className="flex-row flex-wrap gap-3">
            <GroupAvatar
              members={[
                { name: '김민수', photo: samplePhoto },
                { name: '나해진', photo: samplePhoto },
              ]}
            />
            <GroupAvatar members={[{ name: '김민수' }, { name: '나해진' }]} />
          </View>
        </Section>

        <Section title="Avatar/Map Pin (사진 + 체크, 이름 글자)">
          <View className="flex-row gap-5 bg-white p-3">
            <MapPinAvatar name="해진" photo={samplePhoto} label="수원역" checked />
            <MapPinAvatar name="나해진" label="강남역" />
          </View>
        </Section>

        <Section title="Tooltip/Recent, Badge/Progress">
          <View className="items-center gap-[17px] bg-white p-3">
            <Tooltip label="최근 로그인" />
            <ProgressBadge count="3/4명" label="입력 완료" />
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
