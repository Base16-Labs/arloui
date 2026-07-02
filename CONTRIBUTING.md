# Contributing to Arlo UI

Thanks for wanting to make Arlo UI better. This guide covers the day-to-day workflows.

## Setup

```bash
# Node 20+. This repo is npm-managed (root package.json defines npm workspaces).
# CI uses: npm ci
npm install
```

## Common scripts

```bash
npm run dev              # turbo: build packages + start docs
npm run build            # build everything
npm run typecheck        # tsc across the monorepo
npm run lint             # eslint across the monorepo
npm test                 # vitest (CLI + tooling) · jest + RNTL (RN packages)
npm run registry:build   # regenerate apps/www/public/r/*.json
npm run icons:build      # SVG → packages/icons/src/generated (SVGR)
npm run skill:sync       # mirror tokens + manifest into skills/references
npm run changeset        # record a release-affecting change
```

## Adding a component

1. Pick a name. Singular, lowercase, kebab-case (e.g. `button`, `bottom-sheet`).
2. Create `packages/registry/src/components/<name>/<name>.tsx` and an `index.ts`.
3. Use the existing `Button` and `Card` as the pattern reference. Conventions:
   - Import tokens via `useTokens()`. Never hardcode color/radius/spacing.
   - Default to `accessibilityRole`, `accessibilityState`, and `hitSlop` for interactive elements.
   - Press feedback uses `Animated` + `usePressableScale` semantics (140ms ease-out).
   - 44pt minimum hit area.
   - Export both the component and its `Props` type.
4. Add an entry to `packages/registry/src/manifest.ts`. Declare `registryDependencies` for any other registry items it needs (most components depend on `tokens` and `theme-provider`).
5. Add a showcase route in `apps/docs/app/components/<name>.tsx`.
6. Run `npm run registry:build` to confirm the JSON looks right.
7. Run `npm run skill:sync` to update `skills/references/` (generated files only).
8. `npm run changeset` if a published package changed.

## Editing tokens

Tokens live in `packages/tokens/src/`. The registry's copy at `packages/registry/src/foundation/tokens.ts` is the consumer-facing copy-paste template — keep its values in lockstep with `packages/tokens/src/`. After editing tokens:

```bash
npm run skill:sync       # propagate to skills/references/tokens.json
npm run registry:build   # propagate to apps/www/public/r/*.json
```

CI fails if `skills/` is out of sync after `npm run skill:sync`.

## Working with the design skill

The skill lives in this repo under **`skills/`** (`SKILL.md` + `references/`). There are two categories of files:

| File                                    | Authored by | Edit?                         |
| --------------------------------------- | ----------- | ----------------------------- |
| `skills/SKILL.md`                       | designer    | yes (hand-authored)           |
| `skills/references/tokens.md`           | designer    | yes (hand-authored)           |
| `skills/references/components.md`       | designer    | yes (hand-authored)           |
| `skills/references/platform-mapping.md` | designer    | yes (hand-authored)           |
| `skills/references/tokens.json`         | machine     | **no** — `npm run skill:sync` |
| `skills/references/registry.json`       | machine     | **no** — `npm run skill:sync` |
| `skills/references/usage.md`            | machine     | **no** — `npm run skill:sync` |

After any token or registry change, run `npm run skill:sync` and commit the regenerated JSON/usage.md alongside your TS changes.

To load the skill into your local Cursor / Claude Code while developing:

```bash
node scripts/install-skill.mjs cursor --symlink   # symlinked, picks up edits live
node scripts/install-skill.mjs claude --symlink
```

## Icons (first-party SVG set)

1. Export SVGs from Figma into `packages/icons/assets/svg/` — one icon per file, `kebab-case` (e.g. `chevron-right.svg`).
2. Run **`npm run icons:build`** and commit both **`assets/svg/`** and **`packages/icons/src/generated/`**.
3. Refresh the docs icon gallery (HeroUI-style “copy SVG”): **`npm run sync-icons -w @arloui/docs`** and commit **`apps/docs/data/icon-names.json`**. The folder **`apps/docs/public/arloui-icons/`** is gitignored and repopulated by that script (and automatically before **`npm run web -w @arloui/docs`** / **`build:web`**).
4. Release **`@arloui/icons`** via Changesets like any other public package. Consumers install `@arloui/icons` + `react-native-svg`.

Details: [`packages/icons/README.md`](./packages/icons/README.md).

## Code style

- Strict TypeScript. No `any` unless you can defend it.
- Components avoid prop sprawl: prefer compound APIs (`Card.Header`, `Card.Title`) over `headerStyle` / `titleStyle` props.
- No comments that narrate code. Reserve comments for intent the code can't convey.
- Run `npm run format` before committing.

## PR checklist

- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm test` passes
- [ ] `npm run registry:build` is reflected in `apps/www/public/r/`
- [ ] `npm run skill:sync` is reflected in `skills/references/` (if tokens or registry changed)
- [ ] Changeset added (if a published package changed)
- [ ] Docs page added (if a new component was added)
