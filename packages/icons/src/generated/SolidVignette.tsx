import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidVignette = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M20.25 3.75H3.75a1.5 1.5 0 0 0-1.5 1.5v13.5a1.5 1.5 0 0 0 1.5 1.5h16.5a1.5 1.5 0 0 0 1.5-1.5V5.25a1.5 1.5 0 0 0-1.5-1.5M18.75 12c0 2.9-3.02 5.25-6.75 5.25S5.25 14.9 5.25 12 8.27 6.75 12 6.75 18.75 9.1 18.75 12" /></Svg>;
export { SolidVignette as ReactComponent };
