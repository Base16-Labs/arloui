# Arlo UI Components

Use these patterns as the system baseline. They should be easy to express in Figma, React Native, and SwiftUI without depending on a large external component library.

## Core Primitives

### App Header

- Left side: screen title, context label, or profile.
- Right side: 1-2 utility actions maximum.
- Allow a hero title only when the first content block is visually lighter.

### Button Family

Registry **`Button`** uses **`tone`** (`primary` | `neutral` | `danger`) × **`appearance`** (`solid` | `soft` | `ghost` | `outline`), sizes **`sm`–`xl`**, optional **`leadingIcon`** / **`trailingIcon`**, **`iconOnly`** (circle), and **`loading`**. Legacy **`variant`** (`primary` | `secondary` | `ghost` | `danger`) still maps to tone + appearance.

**`SocialAuthButton`** — pill OAuth rows for **`facebook`** | **`x`** with **`appearance`**: `brandSolid`, `brandSoft`, `brandOutline`, `neutralSolid`, `neutralOutline`. Default leading marks are minimal Text glyphs; use **`renderLeading`** for official SVGs.

**`FabButton`** — circular FAB (`tone`: `primary` | `neutral`), diameter follows **`sizing.buttonHeight`**. Rest uses **`shadows.sm`**; pressed darkens the semantic fill; disabled opacity ~28%; on web, focus uses **`outline`** + offset and **`focusRingMain`**. **`accessibilityLabel`** is required.

Solid fills use rounded corners + pressed elevation; ghost & outline use pill radius (`radii.full`). See `references/tokens.md` for heights (`sizing.buttonHeight`).

### Card

Registry **`Card`** is the surface primitive — a bordered, rounded container with slots **`Card.Media`**, **`Card.Header`**, **`Card.Title`**, **`Card.Subtitle`**, **`Card.Body`**, **`Card.Footer`**. Five variant axes, each off a token scale:

- **`surface`** — `default` (**`surfaceCard`**, a step greyer than the background), `elevated` (**`surfaceElevated`**), `bleed` (**`surfaceBleed`**, the app background at 50% so a coloured backdrop or image shows through — a subtle frost, not a tab-bar blur), or `inverse` (**`surfaceInverse`**; the title/subtitle ink flips to match automatically).
- **`elevation`** — shadow `none`–`lg`, default `none` (depth from layering before shadows).
- **`border`** — literal px width, default `1` (there are no border-width tokens).
- **`padding`** — off the spacing scale (`none` for edge-to-edge media); **`radius`** — off the radius scale.

Pass **`onPress`** to make the whole card a tap target: it reports `accessibilityRole="button"`, animates `scale 0.97` + opacity, and fires a **`haptic`** on press-down (`light` by default; set `none` in dense grids of tappable cards).

**Recipes are compositions, not props.** A metric tile, image card, prompt card, a settings group (a `List`), or a `Carousel` is `Card` + its slots + the shipped primitives (`List.Row`, `Button`, `Badge`). Do not add a `MediaCard`/`ActionCard`; compose them.

### List and Row

Registry **`List`** is a compound stacked-row layout — **`List`** is the container, **`List.Row`** is the item, so there is never a "which do I reach for" question. The List draws **no surface of its own**: wrap it in a `Card` for the grouped look, or leave it on the page for edge-to-edge. It decides only how rows relate:

- **`separated`** — `false` (default) keeps rows contiguous with a hairline; `true` spaces each onto its own surface.
- **`divider`** (contiguous only) — `inset` (Apple style: the rule clears the leading asset — the row measures its own leading), `balanced` (content padding both sides), `edge` (full bleed), `none`.
- **`density`** — `comfortable` (default) or `compact`; sets row vertical padding, i.e. how far apart items sit.

**`List.Row`** takes **`leading`** (an icon or media thumbnail), **`title`** over an optional **`subtitle`** node (a badge fits), and a trailing **`value`** (with **`valueCaption`** and directional **`valueTone`**) alongside an optional **`trailing`** icon — value and icon can coexist. 44pt min height, native background-highlight press.

### Text Field and Search

- Use quiet borders, strong cursor color, and generous vertical padding.
- Leading icons are fine when they clarify purpose; trailing clutter is not.
- Composer-style fields can stretch taller than standard inputs, but still need a clear resting state.

### Chips and Pills

- Best for filters, model selectors, tags, and small states.
- Mono labels work well for status-like information.
- A chip should read clearly with or without its icon.

### Segmented Control

