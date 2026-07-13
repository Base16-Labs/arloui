/**
 * Lightweight manual mock for `react-native-reanimated`.
 *
 * The real package (v4 + react-native-worklets) isn't installed in this repo —
 * it's a peer dependency that consumers add. For unit tests we only need the API
 * surface the registry's `animated-icon` touches: animated component wrappers,
 * shared values, the worklet hooks, and the timing/interpolation helpers. Every
 * helper is a synchronous no-op that returns a plausible value so components
 * render to a static frame without a native runtime.
 */
const React = require('react');

const createAnimatedComponent = (Component) => Component;

const identity = (v) => v;
const useSharedValue = (initial) => ({ value: initial });
const runWorklet = (fn) => {
  try {
    return typeof fn === 'function' ? fn() : {};
  } catch {
    return {};
  }
};

const easingFn = (t) => t;
const Easing = {
  bezier: () => easingFn,
  linear: easingFn,
  ease: easingFn,
  quad: easingFn,
  cubic: easingFn,
  in: () => easingFn,
  out: () => easingFn,
  inOut: () => easingFn,
};

const Animated = {
  createAnimatedComponent,
  View: 'Animated.View',
  Text: 'Animated.Text',
};

module.exports = {
  __esModule: true,
  default: Animated,
  createAnimatedComponent,
  useSharedValue,
  useAnimatedProps: runWorklet,
  useAnimatedStyle: runWorklet,
  useDerivedValue: (fn) => ({ value: runWorklet(fn) }),
  useReducedMotion: () => false,
  withTiming: identity,
  withSpring: identity,
  withDelay: (_delay, value) => value,
  withRepeat: identity,
  withSequence: (...steps) => steps[steps.length - 1],
  cancelAnimation: () => {},
  runOnJS: (fn) => fn,
  runOnUI: (fn) => fn,
  interpolate: (_value, _inputRange, outputRange) =>
    Array.isArray(outputRange) ? outputRange[0] : 0,
  interpolateColor: (_value, _inputRange, outputRange) =>
    Array.isArray(outputRange) ? outputRange[0] : 'rgba(0,0,0,1)',
  Easing,
  // `Animated.createElement` passthrough used by some call sites.
  createElement: React.createElement,
};
