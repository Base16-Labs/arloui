# Arlo UI — Architecture

This document explains why Arlo UI is structured the way it is. Read it before adding a new package, changing the registry shape, or renaming a token.

## Goals (and non-goals)

**Goals**

- Copy-paste, never installed. Components live inside the consumer's repo so they can be read, customized, and grep'd.
- One source of truth per concern. Tokens live in one place; the manifest lives in one place; the CLI is one binary.
- Designer-friendly. Figma is upstream of code. The design system, the skill, and the registry stay in lockstep.
- AI-friendly. The Cursor skill knows what's available and how to install it without inventing components from scratch.
- Sustainable. Adding the 50th component should be as easy as adding the 5th.

**Non-goals**

- A black-box runtime UI library. You won't `import { Button } from 'arloui'`.
- A styling DSL. We use `StyleSheet.create` + tokens. NativeWind, Tamagui, Restyle are all great — they just aren't us.
- Web-first. Components run on the web (via `react-native-web`) but are designed for mobile.

## Package managers (monorepo)

Root **`package.json`** defines npm **`workspaces`**, and **`pnpm-workspace.yaml`** lists the same globs for pnpm. Cross-package dependencies use **`file:../…`** (or **`file:../../packages/…`**) specifiers so **npm, Yarn, pnpm, and Bun** all link to local sources reliably. The root **`packageManager`** field targets **npm** because **Turborepo** uses it when spawning tasks; **`.npmrc`** sets **`package-manager-strict=false`** so **pnpm** is not blocked by that field. CI continues to run **`pnpm install --frozen-lockfile`** against **`pnpm-lock.yaml`**.

## Data flow

The skill and the implementation live in the same repo and same PR. Hand-authored design intent (markdown) and engineer-authored implementation (TS) are checked in side-by-side; CI rebuilds the generated machine-readable views and fails on drift.

```
            ┌─────────────────────┐
            │   Figma (designer)  │
            └──────────┬──────────┘
                       │ tokens, components, variants
                       ▼
   ┌────────────────────────────────────────────────────────────────┐
   │                      arloui monorepo                           │
   │                                                                │
   │  Hand-authored DESIGN INTENT          Hand-authored IMPL       │
   │  (markdown — designer's domain)       (TS — engineer's domain) │
   │                                                                │
   │  skills/                              packages/tokens/src      │
   │   ├── SKILL.md                       packages/registry/src    │
   │   └── references/                                              │
   │       ├── tokens.md                                            │
   │       ├── components.md                                        │
   │       └── platform-mapping.md                                  │
   │                       │                       │                │
   │                       │                       │                │
   │       pnpm skill:sync ◀───────────────────────┘                │
   │                       │                                        │
   │                       ▼                                        │
   │  Generated MACHINE REFS (do not edit)                          │
   │  skills/references/                                          │
   │   ├── tokens.json                                              │
   │   ├── registry.json                                            │
   │   └── usage.md                                                 │
   │                                                                │
   │                       │   pnpm registry:build                  │
   │                       │           │                            │
   │                       ▼           ▼                            │
   │  Cursor / Claude /        apps/www/public/r/*.json             │
   │  Codex agent              (consumed by the `arloui` CLI)       │
   └────────────────────────────────────────────────────────────────┘
                              │
                              │ npx arloui add button
                              ▼
                   ┌──────────────────────┐
                   │  Consumer's RN app   │
                   │  components/ui/*.tsx │
                   └──────────────────────┘
```

Two simple rules govern every edit:

1. **Markdown in `skills/`** (`SKILL.md`, `references/*.md`) = design contract. Designer-domain. Engineers don't edit it.
2. **TS in `packages/tokens` / `packages/registry`** = implementation. Engineer-domain. Run `pnpm skill:sync` after; CI fails if you don't.

## Package responsibilities

