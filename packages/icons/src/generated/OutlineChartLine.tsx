import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineChartLine = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M21.733 19.5a.751.751 0 0 1-.75.75h-18a.75.75 0 0 1-.75-.75v-15a.751.751 0 0 1 1.5 0v8.84L8.49 9.18A.8.8 0 0 1 8.955 9c.172-.01.34.05.478.15l5.513 4.13 5.543-4.85a.8.8 0 0 1 .254-.16.6.6 0 0 1 .3-.05.76.76 0 0 1 .537.25.76.76 0 0 1 .094.86.7.7 0 0 1-.197.23l-6 5.25a.8.8 0 0 1-.466.19.8.8 0 0 1-.478-.15L9.02 10.71l-5.287 4.63v3.41h17.25a.75.75 0 0 1 .75.75" /></Svg>;
export { OutlineChartLine as ReactComponent };
export { OutlineChartLine };
export default OutlineChartLine;
