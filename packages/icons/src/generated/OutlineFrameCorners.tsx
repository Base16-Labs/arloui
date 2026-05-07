import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineFrameCorners = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M18.75 7.5v3a.75.75 0 0 1-1.5 0V8.25H15a.75.75 0 0 1 0-1.5h3a.75.75 0 0 1 .75.75M9 15.75H6.75V13.5a.75.75 0 0 0-1.5 0v3a.75.75 0 0 0 .75.75h3a.75.75 0 0 0 0-1.5m12.75-10.5v13.5a1.5 1.5 0 0 1-1.5 1.5H3.75a1.5 1.5 0 0 1-1.5-1.5V5.25a1.5 1.5 0 0 1 1.5-1.5h16.5a1.5 1.5 0 0 1 1.5 1.5m-1.5 13.5V5.25H3.75v13.5z" /></Svg>;
export { OutlineFrameCorners as ReactComponent };
