import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidCactus = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M21 21a.75.75 0 0 1-.75.75H3.75a.75.75 0 0 1 0-1.5h4.5V13.5H7.5a6.01 6.01 0 0 1-6-6c0-.6.24-1.17.66-1.59.43-.43 1-.66 1.6-.66h.04A2.203 2.203 0 0 1 6 7.45v.05A1.5 1.5 0 0 0 7.5 9h.75V6c0-1 .4-1.95 1.1-2.65.7-.71 1.66-1.1 2.65-1.1s1.95.39 2.65 1.1c.7.7 1.1 1.65 1.1 2.65v6.75h.75a1.5 1.5 0 0 0 1.5-1.5v-.05A2.203 2.203 0 0 1 20.2 9h.04c.6 0 1.17.23 1.6.66.42.42.66.99.66 1.59a6.012 6.012 0 0 1-6 6h-.75v3h4.5A.75.75 0 0 1 21 21" /></Svg>;
export { SolidCactus as ReactComponent };
