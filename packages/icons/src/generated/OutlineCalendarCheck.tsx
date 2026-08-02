import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineCalendarCheck = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M19.5 3.75h-2.25V3a.751.751 0 0 0-1.5 0v.75h-7.5V3a.751.751 0 0 0-1.5 0v.75H4.5c-.398 0-.779.16-1.061.44S3 4.85 3 5.25v15c0 .4.158.78.439 1.06s.663.44 1.061.44h15c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06v-15c0-.4-.158-.78-.439-1.06a1.5 1.5 0 0 0-1.061-.44M6.75 5.25V6a.751.751 0 0 0 1.5 0v-.75h7.5V6a.751.751 0 0 0 1.5 0v-.75h2.25v3h-15v-3zm12.75 15h-15V9.75h15zm-3.594-8.03a.75.75 0 0 1 .22.53c0 .1-.02.19-.058.28a.7.7 0 0 1-.162.25l-4.5 4.5a.78.78 0 0 1-.531.22.782.782 0 0 1-.531-.22l-2.25-2.25a.75.75 0 0 1 0-1.06.755.755 0 0 1 1.062 0l1.719 1.72 3.969-3.97c.07-.07.153-.13.244-.17a1 1 0 0 1 .287-.05 1 1 0 0 1 .287.05c.091.04.174.1.244.17" /></Svg>;
export { OutlineCalendarCheck as ReactComponent };
export { OutlineCalendarCheck };
export default OutlineCalendarCheck;
