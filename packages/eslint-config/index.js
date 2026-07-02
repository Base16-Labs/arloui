// Flat config (ESLint v9+). The legacy `extends` chain is bridged with FlatCompat
// so the existing plugins keep working without a full hand-rewrite.
const js = require('@eslint/js');
const { FlatCompat } = require('@eslint/eslintrc');
const tsParser = require('@typescript-eslint/parser');

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
    'plugin:react-hooks/recommended',
    'prettier',
  ),
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
