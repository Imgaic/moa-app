import { Text, View } from 'react-native';

// 피그마 Title/Page (2026-11-18 기준). 디자인이 완성 전이라 수치가 바뀔 수 있다.
const GAP = 'gap-[6px]';

type PageTitleProps = {
  title: string;
  subtitle?: string;
};

export function PageTitle({ title, subtitle }: PageTitleProps) {
  return (
    <View className={GAP}>
      <Text accessibilityRole="header" className="font-pretendard text-h2 text-gray-60">
        {title}
      </Text>
      {subtitle ? (
        <Text className="font-pretendard text-caption-14 text-gray-30">{subtitle}</Text>
      ) : null}
    </View>
  );
}
