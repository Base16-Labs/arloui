import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidMapPinPlus = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M12 1.5c-2.188 0-4.285.87-5.831 2.42A8.24 8.24 0 0 0 3.75 9.75c0 2.94 1.36 6.06 3.937 9.02a23.7 23.7 0 0 0 3.886 3.59.74.74 0 0 0 .43.14c.154 0 .305-.05.431-.14a23.7 23.7 0 0 0 3.878-3.59c2.574-2.96 3.938-6.08 3.938-9.02a8.25 8.25 0 0 0-2.419-5.83A8.24 8.24 0 0 0 12 1.5m3 9h-2.25v2.25a.753.753 0 0 1-1.281.53.75.75 0 0 1-.219-.53V10.5H9a.748.748 0 0 1-.531-1.28A.76.76 0 0 1 9 9h2.25V6.75a.748.748 0 0 1 1.28-.53c.141.14.22.33.22.53V9H15a.753.753 0 0 1 .75.75.753.753 0 0 1-.75.75" /></Svg>;
export { SolidMapPinPlus as ReactComponent };
