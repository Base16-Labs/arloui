import { defineConfig } from 'vitest/config';

// End-to-end tests exercise the *built* CLI binary as a subprocess against a
// real HTTP registry. They need the bundle built first (CI runs `npm run build`
// before `test:e2e`) and are kept out of the fast unit run.
export default defineConfig({
  test: {
    include: ['src/**/*.e2e.test.ts'],
    testTimeout: 120_000,
    hookTimeout: 180_000,
  },
});
