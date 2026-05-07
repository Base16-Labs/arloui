import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineSubtitles = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M21 4.5H3A1.5 1.5 0 0 0 1.5 6v12A1.5 1.5 0 0 0 3 19.5h18a1.5 1.5 0 0 0 1.5-1.5V6A1.5 1.5 0 0 0 21 4.5M21 18H3V6h18zM4.5 12.75a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75m15 0a.75.75 0 0 1-.75.75h-9a.75.75 0 0 1 0-1.5h9a.75.75 0 0 1 .75.75m-4.5 3a.75.75 0 0 1-.75.75h-9a.75.75 0 0 1 0-1.5h9a.75.75 0 0 1 .75.75m4.5 0a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 .75.75" /></Svg>;
export { OutlineSubtitles as ReactComponent };
