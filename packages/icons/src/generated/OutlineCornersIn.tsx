import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineCornersIn = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M14.25 9V4.5a.75.75 0 0 1 1.5 0v3.75h3.75a.75.75 0 0 1 0 1.5H15a.75.75 0 0 1-.75-.75M9 14.25H4.5a.75.75 0 0 0 0 1.5h3.75v3.75a.75.75 0 0 0 1.5 0V15a.75.75 0 0 0-.75-.75m10.5 0H15a.75.75 0 0 0-.75.75v4.5a.75.75 0 0 0 1.5 0v-3.75h3.75a.75.75 0 0 0 0-1.5M9 3.75a.75.75 0 0 0-.75.75v3.75H4.5a.75.75 0 0 0 0 1.5H9A.75.75 0 0 0 9.75 9V4.5A.75.75 0 0 0 9 3.75" /></Svg>;
export { OutlineCornersIn as ReactComponent };
