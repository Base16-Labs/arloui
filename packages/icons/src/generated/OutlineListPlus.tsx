import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineListPlus = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M2.25 4.875a.751.751 0 0 1 .75-.75h16.5a.751.751 0 0 1 0 1.5H3a.75.75 0 0 1-.75-.75m.75 6.75h16.5a.751.751 0 0 0 0-1.5H3a.751.751 0 0 0 0 1.5m9.75 4.5H3a.751.751 0 0 0 0 1.5h9.75a.751.751 0 0 0 0-1.5m8.25 0h-1.5v-1.5a.751.751 0 0 0-1.5 0v1.5h-1.5a.751.751 0 0 0 0 1.5H18v1.5a.751.751 0 0 0 1.28.53c.141-.14.22-.34.22-.53v-1.5H21a.751.751 0 0 0 0-1.5" /></Svg>;
export { OutlineListPlus as ReactComponent };
