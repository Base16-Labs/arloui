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
  badge: 'badge', button: 'button', cards: 'card', carousel: 'carousel',
  checkbox: 'checkbox', chip: 'chip', 'date-picker': 'date-picker', gallery: 'gallery',
  input: 'input', list: 'list', radio: 'radio', sheet: 'sheet',
  skeleton: 'skeleton', spinner: 'spinner', 'tab-bar': 'tab-bar', tabs: 'tabs',
  textarea: 'text-area', toast: 'toast', toggle: 'toggle',
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

// Deps may live in apps/docs/node_modules (unhoisted) or the root.
const NODE_MODULES = [join(DOCS, 'node_modules'), join(REPO, 'node_modules')];

/**
 * The SDK's recommended version range for every module Expo Go ships with.
 * Snack's editor lints each dependency against this exact map and warns
 * ("'expo-font@14.0.11' is not the recommended version for SDK 54.0.0") on any
 * other string — including a concrete version that satisfies the range.
 */
const bundledNativeModules = (() => {
  for (const base of NODE_MODULES) {
    try {
      return JSON.parse(readFileSync(join(base, 'expo/bundledNativeModules.json'), 'utf8'));
    } catch {
      // try the next location
    }
  }
  console.warn('! expo/bundledNativeModules.json not found — Snacks may warn about dep versions');
  return {};
})();

// The recommendations above only match the editor's if the installed SDK is the
// one we publish against.
const installedSdk = resolveInstalledVersion('expo');
if (installedSdk && installedSdk.split('.')[0] !== SDK_VERSION.split('.')[0]) {
  console.warn(`! installed expo ${installedSdk} != SDK_VERSION ${SDK_VERSION} — bump SDK_VERSION`);
}

function resolveInstalledVersion(pkg) {
  for (const base of NODE_MODULES) {
    try {
      return JSON.parse(readFileSync(join(base, pkg, 'package.json'), 'utf8')).version;
    } catch {
      // try the next location
    }
  }
  return null;
}

/**
 * Modules Expo Go bundles resolve to the SDK's recommended range verbatim — the
 * runtime provides them, so Snackager never builds them and a range is safe.
 *
 * Everything else must store a CONCRETE version: a cold Expo Go deep link asks
 * Snackager to build the version string verbatim, and "^0.4.2" isn't a buildable
 * target ("unable to fetch module ...@^0.4.2"). Read the resolved version from
 * node_modules; fall back to the package.json range.
 */
function resolveVersion(pkg) {
  return bundledNativeModules[pkg] ?? resolveInstalledVersion(pkg) ?? allDeps[pkg] ?? '*';
}

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
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope';
import { SpaceGrotesk_400Regular, SpaceGrotesk_500Medium, SpaceGrotesk_600SemiBold } from '@expo-google-fonts/space-grotesk';
import { SpaceMono_400Regular } from '@expo-google-fonts/space-mono';
import Screen from ${JSON.stringify(join(DOCS, 'app', `${screen}.tsx`))};

// Mirrors apps/docs playground-fonts (keys match the token fontFamilies) minus
// Doto, which isn't referenced by any component/chrome and fails to resolve in
// Snack. Keep in sync if the playground's font set changes.
const fontAssets = {
  Manrope: Manrope_400Regular,
  'Manrope Medium': Manrope_500Medium,
  'Manrope SemiBold': Manrope_600SemiBold,
  'Manrope Bold': Manrope_700Bold,
  'Space Grotesk': SpaceGrotesk_400Regular,
  'Space Grotesk Medium': SpaceGrotesk_500Medium,
  'Space Grotesk SemiBold': SpaceGrotesk_600SemiBold,
  'Space Mono': SpaceMono_400Regular,
};

export default function App() {
  const [loaded] = useFonts(fontAssets);
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
    dependencies[pkg] = { version: resolveVersion(pkg) };
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
