import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineChartBarHorizontal = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M20.25 9H16.5V5.25a.751.751 0 0 0-.75-.75H4.5v-.75a.751.751 0 0 0-1.5 0v16.5a.751.751 0 0 0 1.5 0v-.75h8.25a.75.75 0 0 0 .75-.75V15h6.75a.75.75 0 0 0 .75-.75v-4.5a.751.751 0 0 0-.75-.75M15 6v3H4.5V6zm-3 12H4.5v-3H12zm7.5-4.5h-15v-3h15z" /></Svg>;
export { OutlineChartBarHorizontal as ReactComponent };
