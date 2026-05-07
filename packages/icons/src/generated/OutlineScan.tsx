import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineScan = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M21 3.75V7.5a.75.75 0 0 1-1.5 0v-3h-3a.75.75 0 0 1 0-1.5h3.75a.75.75 0 0 1 .75.75M7.5 19.5h-3v-3a.75.75 0 0 0-1.5 0v3.75a.75.75 0 0 0 .75.75H7.5a.75.75 0 0 0 0-1.5m12.75-3.75a.75.75 0 0 0-.75.75v3h-3a.75.75 0 0 0 0 1.5h3.75a.75.75 0 0 0 .75-.75V16.5a.75.75 0 0 0-.75-.75m-16.5-7.5a.75.75 0 0 0 .75-.75v-3h3a.75.75 0 0 0 0-1.5H3.75a.75.75 0 0 0-.75.75V7.5a.75.75 0 0 0 .75.75m3.75-1.5h9a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-.75.75h-9a.75.75 0 0 1-.75-.75v-9a.75.75 0 0 1 .75-.75m.75 9h7.5v-7.5h-7.5z" /></Svg>;
export { OutlineScan as ReactComponent };
