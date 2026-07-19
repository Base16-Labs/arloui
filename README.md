# Arlo UI

> Premium, copy-paste React Native components. Token-driven. Zero black boxes.

Arlo UI is the React Native equivalent of [shadcn/ui](https://ui.shadcn.com) and Tailwind UI: a curated registry of components that you copy into your own codebase via a CLI, instead of installing as an opaque package.

```bash
npx arloui init        # writes arlo.json + tokens + ThemeProvider
npx arloui add button  # copies the Button source into your project
```

That's it. Primitives live in your `components/ui/` folder. **Icons** ship as a small npm package (`@arloui/icons`) so you don't paste hundreds of SVG wrappers — see [`packages/icons/README.md`](./packages/icons/README.md).

## Why

- **Mobile-first by design.** Built around the Arlo design system (mobile, dark-first, premium).
- **`StyleSheet`-native.** No NativeWind, no Tamagui, no styling DSL. Just `StyleSheet.create` + a `useTokens()` hook. Drops into any Expo or bare RN app cleanly.
- **Tokens are the source of truth.** Color, type, spacing, radius, motion — all live in one place and flow into Figma, code, and the design skill in lockstep.
- **AI-friendly.** Ships with a built-in design skill under [`skills/`](./skills) (`SKILL.md` + `references/`) that teaches Cursor / Claude Code / Codex the rules of the system, the component inventory, and how to use the CLI. The skill and the implementation live in the same repo so they can never drift.

## Repo layout

```
arloui/
├── apps/
│   ├── www/                   Web-first docs + copy surface
│   └── docs/                  Expo playground/showcase for RN behavior
├── skills/
│   ├── SKILL.md               Design skill entry (agent-facing)
│   └── references/            Tokens, components, platform mapping + generated JSON
├── packages/
│   ├── tokens/                Source of truth for all design tokens
│   ├── theme/                 ThemeProvider + useTheme + createStyles
│   ├── utils/                 cn, platform helpers, usePressableScale, haptics
│   ├── icons/                 First-party SVG → react-native-svg (`@arloui/icons`)
│   ├── registry/              Component source files (Button, Card, …)
│   ├── cli/                   The `arloui` command
│   ├── tsconfig/              Shared TS configs
│   └── eslint-config/         Shared ESLint configs
├── tooling/
│   ├── build-registry/        Compiles registry source → JSON for the CLI
│   └── build-icons/           SVG → RN components for `@arloui/icons`
├── scripts/
│   ├── sync-skill.ts          Mirrors tokens + manifest into skills/references
│   └── install-skill.mjs      Installs the skill into your local Cursor/Claude
└── …
```

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the full data flow.

## Quickstart (this repo)

Requires **Node 20+**. This monorepo is **npm-managed** — npm `workspaces` in the root `package.json`, a committed `package-lock.json`, and a root `packageManager` field pinned to npm. Root scripts wrap **Turbo**.

| Task                 | Command                  |
| -------------------- | ------------------------ |
| Install              | `npm install`            |
| Build all            | `npm run build`          |
| Dev (docs site)      | `npm run dev`            |
| Dev (Expo)           | `npm run dev:playground` |
| Dev (packages)       | `npm run dev:packages`   |
| Dev (full workspace) | `npm run dev:all`        |
| Test                 | `npm test`               |

The repo-level `.npmrc` sets `legacy-peer-deps=true` and `install-strategy=nested` so workspace resolution stays predictable for the pinned React / React Native versions. **CI** on GitHub runs `npm ci` against the committed `package-lock.json`.

```bash
npm install
npm run icons:build     # SVG in packages/icons/assets/svg → src/generated (SVGR)
npm run registry:build  # generates apps/www/public/r/*.json
npm run dev
```

Open the web-first copy surface at `http://localhost:4321`. It serves raw icons from
`packages/icons/assets/svg`, icon names from `apps/docs/data/icon-names.json`, and registry JSON
from `apps/www/public/r`.

Use the Expo playground when you need to verify actual React Native rendering:

```bash
npm run playground          # starts Expo on LAN and shows a QR code for Expo Go
npm run playground:tunnel   # use this if LAN scanning fails
npm run playground:ios
npm run playground:android
```

`npm run dev` intentionally starts only the docs site to keep local memory usage low. Use
`npm run dev:packages` when editing package source, or `npm run dev:all` when you explicitly
need the docs, Expo, registry, and every package watcher running together.

## Quickstart (consumer app)

In your Expo app:

```bash
npx arloui init
npx arloui add button card
```

Wrap your app:

```tsx
// app/_layout.tsx
import { ThemeProvider } from '@/lib/arloui/theme-provider';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Slot />
    </ThemeProvider>
  );
}
```

Install icons (first-party Arlo set — separate package from copy-paste primitives):

```bash
npm install @arloui/icons react-native-svg
```

Use a component:

```tsx
import { Button } from '@/components/ui/button';
import { ChevronRight } from '@arloui/icons';

<Button
  label="Continue"
  trailingIcon={<ChevronRight width={20} height={20} />}
  onPress={onSubmit}
/>;
```

Color the icon via token: pass `color={t.colors.textPrimary}` from `useTokens()` in the same file.

## Loading the skill into your agent

```bash
# install the Arlo UI skill into Cursor (symlinked so edits flow live)
node scripts/install-skill.mjs cursor --symlink

# or into Claude Code
node scripts/install-skill.mjs claude --symlink
```

After install, the skill activates whenever you ask Cursor / Claude for Arlo UI work. See [`skills/README.md`](./skills/README.md) for project-level installs and the full compatibility matrix.

## Contributing

Bug fixes, documentation, tests, and scoped improvements are welcome. During beta, new components are maintainer-led and must be proposed in an issue before implementation.

- [Contribution guide](./CONTRIBUTING.md)
- [Versioning and updates](./VERSIONING.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Security policy](./SECURITY.md)

## Releasing

Every push to `main` validates, packs, and publishes a new patch of the `arloui` CLI. The checked-in
CLI version defines the release line and the GitHub Actions run number supplies the patch, so a base
version of `0.1.0` publishes as `0.1.x`. Bump the checked-in minor or major version when starting a
new release line.

The first publish uses the repository's `NPM_TOKEN` secret. After the package exists on npm, configure
`.github/workflows/release.yml` as its trusted publisher and the workflow can publish through OIDC.

The tokens, theme, icons, and utils packages continue to use Changesets when they need a release:

```bash
npm run changeset
git commit -am "chore: changeset"
# CI takes it from here
```

Components themselves don't version through npm — they version by content hash inside the registry JSON, exactly like shadcn.

## License

[MIT](./LICENSE) © Base16 Labs and Arlo UI contributors.
