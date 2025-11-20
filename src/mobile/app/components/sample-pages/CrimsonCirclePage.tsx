import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const AnimatedView = Animated.createAnimatedComponent(View);

export function CrimsonCirclePage() {
  const [taps, setTaps] = useState(0);
  const radius = useSharedValue(60);

  const handlePress = () => {
    setTaps(prev => prev + 1);
    radius.value = withSpring(radius.value === 60 ? 90 : 60, {
      damping: 12,
      stiffness: 180,
    });
  };

  const circleStyle = useAnimatedStyle(() => {
    return {
      width: radius.value * 2,
      height: radius.value * 2,
      borderRadius: radius.value,
      backgroundColor: '#FF4D4D',
    };
  }, []);

  return (
    <View style={styles.container}>
      <Pressable hitSlop={20} onPress={handlePress}>
        <AnimatedView style={[styles.circle, circleStyle]} />
      </Pressable>
      <Text style={styles.label}>Crimson taps: {taps}</Text>
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
    shadowColor: '#FF4D4D',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
  },
  label: {
    color: '#fff',
    marginTop: 24,
    fontSize: 16,
    fontWeight: '600',
  },
});
