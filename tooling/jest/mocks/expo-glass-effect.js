/**
 * Controllable manual mock for `expo-glass-effect`.
 *
 * The real package is an optional peer dependency and its availability checks go
 * through `requireNativeModule`, which needs a native module that no unit-test
 * environment has. So the native path is unreachable in tests unless it is stood
 * in for — and it is the path most worth testing, because it is the one nobody
 * can run on a laptop.
 *
 * Availability is off by default so a suite that does nothing gets the fallback,
 * which is what every non-iOS consumer gets. Call `__setLiquidGlassAvailable` to
 * turn the native path on for a test, and remember that `foundation/glass.tsx`
 * caches its answer — pair it with `__resetGlassCacheForTests()`.
 */
const React = require('react');
const { View } = require('react-native');

let liquidGlassAvailable = false;
let glassEffectApiAvailable = true;
let shouldThrow = false;

function GlassView(props) {
  return React.createElement(View, { testID: 'native-glass-view', ...props });
}

function GlassContainer(props) {
  return React.createElement(View, { testID: 'native-glass-container', ...props });
}

function isLiquidGlassAvailable() {
  // The real implementation calls `requireNativeModule`, which throws when the JS
  // is installed but the native side is not — Expo Go, or a project that added
  // the package without rebuilding. That throw is a case the foundation has to
  // survive, so the mock can reproduce it.
  if (shouldThrow) throw new Error('Cannot find native module ExpoGlassEffect');
  return liquidGlassAvailable;
}

function isGlassEffectAPIAvailable() {
  if (shouldThrow) throw new Error('Cannot find native module ExpoGlassEffect');
  return glassEffectApiAvailable;
}

/**
 * @param {boolean} available whether the app is running the Liquid Glass design
 * @param {{ apiAvailable?: boolean, throws?: boolean }} [options]
 *   `apiAvailable: false` reproduces the iOS 26 betas that ship the design without
 *   the API; `throws: true` reproduces a missing native module.
 */
function __setLiquidGlassAvailable(available, options = {}) {
  liquidGlassAvailable = available;
  glassEffectApiAvailable = options.apiAvailable ?? true;
  shouldThrow = options.throws ?? false;
}

function __resetGlassEffectMock() {
  liquidGlassAvailable = false;
  glassEffectApiAvailable = true;
  shouldThrow = false;
}

module.exports = {
  GlassView,
  GlassContainer,
  isLiquidGlassAvailable,
  isGlassEffectAPIAvailable,
  __setLiquidGlassAvailable,
  __resetGlassEffectMock,
};
