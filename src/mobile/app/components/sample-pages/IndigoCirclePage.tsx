import { useReducer } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const AnimatedView = Animated.createAnimatedComponent(View);

type Action = { type: 'toggle' };
type State = { spinning: boolean };

const initialState: State = { spinning: false };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'toggle':
      return { spinning: !state.spinning };
    default:
      return state;
  }
};

export function IndigoCirclePage() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const rotation = useDerivedValue(() => {
    return state.spinning
      ? withRepeat(withTiming(360, { duration: 4000 }), -1, false)
      : withTiming(0, { duration: 300 });
  }, [state.spinning]);

  const background = useDerivedValue(() => {
    return state.spinning
      ? withTiming(1, { duration: 500 })
      : withTiming(0, { duration: 500 });
  }, [state.spinning]);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
    backgroundColor: interpolateColor(
      background.value,
      [0, 1],
      ['#4D6CFF', '#7F5CFF'],
    ),
  }));

  return (
    <View style={styles.container}>
      <Pressable onPress={() => dispatch({ type: 'toggle' })}>
        <AnimatedView style={[styles.circle, circleStyle]}>
          <Text style={styles.text}>{state.spinning ? 'Indigo orbit' : 'Tap to spin'}</Text>
        </AnimatedView>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  circle: {
    borderRadius: 100,
    height: 200,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7F5CFF',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.35,
    shadowRadius: 32,
  },
  text: {
    color: '#fff',
    fontWeight: '600',
  },
});
