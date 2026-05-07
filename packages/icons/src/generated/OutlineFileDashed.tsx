import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineFileDashed = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M7.5 21a.75.75 0 0 1-.75.75h-1.5a1.5 1.5 0 0 1-1.5-1.5v-3a.75.75 0 0 1 1.5 0v3h1.5a.75.75 0 0 1 .75.75M20.25 8.25v4.5a.75.75 0 0 1-1.5 0V9h-4.5a.75.75 0 0 1-.75-.75v-4.5h-2.25a.75.75 0 0 1 0-1.5h3a.776.776 0 0 1 .53.22l5.25 5.25a.78.78 0 0 1 .22.53M15 7.5h2.69L15 4.81zM7.5 2.25H5.25a1.5 1.5 0 0 0-1.5 1.5V6a.75.75 0 0 0 1.5 0V3.75H7.5a.75.75 0 0 0 0-1.5m12 13.5a.75.75 0 0 0-.75.75v3.75H18a.75.75 0 0 0 0 1.5h.75a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 0-.75-.75m-15-1.5a.75.75 0 0 0 .75-.75V9.75a.75.75 0 0 0-1.5 0v3.75a.75.75 0 0 0 .75.75m9.75 6H10.5a.75.75 0 0 0 0 1.5h3.75a.75.75 0 0 0 0-1.5" /></Svg>;
export { OutlineFileDashed as ReactComponent };
