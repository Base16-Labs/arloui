import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineTreeView = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M15.75 14.25h3a1.5 1.5 0 0 0 1.5-1.5v-3a1.5 1.5 0 0 0-1.5-1.5h-3a1.5 1.5 0 0 0-1.5 1.5v.75H7.5v-3h.75A1.5 1.5 0 0 0 9.75 6V3a1.5 1.5 0 0 0-1.5-1.5h-3A1.5 1.5 0 0 0 3.75 3v3a1.5 1.5 0 0 0 1.5 1.5H6V18c0 .6.24 1.17.66 1.59s.99.66 1.59.66h6V21a1.5 1.5 0 0 0 1.5 1.5h3a1.5 1.5 0 0 0 1.5-1.5v-3a1.5 1.5 0 0 0-1.5-1.5h-3a1.5 1.5 0 0 0-1.5 1.5v.75h-6A.75.75 0 0 1 7.5 18v-6h6.75v.75a1.5 1.5 0 0 0 1.5 1.5M5.25 3h3v3h-3zm10.5 15h3v3h-3zm0-8.25h3v3h-3z" /></Svg>;
export { OutlineTreeView as ReactComponent };
