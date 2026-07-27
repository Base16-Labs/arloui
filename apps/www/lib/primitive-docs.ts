/**
 * Primitive (foundation) doc data — the single source for both the rendered
 * primitives pages and the central 'Copy markdown' output (lib/docs-markdown).
 */
export type PrimitiveDoc = {
  title: string;
  lede: string;
  intro: string[];
  rules: string[];
  specs: { name: string; value: string; note: string }[];
  snippet: string;
  related: string[];
};

export const primitiveDocs: Record<string, PrimitiveDoc> = {
  tokens: {
    title: 'Tokens',
    lede: 'The registry source template for colors, type, spacing, radii, sizing, motion, shadows, and focus rings.',
    intro: [
      'The consumer-owned copy lives at <alias>/tokens.ts after arloui init.',
      'The registry source is dependency-free so it works in Expo and bare React Native projects.',
      'Components read from themes.light and themes.dark through the foundation theme provider.',
    ],
    rules: [
      'Edit tokens.ts in the consuming app when a product needs brand changes.',
      'Keep semantic color names stable so copied components continue to compile.',
      'Use raw palette values to define semantic roles, not directly inside components.',
    ],
    specs: [
      {
        name: 'radius.sm',
        value: '4',
        note: 'Inputs, small controls, menu rows',
      },
      {
        name: 'radius.md',
        value: '8',
        note: 'Buttons, repeated cards, compact surfaces',
      },
      {
        name: 'motion.duration.instant',
        value: '130ms',
        note: 'Press feedback and micro-interactions',
      },
      {
        name: 'motion.pressed.scale',
        value: '0.97',
        note: 'Default pressed transform',
      },
      {
        name: 'spacing.4',
        value: '16',
        note: 'Common horizontal gutter',
      },
      {
        name: 'sizing.buttonHeight.md',
        value: '40',
        note: 'Default button height',
      },
      {
        name: 'shadowBaseColor',
        value: '#101828',
        note: 'Grey-900 tint used by shadows',
      },
      {
        name: 'motion.duration.fast',
        value: '200ms',
        note: 'Toggles and small popovers that need to be noticed',
      },
    ],
    snippet: `export const themes = {
  light: {
    colors: lightColors,
    typography,
    spacing,
    radii,
    sizing,
    motion,
    shadows,
    focusRing: focusRing.light,
  },
};`,
    related: ['Color', 'Spacing', 'Motion'],
  },
  type: {
    title: 'Typography',
    lede: 'A Manrope type system for display, headings, body copy, labels, and button text across Arlo UI.',
    intro: [
      'The Figma foundation uses Manrope for every interface role.',
      'Normal styles use 400 weight; emphasized and button styles use 600.',
      'The registry exposes explicit display, heading, body, label, and button tokens from tokens.ts.',
    ],
    rules: [
      'Use display styles for prominent screen-level content.',
      'Use heading styles to establish hierarchy inside screens and components.',
      'Use body, label, and button roles according to their intended interface context.',
    ],
    specs: [
      { name: 'fontFamilies.sans', value: 'Manrope', note: 'All interface typography' },
      { name: 'displayLarge', value: '34 / 125% / -2%', note: 'Normal and emphasized' },
      { name: 'displayMedium', value: '28 / 125% / -2%', note: 'Normal and emphasized' },
      { name: 'displaySmall', value: '24 / 125% / -2%', note: 'Normal and emphasized' },
      { name: 'headingLarge', value: '20 / 130% / -1%', note: 'Normal and emphasized' },
      { name: 'headingMedium', value: '17 / 130% / -1%', note: 'Normal and emphasized' },
      { name: 'headingSmall', value: '14 / 130% / -1%', note: 'Normal and emphasized' },
      { name: 'bodyLarge', value: '17 / 140% / 0%', note: 'Long-form and supporting copy' },
      { name: 'bodyMedium', value: '14 / 140% / 0%', note: 'Default body copy' },
      { name: 'bodySmall', value: '12 / 140% / 0%', note: 'Compact supporting copy' },
      { name: 'labelLarge', value: '14 / 120% / 0%', note: 'Large interface label' },
      { name: 'labelMedium', value: '12 / 120% / 0%', note: 'Default interface label' },
      { name: 'labelSmall', value: '11 / 120% / 0%', note: 'Compact metadata' },
      { name: 'buttonLarge', value: '20 / 110% / 0%', note: 'Large action label' },
      { name: 'buttonMedium', value: '17 / 110% / 0%', note: 'Medium action label' },
      { name: 'buttonSmall', value: '14 / 110% / 0%', note: 'Small action label' },
      { name: 'buttonLabel', value: '12 / 110% / 0%', note: 'Compact button label' },
    ],
    snippet: `const styles = {
  heading: {
    ...theme.typography.headingLargeEmphasized,
    fontFamily: theme.fontFamilies.sans,
    color: theme.colors.textPrimary,
  },
};`,
    related: ['Spacing', 'Tokens', 'Color'],
  },
  color: {
    title: 'Color',
    lede: 'Main palette, secondary palette, and utility semantic colors. Components should use semantic roles, not raw palette values.',
    intro: [
      'Main palette contains Base, Grey, Primary, Success, Warning, and Error scales.',
      'Secondary palette contains extended Tailwind-aligned hue scales and alpha ramps.',
      'Utility semantic colors map those palettes into component-facing light and dark theme roles.',
    ],
    rules: [
      'Use paletteMain and paletteSecondary as source material for theme roles.',
      'Use lightSemanticColors and darkSemanticColors inside components through theme.colors.',
      'Keep raw brand changes in tokens.ts so copied registry components inherit them automatically.',
    ],
    specs: [
      { name: 'paletteSecondary.zinc.950', value: '#09090B', note: 'Dark background' },
      { name: 'paletteMain.primary.600', value: '#155DFC', note: 'Light interactive primary' },
      { name: 'paletteMain.error.500', value: '#FB2C36', note: 'Error fill and border' },
      { name: 'paletteSecondary.zinc.200', value: '#E4E4E7', note: 'Neutral UI utility' },
      { name: 'alphaRamp.black.40', value: 'rgba(16,24,40,0.4)', note: 'Light overlay' },
      { name: 'lightSemanticColors.surfaceInput', value: '#F3F4F6', note: 'Input surface' },
      { name: 'darkSemanticColors.surfaceInput', value: '#18181B', note: 'Dark input surface' },
      { name: 'lightSemanticColors.interactivePrimary', value: '#155DFC', note: 'Primary action' },
    ],
    snippet: `import { useTheme } from "@/foundation/theme-provider";

const { theme } = useTheme();

<View style={{ backgroundColor: theme.colors.surfaceInput }}>
  <Text style={{ color: theme.colors.textPrimary }}>
    Label
  </Text>
</View>`,
    related: ['Tokens', 'Typography', 'Icons'],
  },
  spacing: {
    title: 'Spacing',
    lede: 'A memorable base-4 scale for visual rhythm, component sizing, and accessible touch ergonomics.',
    intro: [
      'ArloUI uses a base-4 spacing scale where spacing[4] equals 16 px.',
      'Keys are the suffix of the Figma token name, so space-4 maps to spacing[4].',
      'Sizing tokens keep components, icons, avatars, and containers consistent without magic numbers.',
      'A control may look smaller than 44 pt while hitSlop expands its interactive area.',
    ],
    rules: [
      'Use spacing[4] to spacing[5] for common horizontal gutters.',
      'Use spacing[1] and spacing[2] for icon, label, and compact control gaps.',
      'Use sizing tokens for fixed component dimensions such as buttons and icons.',
      'Give every interactive element at least a 44 × 44 pt touch target; prefer 48 × 48 pt for comfortable primary actions.',
      'Keep enough separation between adjacent touch targets to prevent accidental activation.',
    ],
    specs: [
      { name: 'spacing.0', value: '0', note: 'No gap' },
      { name: 'spacing.1', value: '4', note: 'Small icon gap' },
      { name: 'spacing.2', value: '8', note: 'Control inner gap' },
      { name: 'spacing.4', value: '16', note: 'Common gutter' },
      { name: 'spacing.6', value: '24', note: 'Section rhythm' },
      { name: 'spacing.24', value: '96', note: 'Large screen spacing' },
      { name: 'sizing.icon.md', value: '24', note: 'Default icon size' },
      { name: 'sizing.buttonHeight.md', value: '40', note: 'Default visual button height' },
      { name: 'sizing.touchTarget.minimum', value: '44', note: 'Minimum interactive area' },
      { name: 'sizing.touchTarget.comfortable', value: '48', note: 'Preferred primary-action area' },
    ],
    snippet: `const touchInset =
  (theme.sizing.touchTarget.minimum - theme.sizing.buttonHeight.md) / 2;

<View style={{
  paddingHorizontal: theme.spacing[4],
  gap: theme.spacing[2],
}}>
  <Text>Label</Text>
  <Pressable hitSlop={touchInset}>
    <View style={{ height: theme.sizing.buttonHeight.md }}>
      <Text>Action</Text>
    </View>
  </Pressable>
</View>`,
    related: ['Typography', 'Tokens', 'Motion'],
  },
  effects: {
    title: 'Effects',
    lede: 'Shadow, elevation, blur, and translucent-surface presets for functional depth without visual noise.',
    intro: [
      'Elevation communicates which surfaces are interactive, floating, or modal.',
      'Blur preserves context behind navigation, sheets, and overlays while separating the active layer.',
      'Liquid Glass is progressive enhancement: supported iOS experiences can use a native treatment while every other platform receives blur, tint, and a subtle border.',
      'Material presets are starting points for polish, not a requirement to add depth to every surface.',
    ],
    rules: [
      'Use glass only for functional layers such as navigation bars, tab bars, sidebars, sheets, and key controls.',
      'Do not use translucent materials as general content backgrounds or repeated card decoration.',
      'Pair glass surfaces with high-contrast, vibrant semantic label and icon colors.',
      'Test over light, dark, photographic, and scrolling content before shipping.',
      'Test on real devices and older hardware; reduce blur strength or use the overlay-only fallback if scrolling or gestures become janky.',
    ],
    specs: [
      { name: 'shadows.sm', value: '0 / 2 / 6%', note: 'Floating controls and subtle lift' },
      { name: 'shadows.md', value: '1 / 6 / 8%', note: 'Menus and compact overlays' },
      { name: 'shadows.lg', value: '2 / 12 / 10%', note: 'Sheets and elevated navigation' },
      { name: 'shadows.xl', value: '4 / 28 / 12%', note: 'Modal surfaces only' },
      { name: 'blur.sm', value: '8', note: 'Thin navigation material' },
      { name: 'blur.md', value: '16', note: 'Compact overlays' },
      { name: 'blur.lg', value: '24', note: 'Default glass surface' },
      { name: 'blur.xl', value: '40', note: 'Dense modal material' },
      { name: 'materials.glassRegular', value: '24 + overlay', note: 'Cross-platform glass fallback' },
    ],
    snippet: `import { Platform, StyleSheet, View, useColorScheme } from 'react-native';
import { BlurView } from 'expo-blur';

const scheme = useColorScheme() ?? 'light';
const material = theme.materials.glassRegular;
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
</View>`,
    related: ['Color', 'Spacing', 'Motion'],
  },
  motion: {
    title: 'Motion',
    lede: 'Registry motion tokens for press feedback, state transitions, sheet movement, easing, and restrained springs.',
    intro: [
      'Default easing is easeOut; easeInOut morphs in place and easeSheet drives drawers.',
      'Springs (snappy, gentle, heavy) are reserved for gesture-driven or playful elements.',
      'Pressed feedback combines scale and opacity so touch response feels immediate.',
    ],
    rules: [
      'Use duration.instant for tap acknowledgement.',
      'Use duration.fast / duration.base for toggles, popovers, and sheets.',
      'Avoid transition-all patterns and never animate from scale(0).',
    ],
    specs: [
      { name: 'duration.instant', value: '130', note: 'Press feedback (100–160)' },
      { name: 'duration.fast', value: '200', note: 'Toggles, popovers (180–220)' },
      { name: 'duration.base', value: '280', note: 'Sheets, modals (220–320)' },
      { name: 'duration.slow', value: '400', note: 'Shared-element morphs (320–480)' },
      { name: 'easing.easeOut', value: '0.23, 1, 0.32, 1', note: 'Default cubic bezier' },
      { name: 'easing.easeSheet', value: '0.32, 0.72, 0, 1', note: 'Sheets and drawers' },
      { name: 'spring.snappy', value: '400 / 30 / 1', note: 'Stiffness, damping, mass' },
      { name: 'pressed.scale', value: '0.97', note: 'Pressed transform' },
    ],
    snippet: `<Pressable style={({ pressed }) => ({
  opacity: pressed ? theme.motion.pressed.opacity : 1,
  transform: [
    { scale: pressed ? theme.motion.pressed.scale : 1 },
  ],
})}>
  <Text>Button</Text>
</Pressable>`,
    related: ['Spacing', 'Tokens', 'Color'],
  },
  icons: {
    title: 'Icons',
    lede: 'A filled icon language for navigation, actions, empty states, and controls, exposed as React Native SVG components.',
    intro: [
      'Icons should help recognition, not decorate the layout.',
      'Use a consistent 24 px view box and size down visually inside compact controls.',
      'Icon-only controls need a clear accessible label in app code.',
    ],
    rules: [
      'Use icons in buttons when they make the action faster to recognize.',
      'Keep navigation icons visually equal even when the paths have different density.',
      'Prefer familiar symbols for search, copy, close, theme, and scan actions.',
    ],
    specs: [
      { name: 'viewBox', value: '24', note: 'Shared icon grid' },
      { name: 'control', value: '16-20', note: 'Inside buttons and inputs' },
      { name: 'nav', value: '18-24', note: 'Navigation and tab rows' },
      { name: 'color', value: 'currentColor', note: 'Inherit from text role' },
    ],
    snippet: `import { Icon } from "@/components/ui/Icon";

<Icon name="magnifying-glass" size={18} />`,
    related: ['Color', 'Tokens', 'Motion'],
  },
};
