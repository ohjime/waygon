import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const AnimatedView = Animated.createAnimatedComponent(View);

export function EmeraldCirclePage() {
  const [active, setActive] = useState(false);
  const progress = useSharedValue(0);

  const toggle = () => {
    setActive(prev => !prev);
    progress.value = withTiming(progress.value === 0 ? 1 : 0, {
      duration: 500,
    });
  };

  const circleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: 1 + progress.value * 0.4 }],
      borderWidth: 6,
      borderColor: 'rgba(0, 195, 137, 0.4 + 0.3 * progress.value)',
    };
  });

  const message = useMemo(() => {
    return active ? 'Emerald pulse engaged' : 'Tap to energize';
  }, [active]);

  return (
    <View style={styles.container}>
      <Pressable hitSlop={12} onPress={toggle}>
        <AnimatedView style={[styles.circle, circleStyle]} />
      </Pressable>
      <Text style={styles.label}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  circle: {
    alignItems: 'center',
    backgroundColor: '#00C389',
    borderRadius: 90,
    height: 180,
    justifyContent: 'center',
    width: 180,
  },
  label: {
    color: '#b3ffe7',
    marginTop: 24,
    fontSize: 16,
    fontWeight: '500',
  },
});
