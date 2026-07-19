# @arloui/icons

Arlo UI’s **first-party icon set**. Designers own the SVG sources in Figma; this package turns them into **React Native components** (`react-native-svg`) that apps import by name.

## Why a package — not copy-paste like primitives?

Icons are a **large, uniform asset graph**. Shipping them as `@arloui/icons` gives you:

- One **versioned artifact** (like a custom font)
- **Tree-shakeable** named imports: `import { ChevronRight } from '@arloui/icons'`
- No explosion of hundreds of files pasted into every consumer repo

Registry components (Button, Row, …) stay copy-paste; they **accept `ReactNode` slots** and you pass `<ChevronRight />` from this package.

## Consumer setup

```bash
npm install @arloui/icons react-native-svg
```

```tsx
import { ChevronRight } from '@arloui/icons';
import { useTokens } from '@/lib/arloui/theme-provider';

function Row() {
  const t = useTokens();
  return <ChevronRight width={20} height={20} color={t.colors.textSecondary} />;
}
```

Generated components follow `react-native-svg` props: `width`, `height`, `color`, `stroke`, etc., depending on the SVG (SVGR maps `fill`/`stroke` to the root).

### Copy raw SVG (HeroUI-style)

The **docs app** (`apps/docs`) includes an **`/icons`** gallery on **web**: search, preview, **Copy SVG**, and **Copy React usage**. Static SVGs are synced from this package into `apps/docs/public/arloui-icons/` (gitignored) via `npm run sync-icons -w @arloui/docs`; the icon name list lives in `apps/docs/data/icon-names.json`.

After installing **`@arloui/icons`**, you can also open **`node_modules/@arloui/icons/assets/svg/<name>.svg`** and paste the file into `SvgXml` from `react-native-svg` if you prefer not to import a component.

**Accessibility:** For decorative icons, leave them unlabeled; for meaningful icons, set `accessibilityLabel` on the **pressable** or wrap with a label — don’t rely on the raw SVG for semantics.

## Maintainer workflow (this monorepo)

1. Export SVG from Figma into `packages/icons/assets/svg/` — **one file per icon**, `kebab-case.svg`.
2. Run **`npm run icons:build`** at the repo root (uses `tooling/build-icons` + SVGR).
3. Commit **`assets/svg/`** and the updated **`src/generated/`** output.
4. Release **`@arloui/icons`** with Changesets like any other public package.

### Naming

| File | Generated component |
|------|---------------------|
| `chevron-right.svg` | `ChevronRight` |
| `arlo-check.svg` | `ArloCheck` |

## Figma checklist

- Single **stroke weight** family across the set (or explicit `thin` / `regular` **variants** if the design calls for two tiers — use different files, e.g. `check.svg` vs `check-bold.svg`).
- Fixed **grid** (24×24 recommended) so `viewBox` alignment stays predictable.
- **Outline** icons: convert strokes to outlines *only* if you need to; keeping strokes often gives cleaner RN scaling — discuss with whoever runs the build if something renders wrong.

## License

[MIT](../../LICENSE) © Base16 Labs and Arlo UI contributors.
