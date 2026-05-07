import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineArrowDown = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="m19.28 14.03-6.75 6.75a.8.8 0 0 1-.24.163.75.75 0 0 1-.58 0 .8.8 0 0 1-.24-.163l-6.75-6.75a.753.753 0 0 1 0-1.06.745.745 0 0 1 1.06 0l5.47 5.47V3.75A.755.755 0 0 1 12 3a.75.75 0 0 1 .75.75v14.69l5.47-5.47a.745.745 0 0 1 1.06 0 .753.753 0 0 1 0 1.06" /></Svg>;
export { OutlineArrowDown as ReactComponent };
