// Flat config (ESLint v9+). The legacy `extends` chain is bridged with FlatCompat
// so the existing plugins keep working without a full hand-rewrite.
const js = require('@eslint/js');
const { FlatCompat } = require('@eslint/eslintrc');
const tsParser = require('@typescript-eslint/parser');
const reactHooks = require('eslint-plugin-react-hooks');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  {
    ignores: ['**/dist/**', '**/build/**', '**/.expo/**', '**/.turbo/**', '**/node_modules/**'],
  },
  js.configs.recommended,
  ...compat.extends(
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'prettier',
  ),
  // React Compiler rules. Registry components are copied into consumer Expo apps
  // where the compiler runs by default, so this config is the only place that
  // catches compiler-hostile patterns before they ship. `recommended-latest`
  // replaces the legacy `plugin:react-hooks/recommended` bridged above.
  reactHooks.configs.flat['recommended-latest'],
  {
    // The compiler ruleset above lands on an existing codebase, so the classes we
    // have actually cleaned stay at `error` and the rest are warnings until a
    // dedicated pass — same ratchet apps/www uses.
    //
    // `refs` is the one that bit a real consumer: `useRef(new Animated.Value(0)).current`
    // reads a ref during render, which Expo's React Compiler rejects. Every
    // occurrence is now `useState(() => …)`, so this must not regress. The three
    // remaining reports are `PanResponder.create` inside `useMemo`, where the refs
    // are read in gesture handlers rather than during render; untangling those
    // means reworking Sheet/Carousel/Toast drag behaviour, so they carry local
    // disables pointing here.
    rules: {
      'react-hooks/refs': 'error',
      'react-hooks/immutability': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/preserve-manual-memoization': 'warn',
      'react-hooks/use-memo': 'warn',
      'react-hooks/static-components': 'warn',
      'react-hooks/purity': 'warn',
    },
  },
  {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      // Registry components may ship with `@ts-nocheck` (they're copied into consumer
      // projects that install the peer deps); allow it when it carries a reason.
      '@typescript-eslint/ban-ts-comment': [
        'error',
        { 'ts-nocheck': 'allow-with-description', minimumDescriptionLength: 3 },
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      // `StyleSheet.absoluteFillObject` was removed in React Native 0.86, and its
      // absence is invisible at runtime: the lookup yields `undefined`, RN drops
      // falsy entries from a style array by design, and whatever is left usually
      // defines no geometry — so the view silently collapses to zero size. Only a
      // typecheck catches it, and registry source is copy-pasted into apps that
      // rarely run one. `absoluteFill` survived the cleanup and flattens the same.
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "MemberExpression[object.name='StyleSheet'][property.name='absoluteFillObject']",
          message:
            'StyleSheet.absoluteFillObject was removed in React Native 0.86 and fails silently (the view collapses to zero size). Use StyleSheet.absoluteFill.',
        },
      ],
    },
  },
  {
    // Test files: provide Jest globals (Vitest tests import their globals
    // explicitly, so this block only matters for the Jest-based RN suites).
    files: ['**/*.test.{ts,tsx,js,jsx}', '**/*.spec.{ts,tsx,js,jsx}', '**/__tests__/**'],
    languageOptions: {
      globals: {
        jest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        global: 'readonly',
        process: 'readonly',
        console: 'readonly',
        __dirname: 'readonly',
        require: 'readonly',
      },
    },
    rules: {
      // Inline wrapper components (e.g. RNTL `wrapper`) don't need display names.
      'react/display-name': 'off',
    },
  },
];
