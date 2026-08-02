import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidMouse = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M13.5 1.5h-3c-1.591 0-3.116.63-4.241 1.76A6 6 0 0 0 4.5 7.5v9a6.02 6.02 0 0 0 1.759 4.24A6.06 6.06 0 0 0 10.5 22.5h3a6.06 6.06 0 0 0 4.241-1.76A6.02 6.02 0 0 0 19.5 16.5v-9a6 6 0 0 0-1.759-4.24A5.98 5.98 0 0 0 13.5 1.5m4.5 6v2.25h-5.25V3h.75c1.193 0 2.337.47 3.181 1.32A4.49 4.49 0 0 1 18 7.5M10.5 3h.75v6.75H6V7.5c.001-1.2.476-2.34 1.319-3.18A4.47 4.47 0 0 1 10.5 3" /></Svg>;
export { SolidMouse as ReactComponent };
export { SolidMouse };
export default SolidMouse;
