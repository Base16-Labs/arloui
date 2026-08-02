import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineSidebar = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20.25 3.75H3.75a1.5 1.5 0 0 0-1.5 1.5v13.5a1.5 1.5 0 0 0 1.5 1.5h16.5a1.5 1.5 0 0 0 1.5-1.5V5.25a1.5 1.5 0 0 0-1.5-1.5m-16.5 10.5h1.5a.75.75 0 0 0 0-1.5h-1.5v-1.5h1.5a.75.75 0 0 0 0-1.5h-1.5v-1.5h1.5a.75.75 0 0 0 0-1.5h-1.5v-1.5H7.5v13.5H3.75zm16.5 4.5H9V5.25h11.25z" /></Svg>;
export { OutlineSidebar as ReactComponent };
export { OutlineSidebar };
export default OutlineSidebar;
