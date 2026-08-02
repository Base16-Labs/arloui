import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineDresser = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M13.5 18a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 .75.75M11.25 6.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5m1.5 4.5h-1.5a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5m7.5-7.5v16.5a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V3.75a1.5 1.5 0 0 1 1.5-1.5h13.5a1.5 1.5 0 0 1 1.5 1.5m-15 10.5h13.5v-4.5H5.25zm0-10.5v4.5h13.5v-4.5zm13.5 16.5v-4.5H5.25v4.5z" /></Svg>;
export { OutlineDresser as ReactComponent };
export { OutlineDresser };
export default OutlineDresser;
