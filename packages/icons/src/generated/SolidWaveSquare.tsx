import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidWaveSquare = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M20.25 3.75H3.75a1.5 1.5 0 0 0-1.5 1.5v13.5a1.5 1.5 0 0 0 1.5 1.5h16.5a1.5 1.5 0 0 0 1.5-1.5V5.25a1.5 1.5 0 0 0-1.5-1.5m-.75 12a.75.75 0 0 1-.75.75H12a.75.75 0 0 1-.75-.75V9H6v3a.75.75 0 0 1-1.5 0V8.25a.75.75 0 0 1 .75-.75H12a.75.75 0 0 1 .75.75V15H18v-3a.75.75 0 0 1 1.5 0z" /></Svg>;
export { SolidWaveSquare as ReactComponent };
