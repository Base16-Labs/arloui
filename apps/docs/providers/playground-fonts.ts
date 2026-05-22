import { Doto_600SemiBold } from '@expo-google-fonts/doto';
import {
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
} from '@expo-google-fonts/space-grotesk';
import { SpaceMono_400Regular } from '@expo-google-fonts/space-mono';

/** Keys match `fontFamilies` in registry tokens so primitives render correctly. */
export const playgroundFontAssets = {
  'Space Grotesk': SpaceGrotesk_400Regular,
  'Space Grotesk Medium': SpaceGrotesk_500Medium,
  'Space Grotesk SemiBold': SpaceGrotesk_600SemiBold,
  'Space Mono': SpaceMono_400Regular,
  Doto: Doto_600SemiBold,
} as const;
