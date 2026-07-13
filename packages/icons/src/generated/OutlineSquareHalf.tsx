import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineSquareHalf = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M18.75 3.75H5.25a1.5 1.5 0 0 0-1.5 1.5v13.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V5.25a1.5 1.5 0 0 0-1.5-1.5m-6 7.5h6v1.5h-6zm0-1.5v-1.5h6v1.5zm0 4.5h6v1.5h-6zm6-7.5h-6v-1.5h6zm-13.5-1.5h6v13.5h-6zm13.5 13.5h-6v-1.5h6z" /></Svg>;
export { OutlineSquareHalf as ReactComponent };
