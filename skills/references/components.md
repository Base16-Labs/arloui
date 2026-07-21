# Arlo UI Components

The registry primitives below are the source of truth — this is the **current** set with their key props. Everything is token-driven (see `references/tokens.md`) and expressible in Figma, React Native, and SwiftUI without a heavy external library. Below the primitives are composition and screen patterns you build _from_ those primitives.

## Registry primitives

### Controls

**`Button`** — **`tone`** (`primary` | `neutral` | `danger`) × **`appearance`** (`solid` | `soft` | `ghost` | `outline`), sizes **`sm`–`xl`**, optional **`leadingIcon`** / **`trailingIcon`**, **`iconOnly`** (circle), and **`loading`**. Legacy **`variant`** (`primary` | `secondary` | `ghost` | `danger`) still maps to tone + appearance. Solid fills use rounded corners + pressed elevation; ghost & outline use pill radius (`radii.full`). Heights follow `sizing.buttonHeight`.

- **`GhostButton`** — low-emphasis text/icon button.
- **`FabButton`** — circular FAB (`tone`: `primary` | `neutral`); diameter follows `sizing.buttonHeight`, rest uses `shadows.sm`, pressed darkens the semantic fill. **`accessibilityLabel`** required.
- **`SocialAuthButton`** — pill OAuth rows for **`facebook`** | **`x`** with **`appearance`** `brandSolid` | `brandSoft` | `brandOutline` | `neutralSolid` | `neutralOutline`. Default leading marks are minimal Text glyphs; use **`renderLeading`** for official SVGs.

**`Chip`** — interactive compact element for filters, input tokens, and actions. **`type`** (`filter` | `input` | `assist`), **`style`** (`fill` | `outline`), **`accent`** (`primary` | `neutral`), **`size`** (`sm` | `md`), **`radius`** (`full` | `lg`), **`selectionIndicator`** (`check` | `none`). Press feedback plus an optional remove affordance. Reads clearly with or without its icon.

**`Toggle`** — animated on/off switch. **`size`** (`sm` | `md`), disabled state, smooth thumb transition.

**`Checkbox`** — animated check box. Two **`size`s** (`sm` | `md`), check icon, disabled state.

**`Radio`** — animated radio button with a scaling dot indicator. Two sizes, disabled state.

### Text input

**`Field`** — composable text-field primitive shared by Input and TextArea: `Field.Label`, `Field.Control`, `Field.Icon`, `Field.Action`, `Field.Input`, `Field.Toolbar`, `Field.Helper`. Quiet borders, strong cursor color, generous vertical padding.

**`Input`** — filled text input with labels, helper text, validation, leading/trailing icons, actions, and password / search patterns. Leading icons are fine when they clarify purpose; avoid trailing clutter.

**`TextArea`** — multiline field for comments, notes, bios, support messages, and long-form content. Composer-style fields may stretch taller than standard inputs but keep a clear resting state.

**`DatePicker`** — accessible calendar and wheel surfaces; **`mode`** (`date` | `time` | `date-time` | `month-year`).

### Layout & surface

**`Card`** — surface for grouping related content with header, body, footer, and hierarchy; **`tone`** (`default` | `raised` | `floating`). Good for grouped stats, account identity, or primary entry points — an instrument, not a poster.

**`Sheet`** — bottom drawer with a grabber and drag-to-dismiss. **`surface`** (`solid` | `glass` / Liquid-Glass), **`width`** (`default` | `stack`), **`height`** (`auto` | `half` | `full`), **`padding`** (`none` | `md` | `lg`), **`backdrop`** (`scrim` | `passthrough`), **`presentation`** (`edge` | `inset` | `stack`). Use for secondary tasks, settings, or confirmation detail.

**`Carousel`** — gesture-driven horizontal carousel. **`snap`** (`item` | `page`), peek, **`indicator`** (`dots` | `none`) with position (`below` | `overlay`), auto-play, and loop support.

**`Gallery`** — flexible grid layout, 1–4 columns, optional masonry mode, token-based gap, **`radius`** (`none` | `sm` | `md` | `lg` | `xl` | `2xl` | `full`).

### Feedback

