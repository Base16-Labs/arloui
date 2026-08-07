# Arlo UI Tokens

## Design Voice

- Mobile-first and premium.
- Dark-first, but light mode must feel intentional rather than inverted.
- Disciplined and restrained by default — decoration is earned, never assumed.
- Meticulous in interaction feel: the "why does this feel so clean?" layer of craft.

## Typography

Default families (shipped in `theme.fontFamilies`):

- `sans`: `Manrope` — every UI and display size.
- `mono`: `Space Mono` — numeric and status contexts (see rules below).
- `display`: `Manrope` — there is no separate display face; the display sizes are Manrope at semibold.

Scale for mobile (token → size/line-height, weight, letter-spacing). These mirror the shipped `theme.typography` tokens — reference the token, never hardcode the numbers:

- `displayXl`: `34/42.5`, semibold `600`, `-0.68` — hero metrics or launch moments only
- `displayLg`: `28/35`, semibold `600`, `-0.56` — top-of-screen numbers or titles
- `title1`: `24/30`, semibold `600`, `-0.48`
- `title2`: `20/26`, semibold `600`, `-0.2`
- `title3`: `17/22`, medium `500`, `-0.17`
- `body`: `14/20`, regular `400`
- `bodySm`: `12/17`, regular `400`
- `label`: `11/13`, medium `500` — uppercase or mono when useful; add `0.06em` letter-spacing when uppercase

Rules:

- Use `Space Mono` for prices, timestamps, percentages, status labels, and tabular data.
- Reserve the largest display sizes for a single hero element, never for body copy.
- Let whitespace and scale create luxury before typography tries to.

## Color

Canonical values live in **`packages/tokens`** (main palette, secondary palette, semantic + legacy flat maps). Run `npm run skill:sync` after token changes to refresh `references/tokens.json`.

### Main palette (Figma)

- **Base:** White `#FFFFFF`, Black `#000000`
- **Grey 50–950:** `#F9FAFB` … `#09090B` (see `packages/tokens/src/paletteMain.ts`)
- **Primary (blue), Success, Warning, Error:** full 50–950 scales in code (Main Palette frame)

### Semantic tokens (utility table — light mode)

Examples (camelCase in TS: `surfaceBackground`, `textPrimary`, …):

| Semantic | Light value (reference) |
| --- | --- |
| `surface-background` | Grey-50 — app background |
| `surface-input` | Grey-100 |
| `surface-elevated` | White — cards, sheets |
| `surface-overlay` | Grey-900 @ 40% — scrims |
| `text-primary` | Grey-900 |
| `text-secondary` | Grey-600 |
| `text-tertiary` | Grey-400 |
| `interactive-primary` | Primary-600 |
| `interactive-primary-pressed` | Primary-700 |
| `border-primary` | Grey-300 |
| `border-secondary` | Grey-200 |
| `feedback-*` | Success / Warning / Error scales (50 + 500/600 as in Figma) |
| `nav-*` | White + Grey borders + Primary accents |

Dark mode uses the **same palette scales** with inverted surface/text mapping (see `darkSemanticColors` in `packages/tokens/src/colors.ts`).

### Secondary palette

Extended hues (Yellow, Orange, Lime, … Slate, Zinc, Stone) and **alpha ramps** (`#F3F4F6` / `#101828` @ 0–90%) are in `packages/tokens/src/paletteSecondary.ts`.

### Legacy flat keys (registry)

For older primitives: `bg`, `surface`, `accent`, `danger`, … alias semantic tokens. Prefer semantic names in new code.

### Rules

- Use one accent family per screen. Do not mix competing primaries casually on the same surface.
- Status colors are for data, alerts, and validation — not full-surface fills unless using `feedback-*-bg`.
- Neutral grey should carry most UI chrome.

## Spacing (layout scale)

**Source:** Figma `space-*`; TS maps suffix → px (`spacing[n]`). Based on **4px / 0.25rem** steps (@ **16px** root).

| Token name | TS key | Px | Rem (16 base) |
| --- | --- | --- | --- |
| space-0 | `spacing[0]` | 0 | 0 |
| space-1 | `spacing[1]` | 4 | 0.25 |
| space-2 | `spacing[2]` | 8 | 0.5 |
| space-3 | `spacing[3]` | 12 | 0.75 |
| space-4 | `spacing[4]` | 16 | 1 |
| space-5 | `spacing[5]` | 20 | 1.25 |
| space-6 | `spacing[6]` | 24 | 1.5 |
| space-8 | `spacing[8]` | 32 | 2 |
| space-10 | `spacing[10]` | 40 | 2.5 |
| space-12 | `spacing[12]` | 48 | 3 |
| space-14 | `spacing[14]` | 56 | 3.5 |
| space-16 | `spacing[16]` | 64 | 4 |
| space-20 | `spacing[20]` | 80 | 5 |
| space-24 | `spacing[24]` | 96 | 6 |

Heuristics:

- **4–8:** micro alignment, dense rows, chip internals.
- **12–16:** default gutters and grouped controls.
- **20–24:** roomy rows and section rhythm.
- **32–48:** major blocks.
- **56–96:** hero / large breaks only.

