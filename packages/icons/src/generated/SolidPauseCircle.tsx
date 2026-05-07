import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidPauseCircle = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M12 2.25a9.76 9.76 0 0 0-5.417 1.64 9.7 9.7 0 0 0-3.59 4.38 9.74 9.74 0 0 0 2.113 10.62 9.8 9.8 0 0 0 4.992 2.67c1.891.38 3.852.18 5.633-.56a9.66 9.66 0 0 0 4.376-3.59 9.736 9.736 0 0 0-1.216-12.3 9.74 9.74 0 0 0-6.89-2.86M10.5 15A.751.751 0 0 1 9 15V9a.751.751 0 0 1 1.5 0zm4.5 0a.751.751 0 0 1-1.5 0V9A.751.751 0 0 1 15 9z" /></Svg>;
export { SolidPauseCircle as ReactComponent };
