import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // E2E specs run separately (they need the built bundle) — see vitest.e2e.config.ts.
    exclude: ['**/node_modules/**', '**/*.e2e.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      // Exclude tests, the bin entry (thin glue), and the barrel re-export.
      exclude: ['src/**/__tests__/**', 'src/cli.ts', 'src/index.ts'],
      reporter: ['text', 'text-summary'],
      thresholds: {
        statements: 90,
        branches: 88,
        functions: 90,
        lines: 90,
      },
    },
  },
});
