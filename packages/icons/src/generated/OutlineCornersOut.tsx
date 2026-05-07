import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineCornersOut = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M20.25 4.5v3.75a.75.75 0 0 1-1.5 0v-3h-3a.75.75 0 0 1 0-1.5h3.75a.75.75 0 0 1 .75.75m-12 14.25h-3v-3a.75.75 0 0 0-1.5 0v3.75a.75.75 0 0 0 .75.75h3.75a.75.75 0 0 0 0-1.5M19.5 15a.75.75 0 0 0-.75.75v3h-3a.75.75 0 0 0 0 1.5h3.75a.75.75 0 0 0 .75-.75v-3.75a.75.75 0 0 0-.75-.75M8.25 3.75H4.5a.75.75 0 0 0-.75.75v3.75a.75.75 0 0 0 1.5 0v-3h3a.75.75 0 0 0 0-1.5" /></Svg>;
export { OutlineCornersOut as ReactComponent };
