import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineBrowser = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M20.25 3.75H3.75a1.5 1.5 0 0 0-1.5 1.5v13.5a1.5 1.5 0 0 0 1.5 1.5h16.5a1.5 1.5 0 0 0 1.5-1.5V5.25a1.5 1.5 0 0 0-1.5-1.5m0 1.5v3H3.75v-3zm0 13.5H3.75v-9h16.5z" /></Svg>;
export { OutlineBrowser as ReactComponent };
