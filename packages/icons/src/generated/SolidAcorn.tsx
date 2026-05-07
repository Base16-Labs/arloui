import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidAcorn = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M21.75 9.75A5.254 5.254 0 0 0 16.5 4.5h-3.75A2.25 2.25 0 0 1 15 2.25a.75.75 0 0 0 .75-.75.75.75 0 0 0-.75-.75 3.75 3.75 0 0 0-3.75 3.75H7.5a5.256 5.256 0 0 0-5.25 5.25A1.5 1.5 0 0 0 3 11.047V12c0 3.33 3.105 5.824 5.601 7.827 1.117.898 2.649 2.127 2.649 2.673a.749.749 0 0 0 1.28.53.75.75 0 0 0 .22-.53c0-.546 1.532-1.775 2.649-2.673C17.895 17.824 21 15.331 21 12v-.953a1.5 1.5 0 0 0 .75-1.297m-7.289 8.906c-.996.799-1.875 1.5-2.461 2.191-.586-.686-1.465-1.392-2.461-2.19C7.294 16.854 4.5 14.611 4.5 12v-.75h15V12c0 2.612-2.794 4.855-5.039 6.656" /></Svg>;
export { SolidAcorn as ReactComponent };
