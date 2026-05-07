import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidCoffee = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M18.75 8.25H2.25A.75.75 0 0 0 1.5 9v4.5c.002 1.28.275 2.54.801 3.7a8.9 8.9 0 0 0 2.25 3.05H2.25a.751.751 0 0 0 0 1.5h16.5a.751.751 0 0 0 0-1.5h-2.301a9.06 9.06 0 0 0 2.532-3.76 3.73 3.73 0 0 0 2.501-1.17 3.76 3.76 0 0 0 1.018-2.57V12a3.75 3.75 0 0 0-3.75-3.75m2.25 4.5c0 .49-.158.96-.448 1.35s-.699.67-1.164.81q.11-.705.112-1.41V9.88c.439.16.818.44 1.087.82S21 11.54 21 12zM9.75 6V3a.751.751 0 0 1 1.5 0v3a.751.751 0 0 1-1.5 0m3 0V3a.751.751 0 0 1 1.5 0v3a.751.751 0 0 1-1.5 0m-6 0V3a.751.751 0 0 1 1.5 0v3a.751.751 0 0 1-1.5 0" /></Svg>;
export { SolidCoffee as ReactComponent };
