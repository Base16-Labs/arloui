import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidWaveform = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M20.25 3.75H3.75a1.5 1.5 0 0 0-1.5 1.5v13.5a1.5 1.5 0 0 0 1.5 1.5h16.5a1.5 1.5 0 0 0 1.5-1.5V5.25a1.5 1.5 0 0 0-1.5-1.5m-13.5 10.5a.75.75 0 0 1-1.5 0v-4.5a.75.75 0 0 1 1.5 0zm3 3a.75.75 0 0 1-1.5 0V6.75a.75.75 0 0 1 1.5 0zm3-1.5a.75.75 0 0 1-1.5 0v-7.5a.75.75 0 0 1 1.5 0zm3-1.5a.75.75 0 0 1-1.5 0v-4.5a.75.75 0 0 1 1.5 0zm3 .75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 1.5 0z" /></Svg>;
export { SolidWaveform as ReactComponent };
