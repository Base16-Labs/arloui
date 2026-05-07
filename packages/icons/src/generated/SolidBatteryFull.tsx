import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidBatteryFull = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M18.375 5.25H2.625A2.25 2.25 0 0 0 .375 7.5v9a2.25 2.25 0 0 0 2.25 2.25h15.75a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25m.75 11.25a.75.75 0 0 1-.75.75H2.625a.75.75 0 0 1-.75-.75v-9a.75.75 0 0 1 .75-.75h15.75a.749.749 0 0 1 .75.75zm-1.5-7.5v6a.75.75 0 0 1-.75.75H4.125a.75.75 0 0 1-.75-.75V9a.75.75 0 0 1 .75-.75h12.75a.749.749 0 0 1 .75.75m6 0v6a.75.75 0 0 1-1.5 0V9a.749.749 0 0 1 1.28-.53c.141.141.22.331.22.53" /></Svg>;
export { SolidBatteryFull as ReactComponent };
