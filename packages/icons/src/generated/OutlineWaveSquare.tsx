import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineWaveSquare = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M22.5 12v5.25a.75.75 0 0 1-.75.75H12a.75.75 0 0 1-.75-.75V7.5H3V12a.75.75 0 0 1-1.5 0V6.75A.75.75 0 0 1 2.25 6H12a.75.75 0 0 1 .75.75v9.75H21V12a.75.75 0 0 1 1.5 0" /></Svg>;
export { OutlineWaveSquare as ReactComponent };
