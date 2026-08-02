import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineTextIndent = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M21 12.375a.751.751 0 0 1-.75.75H10.5a.751.751 0 0 1 0-1.5h9.75a.75.75 0 0 1 .75.75m-10.5-5.25h9.75a.751.751 0 0 0 0-1.5H10.5a.751.751 0 0 0 0 1.5m9.75 10.5H3.75a.751.751 0 0 0 0 1.5h16.5a.751.751 0 0 0 0-1.5m-17.031-3.97c.07.07.153.13.244.17.091.03.189.05.287.05a1 1 0 0 0 .287-.05c.091-.04.174-.1.244-.17l3.75-3.75a.8.8 0 0 0 .163-.24.8.8 0 0 0 .057-.29c0-.1-.02-.19-.057-.28a.7.7 0 0 0-.163-.25l-3.75-3.75a.755.755 0 0 0-1.062 0 .75.75 0 0 0 0 1.06l3.221 3.22-3.221 3.22a.7.7 0 0 0-.162.25.75.75 0 0 0 .162.81" /></Svg>;
export { OutlineTextIndent as ReactComponent };
export { OutlineTextIndent };
export default OutlineTextIndent;
