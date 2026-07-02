// Flat config (ESLint v9+) for Node/tooling packages: base config + Node globals.
const js = require('@eslint/js');
const { FlatCompat } = require('@eslint/eslintrc');
const base = require('./index.js');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [...base, ...compat.env({ node: true, es2022: true })];
