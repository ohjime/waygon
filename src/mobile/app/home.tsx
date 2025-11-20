import { useCallback } from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { BottomTabBar } from './components/bottom-tab-bar';
import { CrimsonCirclePage } from './components/sample-pages/CrimsonCirclePage';
import { EmeraldCirclePage } from './components/sample-pages/EmeraldCirclePage';
import { IndigoCirclePage } from './components/sample-pages/IndigoCirclePage';
import { ScreenNames } from './constants/screens';

import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const BottomTab = createBottomTabNavigator();

const HomePage = () => {
  const tabBar = useCallback((props: BottomTabBarProps) => {
    return <BottomTabBar {...props} />;
  }, []);

  return (
    <BottomTab.Navigator tabBar={tabBar}>
      <BottomTab.Screen name={ScreenNames.Home} component={CrimsonCirclePage} />
      <BottomTab.Screen name={ScreenNames.Search} component={EmeraldCirclePage} />
      <BottomTab.Screen name={ScreenNames.User} component={IndigoCirclePage} />
    </BottomTab.Navigator>
  );
};

export default HomePage;
