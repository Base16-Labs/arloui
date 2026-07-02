import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      // index.ts is the thin IO orchestrator (the CLI entry); the testable
      // building blocks live in lib.ts.
      exclude: ['src/**/__tests__/**', 'src/index.ts'],
      reporter: ['text', 'text-summary'],
      thresholds: {
        statements: 95,
        branches: 90,
        functions: 95,
        lines: 95,
      },
    },
  },
});
