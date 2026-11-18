import { Tabs } from 'expo-router/js-tabs';
import { View } from 'react-native';

import { TabBar, TabItem, type TabIcon } from '@/components/ui/TabBar';

// 아래 탭 세 개. 탭 바는 피그마 Navigation/Tab Bar를 옮긴 TabBar/TabItem을 그대로 쓴다.
// 탭 순서와 아이콘은 이 목록 하나에서 정한다.
const TABS: { name: string; icon: TabIcon; label: string }[] = [
  { name: 'index', icon: 'home', label: '홈' },
  { name: 'calendar', icon: 'calendar', label: '캘린더' },
  { name: 'profile', icon: 'user', label: '내 정보' },
];

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={({ state, emitter, navigateToTab }) => (
        // 탭 바의 둥근 위 모서리 뒤로 화면 바탕색이 보이게 한다.
        <View className="bg-gray-10">
          <TabBar>
            {state.routes.map((route, index) => {
              const tab = TABS.find((t) => t.name === route.name);
              if (!tab) return null;
              const selected = state.index === index;
              return (
                <TabItem
                  key={route.key}
                  icon={tab.icon}
                  selected={selected}
                  accessibilityLabel={tab.label}
                  onPress={() => {
                    const event = emitter.emit({
                      type: 'tabPress',
                      target: route.key,
                      canPreventDefault: true,
                    });
                    if (!selected && !event.defaultPrevented) {
                      navigateToTab(route.key);
                    }
                  }}
                />
              );
            })}
          </TabBar>
        </View>
      )}>
      {TABS.map((tab) => (
        <Tabs.Screen key={tab.name} name={tab.name} options={{ title: tab.label }} />
      ))}
    </Tabs>
  );
}
