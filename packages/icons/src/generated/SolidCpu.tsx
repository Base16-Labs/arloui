import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidCpu = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M9.75 9.75h4.5v4.5h-4.5zm12.75 4.5a.751.751 0 0 1-.75.75h-1.5v3.75c0 .4-.158.78-.439 1.06s-.663.44-1.061.44H15v1.5a.751.751 0 0 1-1.5 0v-1.5h-3v1.5a.751.751 0 0 1-1.5 0v-1.5H5.25c-.398 0-.78-.16-1.06-.44-.282-.28-.44-.66-.44-1.06V15h-1.5a.753.753 0 0 1-.75-.75.753.753 0 0 1 .75-.75h1.5v-3h-1.5a.753.753 0 0 1-.75-.75.753.753 0 0 1 .75-.75h1.5V5.25a1.506 1.506 0 0 1 1.5-1.5H9v-1.5a.751.751 0 0 1 1.5 0v1.5h3v-1.5a.751.751 0 0 1 1.5 0v1.5h3.75c.398 0 .779.16 1.061.44s.439.66.439 1.06V9h1.5a.751.751 0 0 1 0 1.5h-1.5v3h1.5a.75.75 0 0 1 .75.75M15.75 9a.751.751 0 0 0-.75-.75H9a.75.75 0 0 0-.75.75v6a.751.751 0 0 0 .75.75h6a.75.75 0 0 0 .75-.75z" /></Svg>;
export { SolidCpu as ReactComponent };
export { SolidCpu };
export default SolidCpu;
