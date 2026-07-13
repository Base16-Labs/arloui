// React Native packages share the base flat config.
//
// NOTE: `eslint-plugin-react-native` (v4.1.0, latest) is not compatible with
// ESLint 9 — its rules call the removed `context.getScope()` and crash. It has no
// ESLint 9 release, so the RN-specific style rules (no-inline-styles,
// no-color-literals, no-unused-styles) are omitted until a compatible plugin
// exists. The subpath is kept stable so consumers don't need to change.
module.exports = require('./index.js');
