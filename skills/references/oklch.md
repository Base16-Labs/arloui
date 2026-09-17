# Arlo UI OKLCH Color System

Arlo uses OKLCH as an authoring and generation format. React Native does not consume `oklch(...)` colors directly, so shipped tokens still resolve to `#RRGGBB`, `rgba(...)`, or `transparent`.

## Why This Exists

Color bugs in Arlo have clustered around the same pattern: a hand-picked token changes in one place, while docs, registry output, Figma, dark mode, or component defaults keep an older assumption. OKLCH gives Arlo a predictable source model where lightness, chroma, and hue are explicit and auditable before runtime colors ship.

## System Shape

The source of truth is `@arloui/tokens/oklch-theme`:

- `arloOklchRampSpecs` defines named ramp recipes.
- `arloOklchThemeRecipe` maps semantic color roles to those ramps.
- `generateArloOklchTheme()` turns recipes into runtime strings plus audit metadata.
- `arloOklchTheme` is the default generated Arlo recipe.

This system is additive while the ramp is being proven. Existing shipped colors stay intact until a generated theme is intentionally adopted.

## Authoring Rules

1. Change ramps by editing OKLCH recipe numbers, not emitted hex values.
2. Keep semantic token names stable unless there is a migration plan for registry, docs, skill references, and Figma.
3. Emit only React Native-safe runtime strings into component code: `#RRGGBB`, `rgba(...)`, or `transparent`.
4. Treat gamut fitting as a signal, not an implementation detail. Small chroma reduction is expected at the edge of sRGB; heavy reduction means the ramp recipe is too ambitious.
5. Audit light and dark mode together. Never derive dark mode by mechanically inverting light mode.
6. Do not let two semantic surfaces collapse to the same runtime color unless they are intentional aliases.

## Audit Contract

Generated themes report three categories:

- **Contrast:** core foreground/background pairs meet their intended ratios.
- **Surface separation:** adjacent semantic surfaces stay visually distinct.
- **Gamut:** source OKLCH colors either fit sRGB or lose only a small amount of chroma during runtime conversion.

Any theming tool, Figma sync, or registry export should surface these checks before recommending a palette.

## Theming Tool Direction

The Arlo theming tool should use `arloOklchTheme` as its seed and expose controls for:

- neutral hue/chroma and the surface ladder
- accent hue and chroma curve
- status hues for success, warning, error, and chart roles
- dark-mode surface steps
- contrast, surface, and gamut audit results
- export targets for registry `tokens.ts`, JSON for agents/Figma sync, and CSS previews

Preview semantic roles, not just raw palettes. A user should see buttons, text levels, feedback surfaces, borders, charts, and navigation chrome updating together.
