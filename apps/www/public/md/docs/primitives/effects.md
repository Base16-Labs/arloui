# Effects

> Shadow, elevation, blur, and translucent-surface presets for functional depth without visual noise.

**Type:** Primitive

## Overview

- Elevation communicates which surfaces are interactive, floating, or modal.
- Blur preserves context behind navigation, sheets, and overlays while separating the active layer.
- Liquid Glass is progressive enhancement: supported iOS experiences can use a native treatment while every other platform receives blur, tint, and a subtle border.
- Material presets are starting points for polish, not a requirement to add depth to every surface.

## Rules

- Use glass only for functional layers such as navigation bars, tab bars, sidebars, sheets, and key controls.
- Do not use translucent materials as general content backgrounds or repeated card decoration.
- Pair glass surfaces with high-contrast, vibrant semantic label and icon colors.
- Test over light, dark, photographic, and scrolling content before shipping.
- Test on real devices and older hardware; reduce blur strength or use the overlay-only fallback if scrolling or gestures become janky.

## Specs

- `shadows.sm` — 0 / 2 / 6% · Floating controls and subtle lift
- `shadows.md` — 1 / 6 / 8% · Menus and compact overlays
- `shadows.lg` — 2 / 12 / 10% · Sheets and elevated navigation
- `shadows.xl` — 4 / 28 / 12% · Modal surfaces only
- `blur.sm` — 8 · Thin navigation material
- `blur.md` — 16 · Compact overlays
- `blur.lg` — 24 · Default glass surface
- `blur.xl` — 40 · Dense modal material
- `materials.glassMedium` — 24 + overlay · Cross-platform glass fallback
- `materials.glassMedium.tintOpacity` — 0.45 · How much of a component's own colour survives the material
- `materials.glassMedium.tintOpacityPressed` — 0.6 · Tint deepens on press — the press response for a tinted glass surface

## Code

```ts
import { Platform, StyleSheet, View, useColorScheme } from 'react-native';
import { BlurView } from 'expo-blur';

const scheme = useColorScheme() ?? 'light';
const material = theme.materials.glassMedium;
const overlay =
  scheme === 'dark' ? material.darkOverlay : material.lightOverlay;
const border =
  scheme === 'dark' ? material.darkBorder : material.lightBorder;

const styles = StyleSheet.create({
  material: {
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: theme.radii.xl,
  },
});

<View style={[styles.material, { borderColor: border }]}>
  <BlurView
    intensity={material.blur}
    tint={scheme}
    style={StyleSheet.absoluteFill}
  />
  <View
    pointerEvents="none"
    style={[
      StyleSheet.absoluteFill,
      { backgroundColor: Platform.OS === 'ios' ? 'transparent' : overlay },
    ]}
  />
  <NavigationContent />
</View>
```

## Related

Color · Spacing · Motion

---
Source: https://arloui.com
