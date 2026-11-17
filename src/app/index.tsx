// 토큰 견본을 보는 임시 화면이다. 다음 세션에서 실제 화면을 만들 때 지운다.
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
      </ScrollView>
    </SafeAreaView>
  );
}
