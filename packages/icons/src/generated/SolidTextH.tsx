import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidTextH = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M19.5 3h-15A1.5 1.5 0 0 0 3 4.5v15A1.5 1.5 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 19.5 3m-2.25 13.5a.75.75 0 0 1-1.5 0v-3.75h-7.5v3.75a.75.75 0 0 1-1.5 0v-9a.75.75 0 0 1 1.5 0v3.75h7.5V7.5a.75.75 0 0 1 1.5 0z" /></Svg>;
export { SolidTextH as ReactComponent };
