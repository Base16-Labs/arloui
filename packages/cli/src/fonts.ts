/**
 * Font setup emitted by `arlo init`.
 *
 * The tokens name a single family (`fontFamilies.sans === 'Manrope'`) and carry
 * weight separately in `fontWeights`, so components style with
 * `fontFamily: t.fontFamilies.sans` + `fontWeight: t.fontWeights.semibold`.
 * That only resolves if every weight is registered under the *same* family name,
 * which is exactly what the `expo-font` config plugin does — it writes Android
 * XML font families that map weight -> file, and iOS matches on PostScript name.
 *
 * Registering weights as separate families ('Manrope SemiBold') would work too,
 * but it hard-codes the weight into the family string and defeats the one-line
 * family swap the type scale is built around.
 */

/** Packages a consumer needs for the default Manrope setup. */
export const FONT_PACKAGES = ['expo-font', '@expo-google-fonts/manrope'] as const;

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

/**
 * Loads the family the Arlo UI tokens name in \`fontFamilies.sans\`.
 *
 * Every weight registers under the one family name so that
 * \`fontFamily: 'Manrope'\` + \`fontWeight: '600'\` resolves — components never
 * spell a weight into the family string.
 *
 * \`\`\`tsx
 * const [fontsLoaded] = useArloFonts();
 * if (!fontsLoaded) return null; // or <SplashScreen />
 * \`\`\`
 *
 * Swapping typeface is a one-line change: point these at another family and
 * update \`fontFamilies.sans\` in your tokens to match.
 */
export function useArloFonts() {
  return useFonts({
    Manrope: Manrope_400Regular,
    'Manrope-Medium': Manrope_500Medium,
    'Manrope-SemiBold': Manrope_600SemiBold,
    'Manrope-Bold': Manrope_700Bold,
  });
}
`;
