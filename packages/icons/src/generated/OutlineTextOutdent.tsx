import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineTextOutdent = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M21.375 12.375a.751.751 0 0 1-.75.75h-9.75a.751.751 0 0 1 0-1.5h9.75a.75.75 0 0 1 .75.75m-10.5-5.25h9.75a.751.751 0 0 0 0-1.5h-9.75a.751.751 0 0 0 0 1.5m9.75 10.5h-16.5a.751.751 0 0 0 0 1.5h16.5a.751.751 0 0 0 0-1.5m-13.5-3.75c.149 0 .294-.04.417-.12a.751.751 0 0 0 .319-.77.77.77 0 0 0-.205-.39l-3.221-3.22 3.221-3.22a.75.75 0 1 0-1.062-1.06l-3.75 3.75a.7.7 0 0 0-.162.25.75.75 0 0 0 .162.81l3.75 3.75c.07.07.153.13.244.17.091.03.189.05.287.05" /></Svg>;
export { OutlineTextOutdent as ReactComponent };