- Keep labels short and obvious.
- Use strong container contrast and subtle selection motion.
- Best for toggling between comparable views, not unrelated destinations.

### Sheet and Bottom Action Bar

- Use sheets for secondary tasks, settings, or confirmation detail.
- Use bottom action bars for high-commitment actions that should stay thumb-reachable.

## Data-Rich Patterns

### Metric Hero

- Large value, compact descriptor, small delta or context label.
- Use for account summaries, fitness progress, delivery status, portfolio value, or any high-signal top-line number.
- Keep supporting text tight so the number owns the screen.

### Metric or Entity Row

- Left: entity label and supporting context.
- Right: latest value, state, or delta.
- Optional center or trailing sparkline only if it stays secondary to the number.

### Activity Row

- Event or item name first, then time or category, then the most important trailing value.
- Use color on the trailing value sparingly; typography should still do most of the work.

### Summary Card

- Good for grouped stats, account identity, profile summaries, or primary entry points.
- Avoid over-decorating; the card should feel like an instrument, not a poster.

### Goal or Progress Module

- Use segmented progress, stepped rings, or stacked bars only when the label and value remain obvious.
- Never let the visual hide the numeric truth.

## Assistant and Workflow Patterns

### Assistant Composer

- Expanding text area, attach action, optional voice action, send action.
- Must feel calm at rest and capable when active.
- Use one accent moment only: cursor, send button, or selected mode.

### Message Cluster

- Group adjacent messages to reduce visual noise.
- Differentiate user and assistant with spacing, fill, or alignment before adding extra chrome.

### Prompt Suggestion Card

- One clear prompt seed, one short explanation, one obvious tap target.
- Good for empty states and onboarding.

### Tool Run Row

- Show the tool name, status, and result summary.
- Keep the row readable even when there are several consecutive tool runs.

### Result Card

- Use for generated summaries, extracted data, or workflow outputs.
- Prefer structured sections over large unbroken paragraphs.

## Navigation

### Tab Bar

