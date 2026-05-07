import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidCallBell = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M1.5 17.25a.75.75 0 0 1 .75-.75H3V15c0-2.26.85-4.43 2.38-6.09a9 9 0 0 1 5.87-2.88V4.5h-1.5a.75.75 0 0 1 0-1.5h4.5a.75.75 0 0 1 0 1.5h-1.5v1.53c2.25.19 4.34 1.22 5.87 2.88A8.98 8.98 0 0 1 21 15v1.5h.75a.75.75 0 0 1 0 1.5H2.25a.75.75 0 0 1-.75-.75m20.25 2.25H2.25a.75.75 0 0 0 0 1.5h19.5a.75.75 0 0 0 0-1.5" /></Svg>;
export { SolidCallBell as ReactComponent };
