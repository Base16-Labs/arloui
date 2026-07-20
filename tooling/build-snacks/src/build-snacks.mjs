/**
 * Generates a live Expo Snack for each component by bundling its real
 * apps/docs playground screen (variant controls, bottom pill, fonts, and all)
 * with esbuild, then saving it as an anonymous Snack on Expo's public runtime.
 * Writes the slug -> Snack id map to apps/www/lib/snack-map.json.
 *
 * No auth required (anonymous Snacks). Run: `node src/build-snacks.mjs`.
 */
import { build } from 'esbuild';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Snack } from 'snack-sdk';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, '..', '..', '..');
const DOCS = join(REPO, 'apps/docs');
const TMP = join(HERE, '..', '.tmp');
const SNACK_MAP = join(REPO, 'apps/www/lib/snack-map.json');
const SDK_VERSION = '54.0.0';

mkdirSync(TMP, { recursive: true });

// apps/docs screen file -> the www docs slug DevicePreview passes as `route`.
const SCREENS = {
  badge: 'badge', button: 'button', carousel: 'carousel', checkbox: 'checkbox',
  chip: 'chip', 'date-picker': 'date-picker', gallery: 'gallery', input: 'input',
  radio: 'radio', sheet: 'sheet', skeleton: 'skeleton', 'tab-bar': 'tab-bar',
  tabs: 'tabs', textarea: 'text-area', toggle: 'toggle',
};

// A single Snack has no file-based routing, so stub expo-router.
const stubPath = join(TMP, '_expo-router-stub.js');
writeFileSync(
  stubPath,
  `const noop = () => {};
const Null = () => null;
export const Stack = Object.assign(Null, { Screen: Null });
export const Tabs = Object.assign(Null, { Screen: Null });
export const Drawer = Object.assign(Null, { Screen: Null });
export const Slot = ({ children }) => children ?? null;
export const Link = ({ children }) => children ?? null;
export const Redirect = Null;
export const router = { back: noop, push: noop, replace: noop, navigate: noop, dismiss: noop, setParams: noop, canGoBack: () => false };
export const useRouter = () => router;
export const useNavigation = () => ({ setOptions: noop, navigate: noop, goBack: noop });
export const useLocalSearchParams = () => ({});
export const useGlobalSearchParams = () => ({});
export const usePathname = () => '/';
export const useSegments = () => [];
export const useFocusEffect = noop;
`,
);

// Auto-import React so the classic JSX transform resolves everywhere without the
// automatic runtime (Snack can't resolve the "react/jsx-runtime" subpath).
const reactShimPath = join(TMP, '_react-shim.js');
writeFileSync(reactShimPath, `import * as React from 'react';\nexport { React };\n`);

const docsPkg = JSON.parse(readFileSync(join(DOCS, 'package.json'), 'utf8'));
const allDeps = { ...docsPkg.dependencies, ...docsPkg.devDependencies };
const PROVIDED = new Set(['react', 'react-native', 'react-dom']);

async function bundleScreen(screen) {
  // Entry wraps the real screen in the providers the app root supplies — and
  // loads the same Manrope / Space Mono fonts so text matches the playground.
  const entryPath = join(TMP, `_entry_${screen}.tsx`);
  writeFileSync(
    entryPath,
    `import * as React from 'react';
import { useFonts } from 'expo-font';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@arloui/registry';
import { playgroundFontAssets } from ${JSON.stringify(join(DOCS, 'providers/playground-fonts'))};
import Screen from ${JSON.stringify(join(DOCS, 'app', `${screen}.tsx`))};

export default function App() {
  const [loaded] = useFonts(playgroundFontAssets);
  if (!loaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#155DFC" />
      </View>
    );
  }
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Screen />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
`,
  );

  const externals = new Set();
  const result = await build({
    entryPoints: [entryPath],
    bundle: true,
    format: 'esm',
    jsx: 'transform',
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    inject: [reactShimPath],
    platform: 'neutral',
    mainFields: ['module', 'main'],
    tsconfig: join(DOCS, 'tsconfig.json'),
    absWorkingDir: DOCS,
    nodePaths: [join(REPO, 'node_modules')],
    write: false,
    logLevel: 'silent',
    plugins: [
      {
        name: 'arlo-split',
        setup(b) {
          // Bundle @arloui/*, @/, and relative code; externalize every npm pkg.
          b.onResolve({ filter: /.*/ }, (args) => {
            const p = args.path;
            if (p.startsWith('.') || p.startsWith('/') || p.startsWith('@/') || p.startsWith('@arloui/')) return;
            if (p === 'expo-router' || p.startsWith('expo-router/')) return { path: stubPath };
            externals.add(p.startsWith('@') ? p.split('/').slice(0, 2).join('/') : p.split('/')[0]);
            return { path: p, external: true };
          });
        },
      },
    ],
  });

  const dependencies = {};
  for (const pkg of externals) {
    if (PROVIDED.has(pkg) || pkg.startsWith('react/')) continue;
    dependencies[pkg] = { version: allDeps[pkg] ?? '*' };
  }
  return { code: result.outputFiles[0].text, dependencies };
}

const map = {};
for (const [screen, slug] of Object.entries(SCREENS)) {
  const { code, dependencies } = await bundleScreen(screen);
  const snack = new Snack({
    sdkVersion: SDK_VERSION,
    online: true,
    name: `Arlo UI · ${slug}`,
    description: `Live ${slug} playground — tap to feel the haptics.`,
    files: { 'App.tsx': { type: 'CODE', contents: code } },
    dependencies,
  });
  const saved = await snack.saveAsync();
  map[slug] = saved.id;
  console.log(`${slug.padEnd(12)} -> ${saved.id}  (${(code.length / 1024).toFixed(0)}kb, deps: ${Object.keys(dependencies).join(', ')})`);
  await new Promise((r) => setTimeout(r, 400));
}

// Sorted for stable diffs.
const sorted = Object.fromEntries(Object.entries(map).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(SNACK_MAP, JSON.stringify(sorted, null, 2) + '\n');
console.log(`\nWrote ${Object.keys(sorted).length} entries to apps/www/lib/snack-map.json`);
process.exit(0);
