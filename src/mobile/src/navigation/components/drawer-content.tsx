import {
  Dimensions,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TextInputChangeEvent,
  View,
} from 'react-native';

import React, { useCallback, useMemo, useRef } from 'react';

import { LegendList, LegendListRef, LegendListRenderItemProps } from '@legendapp/list';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';
import { PressableScale, PressablesGroup } from 'pressto';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';

import { DrawerListItem, DrawerNavItem } from './drawer-list-item';
import {
  FilteredAnimationsAtom,
  SearchFilterAtom,
} from '../../navigation/states/filters';

const keyExtractor = (item: DrawerNavItem) => item?.slug || '';

const LIST_ITEM_HEIGHT = 50;

export const DrawerContentWidth = Dimensions.get('window').width * 0.35;

const GradientColors = ['#030303', '#03030300'] as const;

const HomeDrawerItem: DrawerNavItem = {
  slug: 'home',
  name: 'Home',
  icon: () => <Ionicons name="home-outline" size={24} color="#fff" />,
};

export function DrawerContent(_props: DrawerContentComponentProps) {
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();
  const setSearchFilter = useSetAtom(SearchFilterAtom);
  const filteredAnimations = useAtomValue(FilteredAnimationsAtom);
  const searchFilter = useAtomValue(SearchFilterAtom);
  const listRef = useRef<LegendListRef<DrawerNavItem>>(null);

  const drawerItems = useMemo(() => {
    const navItems = filteredAnimations.map<DrawerNavItem>(item => item);
    const normalizedFilter = searchFilter.trim().toLowerCase();
    const shouldInsertHome =
      normalizedFilter.length === 0 || 'home'.includes(normalizedFilter);

    if (!shouldInsertHome) {
      return navItems;
    }

    const insertIndex = Math.min(2, navItems.length);
    const nextItems = [...navItems];
    nextItems.splice(insertIndex, 0, HomeDrawerItem);
    return nextItems;
  }, [filteredAnimations, searchFilter]);

  const handleItemPress = useCallback(
    (item: DrawerNavItem) => {
      Keyboard.dismiss();
      if (item.slug === HomeDrawerItem.slug) {
        router.push('/home');
        return;
      }
      router.push(`/animations/${item.slug}`);
    },
    [router],
  );

  const renderItem = useCallback(
    ({ item }: LegendListRenderItemProps<DrawerNavItem>) => {
      return (
        <DrawerListItem
          item={item}
          style={styles.listItem}
          onPress={() => handleItemPress(item)}
        />
      );
    },
    [handleItemPress],
  );

  const handleSearchChange = useCallback(
    (event: TextInputChangeEvent) => {
      setSearchFilter(event.nativeEvent.text);
      // Scroll to top after filter is applied, in the next frame
      requestAnimationFrame(() => {
        if (drawerItems.length > 0) {
          listRef.current?.scrollToIndex({ index: 0, animated: false });
        }
      });
    },
    [drawerItems.length, setSearchFilter],
  );

  const contentContainerStyle = useMemo(() => {
    return { paddingBottom: bottom, marginTop: 12 };
  }, [bottom]);

  const scrollComponent = useCallback((props: any) => {
    return <ScrollView {...props} />;
  }, []);

  const estimatedListSize = useMemo(() => {
    return {
      height: LIST_ITEM_HEIGHT * drawerItems.length,
      width: DrawerContentWidth,
    };
  }, [drawerItems.length]);

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <PressableScale onPress={() => router.push('/home')}>
            <Text style={styles.title}>Demos</Text>
          </PressableScale>
        </View>
        <View style={styles.searchContainer}>
          <TextInput
            autoComplete="off"
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            clearButtonMode="always"
            style={styles.searchInput}
            placeholderTextColor="#666"
            onChange={handleSearchChange}
            placeholder="Search animations..."
          />
        </View>
      </View>

      <View style={styles.listContainer}>
        <PressablesGroup>
          <LegendList
            recycleItems={false}
            waitForInitialLayout
            ref={listRef}
            renderItem={renderItem}
            scrollEventThrottle={16}
            data={drawerItems}
            estimatedListSize={estimatedListSize}
            keyExtractor={keyExtractor}
            keyboardDismissMode="on-drag"
            estimatedItemSize={LIST_ITEM_HEIGHT}
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={contentContainerStyle}
            renderScrollComponent={scrollComponent}
          />
        </PressablesGroup>
        <LinearGradient
          pointerEvents="none"
          style={styles.topGradient}
          colors={GradientColors}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#030303',
    flex: 1,
  },
  header: {
    gap: 8,
    marginBottom: 8,
    marginTop: 6,
    paddingHorizontal: 20,
  },
  listContainer: {
    flex: 1,
    position: 'relative',
  },
  listItem: {
    height: LIST_ITEM_HEIGHT,
    paddingHorizontal: 20,
  },
  searchContainer: {
    marginBottom: 0,
    marginTop: 6,
    position: 'relative',
  },
  searchInput: {
    backgroundColor: '#1a1a1a',
    borderCurve: 'continuous',
    borderRadius: 12,
    borderWidth: 0,
    color: '#fff',
    fontSize: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  title: {
    color: '#fff',
    fontFamily: 'honk-regular',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
  },
  topGradient: {
    height: 20,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
  },
});
