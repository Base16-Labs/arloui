import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineWaveform = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M5.25 9v6a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 1.5 0m3-6.75A.75.75 0 0 0 7.5 3v18A.75.75 0 0 0 9 21V3a.75.75 0 0 0-.75-.75m3.75 3a.75.75 0 0 0-.75.75v12a.75.75 0 0 0 1.5 0V6a.75.75 0 0 0-.75-.75m3.75 3A.75.75 0 0 0 15 9v6a.75.75 0 0 0 1.5 0V9a.75.75 0 0 0-.75-.75m3.75-1.5a.75.75 0 0 0-.75.75v9a.75.75 0 0 0 1.5 0v-9a.75.75 0 0 0-.75-.75" /></Svg>;
export { OutlineWaveform as ReactComponent };
