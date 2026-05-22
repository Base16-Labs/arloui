# Contributing to Arlo UI

Thanks for wanting to make Arlo UI better. This guide covers the day-to-day workflows.

## Setup

```bash
# Node 20+. Use pnpm, npm, Yarn, or Bun — root package.json defines npm workspaces.
# CI uses: pnpm install --frozen-lockfile
corepack enable   # optional; helps if you choose pnpm via Corepack
pnpm install      # or: npm install | yarn | bun install
```

## Common scripts

```bash
pnpm dev              # turbo: build packages + start docs
pnpm build            # build everything
pnpm typecheck        # tsc across the monorepo
pnpm lint             # eslint across the monorepo
pnpm registry:build   # regenerate apps/www/public/r/*.json
pnpm icons:build      # SVG → packages/icons/src/generated (SVGR)
pnpm skill:sync       # mirror tokens + manifest into skills/references
pnpm changeset        # record a release-affecting change
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
6. Run `pnpm registry:build` to confirm the JSON looks right.
7. Run `pnpm skill:sync` to update `skills/references/` (generated files only).
8. `pnpm changeset` if a published package changed.

## Editing tokens

Tokens live in `packages/tokens/src/`. The registry's copy at `packages/registry/src/foundation/tokens.ts` is the consumer-facing copy-paste template — keep its values in lockstep with `packages/tokens/src/`. After editing tokens:

```bash
pnpm skill:sync       # propagate to skills/references/tokens.json
pnpm registry:build   # propagate to apps/www/public/r/*.json
```

CI fails if `skills/` is out of sync after `pnpm skill:sync`.

## Working with the design skill

The skill lives in this repo under **`skills/`** (`SKILL.md` + `references/`). There are two categories of files:

| File                                           | Authored by | Edit?                            |
| ---------------------------------------------- | ----------- | -------------------------------- |
| `skills/SKILL.md`                              | designer    | yes (hand-authored)              |
| `skills/references/tokens.md`                | designer    | yes (hand-authored)              |
| `skills/references/components.md`            | designer    | yes (hand-authored)              |
| `skills/references/platform-mapping.md`      | designer    | yes (hand-authored)              |
| `skills/references/tokens.json`              | machine     | **no** — `pnpm skill:sync`       |
| `skills/references/registry.json`            | machine     | **no** — `pnpm skill:sync`       |
| `skills/references/usage.md`                 | machine     | **no** — `pnpm skill:sync`       |

After any token or registry change, run `pnpm skill:sync` and commit the regenerated JSON/usage.md alongside your TS changes.

To load the skill into your local Cursor / Claude Code while developing:

```bash
node scripts/install-skill.mjs cursor --symlink   # symlinked, picks up edits live
node scripts/install-skill.mjs claude --symlink
```

## Icons (first-party SVG set)

1. Export SVGs from Figma into `packages/icons/assets/svg/` — one icon per file, `kebab-case` (e.g. `chevron-right.svg`).
2. Run **`pnpm icons:build`** and commit both **`assets/svg/`** and **`packages/icons/src/generated/`**.
3. Refresh the docs icon gallery (HeroUI-style “copy SVG”): **`npm run sync-icons -w @arloui/docs`** (or `pnpm --filter @arloui/docs sync-icons`, `yarn workspace @arloui/docs sync-icons`, etc.) and commit **`apps/docs/data/icon-names.json`**. The folder **`apps/docs/public/arloui-icons/`** is gitignored and repopulated by that script (and automatically before **`npm run web -w @arloui/docs`** / **`build:web`**).
4. Release **`@arloui/icons`** via Changesets like any other public package. Consumers install `@arloui/icons` + `react-native-svg`.

Details: [`packages/icons/README.md`](./packages/icons/README.md).

## Code style

- Strict TypeScript. No `any` unless you can defend it.
- Components avoid prop sprawl: prefer compound APIs (`Card.Header`, `Card.Title`) over `headerStyle` / `titleStyle` props.
- No comments that narrate code. Reserve comments for intent the code can't convey.
- Run `pnpm format` before committing.

## PR checklist

- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm registry:build` is reflected in `apps/www/public/r/`
- [ ] `pnpm skill:sync` is reflected in `skills/references/` (if tokens or registry changed)
- [ ] Changeset added (if a published package changed)
- [ ] Docs page added (if a new component was added)


