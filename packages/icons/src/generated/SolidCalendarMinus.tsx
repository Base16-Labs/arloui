import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidCalendarMinus = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M19.5 3.75h-2.25V3a.751.751 0 0 0-1.5 0v.75h-7.5V3a.751.751 0 0 0-1.5 0v.75H4.5c-.398 0-.779.16-1.061.44S3 4.85 3 5.25v15c0 .4.158.78.439 1.06s.663.44 1.061.44h15c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06v-15c0-.4-.158-.78-.439-1.06a1.5 1.5 0 0 0-1.061-.44m-5.25 12h-4.5a.751.751 0 0 1 0-1.5h4.5a.751.751 0 0 1 0 1.5m5.25-7.5h-15v-3h2.25V6a.751.751 0 0 0 1.5 0v-.75h7.5V6a.751.751 0 0 0 1.5 0v-.75h2.25z" /></Svg>;
export { SolidCalendarMinus as ReactComponent };
