import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidChartBar = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M21.75 19.875a.751.751 0 0 1-.75.75H3a.751.751 0 0 1 0-1.5h.75v-6a.751.751 0 0 1 .75-.75h2.25a.75.75 0 0 1 .75.75v6H9v-10.5a.751.751 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v10.5H15v-15a.751.751 0 0 1 .75-.75h3.75a.75.75 0 0 1 .75.75v15H21a.75.75 0 0 1 .75.75" /></Svg>;
export { SolidChartBar as ReactComponent };
export { SolidChartBar };
export default SolidChartBar;
