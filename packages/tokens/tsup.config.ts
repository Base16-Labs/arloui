import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/raw.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  splitting: false,
});
