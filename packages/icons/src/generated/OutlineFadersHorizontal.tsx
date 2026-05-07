import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineFadersHorizontal = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M16.5 7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75m-12.75.75h9.75v1.5a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-1.5 0v1.5H3.75a.75.75 0 0 0 0 1.5m16.5 7.5h-9a.75.75 0 0 0 0 1.5h9a.75.75 0 0 0 0-1.5m-12-2.25a.75.75 0 0 0-.75.75v1.5H3.75a.75.75 0 0 0 0 1.5H7.5v1.5a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75" /></Svg>;
export { OutlineFadersHorizontal as ReactComponent };
