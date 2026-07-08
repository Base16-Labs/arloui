import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidFile = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="m20.031 7.72-5.25-5.25a.78.78 0 0 0-.531-.22h-9a1.504 1.504 0 0 0-1.5 1.5v16.5a1.504 1.504 0 0 0 1.5 1.5h13.5c.398 0 .78-.16 1.061-.44s.439-.66.439-1.06v-12a.748.748 0 0 0-.219-.53m-5.781.53V4.13l4.125 4.12z" /></Svg>;
export { SolidFile as ReactComponent };
