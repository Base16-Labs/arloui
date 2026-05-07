import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineCardholder = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M19.5 4.5h-15c-.597 0-1.169.23-1.591.66-.422.42-.659.99-.659 1.59v10.5A2.256 2.256 0 0 0 4.5 19.5h15a2.256 2.256 0 0 0 2.25-2.25V6.75c0-.6-.237-1.17-.659-1.59A2.22 2.22 0 0 0 19.5 4.5M3.75 9h16.5v1.5H15a.75.75 0 0 0-.75.75A2.256 2.256 0 0 1 12 13.5a2.256 2.256 0 0 1-2.25-2.25.751.751 0 0 0-.75-.75H3.75zm.75-3h15a.75.75 0 0 1 .75.75v.75H3.75v-.75A.751.751 0 0 1 4.5 6m15 12h-15a.75.75 0 0 1-.75-.75V12h4.575a3.7 3.7 0 0 0 1.302 2.15 3.74 3.74 0 0 0 4.746 0A3.7 3.7 0 0 0 15.675 12h4.575v5.25a.751.751 0 0 1-.75.75" /></Svg>;
export { OutlineCardholder as ReactComponent };
