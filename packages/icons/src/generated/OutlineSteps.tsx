import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineSteps = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M23.25 5.25a.751.751 0 0 1-.75.75H18v3.75a.751.751 0 0 1-.75.75h-4.5v3.75A.751.751 0 0 1 12 15H7.5v3.75a.751.751 0 0 1-.75.75H1.5a.751.751 0 0 1 0-1.5H6v-3.75a.751.751 0 0 1 .75-.75h4.5V9.75A.751.751 0 0 1 12 9h4.5V5.25a.751.751 0 0 1 .75-.75h5.25a.75.75 0 0 1 .75.75" /></Svg>;
export { OutlineSteps as ReactComponent };
