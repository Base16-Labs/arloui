import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidMonitor = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M21.75 5.25v10.5c0 .59-.24 1.17-.66 1.59s-.99.66-1.59.66h-15c-.6 0-1.17-.24-1.59-.66s-.66-1-.66-1.59V5.25c0-.6.24-1.17.66-1.59C3.33 3.23 3.9 3 4.5 3h15c.6 0 1.17.23 1.59.66.42.42.66.99.66 1.59M15 19.5H9A.75.75 0 0 0 9 21h6a.75.75 0 0 0 0-1.5" /></Svg>;
export { SolidMonitor as ReactComponent };
export { SolidMonitor };
export default SolidMonitor;
