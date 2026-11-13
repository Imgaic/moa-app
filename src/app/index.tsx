// 토큰 견본을 보는 임시 화면이다. 다음 세션에서 실제 화면을 만들 때 지운다.
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const colors = [
  ['navy-10', 'bg-navy-10', '#D3D6E1'],
  ['navy-20', 'bg-navy-20', '#98A0BB'],
  ['navy-30', 'bg-navy-30', '#57679B'],
  ['navy-40', 'bg-navy-40', '#3B4E8D'],
  ['navy-50', 'bg-navy-50', '#1B2F73'],
  ['navy-60', 'bg-navy-60', '#000943'],
  ['gray-10', 'bg-gray-10', '#F7F7F8'],
  ['gray-20', 'bg-gray-20', '#DEDEDE'],
  ['gray-30', 'bg-gray-30', '#ABAFBC'],
  ['gray-40', 'bg-gray-40', '#535A68'],
  ['gray-50', 'bg-gray-50', '#111111'],
  ['white', 'bg-white', '#FFFFFF'],
  ['black', 'bg-black', '#000000'],
  ['blue', 'bg-blue', '#2F80FF'],
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
