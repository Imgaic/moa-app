// 토큰과 UI 컴포넌트 견본을 보는 임시 화면이다. 다음 세션에서 실제 화면을 만들 때 지운다.
import { useState, type ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { SocialButton } from '@/components/ui/SocialButton';
import { TextField } from '@/components/ui/TextField';
import { Toggle } from '@/components/ui/Toggle';

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
