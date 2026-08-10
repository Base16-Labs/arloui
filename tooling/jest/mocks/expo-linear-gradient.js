/**
 * Lightweight manual mock for `expo-linear-gradient`.
 *
 * `react-native-gifted-charts` hard-requires a gradient package at import time
 * (see its `Components/common/LinearGradient.js`), and the real
 * `expo-linear-gradient` pulls in `expo-modules-core` — the Expo native runtime
 * this jest setup deliberately stays clear of. The failure is easy to
 * misdiagnose because gifted-charts swallows the underlying resolution error
 * behind a try/catch and rethrows "Gradient package was not found".
 *
 * Gradients are pure decoration in our charts, so a plain View that keeps its
 * children and testIDs is enough to render a static frame.
 */
const React = require('react');
const { View } = require('react-native');

const LinearGradient = ({ children, ...props }) => React.createElement(View, props, children);

module.exports = {
  __esModule: true,
  default: LinearGradient,
  LinearGradient,
};
