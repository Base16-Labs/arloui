import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineAngle = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M8.25 7.875a.75.75 0 0 1 .75-.75 9.75 9.75 0 0 1 6.89 2.859 9.74 9.74 0 0 1 2.86 6.891.751.751 0 0 1-1.5 0c0-2.187-.87-4.284-2.42-5.831A8.24 8.24 0 0 0 9 8.625a.751.751 0 0 1-.75-.75m13.5 11.25h-15v-15a.751.751 0 0 0-1.5 0v3h-3a.751.751 0 0 0 0 1.5h3v11.25a.75.75 0 0 0 .75.75h15.75a.751.751 0 0 0 0-1.5" /></Svg>;
export { OutlineAngle as ReactComponent };
export { OutlineAngle };
export default OutlineAngle;
