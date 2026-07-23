import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidResize = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M13.5 11.25v8.25a.75.75 0 0 1-.75.75H4.5a.75.75 0 0 1-.75-.75v-8.25a.75.75 0 0 1 .75-.75h8.25a.75.75 0 0 1 .75.75m6 5.25a.75.75 0 0 0-.75.75v1.5H16.5a.75.75 0 0 0 0 1.5h2.25a1.5 1.5 0 0 0 1.5-1.5v-1.5a.75.75 0 0 0-.75-.75m0-6.75a.75.75 0 0 0-.75.75v3a.75.75 0 0 0 1.5 0v-3a.75.75 0 0 0-.75-.75m-.75-6h-1.5a.75.75 0 0 0 0 1.5h1.5v1.5a.75.75 0 0 0 1.5 0v-1.5a1.5 1.5 0 0 0-1.5-1.5m-5.25 0h-3a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5m-9 4.5a.75.75 0 0 0 .75-.75V5.25h1.5a.75.75 0 0 0 0-1.5h-1.5a1.5 1.5 0 0 0-1.5 1.5V7.5a.75.75 0 0 0 .75.75" /></Svg>;
export { SolidResize as ReactComponent };
