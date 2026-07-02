import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/raw.ts'],
  format: ['cjs', 'esm'],
  dts: {
    compilerOptions: {
      incremental: false,
    },
  },
  clean: true,
  sourcemap: true,
  treeshake: true,
  splitting: false,
  external: ['react-native'],
});
