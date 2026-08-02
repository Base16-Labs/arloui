import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidMusicNote = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="m19.72 4.906-7.5-2.25a.803.803 0 0 0-.67.11.773.773 0 0 0-.3.61v10.15a4.5 4.5 0 0 0-2.78-1.14 4.4 4.4 0 0 0-2.87.86 4.4 4.4 0 0 0-1.7 2.48c-.26.99-.18 2.05.24 2.99s1.15 1.71 2.07 2.17c.92.47 1.97.61 2.98.39s1.91-.77 2.56-1.57 1-1.8 1-2.83v-8l6.53 1.96a.803.803 0 0 0 .67-.11c.09-.07.17-.16.22-.27.05-.1.08-.22.08-.33v-4.5c0-.16-.05-.32-.15-.45a.7.7 0 0 0-.38-.27" /></Svg>;
export { SolidMusicNote as ReactComponent };
export { SolidMusicNote };
export default SolidMusicNote;