Prefer horizontal gutters **`spacing[4]`–`spacing[5]`** unless the layout explicitly calls for more air.

## Radius

**Source:** Figma `radius-*`; TS `radii.<name>` (px).

| Token name | TS | Px | Rem (16 base) |
| --- | --- | --- | --- |
| radius-none | `radii.none` | 0 | 0 |
| radius-sm | `radii.sm` | 4 | 0.25 |
| radius-md | `radii.md` | 8 | 0.5 |
| radius-lg | `radii.lg` | 12 | 0.75 |
| radius-xl | `radii.xl` | 16 | 1 |
| radius-2xl | `radii['2xl']` | 24 | 1.5 |
| radius-full | `radii.full` | 9999 | — (pill) |

Rules:

- Default **cards and fields** toward **`radii.xl`** or **`radii.lg`** (see registry `Card`).
- **Sheets / large panels:** `radii['2xl']`.
- **Pills, primary buttons, circular avatars:** `radii.full`.
- Use the smallest radius that still feels soft; avoid rounding every surface identically.

## Component sizing (fixed presets)

**Source:** Figma Component Specific frame; TS `sizing` on the theme (`packages/tokens/src/sizing.ts`).

### Icons (square)

| Token | TS | Px |
| --- | --- | --- |
| icon-xs | `sizing.icon.xs` | 16 |
| icon-sm | `sizing.icon.sm` | 20 |
| icon-md | `sizing.icon.md` | 24 |
| icon-lg | `sizing.icon.lg` | 32 |

### Avatars (square)

| Token | TS | Px |
| --- | --- | --- |
| avatar-xs | `sizing.avatar.xs` | 16 |
| avatar-sm | `sizing.avatar.sm` | 24 |
| avatar-md | `sizing.avatar.md` | 32 |
| avatar-lg | `sizing.avatar.lg` | 40 |

### Button heights (min height; width from padding + label)

| Token | TS | Px |
| --- | --- | --- |
| button-sm | `sizing.buttonHeight.sm` | 36 |
| button-md | `sizing.buttonHeight.md` | 40 |
| button-lg | `sizing.buttonHeight.lg` | 48 |
| button-xl | `sizing.buttonHeight.xl` | 52 |

Registry `Button` maps **`sm` | `md` | `lg` | `xl`** to these heights and uses **`radii.full`** for the pill outline.

## Borders, shadows, and focus

- Default to `1px` borders with subtle contrast changes between layers.
- Depth comes from layering and spacing first, not shadows.
- Blur / liquid-glass treatments (`backdrop-filter`) are experimental — reserve for sheets, frosted chrome, or rare expressive surfaces.

### Drop shadows (Figma Shadows frame)

All use **`#101828`** (grey-900). Canonical **`css`** strings match CSS `box-shadow` (see `shadowsMeta` in `@arloui/tokens`, synced into `references/tokens.json`).

| Token | Offset Y | Blur | Opacity | Typical use |
| --- | --- | --- | --- | --- |
| `shadow-none` | 0 | 0 | 0 | flat surfaces |
| `shadow-sm` | 0 | 2px | 6% | tight lift, chips |
| `shadow-md` | 1px | 6px | 8% | cards, controls |
| `shadow-lg` | 2px | 12px | 10% | elevated surfaces |
| `shadow-xl` | 4px | 28px | 12% | modals, menus |

**React Native:** `theme.shadows.*` bundles `shadowColor`, `shadowOpacity`, `shadowOffset`, `shadowRadius`, and `elevation`. Opacity matches Figma on iOS; Android uses `elevation` as an approximation (Material shadow tint differs from `#101828`).

Never stack multiple shadow tokens on one element.

### Focus rings (Figma Focus rings frame)

Two **spread-only** layers (blur `0`): **`surface-background`** `2px`, then **`focus-ring-main`** or **`focus-ring-error`** `4px`.

**CSS:** `theme.focusRing.main` and `theme.focusRing.error` are ready-made **`box-shadow`** strings for web (`:focus-visible`). Values resolve per light/dark from semantic colors.

**React Native:** prefer `borderWidth` / outline equivalents — RN does not compose CSS-like stacked spreads on a single `View`.


## Motion

Default timing:

- Press feedback: `120-160ms`
- Small state changes: `180-220ms`
- Sheets, drawers, or content swaps: `220-320ms`

Rules:

- Use a strong ease-out or a restrained spring.
- Never animate from `scale(0)`.
- Avoid `transition: all` patterns.
- Press states should feel immediate: `scale(0.97)` or slight opacity reduction (`opacity: 0.85`).
- Entrance motion should usually start from `opacity: 0` plus `translateY(6-10)` or `scale(0.985)`.
- Gesture-driven elements can use spring behavior, but standard UI controls should stay crisp.

## Iconography

- Prefer simple line or duotone icons.
- Keep stroke weight visually consistent with the typography weight on the screen.
- If an icon feels decorative rather than informative, remove it.
