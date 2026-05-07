import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidCardholder = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M19.5 4.5h-15c-.597 0-1.169.23-1.591.66-.422.42-.659.99-.659 1.59v10.5A2.256 2.256 0 0 0 4.5 19.5h15a2.256 2.256 0 0 0 2.25-2.25V6.75c0-.6-.237-1.17-.659-1.59A2.22 2.22 0 0 0 19.5 4.5m-5.25 6.75A2.256 2.256 0 0 1 12 13.5a2.256 2.256 0 0 1-2.25-2.25.751.751 0 0 0-.75-.75H3.75V9h16.5v1.5H15a.75.75 0 0 0-.75.75M4.5 6h15a.75.75 0 0 1 .75.75v.75H3.75v-.75A.751.751 0 0 1 4.5 6" /></Svg>;
export { SolidCardholder as ReactComponent };