**`Badge`** — non-interactive status label with dot, count, and icon variants. **`tone`** (`neutral` | `info` | `success` | `warning` | `error`), **`appearance`** (`soft` | `solid` | `outline`), **`size`** (`sm` | `md`).

**`Skeleton`** — reduced-motion-aware loading placeholder with text, rectangle, and circle geometry plus shimmer, pulse, or static presentation. Match the shape and scale of real content. Do not skeleton interactive controls — disable or hide them. Show for the first data load; use spinners or optimistic updates for subsequent refreshes.

### Navigation

**`TabBar`** — animated bottom navigation. **`width`** (`full` | `floating`), **`surface`** (`transparent` | `filled`), badges, labels, and scroll-aware visibility. 3–5 destinations maximum; icons primary, labels always present; keep it anchored to the safe-area bottom and never overlap content.

**`Tabs`** — secondary navigation for categorising content or switching views. **`appearance`** (`plain` | `underline` | `filled`), **`tone`** (`neutral` | `accent`), **`layout`** (`content` | `equal`). Keep labels short; use for comparable views, not unrelated destinations.

## Composition patterns

Build these _from_ the primitives above — they are not separate registry components.

### App header

- Left side: screen title, context label, or profile. Right side: 1–2 utility actions maximum.
- Allow a hero title only when the first content block is visually lighter.

### Data-rich

- **Metric hero** — large value, compact descriptor, small delta or context label. Keep supporting text tight so the number owns the screen.
- **Metric / entity row** — left: entity label + context; right: latest value, state, or delta. Optional trailing sparkline stays secondary to the number.
- **Activity row** — event/item name first, then time or category, then the most important trailing value. Use color on the trailing value sparingly.
- **Goal / progress module** — segmented progress, stepped rings, or stacked bars only when the label and value stay obvious. Never let the visual hide the numeric truth.

### Assistant & workflow

- **Assistant composer** — an expanding `TextArea` with attach, optional voice, and send actions. Calm at rest, capable when active; one accent moment only (cursor, send, or selected mode).
- **Message cluster** — group adjacent messages; differentiate user vs assistant with spacing, fill, or alignment before adding chrome.
- **Prompt suggestion card** — one prompt seed, one short explanation, one obvious tap target. Good for empty states and onboarding.
- **Tool run row** — tool name, status, result summary; stays readable across several consecutive runs.
- **Result card** — for generated summaries, extracted data, or workflow outputs. Prefer structured sections over unbroken paragraphs.

### States (beyond `Skeleton`)

- **Empty state** — one headline, one supporting sentence, one optional CTA placed where the first list item would appear. For filtered views, surface a clear "clear filters" action.
- **Error state** — distinguish network / permission / empty-result errors in copy and color; `--danger` for critical, neutral surfaces for recoverable. Always offer a recovery action; never dead-end. Inline field errors sit below the field in `--danger` at `body-sm`.
- **Toast / snackbar** — from the bottom edge, above the tab bar / safe area. One active toast at a time; auto-dismiss confirmations after 3–4s, persist errors. Keep copy under two lines; don't toast actions the user can already see.

## Screen structures

### Summary home

App header (profile / context / utilities) → hero metric or summary → quick-actions row → key entities or categories → recent activity, recommendations, or insights. Use when the product needs a strong first-glance overview.

### Detail & activity

Detail header (title, context, view controls) → hero value/state → primary visual/media/chart → key metrics grid → related updates or activity list → persistent bottom action bar when the main task needs it. Use for depth without losing action clarity.

### Conversation workspace

Lightweight top bar (workspace / mode / filter) → scrollable message or result area → suggestion cards or recent prompts in the empty state → bottom composer anchored to the safe area. Use for chat, support, assistant, or guided workflows.

### Result & tooling screen

Task summary or hero question → result card with structured sections → tool-run list or status timeline → follow-up actions row. Use when the app is about execution and outputs more than conversation.

### Onboarding or paywall

Simple close/continue affordance → one strong headline → compact visual proof or component demo → benefit list with restrained icons → primary CTA and secondary reassurance. Keep these screens cleaner than the product itself — they sell trust, not feature density.
