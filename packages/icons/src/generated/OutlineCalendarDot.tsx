import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineCalendarDot = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M19.5 3.75h-2.25V3a.751.751 0 0 0-1.5 0v.75h-7.5V3a.751.751 0 0 0-1.5 0v.75H4.5c-.398 0-.779.16-1.061.44S3 4.85 3 5.25v15c0 .4.158.78.439 1.06s.663.44 1.061.44h15c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06v-15c0-.4-.158-.78-.439-1.06a1.5 1.5 0 0 0-1.061-.44M6.75 5.25V6a.751.751 0 0 0 1.5 0v-.75h7.5V6a.751.751 0 0 0 1.5 0v-.75h2.25v3h-15v-3zm12.75 15h-15V9.75h15zm-6-5.25c0 .29-.088.58-.253.83s-.399.44-.673.55c-.274.12-.576.15-.867.09s-.558-.2-.768-.41a1.52 1.52 0 0 1-.325-1.64c.114-.27.306-.5.553-.67a1.508 1.508 0 0 1 1.894.19c.281.28.439.66.439 1.06" /></Svg>;
export { OutlineCalendarDot as ReactComponent };
