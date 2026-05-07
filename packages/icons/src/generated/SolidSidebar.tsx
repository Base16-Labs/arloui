import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidSidebar = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M20.25 3.75H3.75a1.5 1.5 0 0 0-1.5 1.5v13.5a1.5 1.5 0 0 0 1.5 1.5h16.5a1.5 1.5 0 0 0 1.5-1.5V5.25a1.5 1.5 0 0 0-1.5-1.5M6 14.25H4.5a.75.75 0 0 1 0-1.5H6a.75.75 0 0 1 0 1.5m0-3H4.5a.75.75 0 0 1 0-1.5H6a.75.75 0 0 1 0 1.5m0-3H4.5a.75.75 0 0 1 0-1.5H6a.75.75 0 0 1 0 1.5m14.25 10.5h-12V5.25h12z" /></Svg>;
export { SolidSidebar as ReactComponent };
