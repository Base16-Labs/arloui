import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineDesk = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M23.25 5.625H.75a.751.751 0 0 0 0 1.5h.75v10.5a.751.751 0 0 0 1.5 0v-4.5h18v4.5a.751.751 0 0 0 1.5 0v-10.5h.75a.751.751 0 0 0 0-1.5M3 7.125h8.25v4.5H3zm18 4.5h-8.25v-4.5H21zM9 9.375a.751.751 0 0 1-.75.75H6a.751.751 0 0 1 0-1.5h2.25a.75.75 0 0 1 .75.75m6 0a.751.751 0 0 1 .75-.75H18a.751.751 0 0 1 0 1.5h-2.25a.75.75 0 0 1-.75-.75" /></Svg>;
export { OutlineDesk as ReactComponent };
