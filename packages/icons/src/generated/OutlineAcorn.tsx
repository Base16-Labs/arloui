import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineAcorn = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M21.75 9.75A5.256 5.256 0 0 0 16.5 4.5h-3.75A2.25 2.25 0 0 1 15 2.25a.75.75 0 1 0 0-1.5 3.75 3.75 0 0 0-3.75 3.75H7.5a5.256 5.256 0 0 0-5.25 5.25A1.5 1.5 0 0 0 3 11.047V12c0 3.33 3.105 5.824 5.6 7.827 1.118.898 2.65 2.127 2.65 2.673a.75.75 0 1 0 1.5 0c0-.546 1.532-1.775 2.65-2.673C17.894 17.824 21 15.331 21 12v-.953a1.5 1.5 0 0 0 .75-1.297M7.5 6h9a3.756 3.756 0 0 1 3.75 3.75H3.75A3.75 3.75 0 0 1 7.5 6m6.96 12.656c-.995.799-1.874 1.5-2.46 2.191-.586-.686-1.465-1.392-2.46-2.19C7.293 16.854 4.5 14.611 4.5 12v-.75h15V12c0 2.612-2.794 4.855-5.04 6.656" /></Svg>;
export { OutlineAcorn as ReactComponent };
export { OutlineAcorn };
export default OutlineAcorn;
