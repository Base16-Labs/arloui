import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineWall = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M21 4.5H3a.75.75 0 0 0-.75.75v13.5a.751.751 0 0 0 .75.75h18a.75.75 0 0 0 .75-.75V5.25A.751.751 0 0 0 21 4.5m-12.75 9v-3h7.5v3zm-4.5 0v-3h3v3zm13.5-3h3v3h-3zm3-1.5h-7.5V6h7.5zm-9-3v3h-7.5V6zm-7.5 9h7.5v3h-7.5zm9 3v-3h7.5v3z" /></Svg>;
export { OutlineWall as ReactComponent };