| Package                  | Public? | Responsibility                                                               |
| ------------------------ | ------- | ---------------------------------------------------------------------------- |
| `@arloui/tokens`         | yes     | Color, type, spacing, radius, motion, shadows. Plain TS objects + raw JSON.  |
| `@arloui/theme`          | yes     | `ThemeProvider`, `useTheme`, `useTokens`, `createStyles`.                    |
| `@arloui/utils`          | yes     | `cn`, `pick`, `usePressableScale`, `haptic`. Tiny, no internal abstractions. |
| `@arloui/icons`          | yes     | First-party SVG icons → `react-native-svg` components. Named exports.        |
| `arloui` (`@arloui/cli`) | yes     | The user-facing CLI binary.                                                  |
| `@arloui/registry`       | no      | Component source files + `manifest.ts`. Never published.                     |
| `@arloui/build-registry` | no      | Reads manifest, writes per-entry JSON to `apps/www/public/r/`.               |
| `@arloui/build-icons`    | no      | SVGR pipeline: `packages/icons/assets/svg` → `packages/icons/src/generated`. |
| `skills/` (skill bundle) | no      | Cursor / Claude / Codex skill under `skills/` (same idea as [HeroUI `skills/*`](https://github.com/heroui-inc/heroui/tree/v3/skills), one skill per folder — ours is flat). Hand-authored markdown + generated refs. |
| `@arloui/eslint-config`  | no      | Shared ESLint rules.                                                         |
| `@arloui/tsconfig`       | no      | Shared TS configs (`base`, `react-native`, `node`).                          |
| `@arloui/www`            | no      | Web-first docs and copy surface: registry code, icon SVG copy, CLI snippets. |
| `@arloui/docs`           | no      | Expo playground/showcase for validating React Native behavior.               |

## Icons (`@arloui/icons`)

Custom Arlo icons are **not** copied per-app like Button or Card. They are a **versioned package** plus a **single native dependency**:

- **Consumers** add `@arloui/icons` and `react-native-svg`, then `import { MyIcon } from '@arloui/icons'`.
- **Maintainers** drop SVG exports from Figma into `packages/icons/assets/svg/` (kebab-case filenames), run **`pnpm icons:build`**, and commit **`assets/svg/`** plus the generated **`src/generated/`** output from SVGR (`tooling/build-icons`).

Registry primitives take `ReactNode` slots (`leadingIcon`, etc.) so you compose `<ArloFlag />` from `@arloui/icons` without forking the primitive.

## Why the docs site is web-first

Arlo UI ships React Native source, but the public browsing experience is a website. Users expect
normal browser behavior there: real links, CSS grid, text selection, clipboard APIs, searchable
lists, tabs, modals, and raw SVG copy. `apps/www` is intentionally web-native so those interactions
stay simple and reliable.

The Expo app in `apps/docs` remains useful, but its job is different: it is a playground for
validating the actual React Native components on iOS, Android, and React Native Web. Registry
components stay RN-only; the docs shell does not have to be.

## Why the consumer-side `tokens.ts` is duplicated

The registry's `foundation/tokens.ts` contains the same values as `packages/tokens/src/`. That looks like duplication, but it's intentional: registry source files are templates that get copy-pasted into consumer projects, where they must work without `@arloui/tokens` as a dependency.

`pnpm skill:sync` and a CI check verify the two files stay numerically aligned. Designers edit the one in `packages/tokens` (the canonical TS source); the registry one is regenerated on release.

## Why `StyleSheet`, not Tailwind/NativeWind

The Arlo design skill (`tokens.md`, `platform-mapping.md`) explicitly calls for dependency-light, copy-paste code that uses `StyleSheet` + small token objects. NativeWind would force every consumer to install + configure it, which breaks the "drop into any RN project" promise. Components stay readable as plain RN code.

If a consumer prefers NativeWind, they can adapt the components themselves — the registry source is already theirs.

## Why a custom registry instead of just publishing components to npm

shadcn proved this model is the right one for design systems where consumers need to customize. The pain points of "install a component library" are well-known: prop sprawl, leaky theming, breaking-change anxiety, fork-and-patch workflows. By shipping source code and tokens that live in the consumer's repo, we sidestep all of them. The trade-off is upgrade cost (`arloui diff` helps surface drift) and that's a fair price.

## Adding a component

1. Create `packages/registry/src/components/<name>/<name>.tsx` and an `index.ts`.
2. Add an entry to `packages/registry/src/manifest.ts`.
3. Add a showcase route in `apps/docs/app/components/<name>.tsx`.
4. Run `pnpm registry:build` and verify the JSON output.
5. Run `pnpm skill:sync` to update `skills/references/` (generated JSON + `usage.md` only).
6. Run `pnpm changeset` if any published package changes.

## Versioning model

- **CLI, tokens, theme, utils** — semver via Changesets. Released on merge to `main`.
- **Registry components** — content hash. Each component's JSON includes a `hash` derived from its file contents. `arloui diff` uses it to detect drift.
- **Registry index** — `version` field bumped manually when the schema changes (rare).

## Tokens contract with the design skill

The skill's `tokens.md` is hand-authored markdown for humans (designers and the AI). The skill's `tokens.json` is generated by `pnpm skill:sync` and read programmatically. They must agree.

CI runs `pnpm skill:sync` and fails if `skills/` changes — meaning the implementation drifted from the spec. Designers update `tokens.md`; engineers update `packages/tokens/src/*.ts`; the sync script catches mismatches.

## Loading the skill into your local agent

The content under **`skills/`** (`SKILL.md` + `references/`) is the same shape Cursor / Claude Code / Codex expect after install (they land in `…/arloui/` for the agent). To use it locally:

```bash
# symlinked install — edits in the repo flow into the agent automatically
node scripts/install-skill.mjs cursor --symlink
node scripts/install-skill.mjs claude --symlink

# or copy the folder once
node scripts/install-skill.mjs cursor
```

For project-scoped installs and the full compatibility matrix, see [`skills/README.md`](./skills/README.md).
