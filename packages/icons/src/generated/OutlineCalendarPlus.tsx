import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineCalendarPlus = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M19.5 3.75h-2.25V3a.751.751 0 0 0-1.5 0v.75h-7.5V3a.751.751 0 0 0-1.5 0v.75H4.5c-.398 0-.779.16-1.061.44S3 4.85 3 5.25v15c0 .4.158.78.439 1.06s.663.44 1.061.44h15c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06v-15c0-.4-.158-.78-.439-1.06a1.5 1.5 0 0 0-1.061-.44M6.75 5.25V6a.751.751 0 0 0 1.5 0v-.75h7.5V6a.751.751 0 0 0 1.5 0v-.75h2.25v3h-15v-3zm12.75 15h-15V9.75h15zM15 15a.751.751 0 0 1-.75.75h-1.5v1.5a.751.751 0 0 1-1.5 0v-1.5h-1.5a.751.751 0 0 1 0-1.5h1.5v-1.5a.751.751 0 0 1 1.5 0v1.5h1.5A.75.75 0 0 1 15 15" /></Svg>;
export { OutlineCalendarPlus as ReactComponent };
