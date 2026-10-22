/**
 * Font setup emitted by `arlo init`.
 *
 * The tokens name a single family (`fontFamilies.sans === 'Manrope'`) and carry
 * weight separately in `fontWeights`, so components style with
 * `fontFamily: t.fontFamilies.sans` + `fontWeight: t.fontWeights.semibold`.
 * That only resolves if every weight is registered under the *same* family name.
 * The config plugin below does that: Android font-family XML maps weight to
 * file, and iOS matches on PostScript name. `useFonts` cannot group weights,
 * so the runtime loader also registers each file under the name it ships with.
 * Expo Go never runs the plugin — use `arloFont(weight)` there. A dev build
 * can keep `fontFamily: 'Manrope'` plus `fontWeight`.
 *
 * `fontFamilies.mono` is `Space Mono`. Typography tokens set size, line height,
 * and weight only — add `fontFamily` when you style a `Text` with `t.typography.*`.
 */

/** Packages a consumer needs for Manrope and Space Mono. */
export const FONT_PACKAGES = [
  'expo-font',
  '@expo-google-fonts/manrope',
  '@expo-google-fonts/space-mono',
] as const;

/** The `app.json` / `app.config.js` plugin entry that registers all four weights. */
export const FONT_PLUGIN_SNIPPET = `[
  "expo-font",
  {
    "fonts": [
      "node_modules/@expo-google-fonts/manrope/400Regular/Manrope_400Regular.ttf",
      "node_modules/@expo-google-fonts/manrope/500Medium/Manrope_500Medium.ttf",
      "node_modules/@expo-google-fonts/manrope/600SemiBold/Manrope_600SemiBold.ttf",
      "node_modules/@expo-google-fonts/manrope/700Bold/Manrope_700Bold.ttf"
    ],
    "android": { "fontFamily": "Manrope" },
    "ios": { "name": "Manrope" }
  }
]`;

/**
 * A runtime loader for projects that would rather not use the config plugin
 * (Expo Go, or a bare workflow without a prebuild step). Written to the `lib`
 * alias so it sits beside tokens and the theme provider.
 */
export const FONTS_MODULE = `import { useFonts } from 'expo-font';
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
} from '@expo-google-fonts/manrope';
import { SpaceMono_400Regular } from '@expo-google-fonts/space-mono';

/**
 * Loads Manrope and Space Mono.
 *
 * A dev build that uses the expo-font plugin registers every Manrope weight
 * under the family name \`Manrope\`, so \`fontFamily: 'Manrope'\` plus
 * \`fontWeight\` resolves. \`useFonts\` cannot build that family. Expo Go
 * therefore needs the weight-specific name from \`arloFont\`.
 *
 * \`fontFamilies.mono\` is the string \`'Space Mono'\`, which this loader registers.
 * \`t.typography.*\` does not include a \`fontFamily\` — set one on the \`Text\`.
 *
 * \`\`\`tsx
 * const [fontsLoaded] = useArloFonts();
 * if (!fontsLoaded) return null;
 * \`\`\`
 */
export function arloFont(weight: '400' | '500' | '600' | '700' | 400 | 500 | 600 | 700 = 400) {
  switch (String(weight)) {
    case '500':
      return 'Manrope_500Medium';
    case '600':
      return 'Manrope_600SemiBold';
    case '700':
      return 'Manrope_700Bold';
    default:
      return 'Manrope_400Regular';
  }
}

export function useArloFonts() {
  return useFonts({
    Manrope: Manrope_400Regular,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    'Space Mono': SpaceMono_400Regular,
  });
}
`;
