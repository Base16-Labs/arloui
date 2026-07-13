/**
 * Shared Jest configuration for Arlo UI's React Native packages.
 *
 * Built on the `react-native` preset (lighter than `jest-expo` — our components
 * only touch `expo-haptics` via a mockable dynamic import, not the Expo app
 * runtime). It wires up the RN babel transform, the RN module mocks, and the
 * node test environment. Each RN package extends this with its own
 * `displayName`; `babel-preset-expo` (a superset of the RN babel preset) does
 * the actual TS/JSX transform via each package's `babel.config.cjs`.
 */
const path = require('node:path');

/** @type {import('jest').Config} */
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: [path.join(__dirname, 'setup.cjs')],
  clearMocks: true,
  // jest-expo ignores node_modules by default; widen the allow-list so the
  // packages our components import are transformed (TS/Flow/JSX) too.
  transformIgnorePatterns: [
    'node_modules/(?!(' +
      [
        '(jest-)?react-native',
        '@react-native(-community)?',
        'expo(nent)?',
        '@expo(nent)?/.*',
        'expo-modules-core',
        'react-native-svg',
        'react-native-reanimated',
        '@arloui/.*',
      ].join('|') +
      ')/)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    // react-native-reanimated (v4 + worklets) is a peer dep consumers install;
    // map it to a lightweight manual mock so animated components render in tests.
    '^react-native-reanimated$': path.join(__dirname, 'mocks/react-native-reanimated.js'),
  },
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/',
    '\\.test\\.(ts|tsx)$',
    '/index\\.ts$', // barrel re-exports
    '/manifest\\.ts$', // registry data (covered by @arloui/build-registry tests)
    '/schema\\.ts$', // type-only
  ],
  coverageReporters: ['text-summary', 'text'],
  coverageThreshold: {
    global: {
      statements: 85,
      branches: 60,
      functions: 80,
      lines: 85,
    },
  },
};