Registry **`TabBar`** — a bottom navigation bar. **`width`**: **`full`** (edge-to-edge) or **`floating`** (inset pill, `92%` wide, centred, `radii.full`). **`surface`**: **`filled`** (opaque `navBackground`) or **`glass`** (Liquid Glass — the real system material on iOS 26 via `expo-glass-effect`, and a translucent overlay over a host **`blurComponent`** (e.g. `expo-blur`'s `BlurView`) everywhere else). There is no separate `transparent` option: the blur fallback *is* the non-iOS glass path. Compose with **`TabBar.Item`** (`value`, `label`, `icon`, optional `badge`, `disabled`); active/inactive icons use **`navActive`** / **`navInactive`**.

- **`scrollBehavior`** — **`hide`** (slides off, stops taking touches), **`shrink`** (shrinks in place, stays reachable), or **`fixed`** (ignores scroll). Chosen independently of `width`; defaults to `shrink` for floating and `hide` for full. Drive it with the **`useTabBarScroll()`** hook, which returns `{ hidden, onScroll }` — spread `onScroll` on the scroll view, pass `hidden` to the bar. A full-width bar set to `shrink` **morphs into a floating pill** as it recedes.
- **`selection`** — **`snap`** (default) tracks the active tab instantly (Rule 07 — a habitual toggle shouldn't read as latency); **`jelly`** stretches the pill toward its target and settles with a soft wobble, an opt-in expressive move. Only the **floating** variant carries a pill (`interactiveSecondary`); full-width reads the active tab from icon colour, so `selection` is a no-op there.
- Floating bars cast **`shadows.md`**; full-width bars cast a subtle upward shadow to lift off the content above. A floating bar also lays a **translucent gradient scrim** behind and below itself so content dissolves into the background near the nav rather than meeting a line; the scrim fades out on `hide` and drops on `shrink`.
- **`showLabels`** shows a label under each icon (bar grows `56→64`); **`badge`** renders a count on the error fill; **`bottomInset`** pads for the home indicator.

Guidelines:

- 3–5 destinations maximum. More than five requires a different navigation model.
- Icons are primary; labels (`showLabels`) are secondary but aid clarity.
- Keep the bar anchored to the safe-area bottom — never overlap content (pass `bottomInset`).
- Avoid badge-heavy tabs; one notification count is fine, multiple is noise.

## State Patterns

### Skeleton / Loading State

- Match the shape and scale of the real content as closely as possible.
- Use `--surface-raised` as the base fill and `--surface-strong` as the shimmer layer.
- Animate with a slow horizontal shimmer sweep (a ~`1.2s` linear loop — ambient, never a fast flash) or a gentle opacity pulse (~`600ms` ease-in-out each way).
- Do not skeleton-load interactive controls — disable or hide them instead.
- Show skeleton for the first data load; use inline spinners or optimistic updates for subsequent refreshes.

### Empty State

- One concise headline, one short supporting sentence, one optional CTA.
- Illustration or icon is acceptable but must not overpower the copy.
- Place the CTA where the first item in the list would appear — make the empty zone feel intentional.
- For filtered views, surface a clear "clear filters" action alongside the empty state.

### Error State

- Distinguish network errors, permission errors, and empty-result errors visually and in copy.
- Use `--danger` for critical errors; neutral surfaces for soft or recoverable states.
- Always offer a recovery action (retry, go back, contact support). Never dead-end the user.
- Inline field errors live below the field and use `--danger` text at `body-sm` scale.

### Toast

Registry **`Toast`** — positioned at **`top`** or **`bottom`** edge, offset by safe-area insets passed via **`topInset`** / **`bottomInset`**. Color styles: **`contrast`** (inverted fill) or **`same`** (elevated surface). Optional **`icon`** slot, optional **`showDismiss`** close button. Swipe-to-dismiss built in (swipe up for top, down for bottom). Spring entrance (`motion.spring.snappy`), easeOut exit. Border radius is **`radii.xl`** (opinionated, not configurable). Shadow: `shadows.md` in dark, `shadows.lg` in light. Imperative **`ToastRef`** exposes `dismiss()`.

Registry **`Toaster`** — the stacking host. Mount one near the app root inside `ThemeProvider`, then call **`useToast().toast(message, options)`** from anywhere. Newest toast sits in front; older ones peek out behind it, offset `14px` and scaled down `0.05` per depth. **`visibleToasts`** (default `3`) caps how many show at once; the rest wait, and hold their auto-dismiss timer until they surface. **`dismiss(id)`** and **`dismissAll()`** play the exit animation. Reusing an **`id`** replaces a live toast in place instead of stacking a duplicate.

- Use `Toaster` when more than one message can arrive at once; the controlled `Toast` is for a single, app-owned notification.
- Auto-dismiss after `3.5s` by default; set **`duration`** to `0` to persist until dismissed.
- Keep copy under two lines. If more context is needed, use a sheet instead.
- Avoid using toasts for actions the user just took and can clearly see — they create noise.
- `prefers-reduced-motion`: replaces position/scale with opacity-only transitions.

## Shared Utilities

### Status Pill

- Tiny but high-signal. Good for `Live`, `Syncing`, `Profitable`, `Needs Review`, `Draft`.
- Works best with mono labels or compact icon-plus-label combos.

### Inline Metric Capsule

- Compact value with context label for dense dashboards or tool outputs.
- Use when a full card would waste space.

### Chart Strip

- Reserve for trend confirmation, not detailed analysis.
- Pair every chart with a visible value and timeframe selector.

## Screen Structures

### Summary Home

- App header with profile, context switch, or utility actions.
- Hero metric or top-level summary.
- Quick actions row.
- Key entities, collections, or categories.
- Recent activity, recommendations, or insights.

Use when the product needs a strong first-glance overview.

### Detail and Activity

- Detail header with title, context, and view controls.
- Hero value, state, or status summary.
- Primary visual, media, or chart area.
- Key metrics grid or capsules.
- Related updates, logs, items, or activity list.
- Persistent bottom action bar when the main task needs it.

Use when the product needs depth without losing action clarity.

### Conversation Workspace

- Lightweight top bar with workspace, mode, or filter switch.
- Scrollable message or result area.
- Suggestion cards or recent prompts in the empty state.
- Bottom composer anchored to the safe area.

Use when the product is chat, support, assistant, or guided workflow heavy.

### Result and Tooling Screen

- Task summary or hero question.
- Result card with structured sections.
- Tool run list or status timeline.
- Follow-up actions row.

Use when the app is more about execution and outputs than back-and-forth conversation.

### Guided Insight Screen

- Summary hero or key context block.
- Insight card pinned near the top.
- Supporting metrics, examples, or recent actions.
- Follow-up prompts, actions, or composer.

Use when the product mixes user data, recommendations, and next steps.

### Onboarding or Paywall

- Simple top affordance to close or continue.
- One strong headline.
- Compact visual proof point or component demo.
- Benefit list with restrained icons.
- Primary CTA and secondary reassurance.

Keep these screens cleaner than the product itself. They sell trust, not feature density.
