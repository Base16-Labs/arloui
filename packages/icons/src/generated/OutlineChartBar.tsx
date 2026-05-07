import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineChartBar = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M21 19.125h-.75v-15a.751.751 0 0 0-.75-.75h-5.25a.75.75 0 0 0-.75.75v3.75H9a.75.75 0 0 0-.75.75v3.75H4.5a.75.75 0 0 0-.75.75v6H3a.751.751 0 0 0 0 1.5h18a.751.751 0 0 0 0-1.5m-6-14.25h3.75v14.25H15zm-5.25 4.5h3.75v9.75H9.75zm-4.5 4.5h3v5.25h-3z" /></Svg>;
export { OutlineChartBar as ReactComponent };
