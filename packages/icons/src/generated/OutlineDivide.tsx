import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineDivide = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M21 12a.75.75 0 0 1-.75.75H3.75a.75.75 0 0 1 0-1.5h16.5A.75.75 0 0 1 21 12m-9-4.5a1.5 1.5 0 0 0 1.39-.93c.11-.27.14-.57.08-.86s-.2-.56-.41-.77-.48-.35-.77-.41-.59-.03-.86.08A1.5 1.5 0 0 0 12 7.5m0 9c-.3 0-.59.09-.83.25-.25.17-.44.4-.55.68-.12.27-.15.57-.09.86s.2.56.41.77.48.35.77.41.59.03.86-.08A1.5 1.5 0 0 0 12 16.5" /></Svg>;
export { OutlineDivide as ReactComponent };
