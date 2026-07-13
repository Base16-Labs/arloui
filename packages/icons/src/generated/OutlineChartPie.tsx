import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineChartPie = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M12 2.25a9.76 9.76 0 0 0-5.417 1.64 9.7 9.7 0 0 0-3.59 4.38 9.74 9.74 0 0 0 2.113 10.62 9.73 9.73 0 0 0 4.992 2.67c1.891.38 3.852.18 5.633-.55a9.74 9.74 0 0 0 4.376-3.6 9.736 9.736 0 0 0-1.216-12.3 9.74 9.74 0 0 0-6.89-2.86m6.738 4.99L12.75 10.7V3.78c1.19.11 2.34.48 3.374 1.07a8.35 8.35 0 0 1 2.614 2.39M11.25 3.78v7.78l-6.74 3.89a8.245 8.245 0 0 1 3.045-10.4 8.3 8.3 0 0 1 3.695-1.27M12 20.25a8.2 8.2 0 0 1-3.795-.93 8.3 8.3 0 0 1-2.943-2.57L19.49 8.54c.58 1.26.834 2.64.74 4.02a8.2 8.2 0 0 1-1.28 3.88 8.2 8.2 0 0 1-2.989 2.79 8.2 8.2 0 0 1-3.96 1.02" /></Svg>;
export { OutlineChartPie as ReactComponent };
