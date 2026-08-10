/**
 * Global Jest setup for the RN suites.
 *
 * - Mocks `react-native-reanimated` with its bundled mock so animated
 *   components render without the native runtime.
 * - Silences the reanimated logger so test output stays clean.
 */
/* eslint-disable @typescript-eslint/no-require-imports */
// react-native-reanimated is resolved to a manual mock via moduleNameMapper
// (see tooling/jest/base.cjs) — no jest.mock() needed here.

// AccessibilityInfo.isReduceMotionEnabled resolves asynchronously after render,
// which otherwise triggers act() warnings in every component test. Components
// don't depend on the result in tests, so hold the promise pending and make the
// change-listener a no-op subscription.
try {
  const { AccessibilityInfo } = require('react-native');
  jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockReturnValue(new Promise(() => {}));
  jest
    .spyOn(AccessibilityInfo, 'addEventListener')
    .mockReturnValue({ remove: () => {} });
} catch {
  // react-native not resolvable in this package — fine.
}

// Some third-party chart components (react-native-gifted-charts' LineChart, for
// one) schedule mount animations with setTimeout and never clear them on
// unmount. Those callbacks then fire after the test environment has been torn
// down, which crashes the worker rather than failing a test. Track the handles
// and drop any that are still pending when a test ends.
const realSetTimeout = global.setTimeout;
const realClearTimeout = global.clearTimeout;
const pendingTimers = new Set();

global.setTimeout = (...args) => {
  const handle = realSetTimeout(...args);
  pendingTimers.add(handle);
  return handle;
};
global.setTimeout.__isMockFunction = false;

global.clearTimeout = (handle) => {
  pendingTimers.delete(handle);
  return realClearTimeout(handle);
};

afterEach(() => {
  for (const handle of pendingTimers) realClearTimeout(handle);
  pendingTimers.clear();
});
