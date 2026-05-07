import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidSubtitles = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M21 4.5H3A1.5 1.5 0 0 0 1.5 6v12A1.5 1.5 0 0 0 3 19.5h18a1.5 1.5 0 0 0 1.5-1.5V6A1.5 1.5 0 0 0 21 4.5M5.25 12h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1 0-1.5m9 4.5h-9a.75.75 0 0 1 0-1.5h9a.75.75 0 0 1 0 1.5m4.5 0h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5m0-3h-9a.75.75 0 0 1 0-1.5h9a.75.75 0 0 1 0 1.5" /></Svg>;
export { SolidSubtitles as ReactComponent };
