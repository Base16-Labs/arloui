import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineChatSlash = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M5.055 2.495a.8.8 0 0 0-.235-.17.7.7 0 0 0-.286-.08 1 1 0 0 0-.292.04.8.8 0 0 0-.252.16.65.65 0 0 0-.175.23.76.76 0 0 0-.025.58c.035.09.087.18.155.25l.223.25H3.75c-.398 0-.779.16-1.061.44s-.439.66-.439 1.06v15c-.002.28.079.56.233.8.153.25.373.44.633.56a1.484 1.484 0 0 0 1.596-.22h.007l3.062-2.64h10.024l1.14 1.25q.1.12.235.18c.09.04.187.07.286.07.099.01.198-.01.292-.04a.65.65 0 0 0 .252-.15.76.76 0 0 0 .2-.82.9.9 0 0 0-.155-.25zM7.5 17.255c-.18 0-.354.06-.49.18l-3.26 2.82v-15h1.781l10.91 12zm14.25-12v11.43c0 .2-.079.39-.22.54a.74.74 0 0 1-.53.21.74.74 0 0 1-.53-.21.79.79 0 0 1-.22-.54V5.255H9.918a.751.751 0 0 1 0-1.5H20.25c.398 0 .779.16 1.061.44s.439.66.439 1.06" /></Svg>;
export { OutlineChatSlash as ReactComponent };
export { OutlineChatSlash };
export default OutlineChatSlash;
