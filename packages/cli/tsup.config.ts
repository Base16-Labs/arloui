import { defineConfig } from 'tsup';
import packageJson from './package.json';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    cli: 'src/cli.ts',
  },
  format: ['cjs'],
  target: 'node20',
  dts: {
    entry: { index: 'src/index.ts' },
    compilerOptions: {
      incremental: false,
    },
  },
  clean: true,
  sourcemap: true,
  splitting: false,
  shims: true,
  define: {
    __ARLOUI_VERSION__: JSON.stringify(packageJson.version),
  },
  banner: ({ format }) => {
    if (format === 'cjs') {
      return { js: '#!/usr/bin/env node' };
    }
    return {};
  },
});
