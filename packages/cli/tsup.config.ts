import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    cli: 'src/cli.ts',
  },
  format: ['cjs'],
  target: 'node20',
  dts: { entry: { index: 'src/index.ts' } },
  clean: true,
  sourcemap: true,
  splitting: false,
  shims: true,
  banner: ({ format }) => {
    if (format === 'cjs') {
      return { js: '#!/usr/bin/env node' };
    }
    return {};
  },
});
