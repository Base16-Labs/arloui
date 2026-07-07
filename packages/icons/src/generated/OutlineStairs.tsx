import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineStairs = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M18.75 2.25H5.25a1.5 1.5 0 0 0-1.5 1.5v16.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V3.75a1.5 1.5 0 0 0-1.5-1.5m-4.5 11.25h4.5v2.25H10.5V13.5zM15 12V9.75h3.75V12zm3.75-8.25v4.5h-4.5a.75.75 0 0 0-.75.75v3H9.75a.75.75 0 0 0-.75.75v3H5.25v-12zm0 16.5H5.25v-3h13.5z" /></Svg>;
export { OutlineStairs as ReactComponent };
