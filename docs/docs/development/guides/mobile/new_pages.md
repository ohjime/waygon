---
sidebar_position: 3
title: Creating New Pages
description: How the custom drawer, routing, and screens fit together when you add a new page to the mobile app.
---

## 1. How the sidebar entry drives navigation

- **Single source of truth:** The drawer UI lives in `src/mobile/src/navigation/components/drawer-content.tsx`. It reads the list of available pages (animations + custom entries such as Home) and feeds them to a `LegendList`. Each row is a `DrawerListItem` bound to a `DrawerNavItem` containing `slug`, `name`, `icon`, and optional alert metadata.
- **Press → route:** When a drawer row is pressed, `DrawerContent` calls `router.push()` with a screen path (e.g., `/home` or `/animations/<slug>`). The drawer automatically collapses because navigation transitions close it.
- **Search support:** The list is filtered through `SearchFilterAtom`. Any item that survives the filter remains visible and keeps its press handler, so the search box “just works” for both animation demos and custom pages.

## 2. Necessary pieces and their roles

| Component / file | Role |
| --- | --- |
| `DrawerContent` | Builds the sidebar UI, wires the search box, and inserts special entries (e.g., Home) at fixed positions. |
| `DrawerListItem` | Renders a consistent row (icon, label, alert badge) and provides press feedback via `pressto`. Accepts any `DrawerNavItem`, so both demos and custom pages share styling. |
| `FilteredAnimationsAtom` & `SearchFilterAtom` | Provide the searchable dataset for animations; custom entries can be merged in before rendering. |
| `app/_layout.tsx` | Registers screens with `expo-router/drawer`. Every page must appear here (or be nested) so the drawer can navigate to it. `initialRouteName` controls which page loads on app start. |
| `app/<route>.tsx` | The actual screen component. Expo Router maps `/home` to `app/home.tsx`, `/foo/bar` to `app/foo/bar.tsx`, etc. |
| Icons (e.g., `Ionicons`) | Optional but recommended so new entries match the visual language of existing rows. |

## 3. Example: adding a blank Home page

1. **Create the screen:** Add `app/home.tsx` with a simple component.

    ```tsx title="app/home.tsx"
    import { StyleSheet, Text, View } from 'react-native';

    export default function HomeScreen() {
      return (
        <View style={styles.container}>
          <Text style={styles.text}>Home</Text>
        </View>
      );
    }

    const styles = StyleSheet.create({
      container: { flex: 1, backgroundColor: 'black', alignItems: 'center', justifyContent: 'center' },
      text: { color: 'white', fontSize: 24, fontWeight: '600' },
    });
    ```

2. **Register it with the drawer:** In `app/_layout.tsx`, ensure there is a `<Drawer.Screen name="home" ... />` entry and set `initialRouteName="home"` if you want it to load first.

3. **Expose it in the sidebar:** In `DrawerContent`, merge a `HomeDrawerItem` into the `drawerItems` array (the sample project inserts it as the third row). Its `onPress` should call `router.push('/home')` so the drawer closes and the new page renders.

4. **(Optional) Point index to Home:** If you want `/` to show the same content, re-export the screen from `app/index.tsx`:

    ```tsx
    export { default } from './home';
    ```

With those three touchpoints—screen file, drawer registration, and sidebar entry—you can stand up any new page (settings, docs, dashboards, etc.) in a few minutes.
